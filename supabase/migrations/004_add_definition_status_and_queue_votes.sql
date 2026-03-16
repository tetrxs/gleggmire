-- Migration 004: Add status column to term_definitions + queue vote support
-- Required for: definition moderation workflow, public queue voting

-- ============================================
-- 1. Add status column to term_definitions
-- ============================================
ALTER TABLE term_definitions
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- Set all existing definitions to 'approved' (they were created before moderation)
UPDATE term_definitions SET status = 'approved' WHERE status = 'pending';

-- Index for filtering by status
CREATE INDEX IF NOT EXISTS idx_definitions_status ON term_definitions(status);

-- ============================================
-- 2. Extend votes entity_type CHECK to include 'queue'
-- ============================================
-- Drop old constraint and recreate with 'queue' added
ALTER TABLE votes DROP CONSTRAINT IF EXISTS votes_entity_type_check;
ALTER TABLE votes ADD CONSTRAINT votes_entity_type_check
  CHECK (entity_type IN ('definition', 'comment', 'clip', 'clip_term_link', 'queue'));

-- ============================================
-- 3. Add authenticated user INSERT policy for term_tags
--    (needed for term submission — users insert tags alongside terms)
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can add tags' AND tablename = 'term_tags'
  ) THEN
    CREATE POLICY "Authenticated users can add tags"
      ON term_tags FOR INSERT
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;
