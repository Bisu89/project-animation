"""Fireplace crackle + soft wind for the xmas-cat reel -> demo-project/public/xmas-cat-wide/ambience.wav (stereo, 44.1k).
Usage: python scripts/gen_xmas_sfx.py [seconds]"""
import sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 44100
T = float(sys.argv[1]) if len(sys.argv) > 1 else 12.0
n = int(SR * T)
rng = np.random.default_rng(7)
t = np.arange(n) / SR
bp = lambda lo, hi, x: sosfilt(butter(2, [lo, hi], "band", fs=SR, output="sos"), x)
lp = lambda hi, x: sosfilt(butter(2, hi, "low", fs=SR, output="sos"), x)

# fire body: low rumble that breathes
rumble = lp(220, rng.standard_normal(n)) * (0.55 + 0.45 * np.tanh(lp(1.5, rng.standard_normal(n)) * 40))
rumble *= 0.5 / (np.abs(rumble).max() + 1e-9)
# crackle: random pops (short decaying bursts) plus a fine hiss
pops = np.zeros(n)
for _ in range(int(T * 9)):
    i = int(rng.uniform(0, T - 0.1) * SR)
    L = int(rng.uniform(0.004, 0.03) * SR)
    burst = rng.standard_normal(L) * np.exp(-np.arange(L) / (L / 4))
    pops[i:i + L] += burst * rng.uniform(0.2, 1.0)
pops = bp(1200, 6500, pops)
pops *= 0.55 / (np.abs(pops).max() + 1e-9)
hiss = bp(2500, 7000, rng.standard_normal(n)) * 0.02 * (0.6 + 0.4 * np.sin(t * 2.3))
# wind: slow-swelling soft noise
wind = bp(180, 700, rng.standard_normal(n)) * (0.5 + 0.5 * np.sin(t * 0.6 + 1)) ** 2
wind *= 0.18 / (np.abs(wind).max() + 1e-9)

mix = np.tanh((rumble * 0.55 + pops + hiss + wind) * 1.1)
mix *= np.minimum(1, np.minimum(t, T - t) / 0.5) * 0.8
d = int(0.0012 * SR)  # tiny delay on one side for width
L, R = mix, np.concatenate([np.zeros(d), mix[:-d]])
wavfile.write("demo-project/public/xmas-cat-wide/ambience.wav", SR, (np.stack([L, R], 1) * 32767).astype(np.int16))
print("ok", T, "s")
