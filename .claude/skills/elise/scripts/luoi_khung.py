"""Ghép lưới khung hình có ghi nhãn, để xem nhanh một clip/video hoặc cả thư mục ảnh.

  python luoi_khung.py <video.mp4> <out.png> [--fps 2] [--rong 180] [--cot 12]
  python luoi_khung.py <thư mục anh/> <out.png> [--loc dt-] [--rong 240] [--cot 6]

Video: trích bằng ffmpeg (fps khung/giây), nhãn là mốc giây. Ảnh: nhãn là tên file.
Dùng PIL vẽ chữ (ffmpeg drawtext lỗi fontconfig trên máy này).
"""
import argparse
import glob
import os
import subprocess
import tempfile

from PIL import Image, ImageDraw, ImageFont


def font(size):
    for f in ("arialbd.ttf", "arial.ttf", "DejaVuSans-Bold.ttf"):
        try:
            return ImageFont.truetype(f, size)
        except OSError:
            pass
    return ImageFont.load_default()


def khung_video(path, fps, rong, tmp):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", path, "-vf", f"fps={fps},scale={rong}:-2",
                    os.path.join(tmp, "f%04d.png")], check=True)
    fs = sorted(glob.glob(os.path.join(tmp, "f*.png")))
    return [(f, f"{i / fps:.1f}s") for i, f in enumerate(fs)]


def khung_anh(folder, loc):
    fs = sorted(f for f in glob.glob(os.path.join(folder, "*.png")) if os.path.basename(f).startswith(loc))
    return [(f, os.path.splitext(os.path.basename(f))[0]) for f in fs]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("nguon")
    ap.add_argument("out")
    ap.add_argument("--fps", type=float, default=2)
    ap.add_argument("--rong", type=int)
    ap.add_argument("--cot", type=int)
    ap.add_argument("--loc", default="", help="chỉ lấy ảnh có tên bắt đầu bằng chuỗi này")
    a = ap.parse_args()
    la_video = os.path.isfile(a.nguon)
    rong = a.rong or (180 if la_video else 240)
    cot = a.cot or (12 if la_video else 6)
    with tempfile.TemporaryDirectory() as tmp:
        items = khung_video(a.nguon, a.fps, rong, tmp) if la_video else khung_anh(a.nguon, a.loc)
        if not items:
            raise SystemExit("không có khung nào")
        imgs = []
        for f, nhan in items:
            im = Image.open(f).convert("RGB")
            im = im.resize((rong, round(im.height * rong / im.width)))
            imgs.append((im, nhan))
        h = max(im.height for im, _ in imgs)
        nhan_h = 22 if la_video else 34
        fn = font(16 if la_video else 13)
        hang = (len(imgs) + cot - 1) // cot
        sheet = Image.new("RGB", (cot * rong, hang * (h + nhan_h)), "white")
        d = ImageDraw.Draw(sheet)
        for i, (im, nhan) in enumerate(imgs):
            x, y = (i % cot) * rong, (i // cot) * (h + nhan_h)
            sheet.paste(im, (x, y + nhan_h))
            d.text((x + 4, y + 3), nhan[:32], fill="black", font=fn)
        sheet.save(a.out)
    print(f"{len(imgs)} khung -> {a.out}")


if __name__ == "__main__":
    main()
