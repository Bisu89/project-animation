"""Vẽ chữ đè (giờ, an toàn, nhãn AI, ghi công) lên video cả tập Elise Wild.

Đọc loi-dan/chu-de.csv (phan_doan, clip, kieu, tu, den, text): tu/den tính bằng giây từ đầu clip (den trống = hết clip).
Vị trí clip trong cả tập tính từ gen-video.csv của từng phân đoạn + độ dài final-loidan.mp4 các phân đoạn trước.

    python scripts/chu_de.py --ep content/elise-wild/ep01-waterfall-pool --vao ep01-loidan.mp4 --ra ep01-final.mp4 \
        test-p1 p3-leu ...
"""
import argparse
import csv
import os
import shutil
import subprocess
import tempfile

from long_tieng import clip_starts, probe

FONT = r"C:\Windows\Fonts\segoeui.ttf"
FONT_BOLD = r"C:\Windows\Fonts\segoeuib.ttf"
FADE = 0.4
# kiểu chữ: cỡ, vị trí, khung nền
STYLES = {
    "gio":   dict(size=54, x="70", y="60", bold=True, box=0.0),                 # mốc giờ góc trên trái
    "nhan":  dict(size=30, x="70", y="h-th-60", bold=False, box=0.35),          # nhãn nhỏ góc dưới trái
    "ghi":   dict(size=40, x="(w-tw)/2", y="h-th-90", bold=False, box=0.45),    # ghi chú kiến thức, giữa dưới
    "buoc":  dict(size=64, x="70", y="h-th-90", bold=True, box=0.0),            # Drown / Stir / Feel
    "the":   dict(size=50, x="(w-tw)/2", y="(h-th)/2", bold=False, box=0.55),   # thẻ chữ lớn giữa màn hình
    "ten":   dict(size=66, x="(w-tw)/2", y="h-th-110", bold=True, box=0.0),     # tên tập
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ep", required=True)
    ap.add_argument("--vao", required=True)
    ap.add_argument("--ra", required=True)
    ap.add_argument("--watermark", default="", help="tên kênh hiện mờ góc trên phải suốt video")
    ap.add_argument("segments", nargs="+")
    a = ap.parse_args()

    offsets, t = {}, 0.0
    for seg in a.segments:
        offsets[seg] = (t, clip_starts(os.path.join(a.ep, seg))[0])
        t += probe(os.path.join(a.ep, seg, "video", "final-loidan.mp4"))

    with open(os.path.join(a.ep, "loi-dan", "chu-de.csv"), encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    work = tempfile.mkdtemp(prefix="chude_")
    shutil.copy(FONT, os.path.join(work, "r.ttf"))
    shutil.copy(FONT_BOLD, os.path.join(work, "b.ttf"))
    filters = []
    for i, r in enumerate(rows):
        seg_t, starts = offsets[r["phan_doan"]]
        clip_t, clip_len = starts[r["clip"]]
        s = seg_t + clip_t + float(r["tu"] or 0)
        e = seg_t + clip_t + (float(r["den"]) if r["den"] else clip_len)
        st = STYLES[r["kieu"]]
        txt = f"t{i}.txt"
        # newline="\n": trên Windows "\r\n" bị drawtext vẽ thành thêm một dòng trống
        with open(os.path.join(work, txt), "w", encoding="utf-8", newline="\n") as f:
            f.write(r["text"].replace("\\n", "\n"))
        alpha = f"if(lt(t,{s + FADE:.2f}),(t-{s:.2f})/{FADE},if(gt(t,{e - FADE:.2f}),({e:.2f}-t)/{FADE},1))"
        box = f":box=1:boxcolor=black@{st['box']}:boxborderw=18" if st["box"] else ""
        filters.append(f"drawtext=fontfile={'b' if st['bold'] else 'r'}.ttf:textfile={txt}:fontsize={st['size']}"
                       f":fontcolor=white:shadowcolor=black@0.6:shadowx=2:shadowy=2:line_spacing=8{box}"
                       f":x={st['x']}:y={st['y']}:alpha='{alpha}':enable='between(t,{s:.2f},{e:.2f})'")
        print(f"  {s:7.1f}-{e:7.1f}s  {r['kieu']:5} {r['text'][:60]}")
    if a.watermark:
        # tên kênh mờ, cố định góc trên phải suốt video
        with open(os.path.join(work, "wm.txt"), "w", encoding="utf-8") as f:
            f.write(a.watermark)
        filters.append("drawtext=fontfile=b.ttf:textfile=wm.txt:fontsize=30:fontcolor=white@0.35"
                       ":shadowcolor=black@0.2:shadowx=1:shadowy=1:x=w-tw-50:y=45")
    vin, vout = os.path.abspath(os.path.join(a.ep, a.vao)), os.path.abspath(os.path.join(a.ep, a.ra))
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", vin, "-vf", ",".join(filters), "-c:v", "libx264",
                    "-preset", "medium", "-crf", "18", "-c:a", "copy", vout], check=True, cwd=work)
    shutil.rmtree(work, ignore_errors=True)
    print(f"đã xuất {vout} ({probe(vout):.1f}s)")


if __name__ == "__main__":
    main()
