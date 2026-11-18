# EP01 bản nháp: nền video tạm + giọng đọc + piano Suno + phụ đề theo từng cụm.
# Chạy: python scripts/render_tam.py <video_nen> <nhac> [giong]   (giong: phuong mặc định, giang...)
import json, os, re, subprocess, sys
EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GIONG = sys.argv[3] if len(sys.argv) > 3 else "phuong"
VOICE = os.path.join(EP, "audio", f"giong-{GIONG}.mp3")
SCRIPT = open(os.path.join(EP, "audio", "loi.txt"), encoding="utf-8").read().strip()
WORDS_JSON = os.path.join(EP, "audio", "tu-giay.json" if GIONG == "phuong" else f"tu-giay-{GIONG}.json")
BG, MUSIC = sys.argv[1], sys.argv[2]
OUT = os.path.join(EP, "renders", "ep01-nen-tam.mp4" if GIONG == "phuong" else f"ep01-nen-tam-{GIONG}.mp4")
LEAD, TAIL = 0.5, 3.0          # giọng vào sau 0,5 s; nhạc kéo 3 s sau câu cuối
MUSIC_DB = -15.4               # chủ dự án 2026-11-18: nhạc nhỏ dần -7.4 → -10.4 → "xuống 5" → -15.4

# 1) mốc giây từng chữ (whisper, lưu cache)
if not os.path.exists(WORDS_JSON):
    import whisper
    r = whisper.load_model("medium").transcribe(VOICE, language="vi", fp16=False, word_timestamps=True)
    ws = [{"w": w["word"].strip(), "s": w["start"], "e": w["end"]} for seg in r["segments"] for w in seg["words"]]
    json.dump(ws, open(WORDS_JSON, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
ws = json.load(open(WORDS_JSON, encoding="utf-8"))

# 2) ghép chữ của lời gốc với mốc whisper (theo thứ tự; số chữ phải bằng nhau)
toks = SCRIPT.replace("“", '"').split()
assert len(toks) == len(ws), f"so chu lech: loi {len(toks)} / whisper {len(ws)}"
voice_dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", VOICE]))
total = LEAD + voice_dur + TAIL

# 3) chia cụm: ngắt ở dấu câu, tối đa 6 chữ
chunks, cur = [], []
for t, w in zip(toks, ws):
    cur.append((t, w))
    if re.search(r'[,.:;!?]"?$', t) or len(cur) >= 9:
        chunks.append(cur); cur = []
if cur: chunks.append(cur)
last_sentence = "Vì sự kiên nhẫn nào cũng có ngày cạn."

def ts(x):
    x = max(0, x); h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60
    return f"{h}:{m:02d}:{s:05.2f}"

ass = ["[Script Info]", "ScriptType: v4.00+", "PlayResX: 1080", "PlayResY: 1920", "WrapStyle: 0", "",
       "[V4+ Styles]",
       "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
       # BorderStyle 3 = hộp nền mờ sau chữ (đọc được trên nền nước sáng)
       "Style: Sub,Segoe UI,74,&H00FFFFFF,&H00FFFFFF,&H8C000000,&H00000000,1,0,0,0,100,100,0,0,3,16,0,2,110,110,520,1",
       "Style: Chot,Segoe UI,92,&H00FFFFFF,&H00FFFFFF,&H78000000,&H00000000,1,0,0,0,100,100,0,0,3,24,0,5,110,110,0,1",
       "", "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"]
# câu cuối: hiện to giữa màn hình, tách riêng
end_idx = len(toks) - len(last_sentence.split())
start_of = {}
k = 0
for i, ch in enumerate(chunks):
    start_of[i] = k; k += len(ch)
for i, ch in enumerate(chunks):
    if start_of[i] >= end_idx: continue
    s = LEAD + ch[0][1]["s"] - 0.05
    nxt = chunks[i + 1][0][1]["s"] if i + 1 < len(chunks) else ch[-1][1]["e"] + 0.4
    e = LEAD + min(nxt, ch[-1][1]["e"] + 0.6)
    text = " ".join(t for t, _ in ch)
    ass.append(f"Dialogue: 0,{ts(s)},{ts(e)},Sub,,0,0,0,,{{\\fad(120,120)}}{text}")
s_last = LEAD + ws[end_idx]["s"] - 0.1
ass.append(f"Dialogue: 0,{ts(s_last)},{ts(total)},Chot,,0,0,0,,{{\\fad(400,600)}}Vì sự kiên nhẫn\\Nnào cũng có ngày cạn.")
ass_path = os.path.join(EP, "renders", "ep01-tam.ass")
open(ass_path, "w", encoding="utf-8-sig").write("\n".join(ass) + "\n")

# 4) nền: lặp clip 8 s bằng crossfade 1 s, cắt dọc 9:16, chỉnh màu ấm + tối góc
bg_dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", BG]))
n = 1
while bg_dur + (n - 1) * (bg_dur - 1) < total: n += 1
fc, prev = [], "[0:v]"
for i in range(1, n):
    off = i * (bg_dur - 1)
    fc.append(f"{prev}[{i}:v]xfade=transition=fade:duration=1:offset={off:.3f}[x{i}]"); prev = f"[x{i}]"
ass_ff = ass_path.replace("\\", "/").replace(":", "\:")
fc.append(f"{prev}crop=608:1080:656:0,scale=1080:1920:flags=lanczos,eq=saturation=0.92:gamma=0.97,"
          f"colorbalance=rs=0.04:bs=-0.04:rm=0.02,vignette=PI/5,"
          f"fade=t=in:d=0.6,fade=t=out:st={total-1.2:.2f}:d=1.2,subtitles='{ass_ff}',trim=0:{total:.3f},setpts=PTS-STARTPTS[v]")
na = n
fc.append(f"[{na}:a]adelay={int(LEAD*1000)}|{int(LEAD*1000)},apad=pad_dur={TAIL}[vo]")
fc.append(f"[{na+1}:a]atrim=0:{total:.3f},volume={MUSIC_DB}dB,afade=t=in:d=0.8,afade=t=out:st={total-2.5:.2f}:d=2.5[mu]")
fc.append("[vo][mu]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]")
cmd = ["ffmpeg", "-v", "error", "-y"]
for _ in range(n): cmd += ["-i", BG]
cmd += ["-i", VOICE, "-i", MUSIC, "-filter_complex", ";".join(fc), "-map", "[v]", "-map", "[a]",
        "-t", f"{total:.3f}", "-r", "24", "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", OUT]
subprocess.run(cmd, check=True)
print(f"xong {OUT}  {total:.1f}s, {n} lan lap nen, {len(chunks)} cum phu de")
