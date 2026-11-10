# Bài học đã rút ra (series Marek Training)

## 1. Càng ít clip/điểm nối càng nhất quán — nhưng không phải thuốc chữa bách bệnh

Vấn đề lớn nhất làm điểm QA thấp luôn là mặt/da/tỷ lệ cơ thể **trôi giữa các clip gen riêng biệt**, không phải lỗi
trong một clip. Tập 01 đi từ 5 clip (QA 57-60, chủ dự án tự nhận ra "mặt bị thay đổi và cả da") xuống 2 clip (QA 64,
gần hết lỗi mặt/da) chỉ nhờ gộp các bước thành ít lần quay liên tục hơn.

Nhưng tập 03 cho thấy: **2 clip vẫn trôi nhiều nếu 2 tư thế đầu/cuối quá khác nhau về hình dáng** (combo đấm đứng
thẳng → đá xoay người giữa không trung): điểm "nhất quán" chỉ còn 5-7/10, thấp hơn hẳn tập 01/02 (9/10) dù cùng là
2 clip. Vậy quy tắc đầy đủ là: **ít clip VÀ clip sau phải bắt đầu đúng từ khung cuối thật của clip trước** (cùng
family tư thế, không nhảy cóc sang một tư thế/góc máy hoàn toàn khác) — xem bài học #2.

## 2. Clip sau phải nối thật từ clip trước, không phải "dán" 2 ảnh rời rạc

Tập 03 ban đầu: clip 1 kết ở tư thế đấm pivot (`mf-B...png`), nhưng clip 2 lại mở đầu bằng một ảnh đá hoàn toàn khác
(`mf-C...png`), gen rời, không liên quan tới khung cuối clip 1. Kết quả: nối vào thấy "chả liên quan" dù kỹ thuật
ghép (crossfade/cắt cứng) đã chỉnh đủ kiểu — **sai từ gốc nội dung, không phải lỗi dựng**.

Cách đúng: `khung_dau` của clip N+1 phải **là chính `khung_cuoi` (hoặc ảnh giống hệt) của clip N**, rồi mô tả chuyển
động tiếp nối từ đúng tư thế đó. Nếu muốn một động tác/tư thế hoàn toàn khác hẳn ở cuối mà không có cách nối tự
nhiên — thường tốt hơn là **bỏ hẳn clip nối thêm đó**, dừng ở tư thế đẹp cuối clip chính, còn hơn ghép một đoạn
không liên quan chỉ để video dài hơn hoặc "hoành tráng" hơn.

## 3. Luôn tự trích khung so trực tiếp với ảnh tham chiếu — đừng tin lưới khung hay QA tự động

Tập 02: nhìn lưới khung thumbnail thấy tư thế "giữ ổn định" nên đánh giá "khớp gần như y hệt ảnh gốc" — **sai**, chủ
dự án tự so và phát hiện tư thế khác hẳn (tay/chân sai vị trí hoàn toàn). Khi tự trích khung full-res và so cạnh
ảnh gốc mới thấy đúng là sai.

Ngược lại: QA tự động (GPT) của tool đôi khi chê một kết quả thực ra đúng (ví dụ: chê "tay chống gần thẳng, không
gập khuỷu" trong khi khung full-res cho thấy khuỷu gập rõ và khớp ảnh gốc). Nguyên nhân: QA tự động không phải lúc
nào cũng đáng tin cho chi tiết tư thế tinh vi.

**Quy tắc: với mọi tư thế quan trọng/khó, tự `ffmpeg` trích khung rồi `Read` so cạnh ảnh tham chiếu gốc trước khi
kết luận đạt hay không đạt — không dừng ở lưới thumbnail nhỏ hay điểm QA tự động.**

## 4. Một số chuyển động Muse không bao giờ dựng được — nhận ra sớm, đừng cố thêm lượt

- Chuyển động phức tạp/hiếm (crouch → one-arm elbow lever hoàn chỉnh; đứng → xoay người đá giữa không trung): Muse
  im lặng "treo" ở tư thế đầu suốt clip thay vì báo lỗi, HOẶC tự thay bằng một biến thể phổ biến hơn, gần giống
  nhưng sai cấu trúc (one-arm balance co gối thay vì elbow-lever duỗi thẳng).
- Nếu đã thử 2 lần (đúng hạn mức `muse_auto.py`) mà vẫn sai dạng chuyển động, đừng thử thêm lần 3 bằng cách gửi lại
  y nguyên — hoặc đổi hẳn cách tiếp cận (mở đầu đã ở trong tư thế khó, bỏ hẳn đoạn chuyển động không dựng được —
  giống quy ước có sẵn của Elise Talent), hoặc báo chủ dự án và dừng.
- Khi Muse "tự chọn" một biến thể khác thay vì làm đúng yêu cầu, hãy xem xét: biến thể đó có thể là tư thế **trong
  khả năng thật của model** (vd. đá cao đứng một chân giữ rất ổn định, thay vì đá xoay người giữa không trung) —
  nhưng nếu chủ dự án không thích hướng đó thì thôi, đừng cố ép Muse làm đúng ý tưởng ban đầu bằng mọi giá.

## 5. Viết prompt chuyển động theo kiểu "đạo diễn chuyển động" (áp dụng từ tập 03 trở đi)

Khi mô tả một chuyển động trong prompt video, nên rõ ràng theo thứ tự sinh học thay vì chỉ mô tả kết quả cuối:
- Nêu rõ **chân/tay trụ** (vd. "left leg as the fixed supporting foot planted flat on the floor, never sliding").
- Chia theo mốc giây rõ ràng (0.0-1.0s: ...; 1.0-2.0s: ...) thay vì một câu mô tả chung chung mơ hồ.
- Thêm **negative prompt** ngay trong câu: "never slides/teleports", "no extra limbs", "no morphing", "no loss of
  balance" — đặc biệt với chuyển động chân/thăng bằng.
- Luôn nhắc khung đầu phải nối đúng từ khung cuối clip trước (xem bài học #2).

## 6. Khác

- Đổi profile Chrome/tạo session Muse mới: sửa `profile`/`port` trong `muse-chat.json` của series, xoá `url` cũ —
  tool tự tạo thread mới ở lần chạy kế tiếp.
- Đừng thêm đồ họa kiểu game (vòng tròn sáng, bục đồ họa...) vào video Marek dù video mẫu/tham khảo có — Marek là
  video AI quay thật, pha đồ họo game vào sẽ lệch tông (trừ khi chủ dự án xác nhận muốn pha trộn phong cách).
- Muse timeout "quá thời gian chờ Muse trả video" là lỗi tạm thời của Muse, không phải QA trượt — chạy lại riêng
  clip đó (`--only N`) là đủ, không cần đổi cách tiếp cận.
