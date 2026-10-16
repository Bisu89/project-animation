#!/usr/bin/env python3
"""Narration voice (free Microsoft neural voices via edge-tts) with timings that match the audio exactly.

Usage:
    python gen_voice.py --script script.md --out PROJECT/public/SLUG [--timeline-out PROJECT/src/SLUG]
    python gen_voice.py --list-voices en

Writes into --out:
    voice.wav   the narration (24 kHz mono), with a short silence between sentences/paragraphs
    voice.srt   one cue per sentence with the REAL start/end in that audio
and, with --timeline-out, runs parse_input.py --srt so timeline.ts/json/voiceover.srt follow the real voice
(then render with --props='{"voice":"voice.wav"}'; no whisper or align_voice.py needed).

Design cloned from AI-Marketing-Factory's voice module (backend/app/modules/voice/providers.py):
  * one request per sentence, spliced with a real silent gap (a single long request reads flat);
  * each sentence trimmed to its last spoken word (+80 ms) so the gap is always the same length;
  * retries with growing, jittered backoff and a per-attempt timeout (the free endpoint is flaky),
    with a last try without word boundaries.
Added here: a per-sentence cache, so re-running after editing one line only re-synthesises that line.
Script format: paragraphs separated by a blank line; lines starting with '#' are headings and are not read.
"""
import argparse
import asyncio
import hashlib
import json
import os
import random
import re
import shutil
import subprocess
import sys
import wave

import numpy as np

SENT_RE = re.compile(r"(?<=[.!?…])\s+")
TRAIL_BUFFER = 0.08  # keep this much after the last word so its decay is not clipped
ATTEMPTS = 15
ATTEMPT_TIMEOUT = 45.0
BACKOFF, BACKOFF_CAP = 2.0, 8.0
DEFAULT_VOICE = "en-US-GuyNeural"


def clean(text):
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)  # [label](url) -> label
    text = re.sub(r"[*_`]+", "", text)
    return re.sub(r"\s+", " ", text).strip()


def read_script(path):
    """-> list of paragraphs, each a list of sentences."""
    raw = open(path, encoding="utf-8-sig").read().replace("\r\n", "\n")
    paras = []
    for block in re.split(r"\n\s*\n", raw):
        lines = [re.sub(r"^[-*>]\s+", "", l.strip()) for l in block.split("\n") if l.strip() and not l.strip().startswith("#")]
        sents = [s for s in (clean(x) for x in SENT_RE.split(" ".join(lines))) if s]
        if sents:
            paras.append(sents)
    return paras


def ffmpeg():
    exe = shutil.which("ffmpeg")
    if not exe:
        sys.exit("ffmpeg not found (needed to convert the mp3 from edge-tts to wav).")
    return exe


def to_wav(src, dst):
    subprocess.run([ffmpeg(), "-y", "-loglevel", "error", "-i", src, "-ar", "24000", "-ac", "1", "-c:a", "pcm_s16le", dst], check=True)


def read_wav(path):
    with wave.open(path, "rb") as w:
        assert w.getsampwidth() == 2 and w.getnchannels() == 1
        return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16), w.getframerate()


def trailing_silence_trim(samples, rate, last_word_end):
    """Keep audio up to the last spoken word (+buffer); without word data, cut at the last audible sample."""
    if last_word_end is not None:
        return samples[: min(len(samples), int((last_word_end + TRAIL_BUFFER) * rate))]
    loud = np.nonzero(np.abs(samples) > 300)[0]
    return samples[: min(len(samples), int(loud[-1]) + int(0.12 * rate))] if len(loud) else samples


async def synth_once(text, voice, rate, mp3, words_wanted):
    import edge_tts

    kw = {"boundary": "WordBoundary"} if words_wanted else {}
    comm = edge_tts.Communicate(text, voice, rate=rate, **kw)
    last_end = None
    with open(mp3, "wb") as f:
        async for ch in comm.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                last_end = (ch["offset"] + ch["duration"]) / 1e7
    return last_end


async def synth(text, voice, rate, mp3):
    err = None
    for attempt in range(ATTEMPTS):
        try:
            end = await asyncio.wait_for(synth_once(text, voice, rate, mp3, True), ATTEMPT_TIMEOUT)
            if os.path.exists(mp3) and os.path.getsize(mp3) > 0:
                return end
            err = RuntimeError("no audio bytes")
        except Exception as e:  # noqa: BLE001 - the free endpoint fails in several ways; all are retried
            err = e
        if attempt < ATTEMPTS - 1:
            print(f"  retry {attempt + 1}/{ATTEMPTS - 1} ({type(err).__name__})", file=sys.stderr)
            await asyncio.sleep(min(BACKOFF * (attempt + 1), BACKOFF_CAP) + random.uniform(0, 1.5))
    try:  # last resort: word boundaries raise the failure rate on a bad day
        await asyncio.wait_for(synth_once(text, voice, rate, mp3, False), ATTEMPT_TIMEOUT)
        if os.path.exists(mp3) and os.path.getsize(mp3) > 0:
            return None
    except Exception as e:  # noqa: BLE001
        err = e
    sys.exit(f"edge-tts failed for: {text[:60]!r}: {err}")


def sentence_audio(text, voice, rate, cache_dir):
    """-> (int16 samples trimmed to the last word, sample rate), cached by voice+rate+text."""
    key = hashlib.sha1(f"{voice}|{rate}|{text}".encode("utf-8")).hexdigest()[:16]
    wav, meta = os.path.join(cache_dir, key + ".wav"), os.path.join(cache_dir, key + ".json")
    if not (os.path.exists(wav) and os.path.exists(meta)):
        mp3 = os.path.join(cache_dir, key + ".mp3")
        last_end = asyncio.run(synth(text, voice, rate, mp3))
        to_wav(mp3, wav)
        os.remove(mp3)
        json.dump({"last_word_end": last_end}, open(meta, "w"))
    samples, sr = read_wav(wav)
    return trailing_silence_trim(samples, sr, json.load(open(meta))["last_word_end"]), sr


def fmt(sec):
    ms = int(round(sec * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def list_voices(lang):
    import edge_tts

    for v in asyncio.run(edge_tts.list_voices()):
        if v["Locale"].lower().startswith(lang.lower()):
            print(f"{v['ShortName']:<28} {v['Gender']:<7} {v.get('VoiceTag', {}).get('VoicePersonalities', '')}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--script")
    ap.add_argument("--out", help="folder inside public/, e.g. demo-project/public/my-video")
    ap.add_argument("--timeline-out", help="src/<slug> folder: also write timeline.ts/json + voiceover.srt from the real timings")
    ap.add_argument("--voice", default=DEFAULT_VOICE)
    ap.add_argument("--rate", default="+0%", help="edge-tts speaking rate, e.g. -8%% for slower")
    ap.add_argument("--pause", type=float, default=0.35, help="silence between sentences (s)")
    ap.add_argument("--para-pause", type=float, default=0.8, help="silence between paragraphs (s)")
    ap.add_argument("--lead", type=float, default=0.6, help="silence before the first line (s)")
    ap.add_argument("--list-voices", metavar="LANG", help="list voices for a locale prefix (e.g. en) and exit")
    a = ap.parse_args()

    if a.list_voices:
        return list_voices(a.list_voices)
    if not (a.script and a.out):
        ap.error("--script and --out are required")

    paras = read_script(a.script)
    if not paras:
        sys.exit("No text found in the script.")
    os.makedirs(a.out, exist_ok=True)
    cache = os.path.join(a.out, ".voice_cache")
    os.makedirs(cache, exist_ok=True)

    total = sum(len(p) for p in paras)
    chunks, cues, t, rate_hz, n = [], [], a.lead, 24000, 0
    chunks.append(np.zeros(int(a.lead * rate_hz), dtype=np.int16))
    for pi, para in enumerate(paras):
        for si, sent in enumerate(para):
            n += 1
            print(f"[{n}/{total}] {sent[:70]}")
            samples, sr = sentence_audio(sent, a.voice, a.rate, cache)
            assert sr == rate_hz
            dur = len(samples) / sr
            cues.append((t, t + dur, sent))
            chunks.append(samples)
            t += dur
            last = pi == len(paras) - 1 and si == len(para) - 1
            if not last:
                gap = a.para_pause if si == len(para) - 1 else a.pause
                chunks.append(np.zeros(int(gap * sr), dtype=np.int16))
                t += int(gap * sr) / sr

    audio = np.concatenate(chunks)
    wav_path = os.path.join(a.out, "voice.wav")
    with wave.open(wav_path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate_hz)
        w.writeframes(audio.tobytes())
    srt_path = os.path.join(a.out, "voice.srt")
    with open(srt_path, "w", encoding="utf-8") as f:
        f.write("\n".join(f"{i + 1}\n{fmt(s)} --> {fmt(e)}\n{txt}\n" for i, (s, e, txt) in enumerate(cues)))
    secs = len(audio) / rate_hz
    print(json.dumps({"voice": a.voice, "sentences": total, "duration_s": round(secs, 2), "words": sum(len(c[2].split()) for c in cues), "files": [wav_path, srt_path]}, indent=1))

    if a.timeline_out:
        here = os.path.dirname(os.path.abspath(__file__))
        subprocess.run([sys.executable, os.path.join(here, "parse_input.py"), "--srt", srt_path, "--out", a.timeline_out, "--tail", "1.5"], check=True)


if __name__ == "__main__":
    main()
