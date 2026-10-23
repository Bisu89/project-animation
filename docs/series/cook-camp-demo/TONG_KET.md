# Thử nghiệm animation 2D từ ảnh AI: nấu ăn (cook-ep01) và camping (camp-demo)

Ngày chốt: 2026-10-23. Trạng thái: **chưa đạt**, dừng lại để quyết định hướng đi. File này là bản tổng kết để làm tiếp.

## Mục tiêu
Làm video kiểu "anime cooking ASMR" (video mẫu: Garlic Butter Steak, Pineapple Fried Rice): mỗi cảnh có hành động thật (tay, nguyên liệu rơi, hơi nóng), không chỉ ảnh tĩnh. Điều kiện: dùng Remotion điều khiển bằng code, ảnh tạo bằng ChatGPT Plus, không dịch vụ video AI trả phí. Máy làm việc chỉ có card Intel; máy nhà có RTX 3060 Ti, 32GB RAM.

## Đã làm

### 1. cook-ep01: video nấu cơm chiên 15s, 9:16
- 10 ảnh ChatGPT thống nhất phong cách (bếp, bát hoa xanh, chảo). Composition `CookEp01`: Ken Burns + hơi nước, tia lửa, bụi sáng, lửa gas (SVG/CSS), SFX tự sinh (`scripts/gen_cook_sfx.py`).
- **Kết quả: thất bại.** 9/10 cảnh thực chất là ảnh phẳng zoom chậm. Hiệu ứng phủ lên ảnh phẳng không tạo ra hành động.
- Cảnh s07 (đổ cơm) làm riêng bằng sprite tách nền xanh (`Play07.tsx`): bát nghiêng, hạt cơm rơi theo quỹ đạo, thìa khuấy. Chạy tốt nhất trong bộ, nhưng mới 1/10 cảnh.
- Có sẵn "móc" để thay cảnh bằng clip image-to-video (`public/cook-ep01/clips/sNN.mp4` + `scripts/cook_clips.py`); chưa có clip nào.

### 2. camp-demo: cảnh camping bên hồ, 10s, 16:9
- Bản 1: SVG hình học (placeholder). Chuyển động mượt (IK 2 đoạn, bezier, cốc gắn vào tay không nhảy) nhưng hình quá đơn giản.
- Bản 2: ảnh minh họa AI. Nền = ảnh tổng thể đã duyệt (master) đã xóa người/ghế/cốc; người dựng lại từ layer (thân, đầu mở/nhắm mắt, cánh tay trên, cẳng tay, bàn tay mở/nắm, bàn, cốc). Thêm hơi nước theo miệng cốc, thở, chớp mắt, ánh đèn lều, **nước hồ dao động theo dải ngang**.
- **Kết quả: chưa ổn** (nhận xét của chủ dự án). Tay vẫn lộ là mảnh ghép; lá, cỏ, vải lều không chuyển động vì nằm trong ảnh nền.

## Bài học (quan trọng nhất)
1. **Ảnh phẳng + hiệu ứng phủ ≠ animation.** Chuyển động chỉ thật khi vật di chuyển là layer riêng.
2. **ChatGPT không giữ vị trí/tỉ lệ khi sửa cả khung lớn.** Lần tạo 15 layer đầy đủ bị hỏng (người to gấp 1,5 lần, bàn nổi trên nước). Cách làm được: **cắt vùng nhỏ từ ảnh tổng thể, sửa trên ảnh cắt** (`content/camp-demo/crops/camp_crop.png`, 600×400), rồi đo lại kích thước từng mảnh bằng code. Đầu bị vẽ to gấp 2,5 lần, tay gấp 2–3 lần: luôn phải đo và co lại, không tin kích thước.
3. **Nền xanh (#00FF00) để tách, magenta cho vật màu xanh lá.** ChatGPT không cho alpha thật. Mỗi lần tạo nền sạch, nó có thể xóa luôn cả vật phải giữ (nền K0 xóa cả cái bàn dù đã dặn giữ).
4. **Kiểm tra tầm với trước khi tạo ảnh.** Trong ảnh gốc, cốc xa hơn tầm tay (230px so với tay ~135px). Phải dời người 125px để với tới. Làm bước này trước khi tạo layer.
5. **Kiểm tra số bắt được lỗi mắt khó thấy** (cẳng tay gập ngược sát vai khi nhấc cốc). Chạy `check.ts` sau mỗi lần đổi đường đi của tay.
6. Prompt tốt: quy trình theo từng lượt (A: danh sách asset + prompt, B: khung tĩnh để duyệt, C: animation), kèm tiêu chí đo được. Xuất CSV prompt (định dạng `assets_action.csv` của zs) mỗi khi cần tạo ảnh.

## Còn thiếu / lỗi đã biết
- camp-demo: vai còn mảng tối nhỏ ở mép tay áo; cổ tay gập mạnh khi giữ cốc; bàn tay nắm chỉ là 1 ảnh; chưa có lá/cỏ/vải lều lay (cần tách layer); chưa có âm thanh; nước dao động nhẹ (0,8–4px), chưa xem chạy liên tục.
- cook-ep01: 9/10 cảnh còn là ảnh phẳng.
- Chưa thử image-to-video trên 3060 Ti (LTX-Video / Wan 2.2 5B trong ComfyUI), vốn là hướng hợp với phong cách sơn dầu nhất.

## Hướng làm tiếp (đề xuất, chưa quyết)
1. **Cảnh có chất lỏng/hơi nước/nguyên liệu (nấu ăn):** thử AI image-to-video trên máy 3060 Ti với 1 cảnh (s05, đổ trứng) rồi mới nhân ra. Prompt chuyển động đã có ở `content/cook-ep01/motion_prompts.txt`; Remotion chỉ ghép clip + SFX.
2. **Cảnh vật rắn, ít chuyển động (camping):** giữ hướng layer + crop-edit, nhưng chốt trước kiểm tra tầm với, và tạo layer lá/cỏ/lều riêng nếu muốn gió thổi.
3. Không tiếp tục tách layer cho cả 10 cảnh nấu ăn: tốn công, mép ghép lộ với phong cách sơn dầu.

## Bản đồ file
| Việc | File |
|---|---|
| Composition nấu ăn | `demo-project/src/cook-ep01/` (`scenes.ts`, `Video.tsx`, `Play07.tsx`) |
| Prompt ảnh/chuyển động nấu ăn | `content/cook-ep01/` (`prompts.txt`, `assets_action.csv`, `motion_prompts.txt`) |
| Sprite s07 | `content/cook-ep01/sprites/`, `scripts/cook_sprites.py` |
| SFX bếp | `scripts/gen_cook_sfx.py` |
| Cảnh camping | `demo-project/src/camp-demo/` (`Scene.tsx`, `rig.ts`, `motion.ts`, `check.ts`, `rig.json`, `water.json`) |
| Ảnh/prompt camping | `content/camp-demo/` (`assets_crops.csv`, `crops/`, `layers/master.png`) |
| Pipeline camping | `scripts/camp_export.py` (xuất layer), `camp_water.py` (mặt nạ nước), `camp_build.py` (khung tĩnh so ảnh gốc), `_camp_crop_csv.py` (tạo ảnh cắt + CSV) |
| Ảnh duyệt khung tĩnh | `content/camp-demo/preview/static_master_vs_reach.png` |

## Lệnh
```
cd demo-project
npx remotion studio                         # xem CookEp01, CampDemo
npx remotion render CampDemo ../renders/camp-demo.mp4 --port=3482
npx remotion render CookEp01 ../renders/cook-ep01.mp4 --port=3477
python scripts/camp_export.py && python scripts/camp_water.py    # xuất lại layer camping
```
Cổng mặc định 3411 trong `remotion.config.ts` hay bị chiếm: thêm `--port`.
Kiểm tra số cho tay/cốc: `npx tsc --outDir <dir> --module commonjs --target es2020 --skipLibCheck --resolveJsonModule --esModuleInterop src/camp-demo/check.ts && node <dir>/check.js`.

## Không đưa vào git (chỉ có trên máy)
Các lần tạo ảnh bị loại (`*-rejected`, `M0-option-*`, `M0-v2-*`, layer toàn khung lần đầu ở `content/camp-demo/layers/` và `public/camp-demo/layers/`), `demo-project/public/cook-ep01/images-backup-*`, video render (`renders/`).
