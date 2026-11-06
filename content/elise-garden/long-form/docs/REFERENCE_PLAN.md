# Gate B: kế hoạch tạo ảnh mẫu (nhân vật, nhà, sơ đồ, khu vườn)

2026-11-06. **Chưa gen ảnh nào.** Mỗi batch chỉ chạy khi chủ dự án nói rõ là chạy (`CLAUDE.md`).
Nguồn prompt: `data/references.json`. CSV cho Codex: `references/gen-anh.csv`, sinh bằng `tools/refs_csv.py`.

## Nguyên tắc (lấy từ skill Elise và bài học DIY/Wild)
- **Thành phẩm trước, lùi ngược về sau.** Gen cảnh vườn đã xong (S4) trước, chủ dự án duyệt. Sau đó tạo các trạng thái trước bằng câu "Recreate exactly… only change":
  S4 → S2 (bỏ phân ủ, bỏ hàng gieo) → S1 (bỏ khung, cắm cọc căng dây) → S0 (sân bỏ hoang).
  Cách làm này giống DIY tập 05. Nhà, deck, rào và góc máy được giữ chung một gốc, nên không bị lệch giữa các trạng thái.
- **Sơ đồ là bản vẽ đúng tỉ lệ**, vẽ bằng code từ `garden_layout.json` (`tools/so_do.py`), không phải ảnh AI.
  Sơ đồ được gửi kèm khi gen để GPT bám bố cục. Mọi prompt đều dặn không vẽ lại chữ, lưới hay mũi tên của sơ đồ. Bối cảnh: sân sau nhà kiểu Mỹ (đổi 2026-11-06).
- **Ảnh nhân vật:** chỉ gửi kèm ảnh trực diện, không gửi model sheet nhiều góc (bộ lọc OpenAI hay chặn).
  Câu mô tả da có "no freckles". Thêm "modest, wholesome" cho chắc.
- **Tên file** có tiền tố `gl1-`. Ảnh đã gửi Muse mà phải gen lại thì đặt tên mới.

Sơ đồ đã vẽ xong: `references/anh/gl1-R-so-do.png`.

## Bốn batch

| Batch | Ảnh | Gửi kèm | Ai duyệt |
|---|---|---|---|
| (xong) | `gl1-A-elise-garden-truoc.png`: **dùng trang phục series Garden** (yếm short rằn ri + áo ba lỗ cam cổ tim, tất và giày trắng), chép từ ảnh đã duyệt `eg1-A-elise-truoc.png`. Không gen. Ảnh linen thử được giữ lại thành `gl1-A-elise-linen-thu.png`, không dùng | — | Chủ dự án chốt 2026-11-06 |
| 1 | `gl1-R-nha.png`: mặt sau nhà ranch kiểu Mỹ (ván ngang xám, deck, cửa kính trượt, cuộn ống, cửa sổ bếp, thùng nước mưa) | sơ đồ | **Chủ dự án** |
| **2** | `gl1-R-nha-kho.png`: góc nhà kho (nhà kho xám, giá dụng cụ, thùng ủ phân, xe cút kít, bình tưới) | ảnh nhà | Claude |
| 2 | **`gl1-P-A-S4.png`**: cảnh chuẩn khu vườn xong ngày 2 nhìn từ cổng, nắng chiều | sơ đồ, ảnh nhà, nhà kho | **Chủ dự án** (ảnh gốc của mọi plate) |
| 2 | `gl1-R-aerial-S4.png`: toàn cảnh từ trên cao, khóa bố cục cho các camera khác | sơ đồ, A-S4 | **Chủ dự án** |
| **3** | Elise nghiêng, Elise sau lưng | ảnh trực diện | Claude |
| 3 | `gl1-A-elise-bep-truoc.png`: thêm tạp dề be | ảnh trực diện | Chủ dự án |
| 3 | `gl1-P-KITCHEN.png`: bếp, cửa sổ nhìn ra hai luống | ảnh nhà, A-S4 | Chủ dự án |
| **4** | Plate pilot: A-S2 → A-S1 → A-S0 (lùi ngược), C-S3, D-S5 | A-S4 / ảnh trên cao | Claude; riêng **A-S0** chủ dự án duyệt |

Tổng 14 ảnh, cộng dự phòng 30% là khoảng 18–20 lượt. Mỗi ảnh 1–2 phút, cả 4 batch mất khoảng 30–40 phút gen.

## Phân việc

| | Claude | Codex | Chủ dự án |
|---|---|---|---|
| Trước khi gen | Viết và sửa prompt trong `references.json`, chạy `refs_csv.py`, vẽ lại sơ đồ khi bố cục đổi | Kiểm có đủ ảnh gửi kèm trong `references/anh/` | Nói "chạy batch N" |
| Gen | — | `gpt_anh.py --csv references/gen-anh.csv --only <stt>` theo đúng batch, chạy nền | — |
| Sau gen | Xem lưới ảnh, so với danh sách duyệt bên dưới, viết prompt sửa ("Recreate… only change…") | Ghép lưới (`luoi_khung.py`), chồng plate cùng camera để đo lệch, ghi `assets.json` (`generated`, `reviewed`) | Duyệt các ảnh có ghi "Chủ dự án" |
| Chốt | Ghi kết quả vào `STATUS.md` | Đánh dấu `approved`, chép ảnh đã duyệt sang `episodes/EP01/media/anh/` (để gen khung pilot), không bao giờ ghi đè ảnh đã duyệt | — |

Lệnh, chạy từ thư mục `muse-auto`:
```
LF="/c/Users/HoaVan/Desktop/tool AI/project-animation/content/elise-garden/long-form"
python "$LF/tools/refs_csv.py"                                    # in danh sách stt / batch
cd "/c/Users/HoaVan/Desktop/tool AI/muse-auto"
python gpt_anh.py --csv "$LF/references/gen-anh.csv" --only 1           # batch 1 (đã chạy 2026-11-06)
python gpt_anh.py --csv "$LF/references/gen-anh.csv" --only 2 3 4       # batch 2 (sau khi duyệt batch 1)
python gpt_anh.py --csv "$LF/references/gen-anh.csv" --only 5 6 7 8     # batch 3
python gpt_anh.py --csv "$LF/references/gen-anh.csv" --only 9 10 11 12 13   # batch 4
```
Trong batch 2, ảnh 3 cần ảnh 2 và ảnh 4 cần ảnh 3. Vì vậy chạy tuần tự, xem ảnh 3 xong rồi mới chạy ảnh 4.

## Danh sách duyệt

**Elise:**
- Mặt khớp ảnh nguồn; không tàn nhang; tóc búi thấp.
- Yếm short rằn ri thật (ô liu, nâu, be), quai có khóa kim loại; áo ba lỗ cam cổ tim lộ trên yếm; tất trắng ngắn, giày trắng thấp cổ; khuyên vàng nhỏ, dây chuyền mảnh.
- Không mũ, không găng (trừ bước làm đất), không áo khoác. Một người, toàn thân thấy cả giày.

**Nhà và nhà kho:**
- Nhà ranch một tầng, ván ngang xám nhạt, viền trắng, mái shingle sẫm.
- Deck gỗ có bậc và cửa kính trượt bên trái; cuộn ống, cửa sổ bếp, thùng nước mưa bên phải.
- Nhà kho xám và thùng ủ gỗ ở góc tây nam; rào cedar kín cao 1,8 m.

**A-S4 (cảnh chuẩn):**
- BED-01 bên TRÁI, BED-02 bên PHẢI, hai luống giống hệt nhau, tỉ lệ 1:2, song song.
- 7 nhãn; nửa xa của BED-02 để trống; **không có màu xanh trong luống**.
- Deck bên trái, cửa sổ bếp gần giữa; bãi cỏ ở mép trái (cây táo nằm ngoài khung); nắng chiều từ trái.
- Không có chữ hay vạch của sơ đồ lọt vào ảnh.

**Ảnh trên cao:** khớp sơ đồ về:
- vị trí cổng, lối đi, hai luống ở nửa phải, bãi cỏ và cây táo ở nửa trái, nhà kho ở góc tây nam, deck;
- góc đông bắc còn trống (chỗ nhà kính tương lai).

**Plate lùi ngược:**
- Chồng lên A-S4 thì mép mái, cửa và cột rào lệch dưới khoảng 2% bề rộng khung.
- Mỗi trạng thái chỉ đổi đúng những thứ đã nêu trong prompt.
- S0 không còn dấu vết khung, cọc hay dây.

Ảnh nào trượt thì sửa ảnh trước, không gen lại hàng loạt.
Một ảnh trượt từ 2 lần trở lên thì Claude đổi cách mô tả, ví dụ đổi bố cục hoặc bớt chi tiết.
