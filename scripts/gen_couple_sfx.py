"""Music bed and sound effects for the stick-couple shorts, synthesised from scratch (no samples).

usage:  python scripts/gen_couple_sfx.py --out demo-project/public/stick-couple

Writes OUT/<name>.wav: music (playful bed), scratch (record stop), gulp, ding (sparkle), grab (whoosh), laugh (crowd), freeze,
ticking (clock), plop (splat), steam (anger hiss), chew, sniff, whine (dog), clap, pour, mystery (bed),
creepy (horror build), boo (jump scare), pops (popcorn).
Each episode file in demo-project/src/stick-couple/ places the ones it uses.
"""
import argparse
import os
import sys

import numpy as np
from scipy.io import wavfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_audio import SR, bell, clap, env, impact, pop, filt, noise, norm, rng, section, t_, whoosh  # noqa: E402


def place(buf, x, at, g=1.0):
    i = max(0, int(at * SR))
    if i >= len(buf):
        return
    n = min(len(x), len(buf) - i)
    buf[i : i + n] += x[:n] * g


def fade(x, a=0.01, r=0.05):
    n = np.arange(len(x))
    return x * np.minimum(1, np.minimum(n / (a * SR), (len(x) - n) / (r * SR)))


def scratch():
    """record scratch: a noisy tone swept down then up, the needle dragging"""
    d = 0.45
    t = t_(d)
    f = np.where(t < 0.22, 1400 - 4200 * t, 480 + 2600 * (t - 0.22))
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sign(np.sin(ph)) * 0.5 + filt(noise(d), "bp", (800, 5000)) * 0.6
    return fade(norm(filt(x, "bp", (300, 6000)), 0.7), 0.003, 0.08)


def gulp():
    """nervous swallow: a short low formant blip that drops in pitch"""
    d = 0.32
    t = t_(d)
    f0 = 260 - 380 * t
    ph = 2 * np.pi * np.cumsum(f0) / SR
    src = sum(np.sin(h * ph) / h for h in range(1, 14))
    x = filt(src, "bp", (250, 900)) * np.sin(np.pi * np.minimum(1, t / d)) ** 2
    return fade(norm(x, 0.6))


def ding():
    """sparkle reveal: two bright bells a fifth apart plus a short shimmer"""
    out = np.zeros(int(1.6 * SR))
    place(out, bell(1568, 1.4), 0.0, 0.7)
    place(out, bell(2349, 1.2), 0.09, 0.5)
    sh = filt(noise(0.6), "bp", (6000, 12000)) * env(int(0.6 * SR), 0.01, 0.6, 3)
    place(out, sh, 0.0, 0.15)
    return norm(out, 0.7)


def freeze():
    """awkward-silence sting: one muted low pluck and a falling 'wah' tone"""
    d = 1.0
    t = t_(d)
    f = 330 * 2 ** (-t * 0.9)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = filt(np.sign(np.sin(ph)) * 0.4, "lp", 1600) * np.exp(-t * 2.2) * (1 - np.exp(-t * 60))
    return fade(norm(x, 0.5), 0.005, 0.2)


LAUGHERS = [  # (voice, pitch, text): a small audience, men and women, each laughing its own way
    ("en-US-JennyNeural", "+10Hz", "Hahahaha!"),
    ("en-US-GuyNeural", "-4Hz", "Ha ha ha ha ha!"),
    ("en-US-AriaNeural", "+4Hz", "Hahaha! Haha!"),
    ("en-US-ChristopherNeural", "-6Hz", "Ahahahaha!"),
    ("en-US-MichelleNeural", "+6Hz", "Hahahahaha!"),
    ("en-US-EricNeural", "+0Hz", "Ha ha ha!"),
    ("en-US-EmmaNeural", "+8Hz", "Hehehe! Hahaha!"),
    ("en-US-AndrewNeural", "-2Hz", "Ahaha ha ha!"),
]


def laugh(d=2.6):
    """audience laugh: eight real (edge-tts) voices laughing, staggered, with a little room reverb.
    (The old fully synthetic version sounded like barking.)"""
    import asyncio
    import subprocess
    import tempfile

    import edge_tts
    from scipy.signal import fftconvolve

    out = np.zeros(int(d * SR))
    offsets = [0.0, 0.12, 0.05, 0.25, 0.18, 0.32, 0.08, 0.4]
    gains = [0.9, 0.8, 0.85, 0.75, 0.8, 0.7, 0.75, 0.65]
    with tempfile.TemporaryDirectory() as tmp:
        for i, (voice, pitch, text) in enumerate(LAUGHERS):
            mp3 = os.path.join(tmp, f"l{i}.mp3")
            wav = os.path.join(tmp, f"l{i}.wav")
            asyncio.run(edge_tts.Communicate(text, voice, rate="+15%", pitch=pitch).save(mp3))
            subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-i", mp3, "-af", "silenceremove=start_periods=1:start_threshold=-40dB", "-ac", "1", "-ar", str(SR), wav])
            _, x = wavfile.read(wav)
            x = x.astype(np.float64) / 32768
            place(out, norm(x, 1.0), offsets[i], gains[i])
    t = t_(0.8)
    ir = filt(noise(0.8), "lp", 4000) * np.exp(-t / 0.22)
    wet = fftconvolve(out, ir)[: len(out)]
    out = out + 0.35 * norm(wet, np.abs(out).max())
    return fade(norm(out, 0.8), 0.02, 0.6)


def ticking(d=1.8, rate=0.25):
    """clock tick-tock: alternating short high/low clicks"""
    out = np.zeros(int(d * SR))
    for k in range(int(d / rate)):
        f = (2600, 3200) if k % 2 else (3400, 4200)
        place(out, filt(noise(0.012), "bp", f) * env(int(0.012 * SR), 0.0005, 0.012, 6), k * rate, 0.9 if k % 2 else 0.7)
    return norm(out, 0.7)


def plop():
    """soft wet splat: low thump + short squelch"""
    d = 0.35
    t = t_(d)
    thump = np.sin(2 * np.pi * (140 - 200 * t) * t) * np.exp(-t * 18)
    squelch = filt(noise(d), "bp", (400, 2200)) * np.exp(-t * 25) * 0.6
    return fade(norm(thump + squelch, 0.75), 0.002, 0.08)


def steam(d=1.4):
    """kettle-like hiss swelling up (anger)"""
    t = t_(d)
    x = filt(noise(d), "bp", (2500, 9000)) * np.clip(t / (0.7 * d), 0, 1) ** 1.5
    return fade(norm(x, 0.5), 0.05, 0.25)


def chew(d=1.4):
    """slow wet chewing: low squelchy bursts, one every ~0.35 s"""
    out = np.zeros(int(d * SR))
    for k in range(int(d / 0.35)):
        b = filt(noise(0.12), "bp", (250, 1400)) * env(int(0.12 * SR), 0.02, 0.12, 3)
        place(out, b, k * 0.35 + rng.uniform(0, 0.04), rng.uniform(0.6, 1.0))
    return fade(norm(out, 0.6))


def sniff():
    """dog sniffing: four quick nasal noise bursts"""
    out = np.zeros(int(0.9 * SR))
    for k in range(4):
        b = filt(noise(0.07), "bp", (1500, 6000)) * env(int(0.07 * SR), 0.01, 0.07, 2)
        place(out, b, k * 0.17, 0.8 if k % 2 else 1.0)
    return norm(out, 0.6)


def whine(d=1.0):
    """soft dog whimper: high nasal tone rising then falling, with a little wobble"""
    t = t_(d)
    k = t / d
    f = 900 + 500 * np.sin(np.pi * k) + 25 * np.sin(2 * np.pi * 9 * t)
    ph = 2 * np.pi * np.cumsum(f) / SR
    src = np.sin(ph) + 0.35 * np.sin(2 * ph) + 0.12 * np.sin(3 * ph)
    x = filt(src, "bp", (600, 4000)) * np.sin(np.pi * k) ** 0.8
    return fade(norm(x, 0.45), 0.02, 0.15)


def claps():
    out = np.zeros(int(0.8 * SR))
    for k in range(3):
        place(out, clap(), k * 0.2, 1.0)
    return norm(out, 0.7)


def pour(d=1.2):
    """thick goo pouring out of a pot: low gloops"""
    out = np.zeros(int(d * SR))
    for k in range(int(d / 0.16)):
        sd = 0.12
        t = t_(sd)
        f0 = rng.uniform(140, 260) * (1 + 1.5 * t / sd)
        g = np.sin(2 * np.pi * np.cumsum(f0) / SR) * np.sin(np.pi * t / sd) ** 2
        place(out, g, k * 0.16 + rng.uniform(0, 0.03), rng.uniform(0.6, 1.0))
    out += filt(noise(d), "lp", 500) * 0.15
    return fade(norm(out, 0.6), 0.03, 0.2)


def creepy(d=3.4):
    """horror-film build: low drone, a dissonant high tone creeping up, and a heartbeat that speeds up"""
    t = t_(d)
    k = t / d
    drone = np.sin(2 * np.pi * 55 * t) + 0.5 * np.sin(2 * np.pi * 58.3 * t)
    hi = 0.25 * np.sin(2 * np.pi * np.cumsum(880 + 220 * k) / SR) * k
    x = drone * 0.5 + hi + filt(noise(d), "lp", 300) * 0.3
    beat = np.zeros(len(t))
    at, gap = 0.4, 0.75
    while at < d - 0.2:
        place(beat, np.sin(2 * np.pi * 60 * t_(0.12)) * np.exp(-t_(0.12) * 30), at, 1.0)
        place(beat, np.sin(2 * np.pi * 55 * t_(0.12)) * np.exp(-t_(0.12) * 30), at + 0.16, 0.7)
        at += gap
        gap = max(0.32, gap * 0.85)
    x = x * (0.3 + 0.7 * k) + beat * 1.2
    return fade(norm(x, 0.7), 0.3, 0.05)


def boo():
    """jump-scare hit: big impact + screeching strings"""
    out = np.zeros(int(1.4 * SR))
    place(out, impact(), 0.0, 1.0)
    t = t_(0.9)
    screech = sum(np.sign(np.sin(2 * np.pi * f * t + np.sin(2 * np.pi * 7 * t))) for f in (1480, 1568, 2093)) * np.exp(-t * 3)
    place(out, filt(screech, "bp", (900, 6000)) * 0.35, 0.0)
    return norm(out, 0.9)


def pops(d=1.0):
    """popcorn flying out of the bucket: a burst of small pops"""
    out = np.zeros(int(d * SR))
    for _ in range(14):
        place(out, pop(), rng.uniform(0, 0.5) ** 1.5, rng.uniform(0.3, 0.8))
    return norm(out, 0.6)


def music(d=16.0):
    x = section("play", d)
    return fade(norm(x, 0.8), 0.2, 0.5)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--only", nargs="*", help="regenerate just these sounds")
    args = ap.parse_args()
    out = args.out
    os.makedirs(out, exist_ok=True)
    parts = {
        "music": lambda: music(),
        "scratch": lambda: scratch(),
        "gulp": lambda: gulp(),
        "ding": lambda: ding(),
        "grab": lambda: whoosh(0.3, 400, 4500, 0.6),
        "freeze": lambda: freeze(),
        "laugh": lambda: laugh(),
        "ticking": lambda: ticking(),
        "plop": lambda: plop(),
        "steam": lambda: steam(),
        "chew": lambda: chew(),
        "sniff": lambda: sniff(),
        "whine": lambda: whine(),
        "claps": lambda: claps(),
        "pour": lambda: pour(),
        "mystery": lambda: fade(norm(section("mystery", 10.0), 0.8), 0.3, 0.6),
        "creepy": lambda: creepy(),
        "boo": lambda: boo(),
        "pops": lambda: pops(),
    }
    for name, make in parts.items():
        if args.only and name not in args.only:
            continue
        x = make()
        wavfile.write(os.path.join(out, name + ".wav"), SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))
        print(name, round(len(x) / SR, 2), "s")


if __name__ == "__main__":
    main()
