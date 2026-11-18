# Podcast súp gà độc EP01: nền video tạm + giọng đọc + piano Suno + phụ đề theo từng cụm.
# Chạy: python scripts/render_tam.py <video_nen> <nhac> [giong]   (giong: phuong mặc định, giang...)
import json, os, re, subprocess, sys
EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GIONG = sys.argv[3] if len(sys.argv) > 3 else "giang"
VOICE = os.path.join(EP, "audio", f"giong-{GIONG}.mp3")
SCRIPT = open(os.path.join(EP, "audio", "loi.txt"), encoding="utf-8").read().strip()
WORDS_JSON = os.path.join(EP, "audio", f"tu-giay-{GIONG}.json")
BG, MUSIC = sys.argv[1], sys.argv[2]
NEN = sys.argv[4] if len(sys.argv) > 4 else ""   # nhãn nền để không ghi đè bản khác, vd "img8711"
TEXT_Y = int(sys.argv[5]) if len(sys.argv) > 5 else 1130   # mép trên khối chữ (px trên khung 1920); đặt vào vùng nền trống
TITLE = sys.argv[6] if len(sys.argv) > 6 else ""           # tiêu đề cute 2 dòng, ngăn bằng "|", vd "Chữa nành|cùng Báo"
OUT = os.path.join(EP, "renders", f"podcast-ep01-{GIONG}" + (f"-{NEN}" if NEN else "") + ".mp4")
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
if len(toks) != len(ws):
    # ghép theo nội dung (difflib); chữ whisper nghe sót thì nội suy thời gian từ chữ kề bên
    import difflib
    norm = lambda x: re.sub(r"[^\w]", "", x.lower())
    sm = difflib.SequenceMatcher(None, [norm(t) for t in toks], [norm(w["w"]) for w in ws], autojunk=False)
    m = [None] * len(toks)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n): m[a + k] = ws[b + k]
    known = [i for i, x in enumerate(m) if x]
    out = []
    for i, x in enumerate(m):
        if x: out.append(x); continue
        p = max([j for j in known if j < i], default=None); q = min([j for j in known if j > i], default=None)
        s = m[p]["e"] if p is not None else 0.0
        e = m[q]["s"] if q is not None else s + 0.3
        out.append({"w": toks[i], "s": s, "e": max(e, s + 0.05)})
    print(f"ghep lech: loi {len(toks)} / whisper {len(ws)}, noi suy {len(toks) - len(known)} chu")
    ws = out
voice_dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", VOICE]))
total = LEAD + voice_dur + TAIL

# 3) phụ đề kiểu "gõ chữ" (theo reel mẫu moi-quan-he-gi-cung-vay-het-a, 2026-11-18):
#    font Quicksand bo tròn, chữ trắng nhỏ + bóng mờ, giữa màn hình hơi thấp, mỗi lần 1 câu,
#    từng ký tự hiện dần khớp giọng, câu giữ nguyên tới câu sau, cuối câu "..".
FONT_DIR = os.path.join(os.path.dirname(EP), "fonts")
MAXC = 64                          # câu dài hơn thì ngắt ở dấu phẩy gần giữa
units, cur = [], []
for t, w in zip(toks, ws):
    cur.append((t, w))
    if re.search(r'[.!?]"?$', t):
        units.append(cur); cur = []
if cur: units.append(cur)
def tach(u):
    txt = " ".join(t for t, _ in u)
    if len(txt) <= MAXC: return [u]
    cands = [i for i, (t, _) in enumerate(u[:-1]) if t.endswith(",")]
    if not cands: return [u]
    mid = min(cands, key=lambda i: abs(len(" ".join(t for t, _ in u[:i + 1])) - len(txt) / 2))
    return tach(u[:mid + 1]) + tach(u[mid + 1:])
units = [p for u in units for p in tach(u)]

def ts(x):
    x = max(0, x); h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60
    return f"{h}:{m:02d}:{s:05.2f}"

ass = ["[Script Info]", "ScriptType: v4.00+", "PlayResX: 1080", "PlayResY: 1920", "WrapStyle: 0", "",
       "[V4+ Styles]",
       "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
       f"Style: Go,Quicksand Light,75,&H00FFFFFF,&H00FFFFFF,&H70000000,&H80000000,0,0,0,0,100,100,1,0,1,2.4,3,8,110,110,{TEXT_Y},1",
       "", "[Events]", "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text"]
FADE = 160                         # ms để 1 ký tự mờ -> rõ
for i, u in enumerate(units):
    s = LEAD + u[0][1]["s"] - 0.05
    nxt = LEAD + units[i + 1][0][1]["s"] - 0.08 if i + 1 < len(units) else total - 0.3
    e = min(nxt, LEAD + u[-1][1]["e"] + 1.6)
    parts = []
    for j, (t, w) in enumerate(u):
        if j == len(u) - 1 and t[-1:] in ".,": t = t[:-1] + ".."
        word = t + (" " if j < len(u) - 1 else "")
        ws0, ws1 = LEAD + w["s"] - s, LEAD + w["e"] - s
        for c, ch in enumerate(word):
            t0 = int(1000 * (ws0 + (ws1 - ws0) * c / max(1, len(word))))
            ch = ch.replace("{", "(").replace("}", ")")
            parts.append(f"{{\\alpha&HFF&\\t({t0},{t0 + FADE},\\alpha&H00&)}}{ch}")
    ass.append(f"Dialogue: 0,{ts(s)},{ts(e)},Go,,0,0,0,,{{\\blur2\\fad(0,180)}}" + "".join(parts))
if TITLE:
    # Tiêu đề cute: Baloo 2 ExtraBold, nảy vào lúc đầu rồi lắc lư nhẹ suốt video.
    # Dòng 1 trắng viền xanh dương, dòng 2 vàng viền hồng (màu ASS là &HAABBGGRR).
    ass.insert(ass.index("[Events]") - 1,
               "Style: Tit1,Baloo 2,145,&H00FFFFFF,&H00FFFFFF,&H00C8641E,&H96000000,0,0,0,0,100,100,0,0,1,11,7,5,0,0,0,1")
    ass.insert(ass.index("[Events]") - 1,
               "Style: Tit2,Baloo 2,115,&H003CD6FF,&H00FFFFFF,&H008C50F0,&H96000000,0,0,0,0,100,100,0,0,1,10,6,5,0,0,0,1")
    dong = TITLE.split("|")
    for k, (txt, st, x, y, goc, tre) in enumerate([(dong[0], "Tit1", 400, 135, -4, 0),      # so le: dòng 1 lệch trái, sát mép trên
                                                   (dong[-1], "Tit2", 700, 268, 3, 280)][:len(dong)]):   # dòng 2 lệch phải
        lac = "".join(f"\\t({t0},{t0 + 1400},\\frz{goc + (2.5 if j % 2 == 0 else 0)})"
                      for j, t0 in enumerate(range(900 + tre, int(total * 1000) - 1500, 1400)))
        nay = (f"\\fscx0\\fscy0\\t({tre},{tre + 260},\\fscx118\\fscy118)"
               f"\\t({tre + 260},{tre + 420},\\fscx100\\fscy100)")
        ass.append(f"Dialogue: 1,{ts(0)},{ts(total)},{st},,0,0,0,,"
                   f"{{\\an5\\pos({x},{y})\\frz{goc}{nay}{lac}\\fad(0,700)}}{txt}")
ass_path = os.path.join(EP, "renders", f"podcast-ep01-{GIONG}.ass")
open(ass_path, "w", encoding="utf-8-sig").write("\n".join(ass) + "\n")
chunks = units

# 4) nền: lặp clip 8 s bằng crossfade 1 s, cắt dọc 9:16, chỉnh màu ấm + tối góc
bg_dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", BG]))
n = 1
while bg_dur + (n - 1) * (bg_dur - 1) < total: n += 1
src_fps = subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", BG]).decode().strip()
_num, _den = (re.findall(r"\d+/\d+", src_fps) or ["24/1"])[0].split("/")
FPS = 30 if int(_num) / int(_den) >= 50 else 24         # nguồn 60 fps -> 30 (chia hết, không giật); còn lại 24
fc = [f"[{i}:v]fps={FPS},setsar=1,format=yuv420p[b{i}]" for i in range(n)]
prev = "[b0]"
for i in range(1, n):
    off = i * (bg_dur - 1)
    fc.append(f"{prev}[b{i}]xfade=transition=fade:duration=1:offset={off:.3f}[x{i}]"); prev = f"[x{i}]"
ass_ff = ass_path.replace("\\", "/").replace(":", "\\:")
# cắt về 9:16 cho mọi nguồn (ngang hay dọc; ffmpeg đã tự xoay theo metadata)
fc.append(f"{prev}crop='min(iw,ih*9/16)':'min(ih,iw*16/9)',scale=1080:1920:flags=lanczos,eq=saturation=0.92:gamma=0.97,"
          f"colorbalance=rs=0.04:bs=-0.04:rm=0.02,vignette=PI/5,"
          f"fade=t=in:d=0.6,fade=t=out:st={total-1.2:.2f}:d=1.2,subtitles='{ass_ff}':fontsdir='{FONT_DIR.replace(chr(92), "/").replace(":", chr(92) + ":")}',trim=0:{total:.3f},setpts=PTS-STARTPTS[v]")
na = n
fc.append(f"[{na}:a]adelay={int(LEAD*1000)}|{int(LEAD*1000)},apad=pad_dur={TAIL}[vo]")
fc.append(f"[{na+1}:a]atrim=0:{total:.3f},volume={MUSIC_DB}dB,afade=t=in:d=0.8,afade=t=out:st={total-2.5:.2f}:d=2.5[mu]")
fc.append("[vo][mu]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]")
cmd = ["ffmpeg", "-v", "error", "-y"]
for _ in range(n): cmd += ["-i", BG]
cmd += ["-i", VOICE, "-i", MUSIC, "-filter_complex", ";".join(fc), "-map", "[v]", "-map", "[a]",
        "-t", f"{total:.3f}", "-r", str(FPS), "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", OUT]
subprocess.run(cmd, check=True)
print(f"xong {OUT}  {total:.1f}s, {n} lan lap nen, {len(chunks)} cum phu de")
