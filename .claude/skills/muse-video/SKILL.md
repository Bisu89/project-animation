---
name: muse-video
description: Quy tắc chung khi làm video AI "quay thật" bằng ảnh GPT + Muse AI + ffmpeg, áp dụng cho MỌI series dùng Muse (Elise DIY/Wild/Talent/Garden, Marek Training, Camping Diary, series mới). Dùng khi viết prompt ảnh/video cho Muse, chạy muse_auto/gpt_anh, xem/cắt clip Muse, nối clip, dựng/render video từ clip Muse, hoặc gặp lỗi Muse (biến hình, vật tự hiện, giật, bộ lọc chặn ảnh). Skill riêng của từng series chỉ ghi nhân vật/bối cảnh/luật riêng; phần dùng chung nằm ở đây.
---

# Video AI quay thật bằng Muse: quy tắc chung mọi series

Trả lời chủ dự án bằng tiếng Việt. Quy trình: **ảnh khung GPT → clip Muse (10 s) → chọn đoạn sạch → dựng ffmpeg**.
Skill riêng của từng series (`elise`, `marek-training`...) giữ phần riêng: nhân vật, trang phục, bối cảnh, nhịp của dòng.
Phần nào hai bên ghi khác nhau thì **luật riêng của series thắng**.

## Đọc đúng file theo việc đang làm
| Việc | File |
|---|---|
| Viết prompt ảnh khung và prompt video Muse | [prompt.md](prompt.md) |
| Chạy tool: gpt_anh, muse_auto, profile, QA, gen lại | [van-hanh.md](van-hanh.md) |
| Nối hai clip, chọn chuyển động Muse làm được, làm video hấp dẫn | [noi-clip.md](noi-clip.md) |
| Xem clip, chọn đoạn sạch, dựng và render, âm thanh, chống giật | [dung-render.md](dung-render.md) |
| Lỗi Muse/GPT gặp nhiều nhất và cách cứu | [loi.md](loi.md) |

## 10 luật không được quên
1. **Duyệt nội dung trước** (`CLAUDE.md`): chưa có OK rõ ràng của chủ dự án thì không gen.
2. **Mỗi clip một việc**, có khung đầu và (thường có) khung cuối. Khung cuối là lúc tay còn đang làm.
3. **Muse không nhớ gì giữa các lần gen.** Prompt nào cũng tả lại nhân vật, bối cảnh, ánh sáng, và luôn gửi kèm ảnh tham chiếu. Ảnh tham chiếu không được trùng khung đầu, nếu trùng Muse từ chối.
4. **Mỗi clip 10 s chỉ có khoảng 4,5–7 s sạch.** Khi lên kế hoạch, mỗi clip tính khoảng 6 s. Không kéo, không làm chậm để đủ giây.
5. **Không có hành động thừa:** đứng không, đung đưa, ngắm lâu. Cảnh giữ tĩnh trong bản cuối không quá 3–4 s.
6. **Một profile Chrome, mỗi lúc một lượt.** Trước khi chạy `muse_auto`, kiểm tra không có phiên nào khác đang chạy. Mỗi series hoặc mỗi tập dài dùng một chat Muse riêng (`muse-chat.json`).
7. **Gen lại đúng cách:** clip trượt QA thì gửi lại đủ ảnh, prompt và câu FIX. Nhắn "render lại" trơn chỉ dành cho lỗi phía Muse. Ảnh đã gửi Muse mà phải gen lại thì đặt tên mới.
8. **Render ở 24 fps gốc của Muse** bằng ffmpeg. Đổi sang 30 fps sẽ giật (xem [dung-render.md](dung-render.md)).
9. **Tự mắt xem clip.** QA bằng GPT và lưới khung chỉ để tham khảo. Tư thế khó thì trích khung full-res so với ảnh gốc.
10. **Ghi bài học mới:** lỗi dùng chung ghi vào skill này; lỗi riêng của một dòng ghi vào skill của dòng đó.

Lịch sử bài học chi tiết theo từng tập: `docs/muse-video-pipeline.md`.
