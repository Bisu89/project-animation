"""Sinh references/gen-anh.csv (Gate B) từ data/references.json.

  python refs_csv.py              # tất cả batch
  python refs_csv.py --batch 1    # chỉ batch 1 (stt vẫn giữ theo toàn bộ danh sách để --only khớp)

Ảnh lưu vào references/anh/ (gpt_anh.py lưu cạnh CSV). Không gen gì; chỉ ghi CSV.
"""
import argparse, csv, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser()
ap.add_argument("--batch", type=int)
a = ap.parse_args()
refs = json.load(open(os.path.join(ROOT, "data", "references.json"), encoding="utf-8"))
out_dir = os.path.join(ROOT, "references")
os.makedirs(os.path.join(out_dir, "anh"), exist_ok=True)
names = {r["file"] for r in refs["images"]} | set(refs["sourceImages"])
with open(os.path.join(out_dir, "gen-anh.csv"), "w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f)
    w.writerow(["stt", "ten_file", "ty_le", "gui_kem", "prompt", "batch", "duyet"])
    for i, r in enumerate(refs["images"], 1):
        missing = [x for x in r["sendWith"] if x not in names]
        if missing:
            raise SystemExit(f"{r['file']}: gửi kèm ảnh không có trong danh sách: {missing}")
        if a.batch and r["batch"] != a.batch:
            continue
        w.writerow([i, r["file"], r["ratio"], "; ".join(r["sendWith"]), r["prompt"], r["batch"], r["approve"]])
for i, r in enumerate(refs["images"], 1):
    have = os.path.exists(os.path.join(out_dir, "anh", r["file"]))
    print(f"{i:2d}  batch {r['batch']}  {'CÓ ' if have else '   '} {r['file']:34s} <- {', '.join(r['sendWith'])}  [duyệt: {r['approve']}]")
