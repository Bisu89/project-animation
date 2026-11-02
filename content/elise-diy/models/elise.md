# Elise Moreau: nhân vật chính series "Elise DIY"

Elise là cô gái trẻ người Pháp, khoảng 25 tuổi. Cô thích tự tay làm đồ DIY và tái chế đồ cũ thành đồ nội thất đẹp:
bàn resin, đèn, đồ trang trí.

## Ngoại hình (cố định, giữ nguyên ở mọi tập)

- Tóc nâu nhạt, búi gọn sau đầu, vài sợi buông hai bên mặt.
- Mặt tươi tắn, có tàn nhang nhẹ ở mũi và má, trang điểm nhẹ, hay cười.
- Dáng thon, khỏe khoắn.
- Trang phục: quần yếm short denim xanh nhạt (có túi ngực, dây đeo mảnh), áo ba lỗ trắng bên trong,
  giày thể thao trắng trơn, tất trắng cổ ngắn.
- Khi làm việc trong xưởng thì đeo găng tay nitrile đen.

## File

| File | Dùng làm gì |
|---|---|
| `elise-model-sheet.png` | Model sheet 3 góc (trước, nghiêng, sau) |
| `elise-truoc.png` | Chỉ góc chụp trực diện. **Dùng file này làm ảnh tham chiếu khi gen ảnh cảnh** (xem lưu ý bên dưới) |
| `elise-ref-trang-phuc.png` | Ảnh trang phục gốc do chủ dự án gửi |
| `elise-v2-model-sheet.png` | Bản nháp: trang điểm, làm tóc chỉn chu hơn, thêm khuyên tai và dây chuyền vàng, tư thế người mẫu |
| `elise-v3-model-sheet.png` | **Bản nháp chờ duyệt (2026-11-02):** dáng đồng hồ cát, vòng 1 đầy đặn hơn, áo ba lỗ cổ cao, không hở hang. Chủ dự án yêu cầu "quyến rũ hơn nhưng không hở hang" |

## Đoạn mô tả để dán vào prompt (tiếng Anh)

```
the young European woman from the reference: light brown hair in a neat bun, light freckles, light-wash denim
short overalls over a white tank top, white sneakers, black nitrile gloves; modest, wholesome family-friendly
DIY tutorial look
```

## Lưu ý khi gen ảnh bằng GPT (Codex)

- Bộ lọc an toàn của OpenAI từng chặn một ảnh cảnh, xếp loại "sexual". Lúc đó ảnh tham chiếu là model sheet có
  góc chụp từ phía sau, còn prompt tả Elise "cúi người qua bàn" (leans over the bench).
- Cách tránh:
  - Gửi kèm `elise-truoc.png` thay cho cả model sheet.
  - Tả tư thế đứng thẳng, góc máy trực diện ngang ngực.
  - Thêm cụm "modest, wholesome family-friendly DIY tutorial look" vào prompt.
- Không dùng các từ tả cơ thể như "hourglass", "sexy", "curvy" trong prompt cảnh.

## Các tập

| Tập | Thư mục | Nội dung |
|---|---|---|
| 01 | `ep01-bottle-table/` | Bàn trà resin ghép 12 chai bia xanh, có đèn LED |
