#!/usr/bin/env python3
"""Placeholder pictures for an image-driven episode: a dark gradient with the scene number and a short caption of
the planned image, so the whole video can be assembled and timed before the real (AI) pictures exist.
Real images dropped into public/<slug>/images/ with the same file names replace them; existing files are never overwritten.

usage: python make_placeholders.py --slug zs-ep01
"""
import argparse, csv, os, textwrap
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def font(size):
    for p in ("C:/Windows/Fonts/arialbd.ttf", "C:/Windows/Fonts/arial.ttf"):
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True)
    a = ap.parse_args()
    out = os.path.join(ROOT, "demo-project", "public", a.slug, "images")
    os.makedirs(out, exist_ok=True)
    made = 0
    sp = os.path.join(ROOT, "content", "zs-style.txt")
    style = open(sp, encoding="utf-8").read().strip() if os.path.exists(sp) else ""
    for r in csv.DictReader(open(os.path.join(ROOT, "content", a.slug, "scenes.csv"), encoding="utf-8")):
        path = os.path.join(out, r["image_filename"])
        if os.path.exists(path):
            continue
        n = int(r["scene"])
        img = Image.new("RGB", (1920, 1080))
        px = img.load()
        for y in range(1080):
            t = y / 1079
            for x in range(0, 1920):
                v = 0.5 + 0.5 * ((x / 1919) - 0.5)
                px[x, y] = (int(34 + 26 * t + 10 * v + (n % 5) * 3), int(40 + 24 * t + 10 * v), int(52 + 20 * t + 8 * v + (n % 3) * 4))
        d = ImageDraw.Draw(img)
        d.text((960, 380), f"{n:02d}", font=font(220), fill=(210, 214, 222), anchor="mm")
        desc = r["image_prompt"]
        if style and desc.startswith(style):
            desc = desc[len(style):].strip()
        y0 = 560
        for line in textwrap.wrap(desc, 62)[:6]:
            d.text((960, y0), line, font=font(34), fill=(170, 176, 188), anchor="mm")
            y0 += 48
        img.save(path)
        made += 1
    print("placeholders written:", made, "->", out)


if __name__ == "__main__":
    main()
