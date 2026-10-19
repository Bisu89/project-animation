"""Contact sheets of the scene pictures with the effect regions drawn on them (fast check of fx coordinates, no render).

usage: python scripts/fx_sheets.py zs-ep01 11 48 [--cols 3 --rows 3]
Writes demo-project/out/fxsheets/sheet_<n>.png
"""
import argparse
import json
import os

from PIL import Image, ImageDraw

ap = argparse.ArgumentParser()
ap.add_argument("slug")
ap.add_argument("a", type=int)
ap.add_argument("b", type=int)
ap.add_argument("--cols", type=int, default=3)
ap.add_argument("--rows", type=int, default=3)
a = ap.parse_args()
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ts = open(os.path.join(root, "demo-project", "src", a.slug, "scenes.ts"), encoding="utf-8").read()
specs = json.loads(ts[ts.index("= [") + 2 : ts.rindex(";")])
out = os.path.join(root, "demo-project", "out", "fxsheets")
os.makedirs(out, exist_ok=True)
W, H = 640, 360


def fl(x, d):
    try:
        return float(x)
    except Exception:
        return d


tiles = []
for s in specs:
    if not (a.a <= s["i"] <= a.b):
        continue
    im = Image.open(os.path.join(root, "demo-project", "public", a.slug, "images", s["image"])).convert("RGB").resize((W, H))
    d = ImageDraw.Draw(im)
    for t in s["fx"].split():
        name, _, rest = t.partition(":")
        p = rest.split(",") if rest else []
        if name in ("lamp", "screen", "glow", "torch") and len(p) >= 3:
            x, y, r = fl(p[0], 0.5) * W, fl(p[1], 0.5) * H, fl(p[2], 0.1) * W
            d.ellipse([x - r, y - r, x + r, y + r], outline=(0, 255, 0), width=2)
            d.text((x - r, y - r), name, fill=(0, 255, 0))
        elif name in ("breath", "sway", "talk") and len(p) >= 4:
            x, y, w, h = fl(p[0], 0.5) * W, fl(p[1], 0.5) * H, fl(p[2], 0.2) * W, fl(p[3], 0.2) * H
            d.rectangle([x - w / 2, y - h / 2, x + w / 2, y + h / 2], outline=(255, 0, 255), width=2)
            d.text((x - w / 2, y - h / 2), name, fill=(255, 0, 255))
    d.rectangle([0, 0, 40, 16], fill=(0, 0, 0))
    d.text((3, 2), str(s["i"]), fill=(255, 255, 0))
    tiles.append(im)
per = a.cols * a.rows
for n in range(0, len(tiles), per):
    sheet = Image.new("RGB", (W * a.cols, H * a.rows), (0, 0, 0))
    for k, im in enumerate(tiles[n : n + per]):
        sheet.paste(im, ((k % a.cols) * W, (k // a.cols) * H))
    path = os.path.join(out, "sheet_%d.png" % (n // per + 1))
    sheet.save(path)
    print(path)
