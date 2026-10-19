"""Sound effects + ambience beds for the zombie-survival series, synthesised from scratch (no samples).

usage:  python scripts/gen_zs_sfx.py --out demo-project/public/zs-ep01

Writes OUT/sfx/<name>.wav. Short effects are placed on narration cues by demo-project/src/zs-ep01/sfxplan.ts;
the *_bed files are loopable ambience.
Reuses the building blocks of gen_audio.py (noise, filters, envelopes).
"""
import argparse
import os
import sys

import numpy as np
from scipy.io import wavfile
from scipy.signal import fftconvolve

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_audio as ga  # noqa: E402
from gen_audio import SR, env, filt, mix, noise, rng, t_  # noqa: E402


def sine(f, d):
    return np.sin(2 * np.pi * f * t_(d))


def place(buf, x, at, g=1.0):
    i = max(0, int(at * SR))
    if i >= len(buf):
        return
    n = min(len(x), len(buf) - i)
    buf[i : i + n] += x[:n] * g


def reverb(x, d=1.4, wet=0.45):
    ir = noise(d) * np.exp(-3.2 * t_(d))
    ir[:200] = 0
    y = fftconvolve(x, ir)[: len(x) + int(d * SR)]
    y = y / (np.max(np.abs(y)) or 1) * (np.max(np.abs(x)) or 1)
    out = np.zeros(len(y))
    out[: len(x)] += x * (1 - wet)
    out += y * wet
    return out


def loopable(x, fade=2.0):
    """cross-fade the tail onto the head so the file loops without a click"""
    n = int(fade * SR)
    head, tail = x[:n].copy(), x[-n:].copy()
    ramp = np.linspace(0, 1, n)
    body = x[: len(x) - n].copy()
    body[:n] = head * ramp + tail * (1 - ramp)
    return body


def slow_noise(d, rate=0.35):
    """smooth random 0..1 curve (changes ~rate times per second)"""
    k = max(4, int(d * rate) + 2)
    pts = rng.uniform(0, 1, k)
    return np.interp(np.linspace(0, k - 1, int(d * SR)), np.arange(k), pts)


# ------------------------------------------------------------------ one-shots
def alert_tone():
    parts = []
    for _ in range(3):
        d = 0.55
        t = t_(d)
        tone = (np.sin(2 * np.pi * 853 * t) + np.sin(2 * np.pi * 960 * t)) * 0.5
        tone *= np.minimum(1, np.minimum(t / 0.01, (d - t) / 0.02))
        parts.append(np.concatenate([tone, np.zeros(int(0.12 * SR))]))
    return np.concatenate(parts)


def phone_buzz():
    d = 0.9
    t = t_(d)
    car = 0.6 * np.sign(np.sin(2 * np.pi * 170 * t)) + 0.4 * np.sin(2 * np.pi * 170 * t)
    gate = (np.sin(2 * np.pi * 3.4 * t) > 0).astype(float)
    return filt(car, "lp", 1100) * gate * np.minimum(1, t / 0.02)


def notify():
    out = np.zeros(int(0.9 * SR))
    for at, f in ((0.0, 880), (0.16, 1320)):
        tt = t_(0.5)
        place(out, np.sin(2 * np.pi * f * tt) * np.exp(-tt * 9) + 0.3 * np.sin(2 * np.pi * 2 * f * tt) * np.exp(-tt * 14), at)
    return out


def car_alarm(d=4.0):
    t = t_(d)
    f = 1000 + 480 * np.sin(2 * np.pi * 1.7 * t)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + 0.35 * np.sin(2 * ph) + 0.18 * np.sin(3 * ph)
    x = filt(x, "bp", (450, 4200))
    gate = 0.75 + 0.25 * (np.sin(2 * np.pi * 3.4 * t) > 0)
    return x * gate


def fire_bell(d=4.0):
    base_d = 0.14
    tt = t_(base_d)
    strike = sum(a * np.sin(2 * np.pi * f * tt) * np.exp(-tt * 38) for f, a in ((1280, 1), (1830, 0.7), (2650, 0.5), (3410, 0.3)))
    out = np.zeros(int(d * SR))
    step = int(SR / 13.0)
    for k, s in enumerate(range(0, len(out) - len(strike), step)):
        out[s : s + len(strike)] += strike * (1.0 if k % 2 == 0 else 0.82)
    return out


def heart():
    out = np.zeros(int(0.8 * SR))
    for at, g in ((0.0, 1.0), (0.3, 0.68)):
        tt = t_(0.32)
        th = (np.sin(2 * np.pi * 52 * tt) + 0.5 * np.sin(2 * np.pi * 88 * tt)) * np.exp(-tt * 15)
        place(out, th, at, g)
    return filt(out, "lp", 220)


def door_push():
    body = ga.chirp(95, 45, 0.4) * env(int(0.4 * SR), 0.002, 0.4, 6)
    tt = t_(0.6)
    clank = sum(a * np.sin(2 * np.pi * f * tt) * np.exp(-tt * 16) for f, a in ((410, 0.5), (870, 0.35), (1630, 0.25)))
    clank = filt(clank, "bp", (300, 3000))
    out = np.zeros(int(0.9 * SR))
    place(out, body, 0.0, 1.0)
    place(out, clank, 0.02, 0.55)
    place(out, filt(noise(0.25), "bp", (800, 3500)) * env(int(0.25 * SR), 0.001, 0.25, 7), 0.12, 0.35)
    return out


def door_rattle():
    out = np.zeros(int(1.3 * SR))
    at = 0.0
    for g in (1.0, 0.8, 0.9, 0.6, 0.75, 0.5):
        tt = t_(0.18)
        c = sum(a * np.sin(2 * np.pi * f * tt) * np.exp(-tt * 38) for f, a in ((620, 0.6), (1450, 0.4), (2300, 0.25)))
        c += filt(noise(0.18), "bp", (900, 4500)) * np.exp(-tt * 35) * 0.5
        place(out, c, at, g)
        at += rng.uniform(0.09, 0.24)
    place(out, ga.thud(0.3, 90, 45), 0.0, 0.5)
    return out


def knock_pound():
    out = np.zeros(int(1.5 * SR))
    for at, g in ((0.0, 1.0), (0.27, 0.9), (0.5, 1.0), (0.82, 0.95)):
        place(out, ga.thud(0.28, 150, 60), at, g)
        place(out, filt(noise(0.06), "bp", (300, 1800)) * env(int(0.06 * SR), 0.0005, 0.06, 6), at, 0.8 * g)
    return out


def scrape(d=1.2):
    t = t_(d)
    n = filt(noise(d), "bp", (900, 4800))
    mod = 0.55 + 0.45 * np.sin(2 * np.pi * (8 + 5 * t) * t) ** 2
    shape = np.sin(np.pi * t / d) ** 0.8
    return n * mod * shape


def step(g=1.0):
    tt = t_(0.22)
    low = np.sin(2 * np.pi * 70 * tt) * np.exp(-tt * 28)
    scuff = filt(noise(0.22), "bp", (500, 2200)) * np.exp(-tt * 30) * 0.5
    return (low + scuff) * g


def footsteps(n=4, gap=0.95, d=None):
    d = d or n * gap + 0.4
    out = np.zeros(int(d * SR))
    for i in range(n):
        place(out, step(rng.uniform(0.7, 1.0)), i * gap + rng.uniform(-0.04, 0.04))
        if i % 2 == 1:  # a dragging foot
            place(out, filt(noise(0.35), "bp", (500, 2500)) * np.sin(np.pi * t_(0.35) / 0.35) * 0.22, i * gap + 0.2)
    return out


def run_steps():
    out = np.zeros(int(3.2 * SR))
    for i in range(11):
        place(out, step(rng.uniform(0.7, 1.0)), i * 0.27 + rng.uniform(-0.015, 0.015))
    return out


def glass_far():
    x = filt(ga.shatter(1.0), "lp", 3600) * 0.8
    return reverb(x, 1.6, 0.5)


def vase():
    x = ga.shatter(0.7)
    return x


def bottle_roll():
    out = np.zeros(int(1.9 * SR))
    at, gap = 0.0, 0.24
    for _ in range(14):
        if at >= 1.15:
            break
        tt = t_(0.09)
        tonk = (np.sin(2 * np.pi * 360 * tt) + 0.5 * np.sin(2 * np.pi * 760 * tt)) * np.exp(-tt * 55)
        place(out, tonk, at, 0.8)
        gap *= 0.82
        at += gap
    tt = t_(0.5)
    hit = (np.sin(2 * np.pi * 520 * tt) + 0.6 * np.sin(2 * np.pi * 1130 * tt)) * np.exp(-tt * 14)
    place(out, hit, 1.3, 0.9)
    place(out, filt(noise(1.2), "bp", (400, 1400)) * np.sin(np.pi * t_(1.2) / 1.2) * 0.1, 0.0)
    return out


def latch():
    out = np.zeros(int(0.5 * SR))
    for at in (0.0, 0.13):
        tt = t_(0.12)
        place(out, (np.sin(2 * np.pi * 1900 * tt) + 0.5 * np.sin(2 * np.pi * 3100 * tt)) * np.exp(-tt * 70) + filt(noise(0.12), "hp", 2500) * np.exp(-tt * 60) * 0.5, at)
    return out


def bolt_slide():
    d = 0.5
    t = t_(d)
    n = filt(noise(d), "bp", (1500, 6000)) * np.sin(np.pi * np.minimum(1, t / 0.32) / 2) ** 2 * (t < 0.34)
    out = np.zeros(int(d * SR))
    out += n * 0.6
    tt = t_(0.2)
    place(out, (np.sin(2 * np.pi * 700 * tt) + 0.5 * np.sin(2 * np.pi * 1500 * tt)) * np.exp(-tt * 40), 0.34, 0.9)
    return out


def strap_tear(d=0.5):
    t = t_(d)
    n = filt(noise(d), "hp", 2200)
    gate = (np.sin(2 * np.pi * 85 * t + 3 * np.sin(2 * np.pi * 11 * t)) > -0.2).astype(float)
    return n * gate * np.sin(np.pi * t / d) ** 0.6


def clang():
    tt = t_(0.9)
    x = sum(a * np.sin(2 * np.pi * f * tt) * np.exp(-tt * k) for f, a, k in ((520, 1, 6), (1130, 0.6, 9), (1870, 0.4, 14)))
    return x + filt(noise(0.9), "bp", (800, 5000)) * np.exp(-tt * 40) * 0.5


def scream_far(base=700, d=1.5):
    t = t_(d)
    f = base * (1 + 0.45 * np.sin(np.pi * t / d)) * (1 + 0.012 * np.sin(2 * np.pi * 6.2 * t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.33 * np.sin(3 * ph) + 0.25 * np.sin(4 * ph)
    x = filt(x + 0.2 * noise(d), "bp", (700, 3200))
    shape = np.minimum(1, t / 0.08) * np.exp(-((t - 0.55 * d) / (0.35 * d)) ** 2)
    return reverb(x * shape, 1.2, 0.55)


def crowd_scream():
    out = np.zeros(int(2.0 * SR))
    for base, at in ((620, 0.0), (760, 0.25), (910, 0.5)):
        place(out, scream_far(base, 1.4), at, 0.7)
    return out


# ------------------------------------------------------------------ beds (loop)
def murmur(d, level=1.0, busy=0.5):
    n = filt(noise(d), "bp", (260, 2300))
    amp = 0.35 + 0.65 * slow_noise(d, 0.6)
    voices = np.zeros(int(d * SR))
    for _ in range(int(d * busy * 2)):
        f = rng.uniform(180, 320)
        dd = rng.uniform(0.25, 0.6)
        tt = t_(dd)
        v = np.sin(2 * np.pi * f * (1 + 0.15 * np.sin(2 * np.pi * 3 * tt)) * tt) + 0.5 * np.sin(4 * np.pi * f * tt)
        place(voices, filt(v, "bp", (350, 2600)) * np.sin(np.pi * tt / dd) * rng.uniform(0.05, 0.18), rng.uniform(0, d - 0.7))
    return (n * amp * 0.6 + voices) * level


def amb_crowd(d=18.0):
    return loopable(murmur(d, 1.0, 0.8))


def amb_panic(d=18.0):
    x = murmur(d, 1.5, 1.6)
    for _ in range(9):
        place(x, scream_far(rng.uniform(650, 1000), rng.uniform(0.9, 1.5)), rng.uniform(0, d - 2), rng.uniform(0.25, 0.5))
    return loopable(x)


def amb_city(d=20.0):
    t = t_(d)
    low = filt(noise(d), "lp", 160) * 1.2
    wind = filt(noise(d), "bp", (300, 900)) * (0.15 + 0.5 * slow_noise(d, 0.25)) * 0.4
    hum = np.sin(2 * np.pi * 55 * t) * 0.12
    return loopable(low * (0.5 + 0.5 * slow_noise(d, 0.2)) + wind + hum)


def amb_night(d=20.0):
    t = t_(d)
    low = filt(noise(d), "lp", 120) * (0.4 + 0.6 * slow_noise(d, 0.15)) * 1.3
    whistle = filt(noise(d), "bp", (520, 640)) * (0.05 + 0.8 * slow_noise(d, 0.12) ** 3) * 0.7
    return loopable(low + whistle + np.sin(2 * np.pi * 48 * t) * 0.07)


def amb_room(d=16.0):
    t = t_(d)
    return loopable(np.sin(2 * np.pi * 50 * t) * 0.18 + np.sin(2 * np.pi * 100 * t) * 0.07 + filt(noise(d), "bp", (200, 700)) * 0.12)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    ga.ROOT = a.out
    shots = {
        "alert_tone": alert_tone(), "phone_buzz": phone_buzz(), "notify": notify(),
        "car_alarm": car_alarm(), "fire_bell": fire_bell(), "heart": heart(),
        "door_push": door_push(), "door_rattle": door_rattle(), "knock_pound": knock_pound(),
        "scrape": scrape(), "step": step(), "footsteps": footsteps(4, 0.95), "run_steps": run_steps(),
        "glass_far": glass_far(), "vase": vase(), "bottle_roll": bottle_roll(), "latch": latch(),
        "bolt_slide": bolt_slide(), "strap_tear": strap_tear(), "clang": clang(),
        "scream_far": scream_far(), "crowd_scream": crowd_scream(),
        "amb_crowd": amb_crowd(), "amb_panic": amb_panic(), "amb_city": amb_city(),
        "amb_night": amb_night(), "amb_room": amb_room(),
    }
    for k, v in shots.items():
        ga.save(k, v, 0.9)
    print("zs sfx:", len(shots), "->", os.path.join(a.out, "sfx"))


if __name__ == "__main__":
    main()
