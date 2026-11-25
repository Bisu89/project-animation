# Nửa Đời Thấu Hiểu — kế hoạch series

Ngày: 2026-11-25. Tên chốt bởi chủ dự án (không đặt tên riêng cho nhân vật).
Nguồn cảm hứng: reel "10 câu nói chữa lành cảm xúc" (FSave, 5:46, re-up talking-head Trung Quốc lồng tiếng Việt).
Chỉ học cấu trúc (câu chốt mở đầu → lời hứa → danh sách đánh số → câu kết), **lời tự viết 100 %**.

## Tạm chọn (chờ chủ dự án xác nhận)
- Nhân vật **không nói trên hình**, giọng ElevenLabs lồng ngoài (Muse chưa khớp khẩu hình).
- **Chủ dự án chốt 2026-11-25: reel ngắn, mỗi reel chỉ 1–2 câu** (~20–30 s, 3 clip Muse).
- Chưa gắn bán sách/affiliate.

## Nhận diện
| Thành phần | Chốt |
|---|---|
| Nhân vật | **CHỐT 2026-11-25: mẫu 4** `models/nhan-vat-truoc.png` (bản gốc `models/anh/mau4-xanh-muc.png`) — phụ nữ ~30 tuổi, trẻ trung quý phái, trang điểm tinh tế, tóc đen búi thấp cài **trâm bạc hình cành cây**, **kính tròn gọng vàng mảnh**, **sườn xám lụa xanh mực in hoa mai trắng**, cổ cao, tay ngắn. Mọi ảnh khung gửi kèm ảnh này để khóa mặt. Prompt gốc: `models/scripts/tao_csv_mau.py` |
| Bối cảnh | Thư phòng hiện đại phong cách thư họa: vách gỗ sồi sáng, cuộn thư pháp treo (nét bút trừu tượng, không chữ đọc được), cửa sổ cao rèm lanh, bàn gỗ óc chó, đèn đồng ánh hổ phách, bộ trà men ngọc, lan trắng |
| Hình | Toàn khung 9:16 (không ô 16:9 giữa nền thủy mặc). Mỗi cảnh = 1 hành động có nghĩa hoặc ẩn dụ cho câu đang đọc |
| Thẻ số | Không dùng cho reel 1–2 câu (chỉ khi làm bản dài gom nhiều câu) |
| Phụ đề | **Chủ dự án chốt 2026-11-25: y hệt podcast súp gà độc** — dùng lại `podcast-sup-ga-doc/ep01/scripts/render_tam.py` + font `podcast-sup-ga-doc/fonts/` (Quicksand Light, chữ trắng + bóng mờ, mỗi lần 1 câu, từng ký tự hiện dần khớp mốc whisper, cuối câu ".."). Không đổi cỡ/kiểu |
| Giọng | **CHỐT 2026-11-25: ElevenLabs "Kênh" `5vqV9IG7sDpzgzKOIZAv`** (giọng chuẩn, trẻ, kể chuyện). `vibi_tts.py --voice 5vqV9IG7sDpzgzKOIZAv --model eleven_v4 --language vi` (mặc định stability 0.5, speed 1.0). Đã thử và loại: Trang, Bảo Yến, Giang `s6W2…`, Giang Nam `X0V9…`, Ngân Nguyễn, Emma |
| Nhạc | Piano Suno của chủ dự án `回忆的钢琴曲.mp3` (cùng bản podcast súp gà độc), chép vào `ep01/audio/nhac-piano.mp3`, volume −15,4 dB, fade in 0,5 s / out 2,5 s |
| Kết | Câu chốt nối tên series + thẻ "Nửa Đời Thấu Hiểu" 2–3 s |

## Quy trình mỗi tập
Lời + gói mở đầu (CLAUDE.md) → duyệt → giọng → ảnh GPT → Muse (chuỗi `@cuoi` khi liền cảnh) → dựng ffmpeg 24 fps → phụ đề → nhạc → QA → dọn rác.
Muse: series mới = chat Muse mới, đặt `video_spec` 9:16 trong muse-chat.json.
