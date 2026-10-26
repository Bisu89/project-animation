"""Check the ChatGPT-edited variants against their crops: position shift (phase correlation) and how much of the picture changed.

Usage: python scripts/xmas_check_variants.py content/xmas-cat-wide
Pairs (variant -> crop) come from <dir>/variants.json when it exists, else the cat-scene defaults below; <variant>.png sits
next to <crop>.png (the variant is whatever size ChatGPT returned, it is scaled to the crop).
Writes <dir>/_sbs_<variant>.png (original | variant | difference x3) to look at, and prints one line per variant.
A shift other than (0, 0) means the generator moved the picture: re-generate it, do not use it.
Delete the _sbs_ files afterwards (they are only for looking).
"""
import json
import os
import sys

import numpy as np
from PIL import Image

PAIRS = {"cat_face_eyes_half": "cat_face_crop", "cat_face_ear_turn": "cat_face_crop", "cat_tail_lift": "cat_tail_crop", "fire_plate": "fire_crop"}
d = sys.argv[1] if len(sys.argv) > 1 else "content/xmas-cat-wide"
if os.path.exists(os.path.join(d, "variants.json")):
    with open(os.path.join(d, "variants.json")) as fh:
        PAIRS = {k: v for k, v in json.load(fh).items() if not k.startswith("_")}
gray = lambda im: np.asarray(im.convert("L"), float)
for variant, crop in PAIRS.items():
    pv, pc = os.path.join(d, variant + ".png"), os.path.join(d, crop + ".png")
    if not (os.path.exists(pv) and os.path.exists(pc)):
        print(variant, "missing")
        continue
    ref = Image.open(pc).convert("RGB")
    im = Image.open(pv).convert("RGB").resize(ref.size, Image.LANCZOS)
    a, b = gray(ref), gray(im)
    F = np.fft.fft2(a - a.mean()) * np.conj(np.fft.fft2(b - b.mean()))
    r = np.fft.ifft2(F / (np.abs(F) + 1e-9)).real
    dy, dx = np.unravel_index(r.argmax(), r.shape)
    h, w = a.shape
    dy = dy - h if dy > h // 2 else dy
    dx = dx - w if dx > w // 2 else dx
    diff = np.abs(a - b)
    print(f"{variant:20s} shift=({int(dx)},{int(dy)}) mean_diff={diff.mean():.1f}  (OK when shift is (0,0); fire_plate differs a lot on purpose)")
    sbs = Image.new("RGB", (w * 3, h))
    sbs.paste(ref, (0, 0))
    sbs.paste(im, (w, 0))
    sbs.paste(Image.fromarray(np.clip(diff * 3, 0, 255).astype("uint8")).convert("RGB"), (2 * w, 0))
    sbs.save(os.path.join(d, f"_sbs_{variant}.png"))
