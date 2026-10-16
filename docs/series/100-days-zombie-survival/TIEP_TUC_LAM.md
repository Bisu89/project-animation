# TIẾP TỤC LÀM — đọc file này đầu tiên khi mở phiên mới (cập nhật 2026-10-16)

Repo: `C:\Users\hoavx\Desktop\stickman-video`, nhánh `main`, đã push lên `https://github.com/Bisu89/project-animation.git` (remote `project-animation`; `git push` thường là đủ).
Chi tiết kỹ thuật: `HANDOFF.md` (mục 0, tiếng Anh). Bản tiếng Việt tóm tắt cả series: `TOM_TAT_TIENG_VIET.md` (cùng thư mục).

## Quy tắc làm việc bạn đã đặt
1. **Viết truyện trước → bạn duyệt → rồi mới làm video.** Chưa duyệt thì không tạo giọng đọc, ảnh, prompt, render.
2. Trả lời bằng tiếng Việt; lời bình và chữ trong video là tiếng Anh.
3. Video (`*.mp4`) không push lên git. Nhạc/âm thanh/ảnh sinh tự động cũng không (đã nằm trong `.gitignore`).
4. Kiểu video: ảnh AI + zoom/trượt mượt + giọng đọc + phụ đề + hiệu ứng nhẹ (không làm hoạt hình que đầy đủ).
5. Nhân vật học kỹ năng **từng ngày**: không có "quy tắc" sẵn ở Ngày 1. Quy tắc 1 cuối Tập 1, quy tắc 2 ở Tập 2, quy tắc 3 ở Tập 3.

## Hiện trạng
| Hạng mục | Trạng thái |
|---|---|
| Tài liệu series (`docs/series/100-days-zombie-survival/`) | Có đủ 7 file + bảng cảnh chi tiết (`episodes/`) + tóm tắt tiếng Việt. Đã chỉnh theo góp ý ngày 16/10 (kỹ năng học dần). |
| Lời bình Tập 1 (`content/zs-ep01/script.md`, bản tiếng Việt `script.vi.md`) | **Đã viết lại**, chờ bạn duyệt |
| Lời bình Tập 2–5 (`content/zs-ep02..05/script.md`) | Nháp tiếng Anh, chờ duyệt. Đã sửa chỗ nhắc quy tắc cho khớp. Chỉ ~5–6,5 phút mỗi tập (cần kéo dài nếu muốn 8–10 phút). **Chưa có bản tiếng Việt** (chỉ có tóm tắt). |
| Tập 6–7 | Mới có dàn ý (`EPISODE_OUTLINE.md`, `episodes/EP02_TO_EP07_BEAT_SHEETS.md`) |
| Giọng đọc + timeline Tập 1 | Đã tạo từ bản viết lại (lần cuối), nhưng **chưa dùng**; sẽ tạo lại nếu bạn sửa kịch bản |
| `scenes.csv`, `scenes.ts`, `prompts.txt` Tập 1 | **Cũ** (theo bản kịch bản trước); phải tạo lại sau khi bạn duyệt |
| Video | Chưa có tập nào hoàn chỉnh. Chỉ có clip thử kỹ thuật (`SurvivalTest`, `ZombieWalk`) và bản thử 60 giây Tập 1 ảnh giữ chỗ (không dùng) |

## Việc kế tiếp (theo thứ tự)
1. Bạn đọc và duyệt/sửa kịch bản Tập 1: `content/zs-ep01/script.vi.md` (dễ đọc), bản đọc là `script.md`.
2. Còn các điểm cần quyết: tin sơ tán là thật hay bẫy; Tập 2–5 có kéo dài lên 8–10 phút không; phong cách ảnh (vector phẳng hay bán thực tế, `content/zs-style.txt`); các số liệu trong `SURVIVAL_STATE.md` (hiện là đề xuất).
3. Sau khi duyệt Tập 1: tạo giọng đọc, chia ảnh, viết prompt ảnh (47 ảnh), bạn tạo ảnh AI, rồi render. Lệnh nằm trong `HANDOFF.md` và `PRODUCTION_WORKFLOW.md` mục 2b.
4. Rồi lặp lại cho Tập 2, 3… (viết → duyệt → làm).

## Lệnh hay dùng
- Giọng đọc: `python scripts/gen_voice.py --script content/zs-ep01/script.md --out demo-project/public/zs-ep01 --timeline-out demo-project/src/zs-ep01 --rate=-4% --para-pause 0.9` (cần mạng, `edge-tts>=7.3.1`).
- Chia ảnh: `python scripts/build_scenes.py --slug zs-ep01 --target 9`; ảnh giữ chỗ: `python scripts/make_placeholders.py --slug zs-ep01`.
- Render: `cd demo-project && npx remotion render ZsEp01 out/zs-ep01.mp4`.
- Kiểm tra kiểu: `npx tsc --noEmit`.

## Lưu ý kỹ thuật
- Viết file Python bằng công cụ Write rồi chạy, đừng dùng heredoc dài có tiếng Việt (lỗi mã hóa trên Windows).
- Nếu lệnh `git push` bị chặn, báo cho bạn.
