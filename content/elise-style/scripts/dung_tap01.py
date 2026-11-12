# -*- coding: utf-8 -*-
"""Dung Elise Style tap 01: "1 quan ong loe den - 3 noi".

Cau truc:
  hook 3 lat cat tu clip2/3/4  -> 1,2 s
  clip1 .. clip4, moi clip lay doan tay-gio-len -> tay-gio-len  -> match cut

CHONG GIAT (bai hoc 2026-11-12):
  Clip Muse la 24 fps chan (240 khung / 10 s).
  Ban v1-v4 tang toc 1,55x roi ep ve 24 fps -> 37,2 fps bi lay mau xuong 24 fps,
  vut khung o nhung khoang KHONG DEU -> giat thay ro.
  Nay tang toc dung 1,25x: 24 fps thanh DUNG 30 fps, moi khung goc dung dung mot lan,
  khong lay mau lai, khong vut khung. Tuyet doi khong them bo loc `fps=` vao doan da retime.
  Cac he so an toan khac: 2x -> 48 fps, 2,5x -> 60 fps. Tranh moi he so khac.

Chay:  python content/elise-style/scripts/dung_tap01.py [--out final.mp4]
"""
import argparse
import json
import os
import subprocess
import sys

EP = os.path.join("content", "elise-style", "ep01-mot-quan-ba-noi")
VID = os.path.join(EP, "video")
FONT = "C\\:/Windows/Fonts/arialbd.ttf"

FPS_GOC = 24
TOC_DO = 1.25                       # 24 * 1.25 = 30 fps chan
FPS_RA = int(FPS_GOC * TOC_DO)      # 30

# Moc cat trong tung clip goc (giay).
# Muse LUON trai deu hanh dong ra het 10 s du prompt ghi moc giay khac:
# tu the tay gio len co o 0,0-0,6 s va lai o ~8,0-9,9 s trong ca 4 clip.
# Nen phai lay gan tron clip de hai dau deu la tay gio len -> match cut.
MOC = {
    1: (0.15, 8.45),
    2: (0.15, 8.45),
    3: (0.15, 8.45),
    # Look cuoi: Muse khong giu noi tui vang nho qua cu xoay (mat tu ~6 s, da gen lai 3 lan).
    # Cat truoc cu xoay -> tui con nguyen. Khung ket dong bu lai do dai.
    4: (0.15, 3.85),
}

# Lat hook: lay dung luc tay da ha xuong, thay ro bo do
HOOK = [(2, 2.00, 2.50), (3, 2.00, 2.50), (4, 2.00, 2.50)]

CHU_Y = 1450        # dat THAP: dau nhan vat sat mep tren khung, chu o tren se che mat
KET_GIU = 1.0       # giu dong khung cuoi de co khung ket
CHU_KET = "Quần 1  —  Outfit 3"   # tranh dau hai cham: drawtext coi ':' la ky tu phan tach

CHU_VN = {
    "hook": "1 CHIẾC QUẦN ĐEN",
    1: "Chiếc quần này đi được 3 nơi",
    2: "1. Đi làm",
    3: "2. Đi cà phê",
    4: "3. Đi tiệc",
}


def probe_dur(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of",
         "default=nw=1:nk=1", path], capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="final.mp4")
    a = ap.parse_args()

    segs = []   # (duong_dan, bat_dau, dai_goc, nhan)
    for stt, t0, t1 in HOOK:
        p = os.path.join(VID, "clip%d.mp4" % stt)
        if not os.path.exists(p):
            sys.exit("thieu " + p)
        segs.append((p, t0, t1 - t0, "hook"))
    for stt in (1, 2, 3, 4):
        p = os.path.join(VID, "clip%d.mp4" % stt)
        if not os.path.exists(p):
            sys.exit("thieu " + p)
        t0, t1 = MOC[stt]
        t1 = min(t1, probe_dur(p) - 0.05)
        segs.append((p, t0, t1 - t0, stt))

    # ---- noi cung, khong xfade (match cut) ----
    cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y"]
    for p, t0, src, _ in segs:
        cmd += ["-ss", "%.3f" % t0, "-t", "%.3f" % src, "-i", p]
    fl = []
    for i, (_, _, src, _) in enumerate(segs):
        giu = KET_GIU if i == len(segs) - 1 else 0.0
        pad = (",tpad=stop_mode=clone:stop_duration=%.3f" % giu) if giu else ""
        # KHONG co bo loc fps= o day: setpts da cho dung FPS_RA, them fps= se lay mau lai -> giat
        fl.append("[%d:v]scale=1080:1920:force_original_aspect_ratio=increase,"
                  "crop=1080:1920,setsar=1,setpts=(PTS-STARTPTS)/%.6f%s[v%d]"
                  % (i, TOC_DO, pad, i))
        fl.append("[%d:a]aformat=sample_rates=44100:channel_layouts=stereo,"
                  "atempo=%.6f,apad,atrim=duration=%.3f,asetpts=PTS-STARTPTS[a%d]"
                  % (i, TOC_DO, src / TOC_DO + giu, i))
    fl.append("".join("[v%d][a%d]" % (i, i) for i in range(len(segs)))
              + "concat=n=%d:v=1:a=1[vo][ao]" % len(segs))
    raw = os.path.join(VID, "_raw.mp4")
    cmd += ["-filter_complex", ";".join(fl), "-map", "[vo]", "-map", "[ao]",
            "-r", str(FPS_RA), "-fps_mode", "cfr",
            "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "192k", raw]
    subprocess.run(cmd, check=True)

    # ---- chu de ----
    moc_chu, t = [], 0.0
    for i, (_, _, src, nhan) in enumerate(segs):
        d = src / TOC_DO
        moc_chu.append((nhan, t, t + d))
        t += d + (KET_GIU if i == len(segs) - 1 else 0.0)
    t_ket = t - KET_GIU

    gom, i = [], 0
    while i < len(moc_chu):
        nhan, t0, t1 = moc_chu[i]
        if nhan == "hook":
            while i + 1 < len(moc_chu) and moc_chu[i + 1][0] == "hook":
                i += 1
                t1 = moc_chu[i][2]
        gom.append((nhan, t0, t1))
        i += 1

    style = ("fontfile='%s':fontcolor=white:bordercolor=black@0.85:borderw=5"
             ":shadowcolor=black@0.5:shadowx=2:shadowy=2" % FONT)
    vf = []
    for nhan, t0, t1 in gom:
        chu = CHU_VN[nhan].replace("'", "").replace(":", "\\:")
        co = 96 if nhan == "hook" else 72
        vf.append("drawtext=%s:text='%s':fontsize=%d:x=(w-tw)/2:y=%d"
                  ":enable='between(t,%.3f,%.3f)'"
                  % (style, chu, co, CHU_Y, t0 + 0.05, t1 - 0.05))
    vf.append("drawtext=%s:text='%s':fontsize=84:x=(w-tw)/2:y=%d"
              ":enable='between(t,%.3f,999)'" % (style, CHU_KET, CHU_Y - 110, t_ket + 0.05))

    out = os.path.join(VID, a.out)
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", raw,
                    "-vf", ",".join(vf), "-r", str(FPS_RA), "-fps_mode", "cfr",
                    "-c:v", "libx264", "-crf", "18", "-preset", "medium",
                    "-pix_fmt", "yuv420p", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
                    "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out], check=True)
    os.remove(raw)

    tong = probe_dur(out)
    with open(os.path.join(VID, "timeline.json"), "w", encoding="utf-8") as f:
        json.dump({"duration": round(tong, 3), "fps": FPS_RA, "toc_do": TOC_DO,
                   "doan": [{"nhan": str(n), "bat_dau": round(x, 3), "ket": round(y, 3)}
                            for n, x, y in gom]}, f, ensure_ascii=False, indent=2)
    print("Final: %s (%.2f s, %d fps, toc do %.2fx)" % (out, tong, FPS_RA, TOC_DO))
    for n, x, y in gom:
        print("  %-6s %5.2f -> %5.2f  %s" % (n, x, y, CHU_VN[n]))


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
