/*
  # Row Level Security Policies - Neuropul MVP

  ## Overview
  This migration enables Row Level Security (RLS) on all user-facing tables and
  establishes restrictive-by-default policies. Data is only accessible to users
  who explicitly need it.

  ## Security Model
  - **Deny by default**: Once RLS is enabled, no access until policies are created
  - **Owner-only access**: Users can only access their own data
  - **Service role bypass**: Edge functions use service role for privileged operations
  - **auth.uid() validation**: All policies verify user identity from JWT

  ## Tables Secured
  - public.profiles - User profile data
  - xp.events - Experience point history
  - bandit.assignments - Experiment variant assignments
  - events.bus - User event stream
  - paywall.payments_log - Payment transaction history

  ## Policy Patterns
  - SELECT policies use USING clause to filter rows
  - INSERT policies use WITH CHECK to validate new rows
  - UPDATE policies use both USING (can see) and WITH CHECK (can modify)
  - DELETE policies use USING clause only
  - Service role operations bypass RLS entirely

  ## Important Notes
  - payments_log is write-only for service role (webhooks)
  - Audit trail has no RLS (administrative access only)
  - Bandit experiments/arms are managed by service role
  - XP levels are public read-only reference data
*/

-- Enable RLS on user-facing tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE bandit.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events.bus ENABLE ROW LEVEL SECURITY;
ALTER TABLE paywall.payments_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PUBLIC.PROFILES POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can insert their own profile (during registration)
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- XP.EVENTS POLICIES
-- ============================================================================

-- Users can view their own XP events
CREATE POLICY "Users can view own XP events"
  ON xp.events
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert their own XP events
CREATE POLICY "Users can insert own XP events"
  ON xp.events
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- BANDIT.ASSIGNMENTS POLICIES
-- ============================================================================

-- Users can view their own experiment assignments
CREATE POLICY "Users can view own bandit assignments"
  ON bandit.assignments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Service role can insert assignments (Thompson Sampling logic)
CREATE POLICY "Service role can insert assignments"
  ON bandit.assignments
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================================================
-- EVENTS.BUS POLICIES
-- ============================================================================

-- Users can view their own events
CREATE POLICY "Users can view own events"
  ON events.bus
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert their own events
CREATE POLICY "Users can insert own events"
  ON events.bus
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- PAYWALL.PAYMENTS_LOG POLICIES
-- ============================================================================

-- Users can view their own payment history
CREATE POLICY "Users can view own payments"
  ON paywall.payments_log
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Service role can insert payment records (webhook handlers)
CREATE POLICY "Service role can insert payments"
  ON paywall.payments_log
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Service role can update payment status (webhook handlers)
CREATE POLICY "Service role can update payments"
  ON paywall.payments_log
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- PUBLIC READ ACCESS FOR REFERENCE DATA
-- ============================================================================

-- Allow authenticated users to read XP level requirements
ALTER TABLE xp.levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view XP levels"
  ON xp.levels
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to read experiment configurations
ALTER TABLE bandit.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bandit.arms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view experiments"
  ON bandit.experiments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view experiment arms"
  ON bandit.arms
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get user's current XP total
CREATE OR REPLACE FUNCTION xp.get_user_total(p_user_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(SUM(xp_gain), 0)::INTEGER
  FROM xp.events
  WHERE user_id = p_user_id;
$$;

-- Function to get user's current level
CREATE OR REPLACE FUNCTION xp.get_user_level(p_user_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(MAX(level), 1)::INTEGER
  FROM xp.levels
  WHERE xp_required <= xp.get_user_total(p_user_id);
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION xp.get_user_total(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION xp.get_user_level(UUID) TO authenticated;
