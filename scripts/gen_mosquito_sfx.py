"""Sound effects for the mosquito gag short, synthesised from scratch (no samples).

usage:  python scripts/gen_mosquito_sfx.py --out demo-project/public/mosquito-gag

Writes OUT/<name>.wav; demo-project/src/mosquito-gag/Video.tsx places them and rides the buzz volume
frame by frame (distance of the mosquito to the camera), so buzz.wav is one long continuous take.
"""
import argparse
import os
import sys

import numpy as np
from scipy.io import wavfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_audio import SR, chirp, env, filt, noise, norm, rng, t_, whoosh  # noqa: E402


def place(buf, x, at, g=1.0):
    i = max(0, int(at * SR))
    if i >= len(buf):
        return
    n = min(len(x), len(buf) - i)
    buf[i : i + n] += x[:n] * g


def fade(x, a=0.01, r=0.05):
    n = np.arange(len(x))
    return x * np.minimum(1, np.minimum(n / (a * SR), (len(x) - n) / (r * SR)))


def buzz(d=32.0):
    """mosquito whine: ~560 Hz sawtooth-ish tone, slow random pitch drift (doppler) + wingbeat roughness"""
    t = t_(d)
    drift = filt(rng.standard_normal(len(t)), "lp", 1.2)
    drift = drift / (np.abs(drift).max() + 1e-9)
    f = 560 + 70 * drift + 12 * np.sin(2 * np.pi * 5.5 * t)
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = sum(np.sin(k * ph) / k ** 1.1 for k in range(1, 9))
    rough = 0.75 + 0.25 * np.sin(2 * np.pi * 38 * t)
    x = filt(tone * rough, "bp", (380, 6000)) + 0.04 * filt(noise(d), "bp", (2000, 6000))
    return fade(norm(x, 0.7), 0.05, 0.2)


def click():
    out = np.zeros(int(0.25 * SR))
    place(out, filt(noise(0.012), "bp", (1500, 7000)) * env(int(0.012 * SR), 0.0003, 0.012, 6), 0.0)
    place(out, filt(noise(0.02), "bp", (600, 3000)) * env(int(0.02 * SR), 0.0005, 0.02, 7), 0.035, 0.7)
    return norm(out, 0.8)


def snore(d=1.6):
    """inhale rattle (low pulsed noise) + soft exhale whistle"""
    t = t_(d)
    k = t / d
    inhale = filt(noise(d), "bp", (90, 700)) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 28 * t))) * np.clip(np.sin(np.pi * k / 0.55), 0, 1) * (k < 0.55)
    ex_env = np.clip(np.sin(np.pi * (k - 0.6) / 0.4), 0, 1) * (k > 0.6)
    exhale = (filt(noise(d), "bp", (500, 1800)) * 0.25 + 0.15 * np.sin(2 * np.pi * (900 - 300 * k) * t)) * ex_env
    return fade(norm(inhale + exhale, 0.6))


def gulp():
    d = 0.45
    t = t_(d)
    f = 260 - 170 * (t / d)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.01, d, 3)
    pop = filt(noise(0.03), "bp", (300, 1500)) * env(int(0.03 * SR), 0.001, 0.03, 6)
    out = tone * 0.8
    place(out, pop, 0.05, 0.6)
    return norm(out, 0.7)


def crickets(d=32.0):
    out = np.zeros(int(d * SR))
    chirp_ = np.sin(2 * np.pi * 4300 * t_(0.012)) * np.hanning(int(0.012 * SR))
    at = 0.3
    while at < d - 0.5:
        for k in range(rng.integers(3, 5)):
            place(out, chirp_, at + k * 0.025, rng.uniform(0.6, 1.0))
        at += rng.uniform(0.45, 0.9)
    room = filt(noise(d), "lp", 400) * 0.08
    return fade(norm(out * 0.25 + room, 0.35), 0.3, 0.5)


def crunch():
    out = np.zeros(int(0.3 * SR))
    for at in rng.uniform(0, 0.12, 6):
        place(out, filt(noise(0.03), "bp", (800, 5000)) * env(int(0.03 * SR), 0.0005, 0.03, 5), at, rng.uniform(0.5, 1))
    return norm(out, 0.7)


def kettle(d=0.9):
    """heating up: rising whistle with breathy noise"""
    t = t_(d)
    f = 900 + 1400 * (t / d)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.6 + filt(noise(d), "bp", (2500, 7000)) * 0.4
    return fade(norm(x * (t / d) ** 1.5, 0.55))


def roar(d=1.3):
    """fire breath: low rumbling noise with flicker"""
    t = t_(d)
    x = filt(noise(d), "lp", 900) + 0.35 * filt(noise(d), "bp", (1500, 5000))
    flick = 0.7 + 0.3 * filt(rng.standard_normal(len(t)), "lp", 18) / 0.05
    return fade(norm(x * np.clip(flick, 0.2, 1.4) * np.minimum(1, t / 0.08), 0.85), 0.02, 0.4)


def crackle(d=1.6):
    """burning: soft roar bed + dry pops"""
    out = filt(noise(d), "lp", 600) * 0.25
    for at in rng.uniform(0, d - 0.05, int(d * 30)):
        place(out, filt(noise(0.01), "bp", (1500, 7000)) * env(int(0.01 * SR), 0.0005, 0.01, 6), at, rng.uniform(0.3, 1.0))
    return fade(norm(out, 0.7), 0.05, 0.3)


def scream(d=1.5):
    """tiny high 'aaaaa!': buzzy source through two vowel formants, vibrato, pitch rising then cracking down"""
    t = t_(d)
    k = t / d
    f = 820 + 260 * np.sin(np.pi * np.minimum(k, 0.7) / 0.7 * 0.5) - 300 * np.clip((k - 0.75) / 0.25, 0, 1)
    f = f * (1 + 0.035 * np.sin(2 * np.pi * 9 * t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    src = sum(np.sin(n * ph) / n for n in range(1, 14))
    x = filt(src, "bp", (900, 1500)) + 0.6 * filt(src, "bp", (2200, 3200))
    return fade(norm(x, 0.65), 0.03, 0.25)


def hiss(d=1.6):
    t = t_(d)
    return fade(norm(filt(noise(d), "hp", 3000) * np.exp(-2.2 * t / d), 0.45), 0.01, 0.3)


def haha(d=2.3):
    """gleeful man's laugh 'ha-ha-ha-ha': voiced /a/ syllables (formants ~750/1250 Hz) with breathy onsets, pitch falling"""
    out = np.zeros(int(d * SR))
    n = 7
    for k in range(n):
        sd = 0.2
        t = t_(sd)
        f0 = 210 - k * 9 + 25 * np.sin(np.pi * t / sd)
        ph = 2 * np.pi * np.cumsum(f0) / SR
        src = sum(np.sin(h * ph) / h for h in range(1, 25))
        voice = filt(src, "bp", (550, 950)) + 0.6 * filt(src, "bp", (1050, 1500)) + 0.2 * filt(src, "bp", (2300, 2900))
        breath = filt(noise(sd), "bp", (800, 3000)) * np.exp(-t / 0.03) * 0.8
        shape = np.sin(np.pi * np.minimum(1, t / sd)) ** 0.7
        place(out, (voice + breath) * shape, k * 0.29, 1.0 - k * 0.06)
    return fade(norm(out, 0.75), 0.01, 0.2)


def thud():
    d = 0.25
    t = t_(d)
    x = np.sin(2 * np.pi * (180 - 100 * t / d) * t) * env(len(t), 0.001, d, 6)
    return norm(x + 0.3 * filt(noise(d), "lp", 900) * env(len(t), 0.001, d, 10), 0.6)


def sung(notes, mult, formants, vib=0.02, sob=0.0, gap=0.04):
    """sung 'la' syllables: notes = [(semitones from A4, seconds)], pitch * mult, vowel through band-pass formants;
    sob > 0 adds hiccupy dips (crying while singing)"""
    total = sum(d for _, d in notes)
    out = np.zeros(int((total + 0.3) * SR))
    at = 0.0
    for k, (st, d) in enumerate(notes):
        t = t_(d - gap)
        f = 440 * 2 ** (st / 12) * mult * (1 + vib * np.sin(2 * np.pi * 5.8 * t) * np.minimum(1, t / 0.15))
        ph = 2 * np.pi * np.cumsum(f) / SR
        src = sum(np.sin(h * ph) / h for h in range(1, 18))
        x = sum(g * filt(src, "bp", band) for band, g in formants)
        shape = np.minimum(1, t / 0.03) * np.minimum(1, (len(t) / SR - t) / 0.08)
        if sob:
            shape = shape * (1 - sob * 0.6 * (np.sin(2 * np.pi * 7 * t) > 0.6))
        # the "l" of "la": a quick dip in brightness at the onset
        x = x * shape * (0.6 + 0.4 * np.minimum(1, t / 0.05))
        place(out, x, at)
        at += d
    return fade(norm(out, 0.7), 0.02, 0.25)


def karaoke():
    """the mosquito's loud karaoke in his ear: upbeat major tune, squeaky voice, little drum machine underneath"""
    q, h = 0.2, 0.4
    notes = [(3, q), (5, q), (7, q), (3, q), (7, q), (8, q), (10, h), (10, q), (12, q), (10, q), (8, q), (7, q), (3, q), (5, q), (10, q), (3, h + 0.2)]
    voice = sung(notes, 2.0, [((1000, 1500), 1.0), ((2200, 3200), 0.7)], vib=0.03, gap=0.03)
    beat = np.zeros_like(voice)
    at = 0.0
    while at < len(voice) / SR - 0.3:
        place(beat, np.sin(2 * np.pi * (120 - 70 * t_(0.12) / 0.12) * t_(0.12)) * env(int(0.12 * SR), 0.001, 0.12, 6), at, 0.9)
        place(beat, filt(noise(0.03), "hp", 6000) * env(int(0.03 * SR), 0.0005, 0.03, 6), at + 0.2, 0.35)
        at += 0.4
    return fade(norm(voice + 0.55 * beat, 0.8), 0.01, 0.25)


def karaoke_warp():
    """the same karaoke going wrong as the smoke hits: a slice of it played at a wobbling, sagging speed, muffled"""
    src = karaoke()[int(1.0 * SR) : int(3.0 * SR)]
    n_out = int(1.7 * SR)
    t = np.arange(n_out) / SR
    rate = 1.0 - 0.18 * (t / 1.7) + 0.12 * np.sin(2 * np.pi * 3.2 * t)
    idx = np.clip(np.cumsum(rate), 0, len(src) - 2)
    i0 = idx.astype(int)
    fr = idx - i0
    x = src[i0] * (1 - fr) + src[i0 + 1] * fr
    x = filt(x, "lp", 2500) * (0.75 + 0.25 * np.sin(2 * np.pi * 7 * t))
    return fade(norm(x, 0.7), 0.01, 0.2)


def bellow():
    """his huge deep "LA! LA! LA-LAAA!" into the mic: open 'a' vowel on a low voice, a bass boom under each syllable, driven hot"""
    out = np.zeros(int(2.9 * SR))
    for at, d, f0, f1 in ((0.0, 0.45, 110, 104), (0.55, 0.45, 123, 116), (1.1, 0.32, 110, 110), (1.5, 1.05, 98, 87)):
        t = t_(d)
        k = t / d
        f = (f0 + (f1 - f0) * k) * (1 + 0.025 * np.sin(2 * np.pi * 5 * t) * np.minimum(1, t / 0.3))
        ph = 2 * np.pi * np.cumsum(f) / SR
        src = sum(np.sin(h * ph) / h for h in range(1, 40))
        voice = filt(src, "bp", (560, 900)) + 0.6 * filt(src, "bp", (1000, 1400)) + 0.15 * filt(src, "bp", (2300, 2900))
        voice = voice * np.minimum(1, t / 0.03) * np.minimum(1, (d - t) / 0.1) * (0.55 + 0.45 * np.minimum(1, t / 0.05))
        boom = np.sin(2 * np.pi * (60 - 20 * k) * t) * np.exp(-t * 3)
        place(out, np.tanh(2.2 * norm(voice, 1.0)) * 0.8 + 0.9 * boom, at)
    return fade(norm(out, 0.9), 0.01, 0.2)


def feedback(d=0.7):
    """mic feedback squeal"""
    t = t_(d)
    f = 2600 + 400 * (t / d)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, t / 0.05) * (1 - 0.3 * np.sin(2 * np.pi * 11 * t))
    return fade(norm(x, 0.45), 0.01, 0.15)


def lighter():
    """flint wheel scrape + whoomp of the flame"""
    out = np.zeros(int(0.7 * SR))
    place(out, filt(noise(0.06), "bp", (2500, 9000)) * env(int(0.06 * SR), 0.001, 0.06, 3), 0.0, 0.8)
    place(out, filt(noise(0.5), "lp", 700) * env(int(0.5 * SR), 0.02, 0.5, 3), 0.05, 0.7)
    return norm(out, 0.7)


def cough():
    """tiny high cough-cough-cough"""
    out = np.zeros(int(0.9 * SR))
    for k in range(3):
        d = 0.09
        t = t_(d)
        x = filt(noise(d), "bp", (1500, 5000)) * env(len(t), 0.003, d, 5) + 0.4 * np.sin(2 * np.pi * 1300 * t) * env(len(t), 0.003, d, 6)
        place(out, x, k * 0.24, 1 - k * 0.15)
    return norm(out, 0.6)


def hihi():
    """tiny squeaky mosquito giggle"""
    out = np.zeros(int(1.1 * SR))
    for k in range(6):
        d = 0.09
        t = t_(d)
        f = 1900 - k * 60 + 300 * np.sin(np.pi * t / d)
        ph = 2 * np.pi * np.cumsum(f) / SR
        env_ = np.sin(np.pi * t / d) ** 2
        place(out, (np.sin(ph) + 0.3 * np.sin(2 * ph)) * env_, k * 0.15)
    return norm(out, 0.5)


# ---------- ep 3 "Fat mosquito" ----------
def voiced(d, f0, f1, formants, gains=(1, 0.6, 0.15), rough=0.0):
    """one voiced syllable: pitch glides f0 -> f1, harmonic source through band-pass formants"""
    t = t_(d)
    f = f0 + (f1 - f0) * (t / d)
    ph = 2 * np.pi * np.cumsum(f) / SR
    src = sum(np.sin(h * ph) / h for h in range(1, 30))
    if rough:
        src = src * (1 - rough + rough * np.abs(np.sin(2 * np.pi * 31 * t)))
    return sum(g * filt(src, "bp", b) for g, b in zip(gains, formants))


def slap():
    d = 0.22
    t = t_(d)
    crack = filt(noise(d), "bp", (900, 6500)) * env(len(t), 0.0005, d, 9)
    body = np.sin(2 * np.pi * (140 - 60 * t / d) * t) * env(len(t), 0.001, d, 7)
    return norm(crack + 0.6 * body, 0.85)


def rubber_boing(d=0.55):
    t = t_(d)
    f = 180 + 220 * np.sin(2 * np.pi * 11 * t) * np.exp(-t * 5) + 120 * t / d
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * np.sin(4 * np.pi * np.cumsum(f) / SR)
    hit = filt(noise(0.03), "lp", 1500) * env(int(0.03 * SR), 0.001, 0.03, 6)
    out = tone * env(len(t), 0.002, d, 3.5)
    place(out, hit, 0, 0.8)
    return norm(out, 0.6)


def flick():
    """finger flick 'tak!': bright click + tiny knock"""
    out = np.zeros(int(0.18 * SR))
    place(out, filt(noise(0.01), "bp", (2500, 9000)) * env(int(0.01 * SR), 0.0002, 0.01, 6), 0)
    d = 0.06
    place(out, np.sin(2 * np.pi * 900 * t_(d)) * env(int(d * SR), 0.0005, d, 7), 0.002, 0.6)
    return norm(out, 0.8)


def slurp(d=1.4):
    """drinking through a straw: gurgling band-noise with a wobbling centre + little bubbles"""
    t = t_(d)
    x = filt(noise(d), "bp", (500, 2600)) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 6 * t)))
    for k in range(9):
        bd = 0.05
        place(x, chirp(350 + 60 * k % 300, 900, bd) * env(int(bd * SR), 0.002, bd, 5), 0.1 + k * 0.14, 0.9)
    return fade(norm(x, 0.45), 0.08, 0.2)


def plop():
    d = 0.3
    t = t_(d)
    x = filt(noise(d), "lp", 500) * env(len(t), 0.001, d, 8) + 0.6 * np.sin(2 * np.pi * (110 - 50 * t / d) * t) * env(len(t), 0.001, d, 6)
    return norm(x, 0.6)


def mumble():
    """sleepy 'mm-mnh...'"""
    out = np.zeros(int(0.9 * SR))
    place(out, voiced(0.35, 130, 115, [(200, 400), (900, 1300)], (1, 0.15)), 0)
    place(out, voiced(0.4, 120, 95, [(220, 500), (800, 1200)], (1, 0.2)), 0.42, 0.8)
    return fade(norm(out, 0.5), 0.03, 0.15)


def burp():
    d = 0.55
    x = voiced(d, 95, 70, [(250, 700), (700, 1100)], (1, 0.5), rough=0.7)
    return fade(norm(x * env(int(d * SR), 0.02, d, 1.5), 0.6), 0.02, 0.1)


def ow():
    """him: sharp 'OW!' - open 'a' sliding into 'oo', pitch jumps up then falls"""
    d = 0.5
    t = t_(d)
    k = t / d
    f = np.where(k < 0.25, 200 + 160 * k / 0.25, 360 - 170 * (k - 0.25) / 0.75)
    ph = 2 * np.pi * np.cumsum(f) / SR
    src = sum(np.sin(h * ph) / h for h in range(1, 30))
    a = filt(src, "bp", (650, 1000)) + 0.6 * filt(src, "bp", (1050, 1450))
    u = filt(src, "bp", (300, 500)) + 0.5 * filt(src, "bp", (700, 950))
    x = a * (1 - k) + u * k
    x = np.tanh(1.8 * norm(x, 1.0)) * np.minimum(1, t / 0.015) * np.minimum(1, (d - t) / 0.12)
    return fade(norm(x, 0.8), 0.005, 0.1)


def bonk():
    """finger on forehead: hollow wooden knock"""
    d = 0.35
    t = t_(d)
    x = (np.sin(2 * np.pi * 420 * t) + 0.5 * np.sin(2 * np.pi * 1130 * t)) * env(len(t), 0.0008, d, 9)
    x += 0.7 * np.sin(2 * np.pi * (150 - 70 * t / d) * t) * env(len(t), 0.001, d, 6)
    place(x, filt(noise(0.02), "bp", (1000, 5000)) * env(int(0.02 * SR), 0.0003, 0.02, 6), 0, 0.5)
    return norm(x, 0.9)


def stretch(d=1.3):
    """loaded finger trembling: rising rubbery creak"""
    t = t_(d)
    f = 120 + 260 * (t / d) ** 1.5
    x = filt(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)), "bp", (300, 2500)) * (0.6 + 0.4 * np.sin(2 * np.pi * 17 * t))
    return fade(norm(x * (0.3 + 0.7 * t / d), 0.35), 0.1, 0.05)


def stab():
    d = 0.08
    return norm(chirp(4000, 1500, d) * env(int(d * SR), 0.0005, d, 6), 0.5)


def twinkle(d=1.6):
    """cartoon stars circling a dazed head"""
    out = np.zeros(int(d * SR))
    for k, f in enumerate([2093, 2637, 3136, 2637, 2093, 2637]):
        bd = 0.35
        tt = t_(bd)
        place(out, (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 2.76 * tt)) * np.exp(-tt * 9), k * 0.22, 1 - k * 0.1)
    return fade(norm(out, 0.35), 0.005, 0.2)


def roll(d=0.9):
    t = t_(d)
    x = filt(noise(d), "bp", (120, 700)) * (0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 7 * t)))
    return fade(norm(x, 0.35), 0.05, 0.2)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    sfx = {
        "buzz": buzz(),
        "click": click(),
        "snore": snore(),
        "gulp": gulp(),
        "crickets": crickets(),
        "whoosh": whoosh(0.3, 600, 5000, 0.6),
        "poof": whoosh(0.5, 200, 1500, 0.5),
        "crunch": crunch(),
        "kettle": kettle(),
        "roar": roar(),
        "crackle": crackle(),
        "scream": scream(),
        "hiss": hiss(),
        "thud": thud(),
        "haha": haha(),
        "lighter": lighter(),
        "cough": cough(),
        "hihi": hihi(),
        "karaoke": karaoke(),
        "karaoke_warp": karaoke_warp(),
        "bellow": bellow(),
        "feedback": feedback(),
        "slap": slap(),
        "boing": rubber_boing(),
        "flick": flick(),
        "slurp": slurp(),
        "plop": plop(),
        "mumble": mumble(),
        "burp": burp(),
        "ow": ow(),
        "bonk": bonk(),
        "stretch": stretch(),
        "stab": stab(),
        "twinkle": twinkle(),
        "roll": roll(),
    }
    for name, x in sfx.items():
        wavfile.write(os.path.join(a.out, f"{name}.wav"), SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))
        print(f"{name}.wav  {len(x) / SR:.2f}s")


if __name__ == "__main__":
    main()
