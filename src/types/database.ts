// Database types matching the gleggmire.net Supabase schema

export type TermStatus = "pending" | "approved" | "disputed" | "locked";

export type CommentEntityType = "term" | "clip";

export type AttachmentType = "image" | "gif" | "youtube" | "twitch";

export type ClipSource = "youtube" | "twitch";

export type VoteType = "up" | "down";

export type ReactionType =
  | "W"
  | "L"
  | "Ratio"
  | "Cope"
  | "Seethe"
  | "Geglaggmirt"
  | "Kek";

export interface GlossaryTerm {
  id: string;
  slug: string;
  term: string;
  phonetic?: string;
  word_type?: string;
  status: TermStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_secret: boolean;
  verified_by_gleggmire: boolean;
}

export interface TermDefinition {
  id: string;
  term_id: string;
  definition: string;
  example_sentence: string;
  origin_context?: string;
  submitted_by: string;
  upvotes: number;
  downvotes: number;
  cope_meter_sum: number;
  cope_meter_count: number;
}

export interface Comment {
  id: string;
  parent_id?: string;
  entity_type: CommentEntityType;
  entity_id: string;
  user_id?: string;
  is_anonymous: boolean;
  text?: string;
  attachment_type?: AttachmentType;
  attachment_url?: string;
  attachment_start_seconds?: number;
  upvotes: number;
  downvotes: number;
  created_at: string;
  timecode_seconds?: number;
}

export interface Clip {
  id: string;
  source: ClipSource;
  external_url: string;
  external_id: string;
  title: string;
  duration_seconds: number;
  thumbnail_url: string;
  submitted_by: string;
  submitted_at: string;
  upvotes: number;
}

export interface ClipTermLink {
  clip_id: string;
  term_id: string;
  start_seconds?: number;
  linked_by: string;
  upvotes: number;
}

export interface User {
  id: string;
  discord_id: string;
  username: string;
  avatar_url?: string;
  glegg_score: number;
  is_gleggmire: boolean;
  is_admin: boolean;
  is_moderator: boolean;
  is_banned: boolean;
  banned_by?: string;
  banned_at?: string;
  ban_reason?: string;
  joined_at: string;
}

export interface CommentIpLog {
  id: string;
  comment_id: string;
  ip_address: string;
  user_agent?: string;
  submitted_at: string;
  delete_at: string;
}

export interface TermAlias {
  id: string;
  term_id: string;
  alias: string;
}

export interface TermTag {
  id: string;
  term_id: string;
  tag: string;
}

export interface TermEditHistory {
  id: string;
  term_id: string;
  edited_by: string;
  field_changed: string;
  old_value: string;
  new_value: string;
  reason?: string;
  edited_at: string;
}

export interface Vote {
  id: string;
  user_id: string;
  entity_type: string;
  entity_id: string;
  vote_type: VoteType;
  created_at: string;
}

export interface Reaction {
  id: string;
  user_id: string;
  comment_id: string;
  reaction_type: ReactionType;
  created_at: string;
}

export interface Badge {
  id: string;
  user_id: string;
  badge_type: string;
  earned_at: string;
}
