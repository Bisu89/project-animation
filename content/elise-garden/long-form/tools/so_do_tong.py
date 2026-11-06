"""Sơ đồ TỔNG khu đất (sân gần nhà + lô sau) từ data/garden_layout.json.

  python so_do_tong.py   -> references/gl1-R-so-do-tong.png

Đây là bản quy hoạch cả series. KHÔNG gửi kèm khi gen ảnh EP01 (lô sau chưa xuất hiện trong EP01);
gửi kèm ảnh EP01 dùng references/anh/gl1-R-so-do.png (so_do.py).
"""
import json, os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = json.load(open(os.path.join(ROOT, "data", "garden_layout.json"), encoding="utf-8"))
OUT = os.path.join(ROOT, "references", "gl1-R-so-do-tong.png")
BL = L["backLot"]
X0, X1 = BL["rect"][0], BL["rect"][2]
Y0, Y1 = BL["rect"][1], L["plot"]["depthNS_m"] + 2.4
S, MX, MY = 30, 120, 110
W, H = int(MX * 2 + (X1 - X0) * S), int(MY + (Y1 - Y0) * S + 120)
img = Image.new("RGB", (W, H), (250, 248, 242))
d = ImageDraw.Draw(img)
F = lambda n, b=False: ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf" if b else "C:/Windows/Fonts/arial.ttf", n)
lm = {x["id"]: x for x in L["landmarks"]}


def P(x, y):
    return MX + (x - X0) * S, MY + (Y1 - y) * S


def rect(r, **kw):
    (a, b), (c, e) = P(r[0], r[3]), P(r[2], r[1])
    d.rectangle([a, b, c, e], **kw)
    return (a + c) / 2, (b + e) / 2


def label(xy, t, n=12, fill=(40, 40, 40), b=False):
    bb = d.multiline_textbbox((0, 0), t, font=F(n, b), align="center")
    d.multiline_text((xy[0] - (bb[2] - bb[0]) / 2, xy[1] - (bb[3] - bb[1]) / 2), t, font=F(n, b), fill=fill, align="center")


# back lot (overgrown now; zones are the plan)
rect(BL["rect"], fill=(214, 220, 180), outline=(150, 130, 100), width=3)
label(P(2.2, -2.2), "BACK LOT ~20 × 25 m\n(overgrown, opened from EP02)", 15, (90, 80, 50), True)
colors = {"BL_PATH": (196, 176, 140), "BL_ORCHARD": (190, 214, 160), "BL_BERRIES": (200, 150, 170), "BL_ESPALIER": (150, 190, 120),
          "BL_CHICKENS": (230, 205, 150), "BL_WORKSHOP": (180, 165, 145), "BL_PERGOLA": (200, 170, 120), "BL_COMPOST": (120, 90, 60), "BL_WATER": (150, 190, 220)}
names = {"BL_ORCHARD": "", "BL_BERRIES": "berries\n& grapes", "BL_ESPALIER": "", "BL_CHICKENS": "chicken\ncoop + run",
         "BL_WORKSHOP": "DIY potting\nshed", "BL_PERGOLA": "pergola · table · fire pit", "BL_COMPOST": "compost\nbays", "BL_WATER": "rain tank", "BL_PATH": ""}
for z in BL["zones"]:
    c = rect(z["rect"], fill=colors[z["id"]])
    if names[z["id"]]:
        label(c, names[z["id"]], 11)
ox0, oy0, ox1, oy1 = next(z["rect"] for z in BL["zones"] if z["id"] == "BL_ORCHARD")
for i in range(4):
    for j in range(5):
        cx, cy = P(ox0 + 1.4 + i * 2.8, oy1 - 1.5 - j * 3)
        d.ellipse([cx - 0.9 * S, cy - 0.9 * S, cx + 0.9 * S, cy + 0.9 * S], fill=(120, 165, 95), outline=(80, 120, 60))
label(P(2.0, -5.0), "ORCHARD · ~20 dwarf fruit trees (~3 m grid)", 12, (50, 90, 40), True)
label(P(1.8, -19.9), "← espalier fruit wall along west edge", 10, (60, 100, 50))
# yard (EP01) simplified
rect([0, 0, 12, 12], fill=(200, 222, 172), outline=(125, 85, 55), width=4)
rect(lm["VEG_ZONE"]["rect"], fill=(150, 118, 86))
for b in L["beds"]:
    if b["builtIn"] == "EP01":
        rect(b["rect"], fill=(170, 100, 70))
rect(lm["DECK"]["rect"], fill=(176, 132, 92))
rect(lm["SHED"]["rect"], fill=(150, 155, 160))
ax, ay = P(*lm["APPLE_TREE"]["point"])
d.ellipse([ax - 1.4 * S, ay - 1.4 * S, ax + 1.4 * S, ay + 1.4 * S], fill=(168, 192, 140))
label(P(3.5, 6.5), "YARD 12 × 12 m\n(EP01: lawn + 2 beds)", 13, (60, 90, 40), True)
rect([0, 12, 12, 14.4], fill=(214, 218, 222), outline=(110, 115, 120), width=2)
label(P(6, 13.2), "HOUSE", 14, (50, 55, 60), True)
gx, gy = P(8.8, 0)
d.rectangle([gx - 0.5 * S, gy - 4, gx + 0.5 * S, gy + 4], fill=(250, 248, 242))
label((gx + 62, gy), "back gate", 12, (110, 75, 45), True)
# title, compass, scale
label((W / 2, 34), "ELISE GARDEN — whole property plan (series)", 20, b=True)
label((W / 2, 62), "near yard = EP01 (already rendered) · back lot behind the back gate = fruit trees + DIY from EP02", 12)
nx, ny = W - 50, 60
d.polygon([(nx, ny - 30), (nx - 11, ny), (nx + 11, ny)], fill=(40, 40, 40))
label((nx, ny + 14), "N", 16, b=True)
sx, sy = MX, MY + (Y1 - Y0) * S + 50
d.line([sx, sy, sx + 5 * S, sy], fill=(40, 40, 40), width=4)
label((sx + 2.5 * S, sy + 14), "5 m", 12)
img.save(OUT)
print("wrote", os.path.relpath(OUT, ROOT), img.size)
