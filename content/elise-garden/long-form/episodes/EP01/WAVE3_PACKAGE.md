# EP01: production package đợt 3 (15 shot)

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

Khối lượng: **40 ảnh** (5 plate + khung) + 1 ảnh Elise, **26 clip Muse**, 160.1 s trên timeline. Dự phòng 30% làm lại.

## Thứ tự tạo ảnh

| # | File | Gửi kèm |
|---:|---|---|
| 1 | `gl1-P-D-S2.png` | `gl1-P-D-S1.png`, `gl1-P-A-S2.png` |
| 2 | `gl1-SH044-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S2.png` |
| 3 | `gl1-SH044-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH044-a.png` |
| 4 | `gl1-SH044-c.png` | `gl1-SH044-a.png`, `gl1-SH044-b.png` |
| 5 | `gl1-SH045-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-R-nha-kho.png` |
| 6 | `gl1-SH045-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH045-a.png` |
| 7 | `gl1-SH045-c.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S2.png` |
| 8 | `gl1-SH046-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S2.png` |
| 9 | `gl1-SH046-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH046-a.png` |
| 10 | `gl1-SH046-c.png` | `gl1-SH046-a.png`, `gl1-SH046-b.png` |
| 11 | `gl1-SH047-a.png` | `gl1-SH046-c.png` |
| 12 | `gl1-SH047-b.png` | `gl1-SH047-a.png` |
| 13 | `gl1-SH047-c.png` | `gl1-SH047-a.png`, `gl1-SH047-b.png` |
| 14 | `gl1-SH049-a.png` | `gl1-P-C-S3.png` |
| 15 | `gl1-SH049-b.png` | `gl1-SH049-a.png` |
| 16 | `gl1-SH050-a.png` | `gl1-P-C-S3.png` |
| 17 | `gl1-SH050-b.png` | `gl1-SH050-a.png` |
| 18 | `gl1-SH050-c.png` | `gl1-SH050-a.png`, `gl1-SH050-b.png` |
| 19 | `gl1-SH051-a.png` | `gl1-SH050-c.png` |
| 20 | `gl1-SH051-b.png` | `gl1-SH051-a.png` |
| 21 | `gl1-SH053-a.png` | `gl1-SH052-c.png` |
| 22 | `gl1-SH053-b.png` | `gl1-SH053-a.png` |
| 23 | `gl1-SH054-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S3.png` |
| 24 | `gl1-SH054-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH054-a.png` |
| 25 | `gl1-SH054-c.png` | `gl1-SH054-a.png`, `gl1-SH054-b.png` |
| 26 | `gl1-SH055-a.png` | `gl1-P-C-S3.png` |
| 27 | `gl1-SH055-b.png` | `gl1-SH055-a.png` |
| 28 | `gl1-SH055-c.png` | `gl1-SH055-a.png`, `gl1-SH055-b.png` |
| 29 | `gl1-SH056-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S3.png` |
| 30 | `gl1-SH056-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH056-a.png` |
| 31 | `gl1-SH056-c.png` | `gl1-SH056-a.png`, `gl1-SH056-b.png` |
| 32 | `gl1-SH057-a.png` | `gl1-P-C-S3.png` |
| 33 | `gl1-SH057-b.png` | `gl1-SH057-a.png` |
| 34 | `gl1-SH058-a.png` | `gl1-SH050-c.png` |
| 35 | `gl1-SH058-b.png` | `gl1-P-C-S3.png`, `gl1-SH058-a.png` |
| 36 | `gl1-SH058-c.png` | `gl1-SH058-b.png` |
| 37 | `gl1-SH059-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S2.png` |
| 38 | `gl1-SH059-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH059-a.png` |
| 39 | `gl1-SH059-c.png` | `gl1-SH059-a.png`, `gl1-SH059-b.png` |
| 40 | `gl1-SH060-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S4.png` |

## Danh sách clip Muse

| Output filename | Shot | First frame | Last frame | Reference | Muse tạo | Dùng trên timeline |
|---|---|---|---|---|---:|---|
| `SH044_01.mp4` | SH044 | `gl1-SH044-a.png` | `gl1-SH044-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6.5 s @ 05:55 |
| `SH044_02.mp4` | SH044 | `gl1-SH044-b.png` | `gl1-SH044-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6.5 s @ 06:01.50 |
| `SH045_01.mp4` | SH045 | `gl1-SH045-a.png` | `gl1-SH045-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6.5 s @ 06:08 |
| `SH045_02.mp4` | SH045 | `gl1-SH045-c.png` | — | `gl1-A-elise-garden-truoc.png` | 10 s | 6.5 s @ 06:14.50 |
| `SH046_01.mp4` | SH046 | `gl1-SH046-a.png` | `gl1-SH046-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 06:21 |
| `SH046_02.mp4` | SH046 | `gl1-SH046-b.png` | `gl1-SH046-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 06:27 |
| `SH047_01.mp4` | SH047 | `gl1-SH047-a.png` | `gl1-SH047-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6.5 s @ 06:33 |
| `SH047_02.mp4` | SH047 | `gl1-SH047-b.png` | `gl1-SH047-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6.5 s @ 06:39.50 |
| `SH049_01.mp4` | SH049 | `gl1-SH049-a.png` | `gl1-SH049-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6.5 s @ 06:57 |
| `SH050_01.mp4` | SH050 | `gl1-SH050-a.png` | `gl1-SH050-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 07:03.50 |
| `SH050_02.mp4` | SH050 | `gl1-SH050-b.png` | `gl1-SH050-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 07:09.50 |
| `SH051_01.mp4` | SH051 | `gl1-SH051-a.png` | `gl1-SH051-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6.5 s @ 07:15.50 |
| `SH053_01.mp4` | SH053 | `gl1-SH053-a.png` | `gl1-SH053-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6.5 s @ 07:30.90 |
| `SH054_01.mp4` | SH054 | `gl1-SH054-a.png` | `gl1-SH054-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 07:37.40 |
| `SH054_02.mp4` | SH054 | `gl1-SH054-b.png` | `gl1-SH054-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 07:43.40 |
| `SH055_01.mp4` | SH055 | `gl1-SH055-a.png` | `gl1-SH055-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 07:49.40 |
| `SH055_02.mp4` | SH055 | `gl1-SH055-b.png` | `gl1-SH055-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 07:55.40 |
| `SH056_01.mp4` | SH056 | `gl1-SH056-a.png` | `gl1-SH056-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 08:01.40 |
| `SH056_02.mp4` | SH056 | `gl1-SH056-b.png` | `gl1-SH056-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 08:07.40 |
| `SH057_01.mp4` | SH057 | `gl1-SH057-a.png` | `gl1-SH057-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 08:13.40 |
| `SH057_02.mp4` | SH057 | `gl1-SH057-b.png` | — | `gl1-A-elise-garden-truoc.png` | 10 s | 5 s @ 08:19.40 |
| `SH058_01.mp4` | SH058 | `gl1-SH058-a.png` | — | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 08:24.40 |
| `SH058_02.mp4` | SH058 | `gl1-SH058-b.png` | `gl1-SH058-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 08:30.40 |
| `SH059_01.mp4` | SH059 | `gl1-SH059-a.png` | `gl1-SH059-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 08:36.40 |
| `SH059_02.mp4` | SH059 | `gl1-SH059-b.png` | `gl1-SH059-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 08:42.40 |
| `SH060_01.mp4` | SH060 | `gl1-SH060-a.png` | — | `gl1-A-elise-garden-truoc.png` | 10 s | 6.6 s @ 08:48.40 |

Bản dựng thử (Codex/Remotion): nối 8 shot theo đúng timecode. Thêm chữ 'Day 1/2/3' và nhãn AI. SH024 có slot 12 s: 2 s cảnh hoang + 10 s cảnh đã dọn. Mặc định cắt thẳng; nếu hòa thì giữ tổng slot 12 s, không trừ chồng thêm. Chưa cần lời dẫn.
Ảnh/clip vẫn chưa có. Manifest là kế hoạch nhận file; watcher/ingest và composition Garden chưa triển khai. Các bước dưới đây không gọi API hay tự gửi Muse.

---

## SH044 · SQ06 · 05:55–06:08

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH044**: Chĩa xới tơi đất tại chỗ bên trong khung BED-01, lật từng xắn. |
| 2. Mục tiêu cảnh | Bắt đầu đất: xới tơi đất tại chỗ trong khung. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S2.png` |
| 6. Thời lượng mục tiêu | **13 s** trên timeline = SH044_01.mp4 dùng 6.5 s (Muse tạo 10 s) + SH044_02.mp4 dùng 6.5 s (Muse tạo 10 s) |
| 7. First / Last frame | SH044_01.mp4: đầu `gl1-SH044-a.png`, cuối `gl1-SH044-b.png`<br>SH044_02.mp4: đầu `gl1-SH044-b.png`, cuối `gl1-SH044-c.png` |
| 9. Output filename | `SH044_01.mp4`, `SH044_02.mp4` |
| Camera / ánh sáng | CLOSE (D→E) · MS · Ngày 2 12:40 · S2_FRAMES→S2_FRAMES |
| Bố cục | MS hướng D→E: Elise đứng trên lối, chĩa trong khung BED-01. |
| Âm thanh (cho Codex) | Chĩa, đất vụn. / Chĩa, đất vụn. |

### 4. Image prompt

**`gl1-P-D-S2.png`** (ảnh #1). Gửi kèm: `gl1-P-D-S1.png`, `gl1-P-A-S2.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate exactly the camera position, lens, framing, house, deck, shed, compost bin, apple tree and fences of the FIRST reference image. Only change: the canes and strings are gone and two identical new cedar raised-bed frames (1.2 m × 2.4 m, about 14 cm high) sit exactly where the rectangles were, parallel, with lighter brown loosened native soil inside, as in the SECOND reference. Light: bright midday spring sun high in the south, short soft shadows. No person anywhere. Real photo, no text, no logos, no watermark.
```

**`gl1-SH044-a.png`** (ảnh #2). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S2.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Medium shot beside the left cedar frame in the vegetable area of the second reference, camera 1.3 m high, 35 mm, looking east. Light: bright midday spring sun high in the south, short soft shadows. Elise stands on the path beside the frame, both gloved hands on the handle of a four-tined garden fork pushed into the lighter brown soil inside the frame, her face in three-quarter view. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH044-b.png`** (ảnh #3). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH044-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: she has levered the fork back and turned over one forkful of soil, showing darker moist soil underneath. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH044-c.png`** (ảnh #4). Gửi kèm: `gl1-SH044-a.png`, `gl1-SH044-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: she has moved half a step along the frame and turns over a second forkful; a strip of loosened darker soil now runs along the frame. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH044_01.mp4`**: First frame `gl1-SH044-a.png` · Last frame `gl1-SH044-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise pushes the fork deeper, levers the handle back and turns one forkful of soil over, as in the end frame. Soil moves only where the fork lifts it; the frame never moves. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan brown leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH044_02.mp4`**: First frame `gl1-SH044-b.png` · Last frame `gl1-SH044-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She steps half a step along the frame, pushes the fork in again and turns over a second forkful, as in the end frame. Only the soil under the fork moves. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan brown leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, readable writing on labels or packets, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, seeds or soil appearing in bulk, frames changing size, green sprouts.
```

**Continuity:** Ngày 2, 12:40; Găng: da nâu; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Luống cedar 1,2 × 2,4 m; Trạng thái S2_FRAMES→S2_FRAMES

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt/trang phục khớp
- [ ] Hạt/đất/nhãn không tự hiện
- [ ] Không chữ đọc được trên gói/nhãn
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH045 · SQ06 · 06:08–06:21

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH045**: Xúc phân ủ hoai nâu đen từ thùng ủ lên xe cút kít, đẩy dọc lối ra luống. |
| 2. Mục tiêu cảnh | Nguồn phân rõ ràng: xúc từ thùng ủ cũ, đẩy ra luống. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **13 s** trên timeline = SH045_01.mp4 dùng 6.5 s (Muse tạo 10 s) + SH045_02.mp4 dùng 6.5 s (Muse tạo 10 s) |
| 7. First / Last frame | SH045_01.mp4: đầu `gl1-SH045-a.png`, cuối `gl1-SH045-b.png`<br>SH045_02.mp4: đầu `gl1-SH045-c.png`, cuối không có |
| 9. Output filename | `SH045_01.mp4`, `SH045_02.mp4` |
| Camera / ánh sáng | CLOSE (thùng ủ / C→W) · WS · Ngày 2 12:55 · S2_FRAMES→S2_FRAMES |
| Bố cục | Clip 1 cận thùng ủ cạnh nhà kho; clip 2 toàn cảnh CAM_C đẩy xe. |
| Âm thanh (cho Codex) | Xẻng vào phân, bánh xe. / Xẻng vào phân, bánh xe. |

### 4. Image prompt

**`gl1-SH045-a.png`** (ảnh #5). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-R-nha-kho.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Medium shot at the slatted wooden compost bin beside the grey shed of the second reference, same design and colours. Light: soft early-afternoon spring sun from the south, thin high cloud. Elise, seen from the side, lifts a spadeful of dark, crumbly, well-rotted compost out of the bin toward the dark-green wheelbarrow beside it, which is already half full of compost. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH045-b.png`** (ảnh #6). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH045-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: the wheelbarrow is heaped full of dark compost; she leans the spade against the bin and grips both wheelbarrow handles. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH045-c.png`** (ảnh #7). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S2.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. Light: soft early-afternoon spring sun from the south, thin high cloud. Elise pushes the dark-green wheelbarrow heaped with dark compost across the mowed lawn toward the two cedar frames, in the middle ground. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH045_01.mp4`**: First frame `gl1-SH045-a.png` · Last frame `gl1-SH045-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise shovels two more spadefuls of dark compost from the bin into the wheelbarrow, one at a time, then leans the spade on the bin and grips the handles, as in the end frame. Compost moves only on the spade. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan brown leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH045_02.mp4`**: First frame `gl1-SH045-c.png` · Last frame không · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image. Only this one woman is ever in the scene; no other person appears. Elise pushes the full wheelbarrow steadily across the lawn toward the cedar frames. No compost falls off; the frames never move. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan brown leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, readable writing on labels or packets, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, seeds or soil appearing in bulk, frames changing size, green sprouts.
```

**Continuity:** Ngày 2, 12:55; Găng: da nâu; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Luống cedar 1,2 × 2,4 m; Trạng thái S2_FRAMES→S2_FRAMES

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt/trang phục khớp
- [ ] Hạt/đất/nhãn không tự hiện
- [ ] Không chữ đọc được trên gói/nhãn
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH046 · SQ06 · 06:21–06:33

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH046**: Nghiêng xe đổ phân ủ vào BED-01, phân trượt ra thành đống. |
| 2. Mục tiêu cảnh | Lời dẫn 'good soil': đổ phân ủ vào luống. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **12 s** trên timeline = SH046_01.mp4 dùng 6 s (Muse tạo 10 s) + SH046_02.mp4 dùng 6 s (Muse tạo 10 s) |
| 7. First / Last frame | SH046_01.mp4: đầu `gl1-SH046-a.png`, cuối `gl1-SH046-b.png`<br>SH046_02.mp4: đầu `gl1-SH046-b.png`, cuối `gl1-SH046-c.png` |
| 9. Output filename | `SH046_01.mp4`, `SH046_02.mp4` |
| Camera / ánh sáng | CLOSE (D→E) · MS · Ngày 2 13:00 · S2_FRAMES→S2_FRAMES |
| Bố cục | MS hướng D→E tại mép khung BED-01. |
| Âm thanh (cho Codex) | Phân trượt, xe kim loại. / Phân trượt, xe kim loại. |

### 4. Image prompt

**`gl1-SH046-a.png`** (ảnh #8). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S2.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Medium shot at the long side of the left cedar frame in the vegetable area of the second reference, camera 1.2 m high, 35 mm, looking east. Light: soft early-afternoon spring sun from the south, thin high cloud. Elise, seen from the side, lifts the handles of the dark-green wheelbarrow, its front wheel against the frame, tipping it so the dark compost starts sliding into the frame onto the loosened soil. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH046-b.png`** (ảnh #9). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH046-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: the wheelbarrow is tipped fully and most of the compost has slid into the frame as a dark heap. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH046-c.png`** (ảnh #10). Gửi kèm: `gl1-SH046-a.png`, `gl1-SH046-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: the empty wheelbarrow stands back on its legs beside the frame; a dark heap of compost sits inside the frame on the lighter soil. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH046_01.mp4`**: First frame `gl1-SH046-a.png` · Last frame `gl1-SH046-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise lifts the handles higher and the dark compost slides out of the wheelbarrow into the frame, as in the end frame. Compost appears only where it falls from the wheelbarrow. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan brown leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH046_02.mp4`**: First frame `gl1-SH046-b.png` · Last frame `gl1-SH046-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She shakes the wheelbarrow once, lowers it back onto its legs beside the frame, as in the end frame. The heap stays in the frame. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan brown leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, readable writing on labels or packets, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, seeds or soil appearing in bulk, frames changing size, green sprouts.
```

**Continuity:** Ngày 2, 13:00; Găng: da nâu; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Luống cedar 1,2 × 2,4 m; Trạng thái S2_FRAMES→S2_FRAMES

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt/trang phục khớp
- [ ] Hạt/đất/nhãn không tự hiện
- [ ] Không chữ đọc được trên gói/nhãn
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH047 · SQ06 · 06:33–06:46

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH047**: Cào trộn phân vào đất, màu đất sẫm dần. |
| 2. Mục tiêu cảnh | Chất liệu (ASMR): cào trộn phân vào đất. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **13 s** trên timeline = SH047_01.mp4 dùng 6.5 s (Muse tạo 10 s) + SH047_02.mp4 dùng 6.5 s (Muse tạo 10 s) |
| 7. First / Last frame | SH047_01.mp4: đầu `gl1-SH047-a.png`, cuối `gl1-SH047-b.png`<br>SH047_02.mp4: đầu `gl1-SH047-b.png`, cuối `gl1-SH047-c.png` |
| 9. Output filename | `SH047_01.mp4`, `SH047_02.mp4` |
| Camera / ánh sáng | CLOSE (D→E) · CU · Ngày 2 13:10 · S2_FRAMES→S2_FRAMES |
| Bố cục | CU răng cào trong luống, đất sẫm dần. |
| Âm thanh (cho Codex) | Cào trong đất mềm. / Cào trong đất mềm. |

### 4. Image prompt

**`gl1-SH047-a.png`** (ảnh #11). Gửi kèm: `gl1-SH046-c.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Close-up inside the left cedar frame of the reference image, camera 0.9 m high, 50 mm, looking down; the reddish cedar board along the bottom of the frame. Light: soft early-afternoon spring sun from the south, thin high cloud. A heap of dark compost sits on the lighter brown loosened soil; the teeth of a metal garden rake, held by gloved hands at the top of the frame, rest at the edge of the heap. Only the rake head, the handle and her gloved hands are in frame. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH047-b.png`** (ảnh #12). Gửi kèm: `gl1-SH047-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera, framing and light. Only change: the heap is half spread; the rake has pulled dark compost across the left half, mixing it into the lighter soil in streaks. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH047-c.png`** (ảnh #13). Gửi kèm: `gl1-SH047-a.png`, `gl1-SH047-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the second reference exactly — same camera, framing and light. Only change: the compost is spread over the whole visible area and mixed in; the soil is evenly darker with fine rake lines. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH047_01.mp4`**: First frame `gl1-SH047-a.png` · Last frame `gl1-SH047-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. The rake pulls dark compost from the heap across the left half of the bed in slow strokes, mixing it into the lighter soil, as in the end frame. Soil moves only under the rake teeth. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH047_02.mp4`**: First frame `gl1-SH047-b.png` · Last frame `gl1-SH047-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. The rake spreads the rest of the heap across the bed and mixes it in until the soil is evenly darker, as in the end frame. Only the soil under the rake moves. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, readable writing on labels or packets, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, seeds or soil appearing in bulk, frames changing size, green sprouts.
```

**Continuity:** Ngày 2, 13:10; Găng: da nâu; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Luống cedar 1,2 × 2,4 m; Trạng thái S2_FRAMES→S2_FRAMES

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt/trang phục khớp
- [ ] Hạt/đất/nhãn không tự hiện
- [ ] Không chữ đọc được trên gói/nhãn
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH049 · SQ06 · 06:57–07:03.50

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH049**: Bàn tay bóp một nắm đất luống: tơi, ẩm, rời ra. |
| 2. Mục tiêu cảnh | Kiểm tra đất bằng tay. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **6.5 s** trên timeline = SH049_01.mp4 dùng 6.5 s (Muse tạo 10 s) |
| 7. First / Last frame | SH049_01.mp4: đầu `gl1-SH049-a.png`, cuối `gl1-SH049-b.png` |
| 9. Output filename | `SH049_01.mp4` |
| Camera / ánh sáng | CLOSE (C→W) · CU · Ngày 2 13:40 · S3_SOIL_READY→S3_SOIL_READY |
| Bố cục | CU bàn tay găng bóp nắm đất. |
| Âm thanh (cho Codex) | Đất vụn. |

### 4. Image prompt

**`gl1-SH049-a.png`** (ảnh #14). Gửi kèm: `gl1-P-C-S3.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Close-up inside a cedar frame filled with dark, crumbly, compost-rich soil, as in the reference image, camera 0.8 m high, 50 mm. Light: soft early-afternoon spring sun from the south, thin high cloud. A gloved hand scoops up a handful of the dark soil; only the gloved hand, wrist and the soil are in frame. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH049-b.png`** (ảnh #15). Gửi kèm: `gl1-SH049-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera, framing and light. Only change: the gloved hand has squeezed the soil gently and opened; the soil crumbles apart into fine moist crumbs that fall back into the bed. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH049_01.mp4`**: First frame `gl1-SH049-a.png` · Last frame `gl1-SH049-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. The gloved hand squeezes the handful of soil gently, then opens; the soil crumbles into fine moist crumbs that fall back into the bed, as in the end frame. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, readable writing on labels or packets, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, seeds or soil appearing in bulk, frames changing size, green sprouts.
```

**Continuity:** Ngày 2, 13:40; Găng: da nâu; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Luống cedar 1,2 × 2,4 m; Trạng thái S3_SOIL_READY→S3_SOIL_READY

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt/trang phục khớp
- [ ] Hạt/đất/nhãn không tự hiện
- [ ] Không chữ đọc được trên gói/nhãn
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH050 · SQ06 · 07:03.50–07:15.50

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH050**: Elise đặt ba gói hạt, bó nhãn và bút chì lên mép khung; tháo găng. |
| 2. Mục tiêu cảnh | Chuyển sang gieo: bày hạt, nhãn, bút; tháo găng. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **12 s** trên timeline = SH050_01.mp4 dùng 6 s (Muse tạo 10 s) + SH050_02.mp4 dùng 6 s (Muse tạo 10 s) |
| 7. First / Last frame | SH050_01.mp4: đầu `gl1-SH050-a.png`, cuối `gl1-SH050-b.png`<br>SH050_02.mp4: đầu `gl1-SH050-b.png`, cuối `gl1-SH050-c.png` |
| 9. Output filename | `SH050_01.mp4`, `SH050_02.mp4` |
| Camera / ánh sáng | CLOSE (C→W) · MS · Ngày 2 13:50 · S3_SOIL_READY→S3_SOIL_READY |
| Bố cục | CU mép khung: gói hạt, nhãn, bút chì; tay tháo găng. |
| Âm thanh (cho Codex) | Giấy gói hạt, găng tháo. / Giấy gói hạt, găng tháo. |

### 4. Image prompt

**`gl1-SH050-a.png`** (ảnh #16). Gửi kèm: `gl1-P-C-S3.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Close-up along the top edge of a cedar frame filled with dark smooth soil, as in the reference image, camera 0.7 m high, 50 mm, side view. Light: soft early-afternoon spring sun from the south, thin high cloud. Gloved hands set down three small paper seed packets with simple painted illustrations — a red radish, a green lettuce head and a pak choi — and NO words, letters or numbers in a row on the top edge of the board; a bundle of small plain white plastic plant labels and a pencil lie beside them. Only hands and forearms are in frame. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH050-b.png`** (ảnh #17). Gửi kèm: `gl1-SH050-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera, framing and light. Only change: the packets, labels and pencil lie neatly on the board; the left hand is pulling the tan leather glove off the right hand. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH050-c.png`** (ảnh #18). Gửi kèm: `gl1-SH050-a.png`, `gl1-SH050-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the second reference exactly — same camera, framing and light. Only change: both gloves are off and laid on the board beside the labels; her bare hands rest on the edge. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH050_01.mp4`**: First frame `gl1-SH050-a.png` · Last frame `gl1-SH050-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Gloved hands set the three seed packets down in a row on the board, then the left hand starts pulling the glove off the right hand, as in the end frame. Packets appear only where her hands place them. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH050_02.mp4`**: First frame `gl1-SH050-b.png` · Last frame `gl1-SH050-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She pulls off both gloves and lays them on the board beside the labels, as in the end frame. The packets and labels do not move. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, readable writing on labels or packets, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, seeds or soil appearing in bulk, frames changing size, green sprouts.
```

**Continuity:** Ngày 2, 13:50; Găng: tháo găng giữa shot; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Luống cedar 1,2 × 2,4 m; Trạng thái S3_SOIL_READY→S3_SOIL_READY

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt/trang phục khớp
- [ ] Hạt/đất/nhãn không tự hiện
- [ ] Không chữ đọc được trên gói/nhãn
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH051 · SQ07 · 07:15.50–07:22

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH051**: Ba gói hạt có hình củ cải, xà lách, cải thìa (không chữ); Elise lắc gói củ cải. |
| 2. Mục tiêu cảnh | Giới thiệu 3 loại hạt. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **6.5 s** trên timeline = SH051_01.mp4 dùng 6.5 s (Muse tạo 10 s) |
| 7. First / Last frame | SH051_01.mp4: đầu `gl1-SH051-a.png`, cuối `gl1-SH051-b.png` |
| 9. Output filename | `SH051_01.mp4` |
| Camera / ánh sáng | CLOSE (C→W) · CU · Ngày 2 14:00 · S3_SOIL_READY→S3_SOIL_READY |
| Bố cục | CU 3 gói hạt trên mép khung. |
| Âm thanh (cho Codex) | Hạt lắc trong gói. |

### 4. Image prompt

**`gl1-SH051-a.png`** (ảnh #19). Gửi kèm: `gl1-SH050-c.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Close-up of the reference image's three seed packets lying on the cedar board, camera 0.5 m high, 50 mm, the dark soil soft behind. Light: soft afternoon spring sun from the south-west, gentle shadows. Her bare right hand picks up the radish packet. Only the packets and her bare hand are in frame. The packets show only illustrations, no words. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH051-b.png`** (ảnh #20). Gửi kèm: `gl1-SH051-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera, framing and light. Only change: her bare hand holds the radish packet up, tilted, giving it a gentle shake. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH051_01.mp4`**: First frame `gl1-SH051-a.png` · Last frame `gl1-SH051-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Her bare hand picks up the radish packet and gives it a gentle shake next to her ear; the other two packets stay on the board, as in the end frame. No writing appears on the packets. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, readable writing on labels or packets, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, seeds or soil appearing in bulk, frames changing size, green sprouts.
```

**Continuity:** Ngày 2, 14:00; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Luống cedar 1,2 × 2,4 m; Trạng thái S3_SOIL_READY→S3_SOIL_READY

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt/trang phục khớp
- [ ] Hạt/đất/nhãn không tự hiện
- [ ] Không chữ đọc được trên gói/nhãn
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH053 · SQ07 · 07:30.90–07:37.40

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH053**: Ngón tay lấp đất mỏng lên hạt, ấn nhẹ. |
| 2. Mục tiêu cảnh | Đúng kỹ thuật: lấp mỏng, ấn nhẹ. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **6.5 s** trên timeline = SH053_01.mp4 dùng 6.5 s (Muse tạo 10 s) |
| 7. First / Last frame | SH053_01.mp4: đầu `gl1-SH053-a.png`, cuối `gl1-SH053-b.png` |
| 9. Output filename | `SH053_01.mp4` |
| Camera / ánh sáng | CLOSE (C→W) · ECU · Ngày 2 14:10 · S4_PLANTED→S4_PLANTED |
| Bố cục | ECU rãnh có hạt củ cải. |
| Âm thanh (cho Codex) | Đất mịn. |

### 4. Image prompt

**`gl1-SH053-a.png`** (ảnh #21). Gửi kèm: `gl1-SH052-c.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Extreme close-up of the shallow groove with single reddish-brown radish seeds of the reference image, camera 0.4 m high, 50 mm, side view. Light: soft afternoon spring sun from the south-west, gentle shadows. Two bare fingertips begin pushing a thin layer of fine soil from the side of the groove over the first seeds. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH053-b.png`** (ảnh #22). Gửi kèm: `gl1-SH053-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera, framing and light. Only change: the groove is covered with a thin layer of soil along its length and the fingertips press it down gently; no seeds are visible any more. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH053_01.mp4`**: First frame `gl1-SH053-a.png` · Last frame `gl1-SH053-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Bare fingertips push fine soil over the seeds along the groove and press it gently down, as in the end frame. No seeds appear or move by themselves. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, readable writing on labels or packets, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, seeds or soil appearing in bulk, frames changing size, green sprouts.
```

**Continuity:** Ngày 2, 14:10; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Luống cedar 1,2 × 2,4 m; Trạng thái S4_PLANTED→S4_PLANTED

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt/trang phục khớp
- [ ] Hạt/đất/nhãn không tự hiện
- [ ] Không chữ đọc được trên gói/nhãn
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH054 · SQ07 · 07:37.40–07:49.40

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH054**: Hàng củ cải thứ hai cách 15 cm, dùng thước dây đặt cách. |
| 2. Mục tiêu cảnh | Có quy cách: hàng củ cải thứ hai cách 15 cm. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **12 s** trên timeline = SH054_01.mp4 dùng 6 s (Muse tạo 10 s) + SH054_02.mp4 dùng 6 s (Muse tạo 10 s) |
| 7. First / Last frame | SH054_01.mp4: đầu `gl1-SH054-a.png`, cuối `gl1-SH054-b.png`<br>SH054_02.mp4: đầu `gl1-SH054-b.png`, cuối `gl1-SH054-c.png` |
| 9. Output filename | `SH054_01.mp4`, `SH054_02.mp4` |
| Camera / ánh sáng | CLOSE (C→W) · MS · Ngày 2 14:20 · S4_PLANTED→S4_PLANTED |
| Bố cục | MS ở BED-01 (nhìn tây), Elise quỳ nhìn nghiêng. |
| Âm thanh (cho Codex) | Thước, que. / Thước, que. |

### 4. Image prompt

**`gl1-SH054-a.png`** (ảnh #23). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S3.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Medium shot at the left cedar frame (BED-01) of the second reference, camera 1.1 m high, 35 mm, looking west. Light: soft afternoon spring sun from the south-west, gentle shadows. Seen from the side; she kneels with her knees turned away from the camera. One covered radish row already runs across the near half of the bed. A yellow tape measure lies on the soil beside it; Elise presses a bamboo cane into the soil 15 cm further along, making a second shallow groove parallel to the first. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH054-b.png`** (ảnh #24). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH054-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: the second groove is finished; she holds a few radish seeds in her left palm, her right fingertips above the groove. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH054-c.png`** (ảnh #25). Gửi kèm: `gl1-SH054-a.png`, `gl1-SH054-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: radish seeds lie thinly along the second groove and she begins covering them with soil. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH054_01.mp4`**: First frame `gl1-SH054-a.png` · Last frame `gl1-SH054-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise presses the cane into the soil to make a second shallow groove parallel to the first, then tips a few seeds into her palm, as in the end frame. The groove forms only where the cane presses. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands (no gloves); natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH054_02.mp4`**: First frame `gl1-SH054-b.png` · Last frame `gl1-SH054-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She drops single seeds thinly along the groove and starts covering them, as in the end frame. Seeds appear only where they fall from her fingers. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands (no gloves); natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, readable writing on labels or packets, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, seeds or soil appearing in bulk, frames changing size, green sprouts.
```

**Continuity:** Ngày 2, 14:20; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Luống cedar 1,2 × 2,4 m; Trạng thái S4_PLANTED→S4_PLANTED

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt/trang phục khớp
- [ ] Hạt/đất/nhãn không tự hiện
- [ ] Không chữ đọc được trên gói/nhãn
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH055 · SQ07 · 07:49.40–08:01.40

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH055**: Hạt xà lách nhỏ nhạt màu rắc vào rãnh rất nông ở nửa bắc BED-01. |
| 2. Mục tiêu cảnh | Hạt khác, cách khác: xà lách gieo rất nông. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **12 s** trên timeline = SH055_01.mp4 dùng 6 s (Muse tạo 10 s) + SH055_02.mp4 dùng 6 s (Muse tạo 10 s) |
| 7. First / Last frame | SH055_01.mp4: đầu `gl1-SH055-a.png`, cuối `gl1-SH055-b.png`<br>SH055_02.mp4: đầu `gl1-SH055-b.png`, cuối `gl1-SH055-c.png` |
| 9. Output filename | `SH055_01.mp4`, `SH055_02.mp4` |
| Camera / ánh sáng | CLOSE (C→W) · CU · Ngày 2 14:35 · S4_PLANTED→S4_PLANTED |
| Bố cục | CU nửa bắc BED-01: rãnh rất nông. |
| Âm thanh (cho Codex) | Hạt rơi. / Hạt rơi. |

### 4. Image prompt

**`gl1-SH055-a.png`** (ảnh #26). Gửi kèm: `gl1-P-C-S3.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Close-up inside the far half of the left cedar frame of the reference image, camera 0.6 m high, 50 mm, side view; dark smooth soil. Light: soft afternoon spring sun from the south-west, gentle shadows. Her bare fingertip draws a very shallow line in the soil surface, half done. Only her bare hands and forearms are in frame. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH055-b.png`** (ảnh #27). Gửi kèm: `gl1-SH055-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera, framing and light. Only change: the very shallow line is finished; her left palm holds a pinch of tiny pale slender lettuce seeds and her right fingertips sprinkle a few at the start of the line. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH055-c.png`** (ảnh #28). Gửi kèm: `gl1-SH055-a.png`, `gl1-SH055-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the second reference exactly — same camera, framing and light. Only change: tiny pale lettuce seeds lie thinly along the whole line and her fingertips brush a dusting of soil over them. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH055_01.mp4`**: First frame `gl1-SH055-a.png` · Last frame `gl1-SH055-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Her fingertip finishes the very shallow line, then she takes a pinch of tiny lettuce seeds and sprinkles a few at its start, as in the end frame. Seeds appear only where they fall from her fingers. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH055_02.mp4`**: First frame `gl1-SH055-b.png` · Last frame `gl1-SH055-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She sprinkles the tiny seeds thinly along the line and brushes a dusting of soil over them, as in the end frame. No seeds appear by themselves. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, readable writing on labels or packets, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, seeds or soil appearing in bulk, frames changing size, green sprouts.
```

**Continuity:** Ngày 2, 14:35; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Luống cedar 1,2 × 2,4 m; Trạng thái S4_PLANTED→S4_PLANTED

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt/trang phục khớp
- [ ] Hạt/đất/nhãn không tự hiện
- [ ] Không chữ đọc được trên gói/nhãn
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH056 · SQ07 · 08:01.40–08:13.40

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH056**: Sang BED-02: kẻ rãnh sâu hơn (~2 cm), các hàng cách 30 cm. |
| 2. Mục tiêu cảnh | Luống thứ hai: rãnh sâu hơn, hàng cách 30 cm. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **12 s** trên timeline = SH056_01.mp4 dùng 6 s (Muse tạo 10 s) + SH056_02.mp4 dùng 6 s (Muse tạo 10 s) |
| 7. First / Last frame | SH056_01.mp4: đầu `gl1-SH056-a.png`, cuối `gl1-SH056-b.png`<br>SH056_02.mp4: đầu `gl1-SH056-b.png`, cuối `gl1-SH056-c.png` |
| 9. Output filename | `SH056_01.mp4`, `SH056_02.mp4` |
| Camera / ánh sáng | CAM_C_EAST_FENCE · MS · Ngày 2 14:50 · S4_PLANTED→S4_PLANTED |
| Bố cục | MS khung CAM_C (ảnh nền C-S3): Elise ở BED-02 tiền cảnh. |
| Âm thanh (cho Codex) | Que, thước. / Que, thước. |

### 4. Image prompt

**`gl1-SH056-a.png`** (ảnh #29). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S3.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. Light: warm mid-afternoon spring sun from the south-west, soft shadows. Difference from the second reference: the far bed (BED-01) shows faint sown rows. Elise kneels at the near bed (BED-02), seen from the side, and presses a bamboo cane deeper into the soil across the bed, making a groove; a yellow tape measure lies along the side of the bed. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH056-b.png`** (ảnh #30). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH056-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: one deeper groove runs across the near half of BED-02; she measures 30 cm along the tape with her fingers for the next row. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH056-c.png`** (ảnh #31). Gửi kèm: `gl1-SH056-a.png`, `gl1-SH056-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: a second groove runs parallel 30 cm further along; she presses the cane in for it. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH056_01.mp4`**: First frame `gl1-SH056-a.png` · Last frame `gl1-SH056-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise presses the cane into the soil to make one groove across the near half of the bed, then measures 30 cm along the tape, as in the end frame. The groove forms only where the cane presses; the frames never move. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands (no gloves); natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH056_02.mp4`**: First frame `gl1-SH056-b.png` · Last frame `gl1-SH056-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She presses the cane in 30 cm further along to make a second parallel groove, as in the end frame. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands (no gloves); natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, readable writing on labels or packets, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, seeds or soil appearing in bulk, frames changing size, green sprouts.
```

**Continuity:** Ngày 2, 14:50; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Luống cedar 1,2 × 2,4 m; Trạng thái S4_PLANTED→S4_PLANTED

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt/trang phục khớp
- [ ] Hạt/đất/nhãn không tự hiện
- [ ] Không chữ đọc được trên gói/nhãn
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH057 · SQ07 · 08:13.40–08:24.40

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH057**: Đặt từng hạt cải thìa tròn sẫm dọc rãnh, lấp đất. |
| 2. Mục tiêu cảnh | Nhịp chậm, chính xác: đặt từng hạt cải thìa. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **11 s** trên timeline = SH057_01.mp4 dùng 6 s (Muse tạo 10 s) + SH057_02.mp4 dùng 5 s (Muse tạo 10 s) |
| 7. First / Last frame | SH057_01.mp4: đầu `gl1-SH057-a.png`, cuối `gl1-SH057-b.png`<br>SH057_02.mp4: đầu `gl1-SH057-b.png`, cuối không có |
| 9. Output filename | `SH057_01.mp4`, `SH057_02.mp4` |
| Camera / ánh sáng | CLOSE (C→W) · CU · Ngày 2 15:00 · S4_PLANTED→S4_PLANTED |
| Bố cục | CU rãnh ở BED-02. |
| Âm thanh (cho Codex) | Hạt, đất. / Hạt, đất. |

### 4. Image prompt

**`gl1-SH057-a.png`** (ảnh #32). Gửi kèm: `gl1-P-C-S3.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Close-up of a groove across a cedar frame filled with dark soil, as in the reference image, camera 0.5 m high, 50 mm, side view. Light: warm mid-afternoon spring sun from the south-west, soft shadows. Her bare fingertips place a single tiny round dark pak choi seed into the groove; two seeds already lie in it, well apart. Only her bare hands are in frame. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH057-b.png`** (ảnh #33). Gửi kèm: `gl1-SH057-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera, framing and light. Only change: five seeds now lie spaced along the groove and her fingertips start pushing soil over the first ones. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH057_01.mp4`**: First frame `gl1-SH057-a.png` · Last frame `gl1-SH057-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Her fingertips place single pak choi seeds one by one along the groove, well apart, then start covering the first ones, as in the end frame. Each seed appears only where her fingers place it. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH057_02.mp4`**: First frame `gl1-SH057-b.png` · Last frame không · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image. Only this one woman is ever in the scene; no other person appears. Her fingertips push soil over the seeds along the groove and press it down gently. No seeds appear or move by themselves. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, readable writing on labels or packets, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, seeds or soil appearing in bulk, frames changing size, green sprouts.
```

**Continuity:** Ngày 2, 15:00; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Luống cedar 1,2 × 2,4 m; Trạng thái S4_PLANTED→S4_PLANTED

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt/trang phục khớp
- [ ] Hạt/đất/nhãn không tự hiện
- [ ] Không chữ đọc được trên gói/nhãn
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH058 · SQ07 · 08:24.40–08:36.40

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH058**: Viết nhãn bằng bút chì (góc nghiêng, chữ không đọc được), cắm vào đầu hàng. |
| 2. Mục tiêu cảnh | Đánh dấu: viết nhãn, cắm vào đầu hàng. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **12 s** trên timeline = SH058_01.mp4 dùng 6 s (Muse tạo 10 s) + SH058_02.mp4 dùng 6 s (Muse tạo 10 s) |
| 7. First / Last frame | SH058_01.mp4: đầu `gl1-SH058-a.png`, cuối không có<br>SH058_02.mp4: đầu `gl1-SH058-b.png`, cuối `gl1-SH058-c.png` |
| 9. Output filename | `SH058_01.mp4`, `SH058_02.mp4` |
| Camera / ánh sáng | CLOSE (C→W) · CU · Ngày 2 15:10 · S4_PLANTED→S4_PLANTED |
| Bố cục | CU nghiêng: bút chì trên nhãn (chữ không đọc được), cắm nhãn. |
| Âm thanh (cho Codex) | Bút chì trên nhựa, nhãn cắm đất. / Bút chì trên nhựa, nhãn cắm đất. |

### 4. Image prompt

**`gl1-SH058-a.png`** (ảnh #34). Gửi kèm: `gl1-SH050-c.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Close-up at a steep side angle of her bare hands holding one of the small plain white plastic plant labels from the reference image against the cedar board and writing on it with a pencil; the writing is seen edge-on and is NOT readable — only a few faint grey marks. Light: warm mid-afternoon spring sun from the south-west, soft shadows. Only her hands are in frame. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH058-b.png`** (ảnh #35). Gửi kèm: `gl1-P-C-S3.png`, `gl1-SH058-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Close-up at the end of a sown row in the cedar frame filled with dark soil of the first reference, camera 0.5 m high, 50 mm, side view. Light: warm mid-afternoon spring sun from the south-west, soft shadows. Her bare right hand holds the small white plastic label from the second reference, its pointed end just touching the soil at the end of the row; the label is seen from the side so no writing is readable. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH058-c.png`** (ảnh #36). Gửi kèm: `gl1-SH058-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera, framing and light. Only change: the label is pushed upright into the soil at the end of the row and her fingers let go. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH058_01.mp4`**: First frame `gl1-SH058-a.png` · Last frame không · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image. Only this one woman is ever in the scene; no other person appears. Her pencil writes a short word on the label with small strokes; the writing stays edge-on and unreadable. Nothing else changes. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH058_02.mp4`**: First frame `gl1-SH058-b.png` · Last frame `gl1-SH058-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She pushes the label down into the soil at the end of the row until it stands upright, then lets go, as in the end frame. Only this label moves. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, readable writing on labels or packets, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, seeds or soil appearing in bulk, frames changing size, green sprouts.
```

**Continuity:** Ngày 2, 15:10; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Luống cedar 1,2 × 2,4 m; Trạng thái S4_PLANTED→S4_PLANTED

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt/trang phục khớp
- [ ] Hạt/đất/nhãn không tự hiện
- [ ] Không chữ đọc được trên gói/nhãn
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH059 · SQ07 · 08:36.40–08:48.40

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH059**: Cắm các nhãn còn lại dọc đầu đông các hàng; phủi tay. |
| 2. Mục tiêu cảnh | Hoàn tất gieo: cắm các nhãn còn lại. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S2.png` |
| 6. Thời lượng mục tiêu | **12 s** trên timeline = SH059_01.mp4 dùng 6 s (Muse tạo 10 s) + SH059_02.mp4 dùng 6 s (Muse tạo 10 s) |
| 7. First / Last frame | SH059_01.mp4: đầu `gl1-SH059-a.png`, cuối `gl1-SH059-b.png`<br>SH059_02.mp4: đầu `gl1-SH059-b.png`, cuối `gl1-SH059-c.png` |
| 9. Output filename | `SH059_01.mp4`, `SH059_02.mp4` |
| Camera / ánh sáng | CLOSE (D→E) · MS · Ngày 2 15:20 · S4_PLANTED→S4_PLANTED |
| Bố cục | MS hướng D→E: Elise quỳ trên lối giữa hai luống. |
| Âm thanh (cho Codex) | Nhãn cắm đất. / Nhãn cắm đất. |

### 4. Image prompt

**`gl1-P-D-S2.png`** (ảnh #1). Gửi kèm: `gl1-P-D-S1.png`, `gl1-P-A-S2.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate exactly the camera position, lens, framing, house, deck, shed, compost bin, apple tree and fences of the FIRST reference image. Only change: the canes and strings are gone and two identical new cedar raised-bed frames (1.2 m × 2.4 m, about 14 cm high) sit exactly where the rectangles were, parallel, with lighter brown loosened native soil inside, as in the SECOND reference. Light: bright midday spring sun high in the south, short soft shadows. No person anywhere. Real photo, no text, no logos, no watermark.
```

**`gl1-SH059-a.png`** (ảnh #37). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S2.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Medium shot of the vegetable area of the second reference, the two cedar frames now filled with dark smooth soil with faint sown rows, camera 1.2 m high, 35 mm, looking east. Light: warm mid-afternoon spring sun from the south-west, soft shadows. Elise kneels on the path between the beds, seen from the side, pushing a small white plastic label into the end of a row of the left bed; two labels already stand at the ends of earlier rows; she holds the remaining labels in her left hand. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH059-b.png`** (ảnh #38). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH059-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: one more label stands at the end of the next row; she moves along the path to the next row. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH059-c.png`** (ảnh #39). Gửi kèm: `gl1-SH059-a.png`, `gl1-SH059-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: she brushes the soil from her hands, kneeling up, the labels standing at the row ends. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH059_01.mp4`**: First frame `gl1-SH059-a.png` · Last frame `gl1-SH059-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise pushes the label into the soil at the end of the row, then shuffles along the path and pushes the next label in, as in the end frame. Labels appear only where her hand pushes them. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands (no gloves); natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH059_02.mp4`**: First frame `gl1-SH059-b.png` · Last frame `gl1-SH059-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She pushes in the last label of the bed and brushes the soil off her hands, as in the end frame. The labels already in the soil do not move. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands (no gloves); natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, readable writing on labels or packets, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, seeds or soil appearing in bulk, frames changing size, green sprouts.
```

**Continuity:** Ngày 2, 15:20; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Luống cedar 1,2 × 2,4 m; Trạng thái S4_PLANTED→S4_PLANTED

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt/trang phục khớp
- [ ] Hạt/đất/nhãn không tự hiện
- [ ] Không chữ đọc được trên gói/nhãn
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH060 · SQ07 · 08:48.40–08:55

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH060**: Từ cổng: Elise quỳ cắm nhãn cuối ở BED-02; hai luống có hàng nhãn trắng. |
| 2. Mục tiêu cảnh | Mốc S4 từ cổng. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **6.6 s** trên timeline = SH060_01.mp4 dùng 6.6 s (Muse tạo 10 s) |
| 7. First / Last frame | SH060_01.mp4: đầu `gl1-SH060-a.png`, cuối không có |
| 9. Output filename | `SH060_01.mp4` |
| Camera / ánh sáng | CAM_A_ENTRANCE · WS · Ngày 2 15:30 · S4_PLANTED→S4_PLANTED |
| Bố cục | WS khung CAM_A (ảnh nền A-S4). |
| Âm thanh (cho Codex) | Chim chiều. |

### 4. Image prompt

**`gl1-SH060-a.png`** (ảnh #40). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S4.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. Light: warm afternoon sun from the west-south-west, longer soft shadows. Elise kneels on the path beside the right bed (BED-02), seen from the side, pushing the last white label into the end of its third row. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH060_01.mp4`**: First frame `gl1-SH060-a.png` · Last frame không · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image. Only this one woman is ever in the scene; no other person appears. Elise pushes the last white label into the soil at the end of the row, sits back on her heels and looks along the two finished beds. The beds and labels stay exactly the same; no sprouts appear. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands (no gloves); natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, readable writing on labels or packets, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, seeds or soil appearing in bulk, frames changing size, green sprouts.
```

**Continuity:** Ngày 2, 15:30; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Luống cedar 1,2 × 2,4 m; Trạng thái S4_PLANTED→S4_PLANTED

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt/trang phục khớp
- [ ] Hạt/đất/nhãn không tự hiện
- [ ] Không chữ đọc được trên gói/nhãn
- [ ] Mỗi clip ≥ 5 s dùng được

