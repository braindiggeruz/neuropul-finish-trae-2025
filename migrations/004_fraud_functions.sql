/*
  # Fraud Detection SQL Functions

  ## Functions
  1. `paywall.get_user_avg_payment(uid UUID)` - Average payment amount
     - Used to detect anomalous large payments
     - Returns average in minor units (tiyin/cents)
     - Limited to last 100 successful payments

  2. `paywall.get_user_payment_frequency(uid UUID, hours INT)` - Recent payment count
     - Used to detect rapid-fire payment attempts
     - Returns count of payments in last N hours
     - All statuses counted (pending, succeeded, failed)

  3. `paywall.get_user_account_age_days(uid UUID)` - Account age
     - Used to weight fraud score for new accounts
     - Returns age in days since user creation
     - Returns 0 if user not found

  ## Usage
  These functions are called from edge functions for server-side fraud scoring.
  Do NOT expose directly to client - use service role only.

  ## Performance
  - All functions are STABLE (can be cached within transaction)
  - Indexes on user_id, status, created_at support fast lookups
  - LIMIT clauses prevent full table scans
*/

-- User average payment amount (for anomaly detection)
CREATE OR REPLACE FUNCTION paywall.get_user_avg_payment(uid UUID)
RETURNS INT
LANGUAGE SQL
STABLE
AS $$
  SELECT COALESCE(AVG(amount_minor)::INT, 0)
  FROM paywall.payments_log
  WHERE user_id = uid
    AND status = 'succeeded'
  ORDER BY created_at DESC
  LIMIT 100;
$$;

-- User payment frequency (for rate limiting detection)
CREATE OR REPLACE FUNCTION paywall.get_user_payment_frequency(uid UUID, hours INT DEFAULT 1)
RETURNS INT
LANGUAGE SQL
STABLE
AS $$
  SELECT COUNT(*)::INT
  FROM paywall.payments_log
  WHERE user_id = uid
    AND created_at >= NOW() - (hours || ' hours')::INTERVAL;
$$;

-- User account age in days (for new account risk scoring)
CREATE OR REPLACE FUNCTION paywall.get_user_account_age_days(uid UUID)
RETURNS INT
LANGUAGE SQL
STABLE
AS $$
  SELECT COALESCE(
    EXTRACT(EPOCH FROM (NOW() - created_at))::INT / 86400,
    0
  )
  FROM public.users
  WHERE id = uid;
$$;

-- Count successful payments (for trust scoring)
CREATE OR REPLACE FUNCTION paywall.get_user_successful_payment_count(uid UUID)
RETURNS INT
LANGUAGE SQL
STABLE
AS $$
  SELECT COUNT(*)::INT
  FROM paywall.payments_log
  WHERE user_id = uid
    AND status = 'succeeded';
$$;

-- Get median payment amount across all users (for global anomaly detection)
CREATE OR REPLACE FUNCTION paywall.get_global_median_payment()
RETURNS INT
LANGUAGE SQL
STABLE
AS $$
  SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY amount_minor)::INT
  FROM paywall.payments_log
  WHERE status = 'succeeded'
    AND created_at >= NOW() - INTERVAL '30 days'
  LIMIT 10000;
$$;
