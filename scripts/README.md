# Scripts

Automation scripts for the CodeLovers project.

## Extract Frames Script

Extracts frames from a video file for use in GSAP scroll animations.

### Requirements

- ffmpeg (with ffprobe)
  - **macOS**: `brew install ffmpeg`
  - **Ubuntu/Debian**: `sudo apt-get install ffmpeg`
  - **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html)

### Usage

#### Using npm (Recommended)

```bash
# Extract frames from default video (public/animate.mp4)
npm run extract-frames

# Or with custom parameters
npm run extract-frames -- [input-video] [output-dir] [quality] [scale]
```

#### Direct Script Usage

```bash
# Basic usage (uses defaults)
./scripts/extract-frames.sh

# Custom video source
./scripts/extract-frames.sh public/my-video.mp4

# Custom output directory
./scripts/extract-frames.sh public/animate.mp4 public/custom-frames

# Custom quality (1-31, where 2 is high quality)
./scripts/extract-frames.sh public/animate.mp4 public/frames 5

# Custom scale (width, maintains aspect ratio)
./scripts/extract-frames.sh public/animate.mp4 public/frames 2 1920:-1
```

### Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `input-video` | `public/animate.mp4` | Path to source video file |
| `output-dir` | `public/frames` | Directory for extracted frames |
| `quality` | `2` | JPEG quality (1=best, 31=worst) |
| `scale` | `1920:-1` | Scale width (maintains aspect ratio) |

### What It Does

1. ✅ Checks for ffmpeg installation
2. ✅ Validates input video exists
3. ✅ Gets video metadata (duration, fps, frame count)
4. ✅ Creates output directory
5. ✅ Removes old frames (if any)
6. ✅ Extracts frames as JPEGs (`frame-001.jpg`, `frame-002.jpg`, etc.)
7. ✅ Auto-updates `frameCount` in HeroSection.tsx
8. ✅ Shows extraction summary

### Example Output

```
Starting frame extraction...
Input: public/animate.mp4
Output: public/frames
Quality: 2 (1=best, 31=worst)

Getting video information...
Duration: 8.000000s
FPS: 24/1
Total Frames: 192

Extracting frames...

✓ Frame extraction complete!
Extracted 192 frames to public/frames

First frame: frame-001.jpg
Last frame: frame-192.jpg

Total size: 21M

Updating frameCount in HeroSection.tsx...
✓ Updated frameCount to 192

Done! 🎉
```

### Tips

- **Quality**: Use `2` for production, `5-10` for development/testing
- **Scale**: Use `1920:-1` for HD, `1280:-1` for lower resolution
- **Performance**: Fewer frames = faster load, but less smooth animation
- **File Size**: Higher quality = larger files but better visuals

### Troubleshooting

**Error: ffmpeg is not installed**
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg
```

**Error: Input video not found**
- Check the video path is correct
- Make sure video is in the `public` directory
- Use relative path from project root

**Frames not updating in browser**
- Clear browser cache
- Hard refresh (Cmd+Shift+R on macOS, Ctrl+Shift+R on Windows/Linux)
- Check browser console for loading errors
