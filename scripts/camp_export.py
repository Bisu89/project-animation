"""Export the camp scene for Remotion: a clean background plus re-scaled, trimmed layers and their rig numbers.

  content/camp-demo/layers/master.png (1536x1024), content/camp-demo/crops/*.png (edits of the 600x400 crop at BOX)
  -> demo-project/public/camp-demo/scene/*.png     bg.png (1920x1080) and RGBA layers at final pixel size
  -> demo-project/src/camp-demo/rig.json           canvas positions, pivots and axis angles of every piece

The final frame is the central 16:9 band of the master (rows 80..944) scaled 1.25x to 1920x1080.
Crop px -> canvas px:  ((x + 400) * 1.25, (y + 270) * 1.25).
The person is moved DX px to the right (legs under the table) because the cup was out of reach in the master.

usage:  python scripts/camp_export.py
"""
import json
import math
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from camp_layers import key  # noqa: E402

ROOT = os.path.dirname(HERE)
C = os.path.join(ROOT, "content", "camp-demo", "crops")
OUT = os.path.join(ROOT, "demo-project", "public", "camp-demo", "scene")
BOX = (400, 350, 1000, 750)
K = 1.25  # master px -> canvas px
DX = 125
SRC = 600 / 1536  # source px -> crop px if the generator had kept the scale
HEAD_SCALE = 0.1775  # head (hair to chin) = 74 crop px, measured on the master
L1, L2, HAND = 56, 52, 38  # bone lengths in crop px
AXIS = {  # bone axis in each arm piece, fractions of its trimmed bbox
    "arm_upper": ((0.12, 0.40), (0.97, 0.75)),
    "arm_forearm": ((0.04, 0.40), (0.95, 0.55)),
    "hand_open": ((0.03, 0.22), (0.80, 0.60)),
    "hand_grip": ((0.05, 0.50), (0.95, 0.50)),
}
# The arm pieces were painted under flatter light than the torso (which carries the warm rim light of the tent):
# per-channel gain to sit them in the same light
GRADE = {"arm_upper": (0.88, 0.84, 0.80), "arm_forearm": (0.88, 0.84, 0.80), "hand_open": (0.93, 0.88, 0.84), "hand_grip": (0.93, 0.88, 0.84)}
BONE_LEN = {"arm_upper": L1, "arm_forearm": L2, "hand_open": HAND, "hand_grip": HAND}


def canvas(x, y):
    return ((x + BOX[0]) * K, (y + BOX[1] - 80) * K)


def load(name):
    im = key(Image.open(os.path.join(C, name + ".png")))
    bb = im.getchannel("A").point(lambda v: 255 if v > 12 else 0).getbbox()
    return im.crop(bb), bb


def scaled(im, s):
    return im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)


def save(name, im, x, y, info, **extra):
    im.save(os.path.join(OUT, name + ".png"))
    info[name] = {"x": round(x, 1), "y": round(y, 1), "w": im.width, "h": im.height, **extra}


def match_gain(table_rgba):
    """Per-channel gain that brings the generated table-top colour to the master's table-top colour."""
    master = np.asarray(Image.open(os.path.join(C, "camp_crop.png")).convert("RGB")).astype(float)
    t = np.asarray(table_rgba).astype(float)
    ys, xs = np.mgrid[0:400, 0:600]
    sel = (t[..., 3] > 200) & (ys > 276) & (ys < 306)
    return [master[..., c][sel].mean() / max(t[..., c][sel].mean(), 1) for c in range(3)], int(sel.sum())


def head_alignment(open_im, closed_im):
    """Scale and offset that lay head_closed on head_open (alpha overlap), or None if they cannot be registered."""
    a = np.asarray(open_im.getchannel("A")) > 128
    best = (0, 1, 0, 0)
    for s in np.arange(0.85, 1.2, 0.025):
        c = closed_im.resize((round(closed_im.width * s), round(closed_im.height * s)), Image.LANCZOS)
        cm = np.asarray(c.getchannel("A")) > 128
        for dy in range(-60, 61, 4):
            for dx in range(-60, 61, 4):
                H, W = a.shape
                canvas_ = np.zeros_like(a)
                y0, x0 = dy + (H - cm.shape[0]) // 2, dx + (W - cm.shape[1]) // 2
                ys0, xs0 = max(0, y0), max(0, x0)
                ys1, xs1 = min(H, y0 + cm.shape[0]), min(W, x0 + cm.shape[1])
                if ys1 <= ys0 or xs1 <= xs0:
                    continue
                canvas_[ys0:ys1, xs0:xs1] = cm[ys0 - y0 : ys1 - y0, xs0 - x0 : xs1 - x0]
                iou = (a & canvas_).sum() / max((a | canvas_).sum(), 1)
                if iou > best[0]:
                    best = (iou, s, dx, dy)
    return best


def main():
    os.makedirs(OUT, exist_ok=True)
    info = {}
    # --- background: master with the camp area replaced by the clean plate (feathered edges)
    master = Image.open(os.path.join(ROOT, "content", "camp-demo", "layers", "master.png")).convert("RGB")
    plate = Image.open(os.path.join(C, "plate_camp.png")).convert("RGB").resize((600, 400), Image.LANCZOS)
    mask = Image.new("L", (600, 400), 0)
    mask.paste(255, (14, 14, 586, 386))
    mask = mask.filter(ImageFilter.GaussianBlur(9))
    master.paste(plate, BOX[:2], mask)
    bg = master.crop((0, 80, 1536, 944)).resize((1920, 1080), Image.LANCZOS)
    bg.save(os.path.join(OUT, "bg.png"))

    # --- body (moved right by DX), at source scale SRC
    body, bb = load("person_body")
    s = SRC * K
    x, y = canvas(bb[0] * SRC + DX, bb[1] * SRC)
    body_s = scaled(body, s)
    # the chair's front-rail rivet ends up above the table edge once the person sits closer, where it reads as a stray blob:
    # paint it out with the trouser texture just to its right (pixel box measured on the exported 424x346 body)
    body_s.paste(body_s.crop((274, 212, 292, 228)), (254, 212))
    save("body", body_s, x, y, info)

    # --- heads
    ho, hbb = load("head_open")
    hc, cbb = load("head_closed")
    hs = HEAD_SCALE * K
    HEAD_CENTER = (162 + DX, 78)
    ho_s = scaled(ho, hs)
    hx, hy = canvas(HEAD_CENTER[0], HEAD_CENTER[1])
    hx, hy = hx - ho_s.width / 2, hy - ho_s.height / 2
    save("head_open", ho_s, hx, hy, info)
    iou, sc, dx, dy = head_alignment(ho, hc)
    print(f"head_closed registration: IoU {iou:.2f} scale {sc:.3f} offset ({dx},{dy})")
    hc2 = scaled(hc, hs * sc)
    # head_closed was resized by sc and centred on head_open's bbox, shifted by (dx, dy) source px
    cx = hx + ho_s.width / 2 + dx * hs - hc2.width / 2
    cy = hy + ho_s.height / 2 + dy * hs - hc2.height / 2
    save("head_closed", hc2, cx, cy, info, iou=round(iou, 3))

    # --- table, colour matched to the master
    tb, tbb = load("table")
    t_full = key(Image.open(os.path.join(C, "table.png"))).resize((600, 400), Image.LANCZOS)
    gain, n = match_gain(t_full)
    print("table gain", [round(g, 2) for g in gain], "from", n, "px")
    r, g, b, a = tb.split()
    tb = Image.merge("RGBA", [r.point(lambda v: min(255, v * gain[0])), g.point(lambda v: min(255, v * gain[1])), b.point(lambda v: min(255, v * gain[2])), a])
    x, y = canvas(tbb[0] * SRC, tbb[1] * SRC)
    save("table", scaled(tb, s), x, y, info)

    # --- cup (same scale as the master: the generator kept it)
    cp, cbb2 = load("cup")
    cw = scaled(cp, s)
    x, y = canvas(cbb2[0] * SRC, cbb2[1] * SRC)
    save("cup", cw, x, y, info)

    # --- arm pieces: scaled so the bone axis has the target length; the pivot is the start of the axis
    for name, ((fx0, fy0), (fx1, fy1)) in AXIS.items():
        im, _ = load(name)
        gr = GRADE[name]
        r_, g_, b_, a__ = im.split()
        im = Image.merge("RGBA", [r_.point(lambda v: int(v * gr[0])), g_.point(lambda v: int(v * gr[1])), b_.point(lambda v: int(v * gr[2])), a__])
        w, h = im.size
        a0 = (fx0 * w, fy0 * h)
        a1 = (fx1 * w, fy1 * h)
        src_len = math.hypot(a1[0] - a0[0], a1[1] - a0[1])
        sc2 = BONE_LEN[name] * K / src_len
        out = scaled(im, sc2)
        save(name, out, 0, 0, info, pivot=[round(a0[0] * sc2, 1), round(a0[1] * sc2, 1)], srcAngle=round(math.atan2(a1[1] - a0[1], a1[0] - a0[0]), 5), len=BONE_LEN[name] * K)
    rig = {"K": K, "box": BOX, "dx": DX, "layers": info}
    with open(os.path.join(ROOT, "demo-project", "src", "camp-demo", "rig.json"), "w", encoding="utf-8") as fh:
        json.dump(rig, fh, indent=1)
    print("exported", len(info), "layers ->", OUT)


if __name__ == "__main__":
    main()
