"""Per-frame (30 fps) audio features for the smoke-demo: smoothed bass / lowmid / high envelopes (0..1) and onset strength.
Usage: python scripts/smoke_features.py <mp3> <out.json>"""
import json, subprocess, sys, tempfile, os
import numpy as np
from scipy.io import wavfile

src, out = sys.argv[1], sys.argv[2]
FPS = 30
wav = os.path.join(tempfile.gettempdir(), "smoke_feat.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-ac", "1", "-ar", "22050", wav], check=True)
sr, x = wavfile.read(wav)
x = x.astype(float) / 32768
hop = sr // FPS
n = 2048
win = np.hanning(n)
nfr = (len(x) - n) // hop
S = np.array([np.abs(np.fft.rfft(x[i * hop:i * hop + n] * win)) for i in range(nfr)])
f = np.fft.rfftfreq(n, 1 / sr)

def env(a, b, attack=0.5, release=0.12):
    v = np.sqrt(S[:, (f >= a) & (f < b)].sum(1))
    v = v / np.percentile(v, 98)
    o = np.zeros_like(v)
    for i in range(len(v)):  # fast attack, slow release: smoke should swell, not flicker
        p = o[i - 1] if i else 0
        o[i] = p + (v[i] - p) * (attack if v[i] > p else release)
    return np.clip(o, 0, 1.2)

flux = np.maximum(0, np.diff(S, axis=0, prepend=S[:1])).sum(1)
flux = flux / np.percentile(flux, 98)
r = lambda a: [round(float(v), 3) for v in a]
json.dump({"fps": FPS, "frames": nfr, "bass": r(env(30, 200)), "mid": r(env(200, 1500)), "high": r(env(1500, 8000, 0.6, 0.2)), "onset": r(np.clip(flux, 0, 1.5))}, open(out, "w"))
print(nfr, "frames ->", out)
