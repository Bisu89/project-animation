# EP01: kế hoạch triển khai

2026-11-06. Nội dung tập (80 shot, 720 s) và bối cảnh đã được duyệt (Gate A). 30 ảnh tham chiếu và khung pilot đã có.
Phân vai không đổi:
- **Claude** viết prompt, gen ảnh khung qua `gpt_anh.py` (Codex) và xem ảnh.
- **Người dùng** tạo clip trên Muse.
- **Codex** nhận clip, dựng Remotion, làm âm thanh và render.

## Khối lượng

| SQ | Nội dung | Shot | Giây | Clip Muse | Ngày | Đã có |
|---|---|---:|---:|---:|---|---|
| SQ01 | Cold open | 8 | 35 | 8 | 1–3 | — |
| SQ02 | Xem xét, đo, phác | 8 | 65 | 10 | 1 | SH009 (pilot) |
| SQ03 | Dọn cỏ, cắt cỏ, căng dây | 9 | 95 | 18 | 1 | SH018, SH024 |
| SQ04 | Cưa, ráp khung | 10 | 90 | 16 | 2 | SH030 |
| SQ05 | Đặt, cân khung | 8 | 80 | 15 | 2 | SH040 |
| SQ06 | Đất + phân ủ | 7 | 85 | 14 | 2 | SH048 |
| SQ07 | Gieo, cắm nhãn | 10 | 90 | 18 | 2 | SH052 |
| SQ08 | Tưới, dọn, trước/sau | 7 | 85 | 17 | 2 | — |
| SQ09 | Bữa tối trong bếp | 8 | 55 | 8 | 2 | — |
| SQ10 | Sáng hôm sau | 5 | 40 | 5 | 3 | SH079 |
| **Tổng** | | **80** | **720** | **134** | | 13 clip pilot |

Dự phòng làm lại 30% thì khoảng **175 lượt Muse** và khoảng **230 ảnh khung**.
Muse chạy tay mất khoảng 3–5 phút mỗi lượt (tải ảnh, dán prompt, chờ, tải về, đặt tên), tức **khoảng 10–15 giờ thao tác** chia cho các đợt.

## Các đợt

| Đợt | Phạm vi | Clip | Ảnh nền mới cần gen | Duyệt cuối đợt |
|---|---|---:|---|---|
| **0, pilot** | 8 shot pilot | 13 | — (đã có) | **Gate C**: Muse xử lý khung 16:9 ổn không, mặt Elise, nối clip, bản dựng thử ~80 s |
| **1, ngày 1** | SQ02 + SQ03 (trừ shot pilot) | 23 | B-S0, C-S0, D-S0, C-S1, A-S0b (sân dọn được một nửa) | Xem bản dựng SQ02–03 |
| **2, dựng khung** | SQ04 + SQ05 | 28 | B-S1 (sân bê tông có ngựa gỗ), D-S1, C-S2, B-S2 | Xem SQ04–05 |
| **3, đất và gieo** | SQ06 + SQ07 | 28 | A-S3, C-S4 | Xem SQ06–07 |
| **4, phần thưởng** | SQ08 + SQ10 | 18 | A-S5, B-S4, B-S5, D-S4 | Xem SQ08 + SQ10 |
| **5, bếp** | SQ09 | 16 | Bếp tối (vẫn còn sáng ngoài cửa sổ), chạng vạng ngoài trời | Xem SQ09 |
| **6, cold open** | SQ01 (làm sau cùng, take riêng của cảnh đẹp nhất) | 8 | dùng lại ảnh nền đã có | Xem toàn tập |
| **7, hoàn thiện** | Lời dẫn (8 câu, giọng Jessa), Foley, nhạc có quyền, chữ đè, render 1920×1080 | — | — | **Gate D/E** |

## Mỗi đợt chạy theo 8 bước
1. **Claude** viết prompt ảnh và Muse cho từng shot vào `shots.json` theo khuôn pilot: khung đầu/cuối, mỗi clip dùng ≤ 8,5 s, câu khóa vật thể, câu khóa trang phục. Sau đó chạy `validate`, `views`, `csv`.
2. **Claude** gen ảnh nền mới (lùi ngược từ ảnh đã có), rồi gen khung bằng `gpt_anh.py`.
3. **Claude** ghép lưới và xem: máy có giữ không, hướng luống, trang phục, đạo cụ của bước sau có xuất hiện sớm không. Ảnh hỏng thì gen lại trước khi giao.
4. **Claude** báo "đợt N sẵn sàng". Danh sách clip nằm trong `PILOT_8_SHOTS.md` (đổi thành `SQxx_PACKAGE.md`) và `muse_queue.csv`.
5. **Người dùng** tạo clip trên Muse, lưu `media/muse/SHxxx_nn.mp4`. Khung nào đạt thì tạo clip luôn.
6. **Claude/GPT** xem clip:
   - lưới 2 khung/giây;
   - lỗi vật tự hiện, mặt, tay;
   - chọn đoạn sạch.

   Clip trượt thì đưa câu FIX cho người dùng chạy lại.
7. **Codex** nhận file, báo file thiếu hoặc sai thời lượng, dựng bản xem của đợt bằng Remotion: chữ đè, chưa có lời.
8. **Chủ dự án** xem bản đợt. Đạt thì sang đợt sau; sửa nhỏ thì làm luôn.

Trong lúc người dùng chạy Muse đợt N, Claude viết prompt và gen ảnh cho đợt N+1, để không ai phải chờ ai.

## Việc của Codex cần sẵn trước đợt 1
- Intake `media/muse/`, đối chiếu `muse_queue.csv`, đọc thời lượng và khung hình, báo thiếu.
- Timeline Remotion đọc `shots.json` và `editRules`:
  - bỏ đoạn đứng hình đầu clip;
  - hòa `mo`/`mo_dai` nằm trong slot đã cấp;
  - chữ đè lấy từ `episode.json`.
- Mở rộng `garden_ep.py csv --seq SQ02` (hiện chỉ xuất pilot). Claude có thể làm phần này nếu Codex bận.

## Quyết định còn mở (ảnh hưởng nội dung)

| Mã | Câu hỏi | Mặc định nếu không trả lời |
|---|---|---|
| R1 | Đổi câu lời dẫn đầu thành “This backyard had been forgotten for years.” | Đổi |
| R3 | Thêm cảnh phủ vải che cho cải thìa (đúng khuyến cáo RHS) | Không thêm |
| R4 | Rút bữa tối 75 s → 55 s, chuyển 20 s sang SQ08 | **Đã duyệt, đã áp dụng** |
| R5 | Cảnh kết: Elise liếc về cổng sau (móc sang EP02) | Thêm |
| — | Key vibi.pro cho lời dẫn đã có trong `.env` chưa | Chưa có thì giao bản câm (không lồng giọng tạm) |
| — | Nguồn nhạc có quyền sử dụng | Codex đề xuất |

## Rủi ro chính
1. **Muse với khung ngang 16:9.** Các series khác chủ yếu chạy dọc. Đợt 0 sẽ trả lời câu này.
2. **Cảnh rộng có người đi lại** (SH009, SH076…). Muse hay kéo máy vào cận mặt. Đã ghi "fixed camera, no zoom" trong prompt; nếu vẫn bị thì cắt.
3. **Khối lượng chạy tay** khoảng 175 lượt Muse. Đợt nào cũng ưu tiên cắt hơn gen lại.
4. **Bếp** là bối cảnh mới. Cảnh chạng vạng phải tránh lỗi ám cam.
