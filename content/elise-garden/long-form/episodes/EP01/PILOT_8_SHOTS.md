# EP01: production package cho 8 shot pilot

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

Khối lượng: **22 ảnh** (5 plate + khung) + 1 ảnh Elise, **13 clip Muse**, 75 s trên timeline. Dự phòng 30% làm lại.

## Thứ tự tạo ảnh

| # | File | Gửi kèm |
|---:|---|---|
| 1 | `gl1-P-A-S2.png` | `gl1-P-A-S4.png` |
| 2 | `gl1-P-A-S1.png` | `gl1-P-A-S2.png` |
| 3 | `gl1-P-A-S0.png` | `gl1-P-A-S1.png` |
| 4 | `gl1-SH009-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S0.png` |
| 5 | `gl1-SH009-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH009-a.png` |
| 6 | `gl1-SH018-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S0.png` |
| 7 | `gl1-SH018-a.png` | `gl1-SH018-b.png` |
| 8 | `gl1-SH018-c.png` | `gl1-SH018-a.png`, `gl1-SH018-b.png` |
| 9 | `gl1-SH024-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S1.png` |
| 10 | `gl1-SH030-a.png` | `gl1-A-elise-garden-truoc.png` |
| 11 | `gl1-SH030-b.png` | `gl1-SH030-a.png` |
| 12 | `gl1-SH030-c.png` | `gl1-SH030-a.png`, `gl1-SH030-b.png` |
| 13 | `gl1-SH040-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S2.png` |
| 14 | `gl1-P-C-S3.png` | `gl1-R-aerial-S4.png`, `gl1-P-A-S2.png` |
| 15 | `gl1-SH048-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S3.png` |
| 16 | `gl1-SH048-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH048-a.png` |
| 17 | `gl1-SH048-c.png` | `gl1-SH048-a.png`, `gl1-SH048-b.png` |
| 18 | `gl1-SH052-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S3.png` |
| 19 | `gl1-SH052-b.png` | `gl1-SH052-a.png` |
| 20 | `gl1-SH052-c.png` | `gl1-SH052-a.png`, `gl1-SH052-b.png` |
| 21 | `gl1-P-D-S5.png` | `gl1-R-aerial-S4.png`, `gl1-P-A-S4.png` |
| 22 | `gl1-SH079-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S5.png` |

## Danh sách clip Muse

| Output filename | Shot | First frame | Last frame | Reference | Muse tạo | Dùng trên timeline |
|---|---|---|---|---|---:|---|
| `SH009_01.mp4` | SH009 | `gl1-SH009-a.png` | `gl1-SH009-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 8.5 s @ 00:35 |
| `SH018_01.mp4` | SH018 | `gl1-SH018-a.png` | `gl1-SH018-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 5 s @ 01:44 |
| `SH018_02.mp4` | SH018 | `gl1-SH018-b.png` | `gl1-SH018-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 4.6 s @ 01:49 |
| `SH024_01.mp4` | SH024 | `gl1-P-A-S0.png` | — | — | 10 s | 2 s @ 02:32.80 |
| `SH024_02.mp4` | SH024 | `gl1-SH024-a.png` | — | `gl1-A-elise-garden-truoc.png` | 10 s | 8.5 s @ 02:34.80 |
| `SH030_01.mp4` | SH030 | `gl1-SH030-a.png` | `gl1-SH030-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 5 s @ 03:34.80 |
| `SH030_02.mp4` | SH030 | `gl1-SH030-b.png` | `gl1-SH030-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 5 s @ 03:39.80 |
| `SH040_01.mp4` | SH040 | `gl1-SH040-a.png` | — | `gl1-A-elise-garden-truoc.png` | 10 s | 8 s @ 05:15 |
| `SH048_01.mp4` | SH048 | `gl1-SH048-a.png` | `gl1-SH048-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6.5 s @ 06:43 |
| `SH048_02.mp4` | SH048 | `gl1-SH048-b.png` | `gl1-SH048-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 4.5 s @ 06:49.50 |
| `SH052_01.mp4` | SH052 | `gl1-SH052-a.png` | `gl1-SH052-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 3.9 s @ 07:28 |
| `SH052_02.mp4` | SH052 | `gl1-SH052-b.png` | `gl1-SH052-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 5 s @ 07:31.90 |
| `SH079_01.mp4` | SH079 | `gl1-SH079-a.png` | — | `gl1-A-elise-garden-truoc.png` | 10 s | 8.5 s @ 11:43 |

Bản dựng thử (Codex/Remotion): nối 8 shot theo đúng timecode. Thêm chữ 'Day 1/2/3' và nhãn AI. SH024 có slot 12 s: 2 s cảnh hoang + 10 s cảnh đã dọn. Mặc định cắt thẳng; nếu hòa thì giữ tổng slot 12 s, không trừ chồng thêm. Chưa cần lời dẫn.
Ảnh/clip vẫn chưa có. Manifest là kế hoạch nhận file; watcher/ingest và composition Garden chưa triển khai. Các bước dưới đây không gọi API hay tự gửi Muse.

---

## SH009 · SQ02 · 00:35–00:43.50

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH009**: Toàn cảnh từ cổng, khu đất TRƯỚC: Elise vừa bước vào, đẩy cành mâm xôi, đi theo vệt lối mòn rồi ngồi xổm vạch cỏ xem đất. |
| 2. Mục tiêu cảnh | Đặt không gian và quy mô việc: khu đất hoang nhìn từ cổng, Elise bước vào xem đất. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S0.png` |
| 6. Thời lượng mục tiêu | **8.5 s** trên timeline = SH009_01.mp4 dùng 8.5 s (Muse tạo 10 s) |
| 7. First / Last frame | SH009_01.mp4: đầu `gl1-SH009-a.png`, cuối `gl1-SH009-b.png` |
| 9. Output filename | `SH009_01.mp4` |
| Camera / ánh sáng | CAM_A_ENTRANCE · WS · Ngày 1 08:30 · S0_BEFORE→S0_BEFORE |
| Bố cục | WS từ CAM_A. Elise ở tiền cảnh phải (khoảng 1/5 chiều cao khung), nhìn 3/4 sau lưng; lối mòn dẫn mắt lên bậc deck; cỏ hoang chiếm 2/3 dưới. |
| Âm thanh (cho Codex) | Cổng gỗ kẹt nhẹ ở đầu, cỏ khô sột soạt dưới chân, chim sáng đầu xuân, gió nhẹ. Không nhạc, không lời. |

### 4. Image prompt

**`gl1-P-A-S0.png`** (ảnh #3). Gửi kèm: `gl1-P-A-S1.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate exactly the camera position, lens, framing, house, deck, fence, gate and shed of the reference image. Earlier, before any work was done; only these changes: the whole plot is neglected and overgrown — knee-high pale dry grass with fresh green shoots everywhere, arching bramble stems along the fences, clumps of broad-leaved dock and nettles, a few old cracked terracotta pots, scattered stones and a rusty roll of wire half hidden in the grass; only a faint trodden line where the path runs from the gate to the house door; no canes, no strings, no frames, no bare soil; the patio pad is half covered by grass; the compost bin holds only old dark compost. Light: soft, bright, slightly overcast early-spring morning with a faint sun glow from the right (east). No person. Real photo, no text, no labels, no logos, no watermark.
```

**`gl1-SH009-a.png`** (ảnh #4). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S0.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Same garden, camera, framing and light as the SECOND reference. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, beds and the woman keep exactly the same size and position in the frame. The backyard is neglected and overgrown: the lawn has grown into knee-high pale dry grass with fresh green shoots, wild blackberry canes arch along the fences, clumps of broad-leaved dock, dandelions and nettles, a few old cracked terracotta pots, scattered stones and a rusty roll of wire half hidden in the grass; the concrete patio pad is half covered by grass. Only a faint trodden line runs from the back gate to the deck steps. No beds, no wooden frames, no lumber, no strings. Light: soft, bright, slightly overcast early-spring morning, diffuse light with a faint sun glow from the east, cool fresh colours, a little haze. Elise has just stepped into the garden through the gate beside the camera: she stands in the right foreground about 2 m from the camera, seen three-quarters from behind so part of her face in profile is visible, on the faint trodden line in the long grass, her right bare hand pushing one long bramble stem aside, her left hand holding a small closed brown notebook, a yellow tape measure clipped to her trouser pocket. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, small gold hoop earrings, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH009-b.png`** (ảnh #5). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH009-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Same garden, camera, framing and light as the SECOND reference. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, beds and the woman keep exactly the same size and position in the frame. A few seconds later in the same walk: Elise is now about 6 m from the camera on the faint path line, slightly left of centre, crouching and parting the long grass with her right hand to look at the soil where the left bed will be, her face in profile turned to the left, the notebook in her left hand. The grass is slightly flattened along the line she walked. Everything else is identical to the second reference: same bramble, pots, stones and fence. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, small gold hoop earrings, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH009_01.mp4`**: First frame `gl1-SH009-a.png` · Last frame `gl1-SH009-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise walks forward along the faint trodden line through the knee-high grass, away from the camera, pushing a bramble stem aside and letting it swing back; after a few steps she turns slightly left, crouches and parts the grass with her right hand to look at the soil, as in the end frame. The grass bends only where her legs and hand touch it. The yard, fence, house, beds and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, beds or frames already present, path already clean, gloves on hands.
```

**Continuity:** BED-01 trái / BED-02 phải (chỗ sẽ đặt) so với CAM_A; bậc deck hơi trái tâm; deck bên trái, cửa sổ bếp gần giữa; không găng; sổ nâu tay trái

**Đạt khi:**
- [ ] Khung đầu và cuối cùng vị trí máy (so nhà/rào bằng lưới)
- [ ] Cỏ chỉ ngả nơi chân/tay chạm
- [ ] Không người thứ hai
- [ ] Mặt Elise giống ảnh tham chiếu khi quay nghiêng
- [ ] Dùng được ≥ 8 s liền không méo

---

## SH018 · SQ03 · 01:44–01:53.60

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH018**: Elise quỳ, xới chĩa tay quanh khóm chút chít, nhổ nguyên rễ cọc dài, giũ đất. |
| 2. Mục tiêu cảnh | Khoảnh khắc thỏa mãn của việc dọn cỏ: rễ cọc chút chít ra nguyên một rễ. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **9.6 s** trên timeline = SH018_01.mp4 dùng 5 s (Muse tạo 10 s) + SH018_02.mp4 dùng 4.6 s (Muse tạo 10 s) |
| 7. First / Last frame | SH018_01.mp4: đầu `gl1-SH018-a.png`, cuối `gl1-SH018-b.png`<br>SH018_02.mp4: đầu `gl1-SH018-b.png`, cuối `gl1-SH018-c.png` |
| 9. Output filename | `SH018_01.mp4`, `SH018_02.mp4` |
| Camera / ánh sáng | CLOSE (D→E) · MS · Ngày 1 10:00 · S0_BEFORE→S0_BEFORE |
| Bố cục | MS, máy 1,2 m, 35 mm, từ phía tây nhìn đông, hơi chúc. Elise quỳ ở 1/3 trái, khóm chút chít giữa khung; hậu cảnh rào đông, góc nhà ở mép trái. |
| Âm thanh (cho Codex) | Chĩa cắm đất, đất nứt, găng da cọ cán gỗ, chim xa. Không nhạc. / Rễ bứt khỏi đất, đất rơi lộp độp, chim. Không nhạc. |

### 4. Image prompt

**`gl1-SH018-a.png`** (ảnh #7). Gửi kèm: `gl1-SH018-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera position, distance, height and framing, same woman, outfit, gloves, kneeling pad, bucket, grass, fence and light; the woman and the bucket keep exactly the same size and position in the frame. Only change — a few seconds earlier: the dock clump stands upright and intact with its broad leaves spread, the soil around it is undisturbed (no cracks, no hole); both of her gloved hands hold the short wooden-handled hand fork pushed straight into the soil right beside the clump. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH018-b.png`** (ảnh #6). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S0.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the second reference exactly — same camera, framing, light, grass, bucket and kneeling pad. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, beds and the woman keep exactly the same size and position in the frame. Only change: Elise has levered the hand fork back; the soil around the dock clump has cracked open and the clump is tilted up, her left gloved hand gripping the base of its leaves. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, small gold hoop earrings, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH018-c.png`** (ảnh #8). Gửi kèm: `gl1-SH018-a.png`, `gl1-SH018-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the second reference exactly — same camera, framing, light, grass, bucket and kneeling pad. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, beds and the woman keep exactly the same size and position in the frame. Only change: Elise holds the whole dock plant up at chest height in her left gloved hand, its single long pale tapering taproot intact (about 25 cm), loose soil falling from it; the hand fork lies on the grass; a neat hole remains where the plant was. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, small gold hoop earrings, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH018_01.mp4`**: First frame `gl1-SH018-a.png` · Last frame `gl1-SH018-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise pushes the hand fork deeper beside the dock clump and levers it back twice; the soil cracks and the clump tilts up, and she grips the base of its leaves, as in the end frame. Only this one dock plant moves. The yard, fence, house, beds and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH018_02.mp4`**: First frame `gl1-SH018-b.png` · Last frame `gl1-SH018-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise pulls steadily upward and lifts the whole dock plant out of the ground with its long pale taproot, then shakes the loose soil off once, as in the end frame. The root stays one single root; no extra plants or roots appear. The yard, fence, house, beds and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, root breaking into many roots, weeds multiplying, bare hands, tool changing shape.
```

**Continuity:** Găng da nâu (ngày 1 việc đất); Hướng nhìn đông: rào đông sau lưng khóm cỏ, nhà mép trái; Xô đen bên phải Elise; Trạng thái S0 xung quanh

**Đạt khi:**
- [ ] Rễ cọc liền một rễ, dài, đúng cây chút chít
- [ ] Tay cầm chĩa đúng chiều, không xuyên qua đất kỳ quặc
- [ ] Hai clip nối liền ở khung b
- [ ] Mặt nhìn 3/4 ổn định
- [ ] ≥ 5 s dùng được mỗi clip

---

## SH024 · SQ03 · 02:32.80–02:43.30

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH024**: Cùng khung SH009: 2 s hòa từ cảnh hoang (AMB_A_S0) sang khu đã dọn; Elise buộc dây vào cọc cuối, cầm cào đi về phía máy. |
| 2. Mục tiêu cảnh | Trước/sau lần 1 cùng một khung với SH009: khu giữa đã sạch, vị trí hai luống đã căng dây. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S1.png` |
| 6. Thời lượng mục tiêu | **10.5 s** trên timeline = SH024_01.mp4 dùng 2 s (Muse tạo 10 s) + SH024_02.mp4 dùng 8.5 s (Muse tạo 10 s) |
| 7. First / Last frame | SH024_01.mp4: đầu `gl1-P-A-S0.png`, cuối không có<br>SH024_02.mp4: đầu `gl1-SH024-a.png`, cuối không có |
| 9. Output filename | `SH024_01.mp4`, `SH024_02.mp4` |
| Camera / ánh sáng | CAM_A_ENTRANCE · WS · Ngày 1 15:30 · S1_CLEARED→S1_CLEARED |
| Bố cục | WS CAM_A, đúng khung SH009. Elise ở góc đông bắc dây BED-02 (phải giữa khung), sau đó cầm cào đi về phía máy theo lối. |
| Âm thanh (cho Codex) | Gió qua cỏ khô, chim. Không nhạc. / Dây căng bật, cọc tre, bước chân trên đất mềm, chim chiều. Không nhạc. |
| Dựng | 0–2 s: SH024_01 (cảnh hoang, không người) hòa sang SH024_02 cùng khung. 2–10,5 s: SH024_02. |

### 4. Image prompt

**`gl1-P-A-S1.png`** (ảnh #2). Gửi kèm: `gl1-P-A-S2.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera position, lens and framing, same house, deck, fence, gate and shed. The day before; only these changes: (1) the two wooden frames are not built yet: in their exact places two rectangles are marked on bare raked dark-brown soil with a bamboo cane at each corner and taut white string; (2) the wooden compost bin by the shed is heaped with freshly pulled green weeds; (3) the light is pale late-afternoon sun from the left (west-south-west) with long soft shadows to the right. No person. Real photo, no text, no labels, no logos, no watermark.
```

**`gl1-SH024-a.png`** (ảnh #9). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S1.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Same garden, camera, framing and light as the SECOND reference. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, beds and the woman keep exactly the same size and position in the frame. The whole lawn has been mowed short, pale and a little patchy but tidy; in the right half of the yard a rectangular vegetable area (about 5 m wide and 4.5 m deep, from the path line to near the east fence) is cleared to bare, raked, dark-brown soil. Two rectangles are marked on the bare soil with a bamboo cane at each corner and taut white string: BED-01 left of the 1.2 m path and BED-02 right of it, each 1.2 m wide and 2.4 m long (4 × 8 ft), long sides pointing toward the house, parallel. No wooden frames yet. Light: pale late-afternoon early-spring sun from the west-south-west, long soft shadows, slightly warm. Elise crouches at the far-right (north-east) corner cane of the BED-02 string rectangle, winding the white string twice around the cane, her face in three-quarter view toward the camera-left; a long-handled metal rake lies on the soil beside the bed. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, small gold hoop earrings, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH024_01.mp4`**: First frame `gl1-P-A-S0.png` · Last frame không · Reference không · 10 s. _Clip nền không người. Dùng 2 s đầu của SH024 (hòa sang S1); dùng lại có chủ ý ở SH004 và SH066 — Codex lấy cùng file SH024_01.mp4._

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot, no zoom, no pan, no cuts. The video must start exactly like the start-frame image. No person. A light breeze moves the long dry grass and the bramble stems gently; a small bird lands on the fence top. The house, fence, light and every object stay exactly the same. Duration: 10 seconds.
```

**`SH024_02.mp4`**: First frame `gl1-SH024-a.png` · Last frame không · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image. Only this one woman is ever in the scene; no other person appears. Elise pulls the white string taut, wraps it twice around the bamboo cane and ties it off, then stands up, picks up the rake lying beside the bed and starts walking along the path toward the camera. The strings and canes stay exactly in place; the cleared soil does not change. The yard, fence, house, beds and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, frames already built, weeds still standing in the cleared area, strings sagging or multiplying.
```

**Continuity:** Khung trùng khít SH009 (đặt lưới so nhà/cửa/rào); Nắng từ trái (chiều); Hai hình chữ nhật đúng kích thước tương đối, song song; Ven rào cỏ thấp chưa xới

**Đạt khi:**
- [ ] Hòa cảnh trước/sau không lệch kiến trúc > 2% chiều rộng khung
- [ ] Dây và cọc không xê dịch
- [ ] Không có khung gỗ
- [ ] Elise đi về phía máy không bị kéo cận mặt

---

## SH030 · SQ04 · 03:34.80–03:44.80

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH030**: Kẹp cọc góc dưới đầu ván, khoan bắt hai vít vào lỗ mồi đến khi đầu vít phẳng mặt gỗ. |
| 2. Mục tiêu cảnh | Chứng minh khung tự đóng: bắt hai vít vào lỗ mồi, vít đi thẳng, không tự sinh thêm vít. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **10 s** trên timeline = SH030_01.mp4 dùng 5 s (Muse tạo 10 s) + SH030_02.mp4 dùng 5 s (Muse tạo 10 s) |
| 7. First / Last frame | SH030_01.mp4: đầu `gl1-SH030-a.png`, cuối `gl1-SH030-b.png`<br>SH030_02.mp4: đầu `gl1-SH030-b.png`, cuối `gl1-SH030-c.png` |
| 9. Output filename | `SH030_01.mp4`, `SH030_02.mp4` |
| Camera / ánh sáng | CLOSE (B→S) · CU · Ngày 2 09:40 · S1_CLEARED→S1_CLEARED |
| Bố cục | CU máy 1,0 m, 50 mm, chúc ~30° xuống mối ghép trên ngựa gỗ; tay hai bên, mặt ngoài khung (chỉ thấy vai/cằm). |
| Âm thanh (cho Codex) | Khoan pin bắt vít một hơi, gỗ rít, vít leng keng nhẹ. Không nhạc. / Khoan bắt vít lần hai, gỗ, chim xa. Không nhạc. |

### 4. Image prompt

**`gl1-SH030-a.png`** (ảnh #10). Gửi kèm: `gl1-A-elise-garden-truoc.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Close-up on the small concrete patio at the foot of the wooden deck, the grey lap-sided house wall soft and out of focus behind, camera 1.0 m high, 50 mm full-frame equivalent, looking down about 30 degrees. Light: soft morning sun with thin cloud, gentle shadows. The end of a long raw reddish-tan cedar 2×6 board (14 cm wide, 3.8 cm thick) lies flat across a wooden sawhorse; a short square wooden corner post sits flush under the board end, held by one orange quick clamp. Two small pilot holes are drilled in the board face at pencil cross marks near the end. Elise's bare left hand holds the board steady; her right hand holds a plain dark-grey cordless drill with no brand, a wood screw on the bit, its tip in the first pilot hole. Only her hands, bare forearms and part of her shoulder with the orange tank-top strap are in frame. Natural realistic skin texture, no freckles. Exactly one screw is visible. Real photo, no text, no logos, no watermark.
```

**`gl1-SH030-b.png`** (ảnh #11). Gửi kèm: `gl1-SH030-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera, framing, light, board, clamp, post and hands. Only change: the first screw is now driven fully in, its head flush with the wood with a tiny curl of sawdust beside it; the drill is lifted slightly and her left fingertips hold a second screw onto the bit tip above the second pilot hole. Exactly two screws exist. Real photo, no text, no logos, no watermark.
```

**`gl1-SH030-c.png`** (ảnh #12). Gửi kèm: `gl1-SH030-a.png`, `gl1-SH030-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the second reference exactly — same camera, framing, light, board, clamp, post and hands. Only change: both screws are driven flush into the two pilot holes; the drill is lifting away; her left hand still holds the board. Exactly two screws. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH030_01.mp4`**: First frame `gl1-SH030-a.png` · Last frame `gl1-SH030-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. She squeezes the drill trigger and drives the first screw straight down into the pilot hole until its head sits flush with the wood; a little sawdust curls out. She lifts the drill and with her left fingertips sets a second screw on the bit, as in the end frame. Exactly two screws exist; no other screws appear. The board, clamp and post never move. The board, post, clamp, sawhorse and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH030_02.mp4`**: First frame `gl1-SH030-b.png` · Last frame `gl1-SH030-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. She places the second screw into the second pilot hole and drives it straight in until its head sits flush, then lifts the drill away, as in the end frame. Exactly two screws; the board, clamp and post never move. The board, post, clamp, sawhorse and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: extra screws appearing, drill brand/logo, screw going in sideways, board splitting, gloves, face close-up, generated text.
```

**Continuity:** Tay trần (không găng khi khoan); Cánh tay trần, quai áo ba lỗ cam; Kẹp cam, ngựa gỗ, sân bê tông; Ván cedar đỏ nâu giống mọi khung khác

**Đạt khi:**
- [ ] Đúng 2 vít, vít đi thẳng vào lỗ mồi
- [ ] Đầu vít phẳng mặt gỗ ở khung cuối
- [ ] Không tay thứ ba/ngón thừa
- [ ] Khoan quay khi vít vào (chuyển động hợp lý)

---

## SH040 · SQ05 · 05:15–05:23

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH040**: Từ cổng: hai khung đã nằm đúng chỗ; Elise rút cọc, quấn dây, mang về bó cọc trên lối. |
| 2. Mục tiêu cảnh | Lần đầu thấy hình dáng khu vườn: hai khung song song đúng chỗ, cùng khung SH009/SH024. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S2.png` |
| 6. Thời lượng mục tiêu | **8 s** trên timeline = SH040_01.mp4 dùng 8 s (Muse tạo 10 s) |
| 7. First / Last frame | SH040_01.mp4: đầu `gl1-SH040-a.png`, cuối không có |
| 9. Output filename | `SH040_01.mp4` |
| Camera / ánh sáng | CAM_A_ENTRANCE · WS · Ngày 2 11:30 · S2_FRAMES→S2_FRAMES |
| Bố cục | WS CAM_A, đúng khung SH009/SH024. Elise quỳ ở góc gần-trái BED-01 (trái giữa), bó cọc trên lối. |
| Âm thanh (cho Codex) | Cọc rút khỏi đất, dây quấn, bước chân, chim trưa. Không nhạc. |

### 4. Image prompt

**`gl1-P-A-S2.png`** (ảnh #1). Gửi kèm: `gl1-P-A-S4.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera position, lens and framing, same house, deck, fence, gate, shed and path. Earlier the same day; only these changes: (1) inside both wooden frames there is only lighter brown, loosened native soil, slightly uneven and lumpy, about 8 cm below the rim — no compost, no sowing rows, no labels; (2) the light is late morning: bright soft spring sun from the right-front (south-east), short soft shadows, a few white clouds. The two frames keep exactly their shape, size and position. No person. Real photo, no text, no labels, no logos, no watermark.
```

**`gl1-SH040-a.png`** (ảnh #13). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-A-S2.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Same garden, camera, framing and light as the SECOND reference. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, beds and the woman keep exactly the same size and position in the frame. The whole lawn has been mowed short, pale and a little patchy but tidy; in the right half of the yard a rectangular vegetable area (about 5 m wide and 4.5 m deep, from the path line to near the east fence) is cleared to bare, raked, dark-brown soil. Two identical new raw reddish-tan cedar raised-bed frames, each 4 × 8 ft (1.2 m wide, 2.4 m long) and about 14 cm high, one cedar 2×6 board per side, long sides pointing toward the house, parallel, with a 1.2 m path between them: BED-01 left of the path, BED-02 right of the path. They sit in the right (east) half of the yard; the left half stays lawn. Inside the frames is only bare loosened brown native soil — no compost, nothing planted, no labels. Light: bright soft spring sun high in the south-east, short soft shadows, a few white clouds. The two frames have exactly the shape, size and position of the frames in the second reference. Elise kneels at the near-left (south-west) outside corner of BED-01, pulling the last bamboo cane out of the soil with white string wound around it; a small bundle of canes lies on the path. Her face is in three-quarter view. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, small gold hoop earrings, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH040_01.mp4`**: First frame `gl1-SH040-a.png` · Last frame không · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image. Only this one woman is ever in the scene; no other person appears. Elise pulls the bamboo cane out of the soil, winds the last white string around it in two turns, stands up and walks a few steps along the path to lay the cane on the bundle. The two wooden frames never move and keep exactly their shape, size and position. The yard, fence, house, beds and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, frames different sizes, frames not parallel, compost in beds, extra frames.
```

**Continuity:** Hai khung giống hệt, song song, cách 2 m; Cùng khung SH009/SH024; Bên trong khung là đất tại chỗ, chưa phân ủ; Nắng trưa từ trước-phải

**Đạt khi:**
- [ ] Khung giữ hình chữ nhật, không cong/đổi cỡ trong suốt clip
- [ ] Không còn dây trên luống cuối clip trừ cọc đang cầm
- [ ] Kiến trúc khớp SH009 khi chồng ảnh

---

## SH048 · SQ06 · 06:43–06:54

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH048**: Từ rào đông: hai luống đã đầy đất trộn phân; Elise cào những đường cuối trên BED-02 rồi lật cào làm phẳng. |
| 2. Mục tiêu cảnh | Luống sẵn sàng: mặt đất trộn phân ủ được cào mịn, thử khung CAM_C. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S3.png` |
| 6. Thời lượng mục tiêu | **11 s** trên timeline = SH048_01.mp4 dùng 6.5 s (Muse tạo 10 s) + SH048_02.mp4 dùng 4.5 s (Muse tạo 10 s) |
| 7. First / Last frame | SH048_01.mp4: đầu `gl1-SH048-a.png`, cuối `gl1-SH048-b.png`<br>SH048_02.mp4: đầu `gl1-SH048-b.png`, cuối `gl1-SH048-c.png` |
| 9. Output filename | `SH048_01.mp4`, `SH048_02.mp4` |
| Camera / ánh sáng | CAM_C_EAST_FENCE · WS · Ngày 2 13:30 · S3_SOIL_READY→S3_SOIL_READY |
| Bố cục | WS CAM_C. BED-02 tiền cảnh, Elise đứng trên lối giữa hai luống quay mặt về máy, cào kéo về phía mình. |
| Âm thanh (cho Codex) | Răng cào sột soạt trong đất mềm, chim, gió nhẹ. Không nhạc. / Mặt cào miết đất, chim. Không nhạc. |

### 4. Image prompt

**`gl1-P-C-S3.png`** (ảnh #14). Gửi kèm: `gl1-R-aerial-S4.png`, `gl1-P-A-S2.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. The same garden as both reference images (the first shows the whole layout from above, the second the frames from the entrance). New camera C: at the east fence, 1.4 m high, 35 mm full-frame equivalent, looking due west and slightly down. BED-02 fills the lower foreground, BED-01 lies beyond it across the 1.2 m path; the lawn, the bare apple tree, the grey shed and the west fence form the background; the house and deck are at the right edge of the frame; the south fence and gate are at the far left. Two identical new raw reddish-tan cedar raised-bed frames, each 4 × 8 ft (1.2 m wide, 2.4 m long) and about 14 cm high, one cedar 2×6 board per side, long sides pointing toward the house, parallel, with a 1.2 m path between them: BED-01 left of the path, BED-02 right of the path. They sit in the right (east) half of the yard; the left half stays lawn. Both frames are filled to about 2 cm below the rim with dark, crumbly, compost-rich soil, raked level — no sowing rows, no labels, nothing green. An empty dark-green wheelbarrow stands on the lawn beside BED-01. Light: soft early-afternoon spring sun from the south (left of frame), thin high cloud. No person. Real photo, no text, no labels, no logos, no watermark.
```

**`gl1-SH048-a.png`** (ảnh #15). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S3.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Same garden, camera, framing and light as the SECOND reference. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, beds and the woman keep exactly the same size and position in the frame. The whole lawn has been mowed short, pale and a little patchy but tidy; in the right half of the yard a rectangular vegetable area (about 5 m wide and 4.5 m deep, from the path line to near the east fence) is cleared to bare, raked, dark-brown soil. Two identical new raw reddish-tan cedar raised-bed frames, each 4 × 8 ft (1.2 m wide, 2.4 m long) and about 14 cm high, one cedar 2×6 board per side, long sides pointing toward the house, parallel, with a 1.2 m path between them: BED-01 left of the path, BED-02 right of the path. They sit in the right (east) half of the yard; the left half stays lawn. Both are filled to about 2 cm below the rim with dark, crumbly, compost-rich soil, raked level. No seed rows, no labels, nothing green in the beds. Light: soft early-afternoon spring sun from the south, thin high cloud. Keep the second reference exactly: the two cedar beds run LEFT-TO-RIGHT across the frame with their long sides parallel to the bottom edge of the image, BED-02 in the lower foreground and BED-01 behind it, beyond them the lawn, the bare apple tree and the grey shed, the deck and house at the right edge. Never rotate, move or resize the beds. Elise stands on the strip of soil between the two beds, just behind the far long side of BED-02, facing the camera, holding a long-handled metal garden rake with its head resting on the near half of BED-02, ready to pull it toward herself; the near half of BED-02 still shows a few small lumps, the rest is level. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, small gold hoop earrings, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH048-b.png`** (ảnh #16). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH048-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the second reference exactly — same camera, framing, light and beds. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, beds and the woman keep exactly the same size and position in the frame. The beds keep running left-to-right across the frame exactly as in the reference. Only change: the lumps are gone and fine parallel rake lines run across BED-02; Elise has turned the rake over and holds its flat back on the soil. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, small gold hoop earrings, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH048-c.png`** (ảnh #17). Gửi kèm: `gl1-SH048-a.png`, `gl1-SH048-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the second reference exactly — same camera, framing, light and beds. Keep exactly the camera position, distance and framing of the SECOND reference: the house, fence, beds and the woman keep exactly the same size and position in the frame. The beds keep running left-to-right across the frame exactly as in the reference. Only change: the surface of BED-02 is perfectly smooth and level; Elise lifts the rake upright beside her, its teeth just above the soil, looking down at the bed with a small satisfied smile. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, small gold hoop earrings, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH048_01.mp4`**: First frame `gl1-SH048-a.png` · Last frame `gl1-SH048-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise pulls the rake toward herself in three slow even strokes across BED-02, leaving fine parallel lines; small lumps break only where the rake teeth pass. Then she turns the rake over onto its flat back, as in the end frame. The bed frames never move. The yard, fence, house, beds and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH048_02.mp4`**: First frame `gl1-SH048-b.png` · Last frame `gl1-SH048-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise pushes the flat back of the rake lightly back and forth twice to smooth the surface, then lifts the rake upright beside her, as in the end frame. The soil stays in the bed; nothing appears on it. The yard, fence, house, beds and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, seed rows or labels, green sprouts, soil overflowing the frame, rake changing size.
```

**Continuity:** Hướng nhìn tây: nhà mép phải, cổng mép trái; BED-01 phía sau cũng đã đầy đất; Găng da; Xe cút kít xanh sẫm ở lối xa

**Đạt khi:**
- [ ] Đất thấp hơn mép khung, không tràn
- [ ] Cào ở đúng tay, cán không gãy/biến dạng
- [ ] Mặt đất khung c mịn, không có hạt/nhãn

---

## SH052 · SQ07 · 07:28–07:36.90

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH052**: Que tre miết theo thanh gỗ kẻ rãnh nông ~1 cm ngang BED-01; rắc hạt củ cải thưa từng hạt. |
| 2. Mục tiêu cảnh | Gieo đúng kỹ thuật: rãnh nông thẳng, hạt củ cải rơi thưa từ đầu ngón tay. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **8.9 s** trên timeline = SH052_01.mp4 dùng 3.9 s (Muse tạo 10 s) + SH052_02.mp4 dùng 5 s (Muse tạo 10 s) |
| 7. First / Last frame | SH052_01.mp4: đầu `gl1-SH052-a.png`, cuối `gl1-SH052-b.png`<br>SH052_02.mp4: đầu `gl1-SH052-b.png`, cuối `gl1-SH052-c.png` |
| 9. Output filename | `SH052_01.mp4`, `SH052_02.mp4` |
| Camera / ánh sáng | CLOSE (C→W) · CU · Ngày 2 14:05 · S3_SOIL_READY→S4_PLANTED |
| Bố cục | CU máy 0,7 m, 50 mm, chúc ~50° từ lối đi (đông BED-01) nhìn tây: đất luống đầy khung, thanh gỗ nằm ngang làm thước; tay Elise vào từ dưới, mặt ở mép trên (một phần). |
| Âm thanh (cho Codex) | Que tre miết đất, hạt lắc trong gói. Không nhạc. / Hạt rơi lách tách rất nhẹ, chim gần. Không nhạc. |

**Continuity SH052:** chỉ đang gieo một phần hàng củ cải. Không tự thêm nhãn, nước tưới hoặc gieo xong các cây khác. S3→S4 hiện là mã pha thô, không phải chỉ thị vẽ toàn bộ trạng thái S4 hoàn chỉnh. Trước full episode cần tinh chỉnh trạng thái từng luống.


### 4. Image prompt

**`gl1-SH052-a.png`** (ảnh #18). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S3.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Close-up inside BED-01 of the garden in the second reference, camera 0.7 m high, 50 mm full-frame equivalent, looking west and down about 50 degrees from the path. Light: soft early-afternoon spring sun from the south, thin high cloud. Dark fine compost-rich soil fills most of the frame, with the reddish cedar frame edge along the bottom. A short straight wooden offcut board lies across the bed as a guide. Elise kneels on the path; her bare hands enter from the bottom of the frame, her chin and shoulder at the top edge. Her right hand presses the side of a bamboo cane into the soil along the board, and a shallow straight groove has been made across the left half of the bed only. No seeds yet. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, small gold hoop earrings, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH052-b.png`** (ảnh #19). Gửi kèm: `gl1-SH052-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera, framing, light, soil, board and hands. Only change: the shallow groove now runs straight across the whole width of the bed; the cane lies on the frame edge; Elise's left palm holds a small pile of round reddish-brown radish seeds and her right fingertips hold a few seeds just above the left end of the groove. No seeds in the groove yet. Natural realistic skin texture with fine pores, no freckles. Real photo, no text, no logos, no watermark.
```

**`gl1-SH052-c.png`** (ảnh #20). Gửi kèm: `gl1-SH052-a.png`, `gl1-SH052-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the second reference exactly — same camera, framing, light, soil, board and hands. Only change: single radish seeds lie in the groove about 3 cm apart along its left two-thirds; the right third is still empty; her right fingertips release a seed at the two-thirds mark. Natural realistic skin texture with fine pores, no freckles. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH052_01.mp4`**: First frame `gl1-SH052-a.png` · Last frame `gl1-SH052-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise slides the side of the bamboo cane along the board, pressing a shallow straight groove across the bed to the far end; then she lays the cane on the frame edge and tips a few radish seeds into her left palm, as in the end frame. The board never moves. The yard, fence, house, beds and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH052_02.mp4`**: First frame `gl1-SH052-b.png` · Last frame `gl1-SH052-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise moves her right hand slowly along the groove from left to right, letting single radish seeds fall from her fingertips a little apart, as in the end frame. Each seed appears only where it falls from her fingers; seeds already in the groove never move; no seeds appear by themselves. The yard, fence, house, beds and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, seeds appearing in bulk, groove too deep (trench), gloves, sprouts, seed packet text.
```

**Continuity:** Tay trần khi gieo; Hướng nhìn tây (nền: mép khung, đất); Rãnh ngang luống (tây–đông); Nửa nam BED-01 = củ cải

**Đạt khi:**
- [ ] Hạt chỉ xuất hiện từ ngón tay
- [ ] Rãnh nông, thẳng, ngang luống
- [ ] Không có hạt rải sẵn ở khung đầu
- [ ] Khoảng cách hạt thưa, không thành đống

---

## SH079 · SQ10 · 11:43–11:51.50

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH079**: Elise ngồi xổm chỉnh lại nhãn, ấn đất quanh nhãn, đứng lên nhìn hai luống và nhà, phủi tay. |
| 2. Mục tiêu cảnh | Cảm xúc kết: sáng hôm sau, chưa có mầm, Elise chỉnh nhãn và nhìn khu vườn mới. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S5.png` |
| 6. Thời lượng mục tiêu | **8.5 s** trên timeline = SH079_01.mp4 dùng 8.5 s (Muse tạo 10 s) |
| 7. First / Last frame | SH079_01.mp4: đầu `gl1-SH079-a.png`, cuối không có |
| 9. Output filename | `SH079_01.mp4` |
| Camera / ánh sáng | CAM_D_GARDEN_SIDE · MS · Ngày 3 07:25 · S5_NEXT_MORNING→S5_NEXT_MORNING |
| Bố cục | MS CAM_D (tầm gần hơn plate): BED-01 tiền cảnh, Elise ngồi xổm trên lối giữa hai luống quay về máy; ngược sáng, sương. |
| Âm thanh (cho Codex) | Chim sáng sớm, giọt sương rơi, gió rất nhẹ. Nhạc kết vào nhẹ ở bản dựng. |

### 4. Image prompt

**`gl1-P-D-S5.png`** (ảnh #21). Gửi kèm: `gl1-R-aerial-S4.png`, `gl1-P-A-S4.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. The same garden as both reference images (the first shows the whole layout from above, the second the finished beds from the entrance), the next morning. New camera D: near the west fence, 1.5 m high, 35 mm full-frame equivalent, looking north-east and slightly down. BED-01 is in the foreground right of centre, BED-02 lies beyond it to the right across the path; the back of the grey house spans the background; the east fence is in the far background. Exactly the same beds, rows and seven white labels as the second image; absolutely NO sprouts. Light: early-morning low sun from the east behind the beds, gentle backlight, thin mist over the garden, dew on the wood and labels, cool blue-gold tones. No person. Real photo, no text, no labels, no logos, no watermark.
```

**`gl1-SH079-a.png`** (ảnh #22). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S5.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Same garden, camera direction and light as the SECOND reference, a little closer: medium shot. The whole lawn has been mowed short, pale and a little patchy but tidy; in the right half of the yard a rectangular vegetable area (about 5 m wide and 4.5 m deep, from the path line to near the east fence) is cleared to bare, raked, dark-brown soil. Two identical new raw reddish-tan cedar raised-bed frames, each 4 × 8 ft (1.2 m wide, 2.4 m long) and about 14 cm high, one cedar 2×6 board per side, long sides pointing toward the house, parallel, with a 1.2 m path between them: BED-01 left of the path, BED-02 right of the path. They sit in the right (east) half of the yard; the left half stays lawn. They are filled with dark, fine, damp soil. Faint shallow sowing rows run across each bed from left to right: BED-01 has two rows in its near half and two rows in its far half; BED-02 has three rows in its near half and its far half is smooth and empty. A small white plastic plant label stands at the right-hand (east) end of each row, seven labels in total. Absolutely NO sprouts, nothing green in the beds. Light: early-morning low sun from the east behind the beds, gentle backlight, thin mist over the garden, dew on wood and labels, cool blue-gold tones. Elise crouches on the path between the two beds, facing the camera side, her bare fingertips straightening a dew-covered white plant label at the end of a row of BED-01; her face in three-quarter view, soft backlight on her hair. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, small gold hoop earrings, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH079_01.mp4`**: First frame `gl1-SH079-a.png` · Last frame không · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image. Only this one woman is ever in the scene; no other person appears. Elise straightens the plant label and presses the soil around it with one fingertip, then stands up slowly, looks across both beds toward the house with a small calm smile and brushes the soil from her fingers. The beds, labels and soil stay exactly the same; no sprouts appear. The yard, fence, house, beds and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, sprouts or seedlings, watering, harvest, sun flare covering face.
```

**Continuity:** Y hệt S4 (7 nhãn, nửa bắc BED-02 trống); Sương + ngược sáng từ đông; Không găng; Cùng bộ yếm rằn ri + áo cam như ngày 1–2

**Đạt khi:**
- [ ] Không có mầm xanh suốt clip
- [ ] Nhãn không nhân đôi/đổi chỗ
- [ ] Elise đứng lên tự nhiên, không đung đưa
- [ ] Mặt khớp tham chiếu

