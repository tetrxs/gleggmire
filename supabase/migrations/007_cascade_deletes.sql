-- gleggmire.net — Cascade Deletes
-- When a term is deleted, all its comments are deleted too.
-- When a user is deleted, all their content is deleted too.

-- ============================================
-- 1. Clean up orphaned comments (comments for deleted terms)
-- ============================================
DELETE FROM comments
WHERE entity_type = 'term'
  AND entity_id NOT IN (SELECT id FROM glossary_terms);

-- ============================================
-- 2. Add FK from comments.entity_id to glossary_terms.id
--    for term-type comments, with ON DELETE CASCADE
-- ============================================

-- We can't add a conditional FK directly (only for entity_type = 'term').
-- Instead, we add a trigger that deletes comments when a term is deleted.
CREATE OR REPLACE FUNCTION delete_term_comments()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM comments WHERE entity_type = 'term' AND entity_id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_term_comments
  BEFORE DELETE ON glossary_terms
  FOR EACH ROW
  EXECUTE FUNCTION delete_term_comments();

-- ============================================
-- 3. Cascade user deletion to their content
--    (terms, definitions, comments)
-- ============================================

-- glossary_terms.created_by: drop existing FK, re-add with CASCADE
ALTER TABLE glossary_terms
  DROP CONSTRAINT IF EXISTS glossary_terms_created_by_fkey;
ALTER TABLE glossary_terms
  ADD CONSTRAINT glossary_terms_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE;

-- term_definitions.submitted_by: drop existing FK, re-add with CASCADE
ALTER TABLE term_definitions
  DROP CONSTRAINT IF EXISTS term_definitions_submitted_by_fkey;
ALTER TABLE term_definitions
  ADD CONSTRAINT term_definitions_submitted_by_fkey
  FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE CASCADE;

-- comments.user_id: drop existing FK, re-add with CASCADE
ALTER TABLE comments
  DROP CONSTRAINT IF EXISTS comments_user_id_fkey;
ALTER TABLE comments
  ADD CONSTRAINT comments_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- clips.submitted_by: drop existing FK, re-add with CASCADE
ALTER TABLE clips
  DROP CONSTRAINT IF EXISTS clips_submitted_by_fkey;
ALTER TABLE clips
  ADD CONSTRAINT clips_submitted_by_fkey
  FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE CASCADE;
