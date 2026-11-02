# Làm video AI "quay thật" bằng GPT (ảnh) + Muse (video)

Quy trình này dùng cho các video remake reel DIY/thủ công dạng timelapse: series **Elise DIY** (`content/elise-diy/`) và
**Elise Wild** (`content/elise-wild/`). Nó không dùng Remotion. Video được AI tạo hoàn toàn, rồi ghép bằng ffmpeg.

**Công cụ:** `C:\Users\HoaVan\Desktop\tool AI\muse-auto\`. Đây là tool riêng, nằm ngoài repo. README trong đó ghi đủ chi tiết lệnh và cấu hình.

## Các bước

1. **Phân tích video gốc.** Trích contact sheet bằng ffmpeg (1 khung/giây), rồi viết danh sách nhịp có mốc giây.
2. **Gửi chủ dự án duyệt nội dung** (`CLAUDE.md`), chờ trả lời đồng ý rõ ràng rồi mới gen.
3. **Viết 2 file CSV** trong `content/<series>/<tập>/`:
   - `gen-anh.csv`: cột `stt, ten_file, ty_le, gui_kem, prompt`.
   - `gen-video.csv`: cột `stt, doan, luu_tai, khung_dau, khung_cuoi, anh_tham_chieu, prompt, am_thanh, dung_giay, che_do, cat_tu, cat_den`.
   - Ảnh khung cuối của clip trước chính là ảnh khung đầu của clip sau. Nếu hai đoạn cách nhau một khoảng thời gian thì
     dùng hai ảnh khác nhau, đó là một cú cắt thời gian.
   - Tên file ảnh mang tiền tố riêng của từng tập (ví dụ `bt3-`), để Muse không nhầm với ảnh của tập khác.
4. **Gen ảnh** bằng `gpt_anh.py`. Tool gọi `codex.exe` của extension Codex trong VS Code, dùng tài khoản ChatGPT nên không cần API key.
   **Xem lại từng ảnh** trước khi gửi Muse.
5. `python muse_auto.py auto --dir <tập>`. Tool lần lượt:
   - gửi từng clip vào **side chat riêng của series** trên muse.ai, qua Opera + Playwright (cần bật VPN Opera);
   - **QA từng clip** bằng Claude: đạt; hoặc tự cắt bỏ đuôi lỗi; hoặc gen lại 1 lần kèm câu sửa;
   - ghép bằng `ghep.py`;
   - QA cả video bằng `qa.py`, cho GPT và Claude chấm cùng thang 7 tiêu chí.
6. **Chủ dự án xem video.** Sửa bằng cách cắt hoặc làm chậm qua các cột `cat_tu`, `cat_den`, `dung_giay`, `che_do`
   (không tốn lượt gen), hoặc gen lại đúng clip lỗi.
7. Chốt bản cuối thì dọn file nháp (`_v*/`, `*.lan1.mp4`, `video/qa/`), chỉ giữ `video/final.mp4`.

Ảnh gen ra, clip, bản nháp và video không commit (`.gitignore`). Commit CSV, tài liệu và model sheet; từ CSV gen lại được tất cả.

## Bài học (Elise DIY tập 01, bàn chai resin, 2026-11-02)

- **Mỗi clip chỉ một việc**, có ảnh chốt ở cả khung đầu và khung cuối.
  - Clip phải vừa xếp chai vừa đổ resin thì về cuối hỏng.
  - Clip bắt mô hình vẽ cảnh "đục chuyển sang trong" liền một mạch thì bị biến hình. Phải tách thành 2 clip nối bằng cú cắt thời gian.
- **Muse vẽ lại khung đầu và làm lệch số đồ vật lặp lại** (12 chai thành 16–24). Đừng bắt AI đếm chính xác: chọn số
  lượng ngay từ ảnh, và QA không trừ điểm vì số lượng.
- **Bố cục ảnh có thể gây biến hình.** Vật mới xuất hiện mà nằm trùng chỗ với một vật ở nền (chậu cây trước chậu cọ) thì
  mô hình "biến" vật nền thành vật mới. Sửa bằng cách đổi chỗ vật trong ảnh, viết lại prompt không ăn thua.
- **Ghi rõ vật lý của thao tác** (lật úp khuôn rồi mới bóc silicon; resin rót lên chai, không rót vào lỗ giữa) và
  **ghi mốc giây** cho từng việc.
- **Cảnh khoe thành quả:** đồ vật xuất hiện ngay (pop) đẹp hơn là mờ dần (mờ dần dễ thành quầng sáng ma). Máy quay đứng
  yên khi đồ xuất hiện. Cú lia vòng tách thành clip riêng, không chốt khung cuối, và chỉ lấy vài giây đầu trước khi
  mô hình bắt đầu vẽ lại vật thể.
- **QA phải chấm theo mắt người xem.** QA kỹ thuật quá khắt khe sẽ đánh trượt mãi và tốn lượt gen. Chỉ đánh trượt lỗi
  vô lý (biến hình, vật xuất hiện hoặc biến mất vô cớ, tay méo, đổi trang phục). Video gốc trên mạng cũng chỉ được
  khoảng 64/100 trên thang chấm cả video.
- **Bộ lọc an toàn của OpenAI** chặn ngẫu nhiên ảnh nhân vật mặc quần short. Cách tránh:
  - gửi kèm ảnh nhân vật góc trực diện;
  - tả tư thế đứng thẳng, thêm "modest, wholesome";
  - `gpt_anh.py` tự thử lại 1 lần với khung hình kín đáo hơn.
- **Muse:**
  - xuất video 704×1248, `ghep.py` phóng lên 1080×1920;
  - tin nhắn có thể "Delivery not confirmed" khi mạng chập chờn; tool kiểm tra tin đã lên chat và dùng mã `#job-...`
    để không tải nhầm video cũ;
  - dùng lại tab đang mở, không mở tab mới.
