# Quy tắc cho project này

Đọc `HANDOFF.md` trước khi bắt đầu. Trả lời bằng tiếng Việt.

## Duyệt nội dung trước (chủ dự án yêu cầu, 2026-10-30)
Mỗi video/tập mới: viết nội dung trước (danh sách nhịp có giây), gửi cho chủ dự án và **chờ duyệt rõ ràng** rồi mới viết code, tạo tài nguyên hay render.
Sửa nhỏ trên video đã duyệt thì làm luôn.

## Dọn rác sau mỗi video (chủ dự án yêu cầu, 2026-10-29)
Mỗi khi render xong một video và đã kiểm tra, **xóa hết các file trung gian đã tạo ra để làm video đó**, chỉ giữ lại video cuối cùng:

- Xóa: ảnh kiểm tra và contact sheet (`demo-project/out/*.png`, `sheet*.png`), ảnh cắt/khung hình trích ra, `demo-project/out/_frames/`,
  `renders/<tập>/frame-*.png`, các bản mp4 nháp/cũ (`*-v1.mp4`, `*-60s.mp4`, `*-preview.mp4`...), file tạm trong scratchpad.
- Giữ: file mp4 hoàn chỉnh, code (`src/`), kịch bản và tài liệu (`content/`, `docs/`), ảnh nguồn cần để render lại
  (nền GPT, model sheet trong `content/<series>/models/` và `demo-project/public/<series>/`), âm thanh trong `public/` (tạo lại được bằng script).
- Trước khi xóa, liệt kê những gì sẽ xóa trong câu trả lời; không xóa thứ gì nằm ngoài danh sách trên mà chưa hỏi.
