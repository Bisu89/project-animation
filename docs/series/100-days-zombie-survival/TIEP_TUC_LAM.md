# TIẾP TỤC LÀM — đọc file này đầu tiên khi mở phiên mới (cập nhật 2026-10-19)

Repo: `C:\Users\hoavx\Desktop\stickman-video`, nhánh `main`, remote `project-animation` (`https://github.com/Bisu89/project-animation.git`). **Chưa commit** các thay đổi ngày 19/10 (kịch bản mới, hiệu ứng, âm thanh) — hỏi bạn trước khi commit.
Chi tiết kỹ thuật: `HANDOFF.md` (mục 0, tiếng Anh). Bản tiếng Việt tóm tắt cả series: `TOM_TAT_TIENG_VIET.md` (cùng thư mục).

## Quy tắc làm việc bạn đã đặt
1. **Viết truyện trước → bạn duyệt → rồi mới làm video.**
2. Trả lời bằng tiếng Việt; lời bình và chữ trong video là tiếng Anh.
3. Video (`*.mp4`) không push lên git. Nhạc/âm thanh/ảnh sinh tự động cũng không (đã nằm trong `.gitignore`).
4. Kiểu video: ảnh AI + zoom/trượt mượt + giọng đọc + phụ đề + hiệu ứng "ảnh sống" (đèn chập chờn, nhịp tim, rung cửa, thẻ giao diện...). Không làm hoạt hình que đầy đủ.
5. Nhân vật học kỹ năng **từng ngày**; quy tắc 1 (tiếng động hút chúng) ở Tập 1, quy tắc 2 ở Tập 2, quy tắc 3 ở Tập 3.
6. Nhân vật không giới tính cụ thể, không có người thân (bạn đã bỏ tuyến "em gái" vì series là sinh tồn một mình).

## Hiện trạng Tập 1 (2026-10-19)
| Hạng mục | Trạng thái |
|---|---|
| Kịch bản | **Bản mới của bạn** đã áp dụng: `content/zs-ep01/script.md` (đọc, tiếng Anh) + `script.vi.md`. Đã bỏ "em gái", bỏ câu "khoảng hai giờ" tới cầu. 2105 từ ≈ 12,2 phút. |
| Giọng đọc + timeline | Đã tạo lại từ kịch bản mới (en-US-GuyNeural, rate -2%, nghỉ đoạn 0,55 s). 230 câu, 733 s. |
| Chia cảnh | **48 ảnh** (`content/zs-ep01/scenes.csv`, `demo-project/src/zs-ep01/scenes.ts`), mỗi ảnh ~14,7 s. Prompt + hiệu ứng từng cảnh nằm ở `content/zs-ep01/prompts.txt`. |
| Ảnh | **Bạn cần tạo 48 ảnh mới** theo cột `image_prompt` của `scenes.csv`, lưu thành `demo-project/public/zs-ep01/images/scene01.png … scene48.png` (hiện là ảnh giữ chỗ). Ảnh cũ (36 ảnh bản trước) được cất ở `content/zs-ep01/old_v1/`. |
| Âm thanh | 27 SFX + nền (còi cảnh báo, báo động xe, chuông cháy, nhịp tim, cửa bị đẩy/rung, tiếng cào, kính vỡ xa, chai lăn...) và nhạc nền "dread" — đã tạo. SFX gắn vào **câu lời bình** qua `demo-project/src/zs-ep01/sfxrules.json`. |
| Render | Chưa render bản đầy đủ mới. Bản cũ `out/zs-ep01.mp4` đã lỗi thời. |

## Hiệu ứng "ảnh sống" đã làm (file `demo-project/src/zs-ep01/Fx.tsx`, token viết trong `prompts.txt` trước dấu `|`)
- Đèn: `lamp` (đèn đường/trần chập chờn, `fail` = chập chờn rồi tắt hẳn), `glow` (đèn màu: nhấp nháy xi-nhan, nhịp đập), `screen` (màn hình điện thoại sáng nhịp nhàng).
- Ảnh "thở": `breath` (ngực phập phồng), `sway` (rèm/tóc đung đưa) — chỉ vùng nhỏ, biên độ nhẹ.
- **Nhép miệng** `talk` — miệng mở theo độ to của giọng đọc, chỉ dùng cho 2 câu thoại của nhân vật (cảnh 24 "Is anyone home?", cảnh 27 "Sorry… I just need—"). Cần ảnh cận/trung cảnh nhìn rõ miệng + tọa độ chính xác.
- Cả khung: `torch` (phòng tối chỉ sáng bởi chùm đèn pin lắc lư), `heart:bpm` (viền đỏ đập + tiếng tim), `alarm` (đèn đỏ khẩn cấp), `fog` (sương/khói trôi), `dust`, `wind`, `rain`, `flicker`, `hand` (rung tay cầm máy).
- Rung máy theo sự kiện: cửa bị đẩy, va đập, vật đổ (cột `shake` trong `sfxrules.json`).
- Thẻ giao diện chữ thật (AI không viết được chữ): `card:alert` (cảnh báo khẩn cấp), `card:chat` (nhóm chat cư dân), `card:evac` (tin nhắn sơ tán), `card:nosignal`.
- Bảng giờ đầu mỗi chương: "DAY 1 · THE TRAP 07:50"... (bảng `HUD` trong `Fx.tsx`).

## Việc kế tiếp
1. Bạn tạo 48 ảnh (hoặc 10 ảnh đầu để thử trước — xem lệnh render một đoạn bên dưới).
2. Khi có ảnh, báo tôi: tôi xem từng ảnh, **chỉnh tọa độ hiệu ứng** (đèn, miệng, vùng thở...) trong `prompts.txt` rồi chạy lại `build_scenes.py` (không phải tạo lại giọng), render thử đoạn ngắn kiểm tra bằng `--props='{"debug":true}'` (vẽ khung vùng hiệu ứng).
3. Duyệt nhịp, rồi render bản đầy đủ.
4. Sau đó Tập 2 (viết → duyệt → làm).

## Lệnh hay dùng (chạy trong `C:\Users\hoavx\Desktop\stickman-video`)
- Giọng đọc: `python scripts/gen_voice.py --script content/zs-ep01/script.md --out demo-project/public/zs-ep01 --timeline-out demo-project/src/zs-ep01 --rate=-2% --para-pause 0.55` rồi `python scripts/voice_env.py --slug zs-ep01` (độ to giọng cho nhép miệng).
- Chia ảnh: `python scripts/build_scenes.py --slug zs-ep01 --target 15`; ảnh giữ chỗ: `python scripts/make_placeholders.py --slug zs-ep01`.
- Âm thanh: `python scripts/gen_zs_sfx.py --out demo-project/public/zs-ep01`; nhạc: `python scripts/gen_zs_music.py --slug zs-ep01`; kiểm tra luật SFX: `python scripts/check_sfx_rules.py zs-ep01`.
- Render một đoạn (đỡ mệt máy): `cd demo-project && npx remotion render ZsEp01 out/zs-ep01-preview.mp4 --frames=0-3400` (10 cảnh đầu ≈ 0–3400).
- Render đầy đủ: `npx remotion render ZsEp01 out/zs-ep01.mp4`. Kiểm tra kiểu trước: `npx tsc --noEmit`.
- Ảnh tĩnh kiểm tra hiệu ứng: `npx remotion still ZsEp01 out/x.png --frame=330 --props='{"debug":true}'`.

## Lưu ý kỹ thuật
- Viết file Python bằng công cụ Write rồi chạy, đừng dùng heredoc dài có tiếng Việt (lỗi mã hóa trên Windows).
- Phiên âm tự động: `faster-whisper` bị crash máy này; dùng `openai-whisper` (đã cài) qua script riêng, không dùng `scripts/transcribe_voice.py` (nó thử faster-whisper trước).
- Thư mục `checkvideo/` (2 video tham khảo của kênh Wild Instinct + transcript) nằm trong `.gitignore`.
