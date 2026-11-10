# Marek Training tập 02: One-arm elbow lever (đã duyệt 2026-11-09)

Marek thực hiện tư thế chống một tay, thân nằm ngang (one-arm elbow lever) trong phòng tập trong nhà, nền đá/bê
tông tối, ánh sáng thấp kịch tính. Bối cảnh/trang phục mới, xem `../models/marek.md`. Ảnh chủ dự án gửi
(`anh/ml-ref-goc.png`) dùng thẳng làm khung cuối/đích tư thế, không gen lại.

Áp dụng bài học từ tập 01 (QA plateau 57→64/100 vì nhiều điểm nối gây lệch mặt/da): **chỉ 2 clip, mỗi clip một lần
quay liên tục.**

## Nhịp (khoảng 16,5 giây)

| Giây | Clip | Việc | Khung đầu → khung cuối |
|---|---|---|---|
| 0–10 | 1 | Bắt đầu tư thế chống tay-gối (base), thu gối phải sát khuỷu tay phải, duỗi thẳng chân phải ra sau trong khi dồn trọng tâm lên tay phải (khuỷu tì hông), rồi thu và duỗi nốt chân trái — thân nâng dần lên thành tư thế nằm ngang chống một tay, một lần liên tục | `ml-A-base-position` → `ml-E-final-pose` (ảnh gốc) |
| 10–16,5 | 2 (chốt) | Giữ nguyên tư thế nằm ngang, máy quay cố định, có thể đẩy nhẹ vào cuối để nhấn mạnh | `ml-E-final-pose` → (không, giữ khung) |

Âm thanh: tiếng thở gắng sức đều, căng cơ; nhạc nền căng thẳng, chậm, không lời.

## Rủi ro và cách xử lý

- Đây là tư thế vật lý khó nhất trong series: chống một tay đỡ toàn thân nằm ngang. AI video dễ vẽ sai tiếp xúc
  tay-đất hoặc làm người trông lơ lửng/không hợp lý.
- Nếu clip 1 hỏng: tách khung cuối sớm hơn (dừng ở "thu chân, chưa duỗi hết" thay vì đợi tới "both legs aligned"),
  giảm độ khó chuyển động trong một lần gen, rồi nối sang clip giữ tư thế.
- Không gen lại quá 2 lần một clip theo đúng quy tắc Muse; trượt QA cả 2 lần thì so 2 bản, chọn đoạn sạch, cắt.

## Trạng thái

- 2026-11-09: chủ dự án duyệt nội dung. Chuẩn bị gen ảnh `ml-A-base-position.png`.
- 2026-11-09/10: clip 1 (vào tư thế, base→hold) không bao giờ chuyển động được — Muse giữ nguyên tư thế chuẩn bị suốt
  clip, thử 2 lần đều vậy. Theo quyết định chủ dự án, bỏ hẳn clip 1, mở đầu đã ở trong tư thế giữ (giống quy ước
  Talent). Clip giữ tư thế (2) + clip nối đẩy máy nhẹ (3) ghép thành `final-v1.mp4`/`final-v2.mp4`: QA 59 → 53/100.
  Chủ dự án xem kỹ, phát hiện **tư thế trong ảnh/video sai hẳn so với ảnh gốc** (khuỷu tay gần như thẳng, tay rảnh
  nắm đầu gối, hai chân co gập giơ cao — thay vì khuỷu tì hông, tay rảnh đặt sườn, hai chân duỗi thẳng ra sau).
  Tự so trực tiếp với `ml-ref-goc.png` xác nhận đúng — bài học: **phải so trực tiếp với ảnh gốc, không đánh giá qua
  lưới khung "trông ổn định" là đủ.**
- 2026-11-10: gen lại clip 2 với prompt mô tả rõ từng khớp (khuỷu gập ép hông, chân duỗi thẳng, tay rảnh đặt sườn,
  nói rõ KHÔNG PHẢI tư thế co gối) + câu sửa nhấn mạnh đúng lỗi. 2 lượt gen đều bị QA tự động (GPT) chấm trượt với
  lý do "tay chống gần thẳng, không gập khuỷu" — nhưng khi tự trích khung và so trực tiếp với `ml-ref-goc.png`,
  **tư thế lần gen thứ 2 khớp tốt** (khuỷu gập rõ, chân duỗi thẳng, tay rảnh đặt đúng vị trí), ổn định suốt 10 giây.
  QA tự động ở đây bị sai/quá khắt khe — tin vào so sánh ảnh trực tiếp hơn. Trích khung cuối clip này làm
  `ml-E2-hold-video.png` (khung đúng, đã ghi đè file cũ sai).
  Gen clip 3 (đẩy máy nhẹ, nối từ khung đúng) nối thành `final-v3.mp4` (13,5s, QA 60/100) rồi `final-v4.mp4`
  (12,8s, cắt sớm hơn vì máy đẩy quá gần làm mất chân cuối clip 3) — vẫn QA 60/100.
  Điểm mạnh: **nhất quán 9/10** (cao nhất trong mọi tiêu chí, nhờ chỉ 2 clip), hình ảnh 8/10, tư thế đúng ảnh gốc.
  Điểm yếu còn lại: không có nhịp vào thế/kết thúc (vì bỏ hẳn clip chuyển động — nó không gen được), tư thế giữ gần
  như tĩnh suốt video nên bị chấm thấp ở "hấp dẫn"/"bám kịch bản" — giống đúng tình trạng tập 01 (dừng ở 64/100).
  Vấn đề gốc (tư thế sai, mặt/da trôi) đã giải quyết xong. **Tạm dừng ở `final-v4.mp4`**, chờ chủ dự án xem và
  quyết định.
