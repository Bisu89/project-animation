"""Prepare the files the xmas-cat compositions read, and (optionally) mirror them to a private render folder.

Why a private folder: `remotion render` copies the whole demo-project/public into a temp bundle, which includes every other
series' media (hundreds of MB) and has failed with ENOENT on a vanishing voice-cache file. `--public-dir=<out>` avoids it.

Usage (from the project root):
  python scripts/xmas_prepare.py portrait [out_dir]    # 9:16 scene, Reels and the 40 s cut
  python scripts/xmas_prepare.py wide     [out_dir]    # 16:9 scene, the 10-minute video

Source of truth = content/xmas-cat*/ (ChatGPT images, 1536x1024 variants and the master). This script:
  1. resizes the four edited variants to 900x600 (the crop boxes are 450x300 in master pixels, so 2x for sharpness),
  2. copies the master as is,
  3. writes all of that into demo-project/public/<name>/ (what the studio reads),
  4. if out_dir is given, mirrors demo-project/public/<name>/ to out_dir/<name>/ (what `--public-dir` reads).
Audio is not made here: run scripts/gen_xmas_sfx.py (portrait) or gen_xmas_wide_sfx.py + gen_xmas_intro_sfx.py (wide) and copy the
music file to demo-project/public/<name>/music.mp3 (the wide one is built by the ffmpeg command in docs/series/xmas-cat/CACH_LAM.md).
"""
import os
import shutil
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KIND = {"portrait": ("xmas-cat", "xmas-cat"), "wide": ("xmas-cat-wide", "xmas-cat-wide")}
VARIANTS = {"cat_face_eyes_half": "eyes_half", "cat_face_ear_turn": "ear_turn", "cat_tail_lift": "tail_lift", "fire_plate": "fire_plate"}

kind = sys.argv[1] if len(sys.argv) > 1 else "portrait"
if kind not in KIND:
    sys.exit("first argument must be portrait or wide")
content_dir, public_name = KIND[kind]
src = os.path.join(ROOT, "content", content_dir)
dst = os.path.join(ROOT, "demo-project", "public", public_name)
os.makedirs(dst, exist_ok=True)

shutil.copyfile(os.path.join(src, "master.png"), os.path.join(dst, "master.png"))
for name, out in VARIANTS.items():
    Image.open(os.path.join(src, name + ".png")).convert("RGB").resize((900, 600), Image.LANCZOS).save(os.path.join(dst, out + ".png"))
print("images ->", dst)

if len(sys.argv) > 2:
    target = os.path.join(os.path.abspath(sys.argv[2]), public_name)
    shutil.rmtree(target, ignore_errors=True)
    shutil.copytree(dst, target)
    print("mirrored ->", target, "(use --public-dir=" + os.path.abspath(sys.argv[2]) + ")")
    for need in ("ambience.wav", "music.mp3") + (("intro_sfx.wav",) if kind == "wide" else ()):
        if not os.path.exists(os.path.join(target, need)):
            print("MISSING audio file:", need, "(see the docstring)")
