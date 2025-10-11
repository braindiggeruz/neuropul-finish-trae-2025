# 🔒 NEUROPUL AI — SECURITY AUDIT

**Audit Date:** 2025-10-11
**Scope:** Infrastructure configuration (code audit not possible - no source exists)
**Methodology:** STRIDE threat modeling, OWASP Top 10 checklist, config review
**Auditor:** Principal Software Architect

---

## 🚨 EXECUTIVE SUMMARY

**Overall Security Posture:** 🔴 **RED — Not Assessable (No Runtime Code)**

**Critical Findings:**
1. ❌ Real Supabase credentials exposed in `.env` (should be `.env.local`)
2. ❌ No RLS policies (database schema not implemented)
3. ❌ No input validation (application code missing)
4. ❌ No auth flows (code missing)
5. ✅ Security headers configured correctly (CSP, HSTS, X-Frame-Options)

**Immediate Risk:** If `.env` is pushed to public git repo, Supabase project is compromised.

---

## 1. THREAT MODEL (STRIDE)

### 1.1 Spoofing Identity

**Threat:** Attacker impersonates legitimate user

| Attack Vector | Current State | Risk | Mitigation Required |
|---------------|---------------|------|---------------------|
| Telegram WebApp initData forgery | ❌ No validation code | 🔴 CRITICAL | Implement server-side signature verification |
| Session hijacking | ❌ No session handling | 🔴 HIGH | Use httpOnly cookies, short-lived JWTs |
| JWT manipulation | ❌ No JWT validation | 🔴 HIGH | Verify JWT signature with Supabase auth |

**Status:** Cannot assess (auth code missing)

---

### 1.2 Tampering with Data

**Threat:** Attacker modifies data they shouldn't access

| Attack Vector | Current State | Risk | Mitigation Required |
|---------------|---------------|------|---------------------|
| XP inflation (client-side) | ❌ No XP logic | 🔴 CRITICAL | XP updates ONLY via server-side functions |
| Mission completion fraud | ❌ No mission logic | 🔴 HIGH | Validate on backend, RLS on `missions` table |
| Payment amount manipulation | ❌ No payment code | 🔴 CRITICAL | Server-side amount validation, webhook verification |
| Profile archetype change | ❌ No profile code | 🟡 MEDIUM | RLS policy: user can only UPDATE non-critical fields |

**Status:** Cannot assess (no backend logic)

---

### 1.3 Repudiation

**Threat:** User denies performing action (audit trail gaps)

| Item | Current State | Risk | Mitigation Required |
|------|---------------|------|---------------------|
| Payment transaction log | ✅ Table spec exists in README | 🟢 LOW | Implement `payments_tx` with immutable audit trail |
| User action logs | ❌ No logging | 🟡 MEDIUM | Add `audit_log` table for sensitive actions |
| Edge function logs | ❌ No functions | 🟡 MEDIUM | Structured logging in all edge functions |

**Status:** Spec exists, not implemented

---

### 1.4 Information Disclosure

**Threat:** Sensitive data exposed to unauthorized parties

| Attack Vector | Current State | Risk | Mitigation Required |
|---------------|---------------|------|---------------------|
| **CRITICAL:** `.env` file with real credentials | ⚠️ EXPOSED | 🔴 CRITICAL | Move to `.env.local`, add to `.gitignore` |
| RLS bypass (no policies) | ❌ No policies | 🔴 CRITICAL | 100% RLS coverage on user tables |
| Error messages leaking data | ❌ No error handling | 🟡 MEDIUM | Generic errors to client, detailed logs to Sentry |
| API response oversharing | ❌ No API | 🟡 MEDIUM | Use `.select('id, username')` (explicit fields) |
| Source maps in production | ⚠️ Config: `sourcemap: false` | ✅ GOOD | Maintain this setting |

**IMMEDIATE ACTION REQUIRED:**
```bash
# DO THIS NOW
mv .env .env.production.backup
echo ".env.local" >> .gitignore
# Never commit .env.local
```

---

### 1.5 Denial of Service

**Threat:** Attacker overwhelms system resources

| Attack Vector | Current State | Risk | Mitigation Required |
|---------------|---------------|------|---------------------|
| Rate limiting (API) | ❌ No implementation | 🔴 HIGH | Supabase rate limits + Cloudflare |
| Rate limiting (edge functions) | ❌ No functions | 🔴 HIGH | Implement token bucket or leaky bucket |
| Payment spam | ❌ No payment code | 🔴 HIGH | Captcha, Stripe fraud detection |
| AI coach token exhaustion | ❌ No AI code | 🟡 MEDIUM | Per-user quota (e.g., 100 msgs/day) |
| Database connection pool exhaustion | ⚠️ Supabase managed | 🟢 LOW | Supabase handles connection pooling |

**Status:** No protection currently

---

### 1.6 Elevation of Privilege

**Threat:** User gains unauthorized access levels

| Attack Vector | Current State | Risk | Mitigation Required |
|---------------|---------------|------|---------------------|
| Premium bypass (client-side check) | ❌ No premium logic | 🔴 CRITICAL | Server-side `premium_until` check in ALL premium endpoints |
| Admin role injection | ❌ No role system | 🟡 MEDIUM | Use Supabase auth JWT claims, RLS checks `auth.jwt() ->> 'role'` |
| RLS policy gaps | ❌ No policies | 🔴 CRITICAL | Audit every table, default-deny |
| SQL injection | ❌ No raw queries visible | 🟢 LOW | Use Supabase client (parameterized), NEVER string concat SQL |

**Status:** High risk when code is implemented

---

## 2. OWASP TOP 10 (2021) ASSESSMENT

### A01:2021 – Broken Access Control

**Risk:** 🔴 **CRITICAL**

| Issue | Status | Mitigation |
|-------|--------|------------|
| No RLS policies | ❌ | Enable RLS on ALL user tables |
| No server-side authz checks | ❌ | Every edge function MUST verify `auth.uid()` |
| Client-side premium checks | ❌ (assumed) | Backend validation ONLY |

**Current State:** 0% implemented

---

### A02:2021 – Cryptographic Failures

**Risk:** 🔴 **HIGH**

| Issue | Status | Mitigation |
|-------|--------|------------|
| Secrets in `.env` (not `.env.local`) | ⚠️ EXPOSED | Move immediately |
| HTTPS enforcement | ✅ HSTS configured | Maintain |
| Password hashing | N/A | Delegated to Supabase Auth |
| Payment data exposure | ❌ No code | Use Stripe Elements (PCI scope reduction) |

**Current State:** Config good, but secrets exposed

---

### A03:2021 – Injection

**Risk:** 🟡 **MEDIUM** (if raw SQL used)

| Issue | Status | Mitigation |
|-------|--------|------------|
| SQL injection | ✅ (Supabase client) | Continue using parameterized queries |
| XSS via AI responses | ❌ No code | Sanitize ALL AI outputs (DOMPurify) |
| Command injection (edge functions) | ❌ No functions | Never use `exec()`, validate all inputs |

**Current State:** Low risk if Supabase client used correctly

---

### A04:2021 – Insecure Design

**Risk:** 🟡 **MEDIUM**

| Issue | Status | Mitigation |
|-------|--------|------------|
| No idempotency (payments) | ❌ | Use `client_request_id` (spec exists) |
| No retry logic (edge functions) | ❌ | Exponential backoff, max retries |
| Race conditions (XP updates) | ❌ | Use DB transactions, optimistic locking |

**Current State:** Design patterns documented in README, not implemented

---

### A05:2021 – Security Misconfiguration

**Risk:** 🟡 **MEDIUM**

| Issue | Status | Mitigation |
|-------|--------|------------|
| **CSP too permissive** | ⚠️ `unsafe-inline` in style-src | Remove if possible, use hashes |
| **CSP** allows eval in Vercel | ⚠️ `unsafe-eval` in script-src | Verify necessity, remove if possible |
| CORS too broad | ❌ No CORS code | Restrict origins in edge functions |
| Error stack traces in prod | ❌ No code | Sentry in prod, no stack to client |
| Default Supabase secrets | ❌ Secrets visible | Rotate service_role_key regularly |

**CSP Analysis (index.html lines 9-20):**

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://telegram.org https://*.supabase.co;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https: blob:;
  font-src 'self' data:;
  connect-src 'self' https://*.supabase.co https://api.telegram.org wss://*.supabase.co;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
" />
```

**Issues:**
- ⚠️ `script-src 'unsafe-inline'` — allows inline scripts (XSS risk)
- ⚠️ `style-src 'unsafe-inline'` — allows inline styles (lower risk)
- ⚠️ `img-src https:` — too broad (any HTTPS image)

**Recommendations:**
1. Remove `'unsafe-inline'` from `script-src` (use `<script type="module">`)
2. Use CSP nonces or hashes for required inline scripts
3. Tighten `img-src` to specific domains (or keep as-is for external images)

**Vercel CSP (vercel.json lines 24):**

```json
"value": "default-src 'self' https:; script-src 'self' 'unsafe-eval'; ..."
```

⚠️ `'unsafe-eval'` present — needed for Vite dev mode, remove in production

---

### A06:2021 – Vulnerable and Outdated Components

**Risk:** 🟢 **LOW**

| Dependency | Version | Latest | Status |
|------------|---------|--------|--------|
| react | 18.2.0 | 18.3.x | ⚠️ Minor update available |
| vite | 4.5.0 | 5.x | ⚠️ Major update available |
| @supabase/supabase-js | 2.38.4 | 2.39+ | ✅ Recent |
| typescript | 5.2.2 | 5.7+ | ⚠️ Minor update available |

**Action:** Run `npm audit` regularly, update deps quarterly

---

### A07:2021 – Identification and Authentication Failures

**Risk:** 🔴 **CRITICAL**

| Issue | Status | Mitigation |
|-------|--------|------------|
| No auth flow | ❌ | Implement Telegram WebApp auth with server-side verification |
| No session management | ❌ | Use Supabase Auth (JWT + refresh tokens) |
| No MFA | 🟡 Optional | Consider for premium users |
| No brute-force protection | ❌ | Rate limit login attempts |

**Current State:** 0% implemented

---

### A08:2021 – Software and Data Integrity Failures

**Risk:** 🟡 **MEDIUM**

| Issue | Status | Mitigation |
|-------|--------|------------|
| No SRI for external scripts | ⚠️ telegram.org script | Add `integrity` attribute |
| No CI/CD signature verification | ❌ No CI | Sign releases, verify in deploy |
| No dependency lockfile | ⚠️ Missing package-lock.json | Generate with `npm install` |

**Telegram Script (index.html line 29):**

```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>
```

**Recommendation:** Add SRI hash:
```html
<script src="https://telegram.org/js/telegram-web-app.js"
        integrity="sha384-..."
        crossorigin="anonymous"></script>
```

---

### A09:2021 – Security Logging and Monitoring Failures

**Risk:** 🔴 **HIGH**

| Issue | Status | Mitigation |
|-------|--------|------------|
| No structured logging | ❌ | Implement in all edge functions |
| No error monitoring | ⚠️ Sentry configured | Integrate Sentry SDK |
| No alerting | ❌ | Set up PagerDuty/OpsGenie for critical errors |
| No anomaly detection | ❌ | Monitor failed payment webhooks, XP spikes |

**Current State:** Infrastructure ready (Sentry DSN in .env.local.example), not integrated

---

### A10:2021 – Server-Side Request Forgery (SSRF)

**Risk:** 🟡 **MEDIUM**

| Issue | Status | Mitigation |
|-------|--------|------------|
| Edge functions fetch user URLs | ❌ Unknown (no code) | Validate all URLs, whitelist domains |
| AI coach with URL injection | ❌ No code | Sanitize user input before AI prompts |

**Current State:** Low risk if no user-provided URLs processed

---

## 3. RLS POLICY COVERAGE

**Current Coverage:** ❌ **0%** (no schema deployed)

**Required Policies (per spec):**

### profiles table
- ✅ Spec exists in README
- ❌ Not implemented
- **Required:**
  - `SELECT`: `auth.uid() = id`
  - `UPDATE`: `auth.uid() = id` + restrict `xp`, `level`, `premium_until` (server-only fields)
  - `INSERT`: Handled by Supabase Auth trigger
  - `DELETE`: Deny (soft delete instead)

### missions table
- ✅ Spec exists
- ❌ Not implemented
- **Required:**
  - `SELECT`: `auth.uid() = user_id`
  - `INSERT`: `auth.uid() = user_id`
  - `UPDATE`: `auth.uid() = user_id` + only allow `status` change
  - `DELETE`: `auth.uid() = user_id`

### payments_tx table
- ✅ Spec exists
- ❌ Not implemented
- **Required:**
  - `SELECT`: `auth.uid() = user_id`
  - `INSERT`: DENY (only edge functions via service_role_key)
  - `UPDATE`: DENY (immutable audit log)
  - `DELETE`: DENY

### config table
- ✅ Spec exists
- ❌ Not implemented
- **Required:**
  - `SELECT`: `true` (public read)
  - `UPDATE`: `auth.jwt() ->> 'role' = 'admin'`
  - `INSERT`: Admin only
  - `DELETE`: Admin only

### coach_interactions table
- ✅ Spec exists
- ❌ Not implemented
- **Required:**
  - `SELECT`: `auth.uid() = user_id`
  - `INSERT`: `auth.uid() = user_id`
  - `UPDATE`: DENY (immutable)
  - `DELETE`: `auth.uid() = user_id` (user can delete history)

**Audit Checklist:**
- [ ] Enable RLS on ALL tables
- [ ] Test policies with test users (cannot access other user data)
- [ ] Test with anonymous user (cannot access protected data)
- [ ] Test admin bypass (service_role_key bypasses RLS)

---

## 4. PAYMENT SECURITY

**Provider:** Stripe, PayPal, Telegram Stars (multi-provider)

### 4.1 Stripe

**PCI Compliance:** ✅ Stripe Elements handles card data (out of PCI scope)

| Security Control | Status | Required Action |
|------------------|--------|-----------------|
| Webhook signature verification | ❌ | `stripe.webhooks.constructEvent(payload, sig, secret)` |
| Idempotent webhook handling | ❌ | Check `provider_tx_id` before insert |
| Test/prod key separation | ⚠️ .env.example shows pattern | Enforce in code |
| Amount validation (server-side) | ❌ | NEVER trust client amount |
| Retry logic with exponential backoff | ❌ | Handle webhook replay |

**Critical Code (Missing):**

```ts
// REQUIRED: Verify webhook signature
const sig = req.headers['stripe-signature']
const event = stripe.webhooks.constructEvent(
  payload,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET
)

// REQUIRED: Idempotency
const { data: existing } = await supabase
  .from('payments_tx')
  .select('id')
  .eq('provider_tx_id', event.data.object.id)
  .maybeSingle()

if (existing) {
  return { status: 200 } // Already processed
}
```

---

### 4.2 PayPal

| Security Control | Status | Required Action |
|------------------|--------|-----------------|
| Webhook signature verification | ❌ | Verify `PAYPAL-TRANSMISSION-SIG` |
| Order validation | ❌ | Fetch order from PayPal API (don't trust client) |
| Test/prod separation | ⚠️ Pattern in .env.example | Enforce |

---

### 4.3 Telegram Stars

| Security Control | Status | Required Action |
|------------------|--------|-----------------|
| Bot API signature verification | ❌ | Verify Telegram secret token |
| User ID validation | ❌ | Match Telegram user ID to profile |

---

## 5. INPUT VALIDATION

**Framework:** Zod (not yet installed or used)

**Required Validation Points:**

| Input | Source | Risk | Validation Required |
|-------|--------|------|---------------------|
| Telegram initData | WebApp | 🔴 HIGH | Verify HMAC signature |
| Payment amount | Client | 🔴 CRITICAL | Server-side only, ignore client |
| User message (AI coach) | Client | 🟡 MEDIUM | Max length, no SQL, sanitize |
| Mission ID | Client | 🟡 MEDIUM | UUID format, ownership check |
| Profile updates | Client | 🟡 MEDIUM | Whitelist allowed fields |

**Recommendation:**

```ts
import { z } from 'zod'

const MessageSchema = z.object({
  message: z.string().min(1).max(5000),
  user_id: z.string().uuid(),
})

const message = MessageSchema.parse(req.body) // Throws if invalid
```

---

## 6. SECRETS MANAGEMENT

### Current State

| Secret | Location | Status | Risk |
|--------|----------|--------|------|
| Supabase URL | `.env` | ⚠️ EXPOSED | 🟡 Medium (public anyway) |
| Supabase Anon Key | `.env` | ⚠️ EXPOSED | 🟡 Medium (public, RLS protects) |
| Supabase Service Role Key | `.env.local.example` | ✅ NOT in repo | 🟢 Low |
| Stripe Secret Key | `.env.local.example` | ✅ NOT in repo | 🟢 Low |

**Critical Issue:** `.env` contains real Supabase credentials

**Fix:**
```bash
# Move to .env.local (gitignored)
mv .env .env.local

# Update .gitignore
echo ".env.local" >> .gitignore

# Verify
git status # Should NOT show .env.local
```

---

### Recommended Secrets Strategy

**Local Development:**
- `.env.local` (gitignored) — developer-specific secrets
- `.env.local.example` (committed) — template with fake values

**Production:**
- Vercel/Netlify environment variables
- Never commit production secrets

**CI/CD:**
- GitHub Secrets for test credentials

---

## 7. CORS POLICY

**Expected (Edge Functions):**

```ts
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://your-domain.com', // NOT *
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Credentials': 'true',
}
```

**Security Rules:**
1. ❌ Do NOT use `*` for `Access-Control-Allow-Origin` in production
2. ✅ Whitelist specific domains (Vercel domain, custom domain)
3. ✅ Require authentication for sensitive endpoints
4. ✅ Limit allowed methods (no DELETE on public endpoints)

---

## 8. RECOMMENDED CSP (PRODUCTION)

Replace index.html CSP with:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' https://telegram.org;
  style-src 'self' 'sha256-{hash-of-inline-styles}';
  img-src 'self' data: https://*.supabase.co https://images.pexels.com;
  font-src 'self';
  connect-src 'self' https://*.supabase.co https://api.telegram.org wss://*.supabase.co;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
" />
```

**Changes:**
- ❌ Removed `'unsafe-inline'` from script-src
- ✅ Tightened img-src to specific domains
- ✅ Added `upgrade-insecure-requests`

---

## 9. SECURITY CHECKLIST (FINAL)

Before production launch, ensure ALL items are ✅:

### Authentication & Authorization
- [ ] Telegram WebApp initData verified server-side (HMAC)
- [ ] Supabase Auth session management implemented
- [ ] JWT validation on every protected endpoint
- [ ] RLS enabled on 100% of user tables
- [ ] RLS policies tested (user cannot access other user data)
- [ ] Admin role enforcement (service_role_key or JWT claim)

### Data Protection
- [ ] All secrets in `.env.local` (NOT `.env`)
- [ ] `.env.local` in `.gitignore`
- [ ] No secrets in git history (check with `git log -p`)
- [ ] HTTPS enforced (HSTS header)
- [ ] Cookies marked `httpOnly`, `secure`, `sameSite`

### Input Validation
- [ ] Zod schemas on all API inputs
- [ ] AI responses sanitized (DOMPurify)
- [ ] SQL injection prevented (Supabase client, no raw SQL)
- [ ] XSS prevented (React escapes by default, verify no `dangerouslySetInnerHTML`)

### Payments
- [ ] Webhook signatures verified (Stripe, PayPal)
- [ ] Idempotent payment processing (`provider_tx_id` uniqueness)
- [ ] Server-side amount validation (ignore client)
- [ ] Audit trail (`payments_tx` immutable)
- [ ] Test/prod key separation enforced

### Logging & Monitoring
- [ ] Sentry integrated (error tracking)
- [ ] Structured logging in edge functions
- [ ] Alerting for critical errors (payment failures, auth failures)
- [ ] No PII in logs

### Infrastructure
- [ ] CSP hardened (no `unsafe-inline`, no `unsafe-eval`)
- [ ] CORS restricted (no `*` in production)
- [ ] Rate limiting on public endpoints
- [ ] Dependency audit (`npm audit`)
- [ ] SRI on external scripts (Telegram SDK)

### Testing
- [ ] Security test suite (try to bypass RLS, tamper with payments)
- [ ] Penetration test (automated or manual)
- [ ] OWASP ZAP scan

---

## 10. RISK REGISTER

| Risk | Likelihood | Impact | Severity | Mitigation Status |
|------|-----------|--------|----------|-------------------|
| Secrets leaked to git | High | Critical | 🔴 CRITICAL | ⚠️ IN PROGRESS (move to .env.local) |
| RLS bypass | High | Critical | 🔴 CRITICAL | ❌ NOT STARTED |
| Payment fraud | Medium | Critical | 🔴 CRITICAL | ❌ NOT STARTED |
| XSS via AI responses | Medium | High | 🟡 HIGH | ❌ NOT STARTED |
| Session hijacking | Medium | High | 🟡 HIGH | ❌ NOT STARTED |
| SSRF in edge functions | Low | High | 🟡 MEDIUM | ❌ NOT STARTED |
| Dependency vulnerability | Medium | Medium | 🟡 MEDIUM | ⚠️ ONGOING (npm audit) |

---

## 11. NEXT STEPS

### Immediate (Today)
1. Move `.env` → `.env.local`
2. Verify `.gitignore` includes `.env.local`
3. Check git history for exposed secrets (rotate if found)

### Short-term (Week 1)
1. Implement RLS policies (see Phase 2 of roadmap)
2. Add Zod validation library
3. Set up Sentry error tracking

### Medium-term (Weeks 2-4)
1. Implement payment security (webhook verification, idempotency)
2. Add rate limiting
3. Harden CSP (remove unsafe-inline)

### Long-term (Before Launch)
1. Complete security checklist (Section 9)
2. Run penetration test
3. Security review by external auditor (optional but recommended)

---

**Audit Complete**

**Overall Assessment:** 🔴 **HIGH RISK** due to missing implementation, but **GOOD FOUNDATION** (security-aware config)

**Confidence:** 100% (config review), 0% (runtime security, no code to audit)

**Next Document:** See AAA_IMPLEMENTATION_ROADMAP.md Phase 8 for hardening tasks
