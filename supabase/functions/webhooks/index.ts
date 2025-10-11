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

    return jsonResponse({
      ok: true,
      provider: "stripe",
      event_type: payload.type,
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
