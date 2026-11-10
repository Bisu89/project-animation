# Elise Moreau: hồ sơ nhân vật (dùng chung mọi dòng)

Cô gái trẻ người Pháp, khoảng 25 tuổi. Hồ sơ gốc: `content/elise-diy/models/elise.md`.

## Ngoại hình (cố định)
- Tóc nâu nhạt búi gọn, vài sợi buông hai bên mặt. Dòng Talent búi cao.
- **Không tàn nhang** (bỏ từ 2026-11-03 vì AI lúc vẽ lúc không). Da tự nhiên có lỗ chân lông, không làm mịn.
- Trang điểm nhẹ, hay cười; khuyên tai vàng nhỏ.
- Dáng thon khỏe. Mặt theo model sheet v2 (`content/elise-diy/models/elise-v2-model-sheet.png`, duyệt 2026-11-02).
- Câu mô tả da bắt buộc trong prompt: "natural realistic skin texture with fine pores, no freckles, no airbrushing".
  Không dùng "smooth skin".
- Một số ảnh tham chiếu cũ còn tàn nhang nhẹ (ví dụ ảnh A của tập 11), nên vẫn ghi "no freckles" trong prompt.

## Trang phục theo dòng
| Dòng | Trang phục | Ảnh tham chiếu gửi kèm khi gen |
|---|---|---|
| DIY (mặc định từ tập 07) | Quần yếm short denim nhạt, áo ba lỗ trắng, giày thể thao trắng, tất trắng. Găng nitrile đen ở bước bẩn hoặc sơn; tháo găng khi quấn dây, gắn đồ, cắm hoa | `<tt>-A-elise-truoc.png` chép từ tập trước (ví dụ `ep12 rr-A`, `ep11 xv-A`) |
| DIY (bộ cũ) | Legging đen + áo ba lỗ + Nike (tập 03–04); váy xếp ly (tập 05–06) | `content/elise-diy/models/elise-*-truoc.png` |
| Wild | Theo mùa trong `content/elise-wild/` (`SERIES-PLAN.md`, `models/`). Ghi rõ "bare arms", "no backpack" khi không có | ảnh trong `models/` của Wild |
| Talent | Áo gym racerback vàng mù tạt dài tới cạp (không hở bụng), legging đen lưng cao, chân trần, băng cổ tay trắng, khuyên nụ vàng, không dây chuyền | `content/elise-talent/models/anh/elise-gym-truoc.png` (đoạn prompt trong `models/elise-gym.md`: **bỏ chữ "light freckles"**) |
| Garden | Yếm short rằn ri quân đội, áo ba lỗ cam cổ tim, giày trắng; găng làm vườn ở bước đất | `content/elise-garden/ep01-tomato-slices/anh/eg1-A-elise-truoc.png` |

## Quy tắc ảnh nhân vật
- Gen ảnh cảnh thì gửi kèm **ảnh trực diện** (`*-truoc.png`), không gửi model sheet nhiều góc. Gửi cả sheet thì bộ lọc
  OpenAI hay chặn.
- Bộ lọc thỉnh thoảng chặn ảnh mặc quần short. Cách tránh:
  - tả tư thế đứng thẳng;
  - thêm "modest, wholesome family-friendly look";
  - `gpt_anh.py` tự thử lại 1 lần.
- Chỉ có một Elise trong khung: "Only this one woman is ever in the scene". Wild có thêm bà Hélène ở các cảnh được ghi trong kịch bản.
- Đổi trang phục hay thêm bộ mới: gen ảnh thử, chủ dự án chọn, rồi ghi vào bảng trên.
