# Elise DIY tập 14: bình lưới dây thừng đan nổi

Ảnh sản phẩm chủ dự án gửi: `anh/dt-ref-san-pham.png` (2026-11-05, ảnh có nhãn "8. Dây thừng đan nổi" và ô phóng to, bỏ qua).
Tiền tố file: `dt-`. **Chủ dự án cho tự làm đến video, không cần duyệt từng bước** (riêng tập này).

## Sản phẩm
- Bình thân phình, cổ thắt, miệng hơi loe, cao khoảng 25 cm.
- Thân bọc giấy gợn màu kem, có gân dọc mảnh.
- Lưới hình thoi dán nổi bằng dây đay bện màu be, các đường chéo chạy hai chiều.
- Vòng dây xoắn ở miệng và ở đáy bình.
- Hoa: hồng phấn, baby trắng, bạch đàn. Bàn đá cẩm thạch kem.

## Cách làm
Bọc giấy gợn màu kem quanh bình thủy tinh. Dán vòng dây ở đáy. Dùng súng keo dán dây đay theo đường chéo một chiều, rồi dán
chiều ngược lại cho thành hình thoi. Quấn vòng dây ở miệng bình, rồi cắm hoa.

Elise mặc quần yếm short denim + áo ba lỗ trắng, không găng. Bối cảnh xưởng sáng như tập 12 (`anh/dt-ref-xuong.png`).

## Nhịp (khoảng 23 giây sau chuyển cảnh)

| Clip | Việc | Giây | Tốc độ | Chuyển cảnh |
|---|---|---|---|---|
| 1 | Mở đầu: thành phẩm | 1,5 | thật | (đầu) |
| 2 | Bọc giấy gợn quanh bình thủy tinh | 3 | tua | lóe trắng |
| 3 | Đã có vòng đáy; dán dây chéo một chiều | 3 | tua | mờ dài |
| 4 | Dán dây chéo ngược, thành lưới thoi | 3 | tua | mờ |
| 5 | Cận quấn vòng dây ở miệng bình | 4 | thật | mờ |
| 6 | Cắm hoa | 5 | thật | mờ |
| 7 | Thành phẩm, máy quay lia vòng | 6 | chậm | mờ dài |

CSV tạo bằng `scripts/tao_gen_tap14.py`.

## Rủi ro
- Dán dây lặp lại nhiều đường dễ làm dây tự mọc ra hàng loạt (tập 10). Mỗi clip chỉ một chiều dây; nếu hỏng thì cắt sớm.

## Trạng thái
- 2026-11-05: phân tích, tạo CSV, gen 10 ảnh (`D2` gen lại vì máy lùi xa). Gen 7 clip Muse.
  - Clip 2 trượt QA cả 2 lần (giấy tự bọc kín): dùng lần 1, lấy 0–6,5 s.
  - Clip 4 trượt QA cả 2 lần (lưới thoi tự hiện): lấy 0,2–5,3 s.
  - Clip 3 QA tự cắt ở 8 s.
  - `video/final-v2.mp4` (23,3 s, ghép theo `ghep-v2.csv`) chờ chủ dự án xem.
- **XONG (2026-11-06):** chủ dự án chốt bản v2 (23,3 s), không làm lại theo kế hoạch sửa.
  - Đã đổi tên thành `video/final.mp4`.
  - Đã xóa bản tự ghép cũ, clip lẻ, bản gen lần 1 và file QA.
