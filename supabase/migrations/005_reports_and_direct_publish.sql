-- Migration 005: Report system, direct publishing, temp bans
-- Removes approval workflow, adds community reporting

-- ============================================
-- 1. Reports table
-- ============================================
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(id),
  reported_user_id UUID REFERENCES users(id),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('term', 'definition', 'comment')),
  entity_id UUID NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN (
    'hate_speech', 'racism', 'sexual_content', 'harassment',
    'spam', 'misinformation', 'personal_info', 'other'
  )),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'resolved_deleted', 'resolved_warned',
    'resolved_temp_ban', 'resolved_perm_ban', 'dismissed'
  )),
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  resolution_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_entity ON reports(entity_type, entity_id);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

-- RLS for reports
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can create reports"
  ON reports FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Service role full access to reports"
  ON reports FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- 2. Temp ban support: add ban_until to users
-- ============================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS ban_until TIMESTAMPTZ;

-- ============================================
-- 3. Direct publishing: definitions default to approved
-- ============================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'term_definitions' AND column_name = 'status'
  ) THEN
    ALTER TABLE term_definitions ALTER COLUMN status SET DEFAULT 'approved';
  END IF;
END $$;

-- ============================================
-- 4. Set all pending terms to approved (no more approval queue)
-- ============================================
UPDATE glossary_terms SET status = 'approved' WHERE status = 'pending';
UPDATE term_definitions SET status = 'approved' WHERE status = 'pending';
