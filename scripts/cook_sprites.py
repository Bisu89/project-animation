"""Cut-out sprites for the cooking shorts: key the green off AI pictures, trim, and list their sizes.

  content/<video>/sprites/<name>.png   what you generate (objects on flat green; s07_bg.png is a plain picture, kept as is)
  -> demo-project/public/<video>/sprites/<name>.png
  -> demo-project/src/<video>/sprites.json   { name: { w, h } }

A missing bowl / spatula / grain gets a flat placeholder (--no-placeholders to skip) so the motion can be tested first.
The background plate s07_bg.png has no placeholder: without it the scene uses images/s07.png.

usage:  python scripts/cook_sprites.py [--video cook-ep01]
"""
import argparse
import json
import os
import sys

from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from prep_sprites import key_green, trim  # noqa: E402

ROOT = os.path.dirname(HERE)
PLAIN = {"s07_bg"}  # pictures that are not keyed


def placeholder(name):
    im = Image.new("RGB", (700, 700), "#00ff00")
    d = ImageDraw.Draw(im)
    if name == "s07_bowl":  # bowl tipped to the left, hand behind it
        d.ellipse([300, 380, 560, 640], fill="#f1c9a5", outline="#222", width=6)
        d.pieslice([100, 160, 560, 560], 20, 200, fill="#eef0f2", outline="#222", width=6)
        d.ellipse([140, 330, 260, 420], fill="#ffffff", outline="#222", width=3)
    elif name == "s07_spatula":  # handle up-right, blade down-left
        d.line([560, 80, 200, 560], fill="#8a5a2b", width=44)
        d.ellipse([90, 480, 290, 660], fill="#8a5a2b", outline="#222", width=5)
    elif name == "s07_grain":
        d.ellipse([20, 30, 200, 100], fill="#fffdf4", outline="#aaa", width=4)
    return im


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", default="cook-ep01")
    ap.add_argument("--no-placeholders", action="store_true")
    a = ap.parse_args()
    src = os.path.join(ROOT, "content", a.video, "sprites")
    dst = os.path.join(ROOT, "demo-project", "public", a.video, "sprites")
    os.makedirs(src, exist_ok=True)
    os.makedirs(dst, exist_ok=True)
    names = {f[:-4] for f in os.listdir(src) if f.endswith(".png")}
    if not a.no_placeholders:
        names |= {"s07_bowl", "s07_spatula", "s07_grain"}
    sizes = {}
    for n in sorted(names):
        p = os.path.join(src, n + ".png")
        if n in PLAIN:
            im = Image.open(p).convert("RGB")
        else:
            im = trim(key_green(Image.open(p) if os.path.exists(p) else placeholder(n)))
        im.save(os.path.join(dst, n + ".png"))
        sizes[n] = {"w": im.width, "h": im.height}
        print(n, im.width, im.height, "" if os.path.exists(p) else "(placeholder)")
    with open(os.path.join(ROOT, "demo-project", "src", a.video, "sprites.json"), "w", encoding="utf-8") as fh:
        json.dump(sizes, fh, indent=1)


if __name__ == "__main__":
    main()
