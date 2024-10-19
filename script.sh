#!/bin/bash

# Lue YOUTUBE_ID .env-tiedostosta
YOUTUBE_ID=$(grep YOUTUBE_ID .env | cut -d '=' -f2)

# Tarkista, onko YOUTUBE_ID määritetty
if [ -z "$YOUTUBE_ID" ]; then
  echo "YOUTUBE_ID ei ole määritetty .env-tiedostossa."
  exit 1
fi

# Lataa ääni
yt-dlp -f bestaudio -o "${YOUTUBE_ID}_output.mp3" "https://www.youtube.com/watch?v=${YOUTUBE_ID}"

# Muuta äänen laatu
ffmpeg -i "${YOUTUBE_ID}_output.mp3" -b:a 32k -ac 1 -ar 16000 "${YOUTUBE_ID}_output_low_quality.mp3"

# Luo kansio tiedoston pätkimistä varten, jos sitä ei ole olemassa
mkdir -p "splitted_audio/${YOUTUBE_ID}"

# Pätki tiedosto 5 minuutin pätkiin
ffmpeg -i "${YOUTUBE_ID}_output_low_quality.mp3" -f segment -segment_time 300 -c copy "splitted_audio/${YOUTUBE_ID}/${YOUTUBE_ID}_segment_%03d.mp3"

# Aja node scripti
node transcribe.js

# Aja toinen node scripti
node interpret.js