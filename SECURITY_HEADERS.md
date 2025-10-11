# Security Headers Configuration

This document defines the recommended security headers for the Neuropul AI platform in production environments.

## Content Security Policy (CSP)

**Critical:** Prevents XSS attacks by controlling which resources can be loaded.

```
Content-Security-Policy:
  default-src 'none';
  base-uri 'self';
  connect-src 'self' https://*.supabase.co wss://*.supabase.co;
  font-src 'self' data:;
  img-src 'self' data: https:;
  script-src 'self' 'nonce-{{NONCE}}' 'strict-dynamic';
  style-src 'self' 'unsafe-inline';
  frame-ancestors 'self' https://web.telegram.org;
  form-action 'self';
  upgrade-insecure-requests;
```

### CSP Directives Explained

- `default-src 'none'` - Deny all by default (principle of least privilege)
- `connect-src` - Allow API calls to Supabase and self
- `script-src` - Use nonce-based CSP with strict-dynamic for inline scripts
- `style-src` - Allow self and inline styles (Tailwind requirement)
- `frame-ancestors` - Allow embedding in Telegram WebApp

## Cross-Origin Headers

**Isolation:** Protects against Spectre-like attacks and unauthorized embedding.

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Resource-Policy: same-origin
```

## Additional Security Headers

```
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Permissions-Policy: geolocation=(), microphone=(), camera=()
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

## Implementation

### For Vercel Deployment

Add to `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'none'; base-uri 'self'; connect-src 'self' https://*.supabase.co wss://*.supabase.co; font-src 'self' data:; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; frame-ancestors 'self' https://web.telegram.org; form-action 'self';"
        },
        {
          "key": "Cross-Origin-Opener-Policy",
          "value": "same-origin"
        },
        {
          "key": "Cross-Origin-Resource-Policy",
          "value": "same-origin"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=63072000; includeSubDomains; preload"
        }
      ]
    }
  ]
}
```

### For Supabase Edge Functions

Add CORS headers to all function responses:

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};
```

## Testing

Verify security headers using:

1. **securityheaders.com** - Automated header scanning
2. **Mozilla Observatory** - Comprehensive security analysis
3. **Chrome DevTools** - Network tab → Response Headers
4. **OWASP ZAP** - Automated security testing

## Notes

- CSP nonces must be generated per-request in production
- Adjust `connect-src` if using additional third-party APIs
- Review and update quarterly as security best practices evolve
- Test thoroughly in staging before applying to production

## References

- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [Content Security Policy Reference](https://content-security-policy.com/)
