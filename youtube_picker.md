# Building a YouTube timestamp picker with sprite-based scrubbing in React

**The best approach combines a lightweight server-side proxy (to extract YouTube's signed storyboard URLs and bypass CORS) with a client-side React component that renders sprite sheet frames via CSS `background-position`.** No existing npm package does this end-to-end — you'll compose **3–4 small libraries** with roughly 300 lines of custom code. YouTube's storyboard sprites are accessible without an API key, but their URLs contain expiring authentication tokens that must be extracted server-side from the watch page HTML. The critical trade-off is between the iframe API approach (simple but includes ads and slow seeking) and the sprite approach (fast, ad-free scrubbing but requires a server component).

---

## How YouTube's storyboard sprite system actually works

YouTube generates tiled JPEG sprite sheets for every video — these power the thumbnail preview you see when hovering over the progress bar. The sprites live on `i.ytimg.com/sb/` and come in **four resolution tiers**:

| Level | Frame size | Grid | Frames/sheet | Best for |
|-------|-----------|------|-------------|----------|
| `sb3` | 48×27 px | 10×10 | 100 | Minimap overview |
| `sb2` | 80×45 px | 10×10 | 100 | Small scrubbers |
| `sb1` | 160×90 px | 5×5 | 25 | **Standard scrubber (recommended)** |
| `sb0` | 320×180 px | 5×5 | 25 | Large preview |

The storyboard metadata is embedded as a pipe-delimited spec string inside `ytInitialPlayerResponse.storyboards.playerStoryboardSpecRenderer.spec` on every YouTube watch page. Each segment after the base URL template uses `#`-delimited fields: `width#height#count#cols#rows#interval_ms#namePattern#signature`. A typical spec string looks like this:

```
https://i.ytimg.com/sb/dQw4w9WgXcQ/storyboard3_L$L/$N.jpg?sqp=...
  |48#27#100#10#10#0#default#rs$AOn4CL...
  |80#45#102#10#10#10000#M$M#rs$AOn4CL...
  |160#90#102#5#5#10000#M$M#rs$AOn4CL...
```

The template variables `$L` (level index), `$N` (name pattern), and `$M` (sheet number) get substituted to produce final URLs like `https://i.ytimg.com/sb/dQw4w9WgXcQ/storyboard3_L2/M0.jpg?sigh=RVdv4fMs...`. The **`sqp` and `sigh` parameters are signed tokens that expire** — they can't be predicted or hard-coded. This is the fundamental reason you need a server component.

---

## The three-tier architecture decision

### Tier 1 — iframe API only (no server, limited scrubbing)

The simplest approach uses the YouTube IFrame API's `seekTo()` method with a range slider. The player loads the actual video, and seeking updates the displayed frame. This works but has drawbacks: the player loads ads, seeking is slow (network-bound), and you're constrained by YouTube's rate limits on rapid seeking. Use this only if you cannot run any server code.

```tsx
// Minimal IFrame API approach — no server needed
function useYouTubePlayer(videoId: string) {
  const playerRef = useRef<YT.Player | null>(null);
  const [duration, setDuration] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    (window as any).onYouTubeIframeAPIReady = () => {
      playerRef.current = new YT.Player('yt-hidden-player', {
        videoId,
        height: '180',
        width: '320',
        playerVars: { controls: 0, modestbranding: 1 },
        events: {
          onReady: (e) => {
            setDuration(e.target.getDuration());
            setReady(true);
          },
        },
      });
    };
    return () => { playerRef.current?.destroy(); };
  }, [videoId]);

  const seekTo = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
  }, []);

  return { duration, ready, seekTo };
}
```

### Tier 2 — sprite-based scrubbing with server proxy (recommended)

This is the best balance of UX and complexity. A server endpoint extracts the storyboard spec from YouTube, parses it into sprite URLs, and proxies the images with proper CORS headers. The client renders frames instantly using CSS `background-position` — **no video loading, no ads, instant scrubbing**.

### Tier 3 — self-generated sprites via ffmpeg

Download the video server-side, generate your own sprite sheets with ffmpeg, host on your CDN. Most reliable long-term but heaviest infrastructure. Only justified for production-scale applications with heavy usage.

**Tier 2 is the sweet spot for most projects.** The rest of this report details that implementation.

---

## Server-side: extracting and proxying storyboard data

Two npm packages handle the server-side extraction. **`@distube/ytdl-core`** (the actively maintained fork of `ytdl-core`, v4.16+) fetches the full player response including the storyboard spec. **`yt-storyboard`** parses that spec string into usable URLs. Alternatively, `youtube-dl-exec` wraps the `yt-dlp` binary and provides the most robust extraction, including storyboard formats as first-class output.

```ts
// server/storyboard.ts — Next.js API route or Express endpoint
import ytdl from '@distube/ytdl-core';

interface StoryboardData {
  videoId: string;
  duration: number;
  title: string;
  sprites: {
    url: string;
    width: number;      // per-frame width
    height: number;     // per-frame height
    cols: number;
    rows: number;
    interval: number;   // ms between frames
    sheetIndex: number;
  }[];
}

export async function getStoryboard(videoId: string): Promise<StoryboardData> {
  const info = await ytdl.getInfo(videoId);
  const spec = info.player_response?.storyboards
    ?.playerStoryboardSpecRenderer?.spec;

  if (!spec) throw new Error('No storyboard available');

  const parts = spec.split('|');
  const baseUrl = parts[0];

  // Use the highest quality level (last segment, typically 160x90)
  const bestLevel = parts.length - 1;
  const fields = parts[bestLevel].split('#');
  const [width, height, count, cols, rows, intervalMs, namePattern, sigh] =
    fields;

  const framesPerSheet = Number(cols) * Number(rows);
  const totalFrames = Number(count);
  const sheetCount = Math.ceil(totalFrames / framesPerSheet);

  const sprites = Array.from({ length: sheetCount }, (_, i) => {
    const url = baseUrl
      .replace('$L', String(bestLevel - 1))  // 0-indexed level
      .replace('$N', namePattern.replace('$M', String(i)));

    // Append signature
    const separator = url.includes('?') ? '&' : '?';
    return {
      url: `${url}${separator}sigh=${sigh}`,
      width: Number(width),
      height: Number(height),
      cols: Number(cols),
      rows: Number(rows),
      interval: Number(intervalMs),
      sheetIndex: i,
    };
  });

  return {
    videoId,
    duration: Number(info.videoDetails.lengthSeconds),
    title: info.videoDetails.title,
    sprites,
  };
}
```

For the **CORS proxy**, a Cloudflare Worker is ideal (free tier gives 100k requests/day). Alternatively, a simple Express middleware works:

```ts
// server/proxy.ts — proxies sprite images with CORS headers
import express from 'express';

const router = express.Router();

router.get('/sprite-proxy', async (req, res) => {
  const { url } = req.query;
  if (!url || !String(url).includes('i.ytimg.com')) {
    return res.status(400).send('Invalid URL');
  }

  const response = await fetch(String(url));
  const buffer = await response.arrayBuffer();

  res.set({
    'Content-Type': 'image/jpeg',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=3600',  // Cache 1hr (tokens expire)
  });
  res.send(Buffer.from(buffer));
});
```

---

## Client-side React component with full code

The core insight is that **CSS `background-position` on sprite sheets is GPU-accelerated** and gives instant frame switching — far faster than loading individual images or seeking a video player. Here's the complete implementation:

```tsx
// hooks/useYouTubeStoryboard.ts
import { useState, useEffect } from 'react';

interface SpriteInfo {
  url: string;       // Proxied URL
  width: number;
  height: number;
  cols: number;
  rows: number;
  interval: number;
  sheetIndex: number;
}

interface StoryboardState {
  sprites: SpriteInfo[];
  duration: number;
  title: string;
  loading: boolean;
  error: string | null;
}

export function useYouTubeStoryboard(videoId: string | null) {
  const [state, setState] = useState<StoryboardState>({
    sprites: [], duration: 0, title: '', loading: false, error: null,
  });

  useEffect(() => {
    if (!videoId) return;
    setState(s => ({ ...s, loading: true, error: null }));

    fetch(`/api/storyboard?videoId=${videoId}`)
      .then(r => r.json())
      .then(data => setState({
        sprites: data.sprites.map((s: SpriteInfo) => ({
          ...s,
          url: `/api/sprite-proxy?url=${encodeURIComponent(s.url)}`,
        })),
        duration: data.duration,
        title: data.title,
        loading: false,
        error: null,
      }))
      .catch(e => setState(s => ({
        ...s, loading: false, error: e.message,
      })));
  }, [videoId]);

  return state;
}

// Compute which sprite and position to show for a given timestamp
export function getFramePosition(
  timeSeconds: number,
  sprites: SpriteInfo[]
) {
  if (!sprites.length) return null;
  const { cols, rows, interval, width, height } = sprites[0];
  const framesPerSheet = cols * rows;
  const frameIntervalSec = interval / 1000;
  const frameIndex = Math.floor(timeSeconds / frameIntervalSec);
  const sheetIndex = Math.floor(frameIndex / framesPerSheet);
  const indexInSheet = frameIndex % framesPerSheet;

  const col = indexInSheet % cols;
  const row = Math.floor(indexInSheet / cols);

  const sprite = sprites[Math.min(sheetIndex, sprites.length - 1)];
  return {
    spriteUrl: sprite.url,
    backgroundPosition: `-${col * width}px -${row * height}px`,
    backgroundSize: `${cols * width}px ${rows * height}px`,
    frameWidth: width,
    frameHeight: height,
  };
}
```

```tsx
// components/YouTubeTimestampPicker.tsx
import { useState, useCallback, useRef } from 'react';
import { useYouTubeStoryboard, getFramePosition } from '../hooks/useYouTubeStoryboard';

function extractVideoId(url: string): string | null {
  const regex = /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
}

export function YouTubeTimestampPicker() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const sliderRef = useRef<HTMLInputElement>(null);

  const { sprites, duration, title, loading, error } =
    useYouTubeStoryboard(videoId);

  const handleUrlSubmit = useCallback(() => {
    const id = extractVideoId(url);
    setVideoId(id);
    setStartTime(null);
    setEndTime(null);
    setCurrentTime(0);
  }, [url]);

  const frame = getFramePosition(currentTime, sprites);

  const youtubeLink = startTime !== null && videoId
    ? `https://youtube.com/watch?v=${videoId}&t=${Math.floor(startTime)}s`
    : null;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {/* URL Input */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
          placeholder="Paste YouTube URL..."
          style={{ flex: 1, padding: '8px 12px', fontSize: 14 }}
        />
        <button onClick={handleUrlSubmit}>Load</button>
      </div>

      {loading && <p>Loading storyboard...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Sprite Frame Viewer */}
      {frame && (
        <>
          <p style={{ fontWeight: 600 }}>{title}</p>
          <div style={{
            width: frame.frameWidth * 2,   // 2x scale for 160px frames
            height: frame.frameHeight * 2,
            backgroundImage: `url(${frame.spriteUrl})`,
            backgroundPosition: frame.backgroundPosition,
            backgroundSize: frame.backgroundSize,
            backgroundRepeat: 'no-repeat',
            imageRendering: 'auto',
            transform: 'scale(2)',
            transformOrigin: 'top left',
            border: '2px solid #333',
            borderRadius: 4,
            marginBottom: 16,
          }} />

          {/* Timeline Scrubber */}
          <div style={{ marginBottom: 16 }}>
            <input
              ref={sliderRef}
              type="range"
              min={0}
              max={duration}
              step={0.1}
              value={currentTime}
              onChange={e => setCurrentTime(Number(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13,
            }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Timestamp Controls */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button onClick={() => setStartTime(currentTime)}>
              Set Start: {startTime !== null ? formatTime(startTime) : '—'}
            </button>
            <button onClick={() => setEndTime(currentTime)}>
              Set End: {endTime !== null ? formatTime(endTime) : '—'}
            </button>
          </div>

          {/* Generated Link */}
          {youtubeLink && (
            <div style={{
              padding: 12, background: '#f0f0f0',
              borderRadius: 6, fontFamily: 'monospace', fontSize: 13,
            }}>
              <a href={youtubeLink} target="_blank" rel="noopener">
                {youtubeLink}
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
```

The `background-position` approach works by treating each sprite sheet as a CSS background image. For a **160×90 frame** in a **5×5 grid**, the full sprite is 800×450 pixels. Frame index 7 (row 1, col 2) shows at `background-position: -320px -90px`. This calculation happens in `getFramePosition()` and updates on every slider tick with zero network latency.

---

## Package recommendations and what to install

No single package solves this problem end-to-end. Here is the recommended dependency stack, split by role:

**Server-side extraction** — pick one:
- **`@distube/ytdl-core`** (v4.16+) — lightweight, pure Node.js, returns the storyboard spec inside `getInfo()`. Best for most projects. Install: `npm i @distube/ytdl-core`
- **`youtube-dl-exec`** (by microlinkhq) — wraps the `yt-dlp` binary, which has the most robust and frequently updated YouTube extraction. Requires Python 3.9+. Better for reliability but heavier. Install: `npm i youtube-dl-exec`

**Storyboard spec parser** (optional):
- **`yt-storyboard`** — parses the spec string into sprite URLs. Only 5 GitHub stars and near-zero weekly downloads, but the code is straightforward. You can easily inline the ~30 lines of parsing logic instead. Install: `npm i yt-storyboard`

**Client-side player** (if you want hybrid iframe + sprite approach):
- **`plyr`** — 26k+ GitHub stars, supports `previewThumbnails` with WebVTT sprite sheets natively. Wraps YouTube's iframe player with a cleaner UI. Install: `npm i plyr`
- **`react-player`** — popular React wrapper for YouTube and other providers, but does **not** support storyboard sprites out of the box.

**Utility packages**:
- **`js-video-url-parser`** — robust YouTube URL parsing supporting all URL formats. Install: `npm i js-video-url-parser`

There is **no existing React component** that implements the full timestamp-picker-with-sprite-scrubbing flow. The closest open-source reference is [keyurparalkar/react-youtube-player-clone](https://github.com/keyurparalkar/react-youtube-player-clone) on GitHub, which implements a `FrameTooltip` component using VTT-referenced sprites with CSS `background-position`. It demonstrates the core rendering technique but doesn't include storyboard extraction or timestamp selection.

---

## CORS, legality, and the tokens problem

Three practical constraints shape every implementation decision:

**CORS is the biggest blocker.** YouTube's `i.ytimg.com` CDN does not consistently send `Access-Control-Allow-Origin` headers. You can load sprites in `<img>` tags (HTML images bypass CORS), but JavaScript `fetch()` calls from a browser will fail. This means you **cannot fetch sprites client-side** — you need a server proxy. A Cloudflare Worker (free tier: 100k requests/day) is the lightest solution. Standard YouTube thumbnails (`i.ytimg.com/vi/{ID}/mqdefault.jpg`) do load freely and work without a proxy, but they only give you 4 fixed frames per video — not enough for scrubbing.

**Signed tokens expire.** Every storyboard URL includes `sqp` and `sigh` parameters that are session-specific authentication tokens. They typically expire within **a few hours**. Your server must extract fresh URLs per request and should cache them with a TTL of ~1 hour. Never store these URLs permanently.

**YouTube's Terms of Service are a gray area.** There is no public API for storyboard sprites. Accessing them involves parsing YouTube's internal player response, which YouTube does not officially support. Tools like `yt-dlp` and `ytdl-core` do this routinely and have massive user bases, but YouTube has periodically broken these tools by changing their internal APIs. For a production application, consider that YouTube could block or change this access at any time. The **safest legal approach** for a commercial product is using the official YouTube Data API v3 for metadata and the IFrame API for playback, accepting the trade-offs in scrubbing UX.

---

## Putting it all together: the recommended stack

For a production-quality timestamp picker, combine these layers:

```
┌──────────────────────────────────────────────┐
│  React Client                                │
│  ┌────────────┐  ┌──────────────────────┐    │
│  │ URL Input  │→ │ useYouTubeStoryboard │    │
│  └────────────┘  └──────────┬───────────┘    │
│                             ↓                │
│  ┌─────────────────────────────────────┐     │
│  │ SpriteFrameViewer                   │     │
│  │ (CSS background-position on <div>)  │     │
│  └─────────────────┬───────────────────┘     │
│                    ↓                         │
│  ┌──────────────────────────────┐            │
│  │ Range slider + Set Start/End │            │
│  │ → generates ?t= link        │            │
│  └──────────────────────────────┘            │
└──────────────────┬───────────────────────────┘
                   ↓ /api/storyboard + /api/sprite-proxy
┌──────────────────────────────────────────────┐
│  Server (Next.js API / Express / CF Worker)  │
│  @distube/ytdl-core → parse spec → proxy JPG │
└──────────────────────────────────────────────┘
```

**Install these four packages** to get started:

```bash
# Server-side
npm i @distube/ytdl-core    # Storyboard spec extraction
npm i js-video-url-parser   # Robust YouTube URL parsing

# Client-side (optional, if you want hybrid iframe+sprites)
npm i plyr                  # Player with previewThumbnails support
npm i plyr-react            # React wrapper for Plyr
```

The `useYouTubeStoryboard` hook and `YouTubeTimestampPicker` component from the code above give you a working foundation. The sprite rendering path — server extracts spec, proxies JPGs, client renders via `background-position` — delivers the instant, ad-free scrubbing experience the requirements call for, at the cost of a thin server layer to handle YouTube's authentication tokens and CORS restrictions.