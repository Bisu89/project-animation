# Nhân vật, giọng, phong cách

## Phong cách ảnh (GPT, `gpt_anh.py`)
- Thế giới: "highly detailed atmospheric digital painting", tối, xanh lạnh + điểm cam đèn đường, mưa; 16:9.
- Người que **phẳng 2D**: nét đen dày đều, **thân chỉ là nét** (không tô thân), đầu tròn trắng viền đen, 2 mắt chấm, tay tròn trắng.
- Người phụ (khách, quản lý, tài xế/bố Nia) và zombie: **vẽ như người thật** cùng chất tranh, không phải người que. Ghi rõ
  "REALISTIC painted ... (not a stick figure)" trong prompt.
- Không chữ trong ảnh ("No text, no logos, no letters"); chữ (phiếu, tag, danh sách, HUD) làm bằng lớp Remotion.
- Hằng số prompt dùng chung: `STYLE`, `HERO`, `MAYA`, `ZOMB`, `FLAT` trong `ep01-locked-supermarket/p1/kich_ban.py`; `NIA`, `DAD`
  trong `anh_p23.py`. Ảnh có nhân vật nào thì gửi kèm (`gui_kem`) model sheet nhân vật đó.

## Nhân vật (model sheet trong `content/survival-logs/models/`)
| Nhân vật | Nhận diện | Sheet |
|---|---|---|
| Người kể (vô danh, nhân viên ca đêm) | **mũ boonie kaki trơn** (băng olive, dây cằm), **ba lô olive có ô vàng** | `nhan-vat-chinh-F.png` (hàng trên), `nhan-vat-chinh-F-full.png` |
| Maya (thợ bảo trì) | tóc đuôi ngựa đen, **áo phản quang cam** sọc xám, túi đồ nghề, **băng tay trái** | `maya-model-sheet.png` |
| Nia (9 tuổi) | cao ~2/3 người lớn, **2 búi tóc tròn**, **áo khoác vàng mù tạt rộng** xắn tay, **giày đỏ** | `nia-model-sheet.png` |
Không dùng mũ đỏ (trùng @DoodleSurvivals) hay mũ len (kênh khác).

## Giọng (vibi.pro, model `eleven_multilingual_v2`, không tag cảm xúc)
| Vai | Giọng | id | stability / style |
|---|---|---|---|
| Người kể | Titan | `dtSEyYGNJqjrtBArPCVZ` | 0.35 / 0.4 |
| Maya | Katie | `IJxm2BPzAbIAYPy6kY6Q` | 0.45 / 0.35 |
| Bản tin / radio | Walter | `9ZbFvrGBxO3uSmsw6wdI` | 0.6 / 0.2 |
| Loa "Welcome to Corner Fresh!" | Emma (Youthful Upbeat Commercial) | `YEENOUza6MPsbkc1De9E` | dùng **một bản ghi** cho mọi lần |
| Nia | Munni `VOGEEZj2Kly5dP9LrQy8` hoặc Jasmine `Q9tvtUZSrZWvXOcpOOLK` (chờ chủ dự án chọn; mẫu 12/13 trong `test-giong/`) | | 0.45 / 0.3 |
Titan đọc **~190–200 từ/phút** (speed 0.85 chỉ chậm ~10%): 1.000 từ ≈ 5 phút lời; cả âm thanh/khoảng lặng ≈ 6–7 phút.
Phụ đề: Maya vàng, Nia xanh nhạt, loa/bản tin nghiêng.
