# Video Giáng sinh "mèo ngủ cạnh lò sưởi" (Facebook Reels -> YouTube)

Ngày chốt: 2026-10-26. Trạng thái: **đã có bản 40s hoàn chỉnh**, chờ chủ dự án xem và quyết bước sau.

## Mục tiêu
Làm video kiểu "cozy ambient" đang thịnh hành trên Facebook (video mẫu: Reels "Rainy nights", 10s, dọc 9:16, một ảnh minh họa + zoom chậm + mưa + đèn lồng + sấm) theo hướng Giáng sinh, để kéo traffic sang YouTube. Mẫu có watermark của kênh khác: **không dựng lại ảnh/nhân vật của họ**, chỉ học cấu trúc.

Điều kiện giữ nguyên: Remotion điều khiển bằng code, ảnh tạo bằng ChatGPT Plus, không dịch vụ video AI trả phí.

## Kết quả
- `renders/xmas-cat-40s.mp4`: 40s, 1080x1920, nhạc **Window Prayer** (`C:\Users\hoavx\Desktop\audio\`, nhịp ~68 bpm, ấm; Locket Rainfall nhanh gấp đôi, horror không hợp) + tiếng lửa/gió sinh bằng code.
- Chuyển động: zoom chậm vào mặt mèo; mèo thở; tai giật (giây 4, 19.5, 33); mắt hé mở (9, 27); đầu đuôi nhích (13.5, 23, 36); lửa tự dựng; tuyết rơi trong cửa sổ; hơi nước từ cốc ca cao; đèn dây lấp lánh; ánh lửa nhấp nháy lên sàn và mèo.

## Cách làm (đã chứng minh chạy được)
1. **Ảnh tổng thể** `content/xmas-cat/master.png` (941x1672), tạo từ prompt M1 trong `assets_master.csv`.
2. **Sửa trên ảnh cắt nhỏ**, không sửa cả khung (bài học từ camp-demo, xem [[cook-camp-demo/TONG_KET.md]]). Tọa độ cắt nằm ở `content/xmas-cat/crops.json`. Kết quả ChatGPT trả 1536x1024, thu về 450x300 rồi **đo độ lệch** bằng phase correlation (cả 4 ảnh lệch 0px).
   - `fire_plate.png`: lò sưởi bỏ hết lửa, giữ củi và than hồng.
   - `cat_face_eyes_half.png`, `cat_face_ear_turn.png`, `cat_tail_lift.png`: biến thể mắt/tai/đuôi.
   - Prompt: `assets_fire.csv`, `assets_cat.csv`.
3. **Biến thể chuyển mờ** lên ảnh gốc đúng vị trí (viền bo 16px). Mèo thở bằng co giãn nhẹ từ đường bụng; các biến thể nằm trong cùng nhóm biến đổi nên khớp khi thở.
4. **Lửa tự dựng** (ảnh lửa vẽ sẵn bị uốn bằng nhiễu trông giả, đã bỏ): 8 lưỡi lửa thon (bezier) cao/nghiêng theo nhịp riêng, lõi vàng, nhiễu đứng yên làm méo nhẹ, 16 tàn lửa.
5. **Khói/hơi nước mượt:** nhiễu `feTurbulence` dịch bằng `feOffset` theo số lẻ pixel bị cắt về số nguyên -> khói nhích từng bậc và nhảy lại ở mỗi vòng lặp. Cách đúng: nhiễu đứng yên, độ cong là sóng sin chạy lên theo thời gian (`age*k - f*w`), mỗi hạt mờ vào/ra từ từ.

## Bài học
1. Ảnh phẳng + hiệu ứng phủ vẫn đủ cho cảnh "không khí" (không cần hành động chính xác); thất bại ở cook-ep01 là do cảnh cần hành động.
2. Chuyển mờ biến thể ảnh cắt nhỏ an toàn hơn tách layer nền xanh: không cần keying, không lộ viền.
3. **Vùng cắt phải rộng hơn vật sẽ chuyển động.** Ảnh cắt đuôi (450,1100,900,1400) cắt cụt đầu đuôi ~30px bên trái (đầu đuôi ở x~420). Nếu thấy vết nối khi đuôi cong, tạo lại với vùng (330,1100,780,1400).
4. Mắt hé hơi nhiều (lộ tròng xanh), bớt cảm giác ngủ sâu. Có thể yêu cầu "khe mỏng hơn" nếu muốn.
5. Dùng entry riêng `src/xmas-cat/index.ts`: `Root.tsx` đang lỗi bundle vì `src/anc-ep04` import `./voiceenv` không tồn tại (không do phần này).

## Việc tiếp theo (chưa làm)
- Chủ dự án xem video: khói, lửa, đuôi, mức nhạc (nhạc 80%, môi trường 55%).
- Bản **Reels 15-20s** (cắt từ bản 40s) và bản **dài lặp 1-3 giờ** cho YouTube (camera trôi chậm có vòng lặp; nhạc cần nhiều bài).
- Thêm 4-5 cảnh khác (mèo cạnh cây thông, cabin mưa tuyết, hiên nhà...) để đăng đều.
- Phễu: link YouTube để ở comment ghim/giới thiệu trang (Facebook hạ tiếp cận link ngoài), chữ cuối video "bản đầy đủ trên YouTube".
- Độ phân giải: ảnh 941x1672 phóng lên 1080x1920 + zoom 13%, cuối video hơi mềm; ảnh gốc to hơn sẽ tốt hơn.
- Camp-demo: prompt layer gió đã soạn ở `content/camp-demo/assets_wind.csv`, chưa có ảnh.

## Tham chiếu: video "Retro Drive / Tokyo Chill Rap" (phân tích 2026-10-26)
Video YouTube 3h49m (1080p, 1,1GB). Cấu trúc: intro ~15s (cảnh phố Tokyo, chữ "Lost in the music / Chill girl Vibes", nhòe zoom + glitch RGB) rồi **một poster tĩnh** (cô gái đeo tai nghe ngồi trên mui xe, chữ TOKYO to, viền giấy cũ, mã vạch) giữ nguyên gần 4 tiếng. Chuyển động trung bình 0,17/255 (gần như tĩnh): chỉ có nhiễu hạt, nhấp nháy nhẹ và một nút Subscribe thoáng qua. Nhạc nhịp ~96 bpm, city pop/chill rap. Giá trị nằm ở **nhạc dài + một hình ảnh có bản sắc**, không ở animation. Hướng của mình: cùng công thức nhưng cảnh mèo/lò sưởi chuyển động thật hơn.

## Bản đồ file
| Việc | File |
|---|---|
| Composition | `demo-project/src/xmas-cat/` (`Video.tsx`, `index.ts`) |
| Ảnh/prompt | `content/xmas-cat/` (`master.png`, `assets_*.csv`, `crops.json`, biến thể) |
| Tài nguyên render | `demo-project/public/xmas-cat/` (`master`, `fire_plate`, `eyes_half`, `ear_turn`, `tail_lift`, `ambience.wav`, `music.mp3`) |
| Âm thanh lửa/gió | `scripts/gen_xmas_sfx.py [giây]` |
| Bản render | `renders/xmas-cat-40s.mp4` |

## Lệnh
```
cd demo-project
npx remotion studio src/xmas-cat/index.ts
npx remotion render src/xmas-cat/index.ts XmasCat ../renders/xmas-cat-40s.mp4 --codec=h264 --crf=18 --concurrency=3 --port=3493
python ../scripts/gen_xmas_sfx.py 42     # chạy từ thư mục gốc dự án nếu đổi độ dài
```
Cổng hay bị chiếm: đổi `--port`.

## Cũng làm trong phiên này (không phải Giáng sinh)
- Demo khói theo nhạc (`demo-project/src/smoke-demo/`, `scripts/smoke_features.py`: trích bass/mid/high/onset theo frame ra JSON). Đã xóa video test, mã vẫn còn.

## Bản ngang 10 phút (bắt đầu 2026-10-26)
- Prompt ảnh: `content/xmas-cat-wide/assets_master.csv` (L1 chính; L2, L3 là cảnh phụ để chuyển mờ giữa video cho đỡ đơn điệu). ChatGPT trả 3:2 (1536x1024); sẽ cắt về 16:9 (1536x864), nên vật quan trọng nằm trong 80% giữa theo chiều cao.
- Bước tiếp: có `wide_master.png` -> tạo ảnh cắt + CSV biến thể (lò sưởi không lửa, mặt mèo mắt/tai, đuôi; vùng cắt đuôi phải rộng hơn vật) -> dựng composition ngang 1920x1080 -> render 1 đoạn lặp rồi ghép 10 phút bằng ffmpeg + nối nhạc dài (nhạc trong `C:\Users\hoavx\Desktop\audio\` mới đủ ~5 phút nếu bỏ horror: cần thêm bài hoặc lặp có crossfade).

### Tiến độ bản ngang (cập nhật)
- Đã có `content/xmas-cat-wide/master.png` (1536x1024, đã duyệt), `music_10min.mp3` (Window Prayer, jazz 10, jazz 3, jazz 7, crossfade 6s, chuẩn hóa -18 LUFS).
- Composition: `demo-project/src/xmas-cat-wide/` (entry riêng `index.ts`, id `XmasCatWide`, 1920x1080, 600s; vùng 16:9 cắt từ y=70). Tuyết, khói cốc, đèn dây, nến lồng đèn, ánh lửa, mèo thở, camera trôi 150s/vòng: **đã chạy**. Lịch mắt/tai/đuôi trải đều 10 phút (hàm `schedule`).
- Còn thiếu 4 ảnh biến thể (prompt: `content/xmas-cat-wide/assets_variants.csv`, ảnh cắt cùng thư mục, tọa độ `crops.json`): `fire_plate.png`, `cat_face_eyes_half.png`, `cat_face_ear_turn.png`, `cat_tail_lift.png`. Khi có: thu về 900x600, chép vào `demo-project/public/xmas-cat-wide/` với tên `fire_plate / eyes_half / ear_turn / tail_lift .png`, rồi đổi `FIRE_PLATE_READY` và `CAT_VARIANTS_READY` thành `true` trong `Video.tsx`.
- Âm thanh lửa/gió: `python scripts/gen_xmas_wide_sfx.py 602` (file ~106MB, không đưa vào git).
- Render xem thử: `npx remotion render src/xmas-cat-wide/index.ts XmasCatWide ../renders/xmas-wide-preview.mp4 --frames=0-899 --port=3495`. Bản đầy đủ 18000 frame (ước tính ~45 phút).

### Cập nhật bản ngang: mở đầu + đèn theo nhạc (2026-10-26)
- 4 ảnh biến thể đã có, đo lệch 0px, đã bật (`FIRE_PLATE_READY`, `CAT_VARIANTS_READY` = true). Gốc lửa `FLAME_BASE=612`, gradient gốc lửa gần trong suốt để lửa bốc ra từ giữa củi (lần đầu lửa đè lên củi).
- **Mở đầu 13s** (`Intro` trong `xmas-cat-wide/Video.tsx`): cảnh vào từ nhòe 14px + zoom 1.3 lắng lại trong 6-7s; chữ Playfair Display hiện từng dòng ("A QUIET NIGHT BY THE FIRE" / "Christmas" / "cozy jazz · crackling fire · falling snow" / "10 MINUTES TO SLEEP, STUDY & UNWIND"), nền tối đi 50% rồi tan. Sửa chữ ở hàm `Intro`.
- **Đèn dây và nến theo nhạc:** `scripts/smoke_features.py content/xmas-cat-wide/music_10min.mp3 demo-project/src/xmas-cat-wide/features.json`. Mỗi bóng đèn nghe một dải (bass/mid/high theo `i % 3`) cộng nhấp nháy riêng; nến theo mid + onset. Mức thấp có chủ ý (đừng làm lộ hẳn).
- Render nên dùng `--public-dir` riêng (chỉ chép `public/xmas-cat-wide/` vào một thư mục tạm có cấu trúc `xmas-cat-wide/...`): bundle mặc định chép cả `public/` của mọi series, từng lỗi ENOENT ở `public/anc-ep04/.voice_cache`.
- Xem thử 40s: `renders/xmas-wide-preview.mp4`. Bản 10 phút chưa render lại sau khi thêm mở đầu (~40 phút).

### Mở đầu kiểu poster (thay bản chữ đơn giản, 2026-10-26)
Mô phỏng cấu trúc video tham khảo "Tokyo Chill Rap" bằng code (chữ và hình là của mình): A 0-5.6s cảnh tối + sepia + khung phim + dòng chữ nhỏ ("Lost in the warmth." / "Cozy Christmas Jazz") -> G 5.4-6.6s glitch RGB + rung -> Z 6-7.8s zoom xuyên tâm (8 bản ảnh chồng) -> R 7.8-9.4s zoom ngược, poster hiện: chữ CHRISTMAS lớn, "Cozy Christmas Vibes", hai nhãn góc, COZY JAZZ ở đáy, mã vạch, viền giấy cũ, hạt phim -> giữ tới 13.6s rồi tan còn cảnh sạch (tổng 15.6s). Hàm `introFx` (cảnh) + `Intro` (chữ) trong `xmas-cat-wide/Video.tsx`. Âm: `scripts/gen_xmas_intro_sfx.py` (crackle glitch, whoosh, thịch). Lệnh render xem thử dùng `--public-dir` tạm (xem mục trên), thêm `intro_sfx.wav` vào đó.

### Bản 10 phút đã render (2026-10-26)
`renders/xmas-wide-10min.mp4`: 600s, 1920x1080, h264 crf22, 426 MB, âm -19.2 LUFS (nhạc 4 bài ghép + lửa/gió + SFX mở đầu). Render mất ~45 phút (concurrency 3, `--public-dir` tạm). Đã kiểm khung hình ở 5:00 và 9:57 (mờ ra cuối). Chưa làm: bản Reels 15-20s từ cảnh ngang, thêm cảnh L2/L3 chuyển mờ giữa video, đăng thử + phễu YouTube.
