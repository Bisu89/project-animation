"""Static composite of the camp scene from the crop-edited pieces, to judge the art before any animation.

Pieces (content/camp-demo/crops/*.png, 1536x1024 edits of the 600x400 crop at BOX) are keyed, re-scaled by measurement
(the generator did not keep sizes) and placed in crop coordinates. Output: a comparison image (master | composite).

usage:  python scripts/camp_build.py --out some.png [--dx 130]
"""
import argparse
import math
import os
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from camp_layers import key  # noqa: E402

ROOT = os.path.dirname(HERE)
C = os.path.join(ROOT, "content", "camp-demo", "crops")
BOX = (400, 350, 1000, 750)
PLAIN = 600 / 1536  # crop px per source px if the generator had kept the scale

# Landmarks measured on the approved master, in crop px (x right, y down).
SHOULDER = (197, 189)  # centre of the empty sleeve opening in person_body.png
HEAD_CENTER = (162, 78)
HEAD_SCALE = 0.1775  # head (hair to chin) = 74 px
L1, L2 = 56, 52  # bone lengths: shoulder-elbow, elbow-wrist
HAND_LEN = 38
# bone axis inside each arm piece, as fractions of its bbox: (x0, y0), (x1, y1)
AXIS = {
    "arm_upper": ((0.12, 0.40), (0.97, 0.75)),
    "arm_forearm": ((0.04, 0.40), (0.95, 0.55)),
    "hand_open": ((0.03, 0.22), (0.80, 0.60)),
    "hand_grip": ((0.05, 0.50), (0.95, 0.50)),
}


def load(n):
    im = key(Image.open(os.path.join(C, n + ".png")))
    bb = im.getchannel("A").point(lambda v: 255 if v > 12 else 0).getbbox()
    return im.crop(bb)


def place_bone(canvas, name, p_from, p_to, length=None):
    """Draw piece `name` so that its axis runs from p_from to p_to (scaled to that length)."""
    im = load(name)
    (ax0, ay0), (ax1, ay1) = AXIS[name]
    w, h = im.size
    a0 = (ax0 * w, ay0 * h)
    a1 = (ax1 * w, ay1 * h)
    src_len = math.hypot(a1[0] - a0[0], a1[1] - a0[1])
    src_ang = math.atan2(a1[1] - a0[1], a1[0] - a0[0])
    dx, dy = p_to[0] - p_from[0], p_to[1] - p_from[1]
    tgt_len = length or math.hypot(dx, dy)
    s = tgt_len / src_len
    ang = math.degrees(math.atan2(dy, dx) - src_ang)
    big = im.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)
    rot = big.rotate(-ang, resample=Image.BICUBIC, expand=True, center=(a0[0] * s, a0[1] * s))
    # after rotate(expand) the pivot moves; find it by rotating a marker the same way
    cx, cy = a0[0] * s, a0[1] * s
    W, H = big.size
    th = math.radians(-ang)
    ox, oy = cx - W / 2, cy - H / 2
    rx = ox * math.cos(th) + oy * math.sin(th)
    ry = -ox * math.sin(th) + oy * math.cos(th)
    px, py = rot.size[0] / 2 + rx, rot.size[1] / 2 + ry
    canvas.alpha_composite(rot, (round(p_from[0] - px), round(p_from[1] - py)))


def ik(S, T, l1, l2):
    dx, dy = T[0] - S[0], T[1] - S[1]
    d = min(l1 + l2 - 0.5, max(abs(l1 - l2) + 0.5, math.hypot(dx, dy)))
    a = math.atan2(dy, dx)
    c = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)
    s = a + math.acos(max(-1, min(1, c)))  # elbow below the line
    return (S[0] + l1 * math.cos(s), S[1] + l1 * math.sin(s))


def build(dx=125, grip=False, hand_target=None):  # hand_target is the wrist, absolute crop px; default = resting on the thigh
    canvas = Image.open(os.path.join(C, "plate_camp.png")).convert("RGB").resize((600, 400), Image.LANCZOS).convert("RGBA")
    # the table is in front of the legs. The plate has no table (the generator removed it), so table.png is used,
    # with its colours matched to the table in the master: per-channel gain from the median of the master's table pixels
    table = key(Image.open(os.path.join(C, "table.png"))).resize((600, 400), Image.LANCZOS)
    master = Image.open(os.path.join(C, "camp_crop.png")).convert("RGB")
    sel = [(x, y) for y in range(0, 400, 3) for x in range(0, 600, 3) if table.getpixel((x, y))[3] > 200 and 285 < y < 312]  # table-top planks only (no legs or ground behind them)
    gain = []
    for ch in range(3):
        m = sorted(master.getpixel(p)[ch] for p in sel)[len(sel) // 2]
        t = sorted(table.getpixel(p)[ch] for p in sel)[len(sel) // 2]
        gain.append(m / max(t, 1))
    r, g, b, a_ = table.split()
    table = Image.merge("RGBA", [r.point(lambda v: min(255, v * gain[0])), g.point(lambda v: min(255, v * gain[1])), b.point(lambda v: min(255, v * gain[2])), a_])
    body = key(Image.open(os.path.join(C, "person_body.png"))).resize((600, 400), Image.LANCZOS)
    cup = key(Image.open(os.path.join(C, "cup.png"))).resize((600, 400), Image.LANCZOS)
    canvas.alpha_composite(body, (dx, 0))
    # head
    hd = load("head_open")
    hs = HEAD_SCALE
    hd = hd.resize((round(hd.width * hs), round(hd.height * hs)), Image.LANCZOS)
    canvas.alpha_composite(hd, (round(HEAD_CENTER[0] + dx - hd.width / 2), round(HEAD_CENTER[1] - hd.height / 2)))
    canvas.alpha_composite(table)  # the table is in front of the legs
    canvas.alpha_composite(cup)
    S = (SHOULDER[0] + dx, SHOULDER[1])
    T = hand_target or (245 + dx, 222)
    E = ik(S, T, L1, L2)
    place_bone(canvas, "arm_upper", S, E, L1)
    place_bone(canvas, "arm_forearm", E, T, L2)
    end = (T[0] + (T[0] - E[0]) / L2 * HAND_LEN, T[1] + (T[1] - E[1]) / L2 * HAND_LEN)
    place_bone(canvas, "hand_grip" if grip else "hand_open", T, end, HAND_LEN)
    return canvas


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--dx", type=int, default=125)
    ap.add_argument("--reach", action="store_true", help="hand on the cup handle, fist closed")
    a = ap.parse_args()
    master = Image.open(os.path.join(C, "camp_crop.png")).convert("RGB")
    comp = (build(a.dx, True, (343, 258)) if a.reach else build(a.dx)).convert("RGB")
    out = Image.new("RGB", (1800, 600))
    out.paste(master.resize((900, 600), Image.LANCZOS), (0, 0))
    out.paste(comp.resize((900, 600), Image.LANCZOS), (900, 0))
    out.save(a.out)


if __name__ == "__main__":
    main()
