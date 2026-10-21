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
