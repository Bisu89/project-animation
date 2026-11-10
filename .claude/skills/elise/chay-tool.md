# Bước 3: gen ảnh và gen clip Muse

Biến dùng trong lệnh (Git Bash):
```
REPO="/c/Users/HoaVan/Desktop/tool AI/project-animation"
TOOL="/c/Users/HoaVan/Desktop/tool AI/muse-auto"
TAP="$REPO/content/elise-<dòng>/epNN-<slug>"   # Wild: thư mục phân đoạn p*/
LUOI="$REPO/.claude/skills/elise/scripts/luoi_khung.py"
```
Lệnh tool (`gpt_anh.py`, `muse_auto.py`, `ghep.py`, `qa.py`) chạy với `cd "$TOOL"`. Script lưới khung gọi bằng đường dẫn
tuyệt đối `$LUOI`, nên chạy ở đâu cũng được.

## 3.1 Gen ảnh
```
cd "$TOOL" && python gpt_anh.py --csv "$TAP/gen-anh.csv" [--only 3 5] [--force]
```
- Không dùng `python -I`: tool import `qa.py` cùng thư mục.
- Ảnh đã có thì tool bỏ qua. `--force` gen lại cả những ảnh đã có, ghi đè lên chúng (xem 3.2).
- Chạy nền, khoảng 1–2 phút mỗi ảnh. Chờ thông báo, đừng `sleep`.
- Gen xong thì ghép lưới:
  ```
  python "$LUOI" "$TAP/anh" <scratchpad>/luoi.png --loc <tt>-
  ```
  Xem lưới, so từng cặp khung đầu/cuối, tìm:
  - máy quay lùi hoặc tiến giữa 2 khung;
  - sản phẩm đổi dáng hoặc cỡ so với ảnh G;
  - vật của bước trước biến mất, hoặc vật của bước sau xuất hiện sớm;
  - trang phục, găng, tường đổi.
- Bộ lọc OpenAI đôi khi chặn ảnh quần short. Cách tránh: tả tư thế đứng thẳng, thêm "modest, wholesome". Tool tự thử lại 1 lần.

## 3.2 Gen lại một ảnh: hai trường hợp
| Ảnh | Cách làm |
|---|---|
| **Chưa gửi Muse** (chưa có clip nào dùng) | Sửa prompt trong script, chạy script, rồi `gpt_anh.py --only N --force`. Codex có thể trả lại y ảnh cũ: nếu vậy thì xóa file đó rồi gen lại |
| **Đã gửi Muse** (có trong `gen-video.csv` của clip đã chạy) | **Đặt tên mới** (`dt-D2b-luoi-xong.png`), sửa tên trong script cho cả `gen-anh.csv` và `gen-video.csv`, rồi gen. Muse nhận ảnh trùng tên sẽ dùng lại bản cũ. Ảnh cũ để nguyên tới lúc dọn tập |

Ảnh khác dùng ảnh vừa sửa làm `gui_kem` thì gen lại theo cùng quy tắc.

## 3.3 Trước khi chạy Muse
- Kiểm tra Chrome đúng cổng ghi trong `muse-chat.json` của dòng (DIY 9337 từ tập 16, Wild/Talent 9336):
  `curl http://127.0.0.1:<cổng>/json/version`. Không trả lời thì nhờ chủ dự án mở profile đó
  (`$TOOL\1-dang-nhap.bat` cho 9336, `$TOOL\1-dang-nhap-garden.bat` cho 9337).
  Không tự tạo profile.
- Kiểm tra không còn `muse_auto.py` của cùng series đang chạy (PowerShell
  `Get-CimInstance Win32_Process -Filter "Name='python.exe'" | select CommandLine`).
- Kiểm tra mọi file ghi trong `gen-video.csv` đều có trong `anh/`.
- Lần chạy Muse đầu tiên của phiên làm việc, chỉ một lần: `python muse_auto.py run --csv "$TAP/gen-video.csv" --only 1 --dry`.

## 3.4 Hai lệnh chạy Muse (đã kiểm trong `muse_auto.py`)
| Lệnh | Làm gì |
|---|---|
| `run --csv "$TAP/gen-video.csv" [--only N ...]` | Gửi từng clip, tải về, **QA từng clip** (đạt / tự ghi `cat_den` / trượt thì gửi lại 1 lần kèm "FIX FROM PREVIOUS ATTEMPT", giữ bản đầu thành `clipN.mp4.lan1.mp4`). Muse lỗi thì gửi lại nguyên yêu cầu. **Không ghép, không chấm cả video** |
| `auto --dir "$TAP"` | Gen ảnh còn thiếu (`*anh*.csv`) → `run` toàn bộ → `ghep.build` ra `video/final.mp4` → `qa.run` chấm cả video. Thư mục phải có đúng 1 file `*video*.csv`. Không dùng khi Codex đang gen ảnh của cùng tập |

Chạy nền, ghi log:
```
cd "$TOOL" && python -u -X utf8 muse_auto.py run --csv "$TAP/gen-video.csv" > <scratchpad>/epNN-run.log 2>&1
```
Các lệnh khác:
- Làm lại clip cụ thể: `run --csv ... --only 4 6 --lam-lai --sua "câu sửa"`.
- Tải clip Muse đã trả mà phiên trước chưa kịp lấy: `run --csv ... --only N --chi-tai`.
- Sau `run`, tự ghép và chấm theo `ghep-cat.md`.

## 3.5 Clip trượt QA cả 2 lần: chưa gen lại vội
1. Xem lưới của cả `clipN.mp4` và `clipN.mp4.lan1.mp4`.
2. Chọn bản có đoạn sạch dài hơn, rồi cắt ở bước 4.
3. Chỉ gen lại khi cả hai bản đều không có đoạn sạch nào thể hiện được việc chính. Khi gen lại, **đổi cách quay** theo
   `loi-thuong-gap.md` (thường là chuyển sang cận tay), không gửi y nguyên.
