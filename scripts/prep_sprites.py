#!/usr/bin/env python3
"""Prepare AI-generated cut-out assets for Remotion.

  content/<slug>/action/<file>.png    what you generate (characters on flat green, backgrounds 16:9)
  -> demo-project/public/<slug>/action/<file>.png   characters keyed to transparent, trimmed to the figure (feet = bottom edge)
                                                    backgrounds resized to 1920x1080
  -> demo-project/src/<slug>/sprites.ts             { name: { w, h } } of every trimmed sprite (aspect for the renderer)

Every file listed in content/<slug>/assets_action.csv that is missing gets a flat placeholder (--no-placeholders to skip),
so the animation can be tested before the pictures exist.

usage: python scripts/prep_sprites.py --slug anc-pilot1
"""
import argparse, csv, json, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter


def key_green(im: Image.Image) -> Image.Image:
    a = np.asarray(im.convert("RGB")).astype(np.int16)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    dom = g - np.maximum(r, b)  # how much green dominates
    alpha = np.clip(255 - (dom - 25) * 6, 0, 255)  # fully keyed when green dominates by >= ~65, soft edge below
    alpha[dom < 25] = 255
    # despill: pull leftover green fringe back toward the other channels
    spill = np.clip(g - np.maximum(r, b), 0, None)
    soft = (dom >= 25) & (dom < 70)
    g2 = np.where(soft | (dom > 0), g - spill * 0.8, g)
    out = np.dstack([r, g2, b, alpha]).clip(0, 255).astype(np.uint8)
    rgba = Image.fromarray(out, "RGBA")
    # erode the matte by 1px to drop the green halo, then re-feather
    m = rgba.getchannel("A").filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    rgba.putalpha(m)
    return rgba


def trim(im: Image.Image) -> Image.Image:
    box = im.getchannel("A").point(lambda v: 255 if v > 12 else 0).getbbox()
    return im.crop(box) if box else im


def placeholder(name: str, kind: str, aspect: str) -> Image.Image:
    """Flat stand-in so the animation can be built before the real pictures exist."""
    if kind == "background":
        im = Image.new("RGB", (1920, 1080), "#7d8a96")
        d = ImageDraw.Draw(im)
        d.rectangle([0, 720, 1920, 1080], fill="#8a7a55")
        d.polygon([(0, 720), (0, 120), (420, 400), (700, 720)], fill="#5b5148")
        return im
    W, H = (900, 675) if aspect == "4:3" else (600, 800)
    im = Image.new("RGB", (W, H), "#00ff00")
    d = ImageDraw.Draw(im)
    greek = name.startswith("g_")
    col = "#b3262e" if greek else {"e": "#e9e2cf", "i": "#f2f2ee", "k": "#b8863b", "s": "#7a5232"}.get(name[0], "#2c5aa0")
    swing = 1 if name.endswith("_a.png") else -1 if name.endswith("_b.png") else 0
    if "fall" in name:
        d.rounded_rectangle([140, 330, 760, 470], 40, fill=col, outline="#111", width=6)
        d.ellipse([60, 300, 210, 450], fill="#e3b48a", outline="#111", width=6)
        return im
    lean = 40 if "run" in name or "thrust" in name else (-40 if "hit" in name else 0)
    cx = 300
    d.line([cx, 520, cx - 70 * swing, 740], fill="#111", width=26)
    d.line([cx, 520, cx + 70 * swing, 740], fill="#111", width=26)
    d.rounded_rectangle([cx - 90 + lean // 2, 250, cx + 90 + lean // 2, 540], 30, fill=col, outline="#111", width=6)
    hx = cx + lean
    d.ellipse([hx - 110, 60, hx + 110, 280], fill="#f6d3b3", outline="#111", width=6)
    if greek:
        d.pieslice([hx - 120, 40, hx + 120, 290], 180, 360, fill="#a9741f", outline="#111", width=6)
        d.rectangle([hx - 14, 5, hx + 14, 60], fill="#b3262e")
    d.ellipse([hx + 10, 130, hx + 60, 190], fill="white", outline="#111", width=4)
    d.ellipse([hx + 36, 150, hx + 54, 176], fill="#111")
    d.ellipse([cx + 40, 330, cx + 220, 510], fill="#b3262e" if greek else "#b08a4e", outline="#111", width=6)
    d.line([cx + 130 + lean, 780, cx + 150 + lean, 20 if "thrust" not in name else 380], fill="#6b4a22", width=10)
    return im


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True)
    ap.add_argument("--target-h", type=int, default=900, help="stored height of an upright sprite, px")
    ap.add_argument("--no-placeholders", action="store_true")
    a = ap.parse_args()
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    src = os.path.join(root, "content", a.slug, "action")
    dst = os.path.join(root, "demo-project", "public", a.slug, "action")
    os.makedirs(src, exist_ok=True)
    os.makedirs(dst, exist_ok=True)
    rows = list(csv.DictReader(open(os.path.join(root, "content", a.slug, "assets_action.csv"), encoding="utf-8")))
    sizes, made, ph = {}, 0, 0
    # one scale per character family so a lying figure is as big as a standing one: scale by the family's standing height
    scale = {}
    for r in rows:
        if r["type"] != "character":
            continue
        fn = r["image_filename"]
        p = os.path.join(src, fn)
        if os.path.exists(p):
            im = key_green(Image.open(p))
        elif not a.no_placeholders:
            im = key_green(placeholder(fn, "character", r["aspect"]))
            ph += 1
        else:
            continue
        im = trim(im)
        fam = fn.split("_")[0]
        if "fall" in fn:
            continue
        s = a.target_h / im.height
        scale.setdefault(fam, []).append(s)
        r["_im"] = im
        r["_s"] = s
    fam_s = {k: sum(v) / len(v) for k, v in scale.items()}
    for r in rows:
        fn = r["image_filename"]
        if r["type"] == "background":
            p = os.path.join(src, fn)
            if os.path.exists(p):
                im = Image.open(p).convert("RGB")
            elif not a.no_placeholders:
                im = placeholder(fn, "background", "16:9")
                ph += 1
            else:
                continue
            im = im.resize((1920, 1080), Image.LANCZOS)
            im.save(os.path.join(dst, fn))
            made += 1
            continue
        if "_im" not in r:
            p = os.path.join(src, fn)
            if "fall" in fn:
                im = key_green(Image.open(p) if os.path.exists(p) else placeholder(fn, "character", "4:3"))
                im = trim(im)
                fam = fn.split("_")[0]
                s = fam_s.get(fam, 1.0)
                r["_im"], r["_s"] = im, s
            else:
                continue
        im, s = r["_im"], fam_s.get(fn.split("_")[0], r["_s"])
        out = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
        out.save(os.path.join(dst, fn))
        sizes[fn[:-4]] = {"w": out.width, "h": out.height}
        made += 1
    ts = os.path.join(root, "demo-project", "src", a.slug, "sprites.ts")
    with open(ts, "w", encoding="utf-8") as f:
        f.write("// Generated by scripts/prep_sprites.py. Trimmed sprite sizes (feet = bottom edge, figure faces right).\n")
        f.write("export const SPRITES: Record<string, { w: number; h: number }> = " + json.dumps(sizes, indent=1) + ";\n")
    print(json.dumps({"written": made, "placeholders": ph, "sprites": len(sizes), "families": {k: round(v, 3) for k, v in fam_s.items()}}))


if __name__ == "__main__":
    main()
