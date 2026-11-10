"""Sinh gen-anh.csv cho Part 1 từ kich_ban.IMAGES (gửi kèm model sheet nhân vật có trong cảnh)."""
import csv, os, shutil, sys
D = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, D)
import kich_ban as K

MODELS = os.path.join(D, "..", "..", "models")
os.makedirs(os.path.join(D, "anh"), exist_ok=True)
for n in ("nhan-vat-chinh-F.png", "maya-model-sheet.png"):
    shutil.copy(os.path.join(MODELS, n), os.path.join(D, "anh", n))

with open(os.path.join(D, "gen-anh.csv"), "w", encoding="utf-8", newline="") as f:
    w = csv.writer(f)
    w.writerow(["stt", "ten_file", "ty_le", "prompt", "gui_kem"])
    for i, (k, (desc, hero, maya)) in enumerate(K.IMAGES.items(), 1):
        refs = (["nhan-vat-chinh-F.png"] if hero else []) + (["maya-model-sheet.png"] if maya else [])
        p = K.STYLE + desc + (K.HERO if hero else "") + (K.MAYA if maya else "") + K.FLAT
        if not hero and not maya:
            p += " No stick figures in this frame."
        w.writerow([i, k + ".png", "16:9", p, ";".join(refs)])
print("ok", len(K.IMAGES))
