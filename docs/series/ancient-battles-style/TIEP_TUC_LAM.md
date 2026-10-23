# Series trận đánh cổ đại: trạng thái và cách tiếp tục

Cập nhật 2026-10-21. Phong cách tham chiếu: xem PHAN_TICH_VIDEO_THAM_CHIEU.md. Chủ đề: lịch sử/trận đánh cổ đại, giọng tiếng Anh.

## Đã có
- Tập 1 Thermopylae: `content/anc-ep01/script.md` (3.540 từ), `sources.md` (nguồn + phần tự suy ra).
- Giọng đọc 19:37 (en-US-GuyNeural, rate -4%): `demo-project/public/anc-ep01/voice.wav`, timeline `src/anc-ep01/timeline.ts`.
- Bản mở đầu 1:45 (đã render xong): composition `AncPilot1`, `content/anc-pilot1/`.
- Style prefix ảnh: `content/anc-style.txt`. Sprite hành động: `content/anc-pilot1/assets_action.csv` + `scripts/prep_sprites.py`, cảnh trong `src/anc-pilot1/ActionSprites.tsx`.
- Kế hoạch 100 cảnh tập 1: `scripts/anc_plan.py --slug anc-ep01` đọc `content/anc-ep01/plan.py` (sinh `scenes.csv`, `prompts.txt`, `src/anc-ep01/visuals.ts`). 47 ảnh mới, 18 ảnh dùng lại từ pilot, 9 cảnh "same", 5 cảnh hoạt hình sprite, 21 cảnh sơ đồ SVG (`src/anc-ep01/Diagrams.tsx`, D1–D5).
- Composition `AncEp01` (`src/anc-ep01/Video.tsx`), chưa có nhạc (chủ dự án bỏ qua), có phụ đề và tiêu đề chương.

## Việc tiếp theo
1. Chủ dự án gen 47 ảnh theo `content/anc-ep01/scenes.csv` (cột image_prompt không rỗng), lưu `demo-project/public/anc-ep01/images/sceneNN.png`. Hiện là ảnh giữ chỗ.
2. Render: `cd demo-project && npx remotion render AncEp01 out/anc-ep01.mp4 --props='{"music":0,"sfx":0,"voice":"voice.wav","captions":true}'` (35.000 khung, vài chục phút).
3. Không chạy `build_scenes.py` riêng lẻ: dùng `python scripts/anc_plan.py --slug anc-ep01`. Làm tập mới theo TEMPLATE_LAM_TAP_MOI.md (scripts/new_anc_episode.py dựng khung).
4. Sau đó: SFX, nhạc, tập 2 (Cannae gợi ý).

## Cập nhật 2026-10-23
- Tập 1 Thermopylae: ĐÃ RENDER (19:39, `demo-project/out/anc-ep01.mp4`). Tập 2 Cannae: ĐÃ RENDER (17:45, `out/anc-ep02.mp4`; còn lỗi nhỏ: thẻ chữ chồng mũi tên ở sơ đồ E3 stage 1, đã sửa trong mã, chưa render lại).
- Tập 3 Alesia: kịch bản đã hợp nhất bản duyệt (`content/anc-ep03/script.md`, 3.080 từ, 17:00), giọng đọc xong, plan.py xong (83 cảnh: 46 ảnh mới, 27 cảnh sơ đồ F1-F4, 3 cảnh sprite dùng lại sprite tập 2, 7 cảnh lặp ảnh). CHỜ: chủ dự án gen 46 ảnh theo `content/anc-ep03/scenes.csv` (style `content/anc-style-gaul.txt`) và 2 nền `content/anc-ep03/assets_action.csv`, rồi chạy `python -W ignore scripts/prep_sprites.py --slug anc-ep03 --no-placeholders` và render `AncEp03`.
- Thư mục tải lên YouTube: `publish/upload_batch_2026-10-22/` (4 tập kèm file title/mô tả; bị git bỏ qua). Series cổ đại chưa đặt tên.
- Lệnh sinh scenes.csv riêng cho mỗi tập: `python scripts/anc_plan.py --slug <slug> --style-file content/anc-style-<phe>.txt` (anc-style.txt: Hy Lạp/Ba Tư; anc-style-punic.txt: La Mã/Carthage; anc-style-gaul.txt: La Mã/Gaul).

## Âm thanh (2026-10-24)
- Cả 3 tập cổ đại đã render lại CÓ nhạc nền + hiệu ứng (`out/anc-ep01.mp4`, `anc-ep02.mp4`, `anc-ep03.mp4`; tập 2 đã hết lỗi thẻ chữ). Bản đã đưa vào `publish/upload_batch_2026-10-22/`.
- Hiệu ứng: `python scripts/gen_anc_sfx.py` -> `demo-project/public/anc-sfx/sfx/*.wav` (39 file, dùng chung mọi tập). Nhạc: `python scripts/gen_anc_music.py --slug <tập> --intensity <một giá trị 0..1 cho mỗi chương>`. Hai thứ này git bỏ qua, máy mới phải tạo lại.
- Gắn âm thanh: `src/<slug>/sfxrules.json` (quy tắc regex theo câu lời kể + lớp nền theo dải cảnh), kiểm tra bằng `python scripts/check_sfx_rules.py <slug>`; thành phần dùng chung `src/anc-lib/Soundtrack.tsx` và `sfxplan.ts`. Props render: `{"music":0.16,"sfx":1,...}`.
- Chưa nghe bằng tai: độ cân bằng giọng/nhạc/hiệu ứng. Chỉnh bằng `music` và `sfx`.
