# Template: làm một tập mới của series trận đánh cổ đại

Tài liệu tự đủ để làm việc ở máy hoặc phiên khác. Tập mẫu đã làm xong khung: Thermopylae (`anc-ep01`). Phong cách học từ video tham chiếu: xem PHAN_TICH_VIDEO_THAM_CHIEU.md ở cùng thư mục. Trạng thái hiện tại: TIEP_TUC_LAM.md.

Nguyên tắc chung: chat tiếng Việt, video và tài liệu trong video bằng tiếng Anh. Kịch bản phải được chủ dự án duyệt trước khi làm giọng, ảnh. Chủ dự án tự gen ảnh từ CSV mình viết; mình không gen ảnh.

## 0. Môi trường (Windows, Git Bash)
- Node + Remotion trong `demo-project/` (`npm install` một lần). Kiểm tra bằng `cd demo-project && npx tsc --noEmit` trước mỗi lần render (`noUnusedLocals` bật).
- Python 3.9 có `edge-tts>=7.3.1` (bản 7.2.8 bị HTTP 403), `numpy`, `Pillow`.
- ffmpeg trong PATH. Render: `npx remotion render <Id> out/<ten>.mp4 --props='{...}'`.
- Dùng công cụ Write cho file Python/JS nhiều dòng; heredoc bash có chứa dấu nháy hoặc `\n` hay hỏng. Python trên Windows ghi `\n` thành CRLF nếu không có `newline="\n"`.
- Ảnh, video, âm thanh KHÔNG commit (.gitignore đã chặn: `*.mp4 *.wav *.mp3`, `content/anc-*/images/`, `content/anc-*/action/`, `demo-project/public/anc-*/{images,action,.voice_cache}/`).

## 1. Bản đồ file
| Việc | File |
|---|---|
| Kịch bản | `content/<slug>/script.md`, ghi chú nguồn `sources.md` |
| Style ảnh dùng chung | `content/anc-style.txt` |
| Kế hoạch hình cho từng cảnh | `content/<slug>/plan.py` (đọc bởi `scripts/anc_plan.py`) |
| Danh sách ảnh để gen | `content/<slug>/scenes.csv` (sinh tự động) |
| Giọng + timeline | `scripts/gen_voice.py` → `public/<slug>/voice.wav`, `src/<slug>/timeline.*` |
| Cảnh/sprite hành động | `scripts/prep_sprites.py`, `content/<pilot>/assets_action.csv`, `src/anc-pilot1/ActionSprites.tsx` |
| Bộ vẽ sơ đồ | `src/anc-lib/kit.tsx`; sơ đồ của từng tập: `src/<slug>/Diagrams.tsx` |
| Ráp video | `src/<slug>/Video.tsx` (+ `KenBurns.tsx`, `Fx.tsx`, `cues.ts`, `sfxplan.ts`) |
| Dựng khung tập mới | `scripts/new_anc_episode.py` |

## 2. Công thức tập (rút từ video tham chiếu, giữ nguyên cho mọi tập)
1. Mở bằng cảnh gay cấn nhất, 30–60 giây, không chào hỏi. Nói trước kết quả, rồi đặt câu hỏi "vì sao".
2. Quay lại bối cảnh, mỗi bước là một nhân quả. Mỗi chương một bất ngờ nhỏ.
3. Có một phần "giải thích cơ chế" thật sự (hình học địa hình, hậu cần, vì sao kế hoạch hỏng). Đây là chỗ không trùng với các kênh kể lại.
4. Có một luận điểm xuyên suốt, nhắc lại ở đầu, giữa và kết (tập 1: "đếm số người chạm được nhau, và đếm những con đường không ai canh").
5. Văn: câu ngắn, thì hiện tại, số cụ thể, 4–5 câu đùa khô, một lời kêu gọi subscribe gắn vào câu đùa.
6. Nguồn: tách rõ điều chắc chắn / điều hậu thế thêm / điều tự phân tích. Câu tự phân tích dùng "may", "look at it as", không nói như sự thật. Ghi mọi thứ vào `sources.md`.
7. Độ dài: càng dài càng tốt (tập 1 gần 20 phút, 3.540 từ ≈ 150 từ/phút).
8. Chia đoạn ngắn (1–2 câu) để cảnh đổi nhịp; `anc_plan.py` gộp đoạn thành cảnh khoảng 10 giây.

## 3. Quy trình từng bước
**Bước 1. Dựng khung.**
`python scripts/new_anc_episode.py --slug anc-ep02 --id AncEp02 --title "Cannae: ..."`. Lệnh này tạo thư mục nội dung, copy file Remotion, đăng ký composition trong `Root.tsx`. `tsc` sẽ báo thiếu `timeline/scenes/visuals` cho đến khi xong bước 3 và 4, bình thường.

**Bước 2. Viết kịch bản + nguồn.** `content/<slug>/script.md` (dòng `#` là tiêu đề, `##` là chương, dòng trống tách đoạn; chương hiện thành tiêu đề serif trên hình). Gửi chủ dự án duyệt.

**Bước 3. Giọng đọc.**
```
python scripts/gen_voice.py --script content/<slug>/script.md --out demo-project/public/<slug> --timeline-out demo-project/src/<slug> --rate=-4% --para-pause 0.5
python scripts/voice_env.py --slug <slug>
```
Giọng en-US-GuyNeural. 3.500 từ mất vài phút (có cache từng câu). Sửa một câu chỉ tổng hợp lại câu đó. Cần mạng.

**Bước 4. Kế hoạch cảnh.**
1. Điền `content/<slug>/plan.py` với `P = {}` rỗng, chạy `python scripts/anc_plan.py --slug <slug>` một lần để xem số cảnh (nó sẽ báo "missing [...]"; dùng `python scripts/build_scenes.py --slug <slug> --target 10 --min-s 5 --style-file content/anc-style.txt` để đọc danh sách cảnh và lời thoại từng cảnh).
2. Gán hình cho từng cảnh trong `P` (xem định dạng trong `content/anc-ep01/plan.py`): `img` (ảnh mới), `pilot` (dùng lại ảnh tập mẫu), `same` (lặp ảnh cảnh khác), `act` (hoạt hình sprite), `diag` (sơ đồ SVG).
3. Chạy lại `python scripts/anc_plan.py --slug <slug>`. Chỉ chạy lệnh này, không chạy `build_scenes.py` riêng (nó sẽ đặt lại prompt cho cảnh dùng lại).
Tập 1 (100 cảnh, ~20 phút): 47 ảnh mới, 18 dùng lại, 9 lặp, 5 sprite, 21 sơ đồ. Mục tiêu 40–55 ảnh mới mỗi tập 20 phút.

**Bước 5. Chủ dự án gen ảnh.** Cho chủ dự án `content/<slug>/scenes.csv`: chỉ các dòng có `image_prompt` không rỗng. Lưu `demo-project/public/<slug>/images/sceneNN.png`. Ảnh giữ chỗ tạo bằng PIL cho tới khi có ảnh thật. Nhân vật lặp lại: dán mô tả cố định vào prompt, và dùng ảnh trước đó làm ảnh tham chiếu.

**Bước 6. Sprite hành động (chỉ khi cần).** Sao chép `content/anc-pilot1/assets_action.csv` làm mẫu, đổi nhân vật. Chủ dự án gen: nền trống 16:9 (không có người), từng tư thế nhân vật nhìn nghiêng sang phải trên nền xanh lá #00FF00, hai tư thế bước chân ngược nhau cho đi/chạy, thêm tư thế đâm/trúng đòn/ngã. Chạy `python -W ignore scripts/prep_sprites.py --slug <slug>`: nó tách nền xanh, cắt sát nhân vật, chuẩn hóa kích thước theo họ nhân vật, ghi `src/<slug>/sprites.ts`. Cảnh ghép nằm trong `ActionSprites.tsx`: lật hai tư thế bước chân + nhún; đòn va chạm đổi tư thế (thrust, hit, fall).

**Bước 7. Sơ đồ.** Trong `src/<slug>/Diagrams.tsx` dùng bộ `src/anc-lib/kit.tsx`: `Paper` (nền giấy cát + hạt + vignette), `Card` (nhãn thẻ giấy chữ Cinzel), `Unit` (khối quân đỏ), `Dot` (quân địch), `Arrow`, `Ship`, `bez`, `ease`. Một sơ đồ là component nhận `{ stage }`, nhiều cảnh dùng lại với stage khác nhau (xem D1–D5 ở tập 1). Màu: Hy Lạp đỏ #b3262e, Ba Tư xanh #2c5aa0, vàng #d8a93c, biển #8fb3c4, đất #c9b27c, đá #6f5f4e.

**Bước 8. Kiểm tra.** Render vài khung trước khi render cả tập:
`npx remotion still <Id> out/x.png --frame=N --props='{"music":0,"sfx":0,"voice":"","captions":false}'`. Xem tất cả sơ đồ (chữ chồng nhau là lỗi hay gặp), vài cảnh sprite, khung có phụ đề.

**Bước 9. Render.**
`cd demo-project && npx remotion render <Id> out/<slug>.mp4 --props='{"music":0,"sfx":0,"voice":"voice.wav","captions":true}'`
(35.000 khung ≈ 20 phút video mất vài chục phút). Kiểm tra: `python ../scripts/check_render.py out/<slug>.mp4`.

**Bước 10. Ghi lại.** Cập nhật `TIEP_TUC_LAM.md`, commit chỉ mã nguồn và văn bản.

## 4. Mẫu prompt ảnh
Tiền tố style (đã nằm sẵn trong từng dòng CSV, lấy từ `content/anc-style.txt`):
> 2D cartoon history-documentary illustration, wide 16:9. Thick, even dark ink outlines. Characters have big heads on small bodies with thin stick-like arms and legs, large round white eyes with tiny black pupils. Flat colour fills with soft gradient shading and subtle painted texture. Layered backgrounds, muted desaturated palette, warm orange firelight or embers as the only bright accent. Keep the bottom 15 percent calm and uncluttered. No photorealism, no 3D, no text, no letters, no numbers, no watermark.

Cấu trúc một prompt cảnh: [nơi chốn + giờ trong ngày] + [ai làm gì, nét mặt] + [chi tiết vật] + [ánh sáng]. Nhân vật cố định (dán lại mỗi lần): *Leonidas: big-headed bearded Spartan king, bronze Corinthian helmet with tall red crest, red cloak. Xerxes: big-headed Persian king, curly dark beard, tall golden crown cap, blue and gold embroidered robe.*

Prompt sprite nhân vật: "Single character sprite for 2D cut-out animation, same style as the reference. Strict SIDE VIEW facing RIGHT, full body, feet near the bottom, figure fills about 80 percent of the frame height, flat uniform bright green (#00FF00) background with no shadow or ground. [mô tả] [tư thế, ghi rõ chân nào đưa ra trước]."
Prompt nền: "Wide 16:9 EMPTY background plate... ABSOLUTELY NO people... large calm empty strip of flat ground across the lower third."

## 5. Bẫy đã gặp
- Ảnh AI đẹp hơn nhân vật vector của engine; đừng trộn hai kiểu trong một tập. Chuyển động nhân vật làm bằng sprite AI, không phải rig vector (`src/anc-pilot1/Action.tsx` là bản vector cũ, giữ để tham khảo).
- Chạy `build_scenes.py` riêng ghi đè prompt sai: luôn dùng `anc_plan.py`.
- Đổi kịch bản sau khi có giọng: phải chạy lại `gen_voice.py` rồi `anc_plan.py`; số cảnh dịch chuyển, `plan.py` phải sửa lại.
- Lính ngã trong cảnh sprite chồng một chỗ: tách vị trí `xc` mỗi đợt.
- Chữ trong thẻ sơ đồ tràn khung: rộng thẻ tính theo số ký tự, giảm cỡ chữ cho chuỗi dài.
- Hình trong video dùng "Herodotus" nên nghe thử phát âm tên riêng trước khi duyệt (danh sách trong `sources.md`).

## 6. Việc chưa làm (cho các tập sau)
- Nhạc nền và SFX (chủ dự án chọn bỏ qua ở tập 1).
- Nhãn chữ trên hình kiểu "thẻ giấy" đã có cho sơ đồ, chưa có cho ảnh AI.
- Đặt tên series, kênh, thumbnail.
