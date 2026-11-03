# Elise DIY: 4 ý tưởng Giáng sinh tiếp theo (bản nháp, chờ chủ dự án duyệt)

Phát triển từ video mẫu cây thông kim tuyến trên tường (tập 02). Mỗi tập là một reel dọc 9:16. Mỗi clip Muse 10 giây làm đúng
một việc, có khung đầu và khung cuối; ghép thì tăng tốc xuống 2–4 giây. Mỗi tập một căn phòng khác nhau để không lặp lại tập 02.
Mỗi tập mặc một bộ đồ, chọn từ tủ đồ trong `models/`.

## Tập 03: cây thông chỉ bằng đèn (dễ làm nhất, khoảng 24 giây)
Làm theo ảnh sản phẩm chủ dự án gửi (2026-11-03): 2 dây chéo từ đỉnh, 9 tầng dây đèn dây đen cong vòng cung, khung sao viền đèn
rỗng giữa, quả châu vàng mờ, đồ kim loại vàng, người tuyết trắng, nơ voan vàng. Phòng tường trắng, cửa sổ nhìn ra tuyết bên phải,
bàn nhỏ có đèn ngủ, quà giấy nâu sẫm buộc ruy băng vàng. Elise mặc **legging đen + áo ba lỗ trắng + Nike**.
Điểm hút: bật công tắc, cả cây sáng cùng lúc.

| Giây | Clip | Việc | Khung đầu → khung cuối |
|---|---|---|---|
| 0–4 | 1 | Dán móc trong suốt thành 9 cặp viền tam giác | `dn-B-moc-dau` → `dn-B2-moc-xong` |
| 4–8 | 2 | Giăng dây đèn (tắt): 2 dây chéo, 9 tầng vòng cung | `dn-B2-moc-xong` → `dn-C-day-den` |
| 8–10 | 3 | Treo khung sao viền đèn lên đỉnh | `dn-C-day-den` → `dn-D-sao` |
| 10–15 | 4 | Treo quả châu, đồ kim loại vàng, người tuyết, nơ | `dn-D-sao` → `dn-D2-trang-tri` |
| 15–19 | 5 | Cắt sang buổi tối (thùng đồ đã cất). Bấm công tắc, cả cây sáng | `dn-E2-toi` → `dn-F-sang` |
| 19–24 | 6 | Máy quay đẩy vào thành phẩm, Elise ra khỏi khung | `dn-F-sang` → `dn-G-thanh-pham` |

Quà và thùng đồ trang trí có sẵn từ ảnh đầu. Thùng chỉ mất ở cú cắt sang buổi tối, để ảnh thành phẩm gọn.

**Trạng thái: XONG (2026-11-03), chủ dự án duyệt bản `video/final.mp4` 18 giây; đã xóa clip lẻ và bản 24 giây. Ghi chú cũ bên dưới để tham khảo:**
- `video/final-v1.mp4`: 24 giây, QA 62. `video/final.mp4`: bản cắt bỏ đoạn lỗi, 18 giây, QA 53, kém hơn vì mất quá trình làm.
  Cột cắt hiện trong `gen-video.csv` là của bản 18 giây. Muốn quay lại bản 1 thì xóa `cat_den`, trả `dung_giay` về 4/4/2/5/4/5
  và `che_do` về `tang_toc`.
- Đề xuất khi làm tiếp: bỏ clip 1 (móc dán quá nhỏ, Muse cho móc tự hiện ra thành lưới), gen lại clip 4 (đồ trang trí hiện
  hàng loạt) và clip 6 (bàn đèn và cửa sổ biến mất, đẩy máy quá sâu) bằng câu "render lại"; giữ clip 2, 3, 5.

## Tập 04: cây thông bằng kệ gỗ nổi (khoảng 28 giây)
Theo ảnh thành phẩm `kg-G-thanh-pham.png`: tường xanh xám nhạt, 6 kệ gỗ óc chó nổi ngắn dần lên trên, sao vàng trên đỉnh,
cây thông mini phủ tuyết, nến LED, quà nhỏ, chuông vàng, quả mọng, dây lá có đèn; dưới là tủ thấp gỗ óc chó đặt quà và đèn lồng.
Elise mặc **legging đen + áo ba lỗ trắng + Nike**. Bỏ bước khoan bắt giá (vật nhỏ, AI vẽ kém); giá kệ coi như đã gắn sẵn.

| Giây | Clip | Việc | Khung đầu → khung cuối |
|---|---|---|---|
| 0–4 | 1 | Lắp 6 tấm kệ, từ dài nhất ở dưới lên | `kg-B-ke-tron` → `kg-B2-ke-xong` |
| 4–8 | 2 | Quấn dây lá có đèn (tắt) dọc mép kệ | `kg-B2-ke-xong` → `kg-C-day-la` |
| 8–12 | 3 | Bày cây thông mini và nến lên kệ | `kg-C-day-la` → `kg-C2-cay-nen` |
| 12–16 | 4 | Bày quà nhỏ, chuông, quả mọng | `kg-C2-cay-nen` → `kg-D-qua-nho` |
| 16–18 | 5 | Đặt ngôi sao lên đỉnh | `kg-D-qua-nho` → `kg-D2-sao` |
| 18–23 | 6 | Buổi tối, bấm điều khiển, đèn và nến sáng | `kg-E2-toi` → `kg-F-sang` |
| 23–28 | 7 | Elise bước ra khỏi khung, máy quay đẩy vào thành phẩm | `kg-F-sang` → `kg-G-thanh-pham` |

## Tập 05: cây thông bằng hộp quà (khoảng 28 giây)
Theo ảnh mẫu chủ dự án gửi và ảnh thành phẩm `hq-G-thanh-pham.png`: khoảng 30 hộp quà xếp lệch tầng thành cây (giấy kraft,
vàng, xanh lục, đồng, xám sẫm, ruy băng xanh lục, nơ kim loại, quả châu nhét khe), tường ván gỗ xám trắng phủ rèm dây đèn,
vòng nguyệt quế, 2 sao giấy vàng, ghế bành xám gối len xanh, bàn rổ sắt có cây thông nhỏ và cốc đỏ, thảm lông sẫm.
Elise mặc **váy xếp ly + crop top logo + cao gót đen**.

| Giây | Clip | Việc | Khung đầu → khung cuối |
|---|---|---|---|
| 0–4 | 1 | Xếp tầng đáy bằng các hộp lớn nhất | `hq-B-dong-qua` → `hq-B2-tang-day` |
| 4–8 | 2 | Xếp các tầng giữa tới ngang ngực | `hq-B2-tang-day` → `hq-C-tang-giua` |
| 8–12 | 3 | Xếp các tầng trên tới hộp nhỏ có nơ xanh trên đỉnh | `hq-C-tang-giua` → `hq-C2-dinh` |
| 12–16 | 4 | Nhét quả châu vào các khe | `hq-C2-dinh` → `hq-D-qua-chau` |
| 16–21 | 5 | Buổi tối, bấm điều khiển, rèm dây đèn sáng | `hq-E2-toi` → `hq-F-sang` |
| 21–28 | 6 | Elise bước ra khỏi khung, máy quay đẩy vào thành phẩm | `hq-F-sang` → `hq-G-thanh-pham` |

## Tập 06: cây thông cành gỗ mộc mạc, kiểu Bắc Âu (khoảng 30 giây)
**Trạng thái: XONG (2026-11-04).** Chủ dự án duyệt `video/final.mp4` (19,9 giây): 6 clip có khung đầu và khung cuối,
bỏ cảnh tối (cắm điện ban ngày), cắt đoạn thừa và đoạn đồ hiện hàng loạt, tăng tốc tối đa 1,5 lần, `ghep.py --xfade 0.3`.

Theo ảnh thành phẩm `cg-G-thanh-pham.png`: 6 cành gỗ khô buộc dây đay treo từ móc đồng trên tường trắng, quấn lá thông và dây
đèn đồng, treo quả thông, quả châu trắng đỏ, sao gỗ; băng ghế trắng bày 3 nến trụ, 2 cây gốm trắng, đèn lồng đen; cửa sổ bên trái,
sofa xám bên phải, thảm len kem. Elise mặc **váy xếp ly + crop top logo + tất đen chấm bi, không giày**.

| Giây | Clip | Việc | Khung đầu → khung cuối |
|---|---|---|---|
| 0–4 | 1 | Buộc 6 cành gỗ bằng dây đay trên băng ghế | `cg-B-canh` → `cg-B2-buoc` |
| 4–7 | 2 | Treo cây cành gỗ lên móc tường | `cg-B2-buoc` → `cg-C-treo` |
| 7–11 | 3 | Quấn lá thông và dây đèn (tắt) dọc từng cành | `cg-C-treo` → `cg-C2-la-thong` |
| 11–15 | 4 | Treo quả thông, quả châu, sao gỗ | `cg-C2-la-thong` → `cg-D-trang-tri` |
| 15–19 | 5 | Bày nến, cây gốm, đèn lồng lên băng ghế | `cg-D-trang-tri` → `cg-D2-bay-ghe` |
| 19–24 | 6 | Chiều muộn, bấm điều khiển, đèn và nến sáng | `cg-E2-chieu` → `cg-F-sang` |
| 24–30 | 7 | Elise bước ra khỏi khung, máy quay đẩy vào thành phẩm | `cg-F-sang` → `cg-G-thanh-pham` |

## Ảnh khung hình (cập nhật 2026-11-03)
`gen-anh.csv` mỗi tập: `ep03-light-tree/` (`dn-`, 8 ảnh), `ep04-shelf-tree/` (`kg-`, 8 khung + thành phẩm),
`ep05-gift-tree/` (`hq-`, 7 khung + thành phẩm), `ep06-branch-tree/` (`cg-`, 8 khung + thành phẩm).
Ảnh thành phẩm `<tiền tố>-G-thanh-pham.png` gen trước để duyệt sản phẩm. Ảnh này được gửi kèm ở khung đầu (lấy đúng phòng)
và khung bật đèn (lấy đúng sản phẩm). `<tiền tố>-A-elise-truoc.png` là ảnh tham chiếu trang phục, bản không tàn nhang.

## Thứ tự làm đề xuất
03 → 05 → 06 → 04. Tập 04 có khoan và lắp kệ, vật lý khó nhất, nên làm sau cùng khi đã quen.
