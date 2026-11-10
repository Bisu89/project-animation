"""Ghép các phân đoạn đã lồng tiếng thành một video cả tập, chuẩn hóa âm lượng (-14 LUFS) và gộp phụ đề.

    python scripts/ghep_tap.py --ep content/elise-wild/ep01-waterfall-pool --out ep01.mp4 test-p1 p3-leu ...
"""
import argparse
import os
import re
import subprocess

from long_tieng import probe, srt_time


def parse_srt(path):
    items = []
    if not os.path.exists(path):
        return items
    blocks = open(path, encoding="utf-8").read().strip().split("\n\n")
    for b in blocks:
        lines = b.splitlines()
        m = re.match(r"(\S+) --> (\S+)", lines[1])
        t = [sum(float(x) * k for x, k in zip(s.replace(",", ".").split(":"), (3600, 60, 1))) for s in m.groups()]
        items.append((t[0], t[1], "\n".join(lines[2:])))
    return items


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ep", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("segments", nargs="+")
    a = ap.parse_args()
    videos = [os.path.join(a.ep, s, "video", "final-loidan.mp4") for s in a.segments]
    out = os.path.join(a.ep, a.out)
    cmd = ["ffmpeg", "-y", "-v", "error"]
    for v in videos:
        cmd += ["-i", v]
    n = len(videos)
    cmd += ["-filter_complex",
            "".join(f"[{i}:v][{i}:a]" for i in range(n)) + f"concat=n={n}:v=1:a=1[v][a0];"
            "[a0]loudnorm=I=-14:TP=-1.5:LRA=11[a]",
            "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "medium", "-crf", "18",
            "-c:a", "aac", "-b:a", "192k", "-ar", "48000", out]
    subprocess.run(cmd, check=True)
    subs, t = [], 0.0
    for v in videos:
        subs += [(s + t, e + t, txt) for s, e, txt in parse_srt(os.path.splitext(v)[0] + ".srt")]
        t += probe(v)
    with open(os.path.splitext(out)[0] + ".srt", "w", encoding="utf-8") as f:
        for i, (s, e, txt) in enumerate(subs, 1):
            f.write(f"{i}\n{srt_time(s)} --> {srt_time(e)}\n{txt}\n\n")
    print(f"đã ghép {out} ({probe(out):.1f}s), {len(subs)} dòng phụ đề")


if __name__ == "__main__":
    main()
