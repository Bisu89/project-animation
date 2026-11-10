# Elise DIY tập 12: bình bèo ngà viền vàng + thân quấn dây thừng, nơ tua (ý tưởng, chờ duyệt)

Ảnh sản phẩm chủ dự án gửi: `anh/rr-ref-san-pham.png` (2026-11-04, ảnh chụp màn hình còn nút "Edit", bỏ qua).
Không có video mẫu, nhịp do mình tự lên. Kết hợp cách làm tập 07/11 (vải nhúng xi măng) và tập 10 (quấn dây bện).

## Sản phẩm
- Nửa trên: vải cứng màu ngà, nếp dọc mềm, loe thành miệng bèo nhún rộng, viền chỉ vàng.
- Nửa dưới: thân tròn kiểu thùng, quấn kín dây đay bện màu be thành các vòng ngang đều.
- Chỗ nối hai phần: dây thừng thắt nơ ở mặt trước, 2 đầu là tua kem có chụp vàng.
- Bó hoa: ly hồng có nụ, hồng phấn, hoa sáp và baby trắng, bạch đàn.
- Bối cảnh như tập 11: đá cẩm thạch kem, tường ốp phào be, nắng vàng, khay vàng có nến pha lê, chồng sách viền vàng.
- Ảnh thành phẩm GPT `anh/rr-G-thanh-pham.png` gần giống hệt ảnh gốc (so sánh: `anh/rr-so-sanh.png`).

## Cách làm
Hũ nhựa tròn thấp bọc màng bọc thực phẩm làm khuôn. Nhúng vải cotton trắng vào vữa xi măng trắng, quấn quanh nửa trên
hũ, mép vải cao hơn miệng hũ, xếp nếp dọc, bóp mép thành viền bèo. Khô thì sơn ngà, kẻ vàng nhũ dọc viền bèo. Bôi keo,
quấn dây đay bện sát từng vòng quanh nửa dưới. Thắt nơ dây thừng có 2 tua chụp vàng ở chỗ nối.

Elise mặc **quần yếm short denim + áo ba lỗ trắng + giày thể thao trắng**; găng nitrile đen ở các bước xi măng và sơn,
tháo găng khi quấn dây và thắt nơ. Bối cảnh xưởng sáng như tập 08–11. Storyboard: `anh/rr-storyboard.png`.

## Nhịp (khoảng 30 giây, số giây chỉ ước lượng)
Theo quy tắc tốc độ (docs/muse-video-pipeline.md): các bước làm tua timelapse; kẻ vàng, thắt nơ tua (trang trí hoàn
thiện) và cắm hoa để tốc độ thật.

| Giây | Clip | Việc | Tốc độ | Khung đầu → khung cuối |
|---|---|---|---|---|
| 0–3 | 1 | Nhúng vải vào khay vữa xi măng, nhấc lên; hũ bọc màng đứng sẵn | tua | `rr-B-nhung` → `rr-B2-nhac-vai` |
| 3–6 | 2 | Quấn vải ướt quanh nửa trên hũ, xếp nếp dọc, bóp mép thành viền bèo | tua | `rr-B2-nhac-vai` → `rr-C-beo` |
| 6–9 | 3 | Cắt thời gian (đã khô): sơn ngà phần bèo | tua | `rr-D-kho` → `rr-D2-son-nga` |
| 9–13 | 4 | Cận cảnh: cọ nhỏ kẻ vàng dọc viền bèo | thật | `rr-E-ke-vang` → `rr-E2-vang-xong` |
| 13–16 | 5 | Không găng, bôi keo, quấn dây đay bện từng vòng quanh nửa dưới | tua | `rr-F-quan-day` → `rr-F2-day-xong` |
| 16–20 | 6 | Thắt nơ dây thừng có 2 tua chụp vàng ở chỗ nối | thật | `rr-F2-day-xong` → `rr-H-no` |
| 20–24 | 7 | Cắm bó hoa ly, hồng | thật | `rr-J-cam-hoa` → `rr-J2-hoa-xong` |
| 24–30 | 8 | Thành phẩm (không có người) trên đá cẩm thạch, máy quay lia vòng chậm (5 giây đầu làm chậm thành 6 giây) | chậm | `rr-G-thanh-pham` → (không) |

Âm thanh: nhạc piano nhẹ sang trọng, không lời; tiếng vải ướt, tiếng cọ, tiếng dây sột soạt.

## Rủi ro
- Vàng tự hiện hàng loạt (tập 11): chỉ giữ đoạn cọ đi từng nét.
- Quấn dây: dây chỉ hiện ở chỗ tay vừa quấn, từ trên xuống (tập 10).
- Nơ tua là vật nhỏ, Muse có thể làm tua biến hình: quay cận, tay thắt chậm; nếu hỏng thì cắt thời gian nơ đã thắt sẵn.

## Trạng thái
- 2026-11-04: phân tích, ảnh thành phẩm, ảnh so sánh và storyboard. Chờ duyệt.
- 2026-11-05: chủ dự án dừng tập này (không làm tiếp), đã xóa thư mục `video/` (clip 1 nháp). Ảnh và CSV giữ lại để làm lại sau.
- 2026-11-05: làm tiếp trên profile Chrome mới.
  - QA: clip 2 và 4 trượt cả 2 lần.
  - Cắt: clip 2 lấy 2,6–7,5 s (đầu clip Muse tự nhảy cảnh), clip 3 lấy đến 8,1 s, clip 5 lấy đến 6,8 s (sau đó tự gắn tua).
  - Ghép có chuyển cảnh theo cột `chuyen_canh`.
- **XONG (2026-11-05):** chủ dự án chốt bản 28,8 s (lần đầu được video mượt), đã đổi tên thành `video/final.mp4`, xóa clip lẻ, bản nháp, QA, ảnh so sánh và storyboard.
