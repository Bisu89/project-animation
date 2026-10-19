"""Dark ambient score for the zombie-survival series (drone, dissonant pad, sub pulse, sparse detuned bells).
Intensity follows the chapters: calm chapters hum low, chase/siege chapters swell.

usage: python scripts/gen_zs_music.py --slug zs-ep01 [--intensity 0.7,0.45,1,0.6,0.75,0.5,1,0.4]
Writes demo-project/public/<slug>/music.mp3 (needs ffmpeg) covering the whole episode.
"""
import argparse
import csv
import os
import shutil
import subprocess

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 22050
rng = np.random.default_rng(11)


def chapters_from_csv(path):
    rows = list(csv.DictReader(open(path, encoding="utf-8")))
    out = []
    for r in rows:
        c = r["chapter"]
        if out and out[-1][0] == c:
            out[-1][2] = float(r["end_s"])
        else:
            out.append([c, float(r["start_s"]), float(r["end_s"])])
    return out


def bell(f, d=6.0):
    t = np.arange(int(d * SR)) / SR
    x = sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t * k) for m, a, k in ((1, 1, 0.9), (2.76, 0.5, 1.3), (5.4, 0.3, 2.0), (8.93, 0.15, 3.2)))
    return x * np.minimum(1, t / 0.01)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True)
    ap.add_argument("--intensity", default="0.7,0.45,1,0.6,0.75,0.5,1,0.4")
    ap.add_argument("--pad", type=float, default=3.0, help="seconds of music after the last scene")
    a = ap.parse_args()
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    chs = chapters_from_csv(os.path.join(root, "content", a.slug, "scenes.csv"))
    inten_by_ch = [float(x) for x in a.intensity.split(",")]
    total = chs[-1][2] + a.pad
    n = int(total * SR)

    # intensity curve, smoothed over ~6 s so chapters blend
    inten = np.zeros(n, dtype=np.float32)
    for i, (_, s, e) in enumerate(chs):
        v = inten_by_ch[min(i, len(inten_by_ch) - 1)]
        inten[int(s * SR) : int(e * SR)] = v
    inten[: int(chs[0][1] * SR)] = inten_by_ch[0]
    inten[int(chs[-1][2] * SR) :] = inten_by_ch[-1] * 0.5
    k = int(6 * SR)
    inten = np.convolve(inten, np.ones(k, dtype=np.float32) / k, mode="same")

    out = np.zeros(n, dtype=np.float32)
    block = 20 * SR
    drone_f = (55.0, 55.35, 82.4, 81.9, 110.3, 36.7)
    pad_f = (220.0, 233.1, 329.6, 349.2, 466.2)
    pad_rate = (0.031, 0.043, 0.057, 0.037, 0.071)
    for b0 in range(0, n, block):
        b1 = min(n, b0 + block)
        t = np.arange(b0, b1, dtype=np.float64) / SR
        iv = inten[b0:b1].astype(np.float64)
        x = np.zeros(b1 - b0)
        for j, f in enumerate(drone_f):
            lfo = 0.65 + 0.35 * np.sin(2 * np.pi * (0.021 + 0.007 * j) * t + j)
            x += sum(np.sin(2 * np.pi * f * h * t) / h for h in (1, 2, 3)) * lfo * (0.5 if f < 40 else 0.32)
        x *= 0.5 + 0.7 * iv
        for f, r in zip(pad_f, pad_rate):
            swell = np.clip(np.sin(2 * np.pi * r * t + f) * 0.5 + 0.5, 0, 1) ** 2
            x += np.sin(2 * np.pi * f * t + 0.8 * np.sin(2 * np.pi * 0.2 * t)) * swell * (iv ** 2) * 0.22
        # sub pulse: a soft heartbeat-like thump, faster when the intensity is high
        bpm = 46 + 34 * iv
        ph = np.cumsum(bpm / 60.0 / SR) + 0.0
        beat = ph - np.floor(ph)
        thump = np.exp(-beat * 14) + 0.55 * np.exp(-np.maximum(0, beat - 0.2) * 16) * (beat > 0.2)
        x += np.sin(2 * np.pi * 48 * t) * thump * (iv ** 1.5) * 0.55
        out[b0:b1] = x.astype(np.float32)

    # sparse detuned bells, more of them when the intensity is high
    tt = 14.0
    notes = (220.0, 233.1, 311.1, 329.6, 415.3)
    while tt < total - 8:
        iv = float(inten[int(tt * SR)])
        b = bell(notes[int(rng.integers(0, len(notes)))] * (1 if rng.random() < 0.6 else 0.5)) * (0.07 + 0.12 * iv)
        i = int(tt * SR)
        m = min(len(b), n - i)
        out[i : i + m] += b[:m].astype(np.float32)
        tt += rng.uniform(26, 48) - 12 * iv

    sos = butter(2, 3200 / (SR / 2), "lowpass", output="sos")
    out = sosfilt(sos, out).astype(np.float32)
    fade = int(2.5 * SR)
    out[:fade] *= np.linspace(0, 1, fade, dtype=np.float32)
    out[-fade:] *= np.linspace(1, 0, fade, dtype=np.float32)
    out = out / (np.max(np.abs(out)) or 1) * 0.85

    dst = os.path.join(root, "demo-project", "public", a.slug)
    wav = os.path.join(dst, "music.wav")
    wavfile.write(wav, SR, (out * 32767).astype(np.int16))
    if shutil.which("ffmpeg"):
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-b:a", "160k", os.path.join(dst, "music.mp3")], check=True)
        os.remove(wav)
        print("music:", os.path.join(dst, "music.mp3"), round(total, 1), "s")
    else:
        print("music:", wav, "(ffmpeg not found: reference music.wav in the video)")


if __name__ == "__main__":
    main()
