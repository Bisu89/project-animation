# Bước 2: viết CSV và prompt

Viết bằng script `content/elise-<dòng>/scripts/tao_gen_tapNN.py`, chép từ `scripts/mau_tao_gen.py`, đừng sửa CSV bằng tay.
Script gom các khối prompt dùng chung thành hằng số, nên mọi khung có cùng mô tả phòng, người, sản phẩm.
Cột cắt (`cat_tu`, `cat_den`) chỉnh sau khi xem clip: ghi vào `ghep-v2.csv`, đừng chạy lại script đè lên.

## gen-anh.csv
Các cột: `stt, ten_file, ty_le (9:16), gui_kem, prompt`.

| Ảnh | gui_kem |
|---|---|
| G thành phẩm | `<tt>-ref-san-pham.png` |
| Khung rộng đầu tiên | `<tt>-A-elise-truoc.png; <ảnh phòng>; <tt>-G-thanh-pham.png` |
| Khung rộng tiếp theo | `A; <khung ngay trước>; G`. Ảnh thứ 2 là khung trước, để giữ máy và phòng |
| Khung cận | `<khung rộng cùng bước>; G` (không cần ảnh A) |
| Khung cuối của cặp cận | `<khung cận đầu>; G` + "Exactly the same close-up framing..." |

- `<tt>-A-elise-truoc.png` chép từ `models/` (bộ quần yếm: lấy từ tập trước, ví dụ `ep12 rr-A`).
- Ảnh phòng xưởng sáng: `dt-ref-xuong.png` (tập 14), chép từ `ep12 rr-J-cam-hoa`.

### Khối prompt dùng chung (xem tập 13 và 14)
- `WIDE`: "Photorealistic vertical 9:16 photo, real home DIY tutorial look... Wide shot, fixed camera straight-on at chest
  height, exactly the same ... as the workshop reference:" và **kể tên đồ đạc trong phòng**.
- `SAME`: "Same workshop, table, camera framing, light and <vật> position as the previous reference scene."
- `CAM` (bắt buộc từ khung thứ 3 trở đi): "Keep exactly the camera position, distance and framing of the SECOND reference:
  the <vật> and the woman have exactly the same size and position in the frame." Thiếu câu này GPT hay lùi máy xa.
- `SHAPE` (bắt buộc với sản phẩm có dáng riêng): "The <vật> has exactly the shape, proportions and size of the vase in
  the finished-product reference (<tả dáng>)." Thiếu câu này mỗi khung một dáng bình (tập 14).
- Câu khóa chi tiết phải còn ở các bước sau, ví dụ `RIM` ở tập 13: "The top rim ... is clearly painted ... all the way round".
- `WOMAN`: tả tóc, khuyên tai, trang phục, có hay không có găng, "standing behind the table, face visible".
- `END`: "Real photo, no text, no logos."

### Mỗi khung
- Ghi rõ tiến độ bằng vị trí: "only the left third is covered, the rest still clear glass". Không ghi phần trăm.
- **Khung cuối của một bước là lúc tay còn đang làm** ("presses the last crossing with her fingertip"), không phải
  lúc đứng cầm đồ của bước sau.
- Nhảy thời gian thì mở đầu bằng "Later: ..." và nói rõ cái gì đã xong, cái gì đã cất đi.
- Sửa một ảnh: viết prompt "Recreate the reference image exactly... Only one change: ..." và gửi kèm ảnh cũ.
  Ảnh đã gửi Muse thì phải đổi tên (`chay-tool.md` mục 3.2).

## gen-video.csv
Các cột: `stt, doan, luu_tai, khung_dau, khung_cuoi, anh_tham_chieu, prompt, am_thanh, dung_giay, che_do, cat_tu, cat_den, chuyen_canh`.

- Mỗi clip một việc. `khung_dau` và `khung_cuoi` là hai ảnh liền nhau của cùng một bước.
- `anh_tham_chieu` = `<tt>-A-elise-truoc.png` cho clip có người. Để trống ở clip 1 (thành phẩm), clip cận và clip kết.
  **Không để trùng `khung_dau`**, vì Muse từ chối cả yêu cầu.
- Clip mở đầu và clip kết không có khung cuối.

| Loại clip | dung_giay | che_do | cat_den | chuyen_canh |
|---|---|---|---|---|
| Mở đầu thành phẩm | 1,5 | cat | | |
| Bước làm | 3 | tang_toc | | mo (liền), mo_dai (nhảy thời gian) |
| Cận trang trí | 4 | cat | | mo |
| Cắm hoa | 5 | cat | | mo |
| Lia vòng kết | 6 | tang_toc | 5 | mo_dai |

Ghi chú về `chuyen_canh`: `trang` (lóe trắng) dễ trông như lỗi. Tập 14 bị chê, nên chỉ dùng khi thật cần.

### Khối prompt video
- `BASE`: "Real home DIY timelapse video, vertical 9:16, photorealistic, not animated, no text, no logos. One continuous
  fixed shot: same framing as the start frame, no zoom, no pan, no cuts, no scene changes. The video must start exactly
  like the start-frame image and end exactly like the end-frame image. ... Only this one woman is ever in the scene; no
  other person appears." + tả Elise.
- Câu hành động: một động từ chính, đi từng cái, kết bằng "..., as in the end frame".
- Câu khóa vật lý: "Each new <vật> appears only where her fingers press it; <vật> already glued never move or change."
- `TAIL`: "The <vật> keeps exactly its shape, size and position. She works at a natural, steady pace and never stands idle
  or sways while holding an item; nothing appears, vanishes or changes by itself."
- Lia vòng kết: "No person. ... One smooth, slow cinematic camera orbit around the <vật> at the same height, moving about 60
  degrees to the right ... The <vật> and flowers never change, nothing appears or vanishes."
- `am_thanh`: nhạc piano hoặc acoustic nhẹ không lời, cộng tiếng thao tác (giấy, dây, nước).
