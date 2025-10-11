/*
  # Payment Minor Units Migration

  ## Changes
  1. Rename `amount_cents` to `amount_minor` for universal currency support
     - UZS: minor = tiyin (1 UZS = 100 tiyin)
     - USD: minor = cents (1 USD = 100 cents)

  2. Add fee tracking
     - `fee_minor` - Provider fees in minor units
     - `net_minor` - Generated column (amount_minor - fee_minor)

  3. Add fiscal compliance (UZ regulations)
     - `fiscal_status` - Receipt generation status
     - `receipt_url` - Link to fiscal receipt
     - `fiscal_id` - Fiscal document identifier

  4. Add trace_id for OpenTelemetry distributed tracing

  ## Security
  - All new columns are nullable/have defaults (backward compatible)
  - No data loss during rename operation
*/

-- Rename amount_cents to amount_minor
ALTER TABLE paywall.payments_log
  RENAME COLUMN amount_cents TO amount_minor;

-- Add fee and net columns
ALTER TABLE paywall.payments_log
  ADD COLUMN IF NOT EXISTS fee_minor INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS net_minor INT GENERATED ALWAYS AS (amount_minor - fee_minor) STORED;

-- Create fiscal status enum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fiscal_status_enum') THEN
    CREATE TYPE paywall.fiscal_status_enum AS ENUM (
      'pending',
      'succeeded',
      'failed',
      'not_required'
    );
  END IF;
END $$;

-- Add fiscal compliance columns
ALTER TABLE paywall.payments_log
  ADD COLUMN IF NOT EXISTS fiscal_status paywall.fiscal_status_enum DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS receipt_url TEXT,
  ADD COLUMN IF NOT EXISTS fiscal_id TEXT;

-- Add OpenTelemetry trace_id for distributed tracing
ALTER TABLE paywall.payments_log
  ADD COLUMN IF NOT EXISTS trace_id UUID;

-- Create index for trace lookups
CREATE INDEX IF NOT EXISTS idx_payments_trace ON paywall.payments_log(trace_id);

-- Update check constraint to use new column name
ALTER TABLE paywall.payments_log DROP CONSTRAINT IF EXISTS payments_log_amount_cents_check;
ALTER TABLE paywall.payments_log ADD CONSTRAINT payments_log_amount_minor_check
  CHECK (amount_minor >= 0);
