"""Build the playlist for the poster video and its per-frame music features, so the scene can move with the music.

The poster video loops in units of exactly one playlist (video pass length = playlist length), so the lights, fire and cat
stay in time with the music on every repeat. This script writes:
  demo-project/public/xmas-cat-wide/playlist.wav     every track normalised to -18 LUFS, 1 s of silence after each,
                                                      trimmed to a whole number of frames
  demo-project/src/xmas-cat-wide/features_poster.json bass / mid / high / onset per frame (scripts/smoke_features.py)
  content/xmas-cat-wide/tracklist.txt                start time of each track (for the YouTube description)

Usage (from the project root):
  python scripts/xmas_playlist.py --music-dir "C:/Users/hoaxv/Desktop/audio" \
      --tracks "Window Prayer,jazz 3,jazz 10,jazz 5,jazz 1,jazz 2"
--tracks: file names without extension, in play order (default: every audio file, by name).
"""
import argparse
import glob
import json
import os
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FPS = 30
AUDIO_EXT = (".mp3", ".wav", ".m4a", ".flac", ".ogg")


def ff(*args):
    subprocess.run(["ffmpeg", "-y", "-v", "error", *args], check=True)


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path], capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


ap = argparse.ArgumentParser()
ap.add_argument("--music-dir", required=True)
ap.add_argument("--tracks")
a = ap.parse_args()

files = {os.path.splitext(os.path.basename(p))[0]: p for p in glob.glob(os.path.join(a.music_dir, "*")) if p.lower().endswith(AUDIO_EXT)}
names = [t.strip() for t in a.tracks.split(",")] if a.tracks else sorted(files)
missing = [n for n in names if n not in files]
if missing:
    sys.exit("not found in music dir: " + ", ".join(missing))

tmp = tempfile.mkdtemp(prefix="xmas_pl_")
parts, lines, t = [], [], 0.0
for i, n in enumerate(names):
    w = os.path.join(tmp, f"{i:03d}.wav")
    ff("-i", files[n], "-af", "loudnorm=I=-18:TP=-1.5,apad=pad_dur=1", "-ar", "44100", "-ac", "2", w)
    lines.append(f"{int(t // 60):02d}:{int(t % 60):02d} {n}")
    t += duration(w)
    parts.append(w)

lst = os.path.join(tmp, "list.txt")
with open(lst, "w", encoding="utf-8") as fh:
    fh.writelines("file '%s'\n" % p.replace("\\", "/") for p in parts)
frames = int(t * FPS)
pub = os.path.join(ROOT, "demo-project", "public", "xmas-cat-wide")
os.makedirs(pub, exist_ok=True)
playlist = os.path.join(pub, "playlist.wav")
ff("-f", "concat", "-safe", "0", "-i", lst, "-t", f"{frames / FPS:.6f}", "-c:a", "pcm_s16le", playlist)

feat = os.path.join(ROOT, "demo-project", "src", "xmas-cat-wide", "features_poster.json")
subprocess.run([sys.executable, os.path.join(ROOT, "scripts", "smoke_features.py"), playlist, feat], check=True)
# the analysis window drops a few frames at the end: pad so features cover the playlist frame for frame
with open(feat) as fh:
    d = json.load(fh)
for k in ("bass", "mid", "high", "onset"):
    d[k] = (d[k] + [0.0] * frames)[:frames]
d["frames"] = frames
with open(feat, "w") as fh:
    json.dump(d, fh)

with open(os.path.join(ROOT, "content", "xmas-cat-wide", "tracklist.txt"), "w", encoding="utf-8") as fh:
    fh.write("\n".join(lines) + "\n")
print(f"{len(names)} tracks, {frames} frames = {frames / FPS / 60:.2f} min -> {playlist}")
print("\n".join(lines))
