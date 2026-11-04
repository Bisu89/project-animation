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
   - gửi từng clip vào **side chat riêng của series** trên muse.ai, qua Chrome + Playwright (profile `chrome-profile*/`
     theo `config.json` hoặc `muse-chat.json` của series; Opera chỉ còn là tùy chọn, cần bật VPN Opera);
   - **QA từng clip** bằng GPT (`gpt-6.1-sol`, suy luận `high`; đổi trong `config.json`): đạt; hoặc tự cắt bỏ đuôi lỗi; hoặc gen lại 1 lần kèm câu sửa (xem "Gen lại clip" bên dưới);
   - ghép bằng `ghep.py`;
   - QA cả video bằng `qa.py`, GPT chấm theo thang 7 tiêu chí (Claude chỉ chấm khi bật `final_qa`).
6. **Chủ dự án xem video.** Sửa bằng cách cắt hoặc làm chậm qua các cột `cat_tu`, `cat_den`, `dung_giay`, `che_do`
   (không tốn lượt gen), hoặc gen lại đúng clip lỗi.
7. Chốt bản cuối thì dọn file nháp (`_v*/`, `*.lan1.mp4`, `*.truoc.mp4`, `final-v*.mp4`, `video/qa/`), chỉ giữ `video/final.mp4`.

## Gen lại clip: hai trường hợp khác nhau (chủ dự án quy định, 2026-11-03)

| Trường hợp | Gửi gì cho Muse |
|---|---|
| **Clip trượt QA chấm điểm** (biến hình, vật tự xuất hiện...) | Gửi **như tạo một video bình thường**: đính kèm lại đủ ảnh (khung đầu, khung cuối, tham chiếu) và **prompt mới**, tức prompt cũ cộng câu sửa "FIX FROM PREVIOUS ATTEMPT: ...". Tool tự làm khi QA trượt; muốn tự chọn clip thì `muse_auto.py run --csv ... --only N --lam-lai [--sua "câu sửa"]` |
| **Muse lỗi** ("Delivery not confirmed", không trả video) | Gửi lại **nguyên tin yêu cầu**: đủ ảnh + prompt cũ, mã việc mới. Tool tự làm khi thấy lỗi (tối đa `delivery_retries` lần). Nhắn "render lại" không kèm ảnh thì Muse trả lời là thiếu ảnh và không gen (đã gặp ở Elise Wild C29, 2026-11-03) |

Không bao giờ chỉ nhắn "render lại" cho clip trượt QA. Như vậy Muse không biết làm lại clip nào, cũng không biết phải sửa gì,
mà vẫn tốn một lượt gen.

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
  - tin nhắn có thể "Delivery not confirmed" khi mạng chập chờn. Tool kiểm tra tin đã lên chat và dùng mã `#job-...`
    để không tải nhầm video cũ. Nếu thấy dòng này mà Muse chưa tạo video, tool chờ 30 giây rồi gửi lại nguyên tin yêu
    cầu kèm ảnh (tối đa `delivery_retries` lần, mặc định 3);
  - mỗi series dùng lại tab đang mở đúng side chat của nó. Không có tab đó thì tool mở tab mới, không mượn tab Muse của
    series khác (Elise DIY và Elise Talent dùng chung `chrome-profile-2`).

## Bài học (Elise DIY tập 02–04, cây thông Giáng sinh, 2026-11-03)

- **Bỏ mọi hành động thừa, không kéo dài cho đủ số giây (chủ dự án yêu cầu).** Mỗi giây trong video phải là một công
  đoạn có ích hoặc là thành phẩm. Cắt bỏ các đoạn đứng chờ, đung đưa, quay qua quay lại, đi qua đi lại, cúi nhặt mà không
  làm gì, ngắm lâu. Cột giây trong kịch bản chỉ là ước lượng: khi ghép thì cắt theo nội dung (`cat_tu`, `cat_den`, `dung_giay`),
  bước nào chỉ cần 1,5 giây thì để 1,5 giây. Video ngắn hơn dự kiến cũng được.
- **Trường hợp hay gặp nhất: Elise cầm đồ vật lắc qua lắc lại.** Khung cuối mà tả "cô đứng cầm món X" thì
  Muse cho cô đứng đung đưa chờ suốt mấy giây cuối clip. Cách làm:
  - Khi viết prompt: kết thúc clip ngay khi xong việc, ghi rõ "she never stands idle swaying with an item in her hands".
    Khung cuối nên là lúc vừa xong thao tác, không phải lúc đứng cầm sẵn đồ của bước sau.
  - Khi ghép: cắt bỏ đoạn đứng cầm đồ chờ ở cuối clip (`cat_den`), trước khi chốt video.
- **Muse tự "làm xong trước" ở cuối clip.** Đồ trang trí, dây lá, quà hiện ra hàng loạt mấy giây cuối, sang clip sau lại
  về ảnh khung đầu, nên người xem thấy đồ xếp lên rồi mất rồi lại xếp. Trích khung hình mỗi 0,5 giây và cắt mỗi clip
  trước lúc đồ hiện hàng loạt. Thường cắt được ở giây 5–7 của clip 10 giây.
- **Không dùng cảnh tối rồi bấm công tắc.** Muse làm cả phòng ám cam đậm, nền khác hẳn các cảnh ban ngày. Chủ dự án
  chọn: chỉ giữ các công đoạn và cảnh thành phẩm sáng đèn ở cuối.
- **Ảnh bật đèn phải gen từ ảnh ngay trước nó**, không gửi kèm ảnh thành phẩm. Gửi kèm ảnh thành phẩm thì AI vẽ sản
  phẩm theo ảnh đó, khác ảnh trước, nên clip bị biến hình. Ảnh thành phẩm chỉ dùng ở ảnh đầu, để lấy đúng phòng.
- **Ảnh thành phẩm gen trước, chủ dự án duyệt sản phẩm rồi mới gen các bước.** Ý tưởng nào có ảnh mẫu thì làm đúng sản
  phẩm trong ảnh mẫu.
- **Tránh vật quá nhỏ phải đặt từng cái** (móc dán, giá kệ). Muse cho chúng tự hiện ra thành lưới. Coi như đã gắn sẵn,
  hoặc lướt nhanh qua bước đó.
- **Đồ dùng ở bước sau phải có sẵn từ ảnh đầu** (thùng đồ, cuộn dây). Thùng rỗng chỉ cất đi ở cú cắt thời gian.
- **Cắt đoạn lỗi có thể làm điểm QA tụt** (mất quá trình làm), nhưng người xem thấy sạch hơn. Ở tập 03 chủ dự án chọn bản cắt.

## Bài học (Elise DIY tập 07–11, bình và chậu hoa, 2026-11-04)

- **Tốc độ khi ghép (chủ dự án quy định, 2026-11-04):** các bước làm (nhúng, quấn, vặn, đổ, sơn lót...) tua nhanh
  kiểu timelapse (`che_do = tang_toc`, mỗi clip 10 s còn khoảng 3 s). Riêng **các cảnh trang trí hoàn thiện** (vẽ, kẻ
  vàng, vẽ họa tiết) và **cảnh cắm hoa không tua**: `che_do = cat`, `dung_giay` bằng đúng đoạn lấy (`cat_tu`–`cat_den`),
  cắt bỏ đoạn lặp lại hoặc đứng không ở cuối (ví dụ tập 11: kẻ vàng 0–4 s, cắm hoa 0–6 s).
- **Cảnh kết: thành phẩm không có người, máy quay lia vòng chậm khoảng 6 s.** Clip riêng không chốt khung cuối, lấy
  5 giây đầu (sau đó Muse bắt đầu vẽ lại nền) rồi làm chậm thành 6 s (`cat_den = 5`, `dung_giay = 6`, `tang_toc`).
- **Ý tưởng có ảnh sản phẩm:** gen ảnh thành phẩm bằng GPT trước, ghép cạnh ảnh gốc thành ảnh so sánh, và gen một
  storyboard nhiều khung theo nhịp để chủ dự án duyệt bằng mắt. Ảnh storyboard và so sánh xóa khi chốt tập.
- **Sơn và kẻ vàng:** Muse hay cho màu tự loang hoặc tự hiện hàng loạt. Chỉ giữ đoạn đầu cọ đi từng nét, phần còn lại
  để cú cắt sang cảnh sau đảm nhận.
- **Bóng bay:** cho chọc kim nổ, không cho xẹp dần (Muse vẽ bóng phồng to khi bảo xẹp).
- **Khi một profile Chrome đang bận** (phiên khác đang chạy Muse cùng series), đặt `muse-chat.json` riêng trong thư mục
  tập trỏ sang profile rảnh. Tool đọc file ở thư mục tập trước file của series.

## Bài học (Elise Wild tập 01, phim dài 16:9 theo phân đoạn, 2026-11-03)

- **Làm theo phân đoạn**, mỗi phân đoạn một thư mục (`p3-leu/`, `p4-nuoc/`...) có `gen-anh.csv`, `gen-video.csv`, ghép
  ra `video/final.mp4` riêng. Duyệt nội dung từng phân đoạn trước, rồi gen.
- **Ảnh nào QA đạt thì gửi Muse luôn** (`run --only <stt>`), không chờ đủ bộ ảnh. Ảnh dùng ảnh hỏng làm tham chiếu thì
  chờ ảnh đó sửa xong. Mỗi lúc chỉ một lượt Muse cho một series, vì dùng chung tab chat.
- **Ảnh đã gửi Muse mà gen lại thì đổi tên file** (`ew1-501b-...`). Trùng tên thì Muse dùng lại ảnh cũ đã nhận.
- **Mỗi series một profile Chrome:** `muse-chat.json` của series có thể ghi `"profile"` và `"port"` riêng (Elise Wild:
  `chrome-profile`, cổng 9334). Hai series chạy song song không giẫm lên nhau.
- **Logic câu chuyện trước, kỹ thuật sau.** Chủ dự án bắt được những lỗi QA bỏ qua: dựng lều lá xong lại có lều bạt sẵn,
  đậy nắp nồi trước khi lọc nước, đeo ba lô đi vào giữa lúc đang làm việc ở trại. Trước khi gen, đọc lại thứ tự cảnh như
  người xem: đồ vật có lý do xuất hiện không, việc trước có dẫn tới việc sau không.
- **Đời thường, không cầu kỳ.** Nhóm lửa bằng bật lửa, củi thì nhặt cành khô; không dựng cảnh "biểu diễn kỹ năng" thừa.
- **Hình học vật dựng phải tả rõ trong prompt** (lều chữ A: cành tựa vào sào ở mặt trước và mặt sau, mái chạy dọc theo
  sào). Không tả thì GPT vẽ hai vách chéo ở hai đầu sào.
- **Thời tiết và đồ trên người phải liên tục**: ghi giờ và mây trong mọi prompt; ghi rõ "no backpack" / "bare arms" vì
  Muse hay tự gắn ba lô, GPT hay thêm áo len.
- **Muse hay kéo máy vào cận mặt** dù prompt ghi "fixed camera". Cảnh cần thấy đồ vật thì để cận đồ vật, không có mặt.
- **Thang QA cả video viết cho reel dọc**, nên chấm thấp các đoạn giữa tập 16:9 (thiếu móc mở đầu). Dùng QA để tìm lỗi
  cụ thể, quyết định cuối là mắt người xem.
- **Chưa lồng giọng tạm.** Lời dẫn và chữ đè làm một lần khi có key ElevenLabs.
