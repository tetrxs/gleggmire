import { NextRequest, NextResponse } from "next/server";
import { apiRateLimit, checkRateLimit } from "@/lib/rate-limit";

interface OEmbedCacheEntry {
  data: OEmbedResponse;
  expiresAt: number;
}

interface OEmbedResponse {
  title: string;
  thumbnail_url?: string;
  duration?: number;
  provider: string;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const cache = new Map<string, OEmbedCacheEntry>();

function isYouTubeUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(url);
}

function isTwitchUrl(url: string): boolean {
  return /^https?:\/\/(www\.|clips\.)?twitch\.tv\//i.test(url);
}

function extractTwitchSlug(url: string): string | null {
  // Matches clips.twitch.tv/ClipSlug or twitch.tv/channel/clip/ClipSlug
  const clipMatch = url.match(
    /clips\.twitch\.tv\/([A-Za-z0-9_-]+)|twitch\.tv\/\w+\/clip\/([A-Za-z0-9_-]+)/
  );
  return clipMatch ? (clipMatch[1] ?? clipMatch[2] ?? null) : null;
}

function cleanExpiredCache() {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (entry.expiresAt < now) {
      cache.delete(key);
    }
  }
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await checkRateLimit(apiRateLimit, ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 }
    );
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return NextResponse.json(
      { error: "Invalid URL format" },
      { status: 400 }
    );
  }

  // Check cache
  const cached = cache.get(url);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.data);
  }

  // Periodically clean expired entries
  if (cache.size > 100) {
    cleanExpiredCache();
  }

  try {
    let result: OEmbedResponse;

    if (isYouTubeUrl(url)) {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
      const response = await fetch(oembedUrl);

      if (!response.ok) {
        return NextResponse.json(
          { error: "Failed to fetch YouTube oEmbed data" },
          { status: 502 }
        );
      }

      const data = await response.json();
      result = {
        title: data.title ?? "",
        thumbnail_url: data.thumbnail_url,
        provider: "youtube",
      };
    } else if (isTwitchUrl(url)) {
      const slug = extractTwitchSlug(url);
      result = {
        title: slug ? `Twitch Clip: ${slug}` : "Twitch Clip",
        thumbnail_url: undefined,
        provider: "twitch",
      };
    } else {
      return NextResponse.json(
        { error: "Unsupported URL. Only YouTube and Twitch URLs are supported." },
        { status: 400 }
      );
    }

    // Store in cache
    cache.set(url, {
      data: result,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch oEmbed data" },
      { status: 500 }
    );
  }
}
