# Dòng Elise Wild

Phim dài ngang 16:9, mỗi tập 12–15 phút. Concept "Grandma's Field Journal": Elise đi lại hành trình trong nhật ký
dã ngoại năm 1968 của bà Hélène. Bà ngoài 80 tuổi và vẫn còn sống.
- Mục tiêu: được duyệt kiếm tiền YouTube (YPP) trên kênh mới "Elise Wild Studio".
- Đọc trước khi làm: `content/elise-wild/SERIES-PLAN.md`.
- Kịch bản mẫu: `content/elise-wild/ep01-waterfall-pool/KICH-BAN.md`.
- Dựng phim dài (chuyển cảnh, âm thanh nền, màu, chia đoạn): [video-dai.md](video-dai.md).
- Tình trạng tập 01: phần "ELISE WILD tập 01" đầu file `HANDOFF.md`.

## Khác dòng DIY
| Mục | Wild |
|---|---|
| Khung | 16:9 1920×1080. `video_spec` ghi trong `muse-chat.json` |
| Tốc độ | Tốc độ thật, không timelapse. Clip 6–14 s (`che_do = cat`) |
| Đơn vị làm | **Phân đoạn** 2–3 phút. Mỗi phân đoạn một thư mục (`p3-leu/`, `p4-nuoc/`...) có CSV riêng và `video/final.mp4` riêng. Duyệt nội dung từng phân đoạn |
| Góc máy | Khoảng 50% cận tay, 30% trung cảnh, 20% toàn cảnh hoặc mặt. Muse hay kéo máy vào cận mặt, nên cảnh cần thấy đồ vật thì quay cận đồ vật |
| Lời dẫn | Tiếng Anh, chiếm 40–45% thời lượng. ElevenLabs qua vibi.pro (`scripts/vibi_tts.py`, key `VIBI_API_KEY` trong `.env`, không in key). Giọng Elise: Jessa `yj30vwTGJxSHezdAGsv9`; giọng bà: Jane `RILOU7YmBhvwJGDGjNmP`. **Không lồng giọng tạm**: chưa có key thì giao bản câm |
| Chữ đè | Chỉ chữ đơn giản lúc ghép: nhãn AI, cảnh báo an toàn, giờ, ghi công. Trang nhật ký là clip AI cận trang giấy thật, mỗi dòng chữ viết tay khoảng 6 từ |
| Minh bạch | Bật nhãn AI. Có dòng "Fictional story, skills simplified". Không nói như chuyến đi có thật. Mỗi tập là ý tưởng gốc |

## Quy tắc riêng
- **Câu chuyện hợp lý trước, kỹ thuật sau.** Đọc lại thứ tự cảnh như người xem:
  - đồ vật có lý do để xuất hiện không;
  - việc trước có dẫn tới việc sau không.

  Lỗi chủ dự án từng bắt được: dựng lều lá xong lại có sẵn lều bạt; đậy nắp nồi trước khi lọc nước.
- Đời thường, không cầu kỳ: nhóm lửa bằng bật lửa, củi thì nhặt cành khô.
- Thời tiết và đồ trên người phải liên tục: mọi prompt ghi giờ trong ngày và mây; ghi "no backpack", "bare arms" khi cần.
- Hình học vật dựng phải tả rõ trong prompt (lều chữ A: cành tựa vào sào ở mặt trước và mặt sau, mái chạy dọc theo sào).
- Ảnh nào đạt thì gửi Muse ngay (`run --only <stt>`), không chờ đủ bộ ảnh.
- Thang QA cả video viết cho reel dọc, nên chấm thấp các đoạn giữa tập 16:9. Dùng QA để tìm lỗi cụ thể, không lấy điểm làm chuẩn.
