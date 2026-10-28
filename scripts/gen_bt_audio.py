"""Soundtrack for the Better Together short, synthesised from scratch: soft guitar-like arpeggio, wind bed, end-card chime.

usage:  python scripts/gen_bt_audio.py            (writes demo-project/public/better-together/audio/*.wav)
"""
import os
import sys

import numpy as np
from scipy.io import wavfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_audio import SR, env, filt, noise, norm, t_  # noqa: E402

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "demo-project", "public", "better-together", "audio")
DUR = 12.5


def hz(m):
    return 440 * 2 ** ((m - 69) / 12)


def pluck(f, d=1.6):
    n = int(d * SR)
    t = np.arange(n) / SR
    x = sum(a * np.sin(2 * np.pi * f * k * t) for k, a in ((1, 1), (2, 0.35), (3, 0.15), (4, 0.06)))
    return x * env(n, 0.004, d, 5.5)


def place(buf, x, at, g=1.0):
    i = int(at * SR)
    n = min(len(x), len(buf) - i)
    if n > 0:
        buf[i : i + n] += x[:n] * g


def music():
    buf = np.zeros(int(DUR * SR))
    prog = [(57, 60, 64), (53, 57, 60), (48, 52, 55), (55, 59, 62)]  # Am F C G, in a warm low register
    beat = 0.5
    for bar in range(7):
        a, b, c = prog[bar % 4]
        t0 = bar * 4 * beat * 1.0
        pat = [a - 12, b, c, b, a, c + 12, c, b]
        for i, m in enumerate(pat):
            place(buf, pluck(hz(m)), t0 + i * beat / 2, 0.55 if i % 2 == 0 else 0.4)
        place(buf, pluck(hz(a - 24), 3.0), t0, 0.5)
    fade = np.minimum(1, np.minimum(np.arange(len(buf)) / (1.5 * SR), (len(buf) - np.arange(len(buf))) / (2.0 * SR)))
    return norm(filt(buf, "lp", 5000) * fade, 0.55)


def wind():
    x = filt(noise(DUR), "bp", (180, 900))
    lfo = 0.55 + 0.45 * np.sin(2 * np.pi * 0.18 * t_(DUR) + 1.0) * np.sin(2 * np.pi * 0.07 * t_(DUR))
    return norm(x * lfo, 0.4)


def chime():
    n = int(2.6 * SR)
    t = np.arange(n) / SR
    x = sum(a * np.sin(2 * np.pi * 1318.5 * k * t) * np.exp(-t * dk) for k, a, dk in ((1, 1, 1.8), (2.76, 0.35, 3.5), (5.4, 0.12, 6)))
    return norm(x, 0.5)


def save(name, x):
    os.makedirs(OUT, exist_ok=True)
    wavfile.write(os.path.join(OUT, name + ".wav"), SR, (x * 32767).astype(np.int16))
    print(name, round(len(x) / SR, 1), "s")


if __name__ == "__main__":
    save("music", music())
    save("wind", wind())
    save("chime", chime())
