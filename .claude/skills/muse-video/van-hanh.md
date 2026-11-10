# Vận hành tool: gpt_anh, muse_auto, profile, QA

Tool nằm ở `C:\Users\HoaVan\Desktop\tool AI\muse-auto\` (README trong đó). Chạy lệnh với `cd "$TOOL"`, không dùng `python -I`.

## Ảnh: `gpt_anh.py`
```
python gpt_anh.py --csv <thư mục>/gen-anh.csv [--only 3 5] [--force] [--dry]
```
- Cột CSV: `stt, ten_file, ty_le, gui_kem, prompt`. Ảnh lưu vào `anh/` cạnh CSV, ảnh gửi kèm cũng lấy từ `anh/`.
- Ảnh đã có thì tool bỏ qua. Muốn gen lại: **xóa file** rồi chạy (Codex có thể trả lại y ảnh cũ). Ảnh đã gửi Muse thì **đặt tên mới**.
- Chạy nền, mỗi ảnh mất 1–2 phút. Bị bộ lọc chặn thì tool tự thử lại một lần với khung kín đáo hơn. Lần thử lại này có thể đổi góc máy hoặc kiểu tóc, nên phải xem lại ảnh.
- **Hạn mức ChatGPT:** "You've hit your usage limit… try again at HH:MM" nghĩa là dừng, báo chủ dự án. Mỗi lần hạn mức được làm mới chỉ chạy được khoảng 30–40 ảnh.
- Gen xong thì ghép lưới để so cặp khung đầu và cuối: `.claude/skills/elise/scripts/luoi_khung.py <anh/> out.png --loc <tiền tố>`.

## Video: `muse_auto.py`
```
python muse_auto.py run --csv <...>/gen-video.csv [--only N ...] [--dry] [--lam-lai --sua "câu sửa"] [--chi-tai]
```
- Cột CSV: `stt, doan, luu_tai, khung_dau, khung_cuoi, anh_tham_chieu, prompt, am_thanh, dung_giay, che_do, cat_tu, cat_den, chuyen_canh`.
- **Profile và chat:** đọc `muse-chat.json` ở thư mục CSV, thư mục cha hoặc thư mục ông. File có `profile`, `port`, `url` của chat, `video_spec`.
  - `url` để trống thì lượt chạy đầu tự tạo chat mới.
  - Muốn chuyển sang chat mới thì chuyển `url` cũ sang `url_cu` và để `url` trống.
  - Không tự tạo hay xóa profile. Tool chỉ điều khiển được Chrome/Opera (CDP), không điều khiển được Firefox.
- **Mỗi lúc một lượt trên một profile.** Trước khi chạy:
  ```
  powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='python.exe'\" | Where-Object { $_.CommandLine -like '*muse_auto*' }"
  ```
  Thấy lượt khác thì chờ bằng vòng lặp nền (kiểm mỗi 30 s), xong mới chạy. Thấy chính mình đang chạy trùng thì dừng lượt của mình.
- Chạy thử `--dry` **một lần mỗi phiên** (clip 1), không chạy thử trước mỗi tập.
- Ảnh nào đạt thì gửi Muse ngay, không chờ đủ bộ ảnh.
- Clip đã gửi mà phiên bị cắt: `--only N --chi-tai` để chỉ tải về, không gửi lại.

## QA và gen lại
- Tool tự QA từng clip bằng GPT. Clip trượt thì tự gửi lại **một lần** kèm "FIX FROM PREVIOUS ATTEMPT"; bản đầu giữ lại thành `*.lan1.mp4`.
- Muse lỗi ("Delivery not confirmed", hết giờ chờ) thì gửi lại nguyên tin yêu cầu. **Không bao giờ** nhắn "render lại" trơn cho clip trượt QA.
- Trượt QA hai lần **chưa chắc phải bỏ**: thường đoạn đầu clip vẫn dùng được. Tự xem rồi chọn đoạn sạch ([dung-render.md](dung-render.md)).
- Một chuyển động thử 2 lần vẫn sai dạng thì đổi cách quay (xem [noi-clip.md](noi-clip.md)), đừng gửi lần 3 y nguyên.

## Sau khi dùng clip: dọn (theo `CLAUDE.md`)
Liệt kê trước khi xóa. Được xóa: `*.lan1.mp4`, `*.truoc.mp4`, `*.qa.json`, `qa/`, lưới và ảnh kiểm tra, bản render nháp. Giữ: video cuối, ảnh khung nguồn, CSV, dữ liệu.
