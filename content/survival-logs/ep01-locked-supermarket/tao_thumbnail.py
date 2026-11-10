"""Thumbnail 1280x720 cho từng phần: ảnh nền + chữ lớn.  python tao_thumbnail.py p1"""
import os, sys
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

D = os.path.dirname(os.path.abspath(__file__))
F = "C:/Windows/Fonts/ariblk.ttf"
CFG = {
    "p1": dict(img=os.path.join(D, "test-75s", "anh", "08-khoa-tay-cua.png"), big="14 DAYS", small="TRAPPED IN A SUPERMARKET", part="PART 1"),
    "p2": dict(img=os.path.join(D, "p2", "anh", "p2-33.png"), big="3:12 AM", small="SOMEONE ELSE IS IN THE STORE", part="PART 2"),
    "p2b": dict(img=os.path.join(D, "p2", "anh", "p2-25.png"), big="DAY 9", small="I LIT IT ANYWAY", part="PART 2"),
    "p2c": dict(img=os.path.join(D, "p2", "anh", "p2-37.png"), big="WHO'S UP THERE?", small="SOMETHING LIVES IN THE CEILING", part="PART 2", size=104),
    "p3": dict(img=os.path.join(D, "p3", "anh", "p3-31.png"), big="WELCOME!", small="THE DOOR FINALLY BROKE", part="PART 3"),
    "p3b": dict(img=os.path.join(D, "p3", "anh", "p3-25.png"), big="I WENT BACK", small="THE VAN WAS RIGHT THERE", part="PART 3", size=120),
    "p3c": dict(img=os.path.join(D, "p3", "anh", "p3-36.png"), big="7:20 AM", small="THE CONVOY LEFT AT 7:00", part="PART 3"),
    "p2d": dict(img=os.path.join(D, "p2", "anh", "p2-24.png"), big="SHE SAID DON'T", small="I DID IT ANYWAY", part="PART 2", size=112),
    "fa": dict(img=os.path.join(D, "p3", "anh", "p3-31.png"), big="14 DAYS", small="LOCKED IN A ZOMBIE SUPERMARKET", part="FULL MOVIE"),
    "fb": dict(img=os.path.join(D, "test-75s", "anh", "08-khoa-tay-cua.png"), big="14 DAYS", small="THE DOOR KEPT SAYING WELCOME", part="FULL MOVIE"),
    "fc": dict(img=os.path.join(D, "p2", "anh", "p2-33.png"), big="3:12 AM", small="WHO WAS SHOPPING IN MY STORE?", part="FULL MOVIE"),
    "fd": dict(img=os.path.join(D, "p3", "anh", "p3-03.png"), big="14 DAYS", small="SHE WAS HIDING IN THE CEILING", part="FULL MOVIE"),
}


def outline_text(dr, xy, text, font, fill, stroke=8):
    dr.text(xy, text, font=font, fill=fill, stroke_width=stroke, stroke_fill="black")


def make(key):
    c = CFG[key]
    im = Image.open(c["img"]).convert("RGB").resize((1280, 720), Image.LANCZOS)
    im = ImageEnhance.Contrast(im).enhance(1.15)
    im = ImageEnhance.Color(im).enhance(1.15)
    # tối dần ở góc trái dưới để chữ nổi
    shade = Image.new("L", (1280, 720), 0)
    sd = ImageDraw.Draw(shade)
    for i in range(520):
        sd.line([(0, 720 - i), (1280, 720 - i)], fill=int(170 * (1 - i / 520)))
    im = Image.composite(Image.new("RGB", im.size, "black"), im, shade)
    dr = ImageDraw.Draw(im)
    sz = c.get("size", 150)
    outline_text(dr, (40, 470 + (150 - sz) // 2), c["big"], ImageFont.truetype(F, sz), "#ffd23f", 10)
    outline_text(dr, (46, 640), c["small"], ImageFont.truetype(F, 46), "white", 6)
    pf = ImageFont.truetype(F, 40)
    w = dr.textlength(c["part"], font=pf)
    dr.rectangle([1280 - w - 70, 30, 1250, 100], fill="#c62828")
    dr.text((1280 - w - 50, 38), c["part"], font=pf, fill="white")
    out = os.path.join(D, "thumb", f"thumbnail-{key}.png")
    im.save(out)
    print(out)


if __name__ == "__main__":
    make(sys.argv[1])
