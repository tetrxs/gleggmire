-- gleggmire.net — Initial Database Schema
-- Based on specification document

-- UUID generation uses built-in gen_random_uuid() (Supabase/PG14+)

-- ============================================
-- USERS
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  glegg_score INTEGER DEFAULT 0,
  is_gleggmire BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  is_moderator BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,
  banned_by UUID REFERENCES users(id),
  banned_at TIMESTAMPTZ,
  ban_reason TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_discord_id ON users(discord_id);
CREATE INDEX idx_users_glegg_score ON users(glegg_score DESC);

-- ============================================
-- GLOSSARY TERMS
-- ============================================
CREATE TABLE glossary_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  term TEXT NOT NULL,
  phonetic TEXT,
  word_type TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'disputed', 'locked')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_secret BOOLEAN DEFAULT FALSE,
  verified_by_gleggmire BOOLEAN DEFAULT FALSE,
  lock_reason TEXT,
  locked_by UUID REFERENCES users(id)
);

CREATE INDEX idx_terms_slug ON glossary_terms(slug);
CREATE INDEX idx_terms_status ON glossary_terms(status);
CREATE INDEX idx_terms_created_at ON glossary_terms(created_at DESC);

-- ============================================
-- TERM DEFINITIONS (up to 3 per term, Urban Dictionary style)
-- ============================================
CREATE TABLE term_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term_id UUID NOT NULL REFERENCES glossary_terms(id) ON DELETE CASCADE,
  definition TEXT NOT NULL,
  example_sentence TEXT NOT NULL,
  origin_context TEXT,
  submitted_by UUID REFERENCES users(id),
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  cope_meter_sum INTEGER DEFAULT 0,
  cope_meter_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_definitions_term_id ON term_definitions(term_id);

-- ============================================
-- TERM ALIASES
-- ============================================
CREATE TABLE term_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term_id UUID NOT NULL REFERENCES glossary_terms(id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  alias_normalized TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_aliases_term_id ON term_aliases(term_id);
CREATE INDEX idx_aliases_normalized ON term_aliases(alias_normalized);

-- ============================================
-- TERM TAGS
-- ============================================
CREATE TABLE term_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term_id UUID NOT NULL REFERENCES glossary_terms(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  UNIQUE(term_id, tag)
);

CREATE INDEX idx_tags_term_id ON term_tags(term_id);
CREATE INDEX idx_tags_tag ON term_tags(tag);

-- ============================================
-- TERM EDIT HISTORY (Wikipedia-style)
-- ============================================
CREATE TABLE term_edit_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term_id UUID NOT NULL REFERENCES glossary_terms(id) ON DELETE CASCADE,
  edited_by UUID REFERENCES users(id),
  field_changed TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  reason TEXT,
  edited_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_edit_history_term_id ON term_edit_history(term_id);
CREATE INDEX idx_edit_history_edited_at ON term_edit_history(edited_at DESC);

-- ============================================
-- CLIPS
-- ============================================
CREATE TABLE clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL CHECK (source IN ('youtube', 'twitch')),
  external_url TEXT NOT NULL,
  external_id TEXT NOT NULL,
  title TEXT NOT NULL,
  duration_seconds INTEGER,
  thumbnail_url TEXT,
  submitted_by UUID REFERENCES users(id),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  upvotes INTEGER DEFAULT 0
);

CREATE INDEX idx_clips_external_id ON clips(external_id);
CREATE INDEX idx_clips_submitted_at ON clips(submitted_at DESC);
CREATE INDEX idx_clips_upvotes ON clips(upvotes DESC);

-- ============================================
-- CLIP-TERM LINKS (Many-to-Many)
-- ============================================
CREATE TABLE clip_term_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clip_id UUID NOT NULL REFERENCES clips(id) ON DELETE CASCADE,
  term_id UUID NOT NULL REFERENCES glossary_terms(id) ON DELETE CASCADE,
  start_seconds INTEGER,
  linked_by UUID REFERENCES users(id),
  upvotes INTEGER DEFAULT 0,
  UNIQUE(clip_id, term_id)
);

CREATE INDEX idx_clip_term_clip ON clip_term_links(clip_id);
CREATE INDEX idx_clip_term_term ON clip_term_links(term_id);

-- ============================================
-- COMMENTS
-- ============================================
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('term', 'clip')),
  entity_id UUID NOT NULL,
  user_id UUID REFERENCES users(id),
  is_anonymous BOOLEAN DEFAULT FALSE,
  text TEXT,
  attachment_type TEXT CHECK (attachment_type IN ('image', 'gif', 'youtube', 'twitch')),
  attachment_url TEXT,
  attachment_start_seconds INTEGER,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  timecode_seconds INTEGER,
  is_hidden BOOLEAN DEFAULT FALSE,
  hidden_by UUID REFERENCES users(id),
  CONSTRAINT comment_has_content CHECK (text IS NOT NULL OR attachment_url IS NOT NULL)
);

CREATE INDEX idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- ============================================
-- COMMENT IP LOG (GDPR — 90 day auto-delete)
-- ============================================
CREATE TABLE comment_ip_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  delete_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '90 days')
);

CREATE INDEX idx_ip_log_comment ON comment_ip_log(comment_id);
CREATE INDEX idx_ip_log_delete_at ON comment_ip_log(delete_at);

-- ============================================
-- VOTES (unified voting table)
-- ============================================
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('definition', 'comment', 'clip', 'clip_term_link')),
  entity_id UUID NOT NULL,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, entity_type, entity_id)
);

CREATE INDEX idx_votes_entity ON votes(entity_type, entity_id);
CREATE INDEX idx_votes_user ON votes(user_id);

-- ============================================
-- COPE-O-METER VOTES (separate from up/down votes)
-- ============================================
CREATE TABLE cope_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  definition_id UUID NOT NULL REFERENCES term_definitions(id) ON DELETE CASCADE,
  value INTEGER NOT NULL CHECK (value >= 0 AND value <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, definition_id)
);

CREATE INDEX idx_cope_votes_definition ON cope_votes(definition_id);

-- ============================================
-- REACTIONS (community-specific emoji reactions)
-- ============================================
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('W', 'L', 'Ratio', 'Cope', 'Seethe', 'Geglaggmirt', 'Kek')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, comment_id, reaction_type)
);

CREATE INDEX idx_reactions_comment ON reactions(comment_id);

-- ============================================
-- BADGES
-- ============================================
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_type)
);

CREATE INDEX idx_badges_user ON badges(user_id);

-- ============================================
-- MODERATION LOG (immutable)
-- ============================================
CREATE TABLE moderation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator_id UUID NOT NULL REFERENCES users(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mod_log_moderator ON moderation_log(moderator_id);
CREATE INDEX idx_mod_log_created_at ON moderation_log(created_at DESC);

-- ============================================
-- DISPUTES (Bestreitungs-System)
-- ============================================
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term_id UUID NOT NULL REFERENCES glossary_terms(id) ON DELETE CASCADE,
  started_by UUID NOT NULL REFERENCES users(id),
  reason TEXT,
  votes_for INTEGER DEFAULT 0,
  votes_against INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'confirmed', 'rejected')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES users(id)
);

CREATE INDEX idx_disputes_term ON disputes(term_id);
CREATE INDEX idx_disputes_status ON disputes(status);

-- ============================================
-- DELETION PETITIONS (Troll feature — always fail)
-- ============================================
CREATE TABLE deletion_petitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term_id UUID NOT NULL REFERENCES glossary_terms(id) ON DELETE CASCADE,
  started_by UUID NOT NULL REFERENCES users(id),
  reason TEXT NOT NULL,
  vote_count INTEGER DEFAULT 1,
  failed_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WEEKLY CHALLENGES
-- ============================================
CREATE TABLE weekly_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT FALSE
);

-- ============================================
-- TROLL OF THE MONTH
-- ============================================
CREATE TABLE troll_of_month (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  nominated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month, year)
);

-- ============================================
-- BREAKING NEWS / ALERTS
-- ============================================
CREATE TABLE site_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- ============================================
-- VISIT COUNTER (starts at 69420)
-- ============================================
CREATE TABLE site_stats (
  key TEXT PRIMARY KEY,
  value BIGINT DEFAULT 0
);

INSERT INTO site_stats (key, value) VALUES ('visit_count', 69420);

-- ============================================
-- SYSTEM USER for starter data
-- ============================================
INSERT INTO users (id, discord_id, username, glegg_score, is_gleggmire, is_admin)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'system',
  'Gleggmire-System',
  0,
  FALSE,
  FALSE
);
