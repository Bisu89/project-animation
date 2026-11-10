# Viết prompt: ảnh khung (GPT) và video (Muse)

Prompt viết bằng tiếng Anh. Nên viết bằng script sinh từ dữ liệu, các khối dùng chung đặt thành hằng số. Không sửa CSV bằng tay.

## 1. Ảnh khung (GPT, `gpt_anh.py`)
- **Gửi kèm** (`gui_kem`): ảnh nhân vật **trực diện** (không gửi model sheet nhiều góc vì bộ lọc hay chặn) và **ảnh của clip trước hoặc ảnh nền** để khóa phòng, sàn và góc máy.
  Chỉ ghi "cùng phòng" bằng lời thì không đủ, phải có ảnh mẫu kèm theo.
- **Khóa máy** (bắt buộc từ khung thứ 2 trở đi): "Keep exactly the camera position, distance and framing of the SECOND reference: … keep exactly the same size and position in the frame." Thiếu câu này GPT hay lùi máy ra xa.
- **Khóa hình vật** có dáng riêng: "has exactly the shape, proportions and size of … in the reference". Thiếu câu này mỗi khung ra một dáng.
- **Nhiều trạng thái của cùng một bối cảnh:** gen **thành phẩm trước**, rồi lùi ngược về trước bằng "Recreate exactly… Only change: …". Kiến trúc và góc máy giữ ổn định hơn nhiều so với gen xuôi.
- Tiến độ tả bằng vị trí ("only the left third is covered"), không ghi phần trăm. Nhảy thời gian thì mở câu bằng "Later: …" và nói rõ thứ gì đã xong, thứ gì đã cất đi.
- Da: "natural realistic skin texture with fine pores, no airbrushing". Không dùng "smooth skin".
- **Bộ lọc OpenAI** (hay chặn khi nhân vật mặc quần short, váy ngắn):
  - không tả cúi người, ngồi xổm hay quỳ **chính diện**; quay ngang hông, hoặc cận chỉ thấy tay và đồ vật;
  - thêm "She does not bend over", "modest, wholesome family-friendly look".
- GPT hay **tự thêm tay áo len, áo khoác, ba lô** và **đổi màu găng tay**, nên ghi rõ "bare forearms, no sleeves", "no backpack", màu găng.
- Không bắt AI vẽ chữ: nhãn, bao bì quay nghiêng hoặc ghi "no letters"; chữ thật thêm lúc dựng.

## 2. Video Muse: cấu trúc chia mục (chuẩn từ 2026-11-10)
Học từ khoảng 200 prompt Muse thật. Viết theo các mục, không viết một đoạn văn dài:
```
CHARACTER: <khối nhân vật khóa cứng: tóc, mặt, thân hình, da, trang phục, găng/tay trần — không đổi trong cả tập>
SCENE: <bối cảnh như khung đầu (và khung cuối), giữ mọi vật đúng cỡ, màu, vị trí>
LIGHT: <ánh sáng + "the light does not change during the shot">
CAMERA: Fixed camera, exactly the framing of the start frame, no zoom, no pan, no tilt. One continuous shot, no internal cut.
SHOTS:
  0.0-Xs: <hành động chính, X = số giây sẽ dùng; nêu tay/chân trụ, thứ tự động tác>
  X-10.0s: keeps working at the same steady pace in the same place; nothing new appears, no new task starts.
EXPRESSION: <biểu cảm, tách riêng khỏi chuyển động>
RULES: Every object that moves is carried or placed by her/his own hands, one at a time. Never stands idle or sways.
STYLE: Photorealistic real live-action footage, natural real-time speed, <khung 16:9 / 9:16>, natural colours.
AUDIO: <âm thanh cụ thể của hành động>; hoặc ghi thẳng "no music, no speech" nếu cần im.
NEGATIVE: <khối chuẩn bên dưới + lỗi riêng của cảnh>
Duration: 10 seconds.
```

### Khối NEGATIVE chuẩn (thêm vào mọi prompt video)
```
no facial drift or identity change between frames, no change of hairstyle or outfit, no body proportion change,
no extra or malformed fingers, no extra limbs, no clothing deformation, no tool changing shape, colour or size,
no objects appearing, multiplying or vanishing by themselves, no second person, no camera movement unless stated,
no internal cut, no slow motion, no text, no watermark, no logo
```
Thêm theo cảnh:
- đồ vật nhỏ lặp lại (hạt, đá, móc): "appears only where her fingers place it";
- đất, cỏ, cây: "no soil/plants growing or moving by themselves";
- thăng bằng, đứng một chân: "his left foot never lifts, slides or teleports";
- găng tay: "no gloves appearing or disappearing".

Mẫu tool tự đổi prompt cũ sang dạng chia mục: `content/elise-garden/long-form/tools/muse_prompt.py`.

## 3. Tiêu đề prompt kèm theo của muse_auto
`muse_auto` tự thêm `video_spec` từ `muse-chat.json` (khung, thời lượng, tốc độ). Video ngang 16:9 phải ghi rõ trong `video_spec`; nếu để trống, tool mặc định dọc 9:16.
