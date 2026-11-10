# Camping Diary (Korean Girl Camping Vlog): kế hoạch series

> **Trạng thái: concept nháp, CHƯA DUYỆT.** Theo `CLAUDE.md`, mỗi tập cần duyệt nội dung rõ ràng trước khi gen ảnh/video.
> Dựng từ một master prompt chủ dự án gửi (2026-11-09). Tài liệu này là bản rút gọn + sửa theo kinh nghiệm thật của
> pipeline GPT+Muse (`docs/muse-video-pipeline.md`), không copy lại nguyên văn master prompt.

## 1. Concept

Một nữ vlogger cắm trại người Hàn, 25 tuổi, tự quay cảnh cắm trại bằng điện thoại — đời thường, không màu quảng cáo,
không dáng người mẫu. Định dạng dọc 9:16.

**Giống Elise Wild** (nhân vật cố định, kể lại một hoạt động thật, nhiều tập) nhưng khác ở chỗ: Elise Wild là bối cảnh
sinh tồn rừng núi hư cấu; Camping Diary là vlog đời thường cạnh bờ sông, nhịp ngắn kiểu reel.

### Chiến lược đăng (chủ dự án chốt, 2026-11-09)

- **Một nhân vật khóa duy nhất**, dùng chung cho mọi short và tập dài.
- **Định dạng chính: short 9:16** (30-60 giây) đăng Instagram Reels + YouTube Shorts.
- **Có 1 tập dài trên YouTube** (kênh ngang hoặc dọc dài hơn) mà các short dẫn link về (caption/bio/thẻ cuối short).
  Tập dài kể cùng buổi chiều cắm trại đó nhưng đầy đủ hoạt động hơn, nhịp thật hơn (không phải montage dồn nén như short).
- Tập 01 (`ep01-riverside-afternoon/NOI-DUNG.md`, 30 giây, đã có bảng nhịp) chính là **short đầu tiên**, giữ nguyên nội
  dung đã lên — không cần đổi vì quyết định này không ảnh hưởng tới bảng nhịp, chỉ ảnh hưởng tới việc có làm thêm tập
  dài đi kèm.
- **Thứ tự khuyến nghị:** làm xong short tập 01 (nhỏ, nhanh, ít rủi ro) trước để chốt nhân vật + trại đã khóa đúng
  chưa, rồi mới mở rộng ra tập dài cùng thế giới đó. Tập dài có thể dùng lại các cảnh đã gen (lửa, cà phê, lều...) và
  thêm cảnh mới, không cần làm lại từ đầu.

## 2. Nhân vật cố định

- Nữ, Hàn Quốc, 25 tuổi. Mặt oval, mắt nâu đậm, tóc đen dài buộc đuôi ngựa cao, vài sợi tóc xõa hai má. Thân hình mảnh,
  khỏe, cân đối tự nhiên. Trang điểm tối giản.
- Tính cách: vui vẻ vừa phải (không lố), độc lập, hơi vụng về lúc làm việc khó, thoải mái ở một mình ngoài trời. Không
  cười liên tục vào máy — có lúc tập trung, có lúc mệt, có lúc hài lòng lặng lẽ.
- **Trang phục tập 01 (khóa, không đổi giữa tập):** áo cardigan len dệt dày màu kem, áo thun cotton trắng bên trong,
  quần cargo kaki đậm, giày da leo núi nâu, bông tai tròn nhỏ màu vàng.

**Cách khóa nhận diện mặt — khác với mô tả trong master prompt gốc (section 2/12):** không tự tạo độc lập 8 ảnh góc
(chính diện/3-4/trái/phải/toàn thân trước-cạnh-sau/selfie) từ 8 lần sinh ảnh riêng. Theo đúng bài học từ Elise DIY/Wild:
**nhận diện khuôn mặt do ảnh tham chiếu quyết định, không do prompt chữ quyết định** — sửa prompt không "ăn" nếu ảnh
sai. Quy trình đúng:

1. Sinh **một ảnh gốc duy nhất** (chính diện, ánh sáng trung tính) → chủ dự án duyệt mặt trước khi làm gì khác.
2. Các góc khác (3/4, nghiêng, toàn thân, selfie) sinh **từ chính ảnh gốc đó** (image-edit/img2img giữ seed), không
   sinh lại từ mô tả chữ.
3. Mọi ảnh khung đầu/khung cuối của 8 cảnh cũng chèn ảnh gốc này làm `anh_tham_chieu` cố định, giống cách elise-diy/elise-wild
   đang làm (cột `anh_tham_chieu` trong `gen-video.csv`).

Bộ ảnh tham chiếu rút gọn, chỉ giữ cái thật sự cần:
- 1 ảnh chân dung chính diện (ảnh gốc, khóa nhận diện).
- 1 ảnh toàn thân đứng thẳng (tỉ lệ cơ thể, trang phục đầy đủ).
- 1 ảnh góc selfie cầm điện thoại (dùng riêng cho cảnh mở đầu).

Không cần ảnh nghiêng trái/phải/sau riêng — các cảnh trong tập 01 không cần góc đó; thêm khi tập sau thực sự dùng tới.

## 3. Bối cảnh trại cố định

Bờ sông nông chảy chậm, rừng thông, cỏ + đất nén, nắng chiều muộn. Layout cố định trong toàn tập 01 (không dịch chuyển
đồ vô lý giữa cảnh):

- Lều dome nhỏ — **bắt đầu dựng nửa chừng (cảnh 2), dựng xong trước cảnh tối (cảnh 7-8)**.
- Bàn xếp + ghế xếp cạnh lều.
- Khu nấu (bếp cồn/bếp gas mini, không đốt lửa trần trừ khu lửa trại riêng) cách lều một khoảng an toàn.
- Khu lửa trại riêng, cách cây thấp và dây đèn.
- Ấm kim loại, cốc inox, dripper cà phê, thớt gỗ, dao nhỏ, túi tote vải, dây đèn dây (bật tối — **không dùng cảnh tối
  rồi bật công tắc**, theo bài học Elise DIY tập 02-04: ánh sáng trước/sau công tắc khác hẳn nhau, Muse vẽ sai).
  → Nếu muốn có cảnh đèn sáng, để nó là cảnh cuối, không dựng pha "bật đèn" giữa tập 30 giây này.
- Ánh sáng tiến triển logic: chiều muộn (cảnh 1-6) → hoàng hôn (cảnh 7) → tối nhẹ còn ánh chiều (cảnh 8, không cần tối hẳn).

## 4. Ngôn ngữ máy quay (rút gọn từ master prompt, giữ nguyên tinh thần)

- Selfie cầm tay: chào, đi bộ, khoe trại.
- Tripod tĩnh: dựng lều, nấu, ngồi cạnh sông.
- Máy để trên bàn: pha cà phê, cắt đồ ăn cận cảnh.
- Cầm tay cận cảnh: tay làm việc, lửa, đồ ăn.
- ~80% cảnh quay kiểu "tự quay đời thường", ~20% có bố cục đẹp hơn một chút. Không lia máy kiểu điện ảnh, không zoom số, không camera xuyên vật.

## 5. Nguyên tắc sản xuất

Giữ đúng 12 nguyên tắc trong master prompt (chân thực hơn hoành tráng; nhân vật ổn định; một hành động chính mỗi
clip; máy quay hợp lý vật lý; sự không hoàn hảo đời thường là điểm cộng; vật lý phải đúng; địa lý trại phải nhất quán;
ánh sáng tiến triển hợp lý; không hiệu ứng điện ảnh thừa; thà đơn giản tin được hơn phức tạp dễ hỏng; AI ra là nguyên
liệu cần duyệt, không phải sản phẩm cuối; hệ thống phải dùng lại được cho tập sau). Cộng thêm, rút ra từ pipeline thật:

- **Mỗi clip Muse chỉ một hành động chính** (bài học Elise DIY tập 01). Cảnh nào master prompt gộp 2 hành động
  (ví dụ "chào rồi xoay máy lộ cảnh", "cầm xiên quay + cười") cần tách bớt — xem phần rủi ro theo cảnh ở
  `ep01-riverside-afternoon/NOI-DUNG.md`.
- **Không để nhân vật đứng cầm đồ đung đưa chờ hết clip** — khung cuối luôn là lúc vừa xong việc, ghi rõ trong prompt
  "she never stands idle swaying with an item in her hands" (bài học Elise DIY tập 02-04).
- **Lửa/khói khó kiểm soát nhất** — Muse hay tự loang/tự lớn dần vật nhỏ biến đổi hình dạng (như sơn/kẻ vàng tự loang ở
  Elise DIY tập 07-11). Hai cảnh có lửa (cảnh 3, cảnh 6) nên bắt đầu từ lửa đã cháy nhỏ sẵn, clip ngắn, cắt trước khi lửa
  đổi hình.
- **Tay cầm dao/vật nhỏ là nhóm rủi ro cao nhất về giải phẫu tay** — cảnh cắt rau chỉ nên có 2-3 nhịp dao, không đếm số
  miếng cắt chính xác.
- **Lời nói đồng bộ miệng chưa kiểm chứng được với pipeline hiện tại** (Elise Wild cũng đang để trống lồng giọng vì
  chưa có key — xem `docs/muse-video-pipeline.md` mục "Chưa lồng giọng tạm"). Cảnh chào mở đầu nên là phản ứng không
  lời (cười, vẫy tay), lời dẫn/phụ đề thêm sau ở bước dựng, không bắt Muse tạo khẩu hình khớp câu tiếng Hàn.
- **Chuyển cảnh:** nối liền dùng `chuyen_canh = mo`; nhảy thời gian hoặc đổi hẳn khu vực dùng `mo_dai` (bài học tập 12).

## 6. Việc còn cần chủ dự án quyết định

1. **Tên thư mục/series:** tạm đặt `content/camping-diary/`. Giữ tên này hay đổi?
2. **Giọng nói tiếng Hàn:** vibi.pro/ElevenLabs hiện dùng cho Elise Wild là giọng tiếng Anh (Jessa/Jane). Chưa xác minh
   có giọng tiếng Hàn tự nhiên hay không — nếu không có, short/tập dài nên làm không lời (chỉ tiếng môi trường) hoặc
   phụ đề trước, bỏ câu chào/lời dẫn tiếng Hàn trong master prompt tới khi xác nhận được.
3. **Độ dài tập dài:** master prompt gợi ý 2 mức — vlog 3-5 phút hoặc tập đời thường 10-15 phút. Làm mức nào trước?
   (3-5 phút ít rủi ro hơn, làm nhanh hơn; 10-15 phút giống quy mô Elise Wild, cần nhiều cảnh + narration hơn).

**Đã chốt (2026-11-09):** 1 nhân vật khóa dùng chung; short (Reels/YouTube Shorts) là định dạng chính, có 1 tập dài
YouTube mà short dẫn link về; làm short tập 01 trước, tập dài làm sau dựa trên cùng nhân vật/trại.
