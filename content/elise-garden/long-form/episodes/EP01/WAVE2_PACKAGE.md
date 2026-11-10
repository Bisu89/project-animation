# EP01: production package đợt 2 (16 shot)

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

Khối lượng: **49 ảnh** (5 plate + khung) + 1 ảnh Elise, **28 clip Muse**, 162.2 s trên timeline. Dự phòng 30% làm lại.

## Thứ tự tạo ảnh

| # | File | Gửi kèm |
|---:|---|---|
| 1 | `gl1-P-PATIO-S1.png` | `gl1-SH030-a.png`, `gl1-P-A-S1.png` |
| 2 | `gl1-P-B-S1W.png` | `gl1-P-B-S0.png`, `gl1-P-A-S1.png`, `gl1-P-PATIO-S1.png` |
| 3 | `gl1-SH026-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-B-S1W.png` |
| 4 | `gl1-SH026-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH026-a.png` |
| 5 | `gl1-SH026-c.png` | `gl1-SH026-a.png`, `gl1-SH026-b.png` |
| 6 | `gl1-SH027-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-PATIO-S1.png` |
| 7 | `gl1-SH027-b.png` | `gl1-SH027-a.png` |
| 8 | `gl1-SH028-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-PATIO-S1.png` |
| 9 | `gl1-SH028-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH028-a.png` |
| 10 | `gl1-SH028-c.png` | `gl1-SH028-a.png`, `gl1-SH028-b.png` |
| 11 | `gl1-SH029-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-PATIO-S1.png` |
| 12 | `gl1-SH029-b.png` | `gl1-SH029-a.png` |
| 13 | `gl1-SH031-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-PATIO-S1.png` |
| 14 | `gl1-SH031-b.png` | `gl1-SH031-a.png` |
| 15 | `gl1-SH031-c.png` | `gl1-SH031-a.png`, `gl1-SH031-b.png` |
| 16 | `gl1-SH032-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-PATIO-S1.png` |
| 17 | `gl1-SH032-b.png` | `gl1-SH032-a.png` |
| 18 | `gl1-SH033-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-B-S1W.png` |
| 19 | `gl1-SH033-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH033-a.png` |
| 20 | `gl1-SH033-c.png` | `gl1-SH033-a.png`, `gl1-SH033-b.png` |
| 21 | `gl1-SH034-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-PATIO-S1.png` |
| 22 | `gl1-SH034-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH034-a.png` |
| 23 | `gl1-SH034-c.png` | `gl1-SH034-a.png`, `gl1-SH034-b.png` |
| 24 | `gl1-P-D-S1.png` | `gl1-P-D-S0.png`, `gl1-P-A-S1.png` |
| 25 | `gl1-SH035-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S1.png` |
| 26 | `gl1-SH035-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH035-a.png` |
| 27 | `gl1-SH035-c.png` | `gl1-SH035-a.png`, `gl1-SH035-b.png` |
| 28 | `gl1-SH036-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S1.png` |
| 29 | `gl1-SH036-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH036-a.png` |
| 30 | `gl1-SH036-c.png` | `gl1-SH036-a.png`, `gl1-SH036-b.png` |
| 31 | `gl1-SH037-a.png` | `gl1-P-D-S1.png` |
| 32 | `gl1-SH037-b.png` | `gl1-SH037-a.png` |
| 33 | `gl1-SH037-c.png` | `gl1-SH037-a.png`, `gl1-SH037-b.png` |
| 34 | `gl1-SH038-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S1.png` |
| 35 | `gl1-SH038-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH038-a.png` |
| 36 | `gl1-SH038-c.png` | `gl1-SH038-a.png`, `gl1-SH038-b.png` |
| 37 | `gl1-SH039-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S1.png` |
| 38 | `gl1-SH039-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH039-a.png` |
| 39 | `gl1-SH039-c.png` | `gl1-SH039-a.png`, `gl1-SH039-b.png` |
| 40 | `gl1-P-B-S2.png` | `gl1-P-B-S1W.png`, `gl1-P-A-S2.png` |
| 41 | `gl1-SH041-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-B-S2.png` |
| 42 | `gl1-SH041-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH041-a.png` |
| 43 | `gl1-SH041-c.png` | `gl1-SH041-a.png`, `gl1-SH041-b.png` |
| 44 | `gl1-P-C-S2.png` | `gl1-P-C-S3.png`, `gl1-P-A-S2.png` |
| 45 | `gl1-SH042-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S2.png` |
| 46 | `gl1-SH042-b.png` | `gl1-SH042-a.png` |
| 47 | `gl1-SH043-a.png` | `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S2.png` |
| 48 | `gl1-SH043-b.png` | `gl1-A-elise-garden-truoc.png`, `gl1-SH043-a.png` |
| 49 | `gl1-SH043-c.png` | `gl1-SH043-a.png`, `gl1-SH043-b.png` |

## Danh sách clip Muse

| Output filename | Shot | First frame | Last frame | Reference | Muse tạo | Dùng trên timeline |
|---|---|---|---|---|---:|---|
| `SH026_01.mp4` | SH026 | `gl1-SH026-a.png` | `gl1-SH026-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 02:54.80 |
| `SH026_02.mp4` | SH026 | `gl1-SH026-b.png` | `gl1-SH026-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 5 s @ 03:00.80 |
| `SH027_01.mp4` | SH027 | `gl1-SH027-a.png` | `gl1-SH027-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6.5 s @ 03:05.80 |
| `SH028_01.mp4` | SH028 | `gl1-SH028-a.png` | `gl1-SH028-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6.5 s @ 03:12.30 |
| `SH028_02.mp4` | SH028 | `gl1-SH028-b.png` | `gl1-SH028-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6.5 s @ 03:18.80 |
| `SH029_01.mp4` | SH029 | `gl1-SH029-a.png` | — | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 03:25.30 |
| `SH031_01.mp4` | SH031 | `gl1-SH031-a.png` | `gl1-SH031-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 3.5 s @ 03:41.30 |
| `SH031_02.mp4` | SH031 | `gl1-SH031-b.png` | `gl1-SH031-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 03:44.80 |
| `SH032_01.mp4` | SH032 | `gl1-SH032-a.png` | `gl1-SH032-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 03:50.80 |
| `SH033_01.mp4` | SH033 | `gl1-SH033-a.png` | `gl1-SH033-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6.5 s @ 03:56.80 |
| `SH033_02.mp4` | SH033 | `gl1-SH033-b.png` | `gl1-SH033-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6.5 s @ 04:03.30 |
| `SH034_01.mp4` | SH034 | `gl1-SH034-a.png` | `gl1-SH034-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 04:09.80 |
| `SH034_02.mp4` | SH034 | `gl1-SH034-b.png` | `gl1-SH034-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 4.5 s @ 04:15.80 |
| `SH035_01.mp4` | SH035 | `gl1-SH035-a.png` | `gl1-SH035-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 5.75 s @ 04:20.30 |
| `SH035_02.mp4` | SH035 | `gl1-SH035-b.png` | `gl1-SH035-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 4.75 s @ 04:26.07 |
| `SH036_01.mp4` | SH036 | `gl1-SH036-a.png` | `gl1-SH036-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 7.3 s @ 04:30.80 |
| `SH036_02.mp4` | SH036 | `gl1-SH036-b.png` | `gl1-SH036-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 04:38.10 |
| `SH037_01.mp4` | SH037 | `gl1-SH037-a.png` | `gl1-SH037-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6.1 s @ 04:44.10 |
| `SH037_02.mp4` | SH037 | `gl1-SH037-b.png` | `gl1-SH037-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 4.2 s @ 04:50.20 |
| `SH038_01.mp4` | SH038 | `gl1-SH038-a.png` | `gl1-SH038-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 7 s @ 04:54.40 |
| `SH038_02.mp4` | SH038 | `gl1-SH038-b.png` | `gl1-SH038-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 7 s @ 05:01.40 |
| `SH039_01.mp4` | SH039 | `gl1-SH039-a.png` | `gl1-SH039-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 05:08.40 |
| `SH039_02.mp4` | SH039 | `gl1-SH039-b.png` | `gl1-SH039-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6.2 s @ 05:14.40 |
| `SH041_01.mp4` | SH041 | `gl1-SH041-a.png` | `gl1-SH041-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 05:28.60 |
| `SH041_02.mp4` | SH041 | `gl1-SH041-b.png` | `gl1-SH041-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 05:34.60 |
| `SH042_01.mp4` | SH042 | `gl1-SH042-a.png` | `gl1-SH042-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 1.4 s @ 05:40.60 |
| `SH043_01.mp4` | SH043 | `gl1-SH043-a.png` | `gl1-SH043-b.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 7 s @ 05:42 |
| `SH043_02.mp4` | SH043 | `gl1-SH043-b.png` | `gl1-SH043-c.png` | `gl1-A-elise-garden-truoc.png` | 10 s | 6 s @ 05:49 |

Bản dựng thử (Codex/Remotion): nối 8 shot theo đúng timecode. Thêm chữ 'Day 1/2/3' và nhãn AI. SH024 có slot 12 s: 2 s cảnh hoang + 10 s cảnh đã dọn. Mặc định cắt thẳng; nếu hòa thì giữ tổng slot 12 s, không trừ chồng thêm. Chưa cần lời dẫn.
Ảnh/clip vẫn chưa có. Manifest là kế hoạch nhận file; watcher/ingest và composition Garden chưa triển khai. Các bước dưới đây không gọi API hay tự gửi Muse.

---

## SH026 · SQ04 · 02:54.80–03:05.80

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH026**: Sáng ngày 2: Elise vác ván gỗ từ nhà kho đặt lên hai ngựa gỗ trên sân bê tông dưới chân deck. |
| 2. Mục tiêu cảnh | Mở ngày 2: việc mới, nơi mới (sân bê tông). |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png`, `gl1-P-B-S1W.png` |
| 6. Thời lượng mục tiêu | **11 s** trên timeline = SH026_01.mp4 dùng 6 s (Muse tạo 10 s) + SH026_02.mp4 dùng 5 s (Muse tạo 10 s) |
| 7. First / Last frame | SH026_01.mp4: đầu `gl1-SH026-a.png`, cuối `gl1-SH026-b.png`<br>SH026_02.mp4: đầu `gl1-SH026-b.png`, cuối `gl1-SH026-c.png` |
| 9. Output filename | `SH026_01.mp4`, `SH026_02.mp4` |
| Camera / ánh sáng | CAM_B_PORCH · WS · Ngày 2 08:30 · S1_CLEARED→S1_CLEARED |
| Bố cục | WS từ deck (ảnh nền B-S1W): sân bê tông có ngựa gỗ ở đáy khung. |
| Âm thanh (cho Codex) | Gỗ đặt xuống, sân bê tông. / Gỗ đặt xuống, sân bê tông. |

### 4. Image prompt

**`gl1-P-B-S1W.png`** (ảnh #2). Gửi kèm: `gl1-P-B-S0.png`, `gl1-P-A-S1.png`, `gl1-P-PATIO-S1.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate exactly the camera position, lens, framing, deck railing, house, fences, gate, shed and apple tree of the FIRST reference image. Only changes: the yard is now in the state of the SECOND reference — the whole lawn mowed short; in the right half, the vegetable area is bare raked soil with two rectangles marked by bamboo canes and taut white string; and on the concrete patio pad below the deck steps stand two wooden sawhorses with a stack of cedar boards, as in the THIRD reference. Light: soft early-morning spring sun low in the east, long soft shadows, fresh cool tones. No person anywhere. Real photo, no text, no logos, no watermark.
```

**`gl1-SH026-a.png`** (ảnh #3). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-B-S1W.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. Light: soft early-morning spring sun low in the east, long soft shadows, fresh cool tones. Elise walks across the mowed lawn toward the patio below the deck, carrying two long raw reddish-tan cedar 2×6 boards (14 cm wide, 3.8 cm thick) on her right shoulder, steadying them with both hands. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH026-b.png`** (ảnh #4). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH026-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: she has reached the sawhorses on the patio and lowers the two boards from her shoulder, one end already resting on the first sawhorse. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH026-c.png`** (ảnh #5). Gửi kèm: `gl1-SH026-a.png`, `gl1-SH026-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: the two new boards lie across both sawhorses on top of the stack, and she slides them straight with both hands. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH026_01.mp4`**: First frame `gl1-SH026-a.png` · Last frame `gl1-SH026-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise carries the two long boards on her shoulder across the lawn to the patio and lowers one end onto the first sawhorse, as in the end frame. The boards stay two straight boards of the same length. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands (no gloves); natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH026_02.mp4`**: First frame `gl1-SH026-b.png` · Last frame `gl1-SH026-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She lowers the boards onto both sawhorses on top of the stack and slides them straight, as in the end frame. No extra boards appear. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands (no gloves); natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk, extra screws or boards appearing, frame changing size.
```

**Continuity:** Ngày 2, 08:30; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Ván cedar đỏ nâu 2×6, khung 1,2 × 2,4 m; Trạng thái S1_CLEARED→S1_CLEARED

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt và trang phục khớp tham chiếu
- [ ] Không vít/ván tự hiện; khung giữ hình
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH027 · SQ04 · 03:05.80–03:12.30

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH027**: Thước dây dọc ván, bút chì thợ mộc đánh dấu, ê-ke kẻ vạch vuông. |
| 2. Mục tiêu cảnh | Lời dẫn 'simple frames': đo và kẻ vạch. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png`, `gl1-P-PATIO-S1.png` |
| 6. Thời lượng mục tiêu | **6.5 s** trên timeline = SH027_01.mp4 dùng 6.5 s (Muse tạo 10 s) |
| 7. First / Last frame | SH027_01.mp4: đầu `gl1-SH027-a.png`, cuối `gl1-SH027-b.png` |
| 9. Output filename | `SH027_01.mp4` |
| Camera / ánh sáng | CLOSE (sân bê tông → bắc) · CU · Ngày 2 08:40 · S1_CLEARED→S1_CLEARED |
| Bố cục | CU mặt ván trên ngựa gỗ, nhìn về phía nhà. |
| Âm thanh (cho Codex) | Bút chì, thước bật. |

### 4. Image prompt

**`gl1-P-PATIO-S1.png`** (ảnh #1). Gửi kèm: `gl1-SH030-a.png`, `gl1-P-A-S1.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Medium-wide shot from the freshly mowed lawn looking north at the small concrete patio pad at the foot of the wooden deck steps, at the back of the grey lap-sided house of the SECOND reference (same siding, deck railing, sliding glass door and potted flowers on the deck). On the patio stand two wooden sawhorses; a neat stack of raw reddish-tan cedar 2×6 boards (14 cm wide, 3.8 cm thick), 2.4 m long, lies across them, matching the board and orange clamp of the FIRST reference. On the bottom deck step lie a plain dark-grey cordless drill with no brand, an orange quick clamp, a hand saw with a wooden handle, a steel try square, a flat carpenter pencil and a yellow tape measure, and a short length of square 5×5 cm post. Light: soft early-morning spring sun low in the east, long soft shadows, fresh cool tones. No person anywhere. Real photo, no text, no logos, no watermark.
```

**`gl1-SH027-a.png`** (ảnh #6). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-PATIO-S1.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Close-up on the top board lying across the sawhorses on the patio of the second reference, camera 1.0 m high, 50 mm, looking down about 35 degrees; the grey siding and deck steps soft behind. Light: soft morning sun from the east, long soft shadows. A yellow tape measure is hooked over the end of the board and stretched along it; Elise's bare right hand holds a flat carpenter pencil at a mark on the tape, her left hand holds the tape case. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH027-b.png`** (ảnh #7). Gửi kèm: `gl1-SH027-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera, framing, light and board. Only change: the tape is gone; a steel try square sits against the board edge at the pencil tick and the pencil has drawn one straight line across the full width of the board along the square. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH027_01.mp4`**: First frame `gl1-SH027-a.png` · Last frame `gl1-SH027-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise makes a small pencil tick at the tape mark, lets the tape retract, sets the steel square against the board edge at the tick and draws one straight pencil line across the board along the square, as in the end frame. The line appears only under the pencil tip. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk, extra screws or boards appearing, frame changing size.
```

**Continuity:** Ngày 2, 08:40; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Ván cedar đỏ nâu 2×6, khung 1,2 × 2,4 m; Trạng thái S1_CLEARED→S1_CLEARED

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt và trang phục khớp tham chiếu
- [ ] Không vít/ván tự hiện; khung giữ hình
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH028 · SQ04 · 03:12.30–03:25.30

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH028**: Cưa tay theo vạch, mùn cưa rơi, đầu thừa rơi xuống sỏi. |
| 2. Mục tiêu cảnh | Âm thanh cưa tay, mùn cưa thật. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **13 s** trên timeline = SH028_01.mp4 dùng 6.5 s (Muse tạo 10 s) + SH028_02.mp4 dùng 6.5 s (Muse tạo 10 s) |
| 7. First / Last frame | SH028_01.mp4: đầu `gl1-SH028-a.png`, cuối `gl1-SH028-b.png`<br>SH028_02.mp4: đầu `gl1-SH028-b.png`, cuối `gl1-SH028-c.png` |
| 9. Output filename | `SH028_01.mp4`, `SH028_02.mp4` |
| Camera / ánh sáng | CLOSE (sân bê tông → bắc) · MS · Ngày 2 08:50 · S1_CLEARED→S1_CLEARED |
| Bố cục | MS ngang hông tại ngựa gỗ, thấy mặt Elise 3/4. |
| Âm thanh (cho Codex) | Cưa tay nhịp đều, gỗ rơi. / Cưa tay nhịp đều, gỗ rơi. |

### 4. Image prompt

**`gl1-SH028-a.png`** (ảnh #8). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-PATIO-S1.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Medium shot at the sawhorses on the patio of the second reference, camera 1.2 m high, 35 mm, the deck steps and grey siding behind. Light: soft morning sun from the east, long soft shadows. Elise stands beside the sawhorses, her left hand pressing a cedar board down near a pencil line, her right hand holding a hand saw with its teeth at the start of the line; her face in three-quarter view. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH028-b.png`** (ảnh #9). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH028-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: the saw is halfway through the board along the line, a little pale sawdust on the board and the concrete. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH028-c.png`** (ảnh #10). Gửi kèm: `gl1-SH028-a.png`, `gl1-SH028-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: the cut is finished; her left hand holds the short offcut piece that just came free, the saw in her right hand. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH028_01.mp4`**: First frame `gl1-SH028-a.png` · Last frame `gl1-SH028-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise saws steadily along the pencil line with long even strokes; pale sawdust falls only where the saw cuts, as in the end frame. The board stays in place under her left hand. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands (no gloves); natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH028_02.mp4`**: First frame `gl1-SH028-b.png` · Last frame `gl1-SH028-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She finishes the cut with a few short strokes and catches the short offcut piece in her left hand as it comes free, as in the end frame. Only this one piece comes off. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands (no gloves); natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk, extra screws or boards appearing, frame changing size.
```

**Continuity:** Ngày 2, 08:50; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Ván cedar đỏ nâu 2×6, khung 1,2 × 2,4 m; Trạng thái S1_CLEARED→S1_CLEARED

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt và trang phục khớp tham chiếu
- [ ] Không vít/ván tự hiện; khung giữ hình
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH029 · SQ04 · 03:25.30–03:31.30

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH029**: Cưa cây gỗ vuông thành các cọc góc ngắn; xếp 4 cọc cạnh nhau. |
| 2. Mục tiêu cảnh | Chuẩn bị chi tiết: 4 cọc góc. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **6 s** trên timeline = SH029_01.mp4 dùng 6 s (Muse tạo 10 s) |
| 7. First / Last frame | SH029_01.mp4: đầu `gl1-SH029-a.png`, cuối không có |
| 9. Output filename | `SH029_01.mp4` |
| Camera / ánh sáng | CLOSE (sân bê tông → bắc) · CU · Ngày 2 09:10 · S1_CLEARED→S1_CLEARED |
| Bố cục | CU cây gỗ vuông trên ngựa gỗ, 3 cọc ngắn đã cắt nằm cạnh. |
| Âm thanh (cho Codex) | Cưa, gỗ chạm gỗ. |
| Dựng | Không dùng khung cuối (gl1-SH029-b lệch máy): clip chỉ có khung đầu. |

### 4. Image prompt

**`gl1-SH029-a.png`** (ảnh #11). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-PATIO-S1.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Close-up on a sawhorse on the patio of the second reference, camera 0.9 m high, 50 mm, looking down. Light: soft morning spring sun from the east-south-east. A length of square 5×5 cm cedar post lies across the sawhorse; three short pieces about 14 cm long, already cut, stand in a row on the sawhorse beside it. Elise's bare left hand holds the post, her right hand saws at a pencil line 14 cm from its end, the cut almost finished. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH029-b.png`** (ảnh #12). Gửi kèm: `gl1-SH029-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera, framing and light. Only change: the fourth short piece has come off and her right hand sets it down at the end of the row, so exactly four short pieces stand in a row. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH029_01.mp4`**: First frame `gl1-SH029-a.png` · Last frame không · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image. Only this one woman is ever in the scene; no other person appears. Elise saws through the last bit of the post; the fourth short piece comes free and she sets it down at the end of the row next to the other three. Exactly four short pieces; no other pieces appear. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk, extra screws or boards appearing, frame changing size.
```

**Continuity:** Ngày 2, 09:10; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Ván cedar đỏ nâu 2×6, khung 1,2 × 2,4 m; Trạng thái S1_CLEARED→S1_CLEARED

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt và trang phục khớp tham chiếu
- [ ] Không vít/ván tự hiện; khung giữ hình
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH031 · SQ04 · 03:41.30–03:50.80

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH031**: Dựng ván cạnh thứ hai, tì đầu gối giữ, bắt vít góc kế tiếp. |
| 2. Mục tiêu cảnh | Khung thành hình: ráp cạnh thứ hai. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **9.5 s** trên timeline = SH031_01.mp4 dùng 3.5 s (Muse tạo 10 s) + SH031_02.mp4 dùng 6 s (Muse tạo 10 s) |
| 7. First / Last frame | SH031_01.mp4: đầu `gl1-SH031-a.png`, cuối `gl1-SH031-b.png`<br>SH031_02.mp4: đầu `gl1-SH031-b.png`, cuối `gl1-SH031-c.png` |
| 9. Output filename | `SH031_01.mp4`, `SH031_02.mp4` |
| Camera / ánh sáng | CLOSE (sân bê tông) · MS · Ngày 2 10:00 · S1_CLEARED→S1_CLEARED |
| Bố cục | CU góc khung đặt đứng trên sân bê tông, đầu gối giữ ván. |
| Âm thanh (cho Codex) | Khoan, gỗ kẽo kẹt. / Khoan, gỗ kẽo kẹt. |

### 4. Image prompt

**`gl1-SH031-a.png`** (ảnh #13). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-PATIO-S1.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Close-up on the concrete patio of the second reference, camera 0.8 m high, 35 mm, looking down. Light: soft morning spring sun from the east-south-east. An L-shaped corner of the bed frame stands on its edge: one long raw reddish-tan cedar 2×6 board (14 cm wide, 3.8 cm thick) joined to a short one at a square corner post. Elise kneels; her bare left hand and her knee press the end of a second short board against the far corner post of the long board; her right hand holds the dark-grey drill with a screw on the bit at a pencil cross on the board. Only her hands, forearms, knee and part of her overalls are in frame. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH031-b.png`** (ảnh #14). Gửi kèm: `gl1-SH031-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera, framing and light. Only change: one screw is now driven flush at the pencil cross, and the drill tip rests on a second pencil cross just below it. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH031-c.png`** (ảnh #15). Gửi kèm: `gl1-SH031-a.png`, `gl1-SH031-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the second reference exactly — same camera, framing and light. Only change: the second screw is also driven flush; the drill is lifting away; the frame is now U-shaped. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH031_01.mp4`**: First frame `gl1-SH031-a.png` · Last frame `gl1-SH031-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Holding the board with her knee and left hand, Elise drives one screw straight into the board at the pencil cross until it sits flush, then moves the drill to the second cross, as in the end frame. Exactly one new screw appears, only where the drill drives it. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH031_02.mp4`**: First frame `gl1-SH031-b.png` · Last frame `gl1-SH031-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She drives the second screw straight in until flush and lifts the drill away, as in the end frame. Exactly two screws in this corner; the boards never move. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk, extra screws or boards appearing, frame changing size.
```

**Continuity:** Ngày 2, 10:00; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Ván cedar đỏ nâu 2×6, khung 1,2 × 2,4 m; Trạng thái S1_CLEARED→S1_CLEARED

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt và trang phục khớp tham chiếu
- [ ] Không vít/ván tự hiện; khung giữ hình
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH032 · SQ04 · 03:50.80–03:56.80

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH032**: Ê-ke thép áp vào góc: vuông; Elise gõ nhẹ chỉnh rồi siết thêm. |
| 2. Mục tiêu cảnh | Chính xác = đáng tin: kiểm góc vuông. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **6 s** trên timeline = SH032_01.mp4 dùng 6 s (Muse tạo 10 s) |
| 7. First / Last frame | SH032_01.mp4: đầu `gl1-SH032-a.png`, cuối `gl1-SH032-b.png` |
| 9. Output filename | `SH032_01.mp4` |
| Camera / ánh sáng | CLOSE (sân bê tông) · CU · Ngày 2 10:10 · S1_CLEARED→S1_CLEARED |
| Bố cục | CU góc trong của khung, ê-ke thép. |
| Âm thanh (cho Codex) | Kim loại chạm gỗ. |

### 4. Image prompt

**`gl1-SH032-a.png`** (ảnh #16). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-PATIO-S1.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Close-up on the inside corner of the cedar bed frame lying flat on the concrete patio of the second reference, camera 0.7 m high, 50 mm, looking down. Light: soft morning spring sun from the east-south-east. A steel framing square sits in the inside corner; a thin gap of about 5 mm shows between the square and the short board. Elise's bare left hand holds the square; her right hand holds a black rubber mallet above the outside of the short board. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH032-b.png`** (ảnh #17). Gửi kèm: `gl1-SH032-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera, framing and light. Only change: the gap is closed; the short board now sits flush against the square all along its edge; the mallet is lifted. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH032_01.mp4`**: First frame `gl1-SH032-a.png` · Last frame `gl1-SH032-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise taps the outside of the short board twice with the rubber mallet; the board shifts slightly until it sits flush against the steel square, as in the end frame. The frame keeps its size; nothing else moves. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk, extra screws or boards appearing, frame changing size.
```

**Continuity:** Ngày 2, 10:10; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Ván cedar đỏ nâu 2×6, khung 1,2 × 2,4 m; Trạng thái S1_CLEARED→S1_CLEARED

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt và trang phục khớp tham chiếu
- [ ] Không vít/ván tự hiện; khung giữ hình
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH033 · SQ04 · 03:56.80–04:09.80

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH033**: Khung 1 hoàn chỉnh nằm trên sân bê tông; Elise lật khung, kiểm tra mặt dưới. |
| 2. Mục tiêu cảnh | Xong khung 1. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **13 s** trên timeline = SH033_01.mp4 dùng 6.5 s (Muse tạo 10 s) + SH033_02.mp4 dùng 6.5 s (Muse tạo 10 s) |
| 7. First / Last frame | SH033_01.mp4: đầu `gl1-SH033-a.png`, cuối `gl1-SH033-b.png`<br>SH033_02.mp4: đầu `gl1-SH033-b.png`, cuối `gl1-SH033-c.png` |
| 9. Output filename | `SH033_01.mp4`, `SH033_02.mp4` |
| Camera / ánh sáng | CAM_B_PORCH · MS · Ngày 2 10:20 · S1_CLEARED→S1_CLEARED |
| Bố cục | MS từ deck nhìn xuống sân bê tông (ảnh nền B-S1W): khung 1 nằm trên cỏ cạnh sân. |
| Âm thanh (cho Codex) | Gỗ lật trên sân bê tông. / Gỗ lật trên sân bê tông. |

### 4. Image prompt

**`gl1-SH033-a.png`** (ảnh #18). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-B-S1W.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. Light: bright mid-morning spring sun from the south-east, soft shadows. On the lawn just beside the patio lies a new raised-bed frame made of raw reddish-tan cedar 2×6 boards: a rectangle 1.2 m wide and 2.4 m long and about 14 cm high, one board per side, small square posts inside the corners, finished. Elise stands at one long side, gripping its top edge with both hands, ready to tip it up. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH033-b.png`** (ảnh #19). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH033-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: she has tipped the frame up so it stands on its long edge, holding it upright with both hands. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH033-c.png`** (ảnh #20). Gửi kèm: `gl1-SH033-a.png`, `gl1-SH033-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: the frame lies flat again, flipped over, and she runs her right hand along the bottom edge of one board, checking it. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH033_01.mp4`**: First frame `gl1-SH033-a.png` · Last frame `gl1-SH033-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise lifts the long side of the finished frame and tips it up onto its edge, holding it steady, as in the end frame. The frame keeps exactly its rectangular shape and size. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands (no gloves); natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH033_02.mp4`**: First frame `gl1-SH033-b.png` · Last frame `gl1-SH033-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She lowers the frame down flat on its other face and runs her hand along the bottom edge of one board, as in the end frame. The frame keeps its shape; nothing else moves. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands (no gloves); natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk, extra screws or boards appearing, frame changing size.
```

**Continuity:** Ngày 2, 10:20; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Ván cedar đỏ nâu 2×6, khung 1,2 × 2,4 m; Trạng thái S1_CLEARED→S1_CLEARED

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt và trang phục khớp tham chiếu
- [ ] Không vít/ván tự hiện; khung giữ hình
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH034 · SQ04 · 04:09.80–04:20.30

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH034**: Một lúc sau: khung 1 dựng tựa tường; Elise bắt vít góc cuối khung 2. |
| 2. Mục tiêu cảnh | Nén thời gian: khung 2 xong, khung 1 tựa deck. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **10.5 s** trên timeline = SH034_01.mp4 dùng 6 s (Muse tạo 10 s) + SH034_02.mp4 dùng 4.5 s (Muse tạo 10 s) |
| 7. First / Last frame | SH034_01.mp4: đầu `gl1-SH034-a.png`, cuối `gl1-SH034-b.png`<br>SH034_02.mp4: đầu `gl1-SH034-b.png`, cuối `gl1-SH034-c.png` |
| 9. Output filename | `SH034_01.mp4`, `SH034_02.mp4` |
| Camera / ánh sáng | CLOSE (sân bê tông → bắc) · MS · Ngày 2 10:50 · S1_CLEARED→S1_CLEARED |
| Bố cục | MS ngang tầm sân bê tông (khác góc deck của SH033 để tránh cắt nhảy). |
| Âm thanh (cho Codex) | Khoan. / Khoan. |

### 4. Image prompt

**`gl1-SH034-a.png`** (ảnh #21). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-PATIO-S1.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Medium shot from the lawn at the patio of the second reference, camera 1.1 m high, 35 mm. Light: bright mid-morning spring sun from the south-east, soft shadows. Later the same morning: the first finished cedar frame leans upright against the deck. On the patio lies the second frame, three corners done. Elise kneels at its last corner, the drill in her right hand at the corner post, her left hand holding the boards together. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH034-b.png`** (ảnh #22). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH034-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: the last corner is screwed; she sets the drill down on the deck step. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH034-c.png`** (ảnh #23). Gửi kèm: `gl1-SH034-a.png`, `gl1-SH034-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: she stands and lifts one end of the second frame a little off the concrete with both hands to check that it is rigid; the frame stays perfectly square. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, bare hands (no gloves). Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH034_01.mp4`**: First frame `gl1-SH034-a.png` · Last frame `gl1-SH034-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise drives two screws into the last corner, one at a time, then sets the drill down on the deck step, as in the end frame. Screws appear only where the drill drives them; the leaning frame does not move. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands (no gloves); natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH034_02.mp4`**: First frame `gl1-SH034-b.png` · Last frame `gl1-SH034-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She stands and lifts one end of the second frame slightly off the concrete with both hands; the frame stays rigid and square, as in the end frame. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, bare hands (no gloves); natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk, extra screws or boards appearing, frame changing size.
```

**Continuity:** Ngày 2, 10:50; Găng: tay trần; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Ván cedar đỏ nâu 2×6, khung 1,2 × 2,4 m; Trạng thái S1_CLEARED→S1_CLEARED

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt và trang phục khớp tham chiếu
- [ ] Không vít/ván tự hiện; khung giữ hình
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH035 · SQ04 · 04:20.30–04:30.80

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH035**: Elise dựng đứng khung 1 trên cạnh, 'đi bộ' khung qua lối về chỗ BED-01. |
| 2. Mục tiêu cảnh | Một người làm được: mang khung ra vườn. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S1.png` |
| 6. Thời lượng mục tiêu | **10.5 s** trên timeline = SH035_01.mp4 dùng 5.75 s (Muse tạo 10 s) + SH035_02.mp4 dùng 4.75 s (Muse tạo 10 s) |
| 7. First / Last frame | SH035_01.mp4: đầu `gl1-SH035-a.png`, cuối `gl1-SH035-b.png`<br>SH035_02.mp4: đầu `gl1-SH035-b.png`, cuối `gl1-SH035-c.png` |
| 9. Output filename | `SH035_01.mp4`, `SH035_02.mp4` |
| Camera / ánh sáng | CAM_D_GARDEN_SIDE · MWS · Ngày 2 11:00 · S1_CLEARED→S1_CLEARED |
| Bố cục | MWS khung CAM_D (ảnh nền D-S1): Elise dựng khung trên cạnh, đi qua bãi cỏ. |
| Âm thanh (cho Codex) | Gỗ cọ đất, bước chân. / Gỗ cọ đất, bước chân. |

### 4. Image prompt

**`gl1-P-D-S1.png`** (ảnh #24). Gửi kèm: `gl1-P-D-S0.png`, `gl1-P-A-S1.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate exactly the camera position, lens, framing, house, deck, shed, compost bin, apple tree and fences of the FIRST reference image. Only change: the yard is now in the state of the SECOND reference — lawn mowed short, the vegetable area bare raked dark soil with two rectangles marked by bamboo canes and taut white string; the compost bin heaped with pulled green weeds; no overgrown grass, no pots, no wire. Light: bright late-morning spring sun from the south-east, short soft shadows, a few white clouds. No person anywhere. Real photo, no text, no logos, no watermark.
```

**`gl1-SH035-a.png`** (ảnh #25). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S1.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. Light: bright late-morning spring sun from the south-east, short soft shadows, a few white clouds. Elise walks across the mowed lawn in the middle ground carrying the first cedar frame on its long edge beside her: she holds the top board with both gloved hands, the bottom board sliding over the grass. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH035-b.png`** (ảnh #26). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH035-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: she has moved closer to the string rectangle of the left bed in the vegetable area, still carrying the frame on its edge. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH035-c.png`** (ảnh #27). Gửi kèm: `gl1-SH035-a.png`, `gl1-SH035-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: she stops at the edge of the string rectangle, the frame still upright on its edge beside her. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH035_01.mp4`**: First frame `gl1-SH035-a.png` · Last frame `gl1-SH035-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise walks steadily across the lawn toward the vegetable area, carrying the frame on its long edge, the bottom board sliding over the grass, as in the end frame. The frame keeps its shape and size. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan brown leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH035_02.mp4`**: First frame `gl1-SH035-b.png` · Last frame `gl1-SH035-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She carries the frame the last few steps to the edge of the string rectangle and stops with it upright beside her, as in the end frame. The strings and canes do not move. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan brown leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk, extra screws or boards appearing, frame changing size.
```

**Continuity:** Ngày 2, 11:00; Găng: da nâu; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Ván cedar đỏ nâu 2×6, khung 1,2 × 2,4 m; Trạng thái S1_CLEARED→S1_CLEARED

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt và trang phục khớp tham chiếu
- [ ] Không vít/ván tự hiện; khung giữ hình
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH036 · SQ05 · 04:30.80–04:44.10

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH036**: Hạ khung 1 vào trong dây đánh dấu BED-01. |
| 2. Mục tiêu cảnh | Khung vào vị trí. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **13.3 s** trên timeline = SH036_01.mp4 dùng 7.3 s (Muse tạo 10 s) + SH036_02.mp4 dùng 6 s (Muse tạo 10 s) |
| 7. First / Last frame | SH036_01.mp4: đầu `gl1-SH036-a.png`, cuối `gl1-SH036-b.png`<br>SH036_02.mp4: đầu `gl1-SH036-b.png`, cuối `gl1-SH036-c.png` |
| 9. Output filename | `SH036_01.mp4`, `SH036_02.mp4` |
| Camera / ánh sáng | CAM_D_GARDEN_SIDE · WS · Ngày 2 11:05 · S1_CLEARED→S1_CLEARED |
| Bố cục | WS khung CAM_D (ảnh nền D-S1). |
| Âm thanh (cho Codex) | Gỗ chạm đất. / Gỗ chạm đất. |

### 4. Image prompt

**`gl1-SH036-a.png`** (ảnh #28). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S1.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. Light: bright late-morning spring sun from the south-east, short soft shadows, a few white clouds. Elise stands at the near long side of the left (BED-01) string rectangle, holding the first cedar frame upright on its long edge, beginning to lower it toward the soil inside the strings. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH036-b.png`** (ảnh #29). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH036-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: the frame lies flat on the soil inside the BED-01 strings, slightly crooked; she crouches at one corner with both gloved hands on it. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. The frame is exactly the size of the string rectangle: its four outside corners touch the four bamboo canes; it is 2.4 m long and 1.2 m wide — twice as long as it is wide and clearly longer than Elise is tall — the same size as the frames in the vegetable area of the other scenes. Real photo, no text, no logos, no watermark.
```

**`gl1-SH036-c.png`** (ảnh #30). Gửi kèm: `gl1-SH036-a.png`, `gl1-SH036-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: she has nudged the frame so its corners line up exactly with the four canes, and rests her hands on its edge. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. The frame is exactly the size of the string rectangle: its four outside corners touch the four bamboo canes; it is 2.4 m long and 1.2 m wide — twice as long as it is wide and clearly longer than Elise is tall — the same size as the frames in the vegetable area of the other scenes. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH036_01.mp4`**: First frame `gl1-SH036-a.png` · Last frame `gl1-SH036-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise lowers the frame from its edge down flat onto the soil inside the strings and crouches at a corner, as in the end frame. The frame keeps exactly its shape and size. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan brown leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH036_02.mp4`**: First frame `gl1-SH036-b.png` · Last frame `gl1-SH036-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She nudges the corner of the frame twice until all four corners line up with the canes, as in the end frame. The canes and strings stay in place. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan brown leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk, extra screws or boards appearing, frame changing size.
```

**Continuity:** Ngày 2, 11:05; Găng: da nâu; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Ván cedar đỏ nâu 2×6, khung 1,2 × 2,4 m; Trạng thái S1_CLEARED→S1_CLEARED

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt và trang phục khớp tham chiếu
- [ ] Không vít/ván tự hiện; khung giữ hình
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH037 · SQ05 · 04:44.10–04:54.40

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH037**: Thước thủy trên mép khung: bọt lệch; Elise nhấc một đầu. |
| 2. Mục tiêu cảnh | Vấn đề nhỏ cần sửa: thước thủy báo lệch. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **10.3 s** trên timeline = SH037_01.mp4 dùng 6.1 s (Muse tạo 10 s) + SH037_02.mp4 dùng 4.2 s (Muse tạo 10 s) |
| 7. First / Last frame | SH037_01.mp4: đầu `gl1-SH037-a.png`, cuối `gl1-SH037-b.png`<br>SH037_02.mp4: đầu `gl1-SH037-b.png`, cuối `gl1-SH037-c.png` |
| 9. Output filename | `SH037_01.mp4`, `SH037_02.mp4` |
| Camera / ánh sáng | CLOSE (D→E) · CU · Ngày 2 11:10 · S1_CLEARED→S1_CLEARED |
| Bố cục | CU ngang mép khung từ bên hông: chỉ ván, thước thủy, tay găng da nâu; người/chân ngoài khung. |
| Âm thanh (cho Codex) | Gỗ, thở nhẹ. / Gỗ, thở nhẹ. |

### 4. Image prompt

**`gl1-SH037-a.png`** (ảnh #31). Gửi kèm: `gl1-P-D-S1.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Side close-up at the height of the frame edge, camera 0.4 m high, 50 mm, looking from the side at the long raw reddish-tan cedar 2×6 board of the raised-bed frame lying in the bare soil of the vegetable area of the second reference, so the board runs LEFT-TO-RIGHT across the whole frame; the mowed lawn and fence soft behind. ONLY the board, a yellow aluminium spirit level and two hands in TAN BROWN LEATHER gardening gloves are in the frame — her body, knees and legs are completely out of frame above the top edge. Light: bright late-morning spring sun from the south-east, short soft shadows, a few white clouds. The gloved hands hold the yellow level horizontally just above the top edge of the board and PARALLEL to it (lengthwise along the board, never across it), about to set it down. Real photo, no text, no logos, no watermark.
```

**`gl1-SH037-b.png`** (ảnh #32). Gửi kèm: `gl1-SH037-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera, framing, light, board and gloves; the board still runs left-to-right and the level lies lengthwise along its top edge; still no body or legs in frame. Only change: the level rests on the board and its bubble sits clearly off-centre toward one end; the gloved fingers rest lightly on the level. Real photo, no text, no logos, no watermark.
```

**`gl1-SH037-c.png`** (ảnh #33). Gửi kèm: `gl1-SH037-a.png`, `gl1-SH037-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the second reference exactly — same camera, framing, light, board and gloves; the board still runs left-to-right and the level lies lengthwise along its top edge; still no body or legs in frame. Only change: the gloved hands slide the level along the board toward the corner post; the bubble is still off-centre toward the same end. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH037_01.mp4`**: First frame `gl1-SH037-a.png` · Last frame `gl1-SH037-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise sets the yellow level down on the long side of the frame; the bubble settles off-centre toward one end, as in the end frame. The frame does not move. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH037_02.mp4`**: First frame `gl1-SH037-b.png` · Last frame `gl1-SH037-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She slides the level along the board toward the corner post; the bubble stays off-centre, as in the end frame. Only the level moves. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk, extra screws or boards appearing, frame changing size.
```

**Continuity:** Ngày 2, 11:10; Găng: da nâu; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Ván cedar đỏ nâu 2×6, khung 1,2 × 2,4 m; Trạng thái S1_CLEARED→S1_CLEARED

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt và trang phục khớp tham chiếu
- [ ] Không vít/ván tự hiện; khung giữ hình
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH038 · SQ05 · 04:54.40–05:08.40

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH038**: Xẻng gạt bớt đất dưới góc cao, đặt lại; thước thủy: bọt ở giữa. |
| 2. Mục tiêu cảnh | Sửa xong — thỏa mãn: bọt về giữa. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **14 s** trên timeline = SH038_01.mp4 dùng 7 s (Muse tạo 10 s) + SH038_02.mp4 dùng 7 s (Muse tạo 10 s) |
| 7. First / Last frame | SH038_01.mp4: đầu `gl1-SH038-a.png`, cuối `gl1-SH038-b.png`<br>SH038_02.mp4: đầu `gl1-SH038-b.png`, cuối `gl1-SH038-c.png` |
| 9. Output filename | `SH038_01.mp4`, `SH038_02.mp4` |
| Camera / ánh sáng | CLOSE (D→E) · MS · Ngày 2 11:15 · S1_CLEARED→S1_CLEARED |
| Bố cục | MS góc khung: nhấc góc cao, gạt đất, đặt lại. |
| Âm thanh (cho Codex) | Xẻng, đất. / Xẻng, đất. |

### 4. Image prompt

**`gl1-SH038-a.png`** (ảnh #34). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-D-S1.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Medium shot at one corner of the cedar frame lying in the bare soil of the vegetable area of the second reference, camera 1.0 m high, 35 mm. Light: bright late-morning spring sun from the south-east, short soft shadows, a few white clouds. Elise kneels at the high corner, seen from the side in profile with her knees turned away from the camera; her left gloved hand lifts that corner of the frame a few centimetres; her right gloved hand scrapes soil out from under it with a hand trowel. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH038-b.png`** (ảnh #35). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH038-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: the corner is lowered back onto the scraped soil; she picks up the yellow spirit level from the soil. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH038-c.png`** (ảnh #36). Gửi kèm: `gl1-SH038-a.png`, `gl1-SH038-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: the yellow level rests on the frame edge at the corner and its bubble sits exactly in the centre; she looks at it with a small satisfied smile. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH038_01.mp4`**: First frame `gl1-SH038-a.png` · Last frame `gl1-SH038-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise scrapes soil out from under the lifted corner with the trowel, lowers the corner back down and picks up the level, as in the end frame. Soil moves only under the trowel; the frame keeps its shape. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan brown leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH038_02.mp4`**: First frame `gl1-SH038-b.png` · Last frame `gl1-SH038-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She sets the level on the frame edge; the bubble settles exactly in the centre, as in the end frame. The frame does not move. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan brown leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk, extra screws or boards appearing, frame changing size.
```

**Continuity:** Ngày 2, 11:15; Găng: da nâu; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Ván cedar đỏ nâu 2×6, khung 1,2 × 2,4 m; Trạng thái S1_CLEARED→S1_CLEARED

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt và trang phục khớp tham chiếu
- [ ] Không vít/ván tự hiện; khung giữ hình
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH039 · SQ05 · 05:08.40–05:20.60

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH039**: Đặt khung 2 vào dấu BED-02, đo khoảng cách hai khung để song song. |
| 2. Mục tiêu cảnh | Hai luống thẳng hàng. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **12.2 s** trên timeline = SH039_01.mp4 dùng 6 s (Muse tạo 10 s) + SH039_02.mp4 dùng 6.2 s (Muse tạo 10 s) |
| 7. First / Last frame | SH039_01.mp4: đầu `gl1-SH039-a.png`, cuối `gl1-SH039-b.png`<br>SH039_02.mp4: đầu `gl1-SH039-b.png`, cuối `gl1-SH039-c.png` |
| 9. Output filename | `SH039_01.mp4`, `SH039_02.mp4` |
| Camera / ánh sáng | CAM_C_EAST_FENCE · MS · Ngày 2 11:25 · S1_CLEARED→S1_CLEARED |
| Bố cục | MS khung CAM_C (ảnh nền C-S1): khung 1 đã nằm ở BED-01 phía sau. |
| Âm thanh (cho Codex) | Thước dây, gỗ. / Thước dây, gỗ. |

### 4. Image prompt

**`gl1-SH039-a.png`** (ảnh #37). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S1.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. Light: bright late-morning spring sun from the south-east, short soft shadows, a few white clouds. Difference from the second reference: the first cedar frame already lies inside the far (BED-01) string rectangle. Elise lowers the second cedar frame from its long edge down onto the soil inside the near (BED-02) string rectangle. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH039-b.png`** (ảnh #38). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH039-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: the second frame lies flat inside the near strings; Elise stretches a yellow tape measure across the path between the near corners of the two frames. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH039-c.png`** (ảnh #39). Gửi kèm: `gl1-SH039-a.png`, `gl1-SH039-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: she has nudged the second frame so the two frames are exactly parallel, and is rolling up the tape. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH039_01.mp4`**: First frame `gl1-SH039-a.png` · Last frame `gl1-SH039-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise lowers the second frame flat into the near string rectangle, then stretches the tape measure across the path to the first frame, as in the end frame. Both frames keep exactly their shape and size. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan brown leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH039_02.mp4`**: First frame `gl1-SH039-b.png` · Last frame `gl1-SH039-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She nudges the second frame until the two frames are exactly parallel, then lets the tape roll back into its case, as in the end frame. The first frame never moves. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan brown leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk, extra screws or boards appearing, frame changing size.
```

**Continuity:** Ngày 2, 11:25; Găng: da nâu; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Ván cedar đỏ nâu 2×6, khung 1,2 × 2,4 m; Trạng thái S1_CLEARED→S1_CLEARED

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt và trang phục khớp tham chiếu
- [ ] Không vít/ván tự hiện; khung giữ hình
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH041 · SQ05 · 05:28.60–05:40.60

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH041**: Từ deck: Elise ôm bó cọc đi giữa hai khung về nhà kho; toàn cảnh khu vườn mới. |
| 2. Mục tiêu cảnh | Lời dẫn 'imagine': toàn cảnh khu vườn mới. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png`, `gl1-P-B-S2.png` |
| 6. Thời lượng mục tiêu | **12 s** trên timeline = SH041_01.mp4 dùng 6 s (Muse tạo 10 s) + SH041_02.mp4 dùng 6 s (Muse tạo 10 s) |
| 7. First / Last frame | SH041_01.mp4: đầu `gl1-SH041-a.png`, cuối `gl1-SH041-b.png`<br>SH041_02.mp4: đầu `gl1-SH041-b.png`, cuối `gl1-SH041-c.png` |
| 9. Output filename | `SH041_01.mp4`, `SH041_02.mp4` |
| Camera / ánh sáng | CAM_B_PORCH · WS · Ngày 2 11:40 · S2_FRAMES→S2_FRAMES |
| Bố cục | WS từ deck (ảnh nền B-S2): Elise mang bó cọc đi giữa hai khung về phía nhà kho. |
| Âm thanh (cho Codex) | Bước chân, chim. / Bước chân, chim. |

### 4. Image prompt

**`gl1-P-B-S2.png`** (ảnh #40). Gửi kèm: `gl1-P-B-S1W.png`, `gl1-P-A-S2.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate exactly the camera position, lens, framing, deck railing, house, fences, gate, shed and apple tree of the FIRST reference image. Only changes: in the vegetable area the canes and strings are gone and two identical new cedar raised-bed frames (1.2 m × 2.4 m, about 14 cm high) sit exactly where the rectangles were, parallel, with loosened native soil inside, as in the SECOND reference; on the patio the sawhorses stand empty with a few cedar offcuts on the concrete. Light: bright soft spring sun high in the south, short shadows, a few white clouds. No person anywhere. Real photo, no text, no logos, no watermark.
```

**`gl1-SH041-a.png`** (ảnh #41). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-B-S2.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. Light: bright soft spring sun high in the south, short shadows, a few white clouds. Elise stands on the path between the two new cedar frames, a bundle of bamboo canes and a coil of white string under her right arm. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH041-b.png`** (ảnh #42). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH041-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: she walks across the lawn toward the grey shed at the right edge of the frame, the canes under her arm. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH041-c.png`** (ảnh #43). Gửi kèm: `gl1-SH041-a.png`, `gl1-SH041-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: she has reached the shed and leans the canes against its wall. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH041_01.mp4`**: First frame `gl1-SH041-a.png` · Last frame `gl1-SH041-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise walks from between the two frames across the lawn toward the shed, carrying the canes under her arm, as in the end frame. The two frames never move. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan brown leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH041_02.mp4`**: First frame `gl1-SH041-b.png` · Last frame `gl1-SH041-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She reaches the shed and leans the bundle of canes against its wall, as in the end frame. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan brown leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk, extra screws or boards appearing, frame changing size.
```

**Continuity:** Ngày 2, 11:40; Găng: da nâu; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Ván cedar đỏ nâu 2×6, khung 1,2 × 2,4 m; Trạng thái S2_FRAMES→S2_FRAMES

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt và trang phục khớp tham chiếu
- [ ] Không vít/ván tự hiện; khung giữ hình
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH042 · SQ05 · 05:40.60–05:42

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH042**: Ủng nén đất lấp khe dưới mép khung. |
| 2. Mục tiêu cảnh | Chi tiết hoàn thiện: lấp khe dưới mép khung. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png` |
| 6. Thời lượng mục tiêu | **1.4 s** trên timeline = SH042_01.mp4 dùng 1.4 s (Muse tạo 10 s) |
| 7. First / Last frame | SH042_01.mp4: đầu `gl1-SH042-a.png`, cuối `gl1-SH042-b.png` |
| 9. Output filename | `SH042_01.mp4` |
| Camera / ánh sáng | CLOSE (C→W) · CU · Ngày 2 11:50 · S2_FRAMES→S2_FRAMES |
| Bố cục | CU sát đất ở mép khung. |
| Âm thanh (cho Codex) | Đất nén. |

### 4. Image prompt

**`gl1-SH042-a.png`** (ảnh #45). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S2.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Close-up at ground level along the outside of a cedar frame in the vegetable area of the second reference, camera 0.5 m high, 50 mm. Light: bright soft spring sun high in the south, short shadows, a few white clouds. A thin gap of a few centimetres shows under the bottom edge of the board; a little loose soil lies beside it; Elise's white sneaker stands next to it. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

**`gl1-SH042-b.png`** (ảnh #46). Gửi kèm: `gl1-SH042-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate the reference image exactly — same camera, framing and light. Only change: the loose soil has been pushed into the gap and pressed down by the white sneaker; the gap is closed. Natural realistic skin texture with fine pores, no freckles. Modest, wholesome family-friendly look. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH042_01.mp4`**: First frame `gl1-SH042-a.png` · Last frame `gl1-SH042-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise's white sneaker pushes the loose soil into the gap under the board and presses it down firmly twice, as in the end frame. Only this soil moves; the frame does not move. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. Only her hands and bare forearms are in the shot, exactly as in the start frame; natural skin, no freckles. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk, extra screws or boards appearing, frame changing size.
```

**Continuity:** Ngày 2, 11:50; Găng: da nâu; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Ván cedar đỏ nâu 2×6, khung 1,2 × 2,4 m; Trạng thái S2_FRAMES→S2_FRAMES

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt và trang phục khớp tham chiếu
- [ ] Không vít/ván tự hiện; khung giữ hình
- [ ] Mỗi clip ≥ 5 s dùng được

---

## SH043 · SQ05 · 05:42–05:55

| Mục | Nội dung |
|---|---|
| 1. Shot ID | **SH043**: Cào san phẳng lối đi giữa hai luống. |
| 2. Mục tiêu cảnh | Gọn gàng: lối đi giữa hai luống phẳng. |
| 3. Reference asset | `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S2.png` |
| 6. Thời lượng mục tiêu | **13 s** trên timeline = SH043_01.mp4 dùng 7 s (Muse tạo 10 s) + SH043_02.mp4 dùng 6 s (Muse tạo 10 s) |
| 7. First / Last frame | SH043_01.mp4: đầu `gl1-SH043-a.png`, cuối `gl1-SH043-b.png`<br>SH043_02.mp4: đầu `gl1-SH043-b.png`, cuối `gl1-SH043-c.png` |
| 9. Output filename | `SH043_01.mp4`, `SH043_02.mp4` |
| Camera / ánh sáng | CAM_C_EAST_FENCE · MS · Ngày 2 12:00 · S2_FRAMES→S2_FRAMES |
| Bố cục | MS khung CAM_C (ảnh nền C-S2). |
| Âm thanh (cho Codex) | Cào. / Cào. |

### 4. Image prompt

**`gl1-P-C-S2.png`** (ảnh #44). Gửi kèm: `gl1-P-C-S3.png`, `gl1-P-A-S2.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Recreate exactly the camera position, lens, framing, house, deck, shed, apple tree, fences and the two cedar frames of the FIRST reference image. Only changes, as in the SECOND reference: inside both frames there is only lighter brown loosened native soil, uneven and lumpy, about 8 cm below the rim — no dark compost; no wheelbarrow. Light: bright soft spring sun high in the south, short shadows, a few white clouds. No person anywhere. Real photo, no text, no logos, no watermark.
```

**`gl1-SH043-a.png`** (ảnh #47). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-P-C-S2.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. Light: soft midday spring sun, short shadows. Elise stands at the far end of the 1.2 m path between the two frames, raking the bumpy soil of the path toward herself with a long-handled metal rake. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH043-b.png`** (ảnh #48). Gửi kèm: `gl1-A-elise-garden-truoc.png`, `gl1-SH043-a.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: the near half of the path is raked smooth; she rakes the last bumps. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

**`gl1-SH043-c.png`** (ảnh #49). Gửi kèm: `gl1-SH043-a.png`, `gl1-SH043-b.png`

```text
Photorealistic horizontal 16:9 photograph, real cinematic cozy gardening documentary look, natural colours, no fantasy effects. Keep exactly the camera position, distance and framing of the SECOND reference: the house, deck, fence and the woman keep exactly the same size and position in the frame. A few seconds later: the whole path is smooth and level; she lifts the rake and rests it upright. Elise: the same adult woman as the identity reference — about 25, light brown hair in a neat low bun with a few loose face-framing strands, warm natural look. Natural realistic skin texture with fine pores, no freckles, no airbrushing. Garden outfit: lightweight cotton short bib overalls in a green-olive, dark-brown and muted-tan woodland camouflage pattern (two shoulder straps with small metal buckles, a front bib pocket, rolled hems at upper-to-mid thigh) over a fitted vivid warm orange sleeveless V-neck tank top, short white ankle socks and plain white low-top sneakers, tan brown leather gardening gloves. Small gold hoop earrings and a fine gold pendant necklace only. No hat, no jacket, no backpack. Modest, wholesome family-friendly look. She never bends over toward the camera. Only this one woman is in the scene. Real photo, no text, no logos, no watermark.
```

### 5. Muse AI video prompt

**`SH043_01.mp4`**: First frame `gl1-SH043-a.png` · Last frame `gl1-SH043-b.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. Elise rakes the path between the frames in long even strokes; bumps flatten only where the rake passes, as in the end frame. The frames never move. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan brown leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

**`SH043_02.mp4`**: First frame `gl1-SH043-b.png` · Last frame `gl1-SH043-c.png` · Reference `gl1-A-elise-garden-truoc.png` · 10 s

```text
Real live-action footage, horizontal 16:9, photorealistic, not animated, no text, no logos, natural real-time speed. One continuous fixed shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image and end exactly like the end-frame image. Only this one woman is ever in the scene; no other person appears. She rakes the last bumps smooth, then lifts the rake upright, as in the end frame. The yard, fence, house, deck, boards and light stay exactly the same; nothing appears, vanishes or changes by itself. She works at a natural, steady pace and never stands idle or sways. The woman is Elise, exactly as in the start frame and the reference image: about 25, light brown hair in a neat low bun with a few loose strands, small gold hoop earrings, camouflage short bib overalls over a fitted orange sleeveless V-neck tank top, short white ankle socks and white low-top sneakers, tan brown leather gardening gloves; natural skin with fine pores, no freckles. Her face stays the same in every frame. Every object that moves is carried or placed by her own hands, one at a time. Duration: 10 seconds.
```

### 8. Negative constraints

Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:

```text
Avoid: second person, freckles, plastic airbrushed skin, jacket/hat/backpack, generated text or logos, garden mirrored or flipped, house/fence/deck colour change, camera zoom or pan, slow motion, fantasy glow, tools changing shape, objects appearing in bulk, extra screws or boards appearing, frame changing size.
```

**Continuity:** Ngày 2, 12:00; Găng: da nâu; Yếm short rằn ri + áo ba lỗ cam, giày trắng; Ván cedar đỏ nâu 2×6, khung 1,2 × 2,4 m; Trạng thái S2_FRAMES→S2_FRAMES

**Đạt khi:**
- [ ] Máy giữ khung
- [ ] Mặt và trang phục khớp tham chiếu
- [ ] Không vít/ván tự hiện; khung giữ hình
- [ ] Mỗi clip ≥ 5 s dùng được

