"""Dựng Short dọc 9:16 từ các clip đã ghép của một tập Elise Wild.

Kịch bản Short là file JSON:
{
  "out": "shorts/s01-mai-dot.mp4",
  "crop_x": 0.5,                                   # tâm khung cắt dọc mặc định (0 = trái, 1 = phải)
  "canh": [{"phan_doan": "p7-mua", "clip": "4", "tu": 0, "den": 8, "crop_x": 0.4}, ...],
  "loi": [{"canh": 0, "giong": "elise", "text": "...", "phu_de": true}, ...],   # câu đọc ở đầu cảnh thứ canh
  "chu": [{"tu": 0, "den": 3, "kieu": "moc", "text": "..."}, ...]                # chữ đè thêm (giây trong Short)
}
Câu lời dẫn tạo qua vibi (cache chung loi-dan/cau/), chữ phụ đề hiện theo câu.

    python scripts/short.py --ep content/elise-wild/ep01-waterfall-pool --spec shorts/s01.json
"""
import argparse
import hashlib
import json
import os
import shutil
import subprocess
import tempfile
import textwrap

import vibi_tts
from chu_de import FONT, FONT_BOLD
from long_tieng import GAP, VOICES, clip_starts, probe

W, H = 1080, 1920
STYLES = {  # cỡ chữ, y, đậm, khung nền, số ký tự mỗi dòng
    "phude": dict(size=56, y="h*0.70", bold=True, box=0.0, wrap=30),
    "moc":   dict(size=68, y="h*0.16", bold=True, box=0.45, wrap=24),
    "buoc":  dict(size=84, y="h*0.58", bold=True, box=0.0, wrap=30),
    "ket":   dict(size=52, y="h*0.42", bold=True, box=0.55, wrap=28),
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ep", required=True)
    ap.add_argument("--spec", required=True)
    ap.add_argument("--watermark", default="Elise Wild Studio")
    a = ap.parse_args()
    a.ep = os.path.abspath(a.ep)  # ffmpeg chạy trong thư mục tạm (cwd=work)
    spec = json.load(open(os.path.join(a.ep, a.spec), encoding="utf-8"))
    work = tempfile.mkdtemp(prefix="short_")
    shutil.copy(FONT, os.path.join(work, "r.ttf"))
    shutil.copy(FONT_BOLD, os.path.join(work, "b.ttf"))

    # 1) cắt từng cảnh từ final.mp4 của phân đoạn (tiếng môi trường gốc), khung dọc
    starts_cache, parts, t, scene_t = {}, [], 0.0, []
    for i, c in enumerate(spec["canh"]):
        seg = c["phan_doan"]
        if seg not in starts_cache:
            starts_cache[seg] = clip_starts(os.path.join(a.ep, seg))[0]
        clip_t, clip_len = starts_cache[seg][c["clip"]]
        s0 = clip_t + c.get("tu", 0)
        d = min(c.get("den", clip_len), clip_len) - c.get("tu", 0)
        cx = c.get("crop_x", spec.get("crop_x", 0.5))
        part = os.path.join(work, f"c{i}.mp4")
        cw = "ih*9/16"
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{s0:.3f}", "-t", f"{d:.3f}",
                        "-i", os.path.join(a.ep, seg, "video", "final.mp4"),
                        "-vf", f"crop={cw}:ih:(iw-{cw})*{cx}:0,scale={W}:{H},fps=30,setsar=1",
                        "-af", "aformat=sample_rates=44100:channel_layouts=stereo",
                        "-c:v", "libx264", "-crf", "18", "-preset", "fast", "-c:a", "aac", part], check=True)
        parts.append(part)
        scene_t.append(t)
        t += d
    total = t
    with open(os.path.join(work, "list.txt"), "w", encoding="utf-8", newline="\n") as f:
        f.writelines(f"file '{p}'\n" for p in parts)
    base = os.path.join(work, "base.mp4")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", "list.txt", "-c", "copy", base],
                   check=True, cwd=work)

    # 2) lời dẫn: tạo/lấy cache, đặt ở đầu cảnh, lùi nếu câu trước chưa xong
    cache = os.path.join(a.ep, "loi-dan", "cau")
    os.makedirs(cache, exist_ok=True)
    voice, prev_end = [], 0.0
    for ln in spec["loi"]:
        key = hashlib.md5(f"{ln['giong']}|{ln['text']}".encode("utf-8")).hexdigest()[:8]
        found = [n for n in os.listdir(cache) if n.endswith(f"_{ln['giong']}_{key}.mp3")]
        mp3 = os.path.join(cache, found[0] if found else f"short_{ln['giong']}_{key}.mp3")
        if not found:
            vibi_tts.tts(VOICES[ln["giong"]], ln["text"], mp3)
        d = probe(mp3)
        at = max(scene_t[ln["canh"]] + ln.get("tre", 0.3), prev_end + GAP)
        voice.append((at, d, mp3, ln))
        prev_end = at + d
        print(f"  {at:5.1f}-{at + d:5.1f}s  {ln['text'][:60]}")
    if prev_end > total:
        print(f"  !! lời dài hơn hình {prev_end - total:.1f}s")

    # 3) chữ: phụ đề theo câu + chữ đè trong spec + watermark
    texts = [(at, at + d, "phude", ln["text"]) for at, d, _, ln in voice if ln.get("phu_de", True)]
    texts += [(c["tu"], c["den"] if c["den"] >= 0 else total + c["den"], c["kieu"], c["text"]) for c in spec["chu"]]
    filters = []
    for i, (s, e, kieu, txt) in enumerate(texts):
        st = STYLES[kieu]
        with open(os.path.join(work, f"t{i}.txt"), "w", encoding="utf-8", newline="\n") as f:
            f.write("\n".join(textwrap.wrap(txt, st["wrap"])))
        alpha = f"if(lt(t,{s + 0.2:.2f}),(t-{s:.2f})/0.2,if(gt(t,{e - 0.2:.2f}),({e:.2f}-t)/0.2,1))"
        box = f":box=1:boxcolor=black@{st['box']}:boxborderw=22" if st["box"] else ""
        filters.append(f"drawtext=fontfile={'b' if st['bold'] else 'r'}.ttf:textfile=t{i}.txt:fontsize={st['size']}"
                       f":fontcolor=white:borderw=4:bordercolor=black@0.7:line_spacing=10{box}:text_align=C"
                       f":x=(w-tw)/2:y={st['y']}:alpha='{alpha}':enable='between(t,{s:.2f},{e:.2f})'")
    with open(os.path.join(work, "wm.txt"), "w", encoding="utf-8", newline="\n") as f:
        f.write(a.watermark)
    filters.append("drawtext=fontfile=b.ttf:textfile=wm.txt:fontsize=34:fontcolor=white@0.35"
                   ":shadowcolor=black@0.2:shadowx=1:shadowy=1:x=(w-tw)/2:y=h*0.06")

    # 4) trộn: tiếng môi trường nhỏ lại khi có lời, chuẩn hóa -14 LUFS
    cmd = ["ffmpeg", "-y", "-v", "error", "-i", base]
    for _, _, mp3, _ in voice:
        cmd += ["-i", mp3]
    fc = [f"[0:v]{','.join(filters)}[v]"]
    labels = []
    for i, (at, _, _, _) in enumerate(voice, 1):
        ms = int(at * 1000)
        fc.append(f"[{i}:a]aformat=sample_rates=44100:channel_layouts=stereo,adelay={ms}|{ms}[n{i}]")
        labels.append(f"[n{i}]")
    fc.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0,asplit=2[vo][key]")
    fc.append("[0:a][key]sidechaincompress=threshold=0.02:ratio=2.2:attack=20:release=400[duck];"
              "[duck][vo]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]")
    out = os.path.abspath(os.path.join(a.ep, spec["out"]))
    os.makedirs(os.path.dirname(out), exist_ok=True)
    cmd += ["-filter_complex", ";".join(fc), "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "18",
            "-preset", "medium", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-t", f"{total:.3f}", out]
    subprocess.run(cmd, check=True, cwd=work)
    shutil.rmtree(work, ignore_errors=True)
    print(f"đã xuất {out} ({probe(out):.1f}s)")


if __name__ == "__main__":
    main()
