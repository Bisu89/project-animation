# Lỗi Muse/GPT hay gặp: phòng và cứu

Mỗi dòng: lỗi → cách phòng khi viết prompt hoặc ảnh → cách cứu khi dựng. Bản chi tiết theo từng tập Elise: `.claude/skills/elise/loi-thuong-gap.md`.

## Muse (video)
| Lỗi | Phòng | Cứu |
|---|---|---|
| Vật nhỏ tự hiện hàng loạt (hạt, đá, dây, gói hạt) | Quay cận tay, mỗi clip 2–3 vật; "appears only where her fingers place it" | Cắt trước mốc (thường giây 5–7) |
| Vật tự biến mất (gói hạt, thước dây, dụng cụ) | NEGATIVE "no objects vanishing"; vật nằm xa tay ít bị hơn | Lấy đoạn trước khi biến |
| Dụng cụ đổi dáng hoặc màu (khoan đổi màu, khung thành tấm ván, máy cắt cỏ đẩy tay thành máy xăng) | Tả dáng và màu dụng cụ trong CHARACTER/SCENE; NEGATIVE "no tool changing shape" | Lấy đoạn đầu; hỏng ngay từ đầu clip thì gen lại, khung hình chỉ có đúng vật đó |
| Mặt hay trang phục trôi, găng tay mất, tay áo mọc ra | Khối CHARACTER khóa cứng; ảnh tham chiếu trực diện | Cắt; trôi giữa nhiều clip thì giảm số điểm nối |
| Bề mặt đổi đồng loạt (đất tự phẳng, cỏ mọc trên đất trống) | "only the soil under the rake changes" | Cắt trước mốc |
| Muse tự cắt cảnh hoặc đổi góc giữa clip, QA không bắt | "One continuous shot, no internal cut" | Dò `scene>0.18`; dùng phần sau như một góc mới, nối bằng cắt thẳng |
| Đứng hình ở đầu clip 0,2–1 s | — | `freezedetect`, đặt điểm vào sau mốc đó |
| Đứng không, đung đưa ở cuối clip | Khung cuối là lúc còn làm; "never stands idle or sways" | Cắt đuôi |
| Kéo máy vào cận mặt, máy trôi | "Fixed camera, no zoom, no pan" | Cắt; cảnh cần thấy đồ thì quay cận đồ |
| Đi tới lui, đổi hướng | SHOTS theo giây, nói rõ một hướng đi | Lấy đoạn đi một mạch |
| Lặp lại hành động thay vì chuyển sang việc khác | Khung đầu là tư thế tĩnh, không phải đang giữa hành động | — |
| Người lạ xuất hiện | "Only this one woman/man is ever in the scene" | Cắt |

## GPT (ảnh)
| Lỗi | Phòng |
|---|---|
| Máy lùi xa hoặc tiến gần giữa hai khung | Câu khóa máy với ảnh thứ hai |
| Vật đổi dáng, đổi cỡ, xoay hướng (luống bị xoay 90°) | Câu khóa hình + hướng ("runs left-to-right across the frame") |
| Bộ lọc chặn "sexual" (quần short + cúi, xổm, quỳ chính diện) | Quay ngang hông hoặc cận tay; "She does not bend over"; "modest, wholesome" |
| Tự thêm tay áo len, áo khoác, ba lô; đổi màu găng | "bare forearms, no sleeves", "no backpack", ghi màu găng |
| Chữ méo trên nhãn, bao bì | Quay nghiêng, ghi "no letters"; chữ thật thêm lúc dựng |
| Gen lại mà nhận về y ảnh cũ | Xóa file trước khi gen; ảnh đã gửi Muse thì đặt tên mới |

## Đọc lỗi trước khi gen lại
1. Lỗi nằm ở **ảnh khung** (dáng sai, máy lệch)? Sửa ảnh trước. Gen lại clip mà ảnh vẫn sai thì vô ích.
2. Lỗi là **Muse làm hộ hàng loạt**? Đổi cách quay (cận hơn, ít vật hơn), đừng chỉ thêm câu FIX.
3. Lỗi chỉ ở **một đoạn** của clip? Cắt, không gen lại.
