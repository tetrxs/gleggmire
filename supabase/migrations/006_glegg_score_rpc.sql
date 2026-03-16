-- Live Glegg-Score computation: returns per-user aggregated score components.
-- Called via supabase.rpc('compute_glegg_score_components').

CREATE OR REPLACE FUNCTION compute_glegg_score_components()
RETURNS TABLE (
  user_id UUID,
  approved_term_count INT,
  approved_def_count INT,
  def_vote_sum INT,
  def_context_count INT,
  comment_count INT,
  comment_attachment_count INT
) AS $$
BEGIN
  RETURN QUERY
  WITH term_stats AS (
    SELECT created_by AS uid, COUNT(*)::INT AS cnt
    FROM glossary_terms
    WHERE status = 'approved'
    GROUP BY created_by
  ),
  def_stats AS (
    SELECT
      submitted_by AS uid,
      COUNT(*)::INT AS cnt,
      COALESCE(SUM(upvotes - downvotes), 0)::INT AS vote_sum,
      COUNT(*) FILTER (WHERE origin_context IS NOT NULL AND origin_context != '')::INT AS ctx_cnt
    FROM term_definitions
    WHERE status = 'approved'
    GROUP BY submitted_by
  ),
  comment_stats AS (
    SELECT
      c.user_id AS uid,
      COUNT(*)::INT AS cnt,
      COUNT(*) FILTER (WHERE c.attachment_type IS NOT NULL)::INT AS attach_cnt
    FROM comments c
    WHERE c.user_id IS NOT NULL
    GROUP BY c.user_id
  )
  SELECT
    u.id AS user_id,
    COALESCE(ts.cnt, 0) AS approved_term_count,
    COALESCE(ds.cnt, 0) AS approved_def_count,
    COALESCE(ds.vote_sum, 0) AS def_vote_sum,
    COALESCE(ds.ctx_cnt, 0) AS def_context_count,
    COALESCE(cs.cnt, 0) AS comment_count,
    COALESCE(cs.attach_cnt, 0) AS comment_attachment_count
  FROM users u
  LEFT JOIN term_stats ts ON ts.uid = u.id
  LEFT JOIN def_stats ds ON ds.uid = u.id
  LEFT JOIN comment_stats cs ON cs.uid = u.id
  WHERE u.is_banned = FALSE;
END;
$$ LANGUAGE plpgsql STABLE;
