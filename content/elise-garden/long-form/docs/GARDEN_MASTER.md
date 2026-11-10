# Garden Master: sân sau nhà kiểu Mỹ, góc máy, trạng thái

**Trạng thái: ĐỀ XUẤT, chờ Gate A.**
- 2026-11-06, chủ dự án đổi bối cảnh: **sân sau nhà ở khu dân cư Mỹ, tận dụng không gian**. Không còn là vườn nông trại hay vườn cottage Anh, nên mục 3 của brief không còn hiệu lực về bối cảnh.
- Số liệu chuẩn nằm trong `../data/garden_layout.json` và `../data/garden_state.json`. Nếu file này lệch với JSON thì theo JSON.
- Sơ đồ đúng tỉ lệ: [`references/anh/gl1-R-so-do.png`](../references/anh/gl1-R-so-do.png). Vẽ lại bằng lệnh `python tools/so_do.py`.

## Ý tưởng thiết kế
Một sân sau 12 × 12 m (khoảng 40 × 40 ft) bị bỏ hoang được chia lại cho gọn và dùng được hằng ngày:

| Khu | Vị trí | Dùng làm gì |
|---|---|---|
| **Bãi cỏ sinh hoạt** | Nửa trái (tây), có cây táo già | Giữ làm chỗ ngồi chơi. Ngày 1 cắt bằng máy cắt cỏ đẩy tay |
| **Khu rau** | Nửa phải (đông), chỗ nắng nhất | Hai luống cedar 4×8 ft (1,2 × 2,4 m) cao ~14 cm. Lối đi 1,2 m chạy thẳng từ cổng sau. Còn 4 vị trí luống dự kiến |
| **Deck và sân bê tông** | Sát nhà, bên trái | Deck gỗ cao 60 cm có cửa kính trượt. Sân bê tông dưới chân bậc là chỗ cưa và ráp khung |
| **Nhà kho và thùng ủ** | Góc tây nam | Dụng cụ, xe cút kít, thùng ủ phân gỗ cũ (đã có phân hoai) |
| **Nước** | Tường nhà | Vòi nước với cuộn ống gắn tường; thùng hứng nước mưa ở góc nhà |
| Các tập sau | — | Giàn leo dọc rào đông, nhà kính áp rào ở góc đông bắc, bếp nướng trên deck. **Chưa có trong EP01** |

- Nhà ranch một tầng: ốp ván ngang xám nhạt, viền trắng, mái shingle sẫm, máng xối trắng; cửa sổ bếp nhìn thẳng ra hai luống.
- Rào gỗ cedar kín cao 1,8 m (6 ft) ở ba phía. Cổng ở rào sau, thẳng với lối đi.
- **Từ cổng nhìn vào: BED-01 bên TRÁI, BED-02 bên PHẢI.**
- Bố trí hàng gieo:
  - BED-01: nửa nam gieo 2 hàng củ cải, nửa bắc 2 hàng xà lách;
  - BED-02: nửa nam gieo 3 hàng cải thìa, nửa bắc để trống cho tập sau;
  - 7 nhãn trắng cắm ở đầu đông mỗi hàng.

## Lô sau (từ EP02)
Phía sau cổng rào sau là lô đất hoang khoảng 20 × 25 m, cùng chủ. Đây là chỗ cho vườn cây ăn trái, quả mọng, chuồng gà, lán DIY và pergola. Trong EP01 lô này chỉ thấy là ngọn cây sau rào. Xem [SERIES_ROADMAP.md](SERIES_ROADMAP.md) và `references/gl1-R-so-do-tong.png`.

## Bốn góc máy

| Camera | Vị trí (x, y), độ cao, ống kính | Nhìn | Thấy gì |
|---|---|---|---|
| **CAM_A** (cổng sau) | (8.8, 0.5), 1,6 m, 28 mm | bắc | Lối đi ở giữa khung, BED-01 trái, BED-02 phải. Nhà ở 1/3 trên: deck bên trái, cuộn ống, cửa sổ bếp, thùng nước mưa. Bãi cỏ ở mép trái. Cây táo và nhà kho **nằm ngoài khung** |
| **CAM_B** (deck) | (4.5, 11.0), 2,2 m, 35 mm | đông nam | Nhìn từ trên deck xuống khu rau. **BED-01 ở PHẢI, BED-02 ở TRÁI** (đúng hình học, không phải lật cảnh) |
| **CAM_C** (rào đông) | (11.5, 5.7), 1,4 m, 35 mm | tây | BED-02 tiền cảnh, BED-01 phía sau, rồi bãi cỏ, cây táo, nhà kho. Nhà ở mép phải, cổng ở mép trái |
| **CAM_D** (bãi cỏ) | (5.4, 3.2), 1,5 m, 35 mm | đông bắc | BED-01 tiền cảnh, BED-02 phía sau, mặt sau nhà ở hậu cảnh |

## Trạng thái S0–S5

| Trạng thái | Ngày | Thấy | Cấm |
|---|---|---|---|
| S0_BEFORE | 1 | Bãi cỏ cao tới gối, mâm xôi dại dọc rào, chút chít, bồ công anh, tầm ma, chậu vỡ, đá, dây thép gỉ; sân bê tông bị cỏ lấn; vệt lối mòn từ cổng tới bậc deck | Khung, gỗ, dây căng |
| S1_CLEARED | 1 | Cả bãi cỏ đã cắt thấp; khu rau là đất trần đã cào; cọc và dây đánh dấu hai luống | Khung, phân ủ |
| S2_FRAMES | 2 | Hai khung cedar đỏ nâu đúng chỗ; bên trong là đất tại chỗ đã xới | Phân ủ, hạt, nhãn |
| S3_SOIL_READY | 2 | Đất trộn phân ủ nâu đen, mặt phẳng, thấp hơn mép khung ~2 cm | Rãnh gieo, nhãn |
| S4_PLANTED | 2 | Rãnh gieo mờ, 7 nhãn, đất sẫm vì vừa tưới, nửa bắc BED-02 trống | **Mọi màu xanh trong luống** |
| S5_NEXT_MORNING | 3 | Như S4, thêm sương | Mầm |

## Danh sách duyệt ảnh nền (Gate B)
- [ ] Nhà ranch: ván ngang xám nhạt, viền trắng, mái shingle sẫm; deck gỗ có bậc và cửa kính trượt bên trái; cuộn ống, cửa sổ bếp, thùng nước mưa bên phải.
- [ ] Rào cedar kín cao 1,8 m; cổng ở rào sau; thấy mái nhà hàng xóm phía trên rào.
- [ ] Bãi cỏ bên trái có cây táo; nhà kho xám và thùng ủ ở góc tây nam.
- [ ] Hai luống ở nửa phải, cỡ và tỉ lệ 1:2 giống nhau, song song; đúng bên trái/phải theo camera (riêng CAM_B ngược bên).
- [ ] Mùa: chồi non, không hoa; nắng đúng hướng theo giờ.
- [ ] Không chữ, không người, không vật của trạng thái sau.
- [ ] Các ảnh cùng camera khi chồng lên nhau thì mép mái, deck và cột rào lệch dưới khoảng 2% bề rộng khung.
