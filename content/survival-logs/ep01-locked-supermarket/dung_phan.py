"""Thu giọng + dựng timeline cho một phần (p2, p3...) từ pN/kich_ban.py -> demo-project/src/survival-logs/pN-data.json.

    python dung_phan.py p2            # thu thiếu + dựng timeline + copy ảnh vào public
    python dung_phan.py p2 --chi-tinh # chỉ dựng lại timeline
"""
import hashlib, importlib.util, json, os, shutil, subprocess, sys
D = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(D, "..", "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "scripts"))

VOICES = {  # vai: (voice_id, stability, style)
    "n": ("dtSEyYGNJqjrtBArPCVZ", 0.35, 0.4),      # Titan
    "m": ("IJxm2BPzAbIAYPy6kY6Q", 0.45, 0.35),     # Maya: Katie
    "news": ("9ZbFvrGBxO3uSmsw6wdI", 0.6, 0.2),    # Walter
    "radio": ("9ZbFvrGBxO3uSmsw6wdI", 0.6, 0.2),   # Walter (bản tin radio)
    "nia": ("Q9tvtUZSrZWvXOcpOOLK", 0.45, 0.3),    # Nia: Jasmine (chốt 2026-11-09)
}
GAP = {"n": 0.35, "m": 0.45, "news": 0.6, "radio": 0.6, "nia": 0.45}
SPEAKER = os.path.join(D, "test-75s", "audio", "speaker.mp3")


def dur(path):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]).decode().strip())


def main():
    part = sys.argv[1]
    chi_tinh = "--chi-tinh" in sys.argv
    spec = importlib.util.spec_from_file_location("kb", os.path.join(D, part, "kich_ban.py"))
    K = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(K)
    aud = os.path.join(D, part, "audio")
    pub = os.path.join(ROOT, "demo-project", "public", "survival-logs", part)
    os.makedirs(aud, exist_ok=True)
    os.makedirs(os.path.join(pub, "img"), exist_ok=True)

    def vfile(role, text):
        h = hashlib.md5(f"{role}|{text}|{VOICES[role]}".encode()).hexdigest()[:10]
        return os.path.join(aud, f"{role}-{h}.mp3")

    if not chi_tinh:
        import vibi_tts
        todo = [ev for ev in K.S if ev[0] in VOICES]
        for i, (role, text) in enumerate(todo, 1):
            p = vfile(role, text)
            if not os.path.exists(p):
                vid, stab, sty = VOICES[role]
                print(f"[{i}/{len(todo)}] {role}: {text[:50]}", flush=True)
                vibi_tts.tts(vid, text, p, model="eleven_multilingual_v2", stability=stab, style=sty)
    shutil.copy(SPEAKER, os.path.join(pub, "speaker.mp3"))
    spk = dur(SPEAKER)

    # ảnh: pN/anh/<id>.png, ảnh dùng lại từ p1/anh, p2/anh (nhắc lại), test-75s/anh
    srcdirs = [os.path.join(D, part, "anh"), os.path.join(D, "p1", "anh"), os.path.join(D, "p2", "anh"), os.path.join(D, "test-75s", "anh")]
    t = 0.0
    lines, shots, sfx, hud, cards, tags, receipts = [], [], [], [], [], [], []
    for ev in K.S:
        k = ev[0]
        if k in VOICES:
            p = vfile(k, ev[1])
            shutil.copy(p, os.path.join(pub, os.path.basename(p)))
            d = dur(p)
            lines.append({"role": k, "text": ev[1], "src": os.path.basename(p), "at": round(t, 3), "dur": round(d, 3)})
            t += d + GAP[k]
        elif k == "spk":
            lines.append({"role": "spk", "text": "Welcome to Corner Fresh!", "src": "speaker.mp3", "at": round(t, 3), "dur": round(spk, 3)})
            t += spk + 0.3
        elif k == "pause":
            t += ev[1]
        elif k == "shot":
            shots.append({"img": ev[1], "at": round(t, 3)})
            if ev[1] != "END":
                for sd in srcdirs:
                    src = os.path.join(sd, ev[1] + ".png")
                    if os.path.exists(src):
                        shutil.copy(src, os.path.join(pub, "img", ev[1] + ".png"))
                        break
                else:
                    print("THIẾU ẢNH", ev[1])
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
    data = dict(total=total, endTitle=K.END_TITLE, endSub=K.END_SUB, lines=lines, shots=shots, sfx=sfx, hud=hud, cards=cards,
                tags=tags, receipts=receipts)
    out = os.path.join(ROOT, "demo-project", "src", "survival-logs", f"{part}-data.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    words = sum(len(l["text"].split()) for l in lines if l["role"] != "spk")
    longest = max(shots, key=lambda s: s["to"] - s["at"])
    print(f"tổng {total/60:.2f} phút, {len(lines)} lượt thoại, {words} từ, {len(shots)} cảnh; "
          f"ảnh dài nhất {longest['img']} {longest['to']-longest['at']:.1f}s")


if __name__ == "__main__":
    main()
