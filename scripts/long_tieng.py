"""Lồng lời dẫn vibi.pro vào từng phân đoạn Elise Wild.

Đọc loi-dan/loi-dan.csv (phan_doan, clip, canh, giong, text), tạo mỗi câu một mp3 (có cache), đặt câu ở đầu clip
tương ứng (lùi lại nếu câu trước chưa đọc xong), trộn với tiếng môi trường của <phan_doan>/video/final.mp4 và xuất
<phan_doan>/video/final-loidan.mp4 + .srt.

    python scripts/long_tieng.py --ep content/elise-wild/ep01-waterfall-pool [--only p7-mua] [--dry]
"""
import argparse
import csv
import hashlib
import json
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import vibi_tts  # noqa: E402

VOICES = {"elise": "yj30vwTGJxSHezdAGsv9",  # Jessa - Easygoing and Effortless
          "ba": "RILOU7YmBhvwJGDGjNmP"}     # Jane - Professional Audiobook Reader
LEAD_IN = 0.5       # câu bắt đầu sau đầu clip bấy nhiêu giây
GAP = 0.4           # khoảng nghỉ tối thiểu giữa hai câu
BED_VOL = 0.45      # âm lượng tiếng môi trường khi có lời


def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                         capture_output=True, text=True).stdout.strip()
    return float(out)


def clip_starts(seg_dir):
    """Thời điểm bắt đầu của mỗi clip (theo stt) trong final.mp4, tính giống ghep.py (không xfade)."""
    with open(os.path.join(seg_dir, "gen-video.csv"), encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    starts, t = {}, 0.0
    for row in rows:
        clip = os.path.join(seg_dir, row["luu_tai"].replace("\\", os.sep))
        dur = probe(clip)
        cut = None
        qa = os.path.splitext(clip)[0] + ".qa.json"
        if os.path.exists(qa):
            with open(qa, encoding="utf-8") as f:
                cut = json.load(f).get("cat_den")
        if row.get("cat_den"):
            cut = float(row["cat_den"])
        start = float(row["cat_tu"]) if row.get("cat_tu") else 0.0
        end = min(dur, float(cut)) if cut else dur
        avail = end - start
        target = float(row["dung_giay"]) if row.get("dung_giay") else avail
        if (row.get("che_do") or "tang_toc") == "cat":
            target = min(target, avail)
        starts[row["stt"]] = (t, target)
        t += target
    return starts, t


def srt_time(s):
    ms = int(round(s * 1000))
    return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}"


def build_segment(ep, seg, lines, dry):
    seg_dir = os.path.join(ep, seg)
    starts, total = clip_starts(seg_dir)
    cache = os.path.join(ep, "loi-dan", "cau")
    os.makedirs(cache, exist_ok=True)
    placed, prev_end = [], 0.0
    for ln in lines:
        key = hashlib.md5(f"{ln['giong']}|{ln['text']}".encode("utf-8")).hexdigest()[:8]
        mp3 = os.path.join(cache, f"{seg}_{ln['canh']}_{ln['giong']}_{key}.mp3")
        if not os.path.exists(mp3):
            if dry:
                print(f"  [dry] sẽ tạo {os.path.basename(mp3)}")
                continue
            vibi_tts.tts(VOICES[ln["giong"]], ln["text"], mp3)
        d = probe(mp3)
        clip_t, clip_len = starts[ln["clip"]]
        at = max(clip_t + LEAD_IN, prev_end + GAP)
        placed.append((at, d, mp3, ln))
        prev_end = at + d
        late = at - (clip_t + LEAD_IN)
        over = at + d - (clip_t + clip_len)
        note = (f" | lùi {late:.1f}s" if late > 0.05 else "") + (f" | tràn qua cảnh sau {over:.1f}s" if over > 0 else "")
        print(f"  {ln['canh']:5} {ln['giong']:5} {at:6.1f}-{at + d:6.1f}s{note}")
    if dry or not placed:
        return
    if prev_end > total:
        print(f"  !! lời dẫn dài hơn hình {prev_end - total:.1f}s (hình {total:.1f}s)")
    video = os.path.join(seg_dir, "video", "final.mp4")
    out = os.path.join(seg_dir, "video", "final-loidan.mp4")
    cmd = ["ffmpeg", "-y", "-v", "error", "-i", video]
    for _, _, mp3, _ in placed:
        cmd += ["-i", mp3]
    parts, labels = [], []
    for i, (at, _, _, _) in enumerate(placed, 1):
        ms = int(at * 1000)
        parts.append(f"[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo,adelay={ms}|{ms}[n{i}]")
        labels.append(f"[n{i}]")
    parts.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0,asplit=2[voice][key]")
    # tiếng môi trường nhỏ lại khi có lời (sidechain), rồi trộn với lời dẫn
    parts.append(f"[0:a]aformat=sample_rates=44100:channel_layouts=stereo[bed];"
                 f"[bed][key]sidechaincompress=threshold=0.02:ratio={1 / BED_VOL:.1f}:attack=20:release=400[duck];"
                 f"[duck][voice]amix=inputs=2:normalize=0,alimiter=limit=0.95[a]")
    cmd += ["-filter_complex", ";".join(parts), "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac",
            "-b:a", "192k", "-t", f"{total:.3f}", out]
    subprocess.run(cmd, check=True)
    with open(os.path.splitext(out)[0] + ".srt", "w", encoding="utf-8") as f:
        for i, (at, d, _, ln) in enumerate(placed, 1):
            f.write(f"{i}\n{srt_time(at)} --> {srt_time(at + d)}\n{ln['text']}\n\n")
    print(f"  đã xuất {out}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ep", required=True)
    ap.add_argument("--only", nargs="*")
    ap.add_argument("--dry", action="store_true")
    a = ap.parse_args()
    with open(os.path.join(a.ep, "loi-dan", "loi-dan.csv"), encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    segs = []
    for r in rows:
        if r["phan_doan"] not in segs:
            segs.append(r["phan_doan"])
    for seg in segs:
        if a.only and seg not in a.only:
            continue
        print(f"== {seg}")
        build_segment(a.ep, seg, [r for r in rows if r["phan_doan"] == seg], a.dry)


if __name__ == "__main__":
    main()
