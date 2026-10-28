"""Voices + timeline for the classroom-gag shorts (two-character dialogue, edge-tts neural voices).

usage:  python scripts/gen_gag_voice.py ep01 [series]      (series defaults to classroom-gag; reads content/<series>/<ep>.json)

Writes demo-project/public/<series>/<ep>/voice_<n>.mp3, sfx wavs, and demo-project/src/<series>/<ep>.json
(the input lines plus start/end seconds of every line and the length of the video).
"""
import asyncio
import json
import os
import subprocess
import sys

import edge_tts
import numpy as np
from scipy.io import wavfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_audio import SR, pop, thud, whoosh  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAP = 0.3
LEAD = 0.25
LAUGH = 2.4


def duration(path):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path])
    return float(out.decode().strip())


async def main(ep, series):
    spec = json.load(open(os.path.join(ROOT, "content", series, ep + ".json"), encoding="utf-8"))
    pub = os.path.join(ROOT, "demo-project", "public", series, ep)
    os.makedirs(pub, exist_ok=True)
    t = spec.get("lead", LEAD)
    gap = spec.get("gap", GAP)
    for i, ln in enumerate(spec["lines"]):
        path = os.path.join(pub, f"voice_{i}.mp3")
        await edge_tts.Communicate(ln["text"], ln["voice"], rate=ln["rate"], pitch=ln["pitch"]).save(path)
        trimmed = path + ".t.mp3"  # cut the silence edge-tts leaves before and after the words
        subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-i", path, "-af", "silenceremove=start_periods=1:start_threshold=-40dB,areverse,silenceremove=start_periods=1:start_threshold=-40dB,areverse", trimmed])
        os.replace(trimmed, path)
        d = duration(path)
        ln["start"], ln["end"] = round(t, 2), round(t + d, 2)
        t += d + gap
        print(i, ln["start"], ln["end"], ln["text"])
    if "tail" in spec:  # story shorts: the picture holds on after the last line
        spec["total"] = round(spec["lines"][-1]["end"] + spec["tail"], 2)
    else:  # classroom gag: laugh tag after the last line
        spec["laughAt"] = round(t + 0.1, 2)
        spec["total"] = round(spec["laughAt"] + LAUGH, 2)
    for name, x in (("pop", pop()), ("whoosh", whoosh(0.35, 300, 3000, 0.5)), ("thud", thud(0.35))):
        wavfile.write(os.path.join(pub, name + ".wav"), SR, (np.asarray(x) / max(1e-9, np.abs(x).max()) * 0.8 * 32767).astype(np.int16))
    json.dump(spec, open(os.path.join(ROOT, "demo-project", "src", series, ep + ".json"), "w", encoding="utf-8"), indent=2)
    print("total", spec["total"], "s")


asyncio.run(main(sys.argv[1] if len(sys.argv) > 1 else "ep01", sys.argv[2] if len(sys.argv) > 2 else "classroom-gag"))
