# Quy trình một tập (ví dụ: ep01-locked-supermarket)

Mỗi bước có **Codex review** (gpt-6.1-sol, medium, chạy nền) rồi mới gửi chủ dự án. ⛔ = chờ chủ dự án duyệt rõ ràng.

1. **Cốt truyện** `COT-TRUYEN.md`: 14 ngày (hoặc N ngày), 3 phần, mỗi phần một câu hỏi giữ chân + cú treo; một bí ẩn xuyên 3 phần
   có lời giải công bằng; mỗi ngày một quyết định có hậu quả; luật thế giới (cắn → sốt → 24 giờ; âm thanh > ánh sáng). ⛔
2. **Continuity** `CONTINUITY.md`: sơ đồ địa điểm (ASCII), hệ điện, sổ nước theo ngày (số cuối ngày, khớp phép tính), chìa khóa,
   camera, cửa/kính, mốc giờ ngày cuối, hậu cần từng nhân vật. ⛔
3. **Chia cảnh Part 1** `P1-CANH.md`: cảnh 30–90 s, ngân sách từ (Titan ~190 từ/phút), mẹo 💡. ⛔
4. **Model sheet** nhân vật mới (GPT, gửi kèm sheet cũ để cùng nét) → lưu `models/`.
5. **Lời kể** `PN-LOI-KE.md` (cả 3 phần) → Codex review từng câu → sửa. ⛔ (Ảnh có thể gen trước khi duyệt lời nếu chủ dự án bảo,
   vì ảnh chỉ bám nhịp đã duyệt.)
6. **Bảng dựng** `pN/kich_ban.py` (sự kiện: shot, n/m/nia/news/radio, spk, sfx, pause, hud day/water/convoy/clock, card, tag,
   receipt) + danh sách ảnh (`IMAGES` trong p1, `P2`/`P3` trong `anh_p23.py`).
7. **Gen ảnh** → xem contact sheet có nhãn tên → làm lại ảnh sai (người que lạ, zombie sai chỗ, sai bối cảnh, thiếu chi tiết then chốt).
8. **Thu giọng + timeline** (`dung_phan.py pN`) → tách ảnh đứng > ~14 s bằng ảnh dùng lại/hồi tưởng.
9. **Render nháp** → tự xem 30 khung → **Codex QA** (contact sheet + `qa-loi.txt`; báo trước là sheet lấy mẫu thưa) → kiểm chứng
   từng lỗi trước khi sửa → render bản cuối vào `video/`.
10. **Thumbnail** (2–4 phương án cho chủ dự án chọn) + `DANG-PN.md` (tiêu đề, mô tả, chương theo mốc DAY, tag, cài đặt). Lịch: P1,
    +3 ngày P2, +3 ngày P3, +7 ngày Full Movie.
11. **Shorts** (`ShortClip.tsx`, một hoặc nhiều đoạn cắt) + thumbnail dọc (`tao_thumb_short.py`) + `DANG-SHORTS.md`.
12. **Dọn** file trung gian; cập nhật `NOI-DUNG.md`.
