# Elise Wild, tập 01: Dựng lều chữ A trong rừng

> File bàn giao để làm tiếp ở session khác. Gồm đủ ý tưởng, nhân vật, nhịp có giây, prompt ảnh, prompt video và cách chạy tool.
> **Trạng thái: CHƯA DUYỆT.** Theo `CLAUDE.md`, phải gửi chủ dự án duyệt nội dung (mục 3) trước khi gen.

---

## 1. Series

**"Elise Wild"**: Elise một mình vào rừng, dựng trại và làm đồ sinh tồn bằng tay. Mỗi tập là một dự án hoàn chỉnh dài 20–60 giây.
Phần làm quay kiểu timelapse, kết tập bằng cảnh hoàng hôn hoặc đêm ấm cúng bên lửa trại. Video dọc 9:16 cho YouTube Shorts, Reels, TikTok.

Đây là series anh em của **"Elise DIY"**. Hồ sơ nhân vật gốc ở `content/elise-diy/models/` (`elise.md`, `elise-truoc.png`, `elise-model-sheet.png`).

### Gợi ý các tập tiếp theo

| Tập | Dự án | Cảnh kết |
|---|---|---|
| 01 | Dựng lều chữ A bằng cành thông và lá dương xỉ | Ngồi trong lều, mưa nhẹ, lửa trại |
| 02 | Xếp bếp đá ven suối, nhóm lửa bằng que đánh lửa | Lửa bập bùng lúc hoàng hôn |
| 03 | Làm bộ lọc nước bằng chai nhựa, than, cát, sỏi | Rót nước trong vào cốc inox |
| 04 | Nướng cá trên que bên lửa trại | Bữa tối dưới trời sao |
| 05 | Làm ghế và bàn từ khúc gỗ, buộc dây thừng | Uống trà ngắm sương sớm |
| 06 | Làm đèn lồng bằng hũ thủy tinh và nến | Cả khu trại sáng lung linh ban đêm |

---

## 2. Nhân vật: Elise (bản ngoài trời)

**Mô tả cố định, dán vào mọi prompt:**

```
Elise, a young European woman in her mid-20s, light brown hair in a neat messy bun with a few loose strands, light freckles across her nose and cheeks, fresh natural face, friendly confident smile, slim athletic build. Outdoor outfit: full-length light-wash denim overalls with rolled cuffs over a fitted white tank top, an open red-and-black flannel shirt tied around the waist, brown leather lace-up hiking boots, a small olive canvas backpack. Modest, wholesome, family-friendly outdoor adventure look.
```

**Bản ngắn, dùng trong prompt video:**
`Elise (young woman, light brown hair in a bun, freckles, denim overalls, white tank top, red flannel at the waist, hiking boots)`

Series ngoài trời dùng quần yếm **dài** thay cho quần short: trông thật hơn ngoài thiên nhiên, và bộ lọc an toàn của GPT ít chặn hơn (xem mục 7).

---

## 3. Nhịp tập 01 (khoảng 25 giây, 4 clip)

| Giây | Clip | Nhịp | Khung đầu → khung cuối |
|---|---|---|---|
| 0–5 | 1 | Elise đến khoảng rừng trống, nhấc 1 cây sào, buộc làm xà ngang giữa 2 cây thông | B → C |
| 5–11 | 2 | Dựa từng cành dài vào xà, xen kẽ hai bên, thành khung chữ A | C → D |
| 11–17 | 3 | Phủ lá dương xỉ và cành thông từ dưới lên, như lợp ngói; nắng chuyển từ sáng sang chiều | D → E |
| 17–25 | 4 | Đêm mưa nhẹ: lửa trại trước lều, Elise ngồi trong lều ôm cốc trà; máy quay tiến chậm từ góc rộng vào cận mặt | F → G |

Âm thanh: chim hót và tiếng suối, rồi tiếng dây thừng và cành khô, guitar acoustic nhẹ vào dần.
Kết bằng tiếng mưa, lửa tí tách, guitar ấm. Không lời.

---

## 4. Prompt gen ảnh (ChatGPT / Codex)

Gen theo thứ tự. Cột "gửi kèm" là ảnh tham chiếu đính kèm cùng prompt.

### A: Ảnh nhân vật, 16:9, gửi kèm `elise-truoc.png`
```
Photorealistic character reference sheet of one young European woman in her mid-20s, three views side by side (front, side, back), full body, plain light grey studio background. Keep the exact same face as the attached reference: light brown hair in a neat messy bun with a few loose strands, light freckles across her nose and cheeks, fresh natural face, friendly confident smile, slim athletic build. Outdoor outfit: full-length light-wash denim overalls with rolled cuffs over a fitted white tank top, an open red-and-black flannel shirt tied around the waist, brown leather lace-up hiking boots, a small olive canvas backpack. Modest, wholesome, family-friendly outdoor adventure look. Real photo, soft even lighting, no text, no logos.
```

### B: Đến khoảng rừng trống, 9:16, gửi kèm A
```
Photorealistic vertical 9:16 photo, fixed camera at chest height, slight three-quarter angle. A quiet pine forest clearing beside a small clear stream, soft golden morning light streaming through tall pine trees, light mist, mossy rocks, a fallen log, a pile of long straight dry branches and a heap of fresh green ferns on the ground. Two sturdy pine trees stand about 3 meters apart in the middle of the frame. Elise, the young woman from the reference (light brown hair in a bun, freckles, full-length denim overalls, white tank top, red flannel tied at the waist, hiking boots), stands upright between the two trees, smiling at the camera, holding a coil of rope; her olive backpack rests on the log. Modest, wholesome outdoor adventure look. Real photo, cinematic, no text, no logos.
```

### C: Đã buộc xà ngang, 9:16, gửi kèm A, B
```
Photorealistic vertical 9:16 photo, exactly the same forest clearing, trees, light and camera angle as the reference scene. A long straight wooden ridge pole is now lashed horizontally between the two pine trees at chest height with neat rope lashings. Elise (same woman and outfit as the reference) stands upright beside the ridge pole, pulling the last rope knot tight with both hands, face visible. The pile of long branches and the heap of ferns are still on the ground. Modest, wholesome outdoor adventure look. Real photo, no text, no logos.
```

### D: Xong khung chữ A, 9:16, gửi kèm A, C
```
Photorealistic vertical 9:16 photo, exactly the same forest clearing and camera angle as the reference scene. Long straight branches now lean against both sides of the ridge pole, evenly spaced, forming the open skeleton of an A-frame shelter. Elise (same woman and outfit) stands upright at the front of the shelter, placing the last branch, face visible and smiling. The heap of green ferns is still on the ground beside her. Modest, wholesome outdoor adventure look. Real photo, no text, no logos.
```

### E: Lều đã phủ kín lá, 9:16, gửi kèm A, D
```
Photorealistic vertical 9:16 photo, exactly the same forest clearing and camera angle as the reference scene. The A-frame shelter is now fully covered with thick overlapping layers of green ferns and pine boughs, a cozy dark opening at the front. Elise (same woman and outfit) stands upright beside the finished shelter, dusting off her hands and smiling proudly at the camera. Late afternoon golden light. Modest, wholesome outdoor adventure look. Real photo, no text, no logos.
```

### F: Đêm mưa, góc rộng, 9:16, gửi kèm A, E
```
Photorealistic vertical 9:16 photo, the same forest clearing and finished fern-covered A-frame shelter as the reference, now at blue-hour dusk with light rain. A small campfire in a ring of river stones burns in front of the shelter, warm orange glow on the ferns and wet ground, soft mist between the dark pine trees. Elise sits cross-legged inside the shelter opening, wrapped in the red flannel shirt, holding a steaming enamel mug, face lit by the fire. Cozy, cinematic, wholesome. Real photo, no text, no logos.
```

### G: Cận cảnh kết, 9:16, gửi kèm F
```
Photorealistic vertical 9:16 close-up, same night scene as the reference: Elise sitting inside the fern shelter opening, wrapped in the red flannel, both hands around a steaming white enamel mug, warm firelight on her freckled face, gentle smile, raindrops falling softly at the edge of the shelter, campfire bokeh in the foreground. Shallow depth of field, cozy, cinematic. Real photo, no text, no logos.
```

---

## 5. Prompt video cho Muse (mỗi clip gen 10 giây)

Tool tự gửi kèm khung đầu, khung cuối và ảnh A làm tham chiếu.

### Clip 1: buộc xà ngang (B → C, dùng 5 giây)
```
Real sped-up outdoor survival timelapse video, vertical 9:16, photorealistic, not animated, no text, no logos. Fixed camera, same framing as the start frame, Elise's face stays in frame. The video must start exactly like the start-frame image and end exactly like the end-frame image. Elise (young woman, light brown hair in a bun, freckles, denim overalls, white tank top, red flannel at the waist, hiking boots) picks up one long straight pole from the pile, lifts it between the two pine trees at chest height (0-3s), and lashes each end to a tree with rope, wrapping and knotting neatly (3-10s). Only one pole is used; the rest of the branch pile and the ferns stay on the ground. Natural forest sounds.
```
Âm thanh: chim hót buổi sáng, tiếng suối, tiếng dây thừng siết. Không lời.

### Clip 2: dựng khung chữ A (C → D, dùng 6 giây)
```
Real sped-up outdoor survival timelapse video, vertical 9:16, photorealistic, not animated, no text, no logos. Fixed camera, same framing as the start frame, Elise's face stays in frame. The video must start exactly like the start-frame image and end exactly like the end-frame image. Elise takes long straight branches from the pile one at a time and leans them against the ridge pole, alternating left and right sides, evenly spaced, until the open A-frame skeleton is complete as in the end frame. Branches never float, bend or multiply; the ridge pole stays fixed. Natural forest sounds.
```
Âm thanh: tiếng cành khô lách cách, guitar acoustic nhẹ bắt đầu vào. Không lời.

### Clip 3: phủ lá (D → E, dùng 6 giây)
```
Real sped-up outdoor survival timelapse video, vertical 9:16, photorealistic, not animated, no text, no logos. Fixed camera, same framing as the start frame, Elise's face stays in frame. The video must start exactly like the start-frame image and end exactly like the end-frame image. Elise gathers armfuls of green ferns and pine boughs and layers them on the A-frame from the bottom up, overlapping like roof shingles, until the whole shelter is thickly covered as in the end frame. The light slowly warms from morning to late afternoon gold. She finishes by dusting off her hands and smiling at the camera.
```
Âm thanh: tiếng lá xào xạc, guitar acoustic tiếp tục. Không lời.

### Clip 4: đêm mưa bên lửa trại (F → G, dùng 8 giây)
```
Cinematic night scene, vertical 9:16, photorealistic, not animated, no text, no logos. The video must start exactly like the start-frame image and end exactly like the end-frame image. Blue-hour forest with light rain, the fern-covered A-frame shelter glowing from a small campfire in a stone ring in front. Elise sits cross-legged inside the shelter opening wrapped in her red flannel, holding a steaming enamel mug. Slow gentle camera push-in from the wide shot (0-6s) to a warm close-up of her freckled face lit by the fire as she sips and smiles (6-10s). Raindrops, drifting smoke and sparks, cozy atmosphere.
```
Âm thanh: tiếng mưa nhẹ trên lá, lửa tí tách, guitar ấm dần lên rồi kết thúc nhẹ. Không lời.

---

## 6. Cách chạy bằng tool `muse-auto`

Tool nằm ở `C:\Users\HoaVan\Desktop\tool AI\muse-auto\`. README trong đó có đủ chi tiết. Các bước:

1. **Tạo thư mục:**
   ```
   content/elise-wild/
   ├── muse-chat.json          ← {"series": "Elise Wild", "url": ""}  (tool tự tạo side chat Muse riêng)
   ├── models/                 ← model sheet Elise bản ngoài trời (ảnh A, sau khi gen)
   └── ep01-lean-to/
       ├── gen-anh.csv         ← cột: stt, ten_file, ty_le, gui_kem, prompt
       ├── gen-video.csv       ← cột: stt, doan, luu_tai, khung_dau, khung_cuoi, anh_tham_chieu, prompt, am_thanh, dung_giay, che_do
       ├── anh/                ← chép elise-truoc.png vào đây (đổi tên theo tiền tố, ví dụ ew1-elise-truoc.png)
       └── goc.mp4             ← (tùy chọn) video tham khảo để QA so sánh
   ```
2. **Đặt tên file ảnh có tiền tố riêng cho tập**, ví dụ `ew1-A-elise-wild.png`, `ew1-B-den-noi.png`... Muse từng nhầm ảnh vì trùng tên với tập trước.
3. **Viết 2 file CSV** từ mục 4 và 5:
   - `gen-video.csv`: cột `dung_giay` lần lượt là 5, 6, 6, 8; cột `che_do` để `tang_toc`.
   - `anh_tham_chieu` của clip 1–3 là ảnh A, của clip 4 là ảnh E.
4. **Gen ảnh trước:** `python gpt_anh.py --csv "<ep>\gen-anh.csv"`. **Xem lại từng ảnh** (nhân vật, góc máy, bố cục) trước khi gửi Muse.
5. **Chạy phần còn lại:** `python muse_auto.py auto --dir "<ep>"`. Tool tự làm Muse, rồi QA từng clip (tự cắt đuôi lỗi hoặc gen lại 1 lần), rồi ghép, rồi QA cả video bằng GPT và Claude.
6. Đọc `video/qa/qa-report.md`. Ngưỡng đạt là 70/100.
7. Chốt bản cuối thì dọn file nháp, chỉ giữ `video/final.mp4` (theo `CLAUDE.md`).

---

## 7. Bài học rút ra từ Elise DIY tập 01 (bàn chai resin)

- **Mỗi clip chỉ một việc**, có ảnh chốt ở cả khung đầu và khung cuối. Clip phải làm 2 việc (ví dụ vừa xếp chai vừa đổ resin) thì về cuối hỏng hẳn.
- **Mô hình video của Muse vẽ lại khung đầu** và hay làm lệch số đồ vật lặp lại: 12 chai thành 16. Nên:
  - tránh cảnh phải đếm chính xác;
  - hoặc chọn con số mô hình hay vẽ ra ngay từ ảnh.

  Với lều: không ghi số cành cụ thể, chỉ ghi "evenly spaced".
- **Bộ lọc an toàn của OpenAI** từng chặn ảnh cảnh, xếp loại "sexual" ở bước ảnh đầu ra. Cách tránh:
  - gửi kèm ảnh nhân vật **góc trực diện**;
  - tả tư thế **đứng thẳng**;
  - thêm "modest, wholesome";
  - không dùng từ tả cơ thể.

  `gpt_anh.py` đã tự thử lại 1 lần với khung hình kín đáo hơn.
- **Ghi rõ vật lý của thao tác.** Ví dụ: buộc dây quấn quanh thân cây; lá phủ từ dưới lên.
- **Cảnh kết nên dài ít nhất 8 giây.** Nén quá thì mất cú chuyển động máy quay.
- Muse xuất video 704×1248. `ghep.py` phóng lên 1080×1920.
- Opera của tool cần bật **VPN của Opera** (trong `opera://settings/vpn`) vì IP bị chặn. Cứ thu nhỏ cửa sổ thoải mái, nhưng **đừng đóng**.
