# Lệnh chạy (từ `$REPO` = project-animation)

```powershell
$E = "content\survival-logs\ep01-locked-supermarket"
# ảnh: Part 1 sinh CSV từ p1/kich_ban.py; Part 2/3 từ anh_p23.py
python "$E\p1\tao_csv_anh.py"; python "$E\anh_p23.py" p2
python "C:\Users\HoaVan\Desktop\tool AI\muse-auto\gpt_anh.py" --csv "$E\p2\gen-anh.csv"      # bỏ qua ảnh đã có; --only N --force
# âm thanh tổng hợp (thêm hàm mới trong scripts/gen_survival_sfx.py khi kịch bản cần)
python scripts\gen_survival_sfx.py --out demo-project\public\survival-logs
# thu giọng + timeline + copy ảnh vào public (Part 1 dùng p1/gen_voice_timeline.py)
python "$E\dung_phan.py" p2            # --chi-tinh: chỉ dựng lại timeline
# render (chạy từ demo-project; > 10 phút thì chạy nền)
cd demo-project; npx tsc --noEmit
npx remotion render SurvivalEp01P2 out/survival-ep01-p2.mp4 --concurrency=6
npx remotion render SurvivalShort2 out/survival-ep01-short2-312am.mp4
# thumbnail
python "$E\tao_thumbnail.py" p2        # CFG trong file; thêm khóa p2b, p2c... cho phương án
python "$E\tao_thumb_short.py" s2      # fx = điểm nhấn ngang, down = đẩy ảnh xuống dưới chữ
```

Composition: `SurvivalEp01P1` (P1.tsx), `SurvivalEp01P2` (P2.tsx → Part.tsx), `SurvivalShortP1`, `SurvivalShort2`..`SurvivalShort5`
(ShortClip.tsx, cấu hình `SHORTS`). Part mới: tạo `PN.tsx` như P2.tsx + đăng ký trong `Root.tsx`.

Codex (review/QA): `codex.exe exec --skip-git-repo-check --ephemeral -m gpt-6.1-sol -c model_reasoning_effort="medium" -s read-only
-C <repo> [-i ảnh] -o out.txt < đề.txt` (exe trong `%USERPROFILE%\.vscode\extensions\openai.chatgpt-*\bin\windows-x86_64\`). Chạy nền.
Contact sheet QA: `ffmpeg -i x.mp4 -vf "fps=1/6,scale=480:-1,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='%{pts\:hms}':...,tile=6x5"`.
