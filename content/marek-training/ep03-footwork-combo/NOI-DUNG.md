# Marek Training tập 03: Footwork — Can you keep up? (đã duyệt 2026-11-10)

Lấy cảm hứng từ clip quảng cáo app "FunPunch" (chủ dự án gửi): nhân vật tập footwork/đấm bốc tăng dần tốc độ qua
các "LV", kết bằng một đòn hoa mỹ. Giữ đúng tinh thần (tăng tốc theo cấp độ, chữ overlay "LV."), không copy phong
cách đồ họa game (vòng tròn sáng, bục lục giác) vì Marek là video AI quay thật.

Bối cảnh/trang phục: bối cảnh thứ 3 trong `../models/marek.md` (phòng đá/bê tông tối, quần dài thể thao đen, băng
cổ tay, găng đấm bốc, chân trần).

## Nhịp (khoảng 17 giây)

| Giây | Clip | Việc | Khung đầu → khung cuối |
|---|---|---|---|
| 0–10 | 1 | Vào tư thế thủ đấm bốc, di chuyển chân (shuffle/pivot) nhịp chậm, tăng tốc dần sang combo đấm-né linh hoạt hơn, một lần quay liên tục | `mf-A-the-thu` → `mf-B-combo-nhanh` |
| 10–17 | 2 (chốt) | Mở đầu đã ở đỉnh điểm cú đá xoay người (spinning back kick), đóng băng/giữ tư thế, cơ bắp căng, máy quay cố định | `mf-C-da-xoay` → (giữ nguyên) |

Chữ overlay "LV.1" → "LV.4" xuất hiện ở các mốc tăng tốc trong clip 1 (chỉ chữ, không đồ họa game). Âm thanh:
tiếng bước chân/đấm gió dồn dập, nhạc nền căng dần tới cú đá kết.

## Rủi ro và cách xử lý

- Bài học từ tập 02: KHÔNG để Muse tự chuyển động từ tư thế thủ sang giữa-không-trung đá xoay người (chuyển động
  quá khó, dễ bị giữ nguyên không nhúc nhích). Clip 2 mở đầu đã ở đỉnh điểm cú đá, không yêu cầu Muse tự dựng pha
  bay người.
- Bài học từ tập 01+02: càng ít clip/điểm nối thì mặt/da càng nhất quán — giữ đúng 2 clip, mỗi clip một lần quay
  liên tục.
- Nếu tư thế đá xoay người (clip 2) bị Muse vẽ sai cấu trúc (như lỗi tập 02): phải tự trích khung và so trực tiếp
  với ảnh `mf-C-da-xoay.png`, không chỉ tin lưới khung hay QA tự động.

## Trạng thái

- 2026-11-10: chủ dự án duyệt nội dung ("duyệt"). Gen 3 ảnh khung (A thủ thế, B combo nhanh, C đá xoay người) — đạt
  ngay, nhân vật/trang phục khớp mô tả.
  Clip 1 (footwork tăng tốc): ĐẠT QA lần 2 (lần 1 lỗi tường sau lưng tự mọc vệt đen). Xem kỹ: đúng nhịp tăng tốc từ
  thủ chậm sang combo đấm nhanh có mờ chuyển động, nhất quán tốt trong clip.
  Clip 2 (giữ tư thế đá xoay người): **không giữ được tư thế lơ lửng giữa không trung** như ảnh `mf-C-da-xoay.png`
  — cả 2 lần gen Muse đều tự "hạ cánh" thành một cú đá cao đứng một chân (vẫn đẹp, nhưng khác kế hoạch; đây là tư
  thế thật có thể giữ được, khác tư thế bay người không thể giữ tĩnh). Từ giây ~0,5 trở đi tư thế này giữ ổn định
  suốt ~9 giây trước khi bắt đầu xoay người ở cuối — cắt lấy đoạn giữa làm phần dùng được.
  Ghép `final-v1.mp4` (17s, giữ chân đá 7,5s, nối mờ dài 0,5s): QA 40/100 — lỗi chính: chỗ nối đấm→đá bị chồng hình
  (2 tư thế quá khác nhau khi crossfade dài), giữ chân tĩnh quá lâu mất cao trào.
  Sửa: rút ngắn đoạn giữ chân còn 3,5s, đổi nối thành mờ ngắn (`mo` 0,25s). Ghép `final-v2.mp4` (13,3s):
  QA 50/100 — nhất quán tăng lên 7/10, nhưng vẫn còn: gương mặt/tỷ lệ người đổi ở đoạn đá, vài khung đấm/bàn chân
  bị cắt mép ở cuối clip 1, giữ chân đá vẫn bị chê là tĩnh/thiếu diễn tiến.
  Đã dùng hết 2 lượt gen lại cho cả clip 1 và clip 2 theo đúng quy tắc Muse. **Tạm dừng ở `final-v2.mp4`** (50/100,
  thấp hơn tập 01 và 02) — báo chủ dự án, chờ quyết định: chấp nhận bản này, đổi tư thế kết thúc sang thứ dễ ăn
  khớp hơn với đoạn đấm (vd. tư thế thủ mạnh mẽ thay vì đá), hay để lại làm bài học.
