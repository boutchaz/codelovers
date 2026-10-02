# Scripts

Automation scripts for the CodeLovers project.

## Encode Hero Video

The homepage hero pins on scroll and scrubs a video (`src/scripts/hero.ts` maps scroll progress to `video.currentTime`). This script encodes it into `public/hero/`:

| File | Purpose |
|------|---------|
| `hero.webm` | VP9, used by Chrome, Edge and Firefox |
| `hero.mp4` | H.264 with `+faststart`, fallback for Safari / iOS |
| `poster.webp` | First frame, shown until the video has loaded |

Audio is stripped, and every encode uses a short GOP (a keyframe every few frames): each seek decodes from the previous keyframe, so long GOPs make scrubbing stutter.

### Requirements

- ffmpeg (with ffprobe, libx264, libvpx-vp9, libwebp) — `brew install ffmpeg`

### Usage

```bash
bun run encode-hero-video -- path/to/master.mp4

# Custom output directory and GOP (frames between keyframes)
./scripts/encode-hero-video.sh path/to/master.mp4 public/hero 4
```

### Tips

- Don't upscale: encode at the master's native resolution. A 10 s 720p source gives ~2.3 MB WebM / ~2.7 MB MP4 at GOP 4.
- Lower GOP = smoother scrubbing but bigger files. `8` roughly saves 30% at the cost of choppier fast scrolls.
- The video sits under a dark gradient overlay, so `-crf` can stay fairly aggressive.
