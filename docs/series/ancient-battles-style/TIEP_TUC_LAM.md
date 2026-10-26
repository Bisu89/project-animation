# "The Ground Decides": đọc file này đầu tiên khi mở phiên mới

Series YouTube tiếng Anh về các trận đánh cổ đại, giải thích bằng địa hình và hình học chiến trường. Tên series: **The Ground Decides** (tagline: "Ancient battles, explained by the ground they were fought on"). Chat bằng tiếng Việt, lời bình và chữ trong video bằng tiếng Anh. Repo: `C:\Users\hoavx\Desktop\stickman-video`, nhánh `main`.
Cập nhật 2026-10-26. Tài liệu đi kèm: `TEMPLATE_LAM_TAP_MOI.md` (công thức từng bước làm một tập), `PHAN_TICH_VIDEO_THAM_CHIEU.md` (phân tích video gốc, cơ sở của phong cách).

## 1. Hiện trạng (tất cả đã render, có nhạc và SFX)
| Mục | Trạng thái |
|---|---|
| Tập 1 Thermopylae | 19:39, 100 cảnh. `out/anc-ep01.mp4`, composition `AncEp01`, kịch bản `content/anc-ep01/` |
| Tập 2 Cannae | 17:45, 89 cảnh. `out/anc-ep02.mp4`, `AncEp02`, `content/anc-ep02/` |
| Tập 3 Alesia | 16:58, 83 cảnh. `out/anc-ep03.mp4`, `AncEp03`, `content/anc-ep03/` |
| 3 short dọc (1 short mỗi tập, ~45 giây) | `out/anc-short01..03.mp4`, composition `AncShort01..03`, kịch bản `content/anc-short01..03/script.md` |
| Bản mở đầu thử 1:45 | `AncPilot1` (chỉ để tham khảo, không đăng) |
| Gói đăng YouTube (đã có file title/mô tả) | xem mục 5 |
| Tập 4 | chưa bắt đầu (gợi ý: Marathon hoặc Gaugamela) |

Chưa làm được / chưa kiểm chứng:
- Chưa nghe bằng tai: phát âm tên riêng (Vercassivellaunus, Critognatus, Mandubii, Hasdrubal, Ephialtes, Anopaia...), cân bằng giọng/nhạc/hiệu ứng. Chỉnh bằng props `music` (đang 0,16) và `sfx` (đang 1) rồi render lại.
- Âm thanh do code tạo (không phải thu thật), nghe hơi "tổng hợp".
- Không biết tập/short nào đã đăng lên YouTube; chủ dự án tự quyết.
- Mô tả các short có câu "Full story... is on the channel": phải dán link tập đầy đủ sau khi đăng.

## 2. Quy tắc và sở thích của chủ dự án
- Kịch bản dài càng tốt (tập ~17–20 phút, ~3.000 từ), có phần **phân tích** chứ không chỉ kể lại; luận điểm xuyên suốt: không gian/địa hình quyết định số đông ("đếm số người chạm được nhau, và đếm những con đường không ai canh").
- Chủ dự án **tự gen ảnh** từ CSV mình viết (`scenes.csv`, `assets_action.csv`). Mình không gen ảnh. Ảnh tập 1–3 đủ và nằm trong `demo-project/public/anc-epNN/images/` (git bỏ qua, KHÔNG xóa: không tạo lại nhanh được).
- Khi chủ dự án dán một bản kịch bản khác (từ công cụ khác): đối chiếu với sử liệu, giữ khung/luận điểm/giọng của mình, lấy các điểm chính xác và cách nói thận trọng của bản kia, báo ngắn gọn chỗ đã sửa. Ghi mọi thứ vào `sources.md`.
- Chủ dự án muốn mình áp dụng thứ tốt rồi **làm tiếp pipeline không hỏi lại**; nêu nghi vấn ở cuối câu trả lời (xem memory `feedback_apply_without_asking`).
- Mỗi tập nên có nhiều cảnh động: sơ đồ SVG + cảnh sprite (xem mục 3).

## 3. Kiến trúc (cách mỗi tập được dựng)
Ba loại hình cho mỗi cảnh, chọn trong `content/<slug>/plan.py`:
- `img`: ảnh AI do chủ dự án gen (Ken Burns); `same`: dùng lại ảnh cảnh khác; `pilot`: ảnh tái sử dụng từ pilot.
- `act`: cảnh hoạt hình sprite (nền trống + sprite nhân vật nền xanh), code ở `src/<slug>/ActionSprites.tsx` (tập 3 dùng lại sprite tập 2 qua `src/anc-ep02/sprites.ts`).
- `diag`: sơ đồ SVG nhìn từ trên xuống, code ở `src/<slug>/Diagrams.tsx`, dùng bộ `src/anc-lib/kit.tsx` (Paper, Card, Unit, Dot, Arrow...). **Giữ mọi nhãn trên y≈860** vì phụ đề chiếm dải đáy.
Âm thanh: `scripts/gen_anc_sfx.py` (39 hiệu ứng dùng chung trong `public/anc-sfx/sfx/`), `scripts/gen_anc_music.py` (nhạc từng tập theo độ căng từng chương), quy tắc gắn theo câu trong `src/<slug>/sfxrules.json`, thành phần `src/anc-lib/Soundtrack.tsx`. Kiểm tra quy tắc: `python scripts/check_sfx_rules.py <slug>` (không dòng nào `NO MATCH`).
Short dọc: tái dùng `src/zs-shorts/ShortVideo.tsx` (cấu hình `shorts_anc.ts`; thẻ cuối `endBrand: "THE GROUND DECIDES"`; ảnh 16:9 lia ngang sau cửa sổ 9:16; hiệu ứng lấy từ `anc-sfx/sfx`).
File style ảnh theo cặp phe: `content/anc-style.txt` (Hy Lạp/Ba Tư), `anc-style-punic.txt` (La Mã/Carthage), `anc-style-gaul.txt` (La Mã/Gaul).

## 4. Làm một tập mới (tóm tắt, chi tiết trong TEMPLATE_LAM_TAP_MOI.md)
1. `python scripts/new_anc_episode.py --slug anc-ep04 --id AncEp04 --title "..."` (dựng khung; script **ghi đè** `script.md`/`sources.md` mẫu nên viết nội dung SAU lệnh này hoặc sao lưu trước).
2. Viết `content/anc-ep04/script.md` + `sources.md` (hook, câu hỏi "vì sao", phân tích, luận điểm nối tập trước, nguồn chắc chắn / hậu thế / tự phân tích). Gửi chủ dự án duyệt.
3. Giọng: `python scripts/gen_voice.py --script content/anc-ep04/script.md --out demo-project/public/anc-ep04 --timeline-out demo-project/src/anc-ep04 --rate=-4% --para-pause 0.5` rồi `python scripts/voice_env.py --slug anc-ep04`. Chia đoạn ≤55 từ trước khi tạo giọng. Cần mạng (edge-tts>=7.3.1).
4. Lập kế hoạch cảnh: xem số cảnh bằng `python scripts/build_scenes.py --slug anc-ep04 --target 10 --min-s 5 --style-file content/anc-style-<phe>.txt`, viết `plan.py`, rồi `python scripts/anc_plan.py --slug anc-ep04 --style-file content/anc-style-<phe>.txt`. **Không** chạy `build_scenes.py` riêng để ghi CSV (nó đặt lại prompt cho cảnh tái dùng).
5. Viết diagrams/ActionSprites của tập; đưa `scenes.csv` (các dòng có `image_prompt`) và `assets_action.csv` cho chủ dự án gen; tách nền sprite: `python -W ignore scripts/prep_sprites.py --slug anc-ep04 --no-placeholders`.
6. Nhạc/SFX: `gen_anc_music.py --slug anc-ep04 --intensity ...`, viết `sfxrules.json` (copy từ tập 3 rồi sửa), thêm `sfxplan.ts` (copy từ tập 3).
7. Kiểm tra bằng vài khung `npx remotion still AncEp04 ...`, rồi render: `cd demo-project && npx remotion render AncEp04 out/anc-ep04.mp4 --props='{"music":0.16,"sfx":1,"voice":"voice.wav","captions":true}'` (~1–1,5 giờ cho ~18 phút, chạy nền, đừng `taskkill node`). Kiểm tra: `python scripts/check_render.py out/anc-ep04.mp4`.
8. Short dọc: viết `content/anc-shortNN/script.md` (~125–135 từ), giọng như trên, thêm mục vào `shorts_anc.ts` và composition vào `Root.tsx`, render `AncShortNN`.
9. Viết file `_info.txt` (title, 2 tiêu đề phụ, mô tả có mốc chương, hashtag, tag, comment ghim; mốc chương lấy từ `start_s` đầu mỗi chương trong `scenes.csv`).

## 5. Thư mục đăng (trong `publish/`, git bỏ qua)
- `publish/ancient-battles/`: ep01_thermopylae, ep02_cannae, ep03_alesia (liên kết cứng tới bản trong `upload_batch_2026-10-22`, không tốn thêm đĩa) và short01..03. Mỗi thư mục có video + `_info.txt`.
- `publish/upload_batch_2026-10-22/`: Zombie tập 2, 3 và cổ đại tập 1, 2, 3 (gói hôm 22/10).
- `publish/upload_batch_2_to-upload/`: Zombie tập 4–6, Zombie short 01–08, cổ đại short 01–03 (không có tập dài cổ đại vì đã nằm ở gói hôm 22/10).
- `publish/100-days-zombie-survival/`: Zombie tập 1 và short 01–08. Ngoài ra có `publish.zip` và `upload_batch_2026-10-22.zip` (không phải mình tạo; chưa đụng).

## 6. Bẫy đã gặp
- Python trên Windows ghi `\n` thành CRLF nếu không có `newline="\n"`: replace chuỗi nhiều dòng phải xử lý CRLF.
- Heredoc bash có dấu nháy/`\n` hay hỏng khi tạo file Python: dùng công cụ Write.
- `Root.tsx` trong máy có thay đổi chưa commit của series khác; các commit của series này chỉ lấy phần của mình bằng cách dựng bản `HEAD` + phần thêm, rồi `git update-index --cacheinfo` (không đụng file làm việc). Mã short (`shorts_more.ts`, `shorts_anc.ts`, `ShortVideo.tsx`, đăng ký `ZsShort05..08`/`AncShort01..03` trong Root) và timeline của các short **chưa commit**.
- Chạy `taskkill node` giết cả lệnh render đang chạy. Theo dõi render bằng file cờ (`echo DONE > flag`) chứ đừng dựa vào chuỗi trong log.
- `new_anc_episode.py` ghi đè `script.md` mẫu; ảnh giữ chỗ và `voice.wav`, `music.mp3`, sfx đều git bỏ qua nên máy mới phải tạo lại bằng các lệnh ở trên.
- Cổng Remotion: `remotion.config.ts` đặt cổng cố định; nếu một lần render khác đang giữ cổng thì thêm `--port=<số khác>` (ví dụ 3431, 3441) khi chạy render song song.
- Sơ đồ/nhãn không để dưới y≈860; chữ trong thẻ dài quá bị cắt ở mép: giảm cỡ hoặc dời vào trong.

## 7. Việc tiếp theo gợi ý
1. Chủ dự án nghe thử vài đoạn (giao tranh, bình luận) và tên riêng, báo nếu cần sửa mức âm lượng hoặc cách đọc.
2. Đăng theo thứ tự: tập dài trước, short sau (short dán link tập đầy đủ).
3. Tập 4 (Marathon hoặc Gaugamela): viết kịch bản gửi duyệt; sprite Hy Lạp/Ba Tư đã có ở `anc-pilot1/action`, sprite La Mã/Gaul ở `anc-ep02/action`.
4. Commit nốt phần mã short và timeline (cần gộp với phần Zombie shorts/Biblical đang chưa commit).
