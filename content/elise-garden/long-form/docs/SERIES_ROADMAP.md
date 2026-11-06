# Lộ trình series: sân gần nhà + lô sau

2026-11-06. **Bản đề xuất, chưa duyệt từng tập.** Mỗi tập vẫn phải gửi nội dung (danh sách nhịp có giây) và chờ duyệt trước khi sản xuất.

## Không gian
Sơ đồ tổng: [`references/gl1-R-so-do-tong.png`](../references/gl1-R-so-do-tong.png), vẽ bằng `tools/so_do_tong.py` từ `garden_layout.json → backLot`.

| Khu | Diện tích | Dùng cho |
|---|---|---|
| Sân gần nhà (EP01, đã render) | 12 × 12 m | Bãi cỏ sinh hoạt, 2 luống (thêm được 4), nhà kính áp rào, giàn leo, bếp nướng trên deck |
| **Lô sau**, qua cổng rào sau | ~20 × 25 m (500 m²) | ~20 cây ăn trái lùn (lưới ~3 m), ~20 m tường cây ép phẳng (espalier), ~20 m quả mọng và nho, chuồng gà, lán DIY, pergola và bàn ăn, ô ủ phân lớn, bồn nước mưa |

- Từ trong sân EP01, lô sau chỉ thấy là ngọn cây phía sau rào. Điều này khớp với 30 ảnh đã render, nên **không phải gen lại gì**.
- Sơ đồ tổng **không** gửi kèm khi gen ảnh EP01, để GPT không vẽ lô sau vào cảnh.

## Mạch các tập (đề xuất)
Mỗi tập có một việc lớn ở lô sau, và một lần quay lại sân để thấy luống rau lớn lên. Đó là phần thưởng liên tục cho người xem.

| Tập | Việc chính | Quay lại sân | Ghi chú cần kiểm chứng |
|---|---|---|---|
| EP01 | Dọn sân, 2 luống, gieo hạt | — | Đã có storyboard |
| EP02 | **Mở cổng sau**, phát lối đi qua lô hoang, trồng 4–6 cây ăn trái lùn rễ trần đầu tiên | Mầm củ cải đầu tiên | Cây rễ trần phải trồng khi còn ngủ đông, cuối đông đến đầu xuân (đối chiếu RHS/khuyến nông) |
| EP03 | DIY lán ươm / bàn làm việc có mái | Tỉa thưa mầm, gieo nối tiếp ở nửa trống của BED-02 | |
| EP04 | Hàng quả mọng + dây căng + giàn nho | Thu củ cải đầu tiên (nếu đủ ngày) | Thời gian từ gieo tới thu củ cải |
| EP05 | DIY chuồng gà + sân chạy | Luống xà lách, cải thìa | Quy định nuôi gà theo vùng; không nêu cụ thể |
| EP06 | Pergola + bàn ăn; **bữa tối từ vườn** | Thu hoạch rau | Đúng mùa của từng loại |
| Sau đó | Tường espalier, ô ủ lớn, bồn nước mưa, nhà kính, giàn leo, bếp nướng | | |

Cây ăn trái lùn mất vài năm mới cho quả. Không dựng cảnh thu hoạch quả trong năm đầu; nếu cần thì dùng chữ đè nói rõ thời gian.


## Ý tưởng tham khảo cho các tập sau (chủ dự án gửi 2026-11-06, "phát triển sau")
Ảnh nằm ở `references/moodboard/`, **chỉ để tham khảo nội bộ**. Ảnh chụp lấy từ một trang cho thuê nhà, không gửi kèm khi gen và không đăng lại.

| Ý tưởng | Đưa vào | Ghi chú |
|---|---|---|
| Lối đi rải sỏi hoặc dăm gỗ giữa các luống | EP02 hoặc EP03 (tập DIY rẻ, thấy biến đổi rõ) | Sỏi ít chi tiết vụn hơn cỏ nên AI vẽ ổn định hơn |
| Lưới 6 luống đầy dần qua các tập | BED-03/04 ở EP03–04, BED-05/06 sau đó | Vị trí đã có trong `garden_layout.json` |
| Nhà kính đặt sát khu luống | Khi làm nhà kính, dời từ kiểu áp rào sang cạnh lưới luống | Phải sửa `FUTURE_GREENHOUSE` trước tập đó |
| Góc máy cao nhìn xuống lưới luống | Dùng ảnh trên cao `gl1-R-aerial-S4` hoặc thêm góc từ deck | Nhà ranch một tầng: không có deck tầng 2 như ảnh mẫu |

EP01 giữ nguyên bối cảnh và các ảnh đã render.

## R5: đề xuất cho EP01 (chưa áp dụng)
Ở SH080 (cảnh kết), cho Elise liếc về cánh cổng sau trước khi đi vào nhà, thêm khoảng 2 s.
Đây là móc nhẹ sang EP02 mà không cần thêm lời. Muốn áp dụng thì tôi sửa SH079/SH080, tổng thời lượng vẫn 720 s.
