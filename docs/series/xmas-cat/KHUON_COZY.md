# Khuôn `cozy-scene`: làm một cảnh "cozy night" mới chỉ bằng ảnh + một file JSON

Ngày: 2026-10-27. Thay việc sửa tay `Video.tsx` cho từng cảnh (xem [CACH_LAM.md](CACH_LAM.md)). Kế hoạch series: [KE_HOACH_SERIES_REELS.md](KE_HOACH_SERIES_REELS.md).

## 1. Khuôn là gì

- Mã: `demo-project/src/cozy-scene/` (`CozyScene.tsx` = engine, `types.ts` = kiểu cấu hình, `scenes/<id>.json` = cấu hình từng cảnh, `registry.ts` = danh sách cảnh, `index.ts` = entry Remotion).
- Mỗi cảnh tự đăng ký 2 composition: `<id>-reel` (cắt Reels, kèm tiêu đề đầu và thẻ kết YouTube nếu config có `reel`) và `<id>-full` (cắt dài, không chữ). Độ dài trong `registry.ts` (`timing`, đơn vị giây).
- Mọi toạ độ trong JSON tính theo **pixel của ảnh master** (ảnh ChatGPT), không phải pixel video.
- Các lớp đều **tùy chọn**: `fire`, `glows`, `snow`, `steam`, `lights`, `candles`, `creature`, `audio`, `reel`. Cảnh không có lửa thì bỏ `fire` và `glows`.
- **Đã kiểm chứng:** tái tạo cảnh dọc (`xmas-cat.json`) và cảnh ngang (`xmas-cat-wide.json`) bằng khuôn rồi so từng pixel với bản gốc: cảnh ngang sai khác trung bình 0,01/255; cảnh dọc 0,26/255 (khác ở ngọn lửa, vì khuôn dùng nhiễu đứng yên như bản ngang, và vài hằng số tuyết). Khuôn **chưa có** đoạn mở đầu poster 15,6 giây của bản ngang (vẫn ở `src/xmas-cat-wide/`).

## 2. Quy trình một cảnh mới (≈ 1 giờ khi đã quen)

```
cd scripts
python cozy_new.py <id> portrait            # hoặc wide; tạo scenes/<id>.json, content/<id>/, đăng ký registry
#  -> mở content/<id>/assets_master.csv, điền mô tả, tạo ảnh master trong ChatGPT, lưu content/<id>/master.png
#  -> sửa scenes/<id>.json cho đúng ảnh (mục 3)
python cozy_crops.py <id>                   # cắt ảnh cần sửa + viết content/<id>/assets_variants.csv (prompt sẵn)
#  -> ChatGPT: mỗi dòng đính kèm ảnh cắt, dán prompt, lưu kết quả với tên cột image_filename vào content/<id>/
python cozy_check.py <id>                   # đo độ lệch; shift (0,0) mới dùng; xóa _sbs_*.png sau khi xem
python cozy_prepare.py <id> <thu_muc_render>   # thu ảnh về 2x hộp cắt, chép vào public/<id> và thư mục render
python cozy_sfx.py <id> 47                  # tiếng lửa + gió, dài >= video (giây)
#  -> chép nhạc vào demo-project/public/<id>/music.mp3 (và vào thư mục render)
python smoke_features.py <nhac.mp3> ../demo-project/src/cozy-scene/<id>_features.json   # chỉ nếu muốn đèn theo nhạc
cd ../demo-project
npx remotion still src/cozy-scene/index.ts <id>-reel ../renders/x.png --frame=300 --public-dir=<thu_muc_render>   # xem thử
npx remotion render src/cozy-scene/index.ts <id>-reel ../renders/<id>-reel.mp4 --public-dir=<thu_muc_render> --crf=18 --concurrency=3 --port=3498
```
`--public-dir` là bắt buộc trên máy này: render mặc định chép cả `public/` của mọi series và từng lỗi `ENOENT`. Cổng hay bị chiếm: đổi `--port`.

Muốn đèn theo nhạc: import file features trong `registry.ts` (như `wideFeatures`), gán vào `features:` của cảnh, và đặt `lights.react` > 0 (ví dụ 0.5; 0 = tắt).

## 3. Cách đo toạ độ cho ảnh mới

Mở `master.png` trong trình xem ảnh bất kỳ (Paint/Photos có hiển thị toạ độ con trỏ) và đọc (x, y):
- `master.w/h`: kích thước ảnh. `view.out`: `[1080,1920]` Reels hoặc `[1920,1080]` YouTube. Ảnh ChatGPT ngang là 3:2: đặt `view.crop` = vùng 16:9 muốn giữ, ví dụ `{x:0,y:70,w:1536,h:864}`; ảnh dọc không cần `crop`.
- **`fire`:** `base` = y của đáy ngọn lửa (nơi lửa mọc ra từ củi, thường thấp hơn phần củi nhìn thấy một chút); `area` = hộp chứa cả ngọn lửa (cao quá đỉnh lửa cũ); `tongues` = danh sách `[x, rộng, cao]` của từng lưỡi lửa, dải đều qua bề rộng lò sưởi, cao nhất ở giữa; `plate` = hộp cắt lò sưởi để sửa (xem `cozy_crops.py`). `mask: "right"` hoặc `"both"` làm mờ mép khung lửa.
- **`glows`:** hai vệt sáng (to nằm trên sàn quanh lò, nhỏ nằm trên thú); chỉnh `box`, `base`, `amp`.
- **`snow.rect`:** đúng khung kính cửa sổ (tuyết bị cắt ngoài hộp này). `count` 70-80.
- **`steam`:** `x, y` = miệng cốc (điểm bắt đầu), `rise` = độ cao khói, `spread`, `count`.
- **`lights.regions`:** `tree` (hình tam giác cho cây thông: `axisX`, `topY`, `height`, `halfTop/halfBottom`), `line` (dây đèn từ điểm này tới điểm kia, `wave` nhấp nhô). Cộng `count` bóng đèn mỗi vùng.
- **`candles.points`:** tâm từng ngọn nến/đèn lồng.
- **`creature`:** `breath.origin` = đường bụng (tâm co giãn), `breath.body` = hộp bao thân thú; `patches` = các biến thể (mắt/tai/đuôi hoặc thứ gì tùy ý): `box` (hộp cắt, **rộng hơn vật sẽ chuyển động**), `from` (file ChatGPT), `src` (tên trong public), `events` (`{times:[...]}` hoặc `{every, first, seed}`), `env` = [vào, giữ, ra] giây, `prompt` (câu "CHANGE ONLY ...").
- **`camera`:** `zoom` và `origin` kiểu `linear` (từ-đến theo độ dài video, hợp Reels) hoặc `sine` (nhịp nhàng, hợp bản dài); `fade` = khung hình mờ vào/ra.
- **`reel`:** chữ tiêu đề đầu và thẻ kết cho Reels (chữ nằm trong vùng an toàn).

## 4. Mẹo
- Ba vùng **lò sưởi / thú / cửa sổ tách rời** trong ảnh master để sửa từng vùng không dính nhau.
- Luôn `cozy_check.py` trước khi dùng; lệch khác (0,0) thì tạo lại ảnh đó. Ảnh biến thể chỉ đổi đúng chi tiết nhỏ.
- Thử nhanh một khung bằng `remotion still` trước khi render cả đoạn; so với ảnh master xem lửa/khói/tuyết có đúng chỗ không.
- Dựng 2-3 tập từ cùng một cảnh bằng cách đổi `camera`, `events`, ánh sáng (`glows`) và `reel` (chữ), không cần ảnh mới; nhưng nội dung gần giống nhau nhiều tập có rủi ro bị coi là lặp (xem mục 6 của KE_HOACH_SERIES_REELS).

## 5. Giới hạn hiện tại (việc có thể làm tiếp)
- Chưa có đoạn mở đầu poster (glitch, zoom xuyên tâm, viền giấy) trong khuôn: còn ở `src/xmas-cat-wide/Video.tsx`; có thể chuyển thành `intro` tùy chọn của config.
- Chưa có lớp mưa/sấm chớp, bụi sáng trong tia nắng, đèn neon: thêm thành lớp mới trong `CozyScene.tsx` và khai báo kiểu trong `types.ts`.
- Chỉ có lửa kiểu lò sưởi (lưỡi lửa bezier); lửa trại, nến, bếp lò cần chỉnh `base`/`tongues`/`area` (đã đủ cho bếp lò) hoặc thêm kiểu mới.
- Mỗi ảnh biến thể vẫn cần bạn tạo bằng ChatGPT; khuôn chỉ lo cắt, kiểm tra, ghép và dựng.

## 6. Bản đồ file
| Việc | File |
|---|---|
| Engine | `demo-project/src/cozy-scene/CozyScene.tsx`, `types.ts` |
| Danh sách cảnh | `demo-project/src/cozy-scene/registry.ts` |
| Cấu hình cảnh | `demo-project/src/cozy-scene/scenes/*.json` (`xmas-cat`, `xmas-cat-wide`) |
| Tạo cảnh mới | `scripts/cozy_new.py` |
| Cắt ảnh + prompt | `scripts/cozy_crops.py` -> `content/<id>/assets_variants.csv` |
| Đo ảnh | `scripts/cozy_check.py` (dùng `xmas_check_variants.py`) |
| Chuẩn bị render | `scripts/cozy_prepare.py` |
| Âm thanh | `scripts/cozy_sfx.py`, `scripts/smoke_features.py` |
| Hàm dùng chung | `scripts/cozy_lib.py` |

## 7. Prompt ảnh master cho 8 cảnh đầu
`content/cozy-series/assets_masters.csv` (tạo bằng `scripts/_cozy_series_prompts.py`): S1 attic-cat, S2 windowseat-cat, S3 porch-dog, S4 tent-dog, S5 bakery-cat, S6 library-owl, S7 barn-reindeer, S8 train-fox. Cùng một khối phong cách + luật bố cục (thú ngủ to ở nửa dưới, ba vùng tách rời, đầu khung tối cho tiêu đề, đáy trống cho vùng giao diện Reels). Cột `notes` ghi lớp nào dùng và cần ảnh biến thể gì. Làm một cảnh: tạo 3 phương án -> `python scripts/cozy_new.py <id> portrait` -> lưu `content/<id>/master.png` -> mục 2.

**Cảnh có nhân vật nữ (theo phong cách Tokyo lo-fi, CACH_LAM.md mục 4c):** thêm 6 dòng G1-G6 vào cùng file: tokyo-window (cô gái + mèo ở bậu cửa sổ, bản dọc của K1), kotatsu-sleep, konbini-bench, nabe-table, balcony-blanket, attic-reading. Phong cách cel anime 90s (nét mảnh, tô phẳng, màu dịu), **cùng một nhân vật** (tóc bob đen ánh xanh, kẹp sao, áo len kem, khăn đỏ, tai nghe trắng) và mèo cam: mỗi lần tạo **đính kèm `content/xmas-tokyo/closeup.png` (hoặc `master.png`) làm ảnh tham chiếu** để mặt/quần áo giữ nguyên. Luật bố cục: 25% trên trống (chữ), 12% dưới trống, mặt nhân vật rõ trong dải 30-70% chiều cao. Biến thể: chớp mắt, cười nhẹ (khi đang ngủ thì cười/nhăn nhẹ), tai mèo. Các hiệu ứng riêng của Tokyo (biển neon/đèn phố/đèn phòng sáng theo nhạc, nhân vật lắc nhẹ bằng bản đồ uốn) hiện nằm ở `src/xmas-tokyo/Video.tsx`, **chưa** có trong khuôn `cozy-scene`.

## 8. Trạng thái series (2026-10-27)
- 14 ảnh master đã tạo, nằm ở `content/xmas-tokyo/<id>/master.png`; mỗi cảnh có JSON trong `src/cozy-scene/scenes/` (sinh bằng `scripts/_cozy_make_scenes.py`, toạ độ đọc từ ảnh) và đã đăng ký trong `registry.ts`. Đã render khung thử cả 14: tuyết, khói, đèn, nến đúng chỗ.
- Lớp lửa (tent-dog, bakery-cat, library-owl) và mọi biến thể (mắt, tai, đuôi, chớp, cười) đang `enabled: false` vì chưa có ảnh ChatGPT: chạy `python scripts/cozy_crops.py <id>` để cắt ảnh + sinh prompt, tạo ảnh, `cozy_check.py`, rồi đổi `enabled`. Trong lúc chờ, cảnh vẫn dựng được (tuyết, khói, đèn, ánh lửa; lửa vẽ sẵn trong ảnh giữ nguyên).
- `python scripts/cozy_batch.py <thu_muc>` chuẩn bị tài nguyên + nhạc (khóa `_music` trong JSON) cho tất cả cảnh vào một thư mục render. Render một cảnh: `npx remotion render src/cozy-scene/index.ts <id>-reel ../renders/<id>.mp4 --public-dir=<thu_muc>`.
- Đã render thử đủ 45s: `reel-tokyo-window.mp4`.

**Tất cả prompt biến thể gộp một file:** `content/cozy-series/assets_variants_all.csv` (40 dòng; cột `attach` = ảnh cắt cần đính kèm, `save_as` = tên và thư mục lưu kết quả). Sinh lại bằng `cozy_crops.py <id>` cho từng cảnh rồi gộp.
