---
name: elise
description: Làm video có nhân vật Elise Moreau (video AI quay thật bằng GPT ảnh + Muse video + ffmpeg) ở mọi dòng: Elise DIY (reel tự làm đồ), Elise Wild (phim dài dã ngoại 16:9 có lời dẫn), Elise Talent (reel biểu diễn nhào lộn), Elise Garden (reel làm vườn). Dùng khi chủ dự án gửi ảnh/video mẫu hoặc ý tưởng mới cho Elise, bảo làm tiếp/sửa/ghép/dọn một tập trong content/elise-*/, hoặc hỏi về nhân vật, trang phục, quy trình.
---

# Elise: một nhân vật, bốn dòng nội dung

Mọi cảnh đều là **video AI người thật**:
- ảnh khung gen bằng GPT/Codex;
- clip gen bằng Muse;
- ghép bằng ffmpeg.

Trả lời chủ dự án bằng tiếng Việt. **Garden long-form dùng workflow riêng trong `dong-garden.md`:**
Claude làm creative/prompt; người dùng tự tạo video Muse với ảnh tham chiếu; Codex nhận media và dựng bằng Remotion.
Không tự chạy Muse hoặc tích hợp API video generation cho bản dài. Các hướng dẫn tool chung bên dưới chỉ dành cho workflow cũ.
Hình ảnh cảnh vẫn là AI quay thật, không slideshow hoặc đồ họa hoạt hình thay thế.

## 1. Xác định dòng, đọc file của dòng đó

| Dòng | Thư mục | Khung, độ dài | Tốc độ | File |
|---|---|---|---|---|
| **DIY**: tự làm, tái chế đồ | `content/elise-diy/` | 9:16, 20–40 s | bước làm tua, trang trí và cắm hoa giữ tốc độ thật | [dong-diy.md](dong-diy.md) |
| **Wild**: dã ngoại, nhật ký của bà | `content/elise-wild/` | 16:9, tập 12–15 phút, chia phân đoạn | tốc độ thật, có lời dẫn | [dong-wild.md](dong-wild.md) |
| **Talent**: nhào lộn, thăng bằng | `content/elise-talent/` | 9:16, 12–18 s | tốc độ thật | [dong-talent.md](dong-talent.md) |
| **Garden**: làm vườn | `content/elise-garden/` | short 9:16 25–35 s, long 16:9 | cắt thời gian, có nhãn thời gian | [dong-garden.md](dong-garden.md) |

Ngoại hình, trang phục từng dòng và ảnh tham chiếu: [nhan-vat.md](nhan-vat.md).

## 2. Các bước dùng chung (đọc đúng bước đang làm)

| Đang ở đâu | Đọc |
|---|---|
| Có ý tưởng hoặc ảnh/video mẫu mới | [y-tuong.md](y-tuong.md) |
| Nội dung đã được duyệt, cần viết CSV và prompt | [prompt.md](prompt.md) |
| Gen ảnh, chạy Muse | [chay-tool.md](chay-tool.md) |
| Clip đã về: xem, cắt, ghép, báo cáo, dọn | [ghep-cat.md](ghep-cat.md) |
| Phim dài 16:9 (Garden bản dài, Wild): chia đoạn, chuyển cảnh, âm thanh nền, màu, ghi chú dựng Remotion | [video-dai.md](video-dai.md) |
| Viết prompt cho bước khó, hoặc một clip hỏng | [loi-thuong-gap.md](loi-thuong-gap.md) |

Ví dụ trong các file bước lấy từ dòng DIY. Chỗ nào dòng khác làm khác thì theo file `dong-*.md` của dòng đó.

## 3. Ràng buộc chung không được quên
- **Không gen gì trước khi chủ dự án OK nội dung** (`CLAUDE.md`), trừ khi chủ dự án nói rõ được tự làm cho đúng tập đó.
- Mỗi giây là hành động có ích hoặc thành quả. Không có cảnh đứng không, đung đưa, ngắm lâu, không kéo cho đủ giây.
- Mỗi clip một việc, có khung đầu và khung cuối. Mọi chỗ nối clip có `chuyen_canh`.
- Elise không tàn nhang. Da tự nhiên: "natural realistic skin texture with fine pores, no freckles, no airbrushing".
- Muse:
  - profile và cổng theo `content/<dòng>/muse-chat.json`: DIY dùng `chrome-profile-4`/9337 (từ tập 16, 2026-11-09), Wild và Talent dùng `chrome-profile-3`/9336; không tạo hay xóa profile;
  - tool không điều khiển được Firefox;
  - mỗi dòng có side chat riêng trong `content/<dòng>/muse-chat.json`;
  - mỗi lúc chỉ một lượt chạy trên một chat.
- QA do GPT chấm, điểm chỉ để tham khảo. Quyết định cuối là mắt người xem.

## 4. Đường dẫn
- `$REPO` = `C:\Users\HoaVan\Desktop\tool AI\project-animation\`
- `$TOOL` = `C:\Users\HoaVan\Desktop\tool AI\muse-auto\` (có README).
- Một tập: `$REPO\content\elise-<dòng>\epNN-<slug>\`, gồm:
  - `NOI-DUNG.md` (Wild: `KICH-BAN.md`);
  - `anh/<tiền tố>-*.png`;
  - `gen-anh.csv`, `gen-video.csv`, `ghep-v2.csv`;
  - `video/`.
- Script sinh CSV:
  - đặt ở `content/elise-<dòng>/scripts/tao_gen_tapNN.py`;
  - mẫu: [scripts/mau_tao_gen.py](scripts/mau_tao_gen.py).
- Tiền tố file riêng cho mỗi tập, không trùng giữa các dòng (`dt-`, `eg1-`, `ew1-`...).

## 5. Ghi bài học
- Lỗi và cách phòng dùng được cho mọi dòng: [loi-thuong-gap.md](loi-thuong-gap.md).
- Quy tắc chỉ của một dòng: ghi vào `dong-*.md` của dòng đó.
- Thay đổi tool: ghi vào `$TOOL\README.md`.
- Tình trạng tập: ghi vào `NOI-DUNG.md` của tập.
