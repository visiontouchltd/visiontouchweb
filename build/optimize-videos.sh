#!/usr/bin/env bash
# Vision Touch Ltd — video optimisation. Compress to web-friendly 720p, muted, faststart.
# Generates a WebP + JPG poster for each. Source files stay untouched.
set -u
SRC="Z:/auztec/projs/visontouch constr/wesbite"
OUT="Z:/claude/vision-touch-website/assets/videos"
POSTER="Z:/claude/vision-touch-website/assets/images"
mkdir -p "$OUT"

enc () {
  local in="$1" out="$2" maxh="${3:-720}"
  if [ ! -f "$in" ]; then echo "! missing: $in"; return; fi
  echo ">> encoding $out"
  ffmpeg -y -hide_banner -loglevel error -i "$in" \
    -vf "scale=-2:'min($maxh,ih)'" -an \
    -c:v libx264 -preset faster -crf 27 -pix_fmt yuv420p -movflags +faststart \
    "$OUT/$out"
  echo "   done $out  ($(du -h "$OUT/$out" | cut -f1))"
}

poster () {
  local in="$1" base="$2" t="${3:-00:00:02}"
  if [ ! -f "$in" ]; then return; fi
  ffmpeg -y -hide_banner -loglevel error -ss "$t" -i "$in" -frames:v 1 \
    -vf "scale=-2:900" "$POSTER/$base.jpg"
  ffmpeg -y -hide_banner -loglevel error -ss "$t" -i "$in" -frames:v 1 \
    -vf "scale=-2:900" -c:v libwebp -quality 72 "$POSTER/$base.webp"
  echo "   poster $base"
}

# Hero (homepage clips)
enc "$SRC/other images and video to use at homepage/1.mp4" "hero.mp4" 900
poster "$SRC/other images and video to use at homepage/1.mp4" "home/hero-poster" "00:00:01"
enc "$SRC/other images and video to use at homepage/2.mp4" "hero-2.mp4" 720
poster "$SRC/other images and video to use at homepage/2.mp4" "home/hero-2-poster" "00:00:01"

# Service videos
enc "$SRC/loft conversions/loft conversions.mp4"            "loft-conversions.mp4"
poster "$SRC/loft conversions/loft conversions.mp4"         "services/loft-conversions/loft-conversions-video-poster"
enc "$SRC/Property Renovations/Property Renovations.mp4"    "property-renovations.mp4"
poster "$SRC/Property Renovations/Property Renovations.mp4" "services/property-renovations/property-renovations-video-poster"
enc "$SRC/House Extensions/House Extensions.mp4"            "house-extensions.mp4"
poster "$SRC/House Extensions/House Extensions.mp4"         "services/house-extensions/house-extensions-video-poster"
enc "$SRC/Kitchen Installation/Kitchen Installation.mp4"    "kitchen-installation.mp4"
poster "$SRC/Kitchen Installation/Kitchen Installation.mp4" "services/kitchen-installation/kitchen-installation-video-poster"
enc "$SRC/Bathroom Installation/Bathroom Installation.mp4"  "bathroom-installation.mp4"
poster "$SRC/Bathroom Installation/Bathroom Installation.mp4" "services/bathroom-installation/bathroom-installation-video-poster"
enc "$SRC/carpentry and joinery/carpentry and joinery.mp4" "carpentry-joinery.mp4"
poster "$SRC/carpentry and joinery/carpentry and joinery.mp4" "services/carpentry-joinery/carpentry-joinery-video-poster"
enc "$SRC/structural work/structural work.mp4"             "structural-work.mp4"
poster "$SRC/structural work/structural work.mp4"          "services/structural-work/structural-work-video-poster"
enc "$SRC/general building services/general building services vdo.mp4" "general-building-services.mp4"
poster "$SRC/general building services/general building services vdo.mp4" "services/general-building-services/general-building-services-video-poster"

echo "ALL VIDEO WORK COMPLETE"
