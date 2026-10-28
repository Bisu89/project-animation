"""Ambience for a cozy scene -> demo-project/public/<assets>/ambience.wav (stereo, 44.1k).

Usage: python scripts/cozy_sfx.py <scene_id> <seconds> [--wind-only]
Fire crackle + a low fire rumble when the config has a `fire`, always a soft swelling wind; fades in/out over 0.5 s.
Make it at least as long as the video (a few seconds more is fine).
"""
import os
import sys

import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

import cozy_lib as L

cfg = L.load(sys.argv[1])
T = float(sys.argv[2])
has_fire = bool(cfg.get("fire")) and "--wind-only" not in sys.argv
SR = 44100
n = int(SR * T)
rng = np.random.default_rng(7)
t = np.arange(n) / SR
bp = lambda lo, hi, x: sosfilt(butter(2, [lo, hi], "band", fs=SR, output="sos"), x)
lp = lambda hi, x: sosfilt(butter(2, hi, "low", fs=SR, output="sos"), x)

mix = np.zeros(n)
if has_fire:
    rumble = lp(220, rng.standard_normal(n)) * (0.55 + 0.45 * np.tanh(lp(1.5, rng.standard_normal(n)) * 40))
    rumble *= 0.5 / (np.abs(rumble).max() + 1e-9)
    pops = np.zeros(n)
    for _ in range(int(T * 9)):
        i = int(rng.uniform(0, max(0.01, T - 0.1)) * SR)
        L_ = int(rng.uniform(0.004, 0.03) * SR)
        pops[i:i + L_] += rng.standard_normal(L_) * np.exp(-np.arange(L_) / (L_ / 4)) * rng.uniform(0.2, 1.0)
    pops = bp(1200, 6500, pops)
    pops *= 0.55 / (np.abs(pops).max() + 1e-9)
    hiss = bp(2500, 7000, rng.standard_normal(n)) * 0.02 * (0.6 + 0.4 * np.sin(t * 2.3))
    mix += rumble * 0.55 + pops + hiss
wind = bp(180, 700, rng.standard_normal(n)) * (0.5 + 0.5 * np.sin(t * 0.6 + 1)) ** 2
wind *= (0.18 if has_fire else 0.5) / (np.abs(wind).max() + 1e-9)
mix = np.tanh((mix + wind) * 1.1) * np.minimum(1, np.minimum(t, T - t) / 0.5) * 0.8
d = int(0.0012 * SR)
Lc, Rc = mix, np.concatenate([np.zeros(d), mix[:-d]])
out = os.path.join(L.public_dir(cfg), "ambience.wav")
os.makedirs(os.path.dirname(out), exist_ok=True)
wavfile.write(out, SR, (np.stack([Lc, Rc], 1) * 32767).astype(np.int16))
print("ok", out, "(%s s, %s)" % (T, "fire + wind" if has_fire else "wind"))

# poster intro stingers (only when the config has `intro`): soft whoosh into the slam, then a low thud, timed like introTimes() in CozyScene.tsx
if cfg.get("intro"):
    d = float(cfg["intro"].get("seconds", 6))
    g0, p0 = d * 0.4, d * 0.53
    m_ = np.zeros(int(SR * (d + 1.5)))
    tt = np.arange(len(m_)) / SR
    sel = (tt >= g0 - 0.3) & (tt < p0)
    x = (tt[sel] - (g0 - 0.3)) / (p0 - g0 + 0.3)
    noise = rng.standard_normal(sel.sum())
    alpha = np.clip(2 * np.pi * (200 + 900 * np.sin(np.pi * x * 0.5)) / SR, 0.01, 0.9)
    y_, w_ = 0.0, np.zeros_like(noise)
    for k_ in range(len(noise)):
        y_ += alpha[k_] * (noise[k_] - y_)
        w_[k_] = y_
    m_[sel] += w_ * np.sin(np.pi * x * 0.5) ** 2 * 0.9
    i0 = int(p0 * SR)
    n2 = int(1.4 * SR)
    t2 = np.arange(n2) / SR
    m_[i0:i0 + n2] += np.sin(2 * np.pi * (48 + 60 * np.exp(-t2 * 14)) * t2) * np.exp(-t2 * 3.2) * 0.9
    m_ = np.tanh(m_ * 1.1) * 0.6
    d2 = int(0.0009 * SR)
    wavfile.write(os.path.join(os.path.dirname(out), "intro_sfx.wav"), SR, (np.stack([m_, np.concatenate([np.zeros(d2), m_[:-d2]])], 1) * 32767).astype(np.int16))
    print("ok intro_sfx.wav")
