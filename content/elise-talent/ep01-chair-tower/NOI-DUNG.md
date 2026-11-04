# Elise Talent tập 01: tháp ghế (bản nháp, chờ duyệt)

Video mẫu: `goc.mp4` (reel FSave "One-handed balance at insane height", 15 giây, 9:16).
Nội dung gốc: sân khấu ngoài trời, trời xanh, khán giả ngồi xem. Cô gái đứng ở đầu thấp của tấm bập bênh, cạnh có chồng
đĩa trắng. Cô nhấc chồng đĩa lên, bập bênh hất cô lên cao (người bật đầu kia nằm ngoài khung). Trên không cô tung chồng
đĩa, lộn nhào, rồi đáp xuống trồng cây chuối một tay trên đỉnh tháp ghế gỗ đỏ rất cao, hai bàn chân đỡ chồng đĩa.
Máy quay ngước lên theo cô và giữ cảnh đó đến hết.

Bản của mình: Elise mặc trang phục gym (áo ba lỗ vàng mù tạt, legging đen, chân trần), xem `../models/elise-gym.md`.
Đổi sân khấu thành quảng trường hội chợ mùa thu ngoài trời, cờ dây nhiều màu, trời xanh. Tháp ghế gỗ màu óc chó,
khoảng 12 ghế. Chồng đĩa đổi thành chồng bát sứ trắng (khoảng 10 cái).

## Nhịp (khoảng 15 giây)

| Giây | Clip | Việc | Khung đầu → khung cuối |
|---|---|---|---|
| 0–3 | 1 | Elise đứng trên đầu thấp bập bênh, mỉm cười với khán giả, cúi xuống nhấc chồng bát rồi đứng thẳng, ôm chồng bát trước ngực | `tl1-A-dung` → `tl1-B-cam-bat` |
| 3–5 | 2 | Bập bênh hất lên, Elise bay thẳng lên, hai tay giơ chồng bát qua đầu. Máy quay ngước theo | `tl1-B-cam-bat` → `tl1-C-bay-len` |
| 5–8 | 3 | Trên không: cô tung chồng bát lên cao, co người lộn một vòng | `tl1-C-bay-len` → `tl1-D-lon` |
| 8–11 | 4 | Cắt thời gian: cô đã trồng cây chuối một tay trên ghế trên cùng, tay kia dang ngang; chồng bát rơi xuống, cô đỡ gọn bằng hai bàn chân | `tl1-E-chuoi` → `tl1-F-do-bat` |
| 11–15 | 5 | Giữ thăng bằng, máy quay lùi xa thấy toàn bộ tháp ghế và đám đông vỗ tay (không chốt khung cuối, chỉ lấy vài giây đầu) | `tl1-F-do-bat` → (không) |

Âm thanh: nhạc trống dồn dập, nghỉ một nhịp lúc cô lộn trên không, rồi tiếng khán giả reo hò vỗ tay ở clip 4–5.
Không có chữ trên video (như video gốc).

## Rủi ro và cách xử lý
- Cú lộn trên không (clip 3) là chỗ Muse dễ vẽ méo người. Nếu hỏng thì bỏ clip 3: cắt thẳng từ cảnh bay lên (clip 2)
  sang cảnh đã trồng chuối (clip 4), video còn khoảng 12 giây.
- Clip 4 tách riêng việc "đỡ bát bằng chân" để mỗi clip chỉ một việc.
- Người bật đầu kia của bập bênh nằm ngoài khung như video gốc.

## Trạng thái
- 2026-11-03: đã gen trang phục (`../models/anh/elise-gym-model-sheet.png`, `elise-gym-truoc.png`). Chờ duyệt trang
  phục và nhịp trước khi gen ảnh cảnh.
- 2026-11-03: chủ dự án bảo gen ảnh. Đã gen và xem 6 ảnh khung hình (`gen-anh.csv`), viết `gen-video.csv`.
  Chưa chạy Muse: cần link side chat riêng của series cho `../muse-chat.json`.
- 2026-11-03: đã gen 5 clip (side chat riêng, tài khoản Rio / chrome-profile-2). Clip 3, 4 dùng bản gen lần 1
  (bản lần 2 lỗi, để ở `clip3.lan2.mp4`, `clip4.lan2.mp4`). Bản tốt nhất: `video/final-v3.mp4`, 17 giây, QA 62/100
  (bản ghép tự động `final.mp4` 56/100, `final-v2.mp4` 60/100).
- **Tạm dừng** (chủ dự án đang render series khác, chưa gen lại). Việc còn lại nếu làm tiếp:
  1. Gen lại clip 2: tách riêng cảnh ván hất người lên, khung cuối là lúc vừa rời ván (hiện cảnh nhảy cóc từ đứng sang bay).
     Chủ dự án xem v3 thấy "không khớp hành động": hai chỗ hụt là clip 1→2 (không thấy ván bật) và clip 3→4 (đang lộn
     giữa trời rồi đã trồng chuối trên tháp). Thêm 2 ảnh mới: `tl1-B2-roi-van` (vừa rời ván, đầu ván hất lên) và
     `tl1-D2-cham-ghe` (duỗi người lộn ngược, tay vừa chạm ghế trên cùng); thêm clip D → D2 trước clip 4.
     **Đã gen 2 ảnh này** và thêm vào `gen-video.csv` clip 6 (ván bật, B → B2) và clip 7 (rơi xuống chống tay, D → D2),
     xếp theo thứ tự phát 1, 6, 2, 3, 7, 4, 5. Clip 2 chỉ lấy đoạn đang bay (giây 3–6). Chưa chạy Muse: lần sau chạy
     `muse_auto.py auto --dir` sẽ chỉ gen clip 6 và 7 rồi ghép lại (khoảng 20 giây).
     **Đã gen clip 6 và 7.** Clip 6 trượt QA cả 2 lần, dùng giây 0–4,3 của bản 2 (ván bật thật). Clip 7 bản 2 đạt QA
     nhưng cô đáp ngồi xổm trên đỉnh tháp rồi mới đá lên trồng chuối, có cú lia máy thấy đầu khán giả; đã lật ngang
     (`clip7.goc.mp4` là bản gốc) để tay dang cùng phía với clip 4. Kết quả: `final-v4.mp4` (23,5 s, liền mạch hơn)
     QA 52/100; `final.mp4` tool tự ghép 57/100; `final-v3.mp4` (không có 2 clip nối) vẫn cao nhất 62/100.
     Chủ dự án dặn: cần gen lại thì dừng. Đang chờ chủ dự án chọn bản.
  2. Có thể gen lại clip 3: chồng bát tách rời từng chiếc, tháp ghế màu đỏ khác các clip khác.
  3. Chốt bản cuối rồi dọn: `final.mp4`, `final-v2.mp4`, `clip*.lan2.mp4`, `*.qa.json`, `qa/`, `qa-v2/`, `qa-v3/`.
