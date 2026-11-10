# Dòng Elise Garden

Elise biến một góc sân nhỏ thành vườn ăn được: ươm, sang chậu, dựng giàn, chăm sóc, thu hoạch. Câu giới thiệu: *Small space, something growing.*
- Thư mục: `content/elise-garden/`.
- Kế hoạch: `content/elise-garden/SERIES-PLAN.md`.
- Dựng phim dài (chuyển cảnh, âm thanh nền, màu, chia đoạn): [video-dai.md](video-dai.md).
- Video dài: `content/elise-garden/long-form/`. Brief: `ELISE_GARDEN_MASTER.md` (EP01 12 phút, 80 shot). Nguồn dữ liệu duy nhất là
  `long-form/data/*.json`. Storyboard, tài liệu pilot và CSV đều sinh bằng `long-form/tools/garden_ep.py validate|views|csv`, không sửa tay.
  Đọc `long-form/docs/STATUS.md` trước. **Long-form:** Claude chuẩn bị kịch bản, keyframe/Muse prompt và continuity;
  người dùng trực tiếp gen Muse, gửi file theo shot ID; Codex intake/QA media và dựng timeline/audio/render bằng Remotion.
  Không dùng API tạo video. Từ 2026-11-06 chủ dự án cho chạy `muse_auto` bằng profile DIY (`chrome-profile-3`/9336) khi DIY đang rảnh, với chat riêng ghi trong `long-form/episodes/EP01/muse-chat.json`. CSV tạo bằng `tools/muse_csv.py [--wave N]`, clip lưu thẳng vào `media/muse/SHxxx_nn.mp4`. Tên file và thư mục nhận theo package pilot hiện hành.
- Tập 01 (`ep01-tomato-slices`): XONG 2026-11-06, bản 31,4 s `video/final.mp4`. Tập 02 (`ep02-strawberry-pot`, chậu dâu tây có đoạn gieo hạt): XONG 2026-11-06, 34,3 s. Tập 03 (`ep03-cucumber-trellis`, giàn dưa leo chữ A): XONG 2026-11-06, 29,3 s. Tập 04 (`ep04-glass-gem-corn`, ngô Glass Gem): XONG 2026-11-09, 31,3 s. Tập 05 (`ep05-purple-cauliflower`, bông cải tím, có gieo hạt → nảy mầm → trồng): XONG 2026-11-09, 33 s. Tập 06 (`ep06-basil-cutting`, húng quế): chờ duyệt nội dung. Các tập sau và L01 (bản dài) mới là đề xuất.

## Khác dòng DIY
| Mục | Garden |
|---|---|
| Khung | Short 9:16 1080×1920, 25–35 s. Long 16:9 1920×1080, 10–15 phút (EP01: 720 s) |
| Thời gian | Các giai đoạn cây lớn dùng **cú cắt thời gian** kèm chữ đè tiếng Anh ("Days later", "Weeks later"), chữ thêm lúc ghép, không bắt AI vẽ chữ |
| Chuyển cảnh | Nối hai thao tác: `mo`. Chuyển giai đoạn sinh trưởng: cắt thẳng kèm chữ thời gian |
| Mở và kết | Mở bằng thao tác rõ trong 1–2 s đầu. 3–5 s cuối là cây hoặc thành quả |
| Minh bạch | **Không in nhãn AI lên hình** (chủ dự án chốt 2026-11-06): chủ dự án tự khai báo nội dung AI bằng nút của nền tảng lúc đăng. Chữ thời gian vẫn giữ. Không nhận đã quay nhiều tuần, đã trồng thành công hay đo được năng suất |
| Muse | Profile riêng `chrome-profile-4`, cổng 9337 (chủ dự án yêu cầu 2026-11-06), chạy song song được với các dòng trên `chrome-profile-3`. Mở lại để đăng nhập: `muse-auto\1-dang-nhap-garden.bat`. `url` trống thì lượt chạy đầu tự tạo chat |

## Quy tắc riêng (hai vị trí sân chậu bên dưới chỉ cho short)
- Hai vị trí cố định trong cùng góc vườn:
  - **bàn ươm**: bàn gỗ, khay hứng, hàng rào gỗ sáng;
  - **sân chậu**: nền đá be, chậu đất nung ở giữa.

  Trong một clip, hàng rào, cây nền và bóng nắng không được đổi.
- QA cây (ngoài các lỗi chung):
  - chỗ cắm giàn;
  - thân và rễ bám đất;
  - hoa có trước quả;
  - nhánh và vị trí quả giữ nguyên.
- Mỗi tập đổi hành động chính, dáng cây và kết quả. Không chỉ đổi tên cây trên cùng một chuỗi cảnh.
- Kiến thức trồng trọt phải đối chiếu nguồn khuyến nông. Video mô phỏng không dùng làm bằng chứng cho cách trồng.
