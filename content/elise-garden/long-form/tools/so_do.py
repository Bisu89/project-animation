"""Vẽ sơ đồ sân sau (đúng tỉ lệ) từ data/garden_layout.json.

  python so_do.py            -> references/anh/gl1-R-so-do.png  (gửi kèm khi gen ảnh để khóa bố cục)

Chỉ đọc JSON; sửa bố cục thì sửa garden_layout.json rồi chạy lại.
"""
import json, math, os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = json.load(open(os.path.join(ROOT, "data", "garden_layout.json"), encoding="utf-8"))
OUT = os.path.join(ROOT, "references", "anh", "gl1-R-so-do.png")

S = 62                                   # px per metre
W_M, H_M = L["plot"]["widthEW_m"], L["plot"]["depthNS_m"]
HOUSE_D = 2.4                            # metres of house drawn above the plot
MX, MY = 150, 120
W, H = int(MX * 2 + W_M * S), int(MY + (H_M + HOUSE_D) * S + 190)
img = Image.new("RGB", (W, H), (250, 248, 242))
d = ImageDraw.Draw(img)
F = lambda n: ImageFont.truetype("C:/Windows/Fonts/arial.ttf", n)
FB = lambda n: ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", n)
lm = {x["id"]: x for x in L["landmarks"]}


def P(x, y):
    return MX + x * S, MY + (H_M + HOUSE_D - y) * S


def rect(r, **kw):
    (x0, y0), (x1, y1) = P(r[0], r[3]), P(r[2], r[1])
    d.rectangle([x0, y0, x1, y1], **kw)
    return (x0 + x1) / 2, (y0 + y1) / 2


def dashed_rect(r, color, width=2, dash=9):
    (x0, y0), (x1, y1) = P(r[0], r[3]), P(r[2], r[1])
    for a, b in [((x0, y0), (x1, y0)), ((x1, y0), (x1, y1)), ((x1, y1), (x0, y1)), ((x0, y1), (x0, y0))]:
        n = max(2, int(math.dist(a, b) // dash))
        for i in range(0, n, 2):
            t0, t1 = i / n, min((i + 1) / n, 1)
            d.line([a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0, a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1], fill=color, width=width)
    return (x0 + x1) / 2, (y0 + y1) / 2


def label(xy, text, size=14, fill=(40, 40, 40), bold=False):
    f = FB(size) if bold else F(size)
    bb = d.multiline_textbbox((0, 0), text, font=f, align="center")
    d.multiline_text((xy[0] - (bb[2] - bb[0]) / 2, xy[1] - (bb[3] - bb[1]) / 2), text, font=f, fill=fill, align="center")


def dot(pt, r, fill):
    x, y = P(*pt)
    d.ellipse([x - r, y - r, x + r, y + r], fill=fill)
    return x, y


# yard: lawn green everywhere, then zones
rect([0, 0, W_M, H_M], fill=(200, 222, 172))
for i in range(W_M + 1):
    d.line([*P(i, 0), *P(i, H_M)], fill=(186, 208, 158))
for j in range(H_M + 1):
    d.line([*P(0, j), *P(W_M, j)], fill=(186, 208, 158))
label(P(3.6, 4.0), "LAWN (kept for living)\nmowed in S1", 15, (70, 100, 50), bold=True)
# vegetable zone (cleared in EP01)
rect(lm["VEG_ZONE"]["rect"], fill=(150, 118, 86))
label(P(8.9, 3.75), "vegetable area (cleared in EP01)", 12, (250, 240, 225))
# path gate -> beds
rect([8.3, 0, 9.3, 3.5], fill=(190, 172, 140))
# house
rect([0, H_M, W_M, H_M + HOUSE_D], fill=(214, 218, 222), outline=(110, 115, 120), width=3)
label(P(6.0, H_M + 1.75), "HOUSE (single-storey ranch, light grey lap siding, white trim)", 16, (50, 55, 60), bold=True)
# deck + steps + patio
c = rect(lm["DECK"]["rect"], fill=(176, 132, 92), outline=(120, 85, 55), width=3)
label((c[0] - 40, c[1] - 30), "WOOD DECK (60 cm)", 13, (255, 245, 230), bold=True)
rect([3.5, 9.6, 4.5, 10.0], fill=(150, 110, 75))
label(P(4.0, 9.8), "steps", 10, (255, 245, 230))
sx, sy = P(4.0, 12.0)
d.rectangle([sx - 30, sy - 5, sx + 30, sy + 3], fill=(170, 200, 225))
label((sx, sy + 14), "sliding door", 11, (40, 60, 90))
c = rect(lm["PATIO"]["rect"], fill=(196, 196, 190))
label(c, "concrete patio\n(sawhorses, SQ04)", 11)
hx, hy = dot(lm["HOSE_BIB"]["point"], 7, (60, 130, 60))
label((hx, hy + 16), "hose reel", 11, (40, 100, 40))
kx, ky = P(*lm["KITCHEN_WINDOW"]["point"])
d.rectangle([kx - 26, ky - 5, kx + 26, ky + 3], fill=(255, 255, 255), outline=(90, 90, 90))
label((kx, ky + 14), "kitchen window", 11)
rx, ry = dot(lm["RAIN_BARREL"]["point"], 9, (40, 80, 50))
label((rx - 40, ry + 4), "rain\nbarrel", 11, (30, 70, 40))
# shed + compost
c = rect(lm["SHED"]["rect"], fill=(150, 155, 160), outline=(90, 95, 100), width=3)
label(c, "SHED\n(tools)", 13, (255, 255, 255), bold=True)
c = rect(lm["COMPOST_BIN"]["rect"], fill=(100, 72, 45))
label((c[0], c[1] - 22), "compost bin", 11)
# apple tree
ax, ay = P(*lm["APPLE_TREE"]["point"])
d.ellipse([ax - 1.6 * S, ay - 1.6 * S, ax + 1.6 * S, ay + 1.6 * S], fill=(168, 192, 140), outline=(100, 125, 80), width=2)
d.ellipse([ax - 8, ay - 8, ax + 8, ay + 8], fill=(110, 80, 50))
label((ax, ay + 24), "old apple tree", 12)
# futures
for k, name in (("FUTURE_OUTDOOR_KITCHEN", "future\ngrill"), ("FUTURE_GREENHOUSE", "future\ngreenhouse"), ("FUTURE_TRELLIS", "")):
    c = dashed_rect(lm[k]["rect"], (120, 120, 120), 2)
    if name:
        label(c, name, 11, (100, 100, 100))
label(P(11.35, 8.6), "future trellis\n(east fence)", 11, (100, 100, 100))
# beds
for b in L["beds"]:
    x0, y0, x1, y1 = b["rect"]
    if b["builtIn"] == "EP01":
        rect(b["rect"], fill=(170, 100, 70), outline=(120, 65, 40), width=4)
        d.rectangle([*P(x0 + 0.07, y1 - 0.07), *P(x1 - 0.07, y0 + 0.07)], fill=(80, 60, 45))
        rows = [(4.8, "R"), (4.95, "R"), (5.9, "L"), (6.2, "L")] if b["id"] == "BED-01" else [(4.8, "P"), (5.1, "P"), (5.4, "P")]
        for y, _ in rows:
            d.line([*P(x0 + 0.1, y), *P(x1 - 0.12, y)], fill=(205, 190, 165), width=2)
            lx, ly = P(x1 - 0.13, y)
            d.rectangle([lx - 3, ly - 3, lx + 3, ly + 3], fill=(255, 255, 255))
        label(P((x0 + x1) / 2, y1 + 0.28), f"{b['id']}  4×8 ft", 13, (255, 245, 230), bold=True)
        if b["id"] == "BED-02":
            label(P((x0 + x1) / 2, 6.25), "empty\n(later)", 10, (215, 200, 180))
    else:
        c = dashed_rect(b["rect"], (110, 90, 70), 2)
        label(c, b["id"] + "\n(planned)", 10, (90, 75, 60))
# fence + gate
fc = (125, 85, 55)
for a, b in (((0, 0), (8.3, 0)), ((9.3, 0), (W_M, 0)), ((0, 0), (0, H_M)), ((W_M, 0), (W_M, H_M))):
    d.line([*P(*a), *P(*b)], fill=fc, width=8)
gx, gy = P(8.8, 0)
label((gx, gy + 18), "BACK GATE", 13, bold=True)
label(P(-1.25, 6.0), "cedar\nprivacy\nfence\n1.8 m\n(6 ft)", 12, (110, 75, 45))
# cameras
fov = {28: 65, 35: 54, 50: 40}
cols = {"CAM_A_ENTRANCE": (200, 40, 40), "CAM_B_PORCH": (40, 90, 200), "CAM_C_EAST_FENCE": (150, 40, 170), "CAM_D_GARDEN_SIDE": (230, 120, 0)}
yaws = {c["id"]: float(c["yaw"].split("°")[0]) for c in L["cameras"]}
offs = {"A": (-52, 4), "B": (-64, 30), "C": (0, -32), "D": (-34, 22)}
for cam in L["cameras"]:
    cx, cy = P(*cam["position_m"])
    col, a, half = cols[cam["id"]], math.radians(yaws[cam["id"]]), math.radians(fov[cam["lensFF_mm"]] / 2)
    R = 4.2 * S
    over = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(over).polygon([(cx, cy)] + [(cx + R * math.sin(t), cy - R * math.cos(t)) for t in (a - half, a + half)], fill=(*col, 50))
    img = Image.alpha_composite(img.convert("RGBA"), over).convert("RGB")
    d = ImageDraw.Draw(img)
    d.line([cx, cy, cx + 1.5 * S * math.sin(a), cy - 1.5 * S * math.cos(a)], fill=col, width=4)
    d.ellipse([cx - 9, cy - 9, cx + 9, cy + 9], fill=col)
    k = cam["id"].split("_")[1]
    label((cx + offs[k][0], cy + offs[k][1]), f"CAM {k}\n{cam['lensFF_mm']}mm", 12, col, bold=True)
# title, compass, scale, legend
label((W / 2, 36), "ELISE GARDEN — American backyard site plan (EP01 end state S4)", 21, bold=True)
label((W / 2, 66), "yard 12 m × 12 m (~40 × 40 ft) · lawn on the left for living, vegetable beds in the sunniest right half · from the back gate: BED-01 LEFT, BED-02 RIGHT", 12)
nx, ny = W - 60, 70
d.polygon([(nx, ny - 36), (nx - 13, ny), (nx + 13, ny)], fill=(40, 40, 40))
label((nx, ny + 16), "N", 18, bold=True)
bx, by = MX, MY + (H_M + HOUSE_D) * S + 70
d.line([bx, by, bx + 2 * S, by], fill=(40, 40, 40), width=4)
label((bx + S, by + 15), "2 m", 12)
label((W / 2 + 60, by + 2), "R = radish   L = lettuce   P = pak choi   ▪ = white plant label   dashed = planned / future, NOT built in EP01", 12)
os.makedirs(os.path.dirname(OUT), exist_ok=True)
img.save(OUT)
print("wrote", os.path.relpath(OUT, ROOT), img.size)
