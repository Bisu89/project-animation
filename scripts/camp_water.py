"""Cut the lake out of the clean background so Remotion can ripple it without touching shore, trees or the camp.

  demo-project/public/camp-demo/scene/bg.png  -> water.png (the lake pixels, alpha = feathered mask)
                                                  src/camp-demo/water.json  { top, bottom, left, right } of the lake in canvas px

The lake is found by colour (blue, bright enough) and kept as the one region connected to a seed point inside it,
then eroded a few px from every edge so the moving strips never smear the shoreline.

usage:  python scripts/camp_water.py [--seed 1500,700] [--preview mask.png]
"""
import argparse
import json
import os

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCENE = os.path.join(ROOT, "demo-project", "public", "camp-demo", "scene")

ap = argparse.ArgumentParser()
ap.add_argument("--seed", default="1500,700")
ap.add_argument("--horizon", type=int, default=552, help="first canvas row that can be water: everything above is sky and hills")
ap.add_argument("--preview")
a = ap.parse_args()
sx, sy = (int(v) for v in a.seed.split(","))

bg = Image.open(os.path.join(SCENE, "bg.png")).convert("RGB")
rgb = np.asarray(bg).astype(int)
r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
blue = ((b > g + 12) & (b > r + 28) & (b > 70)) | ((b >= g) & (b >= r + 6) & (b > 35))  # open water, and the darker tree reflections
blue[: a.horizon] = False
lab, _ = ndi.label(ndi.binary_opening(blue, iterations=2))
mask = lab == lab[sy, sx]
mask = ndi.binary_closing(mask, iterations=6)
mask = ndi.binary_fill_holes(mask)
mask = ndi.binary_erosion(mask, iterations=5)
ys, xs = np.where(mask)
info = {"top": int(ys.min()), "bottom": int(ys.max()), "left": int(xs.min()), "right": int(xs.max()), "pixels": int(mask.sum())}
alpha = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))
out = bg.convert("RGBA")
out.putalpha(alpha)
out.save(os.path.join(SCENE, "water.png"))
with open(os.path.join(ROOT, "demo-project", "src", "camp-demo", "water.json"), "w", encoding="utf-8") as fh:
    json.dump(info, fh, indent=1)
print(info)
if a.preview:
    vis = np.asarray(bg).copy()
    vis[mask] = (0.5 * vis[mask] + 0.5 * np.array([255, 0, 255])).astype(np.uint8)
    Image.fromarray(vis).resize((960, 540)).save(a.preview)
