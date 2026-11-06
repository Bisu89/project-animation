# EP01: production package đợt 1 (14 shot)

> File SINH TỰ ĐỘNG từ `data/episodes/EP01/shots.json` (`tools/garden_ep.py views`). Không sửa tay.

**Trạng thái:** prompt đã sẵn sàng, CHƯA có khung hay clip nào. Ảnh Elise dùng trang phục series Garden (`references/anh/gl1-A-elise-garden-truoc.png`, yếm short rằn ri + áo ba lỗ cam). Plate nền gen ở Gate B (`references/gen-anh.csv`) rồi chép sang `media/anh/`.

## Cách dùng với Muse AI (người dùng tự tạo)
Kinh nghiệm DIY/Wild được áp dụng có chọn lọc trong [PRODUCTION_PLAN §7](../../docs/PRODUCTION_PLAN.md#7-áp-dụng-kinh-nghiệm-diywild-cho-garden): kiểm keyframe trước Muse, chọn đoạn sạch, phân biệt lỗi clip và lỗi giao video. Không áp dụng timelapse reel cho Garden long-form.
1. Ảnh khung: tạo theo thứ tự trong bảng dưới (ảnh sau cần ảnh trước làm tham chiếu), lưu vào `episodes/EP01/media/anh/` đúng tên file. Có thể chạy `muse-auto/gpt_anh.py --csv episodes/EP01/media/gen-anh.csv`.
2. Mỗi clip trên Muse: tải lên **First frame**, **Last frame** (nếu có) và **Reference image**, rồi dán nguyên khối prompt. Prompt đã tự mô tả Elise và khu vườn, không cần Muse nhớ gì từ lần trước.
3. Tải video về, đổi tên đúng **Output filename** (`<shotId>_<nn>.mp4`) và thả vào `episodes/EP01/media/muse/`. Codex đối chiếu với `episodes/EP01/media/muse_queue.csv`.
4. Khung của clip nào đạt thì tạo clip đó trên Muse luôn, không chờ đủ bộ ảnh. Mỗi lúc chỉ một clip trong một chat.
5. **Clip trượt** (biến hình, vật tự hiện, tay méo, đổi trang phục): gửi lại như một video mới, tức đủ ảnh + prompt + dòng `FIX FROM PREVIOUS ATTEMPT: <lỗi>`, lưu thành `<clip>_r2.mp4` (bản cũ để nguyên). **Muse lỗi giao hàng** thì gửi lại nguyên tin. Không bao giờ chỉ nhắn "render lại".
6. Ảnh đã gửi Muse mà phải gen lại thì **đặt tên mới** (vd `gl1-SH018-b2.png`), vì Muse dùng lại ảnh trùng tên.
7. Thời lượng nguồn theo từng yêu cầu trong bảng; Codex chọn đoạn sạch (cột *Dùng trên timeline*), không mặc định bắt đầu ở giây 0. Bỏ đầu đứng hình, soi tự cắt cảnh và lỗi vật hiện hàng loạt ở đuôi; nếu không đủ coverage thì báo thiếu, không kéo khung đứng.
8. Nếu Muse không có đúng thời lượng yêu cầu, chọn mức dài hơn gần nhất; Codex kiểm đoạn sạch và trim. Không kéo khung đứng hoặc giảm tốc để bù clip thiếu. File tồn tại chưa có nghĩa là đã QA/approved.

Khối lượng: **36 ảnh** (5 plate + khung) + 1 ảnh Elise, **19 clip Muse**, 111.2 s trên timeline. Dự phòng 30% làm lại.

## Thứ tự tạo ảnh

| # | File | Gửi kèm |
|---:|---|---|
| 1 | `gl1-P-D-S0.png` | `gl1-P-D-S5.png`, `gl1-P-A-S0.png` |
| 2 | `gl1-SH010-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S0.png` |
| 3 | `gl1-SH010-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH010-a.png` |
| 4 | `gl1-SH011-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S0.png` |
| 5 | `gl1-SH011-b.png` | `gl1-SH011-a.png` |
| 6 | `gl1-P-C-S0.png` | `gl1-P-C-S3.png`, `gl1-P-A-S0.png` |
| 7 | `gl1-SH012-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S0.png` |
| 8 | `gl1-SH012-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH012-a.png` |
| 9 | `gl1-SH013-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S0.png` |
| 10 | `gl1-SH013-b.png` | `gl1-SH013-a.png` |
| 11 | `gl1-SH014-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S0.png` |
| 12 | `gl1-SH014-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH014-a.png` |
| 13 | `gl1-P-B-S0.png` | `gl1-R-aerial-S4.png`, `gl1-P-A-S0.png` |
| 14 | `gl1-SH015-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-B-S0.png` |
| 15 | `gl1-SH015-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH015-a.png` |
| 16 | `gl1-SH016-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S0.png` |
| 17 | `gl1-SH016-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH016-a.png` |
| 18 | `gl1-SH017-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S0.png` |
| 19 | `gl1-SH017-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH017-a.png` |
| 20 | `gl1-SH017-c.png` | `gl1-SH017-a.png`, `gl1-SH017-b.png` |
| 21 | `gl1-SH019-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S0.png` |
| 22 | `gl1-SH019-b.png` | `gl1-SH019-a.png` |
| 23 | `gl1-P-A-S0b.png` | `gl1-P-A-S0.png`, `gl1-P-A-S1.png` |
| 24 | `gl1-SH020-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S0b.png` |
| 25 | `gl1-SH021-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S0b.png` |
| 26 | `gl1-SH021-b.png` | `gl1-SH021-a.png` |
| 27 | `gl1-SH021-c.png` | `gl1-SH021-a.png`, `gl1-SH021-b.png` |
| 28 | `gl1-SH022-d.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S1.png` |
| 29 | `gl1-SH022-e.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH022-d.png` |
| 30 | `gl1-SH022-f.png` | `gl1-SH022-d.png`, `gl1-SH022-e.png` |
| 31 | `gl1-SH023-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S1.png` |
| 32 | `gl1-SH023-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH023-a.png` |
| 33 | `gl1-SH023-c.png` | `gl1-SH023-a.png`, `gl1-SH023-b.png` |
| 34 | `gl1-SH025-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-R-nha-kho.png` |
| 35 | `gl1-SH025-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH025-a.png` |
| 36 | `gl1-SH025-c.png` | `gl1-SH025-a.png`, `gl1-SH025-b.png` |

## Danh sách clip Muse

| Output filename | Shot | First frame | Last frame | Reference | Muse tạo | Dùng trên timeline |
|---|---|---|---|---|---:|---|
| `SH010_01.mp4` | SH010 | `gl1-SH010-a.png` | `gl1-SH010-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6.5 s @ 00:43.50 |
| `SH011_01.mp4` | SH011 | `gl1-SH011-a.png` | `gl1-SH011-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 7 s @ 00:50 |
| `SH012_01.mp4` | SH012 | `gl1-SH012-a.png` | `gl1-SH012-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 5.8 s @ 00:57 |
| `SH013_01.mp4` | SH013 | `gl1-SH013-a.png` | `gl1-SH013-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 8 s @ 01:02.80 |
| `SH014_01.mp4` | SH014 | `gl1-SH014-a.png` | `gl1-SH014-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 01:10.80 |
| `SH015_01.mp4` | SH015 | `gl1-SH015-a.png` | `gl1-SH015-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 8 s @ 01:16.80 |
| `SH016_01.mp4` | SH016 | `gl1-SH016-a.png` | `gl1-SH016-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6.8 s @ 01:24.80 |
| `SH017_01.mp4` | SH017 | `gl1-SH017-a.png` | `gl1-SH017-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6.2 s @ 01:31.60 |
| `SH017_02.mp4` | SH017 | `gl1-SH017-b.png` | `gl1-SH017-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6.2 s @ 01:37.80 |
| `SH019_01.mp4` | SH019 | `gl1-SH019-a.png` | `gl1-SH019-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 4.8 s @ 01:53.60 |
| `SH020_01.mp4` | SH020 | `gl1-SH020-a.png` | — | `gl1-A-elise-garden-truoc.png` | 10 s | 4.5 s @ 01:58.40 |
| `SH021_01.mp4` | SH021 | `gl1-SH021-a.png` | `gl1-SH021-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 4.8 s @ 02:02.90 |
| `SH021_02.mp4` | SH021 | `gl1-SH021-b.png` | `gl1-SH021-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 4 s @ 02:07.70 |
| `SH022_01.mp4` | SH022 | `gl1-SH022-d.png` | `gl1-SH022-e.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 5.5 s @ 02:11.70 |
| `SH022_02.mp4` | SH022 | `gl1-SH022-e.png` | `gl1-SH022-f.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 5.5 s @ 02:17.20 |
| `SH023_01.mp4` | SH023 | `gl1-SH023-a.png` | `gl1-SH023-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 02:22.70 |
| `SH023_02.mp4` | SH023 | `gl1-SH023-b.png` | `gl1-SH023-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 4.1 s @ 02:28.70 |
| `SH025_01.mp4` | SH025 | `gl1-SH025-a.png` | `gl1-SH025-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 5.5 s @ 02:43.30 |
| `SH025_02.mp4` | SH025 | `gl1-SH025-b.png` | `gl1-SH025-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 02:48.80 |

Bản dựng thử (Codex/Remotion): nối 8 shot theo đúng timecode. Thêm chữ 'Day 1/2/3' và nhãn AI. SH024 có slot 12 s: 2 s cảnh hoang + 10 s cảnh đã dọn. Mặc định cắt thẳng; nếu hòa thì giữ tổng slot 12 s, không trừ chồng thêm. Chưa cần lời dẫn.
Ảnh/clip vẫn chưa có. Manifest là kế hoạch nhận file; watcher/ingest và composition Garden chưa triển khai. Các bước dưới đây không gọi API hay tự gửi Muse.

---

## SH010 · SQ02 · 00:43.50–00:50

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH010**: Elise đi vào giữa cỏ, cúi nhổ một nắm cỏ xem rễ và lớp đất. |
| 2. Mục tiêu cảnh | Bắt đầu xem xét: cỏ có rễ gì, đất bên dưới thế nào. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S0.png` |
| 6. Thời lượng mục tiêu | **6.5 s** trên timeline = SH010_01.mp4 dùng 6.5 s (Muse tạo 10 s) |
| 7. First / Last frame | SH010_01.mp4: đầu `gl1-SH010-a.png`, cuối `gl1-SH010-b.png` |
| 9. Output filename | `SH010_01.mp4` |
| Camera / ánh sáng | CAM_D_GARDEN_SIDE · MS · Ngày 1 08:35 · S0_BEFORE→S0_BEFORE |
| Bố cục | MS theo hướng CAM_D, gần hơn ảnh nền: Elise giữa khung, ngập cỏ tới gối, cúi nhổ một nắm cỏ. |
| Âm thanh (cho Codex) | Cỏ bứt khỏi đất, rễ đứt lách tách, chim sáng. Không nhạc. |

### 4. Image prompt

**`gl1-P-D-S0.png`** (ảnh #1). Gửi kèm: `gl1-P-D-S5.png`, `gl1-P-A-S0.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate exactly the camera position, lens, framing, house, deck, shed, compost bin, apple tree and fence of the FIRST reference image. Only change: the yard is in the neglected overgrown state shown in the SECOND reference, before any work — no raised beds, no labels, no bare soil. The backyard is neglected and overgrown: knee-high pale dry grass with fresh green shoots, wild blackberry canes arching along the fences, clumps of broad-leaved dock, dandelions and nettles, a few old cracked terracotta pots, scattered stones and a rusty roll of wire half hidden in the grass. Light: soft, bright, slightly overcast early-spring morning, faint sun glow from the east. No person anywhere. Real photo, no text, no logos, no watermark.
```

**`gl1-SH010-a.png`** (ảnh #2). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S0.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Same backyard, camera direction and light as the SECOND reference, but a closer medium shot. The backyard is neglected and overgrown: knee-high pale dry grass with fresh green shoots, wild blackberry canes arching along the fences, clumps of broad-leaved dock, dandelions and nettles, a few old cracked terracotta pots, scattered stones and a rusty roll of wire half hidden in the grass. Light: soft, bright, slightly overcast early-spring morning, faint sun glow from the east. Elise stands knee-deep in the overgrown grass in the centre of the frame, three-quarter view toward the camera, bending forward with her right hand reaching for a handful of grass, a small closed brown notebook tucked under her left arm. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH010-b.png`** (ảnh #3). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH010-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, shed and the woman keep exactly the same size and position in the frame. A moment later: she holds a pulled clump of grass up at chest height in her right hand, looking closely at its pale roots and the dark soil clinging to them; the notebook still under her left arm. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH010_01.mp4`**: First frame `gl1-SH010-a.png` · Last frame `gl1-SH010-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise bends, grips a handful of grass and pulls it up with its roots, then lifts it to chest height and looks closely at the roots and soil, as in the end frame. Only this one clump comes out of the ground. The yard, fence, house, shed and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands (no gloves); natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk.
```

**Continuity:** Ngày 1, 08:35; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Trạng thái S0_BEFORE→S0_BEFORE

**Đạt khi:**
- [ ] Máy giữ khung giữa khung đầu và khung cuối
- [ ] Mặt và trang phục khớp ảnh tham chiếu
- [ ] Không vật tự hiện; dụng cụ không đổi hình
- [ ] Đoạn dùng được ≥ 8.5 s liền

---

## SH011 · SQ02 · 00:50–00:57

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH011**: Bay đào một lỗ thử: đất mùn nâu sẫm, rễ cỏ, một con giun. |
| 2. Mục tiêu cảnh | Đất tốt (mùn sẫm, có giun) — lý do làm vườn ở đây. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **7 s** trên timeline = SH011_01.mp4 dùng 7 s (Muse tạo 10 s) |
| 7. First / Last frame | SH011_01.mp4: đầu `gl1-SH011-a.png`, cuối `gl1-SH011-b.png` |
| 9. Output filename | `SH011_01.mp4` |
| Camera / ánh sáng | CLOSE (D→NE) · CU · Ngày 1 08:37 · S0_BEFORE→S0_BEFORE |
| Bố cục | CU sát đất, máy 0,6 m, 50 mm chúc xuống: tay trần + bay, khe hở giữa cỏ. |
| Âm thanh (cho Codex) | Bay cắm đất, đất vụn rơi, chim. Không nhạc. |

### 4. Image prompt

**`gl1-SH011-a.png`** (ảnh #4). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S0.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Close-up at ground level in the overgrown backyard of the second reference, camera 0.6 m high, 50 mm, looking down. Light: soft, bright, slightly overcast early-spring morning, faint sun glow from the east. Elise's bare left hand parts the long grass; her right hand pushes a small wooden-handled hand trowel into the soil in the gap. Only her hands and forearms are in frame. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH011-b.png`** (ảnh #5). Gửi kèm: `gl1-SH011-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera, framing, light, grass and hands. Only change: a small hole has been dug and the trowel blade lifts one scoop of dark, crumbly, moist loam with fine grass roots and one pink earthworm toward the camera. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH011_01.mp4`**: First frame `gl1-SH011-a.png` · Last frame `gl1-SH011-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She pushes the trowel down, levers out one scoop of dark crumbly soil and lifts it toward the camera, as in the end frame. The hole appears only where the trowel digs; one earthworm moves slightly in the soil. The yard, fence, house, shed and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk.
```

**Continuity:** Ngày 1, 08:37; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Trạng thái S0_BEFORE→S0_BEFORE

**Đạt khi:**
- [ ] Máy giữ khung giữa khung đầu và khung cuối
- [ ] Mặt và trang phục khớp ảnh tham chiếu
- [ ] Không vật tự hiện; dụng cụ không đổi hình
- [ ] Đoạn dùng được ≥ 7 s liền

---

## SH012 · SQ02 · 00:57–01:02.80

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH012**: Elise kéo thước dây dài từ cọc ở lối đi băng qua cỏ, đo khoảng đặt luống. |
| 2. Mục tiêu cảnh | Đo đạc = có kế hoạch, không làm bừa. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S0.png` |
| 6. Thời lượng mục tiêu | **5.8 s** trên timeline = SH012_01.mp4 dùng 5.8 s (Muse tạo 10 s) |
| 7. First / Last frame | SH012_01.mp4: đầu `gl1-SH012-a.png`, cuối `gl1-SH012-b.png` |
| 9. Output filename | `SH012_01.mp4` |
| Camera / ánh sáng | CAM_C_EAST_FENCE · MWS · Ngày 1 08:45 · S0_BEFORE→S0_BEFORE |
| Bố cục | MWS theo khung ảnh nền CAM_C (S0). |
| Âm thanh (cho Codex) | Thước dây rít ra, cỏ sột soạt dưới chân. Không nhạc. |

### 4. Image prompt

**`gl1-P-C-S0.png`** (ảnh #6). Gửi kèm: `gl1-P-C-S3.png`, `gl1-P-A-S0.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate exactly the camera position, lens, framing, house, deck, shed, compost bin, apple tree and fences of the FIRST reference image. Only change: the yard is in the neglected overgrown state shown in the SECOND reference — no raised beds, no wheelbarrow, no bare soil, the lawn grown long. The backyard is neglected and overgrown: knee-high pale dry grass with fresh green shoots, wild blackberry canes arching along the fences, clumps of broad-leaved dock, dandelions and nettles, a few old cracked terracotta pots, scattered stones and a rusty roll of wire half hidden in the grass. Light: early-spring morning sun low in the east, long soft shadows. No person anywhere. Real photo, no text, no logos, no watermark.
```

**`gl1-SH012-a.png`** (ảnh #7). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S0.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, shed and the woman keep exactly the same size and position in the frame. The backyard is neglected and overgrown: knee-high pale dry grass with fresh green shoots, wild blackberry canes arching along the fences, clumps of broad-leaved dock, dandelions and nettles, a few old cracked terracotta pots, scattered stones and a rusty roll of wire half hidden in the grass. Light: early-spring morning sun low in the east, long soft shadows. Elise stands in the long grass in the middle ground, holding an open yellow tape-measure case; the tape's end is hooked on a bamboo cane pushed into the ground about 2 m to her left, the tape stretched straight above the grass between them. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH012-b.png`** (ảnh #8). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH012-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, shed and the woman keep exactly the same size and position in the frame. A few seconds later: she has walked backwards to the right, the yellow tape now stretched about 4 m in one straight line from the cane, and she looks down at the tape. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH012_01.mp4`**: First frame `gl1-SH012-a.png` · Last frame `gl1-SH012-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise walks slowly backwards through the grass, letting out the yellow tape measure in a straight line from the cane, then looks down at it, as in the end frame. The tape stays one straight tape; the cane does not move. The yard, fence, house, shed and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands (no gloves); natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk.
```

**Continuity:** Ngày 1, 08:45; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Trạng thái S0_BEFORE→S0_BEFORE

**Đạt khi:**
- [ ] Máy giữ khung giữa khung đầu và khung cuối
- [ ] Mặt và trang phục khớp ảnh tham chiếu
- [ ] Không vật tự hiện; dụng cụ không đổi hình
- [ ] Đoạn dùng được ≥ 8 s liền

---

## SH013 · SQ02 · 01:02.80–01:10.80

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH013**: Bút chì phác trong sổ: sơ đồ sân — bãi cỏ bên trái, hai luống bên phải, lối đi giữa (không chữ). |
| 2. Mục tiêu cảnh | Lời dẫn 'start small': quyết định hai luống, giữ bãi cỏ. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **8 s** trên timeline = SH013_01.mp4 dùng 8 s (Muse tạo 10 s) |
| 7. First / Last frame | SH013_01.mp4: đầu `gl1-SH013-a.png`, cuối `gl1-SH013-b.png` |
| 9. Output filename | `SH013_01.mp4` |
| Camera / ánh sáng | CLOSE (A→N) · CU · Ngày 1 08:50 · S0_BEFORE→S0_BEFORE |
| Bố cục | CU qua vai: sổ tay mở trên tay trái, bút chì tay phải, sân hoang mờ phía sau (hướng nhà). |
| Âm thanh (cho Codex) | Bút chì trên giấy, chim xa. Lời dẫn N02 đè lên. |

### 4. Image prompt

**`gl1-SH013-a.png`** (ảnh #9). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S0.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Close-up over Elise's shoulder, camera 1.3 m high, 50 mm, looking down at an open small brown notebook held in her bare left hand; the overgrown backyard and the grey house of the second reference are soft and out of focus behind. Light: soft, bright, slightly overcast early-spring morning, faint sun glow from the east. Her right hand holds a pencil. The page shows a simple pencil sketch: a big rectangle for the yard with a strip for the house at the top, a line for the path and ONE small rectangle drawn in the right half. No letters, numbers or words anywhere on the page. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH013-b.png`** (ảnh #10). Gửi kèm: `gl1-SH013-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera, framing, light, hands and notebook. Only change: a second small rectangle is now drawn beside the first in the right half, a few light pencil hatch lines fill the left half (lawn) and a small circle marks a tree; the pencil tip finishes the last line. No letters, numbers or words anywhere. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH013_01.mp4`**: First frame `gl1-SH013-a.png` · Last frame `gl1-SH013-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise's pencil draws a second small rectangle beside the first, then a few light hatch lines on the left and a small circle, one line at a time, as in the end frame. Lines appear only under the pencil tip; nothing else appears on the page; no writing. The yard, fence, house, shed and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk.
```

**Continuity:** Ngày 1, 08:50; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Trạng thái S0_BEFORE→S0_BEFORE

**Đạt khi:**
- [ ] Máy giữ khung giữa khung đầu và khung cuối
- [ ] Mặt và trang phục khớp ảnh tham chiếu
- [ ] Không vật tự hiện; dụng cụ không đổi hình
- [ ] Đoạn dùng được ≥ 8 s liền

---

## SH014 · SQ02 · 01:10.80–01:16.80

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH014**: Bóng rào 1,8 m buổi sáng còn đổ dài trên cỏ; Elise đi tới khoảng nắng nhất ở nửa phải sân, cắm một cọc tre đánh dấu; nửa trái giữ làm bãi cỏ. |
| 2. Mục tiêu cảnh | Chọn chỗ nắng nhất cho rau, giữ nửa trái làm bãi cỏ. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **6 s** trên timeline = SH014_01.mp4 dùng 6 s (Muse tạo 10 s) |
| 7. First / Last frame | SH014_01.mp4: đầu `gl1-SH014-a.png`, cuối `gl1-SH014-b.png` |
| 9. Output filename | `SH014_01.mp4` |
| Camera / ánh sáng | CAM_A_ENTRANCE · MWS · Ngày 1 09:00 · S0_BEFORE→S0_BEFORE |
| Bố cục | Theo khung CAM_A (ảnh nền S0); bóng rào đông đổ dài trên cỏ bên phải. |
| Âm thanh (cho Codex) | Cọc cắm đất, chim sáng. Không nhạc. |

### 4. Image prompt

**`gl1-SH014-a.png`** (ảnh #11). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S0.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, shed and the woman keep exactly the same size and position in the frame. The backyard is neglected and overgrown: knee-high pale dry grass with fresh green shoots, wild blackberry canes arching along the fences, clumps of broad-leaved dock, dandelions and nettles, a few old cracked terracotta pots, scattered stones and a rusty roll of wire half hidden in the grass. Light: early-spring morning sun low in the east, long soft shadows. The long early-morning shadow of the 1.8 m east fence lies across the grass along the right edge of the yard. Elise stands in the right half of the yard just outside the fence shadow, in full sun, holding a bamboo cane upright with both hands, its tip touching the ground. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH014-b.png`** (ảnh #12). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH014-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, shed and the woman keep exactly the same size and position in the frame. A moment later: the bamboo cane stands pushed firmly into the ground on its own; Elise has straightened up beside it and looks toward the house. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH014_01.mp4`**: First frame `gl1-SH014-a.png` · Last frame `gl1-SH014-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise pushes the bamboo cane firmly into the ground with both hands until it stands on its own, then straightens up and looks toward the house, as in the end frame. The yard, fence, house, shed and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands (no gloves); natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk.
```

**Continuity:** Ngày 1, 09:00; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Trạng thái S0_BEFORE→S0_BEFORE

**Đạt khi:**
- [ ] Máy giữ khung giữa khung đầu và khung cuối
- [ ] Mặt và trang phục khớp ảnh tham chiếu
- [ ] Không vật tự hiện; dụng cụ không đổi hình
- [ ] Đoạn dùng được ≥ 8 s liền

---

## SH015 · SQ02 · 01:16.80–01:24.80

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH015**: Từ deck: Elise dỡ dụng cụ khỏi xe cút kít xanh sẫm ở mép đất: kéo cắt cành, chĩa, xẻng, xô. |
| 2. Mục tiêu cảnh | Chuẩn bị bắt tay vào việc: dụng cụ ra sân. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png`, `gl1-P-B-S0.png` |
| 6. Thời lượng mục tiêu | **8 s** trên timeline = SH015_01.mp4 dùng 8 s (Muse tạo 10 s) |
| 7. First / Last frame | SH015_01.mp4: đầu `gl1-SH015-a.png`, cuối `gl1-SH015-b.png` |
| 9. Output filename | `SH015_01.mp4` |
| Camera / ánh sáng | CAM_B_PORCH · WS · Ngày 1 09:05 · S0_BEFORE→S0_BEFORE |
| Bố cục | WS từ deck (ảnh nền CAM_B S0), xe cút kít trên sân bê tông dưới chân bậc. |
| Âm thanh (cho Codex) | Kim loại chạm nhau, xẻng tựa gỗ, chim. Không nhạc. |

### 4. Image prompt

**`gl1-P-B-S0.png`** (ảnh #13). Gửi kèm: `gl1-R-aerial-S4.png`, `gl1-P-A-S0.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. The same backyard as both reference images (the first shows the layout from above). New camera B: standing on the wooden deck at the back of the house, 2.2 m high, 35 mm, looking south-east and down over the yard: the deck railing and the top of the deck steps at the bottom edge, the small concrete patio pad below the steps, the overgrown yard beyond, the east fence on the left, the back fence with its wooden gate in the distance, the grey shed and the bare apple tree at the right edge. The yard is in the neglected overgrown state of the second reference, before any work — no beds, no bare soil. The backyard is neglected and overgrown: knee-high pale dry grass with fresh green shoots, wild blackberry canes arching along the fences, clumps of broad-leaved dock, dandelions and nettles, a few old cracked terracotta pots, scattered stones and a rusty roll of wire half hidden in the grass. Light: early-spring morning sun low in the east, long soft shadows. No person anywhere. Real photo, no text, no logos, no watermark.
```

**`gl1-SH015-a.png`** (ảnh #14). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-B-S0.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, shed and the woman keep exactly the same size and position in the frame. The backyard is neglected and overgrown: knee-high pale dry grass with fresh green shoots, wild blackberry canes arching along the fences, clumps of broad-leaved dock, dandelions and nettles, a few old cracked terracotta pots, scattered stones and a rusty roll of wire half hidden in the grass. Light: early-spring morning sun low in the east, long soft shadows. A dark-green metal wheelbarrow stands on the small concrete patio pad below the deck steps, holding long-handled loppers, a garden fork, a spade, a short hand fork and a black rubber bucket. Elise stands beside it, lifting the spade out with both hands. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH015-b.png`** (ảnh #15). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH015-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, shed and the woman keep exactly the same size and position in the frame. A few seconds later: the spade and the garden fork now lean against the side of the deck steps; Elise sets the black rubber bucket down on the grass; the loppers and the hand fork are still in the wheelbarrow. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH015_01.mp4`**: First frame `gl1-SH015-a.png` · Last frame `gl1-SH015-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise lifts the spade and then the garden fork out of the wheelbarrow, one at a time, and leans them against the deck steps, then sets the black bucket down on the grass, as in the end frame. Each tool moves only in her hands; the wheelbarrow stays in place. The yard, fence, house, shed and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands (no gloves); natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk.
```

**Continuity:** Ngày 1, 09:05; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Trạng thái S0_BEFORE→S0_BEFORE

**Đạt khi:**
- [ ] Máy giữ khung giữa khung đầu và khung cuối
- [ ] Mặt và trang phục khớp ảnh tham chiếu
- [ ] Không vật tự hiện; dụng cụ không đổi hình
- [ ] Đoạn dùng được ≥ 8.5 s liền

---

## SH016 · SQ02 · 01:24.80–01:31.60

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH016**: Elise đeo găng da, cầm kéo cắt cành, bước về phía rào mâm xôi. |
| 2. Mục tiêu cảnh | Chuyển sang làm: đeo găng, cầm kéo cắt cành. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **6.8 s** trên timeline = SH016_01.mp4 dùng 6.8 s (Muse tạo 10 s) |
| 7. First / Last frame | SH016_01.mp4: đầu `gl1-SH016-a.png`, cuối `gl1-SH016-b.png` |
| 9. Output filename | `SH016_01.mp4` |
| Camera / ánh sáng | CLOSE (D→NE) · MCU · Ngày 1 09:08 · S0_BEFORE→S0_BEFORE |
| Bố cục | MCU ngang hông, hướng CAM_D (sân hoang, nhà phía sau). |
| Âm thanh (cho Codex) | Găng da cọ tay, kéo cắt cành nhấc lên. Không nhạc. |

### 4. Image prompt

**`gl1-SH016-a.png`** (ảnh #16). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S0.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Medium close-up from the waist up in the overgrown backyard of the second reference, the grey house soft behind. Light: early-spring morning sun low in the east, long soft shadows. Elise holds a pair of tan leather gardening gloves and is pulling the right glove onto her right hand; her left hand is still bare. Long-handled loppers rest across the top of a black rubber bucket beside her. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH016-b.png`** (ảnh #17). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH016-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, shed and the woman keep exactly the same size and position in the frame. A few seconds later: both gloves are on; she holds the loppers in both gloved hands and turns toward the right, toward the fence. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH016_01.mp4`**: First frame `gl1-SH016-a.png` · Last frame `gl1-SH016-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise pulls on the right glove, then the left glove, flexes her fingers, and picks up the loppers from the bucket with both hands, turning toward the fence, as in the end frame. The yard, fence, house, shed and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk.
```

**Continuity:** Ngày 1, 09:08; Găng: đổi giữa clip; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Trạng thái S0_BEFORE→S0_BEFORE

**Đạt khi:**
- [ ] Máy giữ khung giữa khung đầu và khung cuối
- [ ] Mặt và trang phục khớp ảnh tham chiếu
- [ ] Không vật tự hiện; dụng cụ không đổi hình
- [ ] Đoạn dùng được ≥ 8.5 s liền

---

## SH017 · SQ03 · 01:31.60–01:44

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH017**: Cắt các vòm mâm xôi sát gốc, kéo cành đã cắt lên tấm bạt. |
| 2. Mục tiêu cảnh | Việc khó nhất trước: cắt mâm xôi dại sát gốc. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **12.4 s** trên timeline = SH017_01.mp4 dùng 6.2 s (Muse tạo 10 s) + SH017_02.mp4 dùng 6.2 s (Muse tạo 10 s) |
| 7. First / Last frame | SH017_01.mp4: đầu `gl1-SH017-a.png`, cuối `gl1-SH017-b.png`<br>SH017_02.mp4: đầu `gl1-SH017-b.png`, cuối `gl1-SH017-c.png` |
| 9. Output filename | `SH017_01.mp4`, `SH017_02.mp4` |
| Camera / ánh sáng | CLOSE (D→E) · MS · Ngày 1 09:20 · S0_BEFORE→S0_BEFORE |
| Bố cục | MS nhìn về rào đông: vòm mâm xôi dại, tấm bạt xanh trên cỏ bên phải. |
| Âm thanh (cho Codex) | Kéo cắt cành bập, gai cọ sột soạt. Không nhạc. / Cành gai kéo lê trên bạt. Không nhạc. |

### 4. Image prompt

**`gl1-SH017-a.png`** (ảnh #18). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S0.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Medium shot facing the east fence of the overgrown backyard of the second reference, camera 1.4 m high, 35 mm. Light: soft morning sun from the east through thin cloud. Thick arching wild blackberry canes grow against the weathered cedar fence. Elise, gloved, stands in front of them, the jaws of her loppers around one thick cane near its base. A green tarp lies on the grass to her right with a few cut canes already on it. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH017-b.png`** (ảnh #19). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH017-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, shed and the woman keep exactly the same size and position in the frame. A moment later: that cane is cut; she grips its cut end with her left gloved hand and pulls it free from the tangle, the loppers in her right hand. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH017-c.png`** (ảnh #20). Gửi kèm: `gl1-SH017-a.png`, `gl1-SH017-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, shed and the woman keep exactly the same size and position in the frame. A few seconds later: she stands upright beside the green tarp, seen in profile, holding the cut cane out at arm's length in her gloved hand and lowering it onto the other canes on the tarp. She does not bend over. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH017_01.mp4`**: First frame `gl1-SH017-a.png` · Last frame `gl1-SH017-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise squeezes the loppers and cuts the thick cane near its base, then grips the cut end with her left gloved hand and pulls it free from the tangle, as in the end frame. Only this one cane comes free. The yard, fence, house, shed and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH017_02.mp4`**: First frame `gl1-SH017-b.png` · Last frame `gl1-SH017-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She carries the cut cane two steps to the tarp and, standing upright, lowers it onto the others, as in the end frame. Canes already on the tarp do not move; no new canes appear. The yard, fence, house, shed and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk.
```

**Continuity:** Ngày 1, 09:20; Găng: có; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Trạng thái S0_BEFORE→S0_BEFORE

**Đạt khi:**
- [ ] Máy giữ khung giữa khung đầu và khung cuối
- [ ] Mặt và trang phục khớp ảnh tham chiếu
- [ ] Không vật tự hiện; dụng cụ không đổi hình
- [ ] Đoạn dùng được ≥ 5 s liền

---

## SH019 · SQ03 · 01:53.60–01:58.40

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH019**: Chĩa lớn xắn đất, bẩy lên, rễ cỏ gà trắng được gỡ ra từng đoạn. |
| 2. Mục tiêu cảnh | Chất liệu đất (ASMR): rễ cỏ gà trắng bị gỡ ra. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **4.8 s** trên timeline = SH019_01.mp4 dùng 4.8 s (Muse tạo 10 s) |
| 7. First / Last frame | SH019_01.mp4: đầu `gl1-SH019-a.png`, cuối `gl1-SH019-b.png` |
| 9. Output filename | `SH019_01.mp4` |
| Camera / ánh sáng | CLOSE (C→W) · CU · Ngày 1 10:20 · S0_BEFORE→S0_BEFORE |
| Bố cục | CU thấp: chĩa lớn cắm đất giữa cỏ, chỉ thấy chân, giày, găng. |
| Âm thanh (cho Codex) | Chĩa cắm đất, rễ đứt, đất vụn. Không nhạc. |

### 4. Image prompt

**`gl1-SH019-a.png`** (ảnh #21). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S0.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Close-up low to the ground in the overgrown backyard of the second reference, camera 0.8 m high, 35 mm. Light: soft morning sun from the east through thin cloud. A four-tined garden fork is pushed into the soil among grass clumps; Elise's white sneaker rests on the fork's step and her gloved hands hold the wooden handle. Only her lower legs, sneakers and gloved hands are in frame. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH019-b.png`** (ảnh #22). Gửi kèm: `gl1-SH019-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera, framing, light and grass. Only change: the fork has been levered back and a clod of soil is lifted; her left gloved hand pulls a long white creeping grass root strand out of the clod. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH019_01.mp4`**: First frame `gl1-SH019-a.png` · Last frame `gl1-SH019-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise steps on the fork, levers the handle back, lifts the clod and pulls one long white root strand out of it with her left hand, as in the end frame. Only this one clod moves. The yard, fence, house, shed and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk.
```

**Continuity:** Ngày 1, 10:20; Găng: có; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Trạng thái S0_BEFORE→S0_BEFORE

**Đạt khi:**
- [ ] Máy giữ khung giữa khung đầu và khung cuối
- [ ] Mặt và trang phục khớp ảnh tham chiếu
- [ ] Không vật tự hiện; dụng cụ không đổi hình
- [ ] Đoạn dùng được ≥ 8.5 s liền

---

## SH020 · SQ03 · 01:58.40–02:02.90

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH020**: Cùng góc cổng: chỗ BED-01 đã sạch, chỗ BED-02 còn cỏ; Elise đẩy xe cỏ dại về thùng ủ cạnh nhà kho. |
| 2. Mục tiêu cảnh | Mốc tiến độ cùng khung cổng: đã sạch một nửa. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S0b.png` |
| 6. Thời lượng mục tiêu | **4.5 s** trên timeline = SH020_01.mp4 dùng 4.5 s (Muse tạo 10 s) |
| 7. First / Last frame | SH020_01.mp4: đầu `gl1-SH020-a.png`, cuối không có |
| 9. Output filename | `SH020_01.mp4` |
| Camera / ánh sáng | CAM_A_ENTRANCE · WS · Ngày 1 11:30 · S0_BEFORE→S1_CLEARED |
| Bố cục | WS khung CAM_A, ảnh nền S0b (khu rau sạch một nửa). |
| Âm thanh (cho Codex) | Bánh xe cút kít lăn trên cỏ, chim trưa. Không nhạc. |

### 4. Image prompt

**`gl1-P-A-S0b.png`** (ảnh #23). Gửi kèm: `gl1-P-A-S0.png`, `gl1-P-A-S1.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate exactly the camera position, lens, framing, house, deck, shed, compost bin, apple tree and fence of the FIRST reference image. Only change — work half done: in the right half of the yard, the left part of the vegetable area (where the left bed will go, as in the SECOND reference) is cleared to bare, raked dark-brown soil, about 2.5 m wide; the right part of the vegetable area next to the east fence is still overgrown with tall grass and dock; the lawn half on the left is still uncut long grass; a heap of pulled weeds lies on a green tarp at the edge of the cleared patch; no canes, no strings, no beds. Light: bright late-morning spring sun from the south-east, short soft shadows. No person anywhere. Real photo, no text, no logos, no watermark.
```

**`gl1-SH020-a.png`** (ảnh #24). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S0b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, shed and the woman keep exactly the same size and position in the frame. Light: bright late-morning spring sun from the south-east, short soft shadows. Elise pushes the dark-green wheelbarrow, heaped high with pulled weeds, across the long grass in the middle of the frame, heading left toward the compost bin by the shed. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH020_01.mp4`**: First frame `gl1-SH020-a.png` · Last frame không · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image. Only this one woman is ever in the scene; no other person appears. Elise pushes the full wheelbarrow steadily across the grass toward the compost bin by the shed on the left. The cleared patch and the remaining overgrowth do not change; no weeds fall off. The yard, fence, house, shed and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk.
```

**Continuity:** Ngày 1, 11:30; Găng: có; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Trạng thái S0_BEFORE→S1_CLEARED

**Đạt khi:**
- [ ] Máy giữ khung giữa khung đầu và khung cuối
- [ ] Mặt và trang phục khớp ảnh tham chiếu
- [ ] Không vật tự hiện; dụng cụ không đổi hình
- [ ] Đoạn dùng được ≥ 8.5 s liền

---

## SH021 · SQ03 · 02:02.90–02:11.70

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH021**: Tay nhặt đá và mảnh chậu vỡ thả vào xô kim loại; kéo cuộn dây thép gỉ khỏi đất. |
| 2. Mục tiêu cảnh | Rác ra khỏi đất = sạch thật. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **8.8 s** trên timeline = SH021_01.mp4 dùng 4.8 s (Muse tạo 10 s) + SH021_02.mp4 dùng 4 s (Muse tạo 10 s) |
| 7. First / Last frame | SH021_01.mp4: đầu `gl1-SH021-a.png`, cuối `gl1-SH021-b.png`<br>SH021_02.mp4: đầu `gl1-SH021-b.png`, cuối `gl1-SH021-c.png` |
| 9. Output filename | `SH021_01.mp4`, `SH021_02.mp4` |
| Camera / ánh sáng | CLOSE (D→NE) · CU · Ngày 1 12:30 · S1_CLEARED→S1_CLEARED |
| Bố cục | CU đất trần ở khu đã dọn; xô kim loại bên phải. |
| Âm thanh (cho Codex) | Đá lách cách trong xô kim loại. Không nhạc. / Dây thép rít trong đất. Không nhạc. |

### 4. Image prompt

**`gl1-SH021-a.png`** (ảnh #25). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S0b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Close-up on the freshly cleared bare dark soil of the backyard in the second reference, camera 0.9 m high, 35 mm, looking down. Light: soft midday spring sun, short shadows. Elise's gloved right hand picks up a fist-sized stone; a metal bucket beside it holds a few stones and broken terracotta shards; the end of a rusty wire sticks out of the soil nearby. Only her gloved hands, forearms and knees are in frame. She wears TAN BROWN LEATHER gardening gloves (the same tan leather gloves as in the other scenes) — not white, not grey, not canvas. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH021-b.png`** (ảnh #26). Gửi kèm: `gl1-SH021-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera, framing and light. Keep the same tan brown leather gloves. Only change: two more stones are in the bucket and her gloved hands grip the end of the rusty wire. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH021-c.png`** (ảnh #27). Gửi kèm: `gl1-SH021-a.png`, `gl1-SH021-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the second reference exactly — same camera, framing and light. Keep the same tan brown leather gloves. Only change: the rusty wire has been pulled out of the soil in loose loops and she holds it up in both gloved hands, a shallow groove left in the soil. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH021_01.mp4`**: First frame `gl1-SH021-a.png` · Last frame `gl1-SH021-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise picks up two stones from the soil, one at a time, and drops them into the metal bucket, then grips the end of the rusty wire, as in the end frame. Stones appear in the bucket only when her hand drops them. The yard, fence, house, shed and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH021_02.mp4`**: First frame `gl1-SH021-b.png` · Last frame `gl1-SH021-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She pulls the rusty wire steadily out of the soil in loose loops and holds it up, as in the end frame. Only this one wire comes out. The yard, fence, house, shed and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk.
```

**Continuity:** Ngày 1, 12:30; Găng: có; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Trạng thái S1_CLEARED→S1_CLEARED

**Đạt khi:**
- [ ] Máy giữ khung giữa khung đầu và khung cuối
- [ ] Mặt và trang phục khớp ảnh tham chiếu
- [ ] Không vật tự hiện; dụng cụ không đổi hình
- [ ] Đoạn dùng được ≥ 5 s liền

---

## SH022 · SQ03 · 02:11.70–02:22.70

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH022**: Elise đẩy máy cắt cỏ cuộn đẩy tay (không động cơ) cắt bãi cỏ nửa trái: khung chỉ có cỏ, ranh rõ cỏ cao/cỏ đã cắt; quay đầu ở cuối dải. |
| 2. Mục tiêu cảnh | Biến đổi lớn nhất ngày 1: bãi cỏ sống lại. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **11 s** trên timeline = SH022_01.mp4 dùng 5.5 s (Muse tạo 10 s) + SH022_02.mp4 dùng 5.5 s (Muse tạo 10 s) |
| 7. First / Last frame | SH022_01.mp4: đầu `gl1-SH022-d.png`, cuối `gl1-SH022-e.png`<br>SH022_02.mp4: đầu `gl1-SH022-e.png`, cuối `gl1-SH022-f.png` |
| 9. Output filename | `SH022_01.mp4`, `SH022_02.mp4` |
| Camera / ánh sáng | CLOSE (C→W (trên bãi cỏ)) · MS · Ngày 1 13:30 · S1_CLEARED→S1_CLEARED |
| Bố cục | MS thấp đứng trên bãi cỏ nhìn tây (cây táo, nhà kho); KHÔNG có đất trống trong khung. |
| Âm thanh (cho Codex) | Lưỡi cuộn máy cắt cỏ lách cách, cỏ rơi, chim. Không nhạc. / Lưỡi cuộn máy cắt cỏ lách cách, cỏ rơi, chim. Không nhạc. |

### 4. Image prompt

**`gl1-SH022-d.png`** (ảnh #28). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S1.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Low medium shot standing on the lawn of the backyard in the second reference, camera 1.0 m high, 35 mm, looking west toward the bare apple tree and the grey shed. ONLY lawn is in the frame — no bare soil, no vegetable area anywhere. The lawn is half mowed: the right half of the frame is short, freshly mowed bright green grass with neat stripes; the left half is still knee-high pale dry uncut grass; a clean straight edge runs from the background toward the camera between them. Light: soft early-afternoon spring sun from the south (left), thin high cloud. Elise walks in the middle ground pushing an old-fashioned manual push reel lawn mower: a green metal cylinder of spiral reel blades between two small wheels, a long T-handle, a small grass catcher at the back; NO engine, NO motor housing, NOT red, NOT a petrol mower forward along the edge, cutting into the long grass; a thin spray of clippings flies into the catcher. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH022-e.png`** (ảnh #29). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH022-d.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the tree, shed, fence and the woman keep exactly the same size and position in the frame. A few seconds later: Elise has pushed the reel mower further toward the camera along the edge; one more mowed stripe has appeared only along the path of the mower, so the long grass on the left is a little narrower. Same mower: an old-fashioned manual push reel lawn mower: a green metal cylinder of spiral reel blades between two small wheels, a long T-handle, a small grass catcher at the back; NO engine, NO motor housing, NOT red, NOT a petrol mower. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH022-f.png`** (ảnh #30). Gửi kèm: `gl1-SH022-d.png`, `gl1-SH022-e.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the tree, shed, fence and the woman keep exactly the same size and position in the frame. A few seconds later: she has turned the reel mower at the end of the stripe and pushes it back away from the camera along the new edge; the long grass on the left is narrower again. Same mower: an old-fashioned manual push reel lawn mower: a green metal cylinder of spiral reel blades between two small wheels, a long T-handle, a small grass catcher at the back; NO engine, NO motor housing, NOT red, NOT a petrol mower. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH022_01.mp4`**: First frame `gl1-SH022-d.png` · Last frame `gl1-SH022-e.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise pushes the manual reel mower (an old-fashioned manual push reel lawn mower: a green metal cylinder of spiral reel blades between two small wheels, a long T-handle, a small grass catcher at the back; NO engine, NO motor housing, NOT red, NOT a petrol mower) forward through the edge of the long grass toward the camera. The mower rolls only over grass; grass becomes short only directly behind the spinning reel; nothing grows anywhere; the mower keeps exactly the same shape and colour, as in the end frame. The yard, fence, house, shed and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH022_02.mp4`**: First frame `gl1-SH022-e.png` · Last frame `gl1-SH022-f.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. At the end of the stripe Elise turns the reel mower around and pushes it back along the new edge, away from the camera, as in the end frame. The mower rolls only over grass and keeps exactly the same shape and colour; grass becomes short only behind the reel. The yard, fence, house, shed and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk, petrol or red mower, grass growing on bare soil, mower changing shape.
```

**Continuity:** Ngày 1, 13:30; Găng: đổi giữa clip; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Trạng thái S1_CLEARED→S1_CLEARED

**Đạt khi:**
- [ ] Máy giữ khung giữa khung đầu và khung cuối
- [ ] Mặt và trang phục khớp ảnh tham chiếu
- [ ] Không vật tự hiện; dụng cụ không đổi hình
- [ ] Đoạn dùng được ≥ 8.5 s liền

---

## SH023 · SQ03 · 02:22.70–02:32.80

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH023**: Đo 1,2 × 2,4 m, cắm cọc tre ở góc, căng dây trắng; kéo thước đo hai đường chéo. |
| 2. Mục tiêu cảnh | Lần đầu thấy vị trí luống: đo 4×8 ft, cắm cọc, căng dây. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **10.1 s** trên timeline = SH023_01.mp4 dùng 6 s (Muse tạo 10 s) + SH023_02.mp4 dùng 4.1 s (Muse tạo 10 s) |
| 7. First / Last frame | SH023_01.mp4: đầu `gl1-SH023-a.png`, cuối `gl1-SH023-b.png`<br>SH023_02.mp4: đầu `gl1-SH023-b.png`, cuối `gl1-SH023-c.png` |
| 9. Output filename | `SH023_01.mp4`, `SH023_02.mp4` |
| Camera / ánh sáng | CLOSE (A→N) · MS · Ngày 1 14:30 · S1_CLEARED→S1_CLEARED |
| Bố cục | MS ở khu rau đã dọn: Elise quỳ trên đất trần, thước dây vàng dọc mặt đất. |
| Âm thanh (cho Codex) | Cọc cắm đất, dây căng bật. Không nhạc. / Dây trắng kéo trên đất, cọc cắm. Không nhạc. |

### 4. Image prompt

**`gl1-SH023-a.png`** (ảnh #31). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S1.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Medium shot in the cleared vegetable area of the backyard in the second reference, camera 1.2 m high, 35 mm, looking toward the house. Light: warm mid-afternoon spring sun from the south-west. Bare raked dark soil; one bamboo cane stands at the near-left corner with a yellow tape measure stretched from it along the soil. Elise kneels at the end of the tape, pushing a second bamboo cane into the soil; a ball of white string lies beside her knee. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH023-b.png`** (ảnh #32). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH023-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, shed and the woman keep exactly the same size and position in the frame. A moment later: the second cane stands in the soil and she ties white string to it; the string runs taut back to the first cane along the tape. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH023-c.png`** (ảnh #33). Gửi kèm: `gl1-SH023-a.png`, `gl1-SH023-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, shed and the woman keep exactly the same size and position in the frame. Later: a third cane stands at the next corner and she ties the string to it, so the string now runs taut along two sides of the rectangle; the tape lies on the soil. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH023_01.mp4`**: First frame `gl1-SH023-a.png` · Last frame `gl1-SH023-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise pushes the second cane into the soil, then ties the white string around it and pulls it taut back toward the first cane, as in the end frame. Canes appear only where she pushes them. The yard, fence, house, shed and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH023_02.mp4`**: First frame `gl1-SH023-b.png` · Last frame `gl1-SH023-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She unrolls the string along the soil to the next corner, pushes a third cane in and ties the string to it, as in the end frame. Strings stay straight; no extra canes appear. The yard, fence, house, shed and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk.
```

**Continuity:** Ngày 1, 14:30; Găng: có; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Trạng thái S1_CLEARED→S1_CLEARED

**Đạt khi:**
- [ ] Máy giữ khung giữa khung đầu và khung cuối
- [ ] Mặt và trang phục khớp ảnh tham chiếu
- [ ] Không vật tự hiện; dụng cụ không đổi hình
- [ ] Đoạn dùng được ≥ 6 s liền

---

## SH025 · SQ03 · 02:43.30–02:54.80

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH025**: Cuối ngày 1: Elise đẩy xe cỏ cuối vào thùng ủ, dựng dụng cụ vào giá; nắng chiều thấp. |
| 2. Mục tiêu cảnh | Đóng ngày 1: dọn dẹp ở nhà kho trong nắng chiều. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **11.5 s** trên timeline = SH025_01.mp4 dùng 5.5 s (Muse tạo 10 s) + SH025_02.mp4 dùng 6 s (Muse tạo 10 s) |
| 7. First / Last frame | SH025_01.mp4: đầu `gl1-SH025-a.png`, cuối `gl1-SH025-b.png`<br>SH025_02.mp4: đầu `gl1-SH025-b.png`, cuối `gl1-SH025-c.png` |
| 9. Output filename | `SH025_01.mp4`, `SH025_02.mp4` |
| Camera / ánh sáng | CLOSE (nhà kho (góc tây nam)) · WS · Ngày 1 16:30 · S1_CLEARED→S1_CLEARED |
| Bố cục | MS tại nhà kho (theo ảnh gl1-R-nha-kho), nắng chiều thấp. |
| Âm thanh (cho Codex) | Cỏ trượt vào thùng ủ, bánh xe, chim chiều. Không nhạc. / Sắt chạm móc treo, cửa gỗ, chim chiều. Không nhạc. |

### 4. Image prompt

**`gl1-SH025-a.png`** (ảnh #34). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-R-nha-kho.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Medium shot at the grey shed and slatted wooden compost bin of the second reference, same design and colours. Light: low warm late-afternoon sun from the west, long soft shadows, golden but natural. The shed doors are open. Elise tips the dark-green wheelbarrow, heaped with pulled weeds, into the compost bin; the weeds start to slide in. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH025-b.png`** (ảnh #35). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH025-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, shed and the woman keep exactly the same size and position in the frame. A few seconds later: the wheelbarrow is empty and set down on its legs; the green weeds are heaped on top of the dark compost in the bin; she holds the garden fork. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH025-c.png`** (ảnh #36). Gửi kèm: `gl1-SH025-a.png`, `gl1-SH025-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, shed and the woman keep exactly the same size and position in the frame. A few seconds later: she hangs the garden fork on the tool rack inside the open shed, next to the spade already hanging there. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH025_01.mp4`**: First frame `gl1-SH025-a.png` · Last frame `gl1-SH025-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise tips the wheelbarrow forward and the weeds slide into the compost bin; she shakes it once, sets it back down on its legs and picks up the garden fork, as in the end frame. Only these weeds move. The yard, fence, house, shed and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH025_02.mp4`**: First frame `gl1-SH025-b.png` · Last frame `gl1-SH025-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She carries the garden fork into the open shed and hangs it on the tool rack next to the spade, as in the end frame. Tools already on the rack do not move. The yard, fence, house, shed and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk.
```

**Continuity:** Ngày 1, 16:30; Găng: có; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Trạng thái S1_CLEARED→S1_CLEARED

**Đạt khi:**
- [ ] Máy giữ khung giữa khung đầu và khung cuối
- [ ] Mặt và trang phục khớp ảnh tham chiếu
- [ ] Không vật tự hiện; dụng cụ không đổi hình
- [ ] Đoạn dùng được ≥ 7.5 s liền

