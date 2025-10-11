# ✅ NEUROPUL AI — ACTIONABLE TODO CHECKLIST

**Version:** 1.0
**Target:** AAA Production-Grade, 100% Ready
**Status:** 0% Complete (0/312 tasks)
**Last Updated:** 2025-10-11

> **Instructions:** Copy tasks to GitHub Issues, Linear, or Notion. Mark `[x]` when complete.

---

## 🔴 PHASE 0: UNBLOCK & FOUNDATION (2 days)

### Dependencies
- [ ] Remove `@lhci/cli` from package.json OR update to valid version (^0.13.0)
- [ ] Remove `@types/web-vitals` from package.json (or fix version)
- [ ] Run `npm install` and verify success
- [ ] Generate and commit `package-lock.json`

### Secrets Management
- [ ] Move `.env` → `.env.production.backup` (for reference only)
- [ ] Create `.env.local` with real credentials
- [ ] Add `.env.local` to `.gitignore`
- [ ] Verify `.env.local` is NOT tracked by git (`git status`)
- [ ] Update `.env.local.example` to match all required keys

### Directory Structure
- [ ] Create `/src` directory
- [ ] Create `/src/components/ui` directory
- [ ] Create `/src/components/layout` directory
- [ ] Create `/src/components/features` directory
- [ ] Create `/src/pages` directory
- [ ] Create `/src/lib/supabase` directory
- [ ] Create `/src/lib/telegram` directory
- [ ] Create `/src/lib/payments` directory
- [ ] Create `/src/lib/ai` directory
- [ ] Create `/src/hooks` directory
- [ ] Create `/src/utils` directory
- [ ] Create `/src/types` directory
- [ ] Create `/src/constants` directory
- [ ] Create `/src/stores` directory
- [ ] Create `/supabase/migrations` directory
- [ ] Create `/supabase/seed` directory
- [ ] Create `/supabase/functions` directory
- [ ] Create `/tests/unit` directory
- [ ] Create `/tests/e2e` directory
- [ ] Create `/tests/a11y` directory
- [ ] Create `/scripts` directory
- [ ] Create `/public/icons` directory

### Minimal Entry Point
- [ ] Create `src/main.tsx` with React 18 createRoot
- [ ] Create `src/App.tsx` with basic layout
- [ ] Run `npm run dev` and verify app starts
- [ ] Run `npm run build` and verify success

### Configuration Files
- [ ] Create `.eslintrc.js` with TypeScript + React rules
- [ ] Create `.prettierrc` with consistent formatting
- [ ] Create `.size-limit.json` with bundle budget (400KB main)
- [ ] Create `playwright.config.ts` for E2E tests
- [ ] Create `.lighthouserc.js` for performance testing (optional if keeping LHCI)

---

## 🟡 PHASE 1: CORE APPLICATION SHELL (3 weeks)

### React Bootstrap (Week 1, Days 1-2)
- [ ] Install Zustand: `npm i zustand`
- [ ] Create `src/stores/authStore.ts` with auth state interface
- [ ] Create `src/stores/profileStore.ts` with profile state interface
- [ ] Create `src/stores/uiStore.ts` with UI state (theme, modals, toasts)
- [ ] Create `src/routes.tsx` with React Router v6 routes
- [ ] Create `src/components/layout/Shell.tsx` (responsive container)
- [ ] Create `src/components/layout/Header.tsx` (nav, conditional on auth)
- [ ] Create `src/components/layout/Footer.tsx`
- [ ] Wire up router in `App.tsx`
- [ ] Test navigation between routes

### UI Component Library (Week 1, Days 3-5)
- [ ] Create `src/components/ui/Button.tsx` (variants: primary, secondary, ghost)
- [ ] Create `src/components/ui/Card.tsx`
- [ ] Create `src/components/ui/Dialog.tsx` (Radix Dialog wrapper)
- [ ] Create `src/components/ui/Tabs.tsx` (Radix Tabs wrapper)
- [ ] Create `src/components/ui/Input.tsx`
- [ ] Create `src/components/ui/Toast.tsx` (or InlineToast as per spec)
- [ ] Create `src/utils/cn.ts` (clsx + tailwind-merge helper)
- [ ] Test all components in isolation

### Feature Pages (Week 2)
- [ ] Create `src/pages/Landing.tsx` (hero, CTA, features)
- [ ] Create `src/pages/Quiz.tsx` (multi-step archetype quiz)
- [ ] Create `src/components/features/QuizStep.tsx`
- [ ] Create `src/components/features/ProgressIndicator.tsx`
- [ ] Create `src/pages/Coach.tsx` (chat UI skeleton)
- [ ] Create `src/components/features/ChatMessage.tsx`
- [ ] Create `src/components/features/ChatInput.tsx`
- [ ] Create `src/pages/Premium.tsx` (paywall modal/page)
- [ ] Create `src/components/features/PricingCard.tsx`
- [ ] Create `src/pages/Dashboard.tsx` (profile, XP, missions)
- [ ] Wire up navigation: Landing → Quiz → Coach → Premium
- [ ] Test full flow manually

### State Management (Week 3)
- [ ] Implement auth store methods: `signIn`, `signOut`, `setUser`
- [ ] Implement profile store methods: `fetchProfile`, `updateProfile`
- [ ] Create `src/stores/missionStore.ts` with mission state
- [ ] Implement mission store methods: `fetchMissions`, `completeMission`
- [ ] Persist auth state to localStorage
- [ ] Add loading and error states to all stores
- [ ] Test state persistence across route changes

---

## 🟡 PHASE 2: DATABASE & SUPABASE (3 weeks)

### Core Schema (Week 4, Days 1-3)
- [ ] Create `supabase/migrations/001_init_schema.sql`
- [ ] Add profiles table with RLS
- [ ] Add missions table with RLS
- [ ] Add payments_tx table with RLS
- [ ] Add config table with RLS
- [ ] Add coach_interactions table with RLS
- [ ] Add indexes on foreign keys and frequently queried columns
- [ ] Create `award_xp` function for XP updates
- [ ] Apply migration: `supabase db push` (or via dashboard)
- [ ] Verify tables exist: `supabase db remote list` or psql

### RLS Policies (Week 4, Day 4)
- [ ] Add SELECT policy on profiles: `auth.uid() = id`
- [ ] Add UPDATE policy on profiles: `auth.uid() = id` (restrict server-only fields)
- [ ] Add SELECT policy on missions: `auth.uid() = user_id`
- [ ] Add INSERT policy on missions: `auth.uid() = user_id`
- [ ] Add UPDATE policy on missions: `auth.uid() = user_id`
- [ ] Add DELETE policy on missions: `auth.uid() = user_id`
- [ ] Add SELECT policy on payments_tx: `auth.uid() = user_id`
- [ ] Deny INSERT/UPDATE/DELETE on payments_tx (edge functions only)
- [ ] Add SELECT policy on config: public read
- [ ] Add UPDATE policy on config: admin only
- [ ] Add SELECT policy on coach_interactions: `auth.uid() = user_id`
- [ ] Add INSERT policy on coach_interactions: `auth.uid() = user_id`
- [ ] Test policies with test users (verify isolation)

### Seed Data (Week 4, Day 5)
- [ ] Create `supabase/seed/001_initial_data.sql`
- [ ] Insert feature flags into config table
- [ ] Insert test user profile (for local dev)
- [ ] Insert test mission
- [ ] Apply seed: `supabase db seed`
- [ ] Verify seed data: `SELECT * FROM config;`

### Supabase Client Setup (Week 5, Days 1-2)
- [ ] Create `src/lib/supabase/client.ts`
- [ ] Add error handling for missing env vars
- [ ] Generate TypeScript types: `supabase gen types typescript > src/lib/supabase/types.ts`
- [ ] Create `src/lib/supabase/queries.ts` (helper functions)
- [ ] Test connection: `supabase.from('profiles').select('*')`

### Auth Integration (Week 5, Days 3-5)
- [ ] Create `src/lib/telegram/auth.ts`
- [ ] Implement `authenticateWithTelegram(initData)`
- [ ] Implement `getTelegramUser()`
- [ ] Create `src/lib/telegram/mockWebApp.ts` (from README spec)
- [ ] Add mock mode toggle via `VITE_TG_WEBAPP_MOCK` env var
- [ ] Update auth store to use real Supabase session
- [ ] Add auth state listener: `supabase.auth.onAuthStateChange`
- [ ] Implement sign-out flow
- [ ] Test auth flow: Telegram → Supabase → session persists

### Edge Functions (Week 6)
- [ ] Create `supabase/functions/auto-experiment/index.ts`
- [ ] Add CORS headers to auto-experiment
- [ ] Implement idempotency check (client_request_id)
- [ ] Implement experiment variant logic (A/B)
- [ ] Deploy: `supabase functions deploy auto-experiment`
- [ ] Test: `curl -X POST http://localhost:54321/functions/v1/auto-experiment`
- [ ] Create `supabase/functions/trae-train/index.ts`
- [ ] Add CORS headers to trae-train
- [ ] Fetch user profile for context
- [ ] Implement mock AI response
- [ ] Store interaction in coach_interactions
- [ ] Deploy: `supabase functions deploy trae-train`
- [ ] Test: `curl -X POST http://localhost:54321/functions/v1/trae-train`

---

## 🟡 PHASE 3: PAYMENTS INTEGRATION (3 weeks)

### Stripe Integration (Week 7)
- [ ] Install Stripe SDK: `npm i @stripe/stripe-js stripe`
- [ ] Create `src/lib/payments/stripe.ts`
- [ ] Implement `createPaymentIntent(amount, currency)`
- [ ] Implement `confirmPayment(clientSecret)`
- [ ] Create `supabase/functions/stripe-webhook/index.ts`
- [ ] Add CORS headers to stripe-webhook
- [ ] Implement webhook signature verification
- [ ] Handle `payment_intent.succeeded` event
- [ ] Implement idempotency (check provider_tx_id)
- [ ] Update payments_tx table
- [ ] Update profile.premium_until
- [ ] Deploy: `supabase functions deploy stripe-webhook`
- [ ] Add Stripe Elements to Premium page
- [ ] Test with Stripe test cards (4242 4242 4242 4242)
- [ ] Configure Stripe webhook endpoint in Stripe Dashboard

### PayPal Integration (Week 8, Days 1-2)
- [ ] Install PayPal SDK: `npm i @paypal/react-paypal-js`
- [ ] Create `src/lib/payments/paypal.ts`
- [ ] Implement `createOrder(amount, currency)`
- [ ] Implement `captureOrder(orderID)`
- [ ] Create `supabase/functions/paypal-webhook/index.ts`
- [ ] Add CORS headers to paypal-webhook
- [ ] Implement webhook signature verification
- [ ] Handle payment capture event
- [ ] Update payments_tx and profile
- [ ] Deploy: `supabase functions deploy paypal-webhook`
- [ ] Add PayPal button to Premium page
- [ ] Test with PayPal sandbox account

### Telegram Stars (Week 8, Days 3-5)
- [ ] Create `src/lib/payments/telegramStars.ts`
- [ ] Implement `createInvoice(amount, description)`
- [ ] Implement `initiatePayment(amount, description, userId)`
- [ ] Create `supabase/functions/telegram-stars-webhook/index.ts`
- [ ] Add CORS headers
- [ ] Verify Telegram bot secret token
- [ ] Handle successful payment event
- [ ] Update payments_tx and profile
- [ ] Deploy: `supabase functions deploy telegram-stars-webhook`
- [ ] Add Stars button to Premium page (Telegram WebApp only)
- [ ] Test in Telegram test environment

### Payment Security Hardening (Week 9)
- [ ] Add Zod schemas for all payment inputs
- [ ] Implement client_request_id generation and validation
- [ ] Add exponential backoff for webhook retries
- [ ] Test duplicate webhook handling (idempotency)
- [ ] Test out-of-order webhook events
- [ ] Test refund flow (Stripe, PayPal)
- [ ] Add server-side amount validation (ignore client)
- [ ] Create admin dashboard view for payments_tx
- [ ] Add payment reconciliation script
- [ ] Document payment security in `/docs/PAYMENTS.md`

---

## 🟡 PHASE 4: AI COACH & ARCHETYPES (2 weeks)

### OpenAI Integration (Week 10, Days 1-2)
- [ ] Choose AI provider (OpenAI, Anthropic Claude, or other)
- [ ] Install SDK: `npm i openai` (or equivalent)
- [ ] Store API key in Supabase secrets
- [ ] Update `trae-train` edge function to call AI API
- [ ] Implement context window (last N interactions)
- [ ] Add error handling and retry logic

### Archetype Prompts (Week 10, Days 3-5)
- [ ] Create `src/constants/archetypes.ts` with archetype definitions
- [ ] Create prompt template for PROMPT_RONIN (direct, action-oriented)
- [ ] Create prompt template for CREATIVE_REBEL (playful, boundary-pushing)
- [ ] Create prompt template for SYSTEMATIC_BUILDER (structured, methodical)
- [ ] Create prompt template for EMPATHIC_CONNECTOR (supportive, relational)
- [ ] Implement archetype-specific system prompts
- [ ] Test each archetype with user personas
- [ ] Refine prompts based on quality

### Coach UI Enhancements (Week 11)
- [ ] Add streaming responses (Server-Sent Events)
- [ ] Add typing indicator animation
- [ ] Add markdown rendering for AI responses (react-markdown)
- [ ] Sanitize AI outputs (DOMPurify)
- [ ] Add message history scroll (auto-scroll to bottom)
- [ ] Add "New conversation" button
- [ ] Store conversation history locally (IndexedDB or localStorage)
- [ ] Add export conversation feature
- [ ] Test AI coach flow end-to-end

---

## 🟡 PHASE 5: XP, LEVELS, MISSIONS (1 week)

### XP System (Week 12, Days 1-2)
- [ ] Refine `award_xp` DB function with level-up logic
- [ ] Add XP constants (XP per level, max level)
- [ ] Create `src/utils/xp.ts` with client-side XP calculations
- [ ] Add level-up trigger in database
- [ ] Add level-up toast notification

### Missions (Week 12, Days 3-4)
- [ ] Create mission templates (daily, weekly, premium)
- [ ] Add missions table seed data
- [ ] Create `src/components/features/MissionCard.tsx`
- [ ] Create `src/components/features/MissionList.tsx`
- [ ] Add mission completion flow (client → DB → XP award)
- [ ] Add mission completion animation

### Achievements & Badges (Week 12, Day 5)
- [ ] Create achievements table + RLS policies
- [ ] Create badges table + RLS policies
- [ ] Seed achievement definitions
- [ ] Create `src/components/features/BadgeDisplay.tsx`
- [ ] Add achievement unlock logic
- [ ] Add badge display on profile

### Dashboard (Week 12, Weekend)
- [ ] Create XP progress bar component
- [ ] Add level indicator
- [ ] Add mission list to dashboard
- [ ] Add achievements grid
- [ ] Add XP animation (framer-motion)
- [ ] Test full gamification flow

---

## 🟡 PHASE 6: TESTING & QUALITY (3 weeks)

### Unit Tests (Week 13)
- [ ] Configure Vitest (already in package.json)
- [ ] Create `tests/unit/utils/xp.test.ts`
- [ ] Create `tests/unit/stores/authStore.test.ts`
- [ ] Create `tests/unit/stores/profileStore.test.ts`
- [ ] Create `tests/unit/lib/payments/stripe.test.ts`
- [ ] Create `tests/unit/lib/supabase/queries.test.ts`
- [ ] Mock Supabase client for tests
- [ ] Achieve 80%+ coverage on utils and stores
- [ ] Run `npm run test` and verify all pass
- [ ] Add coverage report: `npm run test:coverage`

### E2E Tests (Week 14, Days 1-3)
- [ ] Configure Playwright (already in package.json)
- [ ] Create `tests/e2e/auth.spec.ts` (sign-in flow)
- [ ] Create `tests/e2e/quiz.spec.ts` (complete quiz)
- [ ] Create `tests/e2e/coach.spec.ts` (send message, receive response)
- [ ] Create `tests/e2e/payment.spec.ts` (mock payment flow)
- [ ] Create `tests/e2e/mission.spec.ts` (complete mission, earn XP)
- [ ] Run `npm run test:e2e` and verify all pass
- [ ] Add E2E tests to CI pipeline

### Accessibility (Week 14, Days 4-5)
- [ ] Configure axe-playwright (already in package.json)
- [ ] Create `tests/a11y/landing.spec.ts`
- [ ] Create `tests/a11y/quiz.spec.ts`
- [ ] Create `tests/a11y/coach.spec.ts`
- [ ] Create `tests/a11y/premium.spec.ts`
- [ ] Run `npm run test:a11y` and fix critical violations
- [ ] Test keyboard navigation (Tab, Enter, Space)
- [ ] Test focus indicators (visible on all interactive elements)
- [ ] Test color contrast (WCAG AA, 4.5:1 minimum)
- [ ] Test with screen reader (NVDA or VoiceOver)
- [ ] Document a11y patterns in `/docs/ACCESSIBILITY.md`

### Performance Testing (Week 15)
- [ ] Configure Lighthouse CI (if keeping)
- [ ] Run Lighthouse on all pages
- [ ] Measure Core Web Vitals (LCP, INP, CLS)
- [ ] Optimize images (convert to WebP, add lazy loading)
- [ ] Code-split heavy routes (framer-motion, AI chat)
- [ ] Analyze bundle with `npm run build:analyze`
- [ ] Reduce main bundle to ≤ 400KB gzip
- [ ] Verify LCP ≤ 1.8s (p75)
- [ ] Verify INP ≤ 150ms (p75)
- [ ] Verify CLS ≤ 0.07
- [ ] Add performance budget to CI: `npm run test:size-limit`

---

## 🟡 PHASE 7: CI/CD & AUTOMATION (1 week)

### GitHub Actions (Week 16, Days 1-3)
- [ ] Create `.github/workflows/ci.yml`
- [ ] Add job: typecheck (`npm run typecheck`)
- [ ] Add job: lint (`npm run lint`)
- [ ] Add job: test (`npm run test`)
- [ ] Add job: test:e2e (`npm run test:e2e`)
- [ ] Add job: test:size-limit (`npm run test:size-limit`)
- [ ] Configure job to run on push and pull_request
- [ ] Add branch protection rules (require CI to pass)

### Deployment (Week 16, Days 4-5)
- [ ] Create `.github/workflows/deploy.yml`
- [ ] Add Vercel integration (or other hosting)
- [ ] Configure auto-deploy on main branch
- [ ] Set up staging environment (preview deployments)
- [ ] Add Supabase migration checks to deploy workflow
- [ ] Document deployment process in `/docs/DEPLOYMENT.md`

### Rollback Strategy (Week 16, Weekend)
- [ ] Document rollback procedure in `/docs/ROLLBACK.md`
- [ ] Implement blue/green deployment (or feature flags)
- [ ] Create rollback script: `scripts/rollback.sh`
- [ ] Test rollback in staging
- [ ] Add rollback alerting (notify team on deploy failure)

---

## 🟡 PHASE 8: HARDENING & POLISH (2 weeks)

### Security Hardening (Week 17)
- [ ] Audit RLS coverage (100% user tables)
- [ ] Test RLS policies (user cannot access other user data)
- [ ] Test RLS with anon user (cannot access protected data)
- [ ] Remove `unsafe-inline` from CSP (use nonces or hashes)
- [ ] Remove `unsafe-eval` from Vercel CSP (production only)
- [ ] Tighten `img-src` in CSP (whitelist domains)
- [ ] Add SRI to Telegram SDK script
- [ ] Install Zod: `npm i zod`
- [ ] Add Zod validation to all API inputs
- [ ] Add rate limiting to edge functions
- [ ] Rotate Supabase service_role_key
- [ ] Run OWASP ZAP scan (automated security scan)
- [ ] Fix all high/critical vulnerabilities
- [ ] Document security model in `/docs/SECURITY.md`

### Monitoring & Logging (Week 17)
- [ ] Install Sentry SDK: `npm i @sentry/react`
- [ ] Configure Sentry in `src/main.tsx`
- [ ] Add Sentry to edge functions
- [ ] Add structured logging to edge functions (console.log with JSON)
- [ ] Create error boundaries in React (`src/components/ErrorBoundary.tsx`)
- [ ] Test error capture (trigger error, verify Sentry alert)
- [ ] Set up alerting (Sentry → Slack/PagerDuty)
- [ ] Define SLOs (99.9% uptime, p95 latency < 500ms)
- [ ] Create monitoring dashboard (Supabase + Sentry)

### Documentation (Week 18, Days 1-3)
- [ ] Update README.md with architecture diagram (Mermaid)
- [ ] Add setup instructions to README
- [ ] Add deployment guide to README
- [ ] Add troubleshooting section to README
- [ ] Create `/docs/ARCHITECTURE.md`
- [ ] Create `/docs/API.md` (edge functions reference)
- [ ] Create `/docs/SECURITY.md` (RLS policies, threat model)
- [ ] Create `/docs/RUNBOOK.md` (ops procedures)
- [ ] Create `/docs/CONTRIBUTING.md` (for team)
- [ ] Add code comments to complex logic

### Final QA (Week 18, Days 4-5)
- [ ] Manual smoke test on staging (all flows)
- [ ] Cross-browser test (Chrome, Firefox, Safari)
- [ ] Mobile responsive test (iOS Safari, Android Chrome)
- [ ] Telegram WebApp test (real Telegram client on iOS/Android)
- [ ] Test offline mode (PWA, service worker caching)
- [ ] Load test (1000 concurrent users with k6 or Artillery)
- [ ] Payment test (real $1 Stripe transaction, verify webhook)
- [ ] Refund test (refund $1, verify payments_tx updated)
- [ ] Test edge cases (slow network, timeout, retry)

---

## 🔴 PHASE 9: LAUNCH PREP (1 week)

### Pre-Launch Checklist (Week 19, Days 1-2)
- [ ] Create release notes (CHANGELOG.md)
- [ ] Prepare rollback plan (documented + tested)
- [ ] Set feature flags to safe defaults (all false or controlled)
- [ ] Final security review (external auditor optional)
- [ ] Backup database (pre-launch snapshot)
- [ ] DNS setup (if custom domain)
- [ ] SSL certificate verification (HTTPS working)
- [ ] Staging → Production migration dry-run
- [ ] Define on-call rotation schedule
- [ ] Define post-launch KPIs (DAU, conversion, error rate)

### Launch Day (Week 19, Day 3)
- [ ] Deploy to production (via CI or manual)
- [ ] Monitor error rates (first 15 min)
- [ ] Verify payment webhooks working (send test payment)
- [ ] Check Sentry for unexpected errors
- [ ] Check Supabase logs
- [ ] Smoke test all critical flows (auth, payment, AI coach)
- [ ] Announce launch (internal team, beta users)

### Post-Launch (Week 19, Days 4-7)
- [ ] Monitor KPIs (DAU, conversion, errors) — T+1h
- [ ] Monitor KPIs — T+24h
- [ ] Monitor KPIs — T+7d
- [ ] Gather user feedback (NPS survey, Telegram chat)
- [ ] Iterate on top issues (prioritize by impact)
- [ ] Create post-launch retrospective document

---

## 📊 QUALITY GATES (FINAL CHECKLIST)

### Security ✅ (26 items)
- [ ] RLS enabled on 100% of user tables
- [ ] All policies tested (user cannot access other user data)
- [ ] CSP hardened (no unsafe-inline, no unsafe-eval)
- [ ] Input validation with Zod on all endpoints
- [ ] Secrets in `.env.local` (NOT `.env`)
- [ ] `.env.local` in `.gitignore`
- [ ] No secrets in git history
- [ ] HTTPS enforced (HSTS header)
- [ ] Cookies marked httpOnly, secure, sameSite
- [ ] Webhook signatures verified (Stripe, PayPal)
- [ ] Idempotent payment processing
- [ ] Server-side amount validation
- [ ] Audit trail (payments_tx immutable)
- [ ] Test/prod key separation enforced
- [ ] Sentry integrated
- [ ] Structured logging in edge functions
- [ ] Alerting for critical errors
- [ ] No PII in logs
- [ ] CORS restricted (no * in production)
- [ ] Rate limiting on public endpoints
- [ ] Dependency audit (npm audit clean)
- [ ] SRI on external scripts
- [ ] Penetration test passed (automated or manual)
- [ ] OWASP Top 10 mitigated
- [ ] XSS prevented (sanitize AI outputs)
- [ ] SQL injection prevented (Supabase client)

### Performance ✅ (8 items)
- [ ] Lighthouse score ≥ 90 (mobile)
- [ ] LCP ≤ 1.8s (p75)
- [ ] INP ≤ 150ms (p75)
- [ ] CLS ≤ 0.07
- [ ] Main bundle ≤ 400KB gzip
- [ ] Route-level code splitting
- [ ] Image optimization (WebP, lazy load)
- [ ] Service worker caching active

### Reliability ✅ (8 items)
- [ ] Uptime SLO: 99.9%
- [ ] Error rate < 0.1%
- [ ] All errors logged to Sentry
- [ ] Rollback plan documented + tested
- [ ] Feature flags for all major features
- [ ] Database migrations idempotent
- [ ] Automated backups (Supabase)
- [ ] On-call rotation defined

### Payments ✅ (6 items)
- [ ] Test/prod environment separation
- [ ] Idempotent webhooks (no double-charging)
- [ ] Full audit trail (payments_tx table)
- [ ] Refund flow tested
- [ ] PCI compliance (delegated to Stripe/PayPal)
- [ ] Transaction reconciliation process

### DX/CI ✅ (8 items)
- [ ] Typecheck passes on CI
- [ ] Lint passes on CI
- [ ] Unit tests pass (≥80% coverage)
- [ ] E2E tests pass
- [ ] A11y tests pass
- [ ] Size-limit enforced
- [ ] Automated deployments (main → production)
- [ ] README accurate and complete

### A11y ✅ (6 items)
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation on all flows
- [ ] Screen reader tested
- [ ] Color contrast ≥ 4.5:1 (text)
- [ ] Focus indicators visible
- [ ] No seizure-inducing animations

---

## 📈 PROGRESS TRACKING

**Total Tasks:** 312
**Completed:** 0
**In Progress:** 0
**Blocked:** 2 (npm install, missing src/)

**Phase Completion:**
- Phase 0: 0% (0/24)
- Phase 1: 0% (0/32)
- Phase 2: 0% (0/42)
- Phase 3: 0% (0/38)
- Phase 4: 0% (0/17)
- Phase 5: 0% (0/16)
- Phase 6: 0% (0/33)
- Phase 7: 0% (0/14)
- Phase 8: 0% (0/32)
- Phase 9: 0% (0/12)

**Quality Gates:** 0/62

---

## 🎯 NEXT IMMEDIATE ACTIONS (TODAY)

1. [ ] Fix npm install (update package.json deps)
2. [ ] Move .env → .env.local (security critical)
3. [ ] Create src/ directory structure
4. [ ] Create minimal src/main.tsx
5. [ ] Verify build succeeds

**After these 5 tasks, proceed with Phase 1.**

---

**End of Checklist**

**Note:** This is a living document. Update progress regularly. Estimated solo dev time: 22 weeks (5.5 months). With 3-person team: 12-16 weeks (3-4 months).
