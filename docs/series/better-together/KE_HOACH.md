# Better Together: kế hoạch làm (clone ý tưởng video "Mrs Stickgirl")

Mục tiêu: video 12.5s, 9:16 (1080x1920, 30fps), 4 nhịp leo núi + thẻ kết hoàng hôn có chữ. Làm thử theo hướng layer + Remotion trước; đoạn nào nhìn cứng thì thay bằng clip image-to-video (làm ở máy nhà, RTX 3060 Ti, LTX-Video hoặc Wan 2.2 5B trong ComfyUI).

## Trạng thái
- Xong: prompt ảnh (`content/better-together/assets.csv`), script tách nền (`scripts/bt_export.py`), composition `BetterTogether` (`demo-project/src/better-together/Video.tsx`).
- Chưa có: ảnh nào. Chưa render lần nào.

## Bảng nhịp

| Giây | Nhịp | Cách làm ở bản Remotion | Có nên thay bằng image-to-video? |
|---|---|---|---|
| 0-2 | Anh leo phần thấp, cô nhìn xuống | Sprite boy_climb trượt + nhún, dây SVG | Có (ưu tiên 1): cử động tay chân khi leo |
| 2-4 | Leo giữa, mặt gắng sức | Như trên | Gộp chung clip leo 0-6s |
| 4-6 | Gần tới đỉnh | Như trên, camera trôi xuống | Gộp chung |
| 6-7.5 | Cô kéo tay anh | Đổi sang girl_pull + boy_reach | Có (ưu tiên 2): khoảnh khắc nắm tay kéo lên |
| 7.5-12.5 | Hoàng hôn, chữ, tim | Remotion thuần (fade, glow, tim, zoom chậm) | Không cần |

Chỉ 2 clip i2v là đáng làm; thẻ kết giữ Remotion.

## Quy trình

### Bước 1: ảnh (ChatGPT Plus, ở đâu cũng làm được)
1. BT1 (nền vách núi) trước, duyệt phong cách. Sau đó BT6 (nền hoàng hôn).
2. Sprite BT2-BT5, BT7 trên nền xanh #00FF00, đính kèm BT1 làm tham chiếu phong cách.
3. Lưu BT1, BT6 vào `content/better-together/`, sprite vào `content/better-together/sprites/`.
4. `python scripts/bt_export.py`.

### Bước 2: bản Remotion (làm được trên máy này)
1. `cd demo-project && npx remotion studio`, mở `BetterTogether`.
2. Chỉnh `LAYOUT` đầu Video.tsx: vị trí cô gái, đường đi của anh, vị trí bàn tay (hand là tỉ lệ trong ảnh sprite), mốc `pullAt`, `endAt`.
3. Xem lại: dây có dính tay hai người không, anh có "bay" khỏi vách không, tỉ lệ người so với vách.
4. Render thử: `npx remotion render BetterTogether ../renders/better-together.mp4 --port=3483`.
Nếu bản này chấp nhận được thì dừng ở đây, bỏ qua bước 3.

### Bước 3: clip image-to-video (máy nhà, làm sau)
Khung đầu = ảnh ghép hoàn chỉnh chụp từ Remotion (nền + cô gái + anh, KHÔNG có dây SVG nếu clip tự vẽ dây; hoặc có dây và nhắc giữ nguyên). Xuất khung bằng `npx remotion still BetterTogether ../content/better-together/i2v/start_climb.png --frame=0` và `--frame=<khung kéo tay>`.

Clip A: leo (4-5s, cắt xuống còn 6s tổng sau khi ghép/chậm)
- Ảnh vào: khung 0 của Remotion.
- Prompt: `A young man in a blue shirt and backpack climbs up a steep rocky cliff using a rope, alternating hands and feet, small effortful movements. The young woman at the top watches and leans down. Camera static. Flat 2D cartoon style, no change of style, characters keep their look.`
- Negative: `camera shake, morphing, extra limbs, text changes, style change`.

Clip B: kéo tay (2-3s)
- Ảnh vào: khung ngay trước `pullAt`.
- Prompt: `The young woman at the top reaches down, grabs the young man's hand and pulls him up onto the ledge, both smiling. Camera static. Flat 2D cartoon style.`

Lưu thành `demo-project/public/better-together/clips/climb.mp4` và `pull.mp4`. Cắm vào Video.tsx bằng `<OffthreadVideo>` thay cho `<Climb>` tương ứng (cùng kiểu "móc" của `cook-ep01`, xem `scripts/cook_clips.py`). Chữ cuối cảnh trên vách ("work/dream/success") dễ bị i2v làm biến dạng: nếu bị, chèn chữ bằng Remotion thay vì để AI vẽ lại.

Gợi ý thông số (chưa kiểm chứng trên máy này, chỉnh lại khi chạy): LTX-Video 768x512 hoặc ngang 9:16 nhỏ rồi upscale; Wan 2.2 5B ~ 704x1280, 81 khung. Nên làm 3-4 seed mỗi clip rồi chọn.

### Bước 4: âm thanh
Nhạc nền êm (piano/guitar nhẹ), 1 tiếng gió nhẹ, tiếng "ting" nhỏ khi trái tim hiện. Video mẫu gần như không có lời.

## Rủi ro đã biết (từ camp-demo)
- ChatGPT sửa cả khung lớn hay làm sai tỉ lệ: sprite luôn kiểm tra kích thước sau khi xuất, đừng tin kích thước ảnh gốc.
- Nền xanh có thể làm mất phần cần giữ (ví dụ dây): dây vẽ bằng SVG trong code nên không phụ thuộc ảnh.
- Sprite leo 1 tư thế sẽ cứng: đó là lý do ưu tiên clip A.
