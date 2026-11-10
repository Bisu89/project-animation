"""Tạo giọng đọc qua vibi.pro (API giống ElevenLabs).

Key lấy từ .env (VIBI_API_KEY) ở thư mục gốc project, không bao giờ in ra.

    python scripts/vibi_tts.py --voice hpp4J3VqNfWAUOO0d1Us --text "Hello" --out out.mp3
    python scripts/vibi_tts.py --voice ... --text-file cau.txt --out out.mp3 --stability 0.5 --speed 0.95
"""
import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API = "https://api.vibi.pro/v1/text-to-speech/{voice}"


def api_key():
    with open(os.path.join(ROOT, ".env"), encoding="utf-8") as f:
        for line in f:
            if line.startswith("VIBI_API_KEY="):
                key = line.split("=", 1)[1].strip()
                if key:
                    return key
    sys.exit("Chưa có VIBI_API_KEY trong .env")


UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"


def _get(req):
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.read(), r.headers.get("Content-Type", "")
    except urllib.error.HTTPError as e:
        sys.exit(f"vibi lỗi HTTP {e.code}: {e.read()[:500].decode('utf-8', 'replace')}")


def _wait_audio(task_id, timeout_s=600):
    url = f"https://api.vibi.pro/v1/history/{task_id}"
    start = time.time()
    while time.time() - start < timeout_s:
        data, _ = _get(urllib.request.Request(url, headers={"xi-api-key": api_key(), "User-Agent": UA}))
        task = json.loads(data)
        task = task.get("task", task)
        status = task.get("status")
        if status == "completed":
            audio_url = (task.get("result") or {}).get("audio_url")
            if not audio_url:
                sys.exit(f"task {task_id} xong nhưng không có audio_url")
            audio, _ = _get(urllib.request.Request(audio_url, headers={"xi-api-key": api_key(), "User-Agent": UA}))
            return audio
        if status in ("failed", "error", "cancelled"):
            sys.exit(f"task {task_id} lỗi: {task.get('error')} {task.get('detail_error')}")
        time.sleep(3)
    sys.exit(f"task {task_id} chưa xong sau {timeout_s} giây")


def tts(voice, text, out, model="eleven_multilingual_v2", stability=0.5, similarity=0.75, style=0.0, speed=1.0):
    body = {
        "text": text,
        "model_id": model,
        "language_code": "en",
        "voice_settings": {"stability": stability, "similarity_boost": similarity, "style": style, "speed": speed},
    }
    req = urllib.request.Request(API.format(voice=voice), data=json.dumps(body).encode("utf-8"), method="POST",
                                 headers={"xi-api-key": api_key(), "Content-Type": "application/json",
                                          "Accept": "audio/mpeg",
                                          # Cloudflare của vibi chặn User-Agent mặc định của urllib (HTTP 403)
                                          "User-Agent": UA})
    data, ctype = _get(req)
    if not ctype.startswith("audio"):
        # vibi chạy bất đồng bộ: trả {"id", "status": "pending"}, kết quả lấy ở GET /v1/history/{id}
        task_id = json.loads(data)["id"]
        data = _wait_audio(task_id)
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    with open(out, "wb") as f:
        f.write(data)
    return out


def main():
    sys.stdout.reconfigure(encoding="utf-8")  # console Windows mặc định cp1252, in tiếng Việt bị lỗi
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", required=True)
    ap.add_argument("--text")
    ap.add_argument("--text-file")
    ap.add_argument("--out", required=True)
    ap.add_argument("--model", default="eleven_multilingual_v2")
    ap.add_argument("--stability", type=float, default=0.5)
    ap.add_argument("--similarity", type=float, default=0.75)
    ap.add_argument("--style", type=float, default=0.0)
    ap.add_argument("--speed", type=float, default=1.0)
    a = ap.parse_args()
    text = a.text if a.text else open(a.text_file, encoding="utf-8").read().strip()
    tts(a.voice, text, a.out, a.model, a.stability, a.similarity, a.style, a.speed)
    print("đã lưu", a.out)


if __name__ == "__main__":
    main()
