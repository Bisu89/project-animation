"""Intro stingers for the xmas-cat-wide opening -> demo-project/public/xmas-cat-wide/intro_sfx.wav (stereo, 44.1k, 18 s).
Timeline matches Intro in demo-project/src/xmas-cat-wide/Video.tsx: glitch crackle 5.4-6.6, whoosh 6.0-8.3 (rising then falling), thud at 8.3.
Usage: python scripts/gen_xmas_intro_sfx.py"""
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 44100
T = 18.0
n = int(SR * T)
rng = np.random.default_rng(11)
t = np.arange(n) / SR
out = np.zeros(n)

def seg(a, b):
    return slice(int(a * SR), int(b * SR))

# glitch crackle: short random bursts of band-limited noise
for _ in range(34):
    s0 = rng.uniform(5.4, 6.55)
    L = int(rng.uniform(0.008, 0.05) * SR)
    i = int(s0 * SR)
    burst = rng.standard_normal(L) * np.exp(-np.arange(L) / (L / 3)) * rng.uniform(0.15, 0.5)
    out[i:i + L] += burst
out = sosfilt(butter(2, [900, 9000], "band", fs=SR, output="sos"), out)

# whoosh: noise whose centre frequency sweeps up to the zoom peak (7.8) and back down
w0, w1 = 6.0, 8.3
m = (t >= w0) & (t < w1)
x = (t[m] - w0) / (w1 - w0)
env = np.sin(np.pi * x) ** 2 * 0.55
sweep = 300 + 3200 * np.sin(np.pi * x)
noise = rng.standard_normal(m.sum())
phase_lp = np.zeros_like(noise)
alpha = np.clip(2 * np.pi * sweep / SR, 0.01, 0.9)  # one-pole low-pass whose cutoff follows the sweep
y = 0.0
for k in range(len(noise)):
    y += alpha[k] * (noise[k] - y)
    phase_lp[k] = y
out[m] += phase_lp * env * 3.0

# thud: low sine drop plus a short click as the poster slams in
t0 = 8.3
i = int(t0 * SR)
L = int(1.4 * SR)
tt = np.arange(L) / SR
thud = np.sin(2 * np.pi * (48 + 60 * np.exp(-tt * 14)) * tt) * np.exp(-tt * 3.2) * 0.9
click = rng.standard_normal(int(0.03 * SR)) * np.exp(-np.arange(int(0.03 * SR)) / 300) * 0.25
out[i:i + L] += thud
out[i:i + len(click)] += click

out = np.tanh(out * 1.1) * 0.9
d = int(0.0009 * SR)
R = np.concatenate([np.zeros(d), out[:-d]])
wavfile.write("demo-project/public/xmas-cat-wide/intro_sfx.wav", SR, (np.stack([out, R], 1) * 32767).astype(np.int16))
print("ok")
