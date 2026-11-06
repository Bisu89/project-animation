# STATUS: Elise Garden long-form EP01

Cập nhật: 2026-11-06.

## Đã có (file thật, đã kiểm)
- Brief: `../ELISE_GARDEN_MASTER.md`.
- Dữ liệu chuẩn trong `../data/`: series, layout, states, Elise, assets, episode, 80 shot, narration, qa_report.
- `tools/garden_ep.py validate` **sạch lỗi**: 80 shot, 21.600 frame = 720,0 s, lời dẫn 107 từ.
- Tài liệu: CREATIVE_BRIEF, GARDEN_MASTER, EP01_REVIEW, PRODUCTION_PLAN, EP01_STORYBOARD (sinh tự động).
- `episodes/EP01/PILOT_8_SHOTS.md`: gói pilot 9 mục cho từng shot, prompt để trong khối copy được (đã sửa theo WORKFLOW CORRECTION 2026-11-06).
- `episodes/EP01/media/gen-anh.csv` (22 ảnh) và `media/muse_queue.csv` (13 clip, manifest cho Codex): sinh từ JSON, **chưa chạy**.
  Hai thư mục `media/anh/` và `media/muse/` hiện đang trống.
- Đã bỏ `muse-chat.json` và các CSV cho `muse_auto`: Muse giờ do người dùng chạy tay.


## Ảnh đã render (2026-11-06)
- Gate B: 13 ảnh tham chiếu trong `references/anh/`. Claude đã xem, tất cả đạt. Chờ chủ dự án xem.
- Pilot: đủ 17 khung + 5 plate trong `episodes/EP01/media/anh/`. Claude đã xem.
  - Gen lại SH018-a (lệch máy so với b) và SH048 a/b/c (luống bị xoay 90°); bản mới đạt.
- **Bước tiếp theo:** người dùng tạo 13 clip trên Muse theo `episodes/EP01/PILOT_8_SHOTS.md` và lưu vào `media/muse/SHxxx_nn.mp4`. Sau đó Codex nhận file và dựng bản thử.


## Mở rộng không gian (2026-11-06)
- Chủ dự án thấy sân 12×12 m hơi nhỏ cho cây ăn trái và DIY, và chọn **giữ sân EP01, thêm lô sau ~20 × 25 m qua cổng rào sau**. Không phải gen lại ảnh nào.
- Dữ liệu: `garden_layout.json → backLot`. Sơ đồ tổng: `references/gl1-R-so-do-tong.png`. Lộ trình: [SERIES_ROADMAP.md](SERIES_ROADMAP.md).

## Chưa có
- **Không có ảnh, clip, giọng đọc hay bản dựng nào** cho bản dài. Toàn bộ 36 asset trong `assets.json` đang `planned`, trừ các ảnh nguồn đã có.
- Ảnh Elise: dùng `gl1-A-elise-garden-truoc.png`, tức ảnh trang phục series Garden đã duyệt. Đã hết bị chặn.
- Prompt chi tiết cho 72 shot ngoài pilot (mới có mô tả, cỡ cảnh, camera, âm thanh).
- Các phần Codex làm: ingest, animatic, ghép cả tập, phụ đề, release.

## Giả định đang dùng (đổi được)
1. Thư mục gốc của brief là `content/elise-garden/long-form/`, không phải gốc repo. Làm vậy để giữ quy ước `content/<dòng>/` và không lẫn với `docs/` chung.
2. Bố cục sân sau kiểu Mỹ (sân 12 × 12 m, nhà ranch, deck, bãi cỏ, khu rau, nhà kho, khung cedar 4×8 ft cao ~14 cm, bố trí hàng gieo) là đề xuất.
3. Ngày 1: cắt cả bãi cỏ, chỉ đào khu rau (R2).
4. Giọng đọc: Jessa qua vibi.pro, cùng giọng Elise của Wild.
5. Muse do người dùng tự chạy. Codex dựng timeline bằng Remotion (chỉ video và chữ đè), theo chỉ đạo ngày 2026-11-06.
6. Bản dài L01 cũ (`l01-first-garden`, góc sân cà chua, 8:30) được brief mới thay thế, nhưng chưa xóa.

## Đổi bối cảnh (2026-11-06)
Chủ dự án yêu cầu: **sân sau nhà kiểu Mỹ, tận dụng không gian**, không phải vườn nông trại hay cottage. Đã cập nhật đủ: layout (sân 12 × 12 m, nhà ranch, deck, rào cedar 1,8 m, bãi cỏ + khu rau, nhà kho), các trạng thái, storyboard, prompt pilot, prompt ảnh mẫu và sơ đồ. ID camera giữ nguyên để Codex không phải sửa. Xem [GARDEN_MASTER.md](GARDEN_MASTER.md).

## Chủ dự án cần quyết định (Gate A)
1. Duyệt bố cục, góc máy và trạng thái trong [GARDEN_MASTER.md](GARDEN_MASTER.md).
2. ~~Trang phục~~: đã chốt dùng bộ series Garden (yếm rằn ri + áo cam).
3. R1–R4 trong [EP01_REVIEW.md](EP01_REVIEW.md): câu lời dẫn 1, phạm vi dọn, phủ vải cho cải thìa, độ dài bữa tối.
4. Duyệt storyboard 80 shot (danh sách nhịp có giây) trong [EP01_STORYBOARD.md](EP01_STORYBOARD.md).
5. Đơn giá GPT ảnh và Muse nếu muốn có ước tính bằng tiền.

**2026-11-06: chủ dự án duyệt Gate A** (bối cảnh, sơ đồ, trang phục) và cho chạy batch 1. Gate B đang chạy:
- Kế hoạch: [REFERENCE_PLAN.md](REFERENCE_PLAN.md), gồm 14 ảnh chia 4 batch.
- Sơ đồ vườn đã vẽ: `references/anh/gl1-R-so-do.png`.
- Prompt nằm trong `data/references.json`; CSV ở `references/gen-anh.csv`.
- Chưa gen ảnh nào.

Sau khi được duyệt, bước tiếp theo là:
1. Gen ảnh Elise, rồi 5 plate pilot, rồi các khung, lưu vào `media/anh/`.
2. Người dùng tạo 13 clip trên Muse, lưu vào `media/muse/SHxxx_nn.mp4`.
3. Codex nhận file và dựng bản thử Remotion khoảng 80,5 s.
