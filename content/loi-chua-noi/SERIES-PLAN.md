# Lời Chưa Nói — kế hoạch series (bản đề xuất, chờ duyệt)

Ngày đề xuất: 2026-11-18. Trạng thái: **CHỜ CHỦ DỰ ÁN DUYỆT**, chưa gen gì.

## Ý tưởng
Reel triết lý sống 9:16, dài 40–60 s, đăng Facebook Reels, TikTok và YouTube Shorts.
Giọng Phương đọc lời triết lý **tự viết** (không chép lời của kênh khác). Nền nhạc piano.
Hình là video AI quay thật bằng ảnh GPT + Muse.

Mỗi tập kể một câu chuyện nhỏ bằng hình **song song với lời đọc**. Đây là điểm khác so với reel gốc (một cảnh đi bộ suốt 42 s):
lời đọc nói về một điều, còn hình cho thấy một người đang thật sự sống điều đó. Như vậy mỗi cảnh đều có thông tin mới.

## Nhận diện cố định
| Thành phần | Chốt |
|---|---|
| Nhân vật | **"Cô ấy"**: phụ nữ Việt khoảng 28 tuổi, tóc đen dài búi thấp, áo len cardigan màu kem, quần vải nâu nhạt. **Không bao giờ quay rõ mặt** (chỉ lưng, nghiêng xa, đôi tay), để Muse không làm đổi mặt và người xem tự đặt mình vào |
| Bối cảnh | Nhà gỗ nhỏ ở vùng quê miền Bắc, bàn gỗ cạnh cửa sổ, đường làng, mưa nhẹ |
| Ánh sáng, màu | Hoàng hôn ấm, cam pha xanh xám, góc tối nhẹ |
| Giọng | ElevenLabs **Phương** (`deC6NEXcbavaVWbzjgzb`), model `eleven_v4`, độ ổn định 0.5, tốc độ 1.0 |
| Nhạc | Piano buồn từ Suno (tập 01 dùng `回忆的钢琴曲.mp3`), nhỏ hơn giọng khoảng 7 dB |
| Phụ đề | Chữ trắng có bóng mờ, hiện từng cụm theo giọng, đặt ở 1/3 dưới. **Không** dùng màu cyan như reel gốc |
| Câu chốt cuối | Câu cuối mỗi tập hiện to giữa màn hình, giữ 2 giây |

## Nhịp sản xuất mỗi tập
- **2–3 clip Muse mỗi tập** (chủ dự án chốt 2026-11-18), mỗi clip 10 s là một chuỗi 3–4 động tác; lời đọc khoảng 30 s. Không kéo, không làm chậm.
- Chuyển cảnh: crossfade 0,4–0,6 s (theo bảng `chuyen_canh` của skill muse-video).
- Quy trình: viết lời → duyệt → giọng Phương → ảnh GPT → Muse → dựng ffmpeg 24 fps → phụ đề → nhạc.

## Danh sách chủ đề 10 tập đầu (để tham khảo, duyệt từng tập)
1. Người hiền rời đi không báo trước (sự im lặng của người tử tế)
2. Đừng đợi mất rồi mới gọi điện cho bố mẹ
3. Người thật lòng không cần bạn phải hoàn hảo
4. Có những lời xin lỗi đến muộn hơn một đời người
5. Khi bạn thôi giải thích, bạn đã trưởng thành
6. Lòng tốt cũng cần có giới hạn
7. Người đi cùng bạn lúc nghèo
8. Đừng hứa khi đang vui
9. Một mình không có nghĩa là cô đơn
10. Điều bạn gieo hôm nay
