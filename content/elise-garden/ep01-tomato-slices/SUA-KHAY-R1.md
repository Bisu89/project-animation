# Sửa tập 01: gieo kín khay và không hiện lại cà chua

Yêu cầu chủ dự án: xếp kín khay thay vì chỉ hai ô; bỏ lỗi lát cà chua hiện lại sau khi đã phủ.

Nguyên nhân bản trước: prompt chủ động giới hạn hai ô; ảnh tham chiếu và đĩa còn lát đỏ, clip tưới còn thao tác với đĩa. Đây là sai lệch nội dung, không chỉ lỗi cắt.

Chuỗi sửa: bắt đầu xếp → đầy hàng trước → đầy cả 10 ô → phủ hàng sau → phủ kín cả khay → tưới khay phủ kín → mầm/cây con ở toàn khay. Sau khi xếp xong, đĩa phải rỗng và giữ rỗng. Ô đã phủ không bao giờ lộ đỏ trở lại.

Sửa trực tiếp theo yêu cầu, không cần duyệt lại nội dung tập cũ. Giữ nguyên trang phục, bối cảnh và phần chậu cà chua phía sau. Dùng tên ảnh/clip mới để Muse không dùng lại ảnh cũ; bản video cũ giữ đến khi bản sửa được kiểm tra.

Ảnh dùng built-in image_gen. Prompt đầy đủ: `image-prompts-r1.json`. CSV sản xuất mới: `gen-anh-r1.csv`, `gen-video-r1.csv`. Trạng thái: đang tạo ảnh và sửa clip.

Hai lần render xếp năm lát liên tục vẫn lỗi: có lát tự xuất hiện hoặc cuối clip chưa đầy khay. Đổi cách dựng trong cùng nội dung đã yêu cầu: lấy thao tác đặt lát đầu sạch, cắt thời gian sang khay đã có chín lát, quay riêng đặt lát thứ mười; sau khi cho thấy cả khay đầy, phủ ô đầu rồi cắt thời gian sang phủ ô cuối. Không trình bày như một shot liên tục đã thể hiện đủ từng lượt. Ô đã phủ phải luôn giữ phủ; đĩa rỗng từ sau khi xếp xong. Prompt ảnh bổ sung trong `image-prompts-r2.json`; clip thay dùng đuôi `-r2`, không dùng clip xếp năm lát đã lỗi.
