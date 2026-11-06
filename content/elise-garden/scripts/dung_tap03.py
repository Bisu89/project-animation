"""Ghép Elise Garden tập 03 từ ghep-v2.csv: ghep.py nối clip, rồi thêm nhãn AI + chữ thời gian.

Chạy: python -X utf8 dung_tap02.py [--out final.mp4]
Bản cắt (cat_tu/cat_den/dung_giay) sửa trong ep03-cucumber-trellis/ghep-v2.csv, không sửa gen-video.csv.
"""
import argparse
import csv
import json
import subprocess
import sys
from pathlib import Path

SERIES = Path(__file__).resolve().parents[1]
EP = SERIES / "ep03-cucumber-trellis"
TOOL = SERIES.parents[2] / "muse-auto"
KIEU = {"": 0.0, "cat": 0.0, "mo": 0.25, "mo_dai": 0.5}
CHU = {4: "Days later", 5: "Weeks later", 10: "Weeks later", 12: "Days later"}


def probe_dur(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True, check=True).stdout
    return float(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv", default="ghep-v2.csv")
    ap.add_argument("--out", default="final.mp4")
    a = ap.parse_args()
    csv_path = EP / a.csv
    with csv_path.open(encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))

    # Mỗi chỗ nối chồng d giây. Không dùng ghep.build: qua nhiều chỗ nối, sai số độ dài từng đoạn cộng dồn làm
    # offset xfade vượt quá độ dài thật và luồng hình bị cụt (bản 2026-11-06 hình dừng ở 17 s, tiếng chạy tiếp).
    # Ở đây mỗi đoạn được ép đúng `length` giây (tpad + trim) trước khi nối.
    timeline, segs, total, prev_len = [], [], 0.0, None
    for i, r in enumerate(rows):
        src = EP / r["luu_tai"].replace("\\", "/")
        start = float(r["cat_tu"] or 0)
        end = min(probe_dur(src), float(r["cat_den"])) if r["cat_den"] else probe_dur(src)
        length = float(r["dung_giay"]) if r["dung_giay"] else end - start
        if r["che_do"] == "cat":
            length = min(length, end - start)
            end = start + length
        length = round(length * 30) / 30          # làm tròn theo khung hình để offset xfade khớp tuyệt đối
        d = 0.0
        if i == 0:
            t0 = 0.0
        else:
            want = KIEU[r.get("chuyen_canh", "")]
            d = round(min(max(want, 2 / 30), prev_len / 2, length / 2) * 30) / 30   # cắt thẳng = chồng 2 khung
            t0 = round((total - d) * 30) / 30
        timeline.append({"clip": int(r["stt"]), "start": round(t0, 3), "end": round(t0 + length, 3),
                         "nguon": f"{start}-{end}", "doan": r["doan"]})
        segs.append((src, start, end, length, d, t0))
        total = t0 + length
        prev_len = length

    raw = EP / "video" / (Path(a.out).stem + "-ghep.mp4")
    cmd, fl = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y"], []
    for i, (src, start, end, length, d, t0) in enumerate(segs):
        cmd += ["-i", str(src)]
        speed = (end - start) / length
        tempo, s = [], speed
        while s > 2.0:
            tempo.append("atempo=2.0")
            s /= 2.0
        tempo.append(f"atempo={s:.4f}")
        fl.append(f"[{i}:v]trim={start}:{end},setpts=(PTS-STARTPTS)/{speed:.4f},"
                  "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30,setsar=1,"
                  f"tpad=stop_mode=clone:stop_duration=1,trim=end_frame={round(length * 30)},setpts=PTS-STARTPTS[v{i}]")
        fl.append(f"[{i}:a]atrim={start}:{end},asetpts=PTS-STARTPTS,{','.join(tempo)},"
                  f"aformat=sample_rates=44100:channel_layouts=stereo,apad,atrim=duration={length:.3f},"
                  f"asetpts=PTS-STARTPTS[a{i}]")
    vp, ap_ = "[v0]", "[a0]"
    for i in range(1, len(segs)):
        d, t0 = segs[i][4], segs[i][5]
        fl.append(f"{vp}[v{i}]xfade=transition=fade:duration={d:.4f}:offset={t0:.4f}[vx{i}]")
        fl.append(f"{ap_}[a{i}]acrossfade=d={d:.3f}[ax{i}]")
        vp, ap_ = f"[vx{i}]", f"[ax{i}]"
    cmd += ["-filter_complex", ";".join(fl), "-map", vp, "-map", ap_, "-c:v", "libx264", "-crf", "16",
            "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", str(raw)]
    subprocess.run(cmd, check=True)

    font = "C\\:/Windows/Fonts/arial.ttf"
    style = f"fontfile='{font}':fontcolor=white:box=1:boxcolor=black@0.5:boxborderw=12"
    vf = []  # không in nhãn AI lên hình: chủ dự án tự khai báo nội dung AI lúc đăng (2026-11-06)
    by_id = {t["clip"]: t for t in timeline}
    for clip, chu in CHU.items():
        if clip in by_id:
            t = by_id[clip]
            k = [x["clip"] for x in timeline].index(clip)
            nd = segs[k + 1][4] if k + 1 < len(segs) else 0
            stop = t["end"] - (0.5 if nd > 0.1 else 0.1)   # tắt trước chỗ mờ chồng; chỗ cắt thẳng thì giữ tới gần hết
            vf.append(f"drawtext={style}:text='{chu}':fontsize=40:x=(w-tw)/2:y=h-200:"
                      f"enable='between(t,{t['start'] + 0.1:.3f},{stop:.3f})'")
    final = EP / "video" / a.out
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(raw), "-vf", ",".join(vf),
                    "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p",
                    "-af", "volume=6dB,alimiter=limit=0.95", "-c:a", "aac", "-b:a", "192k",
                    "-movflags", "+faststart", str(final)], check=True)
    (EP / "video" / (Path(a.out).stem + "-timeline.json")).write_text(
        json.dumps({"duration": round(total, 3), "clips": timeline}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Final: {final} ({probe_dur(final):.2f}s, tinh {total:.2f}s)")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
