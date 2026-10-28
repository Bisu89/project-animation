#!/bin/bash
# Render cozy Reels. Usage (from the repo root, Git Bash):  bash scripts/cozy_render.sh <scene_id> [<scene_id> ...]
# Does: cozy_batch.py (master + variants + ambience + music into a temp public dir), then one render per scene -> renders/cozy/<id>.mp4
# Use "full" as the first argument for the long cut:  bash scripts/cozy_render.sh full tokyo-window
set -e
cd "$(dirname "$0")/.."
KIND=reel; if [ "$1" = "full" ]; then KIND=full; shift; fi
PUB="${TEMP:-/tmp}/cz-render"
mkdir -p renders/cozy
python scripts/cozy_batch.py "$PUB" "$@"
cd demo-project
for s in "$@"; do
  npx remotion render src/cozy-scene/index.ts "$s-$KIND" "../renders/cozy/$s-$KIND.mp4" --public-dir="$PUB" --port=3560 --log=error && echo "done $s"
done
