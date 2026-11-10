# Marek Ivanov: nhân vật chính series "Marek Training"

Nam lực sĩ/võ sĩ thực thụ khoảng 28-32 tuổi, tập hàng ngày trên sân thượng một nhà kho bỏ hoang: nâng tạ cực nặng,
bài tập thân thể khó, tư thế và đòn võ hoa mỹ gợi cảm hứng truyện tranh (không phải siêu năng lực, vẫn là người thật).

## Ngoại hình (cố định, giữ nguyên ở mọi tập)

- Tóc nâu đỏ rối bời, phủ trán, dài ngang tai.
- Mắt sắc nhìn thẳng máy quay, biểu cảm nghiêm nghị, không cười.
- Thân hình bodybuilder cực đô: vai u, ngực to, bụng múi rõ, gân nổi khi gồng cơ.
- Da trắng hồng, khỏe mạnh. Câu mô tả da bắt buộc trong prompt: "natural realistic skin texture with visible pores
  and muscle striations, no airbrushing, no smoothing" (tránh AI làm mượt mất chi tiết cơ, giống bài học từ Elise).
- Trang phục mặc định: quần thun thể thao ống rộng màu đỏ đô (burgundy), không mặc áo khi tập, giày sneaker trắng,
  không phụ kiện.
- Luôn chỉ một Marek trong khung: "Only this one man is ever in the scene; no other person appears."

## Bối cảnh series

Sân thượng nhà kho bỏ hoang, giờ hoàng hôn: cần cẩu sắt gỉ bên trái, tường bê tông loang lổ, nền bê tông nứt, trời
mây cam/tím. "Nơi tập luyện bí mật trên nóc thành phố."

## File

| File | Dùng làm gì |
|---|---|
| `anh/marek-ref-goc.png` | Ảnh gốc chủ dự án gửi: đứng thẳng tư thế gồng cơ, sân thượng hoàng hôn. Dùng làm chuẩn ngoại hình + bối cảnh + tư thế chốt cho tập 01 |
| `anh/mi-marek-truoc.png` | Bản chép của ảnh gốc, dùng làm ảnh tham chiếu nhân vật khi gen ảnh cảnh (như `elise-truoc.png` của Elise) |

## Đoạn mô tả để dán vào prompt (tiếng Anh)

```
the muscular man from the reference: tousled dark auburn hair falling over his forehead, sharp focused eyes, no
smile, extremely muscular bodybuilder physique with broad shoulders, defined chest and visible abs, natural
realistic skin texture with visible pores and muscle striations, no airbrushing, no smoothing, shirtless, loose
burgundy red sweatpants, white sneakers, no jewelry
```

## Lưu ý khi gen ảnh

- Thân hình quá đô dễ bị AI làm mượt mất múi cơ hoặc thu nhỏ vai: luôn nhắc "visible muscle striations and veins,
  no smoothing" và "keep the exact same muscular build as the reference" trong mọi prompt.
- Tạ đòn/thanh sắt là vật cứng dài, dễ bị vẽ méo khi đang chuyển động nhanh: giữ góc máy cố định trong từng clip,
  mỗi clip một việc (bài học từ Elise Talent).
- Tránh mô tả thành tích phi thực tế kiểu siêu năng lực (vỡ đất, sóng xung kích...); giữ ở mức người thật tập nặng,
  bối cảnh và ánh sáng kịch tính bù lại phần "hoành tráng".

## Bối cảnh thứ 2: phòng tập calisthenics trong nhà (2026-11-09, đã duyệt)

Dùng cho các bài thể dục dụng cụ/tư thế khó cần thấy rõ tay chân (không phải tập tạ). Khác sân thượng:

- Trong nhà, nền đá/bê tông xám tối, ánh sáng thấp kịch tính (không phải hoàng hôn ngoài trời).
- Trang phục: quần đùi thể thao đen (không phải quần thun đỏ đô), chân trần không giày, băng quấn cổ tay và cổ
  chân màu trắng be. Vẫn không mặc áo.

Đoạn mô tả dán vào prompt:
```
the muscular man from the reference: tousled dark auburn hair falling over his forehead, sharp focused eyes, no
smile, extremely muscular bodybuilder physique, natural realistic skin texture with visible pores and muscle
striations, no airbrushing, no smoothing, shirtless, black athletic shorts, barefoot, white athletic tape wrapped
around both wrists and both ankles, no jewelry
```

## Bối cảnh thứ 3: footwork/đấm bốc, vẫn phòng trong nhà (2026-11-10, đã duyệt)

Dùng cho bài tập di chuyển chân/đấm bốc cần thấy rõ bước chân. Vẫn phòng đá/bê tông tối như bối cảnh thứ 2, đổi
trang phục để hợp động tác chân:

- Quần dài thể thao đen ống bó (không phải quần đùi, để thấy rõ đường chân khi di chuyển), chân trần, băng quấn
  cổ tay trắng be, có thể đeo găng đấm bốc đen. Vẫn không mặc áo.

Đoạn mô tả dán vào prompt:
```
the muscular man from the reference: tousled dark auburn hair falling over his forehead, sharp focused eyes, no
smile, extremely muscular bodybuilder physique, natural realistic skin texture with visible pores and muscle
striations, no airbrushing, no smoothing, shirtless, fitted black athletic track pants, barefoot, white athletic
tape wrapped around both wrists, black boxing gloves, no other jewelry
```

## Các tập

| Tập | Thư mục | Nội dung |
|---|---|---|
| 01 | `ep01-deadlift-san-thuong/` | Deadlift tạ đòn cực nặng trên sân thượng, kết bằng tư thế gồng cơ (ảnh gốc) |
| 02 | `ep02-one-arm-lever/` | One-arm elbow lever (chống một tay, thân ngang) trong phòng tập trong nhà |
| 03 | `ep03-footwork-combo/` | Footwork/đấm bốc tăng tốc độ, kết bằng cú đá xoay người hoa mỹ |
