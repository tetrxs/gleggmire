import type { Clip, ClipTermLink } from "@/types/database";

export interface MockClipData {
  clip: Clip;
  termLinks: ClipTermLink[];
  linkedTerms: { id: string; term: string; slug: string }[];
  channelName: string;
  startSeconds: number;
  commentCount: number;
  badges: ("hall-of-fame" | "clip-der-woche")[];
  addedByUsername: string;
}

export const MOCK_CLIPS: MockClipData[] = [
  {
    clip: {
      id: "clip-1",
      source: "youtube",
      external_url: "https://www.youtube.com/watch?v=bJGv-LhdIPE",
      external_id: "bJGv-LhdIPE",
      title: "Gleggmire rastet komplett aus",
      duration_seconds: 847,
      thumbnail_url: "",
      submitted_by: "user-1",
      submitted_at: "2025-11-15T20:30:00Z",
      upvotes: 142,
    },
    termLinks: [
      {
        clip_id: "clip-1",
        term_id: "1",
        start_seconds: 124,
        linked_by: "user-1",
        upvotes: 38,
      },
      {
        clip_id: "clip-1",
        term_id: "5",
        start_seconds: 124,
        linked_by: "user-2",
        upvotes: 15,
      },
    ],
    linkedTerms: [
      { id: "1", term: "Geglaggmirt", slug: "geglaggmirt" },
      { id: "5", term: "Komplett", slug: "komplett" },
    ],
    channelName: "Gleggmire",
    startSeconds: 124,
    commentCount: 23,
    badges: ["hall-of-fame"],
    addedByUsername: "GleggFan42",
  },
  {
    clip: {
      id: "clip-2",
      source: "youtube",
      external_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      external_id: "dQw4w9WgXcQ",
      title: "Der legendaere Kanackentaschen-Moment",
      duration_seconds: 312,
      thumbnail_url: "",
      submitted_by: "user-2",
      submitted_at: "2025-12-01T14:15:00Z",
      upvotes: 89,
    },
    termLinks: [
      {
        clip_id: "clip-2",
        term_id: "2",
        start_seconds: 45,
        linked_by: "user-2",
        upvotes: 22,
      },
    ],
    linkedTerms: [{ id: "2", term: "Kanackentasche", slug: "kanackentasche" }],
    channelName: "Gleggmire",
    startSeconds: 45,
    commentCount: 11,
    badges: ["clip-der-woche"],
    addedByUsername: "SnenchMaster",
  },
  {
    clip: {
      id: "clip-3",
      source: "youtube",
      external_url: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
      external_id: "LXb3EKWsInQ",
      title: "Lungen-Torpedo Compilation #3",
      duration_seconds: 1205,
      thumbnail_url: "",
      submitted_by: "user-3",
      submitted_at: "2026-01-10T09:00:00Z",
      upvotes: 67,
    },
    termLinks: [
      {
        clip_id: "clip-3",
        term_id: "3",
        start_seconds: 0,
        linked_by: "user-3",
        upvotes: 19,
      },
    ],
    linkedTerms: [{ id: "3", term: "Lungen-Torpedo", slug: "lungen-torpedo" }],
    channelName: "GleggClips",
    startSeconds: 0,
    commentCount: 7,
    badges: [],
    addedByUsername: "LungenLord",
  },
  {
    clip: {
      id: "clip-4",
      source: "twitch",
      external_url: "https://www.twitch.tv/videos/2012345678",
      external_id: "2012345678",
      title: "Snench des Jahres — Live Reaktion",
      duration_seconds: 540,
      thumbnail_url: "",
      submitted_by: "user-4",
      submitted_at: "2026-02-20T18:45:00Z",
      upvotes: 51,
    },
    termLinks: [
      {
        clip_id: "clip-4",
        term_id: "4",
        start_seconds: 78,
        linked_by: "user-4",
        upvotes: 12,
      },
      {
        clip_id: "clip-4",
        term_id: "1",
        start_seconds: 210,
        linked_by: "user-1",
        upvotes: 8,
      },
    ],
    linkedTerms: [
      { id: "4", term: "Snench", slug: "snench" },
      { id: "1", term: "Geglaggmirt", slug: "geglaggmirt" },
    ],
    channelName: "Gleggmire",
    startSeconds: 78,
    commentCount: 14,
    badges: [],
    addedByUsername: "CopeSeethe99",
  },
  {
    clip: {
      id: "clip-5",
      source: "youtube",
      external_url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
      external_id: "9bZkp7q19f0",
      title: "Auf Glegg durch die Nacht — Best Of",
      duration_seconds: 1800,
      thumbnail_url: "",
      submitted_by: "user-5",
      submitted_at: "2026-03-05T22:00:00Z",
      upvotes: 103,
    },
    termLinks: [
      {
        clip_id: "clip-5",
        term_id: "6",
        start_seconds: 330,
        linked_by: "user-5",
        upvotes: 27,
      },
      {
        clip_id: "clip-5",
        term_id: "5",
        start_seconds: 600,
        linked_by: "user-2",
        upvotes: 14,
      },
    ],
    linkedTerms: [
      { id: "6", term: "Auf Glegg", slug: "auf-glegg" },
      { id: "5", term: "Komplett", slug: "komplett" },
    ],
    channelName: "Gleggmire",
    startSeconds: 330,
    commentCount: 19,
    badges: ["hall-of-fame"],
    addedByUsername: "NachtGlegg",
  },
];
