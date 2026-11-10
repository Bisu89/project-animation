# Camping Diary tập 01: "Riverside Overnight Car Camp" (ý tưởng v2, chờ duyệt)

> Thay thế bản v1 "riverside afternoon" (30 giây, chỉ dựng lều + cà phê + thái rau). Viết lại sau khi chủ dự án gửi
> video tham khảo `FSave.com_Reels_Solo-Wilderness-Camping-Overnight...mp4` (kênh "Wild Camp Survival", nữ cắm trại
> Hàn Quốc tự quay, xe nhỏ + mái hiên + phòng lưới chắn côn trùng + nấu ăn + mưa + đêm). Đây là **câu chuyện gốc lấy
> cảm hứng phong cách**, không copy khung hình/chữ/logo của video tham khảo.
>
> Nhân vật và trang phục **giữ nguyên bản đã khóa** ở `../models/` (4 ảnh `cd-*.png` đã gen, mặt đã chốt) — không đổi
> gì ở nhân vật, chỉ đổi bối cảnh và nhịp hoạt động cho phong phú và "điện ảnh đời thường" hơn bản v1.

## Bối cảnh mới khóa thêm (lấy cảm hứng từ video tham khảo)

Cộng thêm vào bối cảnh gốc ở `SERIES-PLAN.md` mục 3 (bờ sông, rừng thông, nắng chiều muộn):

- **Xe**: SUV nhỏ gọn màu kem/trắng, đậu cố định một chỗ trong toàn tập, cốp sau hướng ra khu trại.
- **Mái hiên (awning)** đen gắn nóc xe, kéo ra che một khoảng sân.
- **Phòng lưới chắn côn trùng** trong suốt, dựng quanh khu mái hiên — **dựng sẵn gần xong** trong khung hình, cảnh chỉ
  còn thao tác chốt nốt 1-2 điểm (không dựng từ đầu, tránh clip dài và rủi ro biến hình khung lưới).
- **Tấm bạt mưa trong suốt** cuộn sẵn phía trên phòng lưới — khi mưa chỉ cần kéo xuống, không phải lắp mới.
- Bàn gấp gỗ, ghế dài gấp, bếp cồn nhỏ, nồi cơm điện mini, ấm nước, bát gỗ, cốc gỗ/inox, đèn lồng nhỏ (đã bật sẵn từ
  đầu tập — **không có cảnh bật công tắc**, giữ đúng bài học ánh sáng trước/sau khác nhau).
- **Không thêm chó đồng hành** trong bản này dù video tham khảo có chó — nêu riêng ở mục "Cần chủ dự án quyết định"
  bên dưới vì đây là một nhân vật phụ cố định mới, cần bộ ảnh tham chiếu riêng và giữ nhận diện qua nhiều clip/tập,
  không nên thêm ngầm trong lúc duyệt nội dung.

Ánh sáng tiến triển: chiều muộn nắng nhạt (cảnh 1–4) → mây kéo tới, mưa nhẹ (cảnh 7) → tối có mái hiên + đèn lồng ấm,
còn chút ánh chiều hắt qua lưới (cảnh 8–11, không tối hẳn).

## Khác gì so với bản v1 (riverside-afternoon)

- Thêm xe + mái hiên + phòng lưới làm "căn cứ" thay vì chỉ có lều — phong phú hơn, giống đúng tinh thần "car camping"
  của video tham khảo.
- Thêm một nhịp thời tiết (mưa) để tạo kịch tính nhẹ và cho thấy phòng lưới/bạt mưa hữu dụng — đúng nguyên tắc "mỗi đồ
  vật có lý do xuất hiện".
- Bỏ cảnh thái rau bằng dao (rủi ro giải phẫu tay cao, bản v1 đã có) — thay bằng nấu cơm + xiên nướng, rủi ro chính
  chuyển sang lửa/hơi nước, đã ghi rõ cách né ở bảng dưới.
- Vẫn giữ: không lồng giọng tiếng Hàn khớp môi (chưa xác nhận được giọng), chỉ biểu cảm không lời + phụ đề/âm thanh
  môi trường thêm lúc dựng.

## Nhịp (khoảng 48–52 giây)

| Giây | Clip | Việc | Máy quay | Chuyển cảnh sau | Rủi ro chính |
|---|---|---|---|---|---|
| 0–4 | 1 | Selfie: nhìn máy, cười tự nhiên, vẫy tay nhẹ; xe + mái hiên đã dựng mờ phía sau | Cầm tay, selfie | `mo_dai` | Giữ đúng 1 hành động (chào + vẫy), không xoay máy lộ cảnh trong cùng clip |
| 4–8 | 2 | Đứng cạnh xe, hai tay kéo nốt đoạn cuối mái hiên căng ra (mái hiên đã kéo ~80% từ đầu khung) | Tripod thấp, 3/4 | `mo_dai` | Hình học mái hiên phải khớp khung trước/sau — ghi rõ "awning already 80% extended at frame start" trong prompt |
| 8–12 | 3 | Với tay chốt nốt 1-2 móc cuối của phòng lưới (lưới đã dựng gần xong quanh mái hiên) | Cận trung, góc thấp | `mo` | Không đếm số móc chính xác — QA không trừ điểm nhịp tay |
| 12–16 | 4 | Bên trong phòng lưới: xếp bàn gấp + đặt nồi cơm điện mini lên bàn, kiểm tra nắp nồi | Trên cao (overhead) hoặc trung cảnh tĩnh | `mo_dai` | Thấp — đồ dùng đã có sẵn trên bàn từ đầu, không bày biện từng món |
| 16–20 | 5 | Bếp cồn đã cháy lửa nhỏ sẵn (không mồi lửa), đặt ấm nước lên, hơi bốc nhẹ cạnh mặt, nheo mắt cười | Cận trung | `mo_dai` | Lửa/hơi nước tự loang hình — clip ngắn, cắt trước khi lửa đổi dáng |
| 20–24 | 6 | Xoay xiên đồ ăn (thịt/khoai) trên lửa đã ổn định, 1–2 nhịp trở xiên, ngả vàng đều, cười hài lòng cuối clip | Cầm tay, trung cận | `mo_dai` | Lửa lần 2 — nếu hỏng, cắt bớt còn phần xoay xiên, bỏ pha cười |
| 24–28 | 7 | Mưa bắt đầu rơi nhẹ ngoài phòng lưới; với hai tay kéo tấm bạt mưa trong suốt xuống che, nhìn lên trời | Tripod, trung cảnh | `mo_dai` | Giọt mưa dễ vẽ sai hình — ưu tiên giữ 2–3 s đầu, cắt trước khi biến dạng |
| 28–32 | 8 | Bên trong đã che kín, ngồi ghế xếp, múc cơm ra bát gỗ, hơi cơm bốc nhẹ, đèn lồng ấm phía sau | Tripod, trung cảnh | `mo` | Hơi nước nhẹ — giữ ngắn, không kéo dài hơi bốc |
| 32–37 | 9 | Ăn miếng đầu tiên, nhắm mắt nhai, gật gù hài lòng — một nhịp liên tục | Cận mặt/vai | `mo` | Không lặp nhai quá 2 nhịp (miệng dễ biến dạng khi lặp) |
| 37–43 | 10 | Cầm cốc cà phê/trà đã pha sẵn (bỏ pha pha chế), nhấp một ngụm, hơi bốc nhẹ, nhìn ra màn mưa ngoài lưới | Trung cảnh tĩnh | `mo_dai` | Thấp |
| 43–50 | 11 | Khung kết: ngồi tựa ghế, nhìn máy mỉm cười nhẹ, gật đầu hài lòng, đèn lồng ấm + mưa rơi ngoài lưới làm phông nền | Tripod, trung cảnh | (kết) | Gộp 2 động tác nhỏ (cười + gật đầu) thành 1 nhịp ngắn, không đứng/ngồi cầm đồ đung đưa chờ hết clip |

Âm thanh theo cảnh (lớp dựng tay sau, không bắt Muse tạo): gió/chim nhẹ (1), tiếng kéo bạt/khung mái hiên (2), tiếng
móc khóa lưới (3), tiếng đặt nồi/ấm (4), tiếng lửa tách nhẹ + nước sôi (5, 6), tiếng mưa rơi trên bạt (7), tiếng múc
cơm/bát (8), tiếng nhai nhẹ (9), tiếng cốc chạm tay (10). Không nhạc nền marketing, không lồng giọng cho tới khi xác
nhận được giọng tiếng Hàn tự nhiên (xem `SERIES-PLAN.md` mục 6).

## Cần chủ dự án quyết định trước khi gen

1. **Duyệt bảng nhịp trên** — đổi gì cũng được, đây là bản v2 đầu tiên.
2. ~~Có thêm chó đồng hành không?~~ **Đã chốt (2026-11-10): để dành cho tập sau**, tập 01 không có chó.
3. Giọng tiếng Hàn và độ dài tập dài: vẫn để ngỏ như `SERIES-PLAN.md` mục 6, không chặn việc duyệt tập 01.

## Sau khi được duyệt (chưa làm)

1. Vì nhân vật đã khóa sẵn (`../models/anh/cd-*.png`), bước tiếp theo là gen **ảnh khung đầu từng cảnh** (11 ảnh),
   luôn gửi kèm `cd-truoc.png` + `cd-toanthan-truoc.png` làm `anh_tham_chieu`, theo đúng quy trình ở
   `.claude/skills/elise/prompt.md` và `chay-tool.md`.
2. Viết `gen-anh.csv`, `gen-video.csv`, `ghep-v2.csv` cho tập 01 (tiền tố file riêng, ví dụ `co1-` để không trùng với
   `cd-` của bộ ảnh nhân vật gốc).
3. Chạy Muse theo `$TOOL` (`C:\Users\HoaVan\Desktop\tool AI\muse-auto\`), side chat riêng cho `camping-diary` trong
   `muse-chat.json` (chưa có — tạo mới khi bắt đầu gen, không dùng chung chat với dòng Elise khác).

## Trạng thái

- 2026-11-09: review master prompt gốc, viết kế hoạch series + nhịp tập 01 v1 (riverside afternoon, 28s). Chờ duyệt.
  Đã gen 4 ảnh nhân vật khóa (`models/anh/cd-*.png`).
- 2026-11-10: chủ dự án gửi video tham khảo "Solo Wilderness Camping Overnight" (kênh Wild Camp Survival) + yêu cầu
  làm "bản camping tốt nhất". Viết lại tập 01 thành v2 "overnight car camp" (xe + mái hiên + phòng lưới + mưa + nấu
  ăn + cà phê), 11 clip ~50s, giữ nguyên nhân vật đã khóa. Chưa gen gì thêm — chờ duyệt bảng nhịp + quyết định về chó
  đồng hành ở trên.
