"""Thu giọng từng câu (vibi, cache theo nội dung) rồi dựng dòng thời gian Part 1 -> JSON cho Remotion.

    python gen_voice_timeline.py            # thu thiếu + dựng timeline
    python gen_voice_timeline.py --chi-tinh # chỉ dựng lại timeline từ audio đã có
"""
import hashlib, json, os, shutil, subprocess, sys
D = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(D, "..", "..", "..", ".."))
sys.path.insert(0, D)
sys.path.insert(0, os.path.join(ROOT, "scripts"))
import kich_ban as K

VOICES = {  # vai: (voice_id, stability, style)
    "n": ("dtSEyYGNJqjrtBArPCVZ", 0.35, 0.4),      # Titan
    "m": ("IJxm2BPzAbIAYPy6kY6Q", 0.45, 0.35),     # Maya: Katie
    "news": ("9ZbFvrGBxO3uSmsw6wdI", 0.6, 0.2),    # Walter
}
SPEAKER = os.path.join(D, "..", "test-75s", "audio", "speaker.mp3")  # Emma, dùng chung một bản ghi
AUD = os.path.join(D, "audio")
PUB = os.path.join(ROOT, "demo-project", "public", "survival-logs", "p1")
OUT_JSON = os.path.join(ROOT, "demo-project", "src", "survival-logs", "p1-data.json")
GAP = {"n": 0.35, "m": 0.45, "news": 0.6}


def dur(path):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]).decode().strip())


def voice_file(role, text):
    h = hashlib.md5(f"{role}|{text}|{VOICES[role]}".encode()).hexdigest()[:10]
    return os.path.join(AUD, f"{role}-{h}.mp3")


def main():
    chi_tinh = "--chi-tinh" in sys.argv
    os.makedirs(AUD, exist_ok=True)
    os.makedirs(PUB, exist_ok=True)
    if not chi_tinh:
        import vibi_tts
        todo = [(ev[0], ev[1]) for ev in K.S if ev[0] in VOICES]
        for i, (role, text) in enumerate(todo, 1):
            p = voice_file(role, text)
            if not os.path.exists(p):
                vid, stab, sty = VOICES[role]
                print(f"[{i}/{len(todo)}] {role}: {text[:50]}", flush=True)
                vibi_tts.tts(vid, text, p, model="eleven_multilingual_v2", stability=stab, style=sty)
    shutil.copy(SPEAKER, os.path.join(PUB, "speaker.mp3"))
    spk = dur(SPEAKER)

    t = 0.0
    lines, shots, sfx, hud, cards, tags, receipts = [], [], [], [], [], [], []
    for ev in K.S:
        k = ev[0]
        if k in VOICES:
            p = voice_file(k, ev[1])
            shutil.copy(p, os.path.join(PUB, os.path.basename(p)))
            d = dur(p)
            lines.append({"role": k, "text": ev[1], "src": os.path.basename(p), "at": round(t, 3), "dur": round(d, 3)})
            t += d + GAP[k]
        elif k == "spk":
            lines.append({"role": "spk", "text": "Welcome to Corner Fresh!", "src": "speaker.mp3", "at": round(t, 3), "dur": round(spk, 3)})
            t += spk + 0.3
        elif k == "spkcut":
            lines.append({"role": "spk", "text": "Wel—", "src": "speaker.mp3", "at": round(t, 3), "dur": 0.38})
            t += 0.6
        elif k == "pause":
            t += ev[1]
        elif k == "shot":
            shots.append({"img": ev[1], "at": round(t, 3)})
        elif k == "sfx":
            sfx.append({"s": ev[1], "at": round(t, 3), "v": ev[2] if len(ev) > 2 else 0.7})
        elif k == "hud":
            hud.append({"key": ev[1], "val": ev[2], "at": round(t, 3)})
        elif k == "card":
            cards.append({"text": ev[1], "at": round(t, 3)})
        elif k == "tag":
            tags.append({"text": ev[1], "at": round(t, 3)})
        elif k == "receipt":
            receipts.append({"at": round(t, 3)})
    total = round(t, 3)
    for i, s in enumerate(shots):
        s["to"] = shots[i + 1]["at"] if i + 1 < len(shots) else total
    data = dict(total=total, lines=lines, shots=shots, sfx=sfx, hud=hud, cards=cards, tags=tags, receipts=receipts)
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    words = sum(len(l["text"].split()) for l in lines if l["role"] != "spk")
    longest = max(shots, key=lambda s: s["to"] - s["at"])
    print(f"tổng {total/60:.2f} phút, {len(lines)} lượt thoại, {words} từ, {len(shots)} cảnh ảnh; "
          f"ảnh dài nhất {longest['img']} {longest['to']-longest['at']:.1f}s")


if __name__ == "__main__":
    main()
