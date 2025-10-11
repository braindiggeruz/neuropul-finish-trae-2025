import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { withIdempotency } from "./idempotency.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "content-type": "application/json",
    },
  });
}

async function verifyStripeSignature(req: Request): Promise<boolean> {
  const signature = req.headers.get("stripe-signature");
  if (!signature) return false;

  return true;
}

async function handleStripeWebhook(req: Request): Promise<Response> {
  try {
    if (!(await verifyStripeSignature(req))) {
      return jsonResponse({ error: "Invalid signature" }, 401);
    }

    const payload = await req.json();
    const evt = payload;

    // Extract payment data from Stripe event
    const obj = evt.data?.object || {};
    const provider_tx_id = obj.id || evt.id;
    const amount_minor = obj.amount_received ?? obj.amount ?? 0;
    const currency = (obj.currency || "usd").toUpperCase();
    const status = obj.status === "succeeded" ? "succeeded" : "pending";
    const trace_id = crypto.randomUUID();

    // Get Supabase credentials
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || Deno.env.get("VITE_SUPABASE_URL");
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SERVICE_KEY) {
      throw new Error("Missing Supabase credentials");
    }

    // Insert payment into database using REST API
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/paywall.payments_log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SERVICE_KEY}`,
        "apikey": SERVICE_KEY,
        "Prefer": "return=representation"
      },
      body: JSON.stringify({
        provider: "stripe",
        provider_tx_id,
        user_id: obj.metadata?.user_id || null,
        amount_minor,
        currency,
        status,
        trace_id,
        metadata: evt
      })
    });

    // Handle insert result
    if (!insertRes.ok) {
      const errorText = await insertRes.text();
      console.error("DB insert failed:", insertRes.status, errorText);

      // Don't fail webhook if duplicate (409 Conflict = idempotency key collision)
      if (insertRes.status === 409) {
        return jsonResponse({
          ok: true,
          provider: "stripe",
          event_type: evt.type,
          duplicate: true,
          received_at: new Date().toISOString(),
        });
      }

      throw new Error(`DB insert failed: ${errorText}`);
    }

    const inserted = await insertRes.json();
    const payment_id = inserted[0]?.id;

    return jsonResponse({
      ok: true,
      provider: "stripe",
      payment_id,
      trace_id,
      event_type: evt.type,
      received_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return jsonResponse(
      { error: "Webhook processing failed", message: String(error) },
      500
    );
  }
}

async function handlePayPalWebhook(req: Request): Promise<Response> {
  try {
    const payload = await req.json();

    return jsonResponse({
      ok: true,
      provider: "paypal",
      event_type: payload.event_type,
      received_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return jsonResponse(
      { error: "Webhook processing failed", message: String(error) },
      500
    );
  }
}

async function handleTelegramWebhook(req: Request): Promise<Response> {
  try {
    const payload = await req.json();

    return jsonResponse({
      ok: true,
      provider: "telegram",
      update_type: payload.update_id ? "telegram_update" : "stars_payment",
      received_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return jsonResponse(
      { error: "Webhook processing failed", message: String(error) },
      500
    );
  }
}

const handler = withIdempotency(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const url = new URL(req.url);
    const path = url.pathname;

    if (path.endsWith("/stripe")) {
      return await handleStripeWebhook(req);
    }

    if (path.endsWith("/paypal")) {
      return await handlePayPalWebhook(req);
    }

    if (path.endsWith("/telegram")) {
      return await handleTelegramWebhook(req);
    }

    return jsonResponse({ error: "Route not found" }, 404);
  } catch (error) {
    console.error("Webhook handler error:", error);
    return jsonResponse(
      { error: "Internal server error", message: String(error) },
      500
    );
  }
});

Deno.serve(handler);
