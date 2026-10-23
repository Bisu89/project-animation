"""Kitchen / ASMR sound effects for the cooking shorts, synthesised from scratch (no samples).

usage:  python scripts/gen_cook_sfx.py --out demo-project/public/cook-ep01

Writes OUT/sfx/<name>.wav; demo-project/src/cook-ep01/scenes.ts places them on scenes.
"""
import argparse
import os
import sys

import numpy as np
from scipy.io import wavfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_audio import SR, env, filt, mix, noise, norm, pad_to, rng, t_  # noqa: E402


def sine(f, d):
    return np.sin(2 * np.pi * f * t_(d))


def place(buf, x, at, g=1.0):
    i = max(0, int(at * SR))
    if i >= len(buf):
        return
    n = min(len(x), len(buf) - i)
    buf[i : i + n] += x[:n] * g


def chop(d=0.7):
    out = np.zeros(int(d * SR))
    for k, at in enumerate([0.0, 0.22, 0.42, 0.6]):
        knock = filt(noise(0.09), "bp", (500, 2500)) * env(int(0.09 * SR), 0.001, 0.09, 7)
        thud = sine(150, 0.09) * env(int(0.09 * SR), 0.001, 0.09, 8)
        place(out, knock + 0.8 * thud, at, 0.8 - 0.05 * k)
    return norm(out, 0.8)


def tap(d=0.5):
    out = np.zeros(int(d * SR))
    place(out, filt(noise(0.05), "bp", (1500, 5000)) * env(int(0.05 * SR), 0.001, 0.05, 8), 0.0)
    place(out, sine(900, 0.12) * env(int(0.12 * SR), 0.001, 0.12, 9) * 0.3, 0.02)
    return norm(out, 0.6)


def whisk(d=1.2):
    n = noise(d)
    x = filt(n, "bp", (1800, 7000))
    lfo = 0.55 + 0.45 * np.abs(np.sin(2 * np.pi * 7 * t_(d)))
    return norm(x * lfo * env(len(x), 0.05, d, 1.2), 0.5)


def sizzle(d=2.0):
    x = filt(noise(d), "hp", 3500)
    pops = np.zeros_like(x)
    for at in rng.uniform(0, d - 0.05, int(d * 40)):
        place(pops, filt(noise(0.012), "bp", (1500, 6000)) * env(int(0.012 * SR), 0.0005, 0.012, 6), at, rng.uniform(0.3, 1.0))
    sw = 0.7 + 0.3 * filt(noise(d), "lp", 6)
    y = norm(x * sw * 0.6 + pops * 0.9, 0.7)
    fade = np.minimum(1, np.minimum(np.arange(len(y)) / (0.08 * SR), (len(y) - np.arange(len(y))) / (0.15 * SR)))
    return y * fade


def flame(d=2.0):
    x = filt(noise(d), "bp", (200, 1400)) * (0.6 + 0.4 * filt(noise(d), "lp", 12))
    ig = filt(noise(0.12), "bp", (800, 4000)) * env(int(0.12 * SR), 0.001, 0.12, 6)
    out = pad_to(x * 0.35, d)
    place(out, ig, 0.0, 1.2)
    return norm(out, 0.55)


def stir(d=1.4):
    out = np.zeros(int(d * SR))
    for at in np.arange(0, d - 0.2, 0.28):
        sc = filt(noise(0.2), "bp", (900, 4500)) * np.sin(np.linspace(0, np.pi, int(0.2 * SR))) ** 2
        place(out, sc, at + rng.uniform(-0.02, 0.02), rng.uniform(0.6, 1.0))
    grains = filt(noise(d), "hp", 5000) * 0.15
    return norm(out + grains * env(len(out), 0.05, d, 1.0), 0.6)


def scoop(d=0.9):
    sc = filt(noise(0.5), "bp", (700, 3500)) * np.sin(np.linspace(0, np.pi, int(0.5 * SR))) ** 2
    out = np.zeros(int(d * SR))
    place(out, sc, 0.0, 0.8)
    place(out, sine(1100, 0.15) * env(int(0.15 * SR), 0.001, 0.15, 9) * 0.4, 0.55)
    place(out, sine(1650, 0.1) * env(int(0.1 * SR), 0.001, 0.1, 9) * 0.25, 0.6)
    return norm(out, 0.65)


def ding(d=1.8):
    x = sum(a * sine(f, d) * env(int(d * SR), 0.002, d, 4.5) for f, a in [(1568, 1), (3136, 0.3), (4200, 0.12)])
    return norm(x, 0.6)


def ambience(d=16.0):
    room = filt(noise(d), "lp", 400) * 0.25
    air = filt(noise(d), "bp", (2500, 6000)) * 0.03
    out = room + air
    for at in rng.uniform(0.5, d - 1, 5):
        c = pad_to(sine(rng.uniform(2800, 4200), 0.12) * env(int(0.12 * SR), 0.005, 0.12, 5) * 0.08, 0.12)
        place(out, c, at)
    return norm(out, 0.25)


FX = dict(chop=chop, tap=tap, whisk=whisk, sizzle=sizzle, flame=flame, stir=stir, scoop=scoop, ding=ding, ambience=ambience)

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    d = os.path.join(a.out, "sfx")
    os.makedirs(d, exist_ok=True)
    for name, fn in FX.items():
        wavfile.write(os.path.join(d, name + ".wav"), SR, (np.clip(fn(), -1, 1) * 32767).astype(np.int16))
        print("wrote", name)
