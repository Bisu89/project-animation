"""Score for the ancient-battles series: low drone, dorian pad, frame drums, sparse plucked lyre notes.
Intensity follows the chapters: calm chapters stay low and melodic, battle chapters bring the drums.

usage: python scripts/gen_anc_music.py --slug anc-ep01 --intensity 0.7,0.4,0.4,...   (one value per chapter, 0..1)
Writes demo-project/public/<slug>/music.mp3 covering the whole episode (needs ffmpeg).
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
rng = np.random.default_rng(23)

# D dorian: D E F G A B C
DORIAN = (146.83, 164.81, 174.61, 196.0, 220.0, 246.94, 261.63, 293.66, 329.63, 349.23, 392.0, 440.0)


def chapters_from_csv(path):
    out = []
    for r in csv.DictReader(open(path, encoding="utf-8")):
        c = r["chapter"]
        if out and out[-1][0] == c:
            out[-1][2] = float(r["end_s"])
        else:
            out.append([c, float(r["start_s"]), float(r["end_s"])])
    return out


def pluck(f, d=3.0):
    t = np.arange(int(d * SR)) / SR
    x = sum(np.sin(2 * np.pi * f * h * t + 0.3 * h) / h * np.exp(-t * (1.6 + 1.3 * h)) for h in range(1, 7))
    return x * np.minimum(1, t / 0.004)


def drum(g=1.0):
    t = np.arange(int(1.2 * SR)) / SR
    body = np.sin(2 * np.pi * (110 * np.exp(-t * 3.5) + 50) * t) * np.exp(-t * 6.0)
    skin = rng.uniform(-1, 1, len(t)) * np.exp(-t * 28) * 0.35
    return (body + skin) * g


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True)
    ap.add_argument("--intensity", required=True)
    ap.add_argument("--pad", type=float, default=3.0)
    a = ap.parse_args()
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    chs = chapters_from_csv(os.path.join(root, "content", a.slug, "scenes.csv"))
    vals = [float(x) for x in a.intensity.split(",")]
    if len(vals) != len(chs):
        raise SystemExit(f"{len(chs)} chapters but {len(vals)} intensity values")
    total = chs[-1][2] + a.pad
    n = int(total * SR)
    inten = np.zeros(n, dtype=np.float32)
    for i, (_, s, e) in enumerate(chs):
        inten[int(s * SR) : int(e * SR)] = vals[i]
    inten[: int(chs[0][1] * SR)] = vals[0]
    inten[int(chs[-1][2] * SR) :] = vals[-1] * 0.5
    k = int(5 * SR)
    inten = np.convolve(inten, np.ones(k, dtype=np.float32) / k, mode="same")

    out = np.zeros(n, dtype=np.float32)
    block = 20 * SR
    drone_f = (36.7, 36.9, 73.4, 73.1, 110.0, 146.8)
    pad_f = (293.7, 349.2, 440.0, 523.3, 587.3)
    pad_rate = (0.027, 0.039, 0.051, 0.033, 0.063)
    for b0 in range(0, n, block):
        b1 = min(n, b0 + block)
        t = np.arange(b0, b1, dtype=np.float64) / SR
        iv = inten[b0:b1].astype(np.float64)
        x = np.zeros(b1 - b0)
        for j, f in enumerate(drone_f):
            lfo = 0.65 + 0.35 * np.sin(2 * np.pi * (0.019 + 0.006 * j) * t + j)
            x += sum(np.sin(2 * np.pi * f * h * t) / h for h in (1, 2, 3)) * lfo * (0.55 if f < 40 else 0.3)
        x *= 0.55 + 0.6 * iv
        for f, r in zip(pad_f, pad_rate):
            swell = np.clip(np.sin(2 * np.pi * r * t + f) * 0.5 + 0.5, 0, 1) ** 2
            x += np.sin(2 * np.pi * f * t + 0.6 * np.sin(2 * np.pi * 0.17 * t)) * swell * (0.35 + iv) * 0.12
        out[b0:b1] = x.astype(np.float32)

    # frame drums: a slow pulse that grows with the intensity, accents every fourth hit
    tt = 8.0
    hit = 0
    while tt < total - 4:
        iv = float(inten[int(tt * SR)])
        if iv > 0.42:
            d = drum((0.25 + 0.75 * iv) * (1.0 if hit % 4 == 0 else 0.6))
            i = int(tt * SR)
            m = min(len(d), n - i)
            out[i : i + m] += d[:m].astype(np.float32) * 0.9
            hit += 1
            tt += 60.0 / (48 + 56 * iv) * (0.5 if (hit % 4 == 3 and iv > 0.8) else 1.0)
        else:
            tt += 1.5
            hit = 0

    # sparse plucked lyre phrases, more frequent when the story is calm
    tt = 10.0
    while tt < total - 6:
        iv = float(inten[int(tt * SR)])
        for _ in range(int(rng.integers(2, 5))):
            f = DORIAN[int(rng.integers(0, len(DORIAN)))]
            p = pluck(f) * (0.10 + 0.08 * (1 - iv))
            i = int(tt * SR)
            m = min(len(p), n - i)
            if m > 0:
                out[i : i + m] += p[:m].astype(np.float32)
            tt += rng.uniform(0.35, 0.8)
        tt += rng.uniform(10, 22) + 18 * iv

    sos = butter(2, 3400 / (SR / 2), "lowpass", output="sos")
    out = sosfilt(sos, out).astype(np.float32)
    fade = int(2.5 * SR)
    out[:fade] *= np.linspace(0, 1, fade, dtype=np.float32)
    out[-fade:] *= np.linspace(1, 0, fade, dtype=np.float32)
    out = out / (np.max(np.abs(out)) or 1) * 0.85

    dst = os.path.join(root, "demo-project", "public", a.slug)
    os.makedirs(dst, exist_ok=True)
    wav = os.path.join(dst, "music.wav")
    wavfile.write(wav, SR, (out * 32767).astype(np.int16))
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-b:a", "160k", os.path.join(dst, "music.mp3")], check=True)
    os.remove(wav)
    print("music:", os.path.join(dst, "music.mp3"), round(total, 1), "s,", len(chs), "chapters")


if __name__ == "__main__":
    main()
