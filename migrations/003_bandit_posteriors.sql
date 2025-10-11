/*
  # Bandit Thompson Sampling + Winner Promotion

  ## Changes
  1. Add winner tracking to experiments
     - `winner_arm_id` - Winning arm after promotion
     - `reset_cadence_days` - Auto-reset interval (default 14 days)
     - `last_reset_at` - Timestamp of last reset
     - `winner_promotion_threshold` - Conversion rate threshold (default 0.85)

  2. Create posteriors table for Thompson Sampling state
     - Tracks alpha/beta parameters per arm
     - Tracks exposure_count (how many times shown)
     - Tracks decision_count (how many times selected)
     - Primary key on (experiment_id, arm_id)

  ## Security
  - Foreign keys ensure referential integrity
  - Cascade deletes clean up posteriors when experiments/arms deleted
  - All columns have sensible defaults

  ## Notes
  - winner_arm_id is BIGINT (matches bandit.arms.id which is BIGSERIAL)
  - Thompson Sampling updates posteriors table, not arms table
  - Separate exposure/decision tracking for accurate metrics
*/

-- Add winner tracking columns to experiments
ALTER TABLE bandit.experiments
  ADD COLUMN IF NOT EXISTS winner_arm_id BIGINT REFERENCES bandit.arms(id),
  ADD COLUMN IF NOT EXISTS reset_cadence_days INT DEFAULT 14,
  ADD COLUMN IF NOT EXISTS last_reset_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS winner_promotion_threshold NUMERIC DEFAULT 0.85;

-- Create posteriors table for Thompson Sampling state
CREATE TABLE IF NOT EXISTS bandit.posteriors (
  experiment_id BIGINT NOT NULL REFERENCES bandit.experiments(id) ON DELETE CASCADE,
  arm_id BIGINT NOT NULL REFERENCES bandit.arms(id) ON DELETE CASCADE,
  alpha INT NOT NULL DEFAULT 1,
  beta INT NOT NULL DEFAULT 1,
  exposure_count INT NOT NULL DEFAULT 0,
  decision_count INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (experiment_id, arm_id)
);

-- Create index for fast lookups by experiment
CREATE INDEX IF NOT EXISTS idx_posteriors_experiment ON bandit.posteriors(experiment_id);

-- Function to initialize posteriors for an experiment
CREATE OR REPLACE FUNCTION bandit.init_posteriors(exp_id BIGINT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO bandit.posteriors (experiment_id, arm_id)
  SELECT exp_id, id
  FROM bandit.arms
  WHERE experiment_id = exp_id
  ON CONFLICT (experiment_id, arm_id) DO NOTHING;
END;
$$;

-- Function to increment exposure count
CREATE OR REPLACE FUNCTION bandit.increment_exposure(exp_id BIGINT, a_id BIGINT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE bandit.posteriors
  SET exposure_count = exposure_count + 1,
      updated_at = NOW()
  WHERE experiment_id = exp_id AND arm_id = a_id;
END;
$$;

-- Function to increment decision count
CREATE OR REPLACE FUNCTION bandit.increment_decision(exp_id BIGINT, a_id BIGINT)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE bandit.posteriors
  SET decision_count = decision_count + 1,
      updated_at = NOW()
  WHERE experiment_id = exp_id AND arm_id = a_id;
END;
$$;

-- Function to record reward and update Thompson Sampling parameters
CREATE OR REPLACE FUNCTION bandit.record_reward(exp_id BIGINT, a_id BIGINT, success BOOLEAN)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  IF success THEN
    UPDATE bandit.posteriors
    SET alpha = alpha + 1,
        updated_at = NOW()
    WHERE experiment_id = exp_id AND arm_id = a_id;
  ELSE
    UPDATE bandit.posteriors
    SET beta = beta + 1,
        updated_at = NOW()
    WHERE experiment_id = exp_id AND arm_id = a_id;
  END IF;
END;
$$;
