#!/bin/sh
# fetch.sh NAME URL — download a clip into videos/, probe it, and write sheets/NAME.jpg (2 fps, 5x4 tiles).
set -e
name=$1; url=$2
curl -sL -o "videos/$name.mp4" "$url"
printf '%s ' "$name"; ffprobe -v error -show_entries format=duration:stream=width,height,r_frame_rate -of csv=p=0 "videos/$name.mp4" | tr '\n' ' '; echo
ffmpeg -hide_banner -loglevel error -y -i "videos/$name.mp4" -vf 'fps=2,scale=384:-1,tile=5x4' -frames:v 1 "sheets/$name.jpg"
