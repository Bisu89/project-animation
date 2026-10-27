# Phân tích kênh Basically-Primitive — công thức nội dung

Ngày phân tích: 2026-10-27. Nguồn: danh sách 82 video lấy bằng yt-dlp (lượt xem là ảnh chụp tại thời điểm tải), 10 video nhiều view nhất tải 720p, transcript tạo bằng Whisper base.en, 12 khung hình mẫu mỗi video, kèm doc chiến lược "How We Managed" của bạn để đối chiếu.

Dữ liệu thô nằm ở `content/basically-primitive/`: `list.txt` (82 video), `top10.txt`, `transcripts/*.txt`, `frames/`, `raw/` (mp4 + info.json).

## 1. Giới hạn của phân tích (đọc trước)

- Chỉ xem 10/82 video, chọn theo view cao nhất, nên có thiên lệch "chọn người thắng". Không so được với video thất bại ngoài bảng số liệu.
- Không có dữ liệu retention, CTR, nguồn traffic. Mọi kết luận về "cái gì giữ người xem" là suy luận từ cấu trúc, chưa kiểm chứng.
- Transcript do Whisper base.en nên có lỗi tên riêng (ví dụ tên bộ tộc, tên loài). Chỉ dùng để phân tích cấu trúc và nhịp, không dùng để trích dẫn sự kiện.
- Lượt xem phụ thuộc tuổi video. So sánh giữa các nhóm độ dài bị nhiễu vì video ngắn đều là video cũ, video dài là video mới.
- Phụ đề YouTube bị giới hạn 429 nên không lấy được; không có bản transcript chính chủ để đối chiếu.

## 2. Bức tranh kênh (82 video)

| Chỉ số | Giá trị |
|---|---|
| View trung vị | 8.700 |
| 3 video đứng đầu | chiếm 51% tổng view của cả kênh |
| Video số 1 | "Why Did Ancient Humans Evolve In Africa", ~1M |
| Nhịp đăng gần đây | cách 1–3 ngày một video (3h, 2d, 3d, 4d, 5d trước) |

Kênh chuyển format rõ rệt: khoảng 4–5 tháng trước là video 7–10 phút, từ khoảng 3 tháng trước đa số là 17–27 phút.

| Nhóm độ dài | Số video | View trung vị | Cao nhất |
|---|---|---|---|
| dưới 12 phút | 24 | 3.450 | 665K |
| 12–20 phút | 32 | 6.650 | 1M |
| từ 20 phút | 26 | 17.500 | 419K |

Đọc thận trọng: nhóm dài có trung vị cao hơn, nhưng hai trong ba video "đột phá" lại là video ngắn (7:35 đạt 665K, 7:52 đạt 129K). Kênh có tính "trúng lớn": view tập trung vào vài video.

Kiểu tiêu đề: "Why" có trung vị 9.700, "How" 7.200, các từ hỏi khác (What/When/Did/Who) 7.200. Chênh nhỏ, mẫu ít, không kết luận được. Tiêu đề chứa "Ancient Humans" (40 video) có trung vị 4.900, thấp hơn trung vị cả kênh, nên cụm này không phải chìa khóa. Ngoài ra Egypt (6 video, trung vị 18K) và Medieval (2 video, 28K) cao hơn nhưng mẫu quá nhỏ.

## 3. Công thức tiêu đề

- Luôn là một câu hỏi trực tiếp, chữ thường, không viết hoa gây sốc, không ngoặc cảm thán.
- Hỏi về điều mà người xem tưởng đã biết hoặc chưa bao giờ nghĩ tới: "vì sao người tiền sử tiến hóa ở châu Phi", "người cổ đại có bị ung thư không", "vì sao con người yêu mèo".
- Câu hỏi nhỏ, cụ thể, gắn với cơ thể hoặc đời sống hằng ngày (mắt xanh, kinh nguyệt, râu, lông mu) thường nằm ở nhóm view khá. Câu hỏi nguồn gốc lớn (châu Phi, thần linh) có trần cao nhất.

## 4. Công thức mở đầu (30–60 giây đầu)

Mẫu lặp lại gần như giống hệt trong cả 10 video:

1. **Câu đầu ngôi thứ hai, thì hiện tại, đặt người xem vào một cảnh quen thuộc**: nhìn quả địa cầu, nhìn vào gương, ngồi trên ghế sofa với con mèo, đi trên phố La Mã, mở ngăn kéo trong phòng tắm. Hoặc ngược lại, ném người xem vào quá khứ ("bạn là một người săn bắt hái lượm cách đây 50.000 năm").
2. **Một sự thật phản trực giác trong 15 giây đầu**: mọi người mắt xanh có chung một tổ tiên, mắt thật ra không có sắc tố xanh, ung thư không phải bệnh của con người, mèo gần như chưa được thuần hóa.
3. **Đối chiếu hiện tại với 99,9% lịch sử hoặc 300.000 năm** (cụm "99.9% of human history" xuất hiện trong cả hai video ngắn top đầu, "300,000 years" ở 5/10 video).
4. **Hứa hẹn câu trả lời bằng một danh sách gây tò mò** ("câu trả lời liên quan đến…" và liệt kê 3–4 thứ lạ).
5. **Chuyển sang nội dung bằng một câu cố định**: kiểu "Let's start with…". Bước 4–5 thường nằm trong khoảng 30–45 giây.

## 5. Cấu trúc thân video (rút ra từ transcript)

- Chia theo "nguyên nhân" hoặc theo "mốc thời gian", mỗi đoạn mở bằng một mệnh đề đơn giản rồi leo thang thành điều bất ngờ hơn ("Nhưng đây mới là phần không ai ngờ").
- Cụm từ lặp: "no one / nobody", "the answer", "survival", "predator", "terrif-" (18 lần ở 6 video). Giọng kể nhấn mạnh nguy hiểm, sinh tồn, bị săn, dù tiêu đề thì trung tính.
- Mỗi tập gắn khái niệm lớn vào một câu chuyện cụ thể: bản quét CT xương khủng long 77 triệu năm (video ung thư), đứt gãy kiến tạo ở Đông Phi, nghiên cứu về một bộ tộc đo số kỳ kinh. Nhưng nội dung chủ yếu là kể chuyện tiến hóa/lịch sử rộng, không bám một trường hợp khảo cổ duy nhất như video mẫu "đau răng" trong doc của bạn.
- Số liệu và tên nghiên cứu được nêu ra để tạo cảm giác có cơ sở, nhưng không thấy nhãn phân biệt "bằng chứng" với "suy đoán" trong giọng kể. Kết luận thường đưa ra khá chắc chắn.

## 6. Công thức kết

Cả 10 video kết theo đúng một mẫu:

1. Quay lại "bạn" ở hiện tại: bạn đang ngồi trong căn phòng ấm, cơ thể bạn được thiết kế cho một thế giới đã biến mất.
2. Một câu cô đọng mang tính cách ngôn (tập mèo, tập châu Phi, tập kim tự tháp đều có).
3. **Câu outro cố định, nguyên văn giống nhau ở cả 10 video**, xin người xem đăng ký để "tài trợ cho video tiếp theo", gần như không có kêu gọi like, bình luận, hay gợi video khác (một tập chỉ báo hai tập sau).

## 7. Nhịp kể và dựng

| Chỉ số | Video dài (18–26 phút) | Video ngắn (7–8 phút) |
|---|---|---|
| Tốc độ nói | 165–180 từ/phút | 207–222 từ/phút |
| Số từ | 3.100–4.300 | 1.600–1.700 |
| Cắt cảnh | ~3,7–4,3 giây một cảnh (đo 3 video) | ~3,7 giây |

Video ngắn nói nhanh hơn rõ rệt và gần như không có đoạn nghỉ. Doc chiến lược của bạn ước tính 110–140 từ/phút; kênh này nhanh hơn hẳn, nên cùng độ dài thì kênh này nhồi nhiều nội dung hơn khoảng 30–50%.

## 8. Phong cách hình ảnh (từ 12 khung mỗi video)

- Nhân vật người que đầu tròn, nét mực đen đơn giản, biểu cảm phóng đại (mắt tròn, miệng há, "!!!"). Có nhân vật chính cố định theo từng tập (ví dụ tóc cam ở tập về trẻ em), không phải một cặp nhân vật xuyên suốt toàn kênh.
- Hai chế độ nền: cảnh diễn có nền màu phẳng kiểu vẽ tay (trời, mây, cây lặp lại, nhiều khoảng trống), và cảnh giải thích nền trắng có bản đồ, sơ đồ, nhãn chữ in hoa, số liệu viết tay màu đỏ.
- Hay dùng ẩn dụ hình ảnh một khung (tảng đá lăn, dấu hỏi khổng lồ, hộp sọ nền trắng kèm chữ).
- Nền và chi tiết trông giống ảnh tĩnh tạo bằng AI ghép với chuyển động đơn giản. Đây là nhận định thị giác từ khung hình, chưa xác minh được quy trình thật của chủ kênh.

## 9. Đối chiếu với doc chiến lược "How We Managed"

| Điểm trong doc của bạn | Basically-Primitive cho thấy gì |
|---|---|
| Tiêu đề câu hỏi bình tĩnh, tránh "TERRIFYING" (H3) | Tiêu đề của kênh này đúng là câu hỏi trơn, không viết hoa gây sốc, và video số 1 đạt ~1M. Ủng hộ H3, nhưng giọng kể trong video thì dùng nhiều từ gây sợ, nên "bình tĩnh" ở tiêu đề không đồng nghĩa bình tĩnh ở nội dung. |
| Video theo 1 ca cụ thể giữ retention tốt hơn chủ đề chung (H1) | Không kiểm chứng được: không có retention. Các video top của kênh này nói chủ đề rộng. Trường hợp cụ thể chỉ xuất hiện như một cảnh trong tập. |
| Nhãn Evidence/Explainer/Best guess không làm giảm retention (H2) | Kênh này không dùng hệ thống nhãn nào và vẫn đạt view cao. Chưa biết là nhờ không có nhãn hay bất chấp việc không có. Đây là khác biệt thật của bạn, chưa có bằng chứng bên ngoài cho thấy nó giúp hay cản. |
| Cặp nhân vật Nod/Kua, đoạn "The Cost" | Kênh này không có cặp xuyên suốt hay đoạn tương tự. Là điểm khác biệt hữu hình, nhưng mất đi tính "hài, phóng đại" vốn đang thắng ở kênh tham chiếu. |
| Dài 8–11 phút | Hai video ngắn top đầu (7:35 và 7:52) đạt 665K và 129K, nên 8–11 phút không phải hạn chế. Nhưng kênh này đã chuyển sang 18–27 phút ở các video gần đây, chưa rõ vì lý do thuật toán hay vì chiến lược. |
| Nhịp đăng 10–14 ngày | Kênh này đăng cách 1–3 ngày gần đây. Nếu đúng quy trình ảnh tĩnh AI, đó là lợi thế sản xuất mà kế hoạch 10–14 ngày với rig nhân vật và storyboard chi tiết khó đạt. |
| Hook song song Kua/Nod ở 30 giây đầu | Mở bằng "bạn" ở thì hiện tại, vào thẳng cảnh. Cách này không cần cặp nhân vật để tạo song song hiện đại/cổ đại, có thể mượn nhịp 30–45 giây đầu. |

## 10. Gợi ý áp dụng (cần bạn quyết)

1. Mượn khung mở đầu 5 bước (mục 4) cho mọi tập, nhưng viết lại bằng lời của kênh bạn, không chép cụm từ.
2. Cân nhắc rút ngắn câu hỏi trung tâm xuống một câu đời thường, cụ thể, như các tiêu đề đang thắng, thay vì câu dài như "How Did Anyone Know Which Water Wouldn't Kill Them?".
3. Giữ hệ thống nhãn của bạn như một điểm khác biệt, nhưng coi đó là thử nghiệm và theo dõi retention từ 6 video đầu đúng như mục F trong doc.
4. Tốc độ 165–180 từ/phút là mức người xem kênh này chấp nhận; 110–140 có thể làm video của bạn chậm hơn thị trường. Cần thử.
5. Câu kết nên quay lại "bạn" ở hiện tại và chốt bằng một câu cô đọng. Phần kêu gọi hành động của bạn không nhất thiết phải giống kênh này.
6. Phân tích thêm 10–20 video view thấp để biết video thất bại khác gì, vì mẫu hiện tại chỉ có video thắng.
