export type Handler = (req: Request) => Promise<Response>;

const cache = new Map<string, number>();

const CACHE_TTL_MS = 15 * 60 * 1000;

export function withIdempotency(handler: Handler): Handler {
  return async (req: Request) => {
    const idempotencyKey = req.headers.get("x-idempotency-key");

    if (idempotencyKey) {
      const cached = cache.get(idempotencyKey);
      const now = Date.now();

      if (cached && now - cached < CACHE_TTL_MS) {
        return new Response(
          JSON.stringify({ ok: true, duplicate: true, cached_at: cached }),
          {
            status: 200,
            headers: { "content-type": "application/json" },
          }
        );
      }

      cache.set(idempotencyKey, now);

      if (cache.size > 10000) {
        const cutoff = now - CACHE_TTL_MS;
        for (const [key, timestamp] of cache.entries()) {
          if (timestamp < cutoff) {
            cache.delete(key);
          }
        }
      }
    }

    return handler(req);
  };
}
