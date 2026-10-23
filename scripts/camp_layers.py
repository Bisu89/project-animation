"""Key and register the full-canvas layers of a scene made by editing one master picture.

  content/<video>/layers/<name>.png   what you generate (same canvas as master.png; objects on flat green or magenta)
  -> demo-project/public/<video>/layers/<name>.png   RGBA, SAME canvas size, key colour removed, nothing trimmed or moved
  -> demo-project/src/<video>/layers.json            { name: { w, h, bbox:[x0,y0,x1,y1] } }   bbox = where the object is

The key colour is read from the picture's top-left pixel (green or magenta). Plates (master, bg_far, tent_glow) are copied as is.

usage:  python scripts/camp_layers.py [--video camp-demo]
"""
import argparse
import csv
import json
import os

import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLAIN = {"master", "bg_far", "tent_glow"}


def key(im: Image.Image) -> Image.Image:
    a = np.asarray(im.convert("RGB")).astype(np.int16)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    tl = a[2, 2]
    if tl[1] > tl[0] and tl[1] > tl[2]:  # green key
        dom = g - np.maximum(r, b)
        spill = np.clip(dom, 0, None) * 0.8 * (dom > 0)
        rgb = np.dstack([r, g - spill, b])
    else:  # magenta key
        dom = np.minimum(r, b) - g
        spill = np.clip(dom, 0, None) * 0.8 * (dom > 0)
        rgb = np.dstack([r - spill, g, b - spill])
    alpha = np.clip(255 - (dom - 25) * 6, 0, 255)
    alpha[dom < 25] = 255
    out = Image.fromarray(np.dstack([rgb, alpha]).clip(0, 255).astype(np.uint8), "RGBA")
    m = out.getchannel("A").filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))  # drop the halo
    out.putalpha(m)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", default="camp-demo")
    a = ap.parse_args()
    src = os.path.join(ROOT, "content", a.video, "layers")
    dst = os.path.join(ROOT, "demo-project", "public", a.video, "layers")
    os.makedirs(src, exist_ok=True)
    os.makedirs(dst, exist_ok=True)
    info, size = {}, None
    # only the pictures listed in assets_action.csv: rejected attempts and candidates in the folder are ignored
    wanted = [r["image_filename"] for r in csv.DictReader(open(os.path.join(ROOT, "content", a.video, "assets_action.csv"), encoding="utf-8"))]
    for f in wanted:
        if not os.path.exists(os.path.join(src, f)):
            print("missing", f)
            continue
        n = f[:-4]
        im = Image.open(os.path.join(src, f))
        size = size or im.size
        if im.size != size:
            print(f"WARNING {n}: size {im.size} differs from {size}; layers must share the master canvas")
        if n in PLAIN:
            out = im.convert("RGB")
            bbox = [0, 0, im.width, im.height]
        else:
            out = key(im)
            bb = out.getchannel("A").point(lambda v: 255 if v > 12 else 0).getbbox()
            bbox = list(bb) if bb else [0, 0, 0, 0]
        out.save(os.path.join(dst, f))
        info[n] = {"w": im.width, "h": im.height, "bbox": bbox}
        print(n, im.size, bbox)
    with open(os.path.join(ROOT, "demo-project", "src", a.video, "layers.json"), "w", encoding="utf-8") as fh:
        json.dump(info, fh, indent=1)
    print(f"{len(info)} layer(s)")


if __name__ == "__main__":
    main()
