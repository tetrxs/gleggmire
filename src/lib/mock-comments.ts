import type { Comment, ReactionType } from "@/types/database";

export interface MockCommentReaction {
  type: ReactionType;
  count: number;
}

export interface CommentWithMeta extends Comment {
  username?: string;
  replies?: CommentWithMeta[];
  reactions?: MockCommentReaction[];
}

export const MOCK_COMMENTS: CommentWithMeta[] = [
  {
    id: "c1",
    entity_type: "term",
    entity_id: "t1",
    user_id: "u1",
    username: "GleggFan2024",
    is_anonymous: false,
    text: "Alter, dieser Begriff hat mein Leben veraendert. Ich benutze ihn jetzt taeglich im Buero und keiner versteht mich. Perfekt.",
    upvotes: 14,
    downvotes: 2,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    reactions: [
      { type: "W", count: 8 },
      { type: "Kek", count: 3 },
      { type: "Geglaggmirt", count: 1 },
    ],
    replies: [
      {
        id: "c1r1",
        parent_id: "c1",
        entity_type: "term",
        entity_id: "t1",
        user_id: "u2",
        username: "CopeMeister69",
        is_anonymous: false,
        text: "Dein Chef so: \"Was hat er gesagt?\" Du so: \"Sie wuerden es nicht verstehen.\"",
        upvotes: 9,
        downvotes: 0,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        reactions: [
          { type: "Kek", count: 5 },
        ],
      },
      {
        id: "c1r2",
        parent_id: "c1",
        entity_type: "term",
        entity_id: "t1",
        is_anonymous: true,
        upvotes: 3,
        downvotes: 1,
        text: "Ratio. Der Begriff ist cringe.",
        created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        reactions: [
          { type: "Ratio", count: 12 },
          { type: "Cope", count: 4 },
          { type: "L", count: 7 },
        ],
      },
    ],
  },
  {
    id: "c2",
    entity_type: "term",
    entity_id: "t1",
    user_id: "u3",
    username: "DerEchteGleggmire",
    is_anonymous: false,
    text: "Hier der Moment, wo alles begann:",
    attachment_type: "youtube",
    attachment_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    attachment_start_seconds: 42,
    upvotes: 22,
    downvotes: 1,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    reactions: [
      { type: "W", count: 15 },
      { type: "Geglaggmirt", count: 9 },
      { type: "Kek", count: 4 },
    ],
    replies: [
      {
        id: "c2r1",
        parent_id: "c2",
        entity_type: "term",
        entity_id: "t1",
        user_id: "u4",
        username: "SeetheLord",
        is_anonymous: false,
        text: "Klassiker. Dieses Video hat Generationen gepraegt.",
        upvotes: 5,
        downvotes: 0,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        reactions: [
          { type: "W", count: 2 },
        ],
      },
    ],
  },
  {
    id: "c3",
    entity_type: "term",
    entity_id: "t1",
    is_anonymous: true,
    text: "Ich bin in diesem Bild und es gefaellt mir nicht.",
    attachment_type: "image",
    attachment_url: "https://placehold.co/400x300/1a1a2e/e0e0e0?text=Gleggmire+Moment",
    upvotes: 7,
    downvotes: 3,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    reactions: [
      { type: "Cope", count: 6 },
      { type: "Seethe", count: 3 },
      { type: "Kek", count: 2 },
    ],
  },
  {
    id: "c4",
    entity_type: "term",
    entity_id: "t1",
    user_id: "u5",
    username: "KartoffelKaempfer",
    is_anonymous: false,
    text: "Unpopulaere Meinung: Dieser Begriff wird voellig ueberbewertet. Fight me.",
    upvotes: 4,
    downvotes: 18,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    reactions: [
      { type: "L", count: 11 },
      { type: "Ratio", count: 8 },
      { type: "Seethe", count: 5 },
      { type: "Cope", count: 3 },
    ],
  },
  {
    id: "c5",
    entity_type: "term",
    entity_id: "t1",
    user_id: "u6",
    username: "NudelSuppenFan",
    is_anonymous: false,
    attachment_type: "gif",
    attachment_url: "https://placehold.co/320x240/2a2a3e/e0e0e0?text=Reaction+GIF",
    upvotes: 11,
    downvotes: 0,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    reactions: [
      { type: "Kek", count: 7 },
      { type: "W", count: 3 },
    ],
  },
  {
    id: "c6",
    entity_type: "term",
    entity_id: "t1",
    is_anonymous: true,
    text: "Twitch Clip dazu fuer die Nachwelt:",
    attachment_type: "twitch",
    attachment_url: "https://clips.twitch.tv/ExampleClip12345",
    upvotes: 6,
    downvotes: 1,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    reactions: [
      { type: "Geglaggmirt", count: 4 },
      { type: "W", count: 2 },
    ],
  },
];
