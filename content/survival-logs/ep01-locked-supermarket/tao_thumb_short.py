"""Thumbnail dọc 1080x1920 cho Shorts: cắt ảnh 16:9 quanh điểm nhấn + chữ lớn.  python tao_thumb_short.py s1|s2|s3"""
import os, sys
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

D = os.path.dirname(os.path.abspath(__file__))
F = "C:/Windows/Fonts/ariblk.ttf"
CFG = {
    "s1": dict(img=os.path.join(D, "test-75s", "anh", "08-khoa-tay-cua.png"), fx=0.6, top="DAY 1", big=["THE DOOR", "SAID", "\"WELCOME\""], down=430),
    "s2": dict(img=os.path.join(D, "p2", "anh", "p2-33.png"), fx=0.42, top="3:12 AM", big=["WHO IS", "PAYING?"]),
    "s3": dict(img=os.path.join(D, "p2", "anh", "p2-25.png"), fx=0.36, top="DAY 9", big=["NEVER FIRE", "A FLARE"], down=360),
    "s4": dict(img=os.path.join(D, "p3", "anh", "p3-03.png"), fx=0.77, top="3:12 AM", big=["SHE WAS", "PAYING"], down=360),
    "s5": dict(img=os.path.join(D, "p3", "anh", "p3-31.png"), fx=0.5, top="DAY 14", big=["MAKE IT", "SCREAM"], down=360),
}


def make(k):
    c = CFG[k]
    im = Image.open(c["img"]).convert("RGB")
    h = im.height
    w = int(h * 9 / 16)
    x0 = max(0, min(im.width - w, int(im.width * c["fx"] - w / 2)))
    im = im.crop((x0, 0, x0 + w, h)).resize((1080, 1920), Image.LANCZOS)
    if c.get("down"):  # đẩy ảnh xuống để chữ không che điểm nhấn phía trên
        pad = Image.new("RGB", (1080, 1920), "black")
        pad.paste(im.resize((1080, 1920)), (0, c["down"]))
        im = pad
    im = ImageEnhance.Contrast(im).enhance(1.15)
    shade = Image.new("L", im.size, 0)
    sd = ImageDraw.Draw(shade)
    for i in range(760):
        sd.line([(0, i), (1080, i)], fill=int(190 * (1 - i / 760)))
    im = Image.composite(Image.new("RGB", im.size, "black"), im, shade)
    dr = ImageDraw.Draw(im)
    ft = ImageFont.truetype(F, 70)
    dr.text(((1080 - dr.textlength(c["top"], font=ft)) / 2, 120), c["top"], font=ft, fill="#f2e6c9", stroke_width=6, stroke_fill="black")
    fb = ImageFont.truetype(F, 130)
    y = 230
    for line in c["big"]:
        size = 130
        while dr.textlength(line, font=fb) > 1000 and size > 70:
            size -= 6
            fb = ImageFont.truetype(F, size)
        dr.text(((1080 - dr.textlength(line, font=fb)) / 2, y), line, font=fb, fill="#ffd23f", stroke_width=10, stroke_fill="black")
        y += size + 20
        fb = ImageFont.truetype(F, 130)
    out = os.path.join(D, f"thumb-short-{k}.png")
    im.save(out)
    print(out)


if __name__ == "__main__":
    make(sys.argv[1])
