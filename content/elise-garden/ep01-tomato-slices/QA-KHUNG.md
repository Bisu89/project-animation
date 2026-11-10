# QA bộ khung tập 01

2026-11-04: bộ 01 rằn ri–cam được dùng sau phản hồi “ổn rồi tiếp tục”. Đã tạo và tự xem từng ảnh bằng built-in image_gen. Prompt chính xác trong `gen-anh.csv` và `image-prompts.json`; ảnh đã chép vào `anh/`, không chỉ để ở thư mục Codex.

| Nhóm | Các ảnh đang dùng | Kết quả / lưu ý |
|---|---|---|
| Nhận diện | `eg1-A-elise-truoc.png` | Ảnh chính diện bộ rằn ri–cam, sao từ mẫu 01 |
| Đặt lát | `eg1-B0-dat-lat.png` → `eg1-B1-lat-xong.png` | Cùng bàn, khay, mặt và trang phục; lát đặt vào hai ô trước bên trái |
| Phủ / tưới | `eg1-B2-phu-dat.png` → `eg1-B3-tuoi-khay.png` | Thìa về hộp khi cầm bình, bình không nhân đôi, giá thể có sẵn |
| Nảy mầm | `eg1-C2-mam-dung-o.png` | Sửa ảnh C ban đầu vì mầm mọc cả ô chưa gieo; bản đang dùng chỉ mọc hai ô đã đặt lát |
| Cây con | `eg1-D-cay-con.png` | Hai cây con có lá thật tại đúng hai ô; không mọc thêm ngoài khay |
| Giàn | `eg1-E0-ha-gian.png` → `eg1-E1-gian-xong.png` | Một giàn ráp sẵn, hạ xuống đất; chậu, bình và cây ươm có sẵn |
| Trồng / tưới | `eg1-E2-trong.png` → `eg1-E3-tuoi-chau.png` | Cây ở giữa chậu; chậu ươm rỗng còn bên trái; bình tưới chỉ xuất hiện một lần |
| Các giai đoạn | `eg1-F1-hoa.png`, `eg1-F2-qua-xanh.png`, `eg1-G-thanh-pham.png` | Giữ chậu, giàn và bố cục. Cắt thời gian giữa trạng thái; không morph cây lớn lên trong một clip |

Toàn bộ có 14 ảnh tham chiếu/khung đang dùng (kể cả A và G), cộng ảnh C ban đầu không dùng trong dựng. Ảnh nảy mầm/cây con là góc bàn rộng; lúc dựng crop gần vùng khay để dễ đọc trên điện thoại. Đây là QA khung tĩnh, chưa thay thế QA chuyển động.

## Ghi chú clip

- Clip 1: tool báo đạt; xem lưới 2 khung/giây thấy đuôi tự thêm lát và zoom. Chỉ dùng 0–1,9 giây, giữ thao tác đặt đầu.
- Clip 2: tool báo đạt; đoạn đầu dành nhiều thời gian lấy thìa. Dùng 3,5–6,5 giây để giữ thao tác phủ đất.
- Clip 3: Enter chưa gửi, ảnh/prompt còn nguyên trong ô soạn. Đã xác minh đúng clip rồi bấm nút Send một lần; tải bằng `--chi-tai`, không gửi yêu cầu mới. Tool báo đạt. Xem lưới thấy nhiều động tác lấy đồ và chạm đĩa không cần thiết, chỉ dùng 5,8–7,3 giây đang phun nước.
- Clip 4: cả hai bản nguồn trượt QA. Bản 2 có tay ở giữa và cây đổi kích thước đầu clip; đã xem toàn bộ lưới và chọn 6,8–8,3 giây ở bản 2, mầm xanh thấp, không có tay trong đoạn dùng.
- Muse Garden: `chrome-profile-4`, cổng 9337, chat được ghi trong `../muse-chat.json`; đã xác nhận ô chat hiển thị sau đăng nhập.

## Bản dựng để chủ dự án xem

Đã có đủ 11 clip và ghép [video/final.mp4](video/final.mp4). Tập dài **28,733 giây**, 1080 × 1920, 30 fps, H.264 + AAC stereo 44,1 kHz; khoảng 21,7 MB. Đã xem lưới toàn video ở 2 khung/giây, kiểm tra mốc chuyển cảnh, nhãn và crop; chưa chấm điểm QA tự động toàn bản dựng.

| Clip | Khoảng nguồn dùng | Ghi chú |
|---|---|---|
| 1 | 0–1,9 s | Đặt lát trước khi tự thêm lát và zoom |
| 2 | 3,5–6,5 s | Chỉ giữ phủ giá thể, bỏ lấy thìa |
| 3 | 5,8–7,3 s | Chỉ giữ phun nước |
| 4 | 6,8–8,3 s, bản 2 | Tránh đoạn mầm biến đổi và tay lạ |
| 5 | 0–2 s, bản 2 | QA đạt, không tay; crop gần khay |
| 6 | 0–2,5 s | Hạ giàn, QA đạt |
| 7 | 4,2–6,5 s, bản 2 | Bản nguồn trượt vì chậu ươm biến mất rồi hiện lại ở đầu. Đoạn dùng bắt đầu khi chậu rỗng đã ở bên trái; giữ hạ bầu và vun gốc, giàn còn nguyên. Lược bỏ bước lấy cây bằng cú cắt |
| 8 | 5,3–7,3 s | Giữ tưới, bỏ cúi lấy bình; QA nguồn đạt |
| 9 | 0–2 s | Cây có hoa, QA đạt |
| 10 | 0–3 s | Quả xanh, QA đạt |
| 11 | 0–7 s | Quả xanh–cam–đỏ, QA đạt; crop gần hơn sau 3 giây |

Không tăng tốc các đoạn đã chọn. Cắt thẳng giữa các mốc nhiều ngày; nhãn “Days later”, “Weeks later”, “Fruit setting”, “Ripening”, cùng nhãn “AI garden visualization”. Khung cây con crop 2 lần để người xem đọc được khay. Cảnh cuối crop nhẹ 1,08 lần; không gen lại ảnh hoặc thêm quả lúc dựng.

Âm thanh lấy từ clip Muse, chưa thêm nhạc hoặc giọng đọc. Đã tăng 8 dB và giới hạn peak; đo bản cuối mean -33,7 dB, max -4,6 dB, có tiếng và không chạm 0 dB. Chưa nghe/chép lời toàn bộ track; kiểm tra âm thanh hiện tại là kiểm tra kỹ thuật.

Trạng thái: **đã hoàn thành bản dựng để xem, chờ chủ dự án chốt**. Chưa xuất bản. Giữ nguồn/nháp để sửa đến khi chốt theo quy trình bàn giao.
