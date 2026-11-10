# Elise DIY: bàn giao và quy trình chuẩn (cập nhật 2026-11-04)

Đọc file này trước khi làm tiếp series Elise DIY. Quy trình chung của tool nằm ở `docs/muse-video-pipeline.md`.
Nhân vật và trang phục: `content/elise-diy/models/elise.md`. Ý tưởng và nhịp từng tập: `content/elise-diy/Y-TUONG-TAP-03-06.md`.

## 1. Tình trạng các tập

| Tập | Thư mục | Tình trạng | Việc tiếp theo |
|---|---|---|---|
| 01 Bàn chai resin | `ep01-bottle-table/` | Xong | |
| 02 Cây kim tuyến trên tường | `ep02-wall-tree/` | **Xong** (`final.mp4`, 28 giây; đã dọn, bỏ `final-v1`) | |
| 03 Cây chỉ bằng đèn | `ep03-light-tree/` | **Xong** (`final.mp4`, 18 giây) | |
| 04 Kệ gỗ nổi | `ep04-shelf-tree/` | `final.mp4` 16,5 giây: bỏ cảnh tối, cắt hành động thừa, `--xfade 0.3`. đã dọn | |
| 05 Tháp hộp quà | `ep05-gift-tree/` | **Tạm dừng.** `final.mp4` 20,4 giây (ghép lại 2026-11-04), đã dọn clip. Xem mục 6 | Chủ dự án xem `final.mp4` |
| 06 Cành gỗ | `ep06-branch-tree/` | **Xong** (`final.mp4`, 19,9 giây). Đây là tập làm theo quy trình chuẩn ở mục 3 | |
| 10 Thuyền thành bồn hoa | `ep10-boat-garden/` | **Xong** (`final.mp4`, 25,7 giây). Ghi chép trong `NOI-DUNG.md` | |
| 09 Gốc cây thành nhà tiên | `ep09-fairy-stump/` | **Xong** (`final.mp4`, 31,6 giây, ngoài vườn, áo ba lỗ cổ tim). Ghi chép trong `NOI-DUNG.md` | |

## 2. Công cụ và tài khoản

- Tool: `C:\Users\HoaVan\Desktop\tool AI\muse-auto\` (repo `Bisu89/muse-tool`, README trong đó). Ảnh gen bằng `gpt_anh.py`
  (Codex), video gen bằng `muse_auto.py` (Muse qua Chrome + Playwright), ghép bằng `ghep.py`, chấm điểm bằng `qa.py`.
- Mỗi series một profile Chrome và một tài khoản Muse. **Không bao giờ xóa thư mục profile.**

| Series | Profile | Cổng | Side chat (`content/<series>/muse-chat.json`) |
|---|---|---|---|
| Elise Wild | `chrome-profile` | 9334 | ghi trong file |
| Elise Talent | `chrome-profile-2` | 9335 | ghi trong file |
| Elise DIY | `chrome-profile-3` | 9336 | `https://muse.ai/thread/08408236-3fa9-4add-a630-4cdd3a21e6bf` |

- Cửa sổ Chrome của tool phải mở và đã đăng nhập. Chủ dự án thu nhỏ nó xuống taskbar để làm việc, **không được tắt**.
  Tool chạy ngầm, không kéo cửa sổ lên (`config.json` `"hien_cua_so": true` thì mới kéo lên).
- Kiểm tra đăng nhập: `curl http://127.0.0.1:9336/json/version`, rồi mở tab chat, thấy ô `textarea[aria-label="Message"]` là đã đăng nhập.
- Trước khi chạy Muse: kiểm tra không còn tiến trình `muse_auto.py` cũ của cùng tập đang chạy
  (PowerShell `Get-CimInstance Win32_Process -Filter "Name='python.exe'"`). Hai tiến trình cùng một chat sẽ giẫm lên nhau.

## 3. Quy trình chuẩn (làm theo tập 06, cho kết quả tốt nhất)

1. **Ý tưởng có ảnh mẫu sản phẩm:** làm đúng sản phẩm và căn phòng trong ảnh mẫu. Nếu chỉ có tên ý tưởng thì xin ảnh mẫu.
2. **Gen ảnh thành phẩm trước** (`<tiền tố>-G-thanh-pham.png`, không có người), gửi chủ dự án duyệt sản phẩm.
3. **Viết danh sách nhịp có giây, chờ chủ dự án duyệt rõ ràng** (quy tắc trong `CLAUDE.md`).
4. **Viết `gen-anh.csv`.** Mẫu: `content/elise-diy/scripts/tao_gen_anh_tap04-06.py`.
   - Tiền tố tên file riêng cho từng tập (`kg-`, `hq-`, `cg-`...).
   - Ảnh tham chiếu trang phục: `<tiền tố>-A-elise-truoc.png`, chép từ `models/elise-*-truoc.png` (bản không tàn nhang).
   - Ảnh đầu gửi kèm ảnh thành phẩm để lấy đúng phòng. Các ảnh sau chỉ gửi kèm ảnh A và ảnh ngay trước.
   - **Khung cuối mỗi bước là lúc đang làm** ("hai tay còn đang đặt món cuối"), không phải lúc đứng cầm đồ của bước sau.
   - **Mọi đồ dùng ở bước sau phải có sẵn từ ảnh đầu** (thùng đồ, cuộn dây). Thùng rỗng chỉ cất đi ở cú cắt thời gian.
   - **Không có cảnh tối, không bấm điều khiển.** Ảnh sáng đèn gen từ ảnh ngay trước nó, vẫn ban ngày, Elise cắm điện.
     Không gửi kèm ảnh thành phẩm ở bước này, nếu không sản phẩm sẽ bị vẽ khác đi.
   - Tránh vật quá nhỏ phải đặt từng cái (móc dán, giá kệ).
5. **Gen ảnh:** `python gpt_anh.py --csv "<tập>\gen-anh.csv"`. Ghép lưới ảnh và QA bằng mắt:
   - vật tự xuất hiện hoặc biến mất;
   - tường đổi màu;
   - trang phục đổi;
   - sản phẩm đổi hình.

   Sửa một ảnh bằng cách gen lại với prompt "Recreate the reference image exactly... Only one change: ...". **Xóa file
   cũ trước khi gen lại**, nếu không Codex có thể chép lại ảnh cũ. Gửi ảnh cho chủ dự án duyệt.
6. **Viết `gen-video.csv`.** Mẫu: `content/elise-diy/scripts/tao_gen_video_tap06.py`.
   - Mỗi clip một việc, khung đầu và khung cuối là 2 ảnh liền nhau.
   - `anh_tham_chieu` = ảnh A và ảnh phòng (ảnh đầu). **Không để ảnh tham chiếu trùng `khung_dau`** (clip 1): Muse từ chối cả yêu cầu (tập 09, 2026-11-04).
   - Prompt luôn có:
     - "One continuous fixed shot, no zoom, no pan, no cuts";
     - kể tên đồ đạc trong phòng;
     - "Only this one woman is ever in the scene";
     - "never stands idle or sways while holding an item";
     - "Everything that appears is carried and placed by her own hands, one item at a time";
     - đèn tắt cho tới clip cắm điện.
7. **Chạy Muse:**
   - Mỗi phiên làm việc mới chỉ chạy thử 1 lần, chỉ clip 1: `python muse_auto.py run --csv "<tập>\gen-video.csv" --only 1 --dry`.
     Không chạy thử trước mỗi tập, vì nó điền rồi xóa trong ô chat chủ dự án đang xem.
   - Chạy thật: `python -u -X utf8 muse_auto.py run --csv "<tập>\gen-video.csv"` (chạy nền).
   - Dùng `auto --dir` cũng được, nhưng đừng dùng khi Codex đang gen ảnh của cùng tập.
   - Clip trượt QA: tool tự gửi lại **như tạo video mới** (ảnh + prompt + "FIX FROM PREVIOUS ATTEMPT"), tối đa 1 lần.
     Muốn tự chọn clip làm lại: `run --csv ... --only 4 6 --lam-lai [--sua "câu sửa"]`.
   - Muse lỗi ("Delivery not confirmed"): tool tự nhắn "render lại" kèm prompt. **Không bao giờ chỉ nhắn "render lại"
     cho clip trượt QA**, vì Muse không biết làm lại clip nào.
   - Phiên bị cắt giữa lúc chờ: chạy `run --csv ... --only N --chi-tai` để tải video Muse đã trả, không gửi lại.
8. **Ghép và cắt:**
   - Ghép bản nguyên: `python ghep.py --csv "<tập>\gen-video.csv" --xfade 0.3`, rồi đổi tên thành `final-nguyen-ban.mp4`.
   - Trích khung hình 2 lần mỗi giây, ghép thành lưới có ghi giây, rồi xem từng clip.
   - **Cắt hết hành động thừa:** đứng chờ, đung đưa cầm đồ, đi lại, ngồi cười. **Cắt trước lúc Muse cho đồ hiện ra hàng loạt**
     (thường từ giây 5–7 của clip 10 giây). Ghi `cat_tu`, `cat_den`, `dung_giay` vào CSV.
   - Không kéo cho đủ số giây trong kịch bản. Tăng tốc tối đa khoảng 1,5 lần, vì clip Muse vốn đã là timelapse.
   - Ghép lại với `--xfade 0.3`.
9. **Chủ dự án xem.** Điểm QA chỉ để tham khảo: bản cắt sạch thường bị điểm thấp hơn vì mất quá trình làm, nhưng
   chủ dự án vẫn chọn bản cắt.
10. **Dọn file nháp sau khi chốt** (liệt kê trước khi xóa):
    - xóa `final-*.mp4` khác, `clip*.mp4`, `*.lan1.mp4`, `*.truoc.mp4`, `clip*.qa.json`, `video/qa/`, `video/_thu*/`;
    - giữ `final.mp4`, `anh/`, CSV, `goc.mp4`.

## 4. Quy tắc chủ dự án đã nói (đừng làm sai lại)

- Elise không có tàn nhang. Prompt dùng câu "natural realistic skin texture with fine pores, no freckles, no airbrushing",
  không dùng "smooth skin" vì nghe như da AI.
- Mỗi giây trong video phải là công đoạn có ích hoặc là thành phẩm.
- Không có cảnh tối. Chỉ giữ các công đoạn và thành phẩm sáng đèn.
- Trước khi gen hoặc render tập mới thì gửi nội dung duyệt. Sửa nhỏ trên tập đã duyệt thì làm luôn.
- Làm từng tập, xem kết quả rồi mới sang tập sau, để không loạn.
- Chủ dự án không thích Chrome tự bật lên khi đang làm việc.

## 5. Trang phục (`models/`)

| Bộ | File tham chiếu | Dùng ở |
|---|---|---|
| Quần yếm short (v2) | `elise-v2-model-sheet.png` | Tập 01–02 |
| Legging đen + áo ba lỗ + Nike | `elise-legging-truoc.png` | Tập 03, 04 |
| Váy xếp ly + crop top logo + cao gót đen | `elise-vay-xep-cao-got-truoc.png` | Tập 05 |
| Váy xếp ly + crop top logo + tất đen chấm bi, không giày | `elise-vay-xep-tat-cham-bi-truoc.png` | Tập 06 |

## 6. Tập 05: đang ở đâu

- Đã thử 2 cách không có khung cuối, nối clip bằng khung cuối của clip trước (`khung_dau = @cuoi:N`).
  - Kết quả: hết lỗi đồ xếp lên rồi mất, nhưng Muse vẫn vẽ lại khung đầu, đổi đồ đạc và có lúc chèn người lạ.
  - Các bản thử nằm trong `video/_thu1/`, `video/_thu2/`.
- Cách đang dùng là **lùi ngược từ khung đẹp**:
  - lấy khung đầu clip 3 (`anh/hq-K-thap-do.png`, tháp đỏ có nơ);
  - từ đó gen ngược `hq-K00-dong` (đống quà) và `hq-K0-nua` (2 tầng dưới);
  - clip 1 = K00→K0, clip 2 = K0→K; clip 3 (nhét quả châu) và clip 4 (cắm điện, đèn sáng) giữ từ lần thử 2.
- Chủ dự án khen phần sau (clip 3, 4), chê mở đầu cũ. Mở đầu mới đã gen xong.
  - Mở đầu mới còn lỗi: hộp mờ như bóng ma ở clip 1, giây 1,5; tháp tự đổi màu ở clip 2, giây 4–5.
  - CSV đã ghi cắt: clip 1 tới 8,5 giây; clip 2 tới 6,0 giây.
- 2026-11-04: đã ghép lại `video/final.mp4` (20,4 giây) theo CSV hiện tại, rồi xóa hết clip, `_thu1/`, `_thu2/`
  theo lệnh dọn của chủ dự án. Muốn sửa tiếp phải gen lại clip.
- Script `scripts/tao_gen_video_tap05.py` là bản của lần thử 2. CSV hiện tại đã được sửa tay thêm (clip 1–2 mới).
  **Đừng chạy lại script này đè lên CSV.**

## 7. Script mẫu (`content/elise-diy/scripts/`)

- `tao_gen_anh_tap04-06.py`: sinh `gen-anh.csv` cho tập 04–06 từ một chỗ (trang phục, phòng, khung từng bước).
  Chạy: `python -I -X utf8 tao_gen_anh_tap04-06.py <đường dẫn content/elise-diy>`. Lệnh này ghi đè CSV của cả 3 tập,
  nhưng ảnh đã có thì `gpt_anh.py` bỏ qua.
- `tao_gen_video_tap04.py`, `tao_gen_video_tap06.py`: mẫu `gen-video.csv`. Chạy với đối số là thư mục tập.
  Các cột cắt (`cat_tu`, `cat_den`, `dung_giay`) được chỉnh tay sau khi xem video, nên chạy lại script sẽ xóa mất.
