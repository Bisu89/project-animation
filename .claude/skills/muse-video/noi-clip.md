# Nối clip, giới hạn của Muse, làm video hấp dẫn

## 1. Nối hai clip: chỉ có 2 cách chắc ăn
- **(a) Nối liền:** khung đầu clip sau = **khung cuối thật** của clip trước. Khung đó phải là tư thế tĩnh hoặc vừa xong việc, không phải đang giữa hành động. Prompt mô tả chuyển động tiếp theo.
- **(b) Độc lập rồi cắt thẳng:** clip sau dùng ảnh riêng, canh góc máy và cỡ cảnh khớp tay, rồi cắt thẳng.
- **(c) Match-cut đổi trang phục / đổi trạng thái:** máy khóa cứng, cùng phòng, **mọi ảnh khung dùng CHUNG một tư thế rõ nét** (ví dụ tay phải giơ ngang vai, lòng bàn tay hướng máy). Mỗi clip mở và kết đúng tư thế đó, nối bằng `chuyen_canh=cat`. Người xem đọc là "cùng một khoảnh khắc, chỉ quần áo đổi".
  - Gen các ảnh khung bằng `Recreate exactly… Only change: <thứ cần đổi>` từ **một ảnh gốc duy nhất**. Tư thế giống hệt nhau *dễ khóa hơn* mỗi ảnh một dáng.
  - Kiểm bằng số trước khi gen clip: lệch nền giữa các ảnh < 10/255 thì match-cut sẽ ăn (Elise Style EP01 đo được 5–7/255).
  - Muse trả tư thế đó ở **0,0–0,6 s và lại ở ~8–9,9 s** (nó trải hành động ra hết 10 s, xem `loi.md`), nên đoạn dùng được là gần **trọn clip** — không cắt ngắn ở giữa được.
    Muốn ngắn hơn thì tăng tốc **đúng 1,25× (ra 30 fps) hoặc 2× (ra 48 fps)**, không dùng hệ số khác (giật, xem `dung-render.md` §3). 1,25× cho mỗi look ~6,6 s; 2× cho ~4,2 s.
  - Đặt chữ đè **thấp** (y ≈ 1450/1920): nhân vật toàn thân thì đầu sát mép trên, chữ ở trên che mặt.
  - Vật nhỏ cầm/đeo (túi nhỏ, ví) **hay mất sau cú xoay người** dù đã gen lại 3 lần. Look có vật nhỏ thì bỏ cú xoay, hoặc cắt trước cú xoay.
  - Kết quả tập thử Elise Style EP01: hiệu ứng ăn (3/3 chỗ nối khớp), lỗi còn lại là giật do tăng tốc sai hệ số — đã sửa bằng bảng trên.
- **Không** cho clip sau bắt đầu từ một khung *đang hành động* (giữa cú đấm, giữa bước chân) rồi mong Muse chuyển sang việc khác. Muse sẽ lặp lại đúng hành động đó. Ngoại lệ là cách (c): ở đó việc Muse lặp lại tư thế khung đầu **chính là** thứ ta cần.
- Hai tư thế đầu và cuối quá khác nhau về hình dáng thì mặt và tỷ lệ cơ thể sẽ trôi. Gặp vậy thì chia nhỏ hoặc bỏ đoạn nối.

## 2. Ít clip hơn thì nhất quán hơn
Lỗi lớn nhất thường là **mặt, da, tỷ lệ cơ thể trôi giữa các clip gen riêng**, không phải lỗi bên trong một clip.
Gộp các bước liên tục vào ít lượt quay thì đỡ trôi. Cảnh cần thấy mặt nên có ít điểm nối.
Cảnh cận tay, đồ vật thì nối nhiều cũng không sao.

## 3. Muse làm được gì, không làm được gì
| Hay hỏng | Làm thay bằng |
|---|---|
| Vật nhỏ lặp lại tự hiện hàng loạt (dây, giấy, hạt, đá) | Quay cận tay, mỗi clip 2–3 vật; khung cuối chỉ hơn khung đầu một chút |
| Khung, lưới, bạt dựng từ đầu (lều, mái hiên, phòng lưới) | Khung đầu đã dựng 70–90%, clip chỉ làm nốt bước cuối |
| Chuyển động hiếm và phức tạp (đu người lên, xoay người giữa không trung, đòn bẩy một tay) | Mở clip khi đã ở sẵn tư thế khó, bỏ đoạn vào thế. Muse hay "treo" ở tư thế đầu, hoặc tự đổi sang biến thể dễ hơn nhưng sai dạng |
| Dụng cụ, đồ vật đổi dáng hoặc màu ở nửa sau clip | Lấy đoạn đầu (0–6 s); NEGATIVE ghi "no tool changing shape" |
| Cảnh tối rồi bật đèn | Không làm, vì cả khung bị ám cam |
| Lia vòng lâu | Lấy 5 s đầu, làm chậm thành 6 s |
| Bóng bay xẹp dần | Cho chọc kim nổ |
| Muse kéo máy vào cận mặt | Cảnh cần thấy đồ thì quay cận đồ, không có mặt |

Lưới khung tĩnh có thể **trông ổn dù chuyển động thật lại sai**, nhất là cảnh kéo hay đu người. Những cảnh này phải xem chạy thật.

## 4. Làm video hấp dẫn (luật cứng)
- **Phim dài: 1–3 phút đầu quyết định người xem có ở lại không.** Phải có hook, nhân vật tự giới thiệu và dự định của series, lời dẫn kể liên tục (chi tiết: `.claude/skills/elise/video-dai.md` §0).
- **Hook trong 1–2 s đầu:** mở bằng hành động hoặc thành phẩm, không mở bằng cảnh đứng chờ. Cắt 0,5–1 s đầu nếu chỉ có tư thế đứng yên.
- **Cảnh giữ tĩnh không quá 3–4 s** trong bản cuối, kể cả khi clip gốc giữ đẹp được 10 s. Giữ càng lâu điểm càng tệ (Marek: giữ 3,5 s được 50 điểm, giữ 7 s chỉ còn 44).
- **Khóa bối cảnh trong một tập:** sàn, tường, góc máy không được nhảy. Ảnh clip sau luôn gửi kèm ảnh clip trước.
- **Cắt sang tư thế hoặc cảnh khác hẳn thì cần một tín hiệu:** chữ đè (tên bước, level, "Day 2"), mờ qua đen, hoặc lời dẫn. Không có gì báo hiệu thì người xem khó hiểu.
- **Âm thanh viết theo nội dung** từng clip (va chạm, nước, đất, gỗ…), không lặp một công thức "nhạc nền + tiếng thở" cho mọi clip.
- Tư thế kết nên là tư thế Muse giữ được ổn định thật (chân hoặc tay chạm đất rõ, trọng tâm hợp lý), hơn là tư thế bay người.
