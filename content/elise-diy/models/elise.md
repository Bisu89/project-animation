# Elise Moreau: nhân vật chính series "Elise DIY"

Elise là cô gái trẻ người Pháp, khoảng 25 tuổi. Cô thích tự tay làm đồ DIY và tái chế đồ cũ thành đồ nội thất đẹp:
bàn resin, đèn, đồ trang trí.

## Ngoại hình (cố định, giữ nguyên ở mọi tập)

- Tóc nâu nhạt, búi gọn sau đầu, vài sợi buông hai bên mặt.
- Mặt tươi tắn, da tự nhiên (thấy lỗ chân lông, không làm mịn), **không có tàn nhang** (bỏ từ 2026-11-03 vì AI lúc vẽ lúc không), trang điểm nhẹ, hay cười.
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
| `elise-v2-model-sheet.png` | **Bản chuẩn từ tập 02 trở đi (chủ dự án duyệt ngày 2026-11-02):** trang điểm, làm tóc chỉn chu hơn, khuyên tai và dây chuyền vàng, tư thế người mẫu. Dùng ảnh này làm tham chiếu nhân vật cho các tập mới. Bản v3 (dáng cong hơn, áo cổ cao) đã bị bỏ |

## Trang phục thứ 2: legging (2026-11-03, chờ chủ dự án duyệt)

Giữ áo ba lỗ trắng, khuyên tai và dây chuyền. Thay quần yếm short bằng quần legging đen lưng cao dài tới mắt cá chân.
Đi tất trắng cổ ngắn và giày thể thao Nike cổ thấp màu trắng.

| File | Dùng làm gì |
|---|---|
| `elise-legging-model-sheet.png` | Model sheet 3 góc (trước, nghiêng, sau) |
| `elise-legging-truoc.png` | Góc trực diện, dùng làm ảnh tham chiếu khi gen ảnh cảnh |

Đoạn mô tả để dán vào prompt:

```
the young European woman from the reference: light brown hair in a neat bun, natural realistic skin texture with fine pores, no freckles, no airbrushing, small gold hoop
earrings, fitted white tank top, plain black high-waisted full-length leggings, white ankle socks, white leather
Nike low-top sneakers; modest, wholesome family-friendly DIY tutorial look
```

## Trang phục thứ 3: váy xếp ly + crop top có logo (2026-11-03, chờ chủ dự án duyệt)

Áo crop top trắng tay ngắn. Trước ngực bên trái có logo thêu chỉ nâu: hình cô gái búi tóc vẽ nét trong vòng tròn,
bên dưới là chữ "Elise" viết tay. Váy xếp ly màu be, lưng cao, dài trên gối. Có 2 phiên bản:

| File | Phiên bản |
|---|---|
| `elise-vay-xep-cao-got-model-sheet.png`, `-truoc.png` | Chân trần, giày cao gót đen bóng mũi nhọn |
| `elise-vay-xep-tat-cham-bi-model-sheet.png`, `-truoc.png` | Quần tất đen mỏng chấm bi, **không đi giày** |
| `elise-vay-xep-model-sheet.png` | Bản nháp đầu (chưa có logo, tất trắng + Nike), chỉ để tham khảo |

Đoạn mô tả để dán vào prompt (thêm câu giày dép theo phiên bản):

```
the young European woman from the reference: light brown hair in a neat bun, natural realistic skin texture with fine pores, no freckles, no airbrushing, small gold hoop
earrings, fitted white short-sleeve crop top with a small embroidered brown logo on the left chest (line-art girl
with a bun in a circle, cursive 'Elise' below), high-waisted light beige pleated skirt just above the knee;
modest, wholesome family-friendly look
```

Logo nhỏ nên AI có thể vẽ chữ hơi nhòe; trong video không cần đọc được rõ.

## Đoạn mô tả để dán vào prompt (tiếng Anh)

```
the young European woman from the reference: light brown hair in a neat bun, natural realistic skin texture with fine pores, no freckles, no airbrushing, light-wash denim
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
