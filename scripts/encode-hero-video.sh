#!/usr/bin/env bash
#
# Encode the homepage hero video, which is scrubbed by scroll position.
# Usage: ./scripts/encode-hero-video.sh <input-video> [output-dir] [gop]
#
# Produces, without audio:
#   hero.webm   VP9  — Chrome, Edge, Firefox
#   hero.mp4    H.264 + faststart — Safari / iOS fallback
#   poster.webp first frame (scroll position 0), shown until the video has loaded
#
# Scrubbing seeks on every scroll tick, and each seek decodes from the previous
# keyframe, so a short GOP (keyframe every few frames) keeps it smooth.

set -euo pipefail

INPUT="${1:?Usage: $0 <input-video> [output-dir] [gop]}"
OUTPUT_DIR="${2:-public/hero}"
GOP="${3:-4}"

command -v ffmpeg >/dev/null || { echo "ffmpeg is required (brew install ffmpeg)"; exit 1; }
[ -f "$INPUT" ] || { echo "Input not found: $INPUT"; exit 1; }

mkdir -p "$OUTPUT_DIR"

echo "Encoding hero.mp4 (H.264, keyframe every $GOP frames)..."
ffmpeg -v error -y -i "$INPUT" -an \
  -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p \
  -g "$GOP" -keyint_min "$GOP" -sc_threshold 0 -bf 0 -movflags +faststart \
  "$OUTPUT_DIR/hero.mp4"

echo "Encoding hero.webm (VP9, keyframe every $GOP frames)..."
ffmpeg -v error -y -i "$INPUT" -an \
  -c:v libvpx-vp9 -b:v 0 -crf 36 -g "$GOP" -row-mt 1 -deadline good -cpu-used 2 \
  "$OUTPUT_DIR/hero.webm"

echo "Extracting poster.webp..."
ffmpeg -v error -y -i "$INPUT" -vframes 1 -c:v libwebp -quality 80 "$OUTPUT_DIR/poster.webp"

ls -lh "$OUTPUT_DIR"
