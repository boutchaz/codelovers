#!/bin/bash

# Script to extract frames from video for GSAP scroll animation
# Usage: ./scripts/extract-frames.sh [input-video] [output-dir] [quality]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
INPUT_VIDEO="${1:-public/animate.mp4}"
OUTPUT_DIR="${2:-public/frames}"
QUALITY="${3:-2}" # 1-31 (2 is high quality)
SCALE="${4:-1920:-1}" # Scale to width, maintain aspect ratio

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}Error: ffmpeg is not installed${NC}"
    echo "Install ffmpeg:"
    echo "  macOS: brew install ffmpeg"
    echo "  Ubuntu/Debian: sudo apt-get install ffmpeg"
    echo "  Windows: Download from https://ffmpeg.org/download.html"
    exit 1
fi

# Check if input video exists
if [ ! -f "$INPUT_VIDEO" ]; then
    echo -e "${RED}Error: Input video not found: $INPUT_VIDEO${NC}"
    exit 1
fi

echo -e "${GREEN}Starting frame extraction...${NC}"
echo -e "Input: ${YELLOW}$INPUT_VIDEO${NC}"
echo -e "Output: ${YELLOW}$OUTPUT_DIR${NC}"
echo -e "Quality: ${YELLOW}$QUALITY${NC} (1=best, 31=worst)"
echo ""

# Get video information
echo -e "${GREEN}Getting video information...${NC}"
DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$INPUT_VIDEO")
FPS=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 "$INPUT_VIDEO")
FRAME_COUNT=$(ffprobe -v error -select_streams v:0 -count_packets -show_entries stream=nb_frames -of csv=p=0 "$INPUT_VIDEO")

echo "Duration: ${DURATION}s"
echo "FPS: $FPS"
echo "Total Frames: $FRAME_COUNT"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Remove existing frames
if [ "$(ls -A $OUTPUT_DIR 2>/dev/null)" ]; then
    echo -e "${YELLOW}Removing existing frames...${NC}"
    rm -f "$OUTPUT_DIR"/*.jpg
fi

# Extract frames
echo -e "${GREEN}Extracting frames...${NC}"
ffmpeg -i "$INPUT_VIDEO" \
    -vf "scale=$SCALE" \
    "$OUTPUT_DIR/frame-%03d.jpg" \
    -q:v $QUALITY \
    -y \
    -hide_banner \
    -loglevel warning

# Count extracted frames
EXTRACTED_COUNT=$(ls -1 "$OUTPUT_DIR"/*.jpg 2>/dev/null | wc -l | tr -d ' ')

echo ""
echo -e "${GREEN}✓ Frame extraction complete!${NC}"
echo -e "Extracted ${YELLOW}$EXTRACTED_COUNT${NC} frames to ${YELLOW}$OUTPUT_DIR${NC}"
echo ""

# Show first and last frame
FIRST_FRAME=$(ls "$OUTPUT_DIR"/*.jpg | head -1)
LAST_FRAME=$(ls "$OUTPUT_DIR"/*.jpg | tail -1)
echo "First frame: $(basename "$FIRST_FRAME")"
echo "Last frame: $(basename "$LAST_FRAME")"
echo ""

# Calculate total size
TOTAL_SIZE=$(du -sh "$OUTPUT_DIR" | cut -f1)
echo -e "Total size: ${YELLOW}$TOTAL_SIZE${NC}"

# Update frameCount in HeroSection.tsx
HERO_FILE="app/components/sections/HeroSection.tsx"
if [ -f "$HERO_FILE" ]; then
    echo ""
    echo -e "${YELLOW}Updating frameCount in HeroSection.tsx...${NC}"

    # Backup the file
    cp "$HERO_FILE" "$HERO_FILE.backup"

    # Update the frameCount value
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/const frameCount = [0-9]*;/const frameCount = $EXTRACTED_COUNT;/" "$HERO_FILE"
    else
        # Linux
        sed -i "s/const frameCount = [0-9]*;/const frameCount = $EXTRACTED_COUNT;/" "$HERO_FILE"
    fi

    echo -e "${GREEN}✓ Updated frameCount to $EXTRACTED_COUNT${NC}"
fi

echo ""
echo -e "${GREEN}Done! 🎉${NC}"
echo ""
echo "Next steps:"
echo "1. Verify frames in $OUTPUT_DIR"
echo "2. Update HeroSection.tsx if frame path changed"
echo "3. Test the scroll animation"
