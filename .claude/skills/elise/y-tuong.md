# Bước 1: ý tưởng và nhịp (chưa gen gì)

Theo `CLAUDE.md`: chỉ viết nội dung, gửi duyệt, **chờ OK rõ ràng** rồi mới tạo tài nguyên. Bước này không gen ảnh,
không chạy Muse.

Hai ngoại lệ:
- Chủ dự án nói rõ "tự làm, không cần duyệt" cho tập đó (như tập 14). Khi đó vẫn viết `NOI-DUNG.md`, rồi làm tiếp luôn.
- Chủ dự án xin xem ảnh thành phẩm hoặc storyboard trước khi duyệt. Khi đó chỉ gen đúng những ảnh được xin (mục 1.4).

## 1.1 Phân tích ảnh sản phẩm
- Lưu ảnh chủ dự án gửi thành `anh/<tiền tố>-ref-san-pham.png`. Lưu file ảnh gốc không tính là gen. Bỏ qua nhãn chữ, ô phóng to và nút UI trong ảnh.
- Tả kỹ những gì thấy:
  - dáng: cao, phình, cổ, miệng;
  - chất liệu và màu từng phần;
  - họa tiết: hướng dây, số vòng, mật độ;
  - đồ trang trí, hoa;
  - mặt bàn, tường, ánh sáng.
- Nghĩ **cách làm DIY có thật**, từng bước, bằng vật liệu thường. Mỗi bước là việc tay người làm được trong một clip.
- Rút về 5–8 bước làm. Gộp các thao tác lặp lại.

## 1.2 Bảng nhịp

Mẫu tập 14:

| Clip | Việc | Giây | Tốc độ | Chuyển cảnh |
|---|---|---|---|---|
| 1 | Mở đầu: thành phẩm | 1,5 | thật | (đầu) |
| 2 | Bước làm 1 | 3 | tua | mo_dai |
| 3 | Bước làm 2 | 3 | tua | mo_dai (nhảy thời gian) |
| 4 | Bước làm 3 | 3 | tua | mo |
| 5 | Cận trang trí hoàn thiện | 4 | thật | mo |
| 6 | Cắm hoa | 5 | thật | mo |
| 7 | Thành phẩm, máy lia vòng | 6 | chậm | mo_dai |

Cách lên nhịp:
- Tổng 25–40 s. Tập 13 bản 8 clip bị chê "hơi ít cảnh"; chủ dự án chọn 12 clip, khoảng 40 s.
- Bước có **vật nhỏ lặp lại** (dán từng sợi dây, đặt từng viên đá) thì làm **cảnh cận tay**, mỗi clip 2–3 vật.
- Bước tạo ra nét đặc trưng của sản phẩm **phải có cảnh người xem thấy nó hình thành**. Không để chuyển cảnh nhảy qua bước đó.
- Đồ dùng của bước sau có sẵn trong khung từ đầu. Đồ trang trí phụ có sẵn ở góc, không đặt từng món.

## 1.3 NOI-DUNG.md và gửi duyệt
Mẫu: `content/elise-diy/ep14-rope-lattice-vase/NOI-DUNG.md` (Wild: `KICH-BAN.md` của tập 01). Gồm các mục:
- Sản phẩm;
- Cách làm (kèm trang phục và bối cảnh);
- Nhịp;
- Rủi ro;
- Trạng thái (nhật ký có ngày).

Gửi chủ dự án:
- bảng nhịp;
- phần tả sản phẩm;
- một dòng rủi ro chính.

Sau đó **dừng, chờ OK**.

## 1.4 Sau khi được OK: ảnh thành phẩm trước tiên
- `<tt>-G-thanh-pham.png`: thành phẩm không người, đúng khung ảnh gốc, bỏ chữ.
  Prompt: "Recreate the product in the reference image exactly, same framing, but WITHOUT the caption label...".
- `<tt>-so-sanh.png`: ghép ảnh gốc cạnh ảnh G bằng PIL. Gửi chủ dự án xem sản phẩm có đúng không.
- Ảnh G là **chuẩn dáng sản phẩm cho cả tập**: mọi khung sau đều gửi kèm ảnh này.
