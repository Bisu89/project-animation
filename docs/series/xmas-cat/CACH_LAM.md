# Cách làm: video Giáng sinh "mèo ngủ cạnh lò sưởi" (Reels Facebook -> YouTube)

Tài liệu làm lại từ đầu, chạy được trên máy này (Windows, Remotion 4.0.535, ffmpeg, Python có numpy/scipy/PIL, ảnh tạo bằng ChatGPT Plus). Trạng thái và việc dở: xem [TIEP_TUC_LAM.md](TIEP_TUC_LAM.md). Ngày: 2026-10-26.

## 1. Ý tưởng và phễu

- Video "cozy ambient" đang thịnh hành trên Facebook (tham khảo: Reels "Rainy nights", 10s dọc, một ảnh minh họa + zoom chậm + mưa + đèn lồng; video YouTube "Tokyo Chill Rap" 3h49m ngang, một poster tĩnh + nhạc dài). Giá trị nằm ở **không khí + nhạc dài + một hình ảnh có bản sắc**, không ở animation phức tạp.
- Phễu: **Reels dọc 15-45s** (Facebook) -> thẻ cuối "bản đầy đủ 10 phút trên YouTube, link ở comment đầu" -> **video ngang 10 phút** (YouTube). Facebook hạ tiếp cận bài có link ngoài, nên link để ở **comment ghim** và phần giới thiệu trang, không để trong nội dung bài.
- Không dựng lại ảnh/nhân vật của kênh khác (video mẫu có watermark). Chỉ học cấu trúc; chữ và hình đều của mình.
- Điều kiện: mọi thứ do code Remotion điều khiển; ảnh nguồn từ ChatGPT Plus; không dùng dịch vụ video AI trả phí.

## 2. Thành phẩm và file

| Sản phẩm | Composition (id) | Kích thước | File ra |
|---|---|---|---|
| Video YouTube 10 phút | `XmasCatWide` (`demo-project/src/xmas-cat-wide/`) | 1920x1080, 600s | `renders/xmas-wide-10min.mp4` (426 MB) |
| Reels dọc 45s | `XmasReel` (`demo-project/src/xmas-cat/`) | 1080x1920, 45s | `renders/xmas-reel-45s.mp4` |
| Bản dọc 40s | `XmasCat` | 1080x1920, 40s | `renders/xmas-cat-40s.mp4` |

Video (mp4/wav/mp3) bị `.gitignore`; ảnh gốc và mã nguồn có trong git. Mỗi composition có entry riêng `index.ts` (vì `Root.tsx` đang lỗi bundle: `src/anc-ep04` import `./voiceenv` không tồn tại).

## 3. Quy trình từng bước

### Bước 1. Ảnh tổng thể (master)
- Prompt: `content/xmas-cat/assets_master.csv` (dọc 9:16) và `content/xmas-cat-wide/assets_master.csv` (ngang). Tạo 3 phương án, chọn một, lưu `master.png` (dọc 941x1672; ngang 1536x1024).
- Cảnh phải có **ba vùng tách rời** (lò sưởi / mèo / cửa sổ) với khoảng trống giữa chúng để sửa từng vùng không dính nhau. Mèo nằm ngủ, thấy rõ cả thân, không bị gì che. Ngang: ChatGPT trả 3:2, mình cắt về 16:9 (1536x864, bắt đầu từ y=70), nên vật quan trọng nằm trong 80% giữa chiều cao.
- Cảnh phụ để đỡ đơn điệu (chưa dùng): L2 (áp mái), L3 (ghế cửa sổ) trong `content/xmas-cat-wide/assets_master.csv`.

### Bước 2. Ảnh cắt và biến thể (phần quan trọng nhất)
Bài học từ camp-demo ([cook-camp-demo/TONG_KET.md](../cook-camp-demo/TONG_KET.md)): ChatGPT không giữ vị trí/tỉ lệ khi sửa cả khung lớn. Cách làm được: **cắt vùng nhỏ 450x300 từ master, sửa trên ảnh cắt, dán lại đúng tọa độ**.

1. Cắt 3 vùng (toạ độ `crops.json`, đơn vị pixel của master):
   - Ngang: `fire_crop` (100,370)-(550,670), `cat_face_crop` (520,600)-(970,900), `cat_tail_crop` (620,640)-(1070,940).
   - Dọc: `fire_crop` (0,450)-(450,750), `cat_face_crop` (110,950)-(560,1250), `cat_tail_crop` (450,1100)-(900,1400).
   - **Vùng cắt phải rộng hơn vật sẽ cử động.** Bản dọc cắt đuôi hụt ~30px nên đuôi cong lên có thể lộ vết nối; bản ngang đã cắt rộng hơn.
2. Với mỗi ảnh cắt, đính kèm vào ChatGPT và dán prompt tương ứng (`assets_fire.csv` / `assets_cat.csv` bản dọc; `assets_variants.csv` bản ngang). Bốn ảnh:
   - **F0** `fire_plate`: bỏ hết lửa, giữ lò sưởi, giá sắt, củi; củi thành than hồng đỏ rực, không khói/tia lửa.
   - **C1** `cat_face_eyes_half`: mắt hé một khe mỏng (một phần tám), **không** lộ cả tròng (bản đầu mở quá to, mất cảm giác ngủ).
   - **C2** `cat_face_ear_turn`: tai gần giật ra sau ~12 độ, mắt vẫn nhắm.
   - **C3** `cat_tail_lift`: đầu đuôi cong lên ~15 độ.
   - Prompt luôn có câu: "Change ONLY ...; everything else pixel-identical, same position and same size".
3. Lưu kết quả (ChatGPT trả 1536x1024, 3:2) vào `content/xmas-cat*/` với tên: `fire_plate.png`, `cat_face_eyes_half.png`, `cat_face_ear_turn.png`, `cat_tail_lift.png`.
4. **Đo trước khi dùng:**
   ```
   python scripts/xmas_check_variants.py content/xmas-cat-wide
   ```
   `shift=(0,0)` là đạt (phase correlation); `mean_diff` ~4-6 với mèo, ~18-21 với lò sưởi (lò sưởi khác nhiều có chủ ý). Lệch khác (0,0) thì tạo lại, không dùng. Script ghi `_sbs_*.png` (gốc | biến thể | độ khác x3) để nhìn rồi xóa.
5. Thu về 900x600 và đưa vào thư mục render:
   ```
   python scripts/xmas_prepare.py wide  <thu_muc_render>
   python scripts/xmas_prepare.py portrait <thu_muc_render>
   ```
   (xem mục 5 về `--public-dir`).

### Bước 3. Nhạc
- Nguồn: `C:\Users\hoavx\Desktop\audio\` (Window Prayer, jazz 1-10, Locket Rainfall; **horror** không dùng). Chọn bài **chậm, ấm** (nhịp ~60-85 bpm, tâm phổ thấp): đã đo nhịp/phổ từng bài. Bỏ jazz 4, 6, 9 (117-144 bpm) và Locket Rainfall (~140 bpm).
- Ghép 10 phút (chuẩn hóa -18 LUFS từng bài, nối chuyển mờ 6s, mờ vào 3s, mờ ra 10s):
  ```
  ffmpeg -y -i "Window Prayer.mp3" -i "jazz 10.mp3" -i "jazz 3.mp3" -i "jazz 7.mp3" -filter_complex \
   "[0]loudnorm=I=-18:TP=-1.5[a];[1]loudnorm=I=-18:TP=-1.5[b];[2]loudnorm=I=-18:TP=-1.5[c];[3]loudnorm=I=-18:TP=-1.5[d];\
    [a][b]acrossfade=d=6:c1=tri:c2=tri[ab];[ab][c]acrossfade=d=6:c1=tri:c2=tri[abc];[abc][d]acrossfade=d=6:c1=tri:c2=tri[all];\
    [all]atrim=0:600,afade=t=in:d=3,afade=t=out:st=590:d=10[out]" -map "[out]" -ar 44100 -b:a 192k content/xmas-cat-wide/music_10min.mp3
  ```
  Chép thành `demo-project/public/xmas-cat-wide/music.mp3`. Reels/bản dọc dùng `Window Prayer.mp3` chép thành `demo-project/public/xmas-cat/music.mp3`.
- Đặc trưng nhạc cho đèn phản ứng (bass/mid/high/onset theo frame 30fps, làm mượt lên nhanh xuống chậm):
  ```
  python scripts/smoke_features.py content/xmas-cat-wide/music_10min.mp3 demo-project/src/xmas-cat-wide/features.json
  ```

### Bước 4. Âm thanh môi trường (sinh bằng code)
```
python scripts/gen_xmas_sfx.py 47            # dọc (>= độ dài Reels): lửa tí tách + gió -> public/xmas-cat/ambience.wav
python scripts/gen_xmas_wide_sfx.py 602      # ngang 10 phút -> public/xmas-cat-wide/ambience.wav (~106 MB)
python scripts/gen_xmas_intro_sfx.py         # ngang: crackle glitch + whoosh + thịch mở đầu -> intro_sfx.wav
```

### Bước 5. Dựng cảnh (những gì `Video.tsx` đang làm)
Toàn bộ đặt theo toạ độ pixel của master, cả cảnh scale lên 1080x1920 (dọc) hoặc 1920x1080 (ngang, cắt 16:9).

| Lớp | Cách làm | Tham số chính |
|---|---|---|
| Camera | zoom/nhích chậm theo hàm sin (ngang: vòng 150s, tâm trôi 210s/170s; dọc: 1 -> 1.13 theo độ dài) | `k`, `originX/Y` |
| Mèo thở | bản sao thân mèo bo mềm, co giãn dọc ~0.8-0.9% quanh đường bụng; biến thể nằm cùng nhóm nên khớp khi thở | `breath` |
| Tai/mắt/đuôi | chuyển mờ biến thể ảnh cắt, viền bo 16px; lịch rải đều `schedule(every, first, seed)` (ngang: tai ~34s, mắt ~58s, đuôi ~44s, lệch ngẫu nhiên cố định) | `ear`, `eyes`, `tail` |
| Lửa lò sưởi | ảnh nền sạch lửa + lửa tự dựng: 8-9 lưỡi lửa (bezier) cao/nghiêng theo nhịp sin riêng, nhiễu **đứng yên** làm méo, lõi vàng, gốc gần trong suốt để mọc từ giữa củi; 16-18 tàn lửa | `FLAME_BASE` (ngang 612, dọc 692), `TONGUES` |
| Ánh lửa | 2 lớp radial gradient (screen + soft-light), độ sáng theo `flick()` (tổng sin không công ước) | `fire`, `fire2` |
| Tuyết | 70-80 hạt trong cửa sổ, 3 độ sâu (to/nhanh/rõ ở gần) | `WIN` (cửa kính) |
| Khói cốc | 48-70 chấm tròn mờ bốc lên, cột uốn bằng **sóng sin chạy lên theo thời gian** + nhiễu đứng yên + blur | `MUG`, `snake` |
| Đèn dây, nến | mỗi bóng nghe một dải (bass/mid/high theo `i % 3`) + nhấp nháy riêng; nến theo mid + onset (ngang) | mức nhạc 15-25% |
| Mở đầu (ngang) | xem mục 6 | `introFx`, `Intro` |
| Reels (dọc) | tiêu đề đầu + thẻ kết YouTube, trong vùng an toàn của Reels (bỏ ~150px trên, ~280px dưới) | `ReelOverlay` |

## 4. Mở đầu poster của bản ngang (15.6s)
Mô phỏng cấu trúc video mẫu bằng code: A (0-5.6s) cảnh tối + sepia + khung phim + dòng nhỏ + headline "Lost in the warmth. / Cozy Christmas Jazz" -> G (5.4-6.6s) chữ tách RGB, cảnh rung, chớp -> Z (6-7.8s) zoom xuyên tâm (8 bản ảnh chồng screen + blur nhẹ 5px) -> R (7.8-9.4s) zoom ngược, poster hiện (CHRISTMAS lớn, "Cozy Christmas Vibes", hai nhãn góc, COZY JAZZ ở đáy, mã vạch, viền giấy cũ nhiễu, hạt phim) -> giữ đến 13.6s rồi tan còn cảnh sạch. Muốn đổi chữ: hàm `Intro`; đổi nhịp: hằng số trong `introFx`. Bản Reels dọc dùng mở đầu **đơn giản** (tiêu đề hiện 1-5s) để vào cảnh ngay.

## 5. Render

Render mặc định chép cả `demo-project/public/` (media của mọi series, hàng trăm MB) vào bundle tạm và từng lỗi `ENOENT` ở `public/anc-ep04/.voice_cache`. Luôn dùng `--public-dir` trỏ vào thư mục riêng chỉ có tài nguyên cảnh này:

```
python scripts/xmas_prepare.py wide <thu_muc>      # tạo <thu_muc>/xmas-cat-wide/ (ảnh); thêm ambience.wav, music.mp3, intro_sfx.wav vào đó
cd demo-project

# xem thử 40s đầu (có mở đầu)
npx remotion render src/xmas-cat-wide/index.ts XmasCatWide ../renders/xmas-wide-preview.mp4 --public-dir=<thu_muc> --frames=0-1199 --crf=20 --concurrency=3 --port=3495

# bản đầy đủ 10 phút (18000 frame, ~45 phút, ~7.5 fps)
npx remotion render src/xmas-cat-wide/index.ts XmasCatWide ../renders/xmas-wide-10min.mp4 --public-dir=<thu_muc> --codec=h264 --crf=22 --concurrency=3 --port=3497

# Reels dọc 45s
python ../scripts/xmas_prepare.py portrait <thu_muc>   # ambience.wav + music.mp3 của bản dọc phải có sẵn
npx remotion render src/xmas-cat/index.ts XmasReel ../renders/xmas-reel-45s.mp4 --public-dir=<thu_muc> --codec=h264 --crf=18 --concurrency=3 --port=3498

# xem trực tiếp
npx remotion studio src/xmas-cat-wide/index.ts
```
Cổng hay bị chiếm: đổi `--port`. Chụp một khung: `npx remotion still <entry> <id> out.png --frame=N --public-dir=...`.

## 6. Đăng và nối sang YouTube
- **Reels:** 45s dọc (thay đổi độ dài ở hằng số `REEL` trong `src/xmas-cat/index.ts`; nhớ chạy `gen_xmas_sfx.py` đủ dài và thêm lịch tai/mắt/đuôi nếu dài hơn); mở đầu có tiêu đề ngắn, thẻ cuối "Full 10-minute version on YouTube / link in the first comment". Caption ngắn kiểu "cozy fireplace jazz for a quiet Christmas night", vài thẻ #christmas #cozy #jazz #fireplace #lofi. Đăng comment đầu có link YouTube và ghim lên.
- **YouTube:** tiêu đề nên nêu rõ thời lượng và công dụng (ví dụ "Cozy Christmas Jazz | Fireplace, Snow & Sleeping Cat | 10 Minutes to Relax/Sleep/Study"). Ảnh thumbnail: khung poster giây ~10 (CHRISTMAS lớn) hoặc cảnh sạch kèm chữ. Mô tả có danh sách bài nhạc nếu cần ghi nguồn.
- Kiểm tra điều khoản/bản quyền của nhạc trước khi đăng (nhạc AI hoặc nhạc tự có thì ghi nguồn; kiểm tra chính sách nội dung AI của YouTube nếu dùng ảnh/nhạc AI để bật kiếm tiền).
- Đăng đều nhiều ngày: mỗi Reels một cảnh khác (xem việc tiếp theo bên dưới) để Facebook có nhiều thứ để phân phối.
- Mốc: Giáng sinh 25/12/2026; lượng tìm nhạc Giáng sinh tăng từ ~đầu tháng 11, nên xong trước 5-10/11.

## 7. Lỗi hay gặp và cách tránh
1. **Khói/lửa bị giật:** đừng dịch nhiễu `feTurbulence` bằng `feOffset` theo pixel lẻ (bị làm tròn, nhảy ở mỗi vòng lặp). Nhiễu đứng yên, chuyển động tính bằng sóng sin liên tục theo thời gian.
2. **Lửa vẽ sẵn bị uốn bằng nhiễu trông giả:** bỏ lửa trong ảnh nền (F0), dựng lửa mới bằng code.
3. **Lửa mới đè lên củi, bị nhợt:** nâng gốc lửa lên, gradient gốc gần trong suốt, màu cam đậm hơn.
4. **ChatGPT dịch/phóng ảnh:** chỉ sửa ảnh cắt nhỏ; đo lệch bằng `xmas_check_variants.py` trước khi dùng.
5. **Vùng cắt hụt đầu đuôi:** cắt rộng hơn vật chuyển động.
6. **`Root.tsx` lỗi bundle** (`anc-ep04/voiceenv`): dùng entry riêng; **bundle chép cả public**: dùng `--public-dir`.
7. **Heredoc dài trong shell bị lỗi:** ghi file bằng công cụ ghi file, không dán script dài qua `bash`.
8. Chữ phông Google (Playfair Display) tải lúc render qua `@remotion/google-fonts`, cần có mạng.

## 8. Mở rộng
- **Đèn/lửa theo nhạc mạnh hơn:** tăng hệ số `band(...)` trong `Lights` (hiện cố ý thấp để không lộ).
- **Cảnh phụ L2/L3:** tạo ảnh, làm lại bước 2 cho từng cảnh (chuyển mờ giữa video ~5 phút); hoặc đổi cặp ảnh để làm series Reels.
- **Bản dài 1-3 giờ:** nối nhiều lần đoạn 10 phút bằng ffmpeg concat (video đã mờ vào/ra ở hai đầu) và thêm nhạc dài; không cần render lại Remotion.
- **Bản Reels ngang:** cắt 20s đầu của bản ngang (mở đầu poster rất hợp làm mồi).
- **Đổi chủ đề** (mưa, mùa thu, cabin tuyết): giữ nguyên bước 1-5, đổi prompt và hiệu ứng (`Snow`, `Flames`).
- Ý đã cân nhắc nhưng chưa làm: thanh nhạc/vòng tròn (bị loại vì che mèo và lò sưởi), mưa trên cửa sổ, mực loang (xem phần phân tích trong cuộc trò chuyện; demo khói theo nhạc có ở `demo-project/src/smoke-demo/`).

## 9. Bản đồ file
| Việc | File |
|---|---|
| Composition dọc / Reels | `demo-project/src/xmas-cat/` (`Video.tsx`, `index.ts`) |
| Composition ngang | `demo-project/src/xmas-cat-wide/` (`Video.tsx`, `index.ts`, `features.json`) |
| Ảnh nguồn + prompt | `content/xmas-cat/`, `content/xmas-cat-wide/` (`master.png`, `assets_*.csv`, `crops.json`, biến thể, ảnh cắt) |
| Chuẩn bị tài nguyên | `scripts/xmas_prepare.py`, `scripts/xmas_check_variants.py` |
| Âm thanh | `scripts/gen_xmas_sfx.py`, `gen_xmas_wide_sfx.py`, `gen_xmas_intro_sfx.py`; nhạc ghép bằng ffmpeg (mục 3) |
| Đặc trưng nhạc | `scripts/smoke_features.py` |
| Demo khói theo nhạc | `demo-project/src/smoke-demo/` |
| Nhớ trạng thái | [TIEP_TUC_LAM.md](TIEP_TUC_LAM.md) |
