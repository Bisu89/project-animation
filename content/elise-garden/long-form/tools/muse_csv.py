"""Đổi media/muse_queue[-wN].csv -> media/gen-video[-wN].csv cho muse-auto/muse_auto.py.

  python muse_csv.py            # pilot
  python muse_csv.py --wave 1   # đợt 1

Clip lưu vào media/muse/<shotId>_<nn>.mp4 (đúng tên output của package). Ảnh lấy từ media/anh/.
"""
import argparse, csv, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser()
ap.add_argument("--ep", default="EP01")
ap.add_argument("--wave", type=int)
a = ap.parse_args()
sfx = f"-w{a.wave}" if a.wave else ""
media = os.path.join(ROOT, "episodes", a.ep, "media")
src = os.path.join(media, f"muse_queue{sfx}.csv")
dst = os.path.join(media, f"gen-video{sfx or '-pilot'}.csv")
rows = list(csv.DictReader(open(src, encoding="utf-8-sig")))
with open(dst, "w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f)
    w.writerow(["stt", "doan", "luu_tai", "khung_dau", "khung_cuoi", "anh_tham_chieu", "prompt", "am_thanh",
                "dung_giay", "che_do", "cat_tu", "cat_den", "chuyen_canh"])
    for r in rows:
        w.writerow([r["order"], f"{r['clip_id']}", os.path.join("muse", r["output_file"]), r["first_frame"], r["last_frame"],
                    r["reference_image"], r["prompt"], r["audio_note"], r["edit_seconds"], "cat", "", "", r.get("transition_in") or "mo"])
print("wrote", os.path.relpath(dst, ROOT), len(rows), "clip")
