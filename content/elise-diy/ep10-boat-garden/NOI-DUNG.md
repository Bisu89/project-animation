# Elise DIY tập 10: thuyền cũ thành bồn hoa

Ý tưởng và storyboard chủ dự án gửi (2026-11-04): `anh/tb-ref-storyboard.png` (nửa trái là tập này, nửa phải là tập
"lốp xe thành hồ" chưa làm). Ảnh mẫu thành phẩm cắt từ storyboard: `anh/tb-ref-san-pham.png`. Tiền tố file: `tb-`.

## Đã chốt
- Chủ dự án bảo "làm tập 1" sau khi xem bản review và nhịp đề xuất bên dưới.
- Hai điểm chưa trả lời, làm theo đề xuất (đổi được): **sơn mới xanh pastel phẳng** (không giữ kiểu sơn cũ loang lổ);
  trang phục như tập 09: quần yếm short denim + áo ba lỗ trắng cổ tim + giày trắng + găng làm vườn
  (`anh/tb-A-elise-truoc.png` chép từ `ng-A-elise-truoc.png`).
- Ngoài vườn, nắng chiều vàng, không có cảnh tối.

## Sản phẩm (`anh/tb-G-thanh-pham.png`)
Thuyền gỗ dài khoảng 3 m nhìn chéo 3/4, mũi trước bên trái, đuôi sau bên phải. Thân sơn xanh pastel, viền mép và cột mũi
gỗ đánh vecni màu mật ong. Trong thuyền đầy đất và hoa: cẩm tú cầu xanh tím ở đuôi, cúc cosmos hồng và hồng pastel ở giữa,
cúc trắng, thường xuân và dây leo lá nhỏ rủ qua mạn. Cột gỗ treo đèn lồng sắt ở mũi thuyền. Hàng đá cuội lớn dọc chân
thuyền, lối sỏi nhỏ ở tiền cảnh.

## Nhịp (khoảng 24 giây)

| Giây | Việc |
|---|---|
| 0–3 | Thuyền cũ bong sơn, Elise cạo sơn bong bằng bàn chải sắt |
| 3–7 | Lăn sơn xanh pastel mạn thuyền phía máy quay (khung cuối: đang sơn dở) |
| 7–10 | Lót vải, xúc đất từ xe cút kít vào thuyền |
| 10–13 | Trồng 2 chậu cẩm tú cầu |
| 13–16 | Trồng hồng, cúc trắng, hoa rủ xuống mép thuyền |
| 16–19 | Cắm cột đèn lồng, xếp đá cuội, bật công tắc đèn |
| 19–24 | Thành phẩm nắng chiều, máy đẩy nhẹ vào |

Bài học tập 09 áp dụng: mọi đồ (xô sơn, con lăn, xe cút kít đất, khay cây, cột đèn, đá) có sẵn từ khung đầu; việc có
nhiều vật nhỏ tách nhỏ, mỗi clip 2–3 vật; khung riêng cho lúc tay đặt ở công tắc đèn; khung đầu không trùng ảnh tham chiếu.

## Trạng thái
- 2026-11-04: đã gen `tb-G-thanh-pham.png`, chờ chủ dự án duyệt rồi gen các khung từng bước.
- 2026-11-04: chủ dự án duyệt `tb-G`. Đá cuội dọc chân thuyền có sẵn từ đầu (bỏ bước xếp đá). Bắt đầu gen khung B→F, H (`scripts/tao_gen_anh_tap10.py`).
- 2026-11-04: đã gen đủ 10 khung. `F0-den`, `F-sang` gen lại vì bản đầu mất hết đồ nghề tiền cảnh; `H` gen lại từ `F` mới. Chờ chủ dự án duyệt bộ ảnh.
- 2026-11-04: gen 8 clip Muse. Clip 4 (cẩm tú cầu) hỏng cả 3 lần (đặt cả chậu, trồng ở mũi, khay tự đổi, người thứ hai) nên bỏ; ghép bằng `ghep.csv` (gen-video.csv bỏ dòng 4). `video/final.mp4` 27,3 s, chờ chủ dự án xem.
- 2026-11-04: chủ dự án báo clip 6 cột đèn tự dài ra cắm xuống đất. Gen khung cuối mới `tb-F00-dung-cot` (sửa từ `F0`) và gen lại clip 6 (`E2-hoa` → `F00`), cột giữ nguyên chiều dài. Bản cũ `video/clip6-cu.mp4`. `final.mp4` 27,2 s.
