"""Scan public/<video>/clips/sNN.mp4 and write src/<video>/clips.json so the composition knows which scenes have a real clip.

usage:  python scripts/cook_clips.py [--video cook-ep01]

Scenes without a clip keep the still picture + camera move; scenes with one play the clip instead.
"""
import argparse
import json
import os
import subprocess

ROOT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "demo-project")

ap = argparse.ArgumentParser()
ap.add_argument("--video", default="cook-ep01")
a = ap.parse_args()

folder = os.path.join(ROOT, "public", a.video, "clips")
out = {}
if os.path.isdir(folder):
    for f in sorted(os.listdir(folder)):
        if not (f.startswith("s") and f.endswith(".mp4")):
            continue
        p = os.path.join(folder, f)
        dur = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p],
            capture_output=True, text=True,
        ).stdout.strip()
        out[f[:-4]] = round(float(dur), 2) if dur else 0
dest = os.path.join(ROOT, "src", a.video, "clips.json")
with open(dest, "w", encoding="utf-8") as fh:
    json.dump(out, fh, indent=2)
print(f"{len(out)} clip(s):", ", ".join(out) or "none")
