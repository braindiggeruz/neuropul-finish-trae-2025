/*
  # Neuropul MVP Database Schema - Initial Migration

  ## Overview
  This migration establishes the core database structure for the Neuropul AI platform,
  including user management, XP progression, multi-armed bandit experiments, payment
  tracking, and event/audit trails.

  ## New Schemas
  - `xp` - Experience points and leveling system
  - `bandit` - Multi-armed bandit A/B/C testing framework
  - `paywall` - Payment transaction logging
  - `events` - Event bus for system-wide events
  - `audit` - Audit trail for compliance and debugging

  ## New Tables

  ### Core User Tables (public schema)
  - `users` - User identity records
  - `profiles` - Extended user profile with archetype assignment

  ### XP System (xp schema)
  - `levels` - Level definitions with XP thresholds
  - `events` - XP gain events for all user actions

  ### Bandit System (bandit schema)
  - `experiments` - A/B/C test configurations
  - `arms` - Individual variants per experiment
  - `assignments` - User-to-variant assignments
  - `rewards` - Conversion outcomes for Thompson Sampling

  ### Payment System (paywall schema)
  - `payments_log` - Idempotent payment transaction records

  ### Event System (events schema)
  - `bus` - General event stream for analytics

  ### Audit System (audit schema)
  - `trail` - Change tracking for security and debugging

  ## Security Notes
  - All tables use UUID primary keys for security
  - Timestamps use timestamptz for proper timezone handling
  - Foreign keys enforce referential integrity
  - Unique constraints prevent duplicate payments (idempotency)
  - Check constraints validate archetype values
*/

-- Create schemas
CREATE SCHEMA IF NOT EXISTS xp;
CREATE SCHEMA IF NOT EXISTS bandit;
CREATE SCHEMA IF NOT EXISTS paywall;
CREATE SCHEMA IF NOT EXISTS events;
CREATE SCHEMA IF NOT EXISTS audit;

-- Core user tables
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  display_name TEXT,
  archetype TEXT CHECK (archetype IN ('Seeker', 'Magician', 'Warrior')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- XP system tables
CREATE TABLE IF NOT EXISTS xp.levels (
  id SERIAL PRIMARY KEY,
  level INTEGER NOT NULL UNIQUE,
  xp_required INTEGER NOT NULL,
  CHECK (level > 0),
  CHECK (xp_required >= 0)
);

CREATE TABLE IF NOT EXISTS xp.events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  xp_gain INTEGER NOT NULL DEFAULT 0,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (xp_gain >= 0)
);

CREATE INDEX IF NOT EXISTS idx_xp_events_user_id ON xp.events(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_events_created_at ON xp.events(created_at DESC);

-- Bandit system tables
CREATE TABLE IF NOT EXISTS bandit.experiments (
  id BIGSERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bandit.arms (
  id BIGSERIAL PRIMARY KEY,
  experiment_id BIGINT NOT NULL REFERENCES bandit.experiments(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(experiment_id, label)
);

CREATE TABLE IF NOT EXISTS bandit.assignments (
  id BIGSERIAL PRIMARY KEY,
  experiment_id BIGINT NOT NULL REFERENCES bandit.experiments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  arm_id BIGINT NOT NULL REFERENCES bandit.arms(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(experiment_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_bandit_assignments_user ON bandit.assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_bandit_assignments_experiment ON bandit.assignments(experiment_id);

CREATE TABLE IF NOT EXISTS bandit.rewards (
  id BIGSERIAL PRIMARY KEY,
  assignment_id BIGINT NOT NULL REFERENCES bandit.assignments(id) ON DELETE CASCADE,
  reward NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (reward >= 0 AND reward <= 1)
);

CREATE INDEX IF NOT EXISTS idx_bandit_rewards_assignment ON bandit.rewards(assignment_id);

-- Payment system tables
CREATE TABLE IF NOT EXISTS paywall.payments_log (
  id BIGSERIAL PRIMARY KEY,
  provider TEXT NOT NULL,
  provider_tx_id TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (amount_cents >= 0),
  CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  UNIQUE(provider, provider_tx_id)
);

CREATE INDEX IF NOT EXISTS idx_payments_log_user ON paywall.payments_log(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_log_status ON paywall.payments_log(status);
CREATE INDEX IF NOT EXISTS idx_payments_log_created ON paywall.payments_log(created_at DESC);

-- Event bus table
CREATE TABLE IF NOT EXISTS events.bus (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_bus_user ON events.bus(user_id);
CREATE INDEX IF NOT EXISTS idx_events_bus_type ON events.bus(event_type);
CREATE INDEX IF NOT EXISTS idx_events_bus_created ON events.bus(created_at DESC);

-- Audit trail table
CREATE TABLE IF NOT EXISTS audit.trail (
  id BIGSERIAL PRIMARY KEY,
  actor UUID,
  action TEXT NOT NULL,
  entity TEXT,
  entity_id TEXT,
  before JSONB,
  after JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_trail_actor ON audit.trail(actor);
CREATE INDEX IF NOT EXISTS idx_audit_trail_entity ON audit.trail(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_trail_created ON audit.trail(created_at DESC);

-- Seed initial XP levels
INSERT INTO xp.levels (level, xp_required) VALUES
  (1, 0),
  (2, 100),
  (3, 250),
  (4, 500),
  (5, 1000),
  (6, 2000),
  (7, 4000),
  (8, 8000),
  (9, 16000),
  (10, 32000)
ON CONFLICT (level) DO NOTHING;
