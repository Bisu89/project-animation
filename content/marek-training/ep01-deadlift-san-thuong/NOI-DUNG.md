# Marek Training tập 01: Deadlift sân thượng (đã duyệt 2026-11-09)

Marek tập deadlift với tạ đòn cực nặng trên sân thượng nhà kho bỏ hoang lúc hoàng hôn. Mở đầu đã vào giữa thử thách
(bỏ cảnh đi tới sàn tập). Kết thúc bằng đúng tư thế gồng cơ trong ảnh chủ dự án gửi (`../models/anh/marek-ref-goc.png`).

Nhân vật: xem `../models/marek.md`.

## Nhịp (khoảng 16 giây)

| Giây | Clip | Việc | Khung đầu → khung cuối |
|---|---|---|---|
| 0–3 | 1 | Cận hai tay nắm thanh tạ đòn chất đầy đĩa gang, Marek đã vào tư thế deadlift (lưng thẳng, hông hạ thấp), hít sâu, mắt sắc | `mi-A-cam-ta` → `mi-B-hit-tho` |
| 3–7 | 2 | Kéo tạ rời sàn, gân cổ/tay nổi rõ, thanh tạ hơi võng vì nặng, mặt gồng gắng sức | `mi-B-hit-tho` → `mi-C-keo-giua-duong` |
| 7–10 | 3 | Đứng thẳng khóa hông hoàn toàn, tạ nâng hết tầm ngang đùi, thở hắt ra | `mi-C-keo-giua-duong` → `mi-D-dung-thang` |
| 10–13 | 4 | Thả tạ rơi mạnh xuống nền bê tông (bụi/mảnh vỡ bắn nhẹ, máy rung), Marek đứng thẳng dậy | `mi-D-dung-thang` → `mi-E-tha-ta` |
| 13–16 | 5 (chốt) | Bước ra mép sân thượng, quay đối diện khán giả, gồng vai/ngực/bụng, nắm tay hai bên, hoàng hôn sau lưng, cần cẩu sắt gỉ bên trái — đúng tư thế ảnh gốc. Giữ khung, không cần khung cuối | `mi-E-tha-ta` → (không, dùng `mi-ref-pose-flex.png` làm đích tư thế) |

Âm thanh: tiếng thở nặng, tiếng tạ sắt va chạm lúc hạ xuống (clip 4), nhạc trống chậm dồn nhịp đến cao trào ở clip 5.
Không lời thoại, không chữ overlay.

## Rủi ro và cách xử lý

- Thanh tạ đòn dài/cứng dễ bị AI vẽ méo khi chuyển động nhanh: giữ góc máy cố định từng clip, mỗi clip một việc.
- Cơ thể quá đô dễ bị AI làm mượt mất múi cơ: nhắc rõ "visible muscle striations and veins, no smoothing" trong
  mọi prompt ảnh/video.
- Clip 5 không có khung cuối cứng; gửi kèm `mi-ref-pose-flex.png` (ảnh gốc chủ dự án) làm đích tư thế để Muse bám theo.
- Nếu clip 2 hoặc 3 (thanh tạ đang chuyển động) hỏng: tách cận tay/thanh tạ riêng khỏi toàn thân theo
  `loi-thuong-gap.md` của Elise, không gửi lại y nguyên.

## Trạng thái

- 2026-11-09: chủ dự án duyệt nội dung, dùng ảnh gốc (`marek-ref-goc.png`) làm ảnh tham chiếu nhân vật + tư thế
  chốt. Dùng Chrome profile đang rảnh: `chrome-profile-3` (cổng 9336, đã đăng nhập Muse sẵn, side chat riêng cho
  series này qua `muse-chat.json`).
- 2026-11-09: gen 5 ảnh khung hình, sửa khung A/B lệch cỡ cảnh so với C/D/E rồi gen lại. Chạy Muse 5 clip gốc:
  clip 1 và 4 ĐẠT; clip 2, 3 trượt QA cả 2 lần (kéo tạ bị nhấp nhả nhiều nhịp thay vì một lần liên tục). Dùng bản
  lần 1 của clip 2 (kéo liên tục tới gần khóa hông) ghép thử, `final-v2`/`final-v3`: QA 57/100.
  Theo yêu cầu "video dài 16-20 giây", thêm clip 6 (gộp hẳn "kéo" + "khóa hông" thành một động tác liên tục,
  khung đầu B → khung cuối D) — ĐẠT ngay, GPT tự đề xuất cắt ở giây 6. Gen lại clip 5 (gồng cơ) với máy quay cố
  định (không đi bộ) để tránh nhảy cỡ cảnh — trượt QA cả 2 lần vì Muse cứ đưa nắm tay vào trước bụng hoặc tạo dáng
  khoe bắp tay thay vì nắm tay hai bên hông như kịch bản; giữ bản gần nhất (không mất tạ khỏi khung, dáng gồng cơ
  đẹp dù tay sai vị trí).
  Ghép bản `final-v4.mp4` (clip 1 + 6 + 4 + 5, 17,5 giây): **QA GPT 60/100, CHƯA ĐẠT** (ngưỡng 70). Lỗi còn lại:
  mặt/độ nét cơ/tỷ lệ người trôi nhẹ giữa các clip (giới hạn của việc gen từng clip riêng biệt), đoạn chuẩn bị có
  nhịp ngẩng rồi cúi lại, khoảng cách máy hơi đổi ở mối nối kéo tạ → thả tạ, và tư thế gồng cơ cuối là double-biceps
  thay vì nắm tay hai bên hông như kịch bản đã duyệt (nhưng không méo người, không mất chi).
  Đã thử 2 vòng sửa (57 → 60/100), các lỗi còn lại chủ yếu do giới hạn nhất quán của Muse giữa các clip, giống tình
  trạng Elise Talent tập 01 (dừng ở 62/100 sau 4 vòng sửa).
- 2026-11-09: chủ dự án xác nhận lỗi mặt/da đổi là vấn đề thật, chọn hướng "thử lại với ít clip hơn". Theo gợi ý
  của chủ dự án, gộp còn **2 clip**: clip 7 (10 s, hít thở → kéo → khóa hông → hạ tạ → thả tạ, một lần liên tục,
  ĐẠT QA ngay lần đầu) và clip 8 (gồng cơ kết, máy quay cố định, ĐẠT QA ngay lần đầu). Trong từng clip mặt/da hoàn
  toàn nhất quán (vì chỉ gen 1 lần liên tục) — vấn đề ban đầu coi như đã giải quyết.
  Chỉ còn lệch ở đúng 1 mối nối (giây ~9–10): màu trời và tỷ lệ người đổi giữa clip 7 và 8. Đã thử:
  trích khung cuối thật của clip 7 làm khung đầu clip 8 (gen lại 2 lần, cả 2 đều hỏng nặng hơn — nhân vật quay
  lưng/bước chân — nên **giữ lại bản gốc** của clip 8); tăng độ mờ chuyển cảnh (`mo_dai`); cắt bớt đoạn đứng chờ
  sau khi thả tạ và đoạn xoay người đầu clip 8. Điểm QA: 57 → 60 → 63 → 64/100 (ngưỡng đạt 70), nhích dần nhưng
  không qua được ngưỡng — chỉ còn đúng lỗi lệch màu trời/tỷ lệ ở 1 điểm nối, không còn lỗi mặt/da trôi xuyên suốt.
  Bản tốt nhất: `video/final-v8.mp4` (16,5 giây, QA 64/100). **Tạm dừng ở đây** (giống quy tắc "cần gen lại thì
  dừng" của Talent ep01) — chờ chủ dự án xem và quyết: chấp nhận bản này, gen lại clip 8 thêm vài lần nữa (may rủi,
  2 lần gần nhất đều tệ hơn), hay để lại làm bài học cho tập sau.
- 2026-11-09: **chủ dự án chốt `final-v8.mp4` làm bản cuối, đổi tên thành `video/final.mp4`.** Đã dọn: toàn bộ
  `clip1-8.mp4` (+ bản `.lan1.mp4`, `.truoc.mp4`, `.qa.json`), `final-v2.mp4` → `final-v7.mp4`, thư mục `video/qa/`,
  và file lưới/log tạm trong scratchpad. Giữ nguyên ảnh khung trong `anh/`, CSV, script.
  **XONG (2026-11-09).** Bài học chính cho các tập sau: càng ít clip/điểm nối thì mặt và da càng nhất quán — tập
  này đi từ 5 clip (QA 57-60) xuống 2 clip (QA 64, gần hết lỗi mặt/da) chỉ nhờ gộp các bước lại.
