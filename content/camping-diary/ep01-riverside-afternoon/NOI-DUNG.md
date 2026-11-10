# Camping Diary tập 01: "My Peaceful Riverside Camping Afternoon" (ý tưởng, chờ duyệt)

Nguồn: master prompt chủ dự án gửi 2026-11-09 (vlog cắm trại nữ Hàn Quốc, 9:16, 30 giây). Xem khung chung của series ở
`content/camping-diary/SERIES-PLAN.md` (nhân vật, trang phục, bối cảnh trại, nguyên tắc). File này chỉ là nhịp + rủi ro
riêng của tập 01, đã sửa lại theo kinh nghiệm pipeline GPT+Muse thật (mỗi clip một hành động, lửa/dao là rủi ro cao,
chưa lồng giọng khớp môi).

## Khác gì so với storyboard gốc trong master prompt

- **Cảnh 1** bỏ phần "vừa chào vừa tự xoay máy lộ ra cảnh trại" trong một clip — tách làm 2 hành động là rủi ro biến
  hình. Chỉ giữ chào + vẫy tay; cú chuyển sang cảnh trại là một cú cắt bình thường (`chuyen_canh = mo_dai`), không phải
  động tác xoay máy trong lúc quay.
- **Cảnh 3 và 6 (lửa):** khung đầu đã là lửa cháy nhỏ sẵn, không quay lại pha "mồi lửa / bật lửa châm" — Muse dễ làm
  biến hình ngọn lửa khi mô tả quá trình châm lửa.
- **Cảnh 8:** khung đầu đã là đang cầm cốc (bỏ pha "cầm cốc lên"), chỉ còn nhấp – nhìn – cười – giơ ngón cái làm một
  nhịp ngắn liên tục, tránh clip có 4 hành động rời.
- **Không có lời chào tiếng Hàn đồng bộ miệng** ở cảnh 1 cho tới khi xác nhận được giọng đọc tiếng Hàn (xem mục 3,
  SERIES-PLAN.md). Biểu cảm không lời vẫn đủ "lý do xem tiếp" theo đúng yêu cầu của master prompt (section 5).

## Nhịp (khoảng 28 giây, số giây chỉ ước lượng — có thể ngắn hơn khi ghép)

| Giây | Clip | Việc | Máy quay | Chuyển cảnh sau | Rủi ro chính |
|---|---|---|---|---|---|
| 0–3 | 1 | Selfie: nhìn vào máy, cười tự nhiên, vẫy tay nhẹ, gió bay vài sợi tóc | Cầm tay, selfie | `mo_dai` | Không, giữ 1 hành động |
| 3–6 | 2 | Cọc lều đã đặt sẵn cạnh lều dựng nửa chừng; gõ cọc bằng chày nhỏ, tập trung, 1 sợi tóc rơi má | Tripod thấp, 3/4 | `mo_dai` | Số nhịp gõ có thể lệch — không đếm, QA không trừ điểm |
| 6–9 | 3 | Lửa đã cháy nhỏ ở khu lửa trại; khói nhẹ bay tới mặt, nhíu mắt, cười | Cận trung, góc thấp | `mo_dai` | Lửa/khói tự loang hình — clip ngắn, cắt trước khi lửa đổi dáng |
| 9–13 | 4 | Rót nước nóng từ ấm vào dripper cà phê, hơi bốc lên, nhìn cà phê nhỏ xuống | Máy để bàn, cạnh | `mo` | Hơi nước có thể vẽ sai — ưu tiên giữ 3-4s đầu |
| 13–16 | 5 | Thái rau trên thớt gỗ, 2-3 nhịp dao, đặt dao xuống an toàn | Trên cao (overhead), tĩnh | `mo_dai` | Tay/dao là rủi ro cao nhất — không yêu cầu số miếng cắt chính xác |
| 16–20 | 6 | Xoay xiên đồ ăn trên lửa khu nấu (lửa đã ổn định sẵn), đồ ăn ngả vàng, cười hài lòng cuối clip | Cầm tay, trung cận | `mo_dai` | Lửa lần 2 — nếu hỏng, cắt bớt còn phần xoay xiên, bỏ pha cười |
| 20–24 | 7 | Đứng cạnh sông, quay lưng một phần, gió thổi đuôi tóc, nghiêng đầu nhìn bờ | Tripod, toàn cảnh rộng | `mo` | Thấp — mặt không cần rõ, ít lộ lỗi nhận diện |
| 24–28 | 8 | Đang ngồi ghế xếp cầm cốc sẵn; nhấp một chút, nhìn máy mỉm cười, giơ ngón cái | Tripod, trung cảnh | (kết) | Gộp 3 động tác nhỏ thành 1 nhịp ngắn, không để đứng cầm cốc đung đưa chờ |

Âm thanh theo cảnh (lớp dựng tay sau, không bắt Muse tạo): tiếng gió/chim (1,7), tiếng chày gõ cọc (2), tiếng lửa tách
nhẹ (3,6), tiếng nước rót + ấm (4), tiếng dao chạm thớt (5), tiếng cốc chạm bàn/tay (8). Không nhạc nền, không lồng
giọng cho tới khi có giọng tiếng Hàn xác nhận được.

## Việc cần làm trước khi gen ảnh tham chiếu (chưa làm, chờ duyệt)

1. Chốt 4 câu hỏi ở mục 6, `SERIES-PLAN.md` (tên thư mục, mục tiêu đăng, giọng tiếng Hàn, phạm vi 30s).
2. Duyệt bảng nhịp trên (đổi gì cũng được, đây là bản đầu).
3. Sau khi duyệt nội dung: sinh 1 ảnh nhân vật gốc (chính diện) trước, duyệt mặt, rồi mới sinh toàn thân/selfie và 8
   ảnh khung đầu từng cảnh — theo đúng thứ tự ở `SERIES-PLAN.md` mục 2. Chưa viết prompt ảnh/video tiếng Anh ở bước
   này (Phase 2/3 của master prompt), để tránh làm trước khi nội dung được duyệt (`CLAUDE.md`).

## Trạng thái

- 2026-11-09: review master prompt, viết kế hoạch series + nhịp tập 01 rút gọn/sửa theo kinh nghiệm pipeline. Chờ duyệt.
