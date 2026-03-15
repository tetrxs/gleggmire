-- Feature/Funktionen-Vorschläge
CREATE TABLE IF NOT EXISTS feature_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  discord_username TEXT,
  contact_info TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'done')),
  admin_notes TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE feature_suggestions ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (submit suggestions)
CREATE POLICY "Anyone can submit suggestions"
  ON feature_suggestions FOR INSERT
  WITH CHECK (true);

-- Only service_role can read/update/delete (admin)
CREATE POLICY "Service role full access"
  ON feature_suggestions
  USING (auth.role() = 'service_role');

-- Index for admin sorting
CREATE INDEX idx_feature_suggestions_status ON feature_suggestions(status);
CREATE INDEX idx_feature_suggestions_created ON feature_suggestions(created_at DESC);
