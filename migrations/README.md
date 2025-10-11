# Neuropul Database Migrations

## Migration Order

Apply migrations in this exact order:

1. **000_init.sql** - Core schema (users, profiles, xp, bandit, paywall, events, audit)
2. **001_rls_policies.sql** - Row Level Security policies
3. **002_payment_minor_units.sql** - Payment schema updates (amount_minor, fiscal_status)
4. **003_bandit_posteriors.sql** - Thompson Sampling state tracking
5. **004_fraud_functions.sql** - Fraud detection SQL functions

## Quick Apply (Supabase CLI)

```bash
supabase db reset  # Resets and applies all migrations in order
```

## Manual Apply (Database Interface)

Copy and execute each SQL file in order in your Supabase SQL editor.

## Verification

```sql
-- Check all schemas exist
SELECT schema_name FROM information_schema.schemata
WHERE schema_name IN ('public', 'xp', 'bandit', 'paywall', 'events', 'audit');

-- Check payments_log has new columns
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'paywall' AND table_name = 'payments_log'
ORDER BY ordinal_position;
-- Should include: amount_minor, fee_minor, net_minor, fiscal_status, trace_id

-- Check bandit.posteriors exists
SELECT * FROM information_schema.tables
WHERE table_schema = 'bandit' AND table_name = 'posteriors';

-- Check fraud functions exist
SELECT proname FROM pg_proc WHERE pronamespace = 'paywall'::regnamespace;
-- Should include: get_user_avg_payment, get_user_payment_frequency, etc.
```

## Rollback

If you need to rollback:

```sql
-- Rollback 004
DROP FUNCTION IF EXISTS paywall.get_user_avg_payment(UUID);
DROP FUNCTION IF EXISTS paywall.get_user_payment_frequency(UUID, INT);
DROP FUNCTION IF EXISTS paywall.get_user_account_age_days(UUID);
DROP FUNCTION IF EXISTS paywall.get_user_successful_payment_count(UUID);
DROP FUNCTION IF EXISTS paywall.get_global_median_payment();

-- Rollback 003
DROP TABLE IF EXISTS bandit.posteriors CASCADE;
ALTER TABLE bandit.experiments DROP COLUMN IF EXISTS winner_arm_id;
ALTER TABLE bandit.experiments DROP COLUMN IF EXISTS reset_cadence_days;
ALTER TABLE bandit.experiments DROP COLUMN IF EXISTS last_reset_at;
ALTER TABLE bandit.experiments DROP COLUMN IF EXISTS winner_promotion_threshold;

-- Rollback 002
ALTER TABLE paywall.payments_log DROP COLUMN IF EXISTS trace_id;
ALTER TABLE paywall.payments_log DROP COLUMN IF EXISTS fiscal_id;
ALTER TABLE paywall.payments_log DROP COLUMN IF EXISTS receipt_url;
ALTER TABLE paywall.payments_log DROP COLUMN IF EXISTS fiscal_status;
DROP TYPE IF EXISTS paywall.fiscal_status_enum;
ALTER TABLE paywall.payments_log DROP COLUMN IF EXISTS net_minor;
ALTER TABLE paywall.payments_log DROP COLUMN IF EXISTS fee_minor;
ALTER TABLE paywall.payments_log RENAME COLUMN amount_minor TO amount_cents;
```
