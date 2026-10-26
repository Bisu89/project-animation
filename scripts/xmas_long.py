"""Build the long "poster" video (Chill Rap layout) from two Remotion passes, a music playlist and the fire/wind ambience.

The passes (render them once, picture only, from demo-project/):
  npx remotion render src/xmas-cat-wide/index.ts XmasPoster     ../renders/poster_first.mp4 --public-dir=<dir> --crf=20
  npx remotion render src/xmas-cat-wide/index.ts XmasPosterLoop ../renders/poster_loop.mp4  --public-dir=<dir> --crf=20
Each pass is exactly one playlist (scripts/xmas_playlist.py) + 2 s, so the picture, which moves with the music, stays in
time with it on every repeat. The extra 2 s are crossfaded into the start of the loop pass, so the loop repeats without a
visible seam (the camera's periods divide the playlist length; snow, flames and steam are hidden by the crossfade).

Usage (from the project root):
  python scripts/xmas_long.py --first renders/poster_first.mp4 --loop renders/poster_loop.mp4 \
      --music demo-project/public/xmas-cat-wide/playlist.wav --ambience demo-project/public/xmas-cat-wide/ambience.wav \
      --intro-sfx demo-project/public/xmas-cat-wide/intro_sfx.wav --minutes 180 --out renders/xmas-poster-3h.mp4
The Tokyo scene (src/xmas-tokyo, XmasTokyo / XmasTokyoLoop) has no fireplace: leave --ambience out.

Music: the playlist built by xmas_playlist.py (it must be the one the passes were rendered with), repeated with the
picture. Fade in 3 s, fade out 10 s.
Only the first and last parts are re-encoded, the middle is stream-copied, so 3 hours take minutes, not hours.
"""
import argparse
import json
import os
import shutil
import subprocess
import tempfile

XF = 2.0  # seconds of crossfade between passes (the passes' extra 2 s)
ENC = ["-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", "30", "-an"]


def run(cmd):
    print(">", " ".join(cmd[:6]), "...")
    subprocess.run(["ffmpeg", "-y", "-v", "error", *cmd], check=True)


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", path], capture_output=True, text=True, check=True).stdout
    return float(json.loads(out)["format"]["duration"])


def concat_list(paths, list_path):
    with open(list_path, "w", encoding="utf-8") as fh:
        for p in paths:
            fh.write("file '%s'\n" % os.path.abspath(p).replace("\\", "/").replace("'", "'\\''"))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--first", required=True)
    ap.add_argument("--loop", required=True)
    ap.add_argument("--music", required=True)
    ap.add_argument("--ambience")
    ap.add_argument("--intro-sfx")
    ap.add_argument("--minutes", type=float, default=180)
    ap.add_argument("--music-volume", type=float, default=0.8)
    ap.add_argument("--ambience-volume", type=float, default=0.5)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()

    pas = duration(a.loop) - XF  # one pass without its crossfade tail = one playlist
    n = max(1, round(a.minutes * 60 / pas))
    total = pas * n + XF
    if abs(duration(a.music) - pas) > 0.1:
        print(f"WARNING: playlist {duration(a.music):.2f} s but pass {pas:.2f} s: the picture will drift off the music")
    print(f"{n} passes of {pas / 60:.2f} min = {total / 60:.1f} min")

    tmp = tempfile.mkdtemp(prefix="xmas_long_")
    fade_v = f"fade=t=out:st={{st}}:d=10"

    # 1. first pass, ending crossfaded into the loop's first 2 s (so the next part starts at loop t = 2 s)
    first = os.path.join(tmp, "p_first.mp4")
    last_fade = fade_v.format(st=pas + XF - 10) if n == 1 else "null"
    run(["-i", a.first, "-t", str(XF), "-i", a.loop, "-filter_complex", f"[0:v][1:v]xfade=transition=fade:duration={XF}:offset={pas}[x];[x]{last_fade}[v]", "-map", "[v]", *ENC, first])
    parts = [first]

    if n > 1:
        # 2. the seamless loop: loop t 2..602 with its last 2 s crossfaded into loop t 0..2 (ends where it starts)
        seam = os.path.join(tmp, "p_loop.mp4")
        run(["-ss", str(XF), "-i", a.loop, "-t", str(XF), "-i", a.loop, "-filter_complex", f"[0:v][1:v]xfade=transition=fade:duration={XF}:offset={pas - XF}[v]", "-map", "[v]", *ENC, seam])
        parts += [seam] * (n - 2)
        # 3. the last pass: the same loop with the fade to black
        end = os.path.join(tmp, "p_last.mp4")
        run(["-i", seam, "-vf", fade_v.format(st=pas - 10), *ENC, end])
        parts.append(end)

    vlist = os.path.join(tmp, "video.txt")
    concat_list(parts, vlist)

    # 4. mix music (looped), ambience (looped) and the intro sfx; fades on the mix
    ins = ["-f", "concat", "-safe", "0", "-i", vlist, "-stream_loop", "-1", "-i", a.music]
    mix = f"[1:a]volume={a.music_volume}[m]"
    labels = "[m]"
    if a.ambience:
        ins += ["-stream_loop", "-1", "-i", a.ambience]
        mix += f";[{labels.count('[') + 1}:a]volume={a.ambience_volume}[b]"
        labels += "[b]"
    if a.intro_sfx:
        ins += ["-i", a.intro_sfx]
        mix += f";[{labels.count('[') + 1}:a]volume=0.7[s]"
        labels += "[s]"
    k = labels.count("[")
    mix += f";{labels}amix=inputs={k}:duration=first:normalize=0,alimiter=limit=0.89:level=false,atrim=0:{total},afade=t=in:d=3,afade=t=out:st={total - 10}:d=10[a]"
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    run([*ins, "-filter_complex", mix, "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", str(total), a.out])
    shutil.rmtree(tmp, ignore_errors=True)
    print("done:", a.out, f"{duration(a.out) / 60:.1f} min")


if __name__ == "__main__":
    main()
