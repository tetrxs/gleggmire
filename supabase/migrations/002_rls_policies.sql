-- gleggmire.net — Row Level Security Policies
-- RLS is auto-enabled on all tables

-- ============================================
-- USERS — public read, self-update
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users are publicly readable"
  ON users FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE USING (auth.uid() = id);

-- Service role can insert/update (for OAuth callback)
CREATE POLICY "Service role can manage users"
  ON users FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- GLOSSARY TERMS — approved are public, pending visible in queue
-- ============================================
ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved and pending terms are readable"
  ON glossary_terms FOR SELECT
  USING (status IN ('approved', 'pending', 'disputed') AND is_secret = false);

CREATE POLICY "Secret terms readable by direct slug access"
  ON glossary_terms FOR SELECT
  USING (is_secret = true);

CREATE POLICY "Authenticated users can insert terms"
  ON glossary_terms FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Service role full access to terms"
  ON glossary_terms FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- TERM DEFINITIONS — public read, authenticated insert
-- ============================================
ALTER TABLE term_definitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Definitions are publicly readable"
  ON term_definitions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can submit definitions"
  ON term_definitions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Service role full access to definitions"
  ON term_definitions FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- TERM ALIASES — public read
-- ============================================
ALTER TABLE term_aliases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Aliases are publicly readable"
  ON term_aliases FOR SELECT USING (true);

CREATE POLICY "Service role full access to aliases"
  ON term_aliases FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- TERM TAGS — public read
-- ============================================
ALTER TABLE term_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tags are publicly readable"
  ON term_tags FOR SELECT USING (true);

CREATE POLICY "Service role full access to tags"
  ON term_tags FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- TERM EDIT HISTORY — public read
-- ============================================
ALTER TABLE term_edit_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Edit history is publicly readable"
  ON term_edit_history FOR SELECT USING (true);

CREATE POLICY "Service role full access to edit history"
  ON term_edit_history FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- CLIPS — public read, authenticated insert
-- ============================================
ALTER TABLE clips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clips are publicly readable"
  ON clips FOR SELECT USING (true);

CREATE POLICY "Authenticated users can submit clips"
  ON clips FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Service role full access to clips"
  ON clips FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- CLIP TERM LINKS — public read, authenticated insert
-- ============================================
ALTER TABLE clip_term_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clip-term links are publicly readable"
  ON clip_term_links FOR SELECT USING (true);

CREATE POLICY "Authenticated users can link clips to terms"
  ON clip_term_links FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Service role full access to clip-term links"
  ON clip_term_links FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- COMMENTS — public read, authenticated insert
-- ============================================
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Non-hidden comments are publicly readable"
  ON comments FOR SELECT
  USING (is_hidden = false);

CREATE POLICY "Authenticated users can post comments"
  ON comments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Service role full access to comments"
  ON comments FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- COMMENT IP LOG — NEVER public, only service role
-- ============================================
ALTER TABLE comment_ip_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "IP logs only accessible by service role"
  ON comment_ip_log FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- VOTES — public read, authenticated insert/update
-- ============================================
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Votes are publicly readable"
  ON votes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote"
  ON votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can change own votes"
  ON votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can remove own votes"
  ON votes FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to votes"
  ON votes FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- COPE VOTES — public read, authenticated insert
-- ============================================
ALTER TABLE cope_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cope votes are publicly readable"
  ON cope_votes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can cope-vote"
  ON cope_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cope votes"
  ON cope_votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to cope votes"
  ON cope_votes FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- REACTIONS — public read, authenticated insert/delete
-- ============================================
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reactions are publicly readable"
  ON reactions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can react"
  ON reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own reactions"
  ON reactions FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to reactions"
  ON reactions FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- BADGES — public read
-- ============================================
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges are publicly readable"
  ON badges FOR SELECT USING (true);

CREATE POLICY "Service role full access to badges"
  ON badges FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- MODERATION LOG — only service role (admin backend reads via service key)
-- ============================================
ALTER TABLE moderation_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Moderation log only accessible by service role"
  ON moderation_log FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================
-- DISPUTES — public read, authenticated insert
-- ============================================
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Disputes are publicly readable"
  ON disputes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can start disputes"
  ON disputes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Service role full access to disputes"
  ON disputes FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- DELETION PETITIONS — public read, authenticated insert
-- ============================================
ALTER TABLE deletion_petitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Petitions are publicly readable"
  ON deletion_petitions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can petition"
  ON deletion_petitions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Service role full access to petitions"
  ON deletion_petitions FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- WEEKLY CHALLENGES — public read
-- ============================================
ALTER TABLE weekly_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Challenges are publicly readable"
  ON weekly_challenges FOR SELECT USING (true);

CREATE POLICY "Service role full access to challenges"
  ON weekly_challenges FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- TROLL OF MONTH — public read
-- ============================================
ALTER TABLE troll_of_month ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Troll of month is publicly readable"
  ON troll_of_month FOR SELECT USING (true);

CREATE POLICY "Service role full access to troll of month"
  ON troll_of_month FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- SITE ALERTS — public read active alerts
-- ============================================
ALTER TABLE site_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active alerts are publicly readable"
  ON site_alerts FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role full access to alerts"
  ON site_alerts FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- SITE STATS — public read
-- ============================================
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Stats are publicly readable"
  ON site_stats FOR SELECT USING (true);

CREATE POLICY "Service role full access to stats"
  ON site_stats FOR ALL USING (auth.role() = 'service_role');
