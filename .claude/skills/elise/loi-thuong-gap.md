# Lỗi hay gặp của GPT ảnh và Muse video (tập 01–14)

Mỗi dòng: lỗi → cách phòng khi viết prompt → cách cứu khi ghép.

## Muse (video)
| Lỗi | Phòng | Cứu |
|---|---|---|
| **Vật nhỏ lặp lại tự hiện ra hàng loạt** (dây, giấy, móc, đá, lá súng). Tập 02–04, 10, 13, 14 | Quay **cận tay**, mỗi clip 2–3 vật; câu "appears only where her fingers press it"; khung cuối chỉ nhiều hơn khung đầu một chút | Cắt trước mốc vật tự hiện (thường giây 5–7) |
| **Bước chính bị nhảy qua.** Tập 14: cắt sớm clip dán lưới, cảnh sau lưới đã xong | Tách bước chính thành 2 clip cận ngắn: bắt đầu → được một nửa → xong | Không cứu bằng cắt được: gen lại kiểu cận |
| Sơn hoặc vàng tự loang, tự hiện (tập 11, 12) | Cận cọ đi từng nét | Giữ đoạn đầu, để cú chuyển cảnh lo phần còn lại |
| Muse tự cắt cảnh giữa clip, QA bỏ sót (tập 12: clip 2 ở 2,5 s, clip 3 ở 8,2 s) | | Đọc dòng CẢNH BÁO của `ghep.py`, đặt `cat_tu`/`cat_den` tránh mốc đó |
| **Hình dừng giữa video, tiếng vẫn chạy** (Garden tập 02, 17 chỗ nối): `ghep.build` cộng dồn sai số độ dài từng đoạn, offset xfade vượt độ dài thật, luồng hình bị cụt | Nhiều chỗ nối thì ép mỗi đoạn đúng số khung (`tpad` + `trim=end_frame`), làm tròn độ dài/offset theo khung, cắt thẳng chồng 2 khung (xem `content/elise-garden/scripts/dung_tap02.py`) | Sau mỗi lần ghép: `ffprobe -count_frames` so độ dài luồng hình với luồng tiếng; lưới kiểm tra phải phủ tới giây cuối |
| Đầu clip đứng hình 0,2–0,4 s | | `ghep.py` tự bỏ khi `cat_tu` trống |
| Cuối clip không khớp khung cuối | | Luôn có `chuyen_canh` (`mo` / `mo_dai`) |
| Đứng cầm đồ đung đưa ở cuối clip | Khung cuối là lúc còn đang làm; câu "never stands idle or sways" | `cat_den` |
| Lia vòng lâu thì Muse vẽ lại nền | | Lấy 5 s đầu, làm chậm thành 6 s |
| Người lạ xuất hiện | "Only this one woman is ever in the scene" | Cắt |
| Kéo máy vào cận mặt | "fixed camera"; cảnh cần thấy đồ thì cận đồ, không có mặt | Cắt |
| Cảnh tối bật đèn: cả phòng ám cam | Không làm cảnh tối | |
| Bóng bay xẹp thì phồng to | Cho chọc kim nổ | |
| Vật mới trùng chỗ vật nền thì biến vật nền thành vật mới | Đổi chỗ vật trong ảnh | |
| Đếm sai số vật (12 chai thành 20) | Không bắt đếm; QA không trừ điểm | |

## GPT (ảnh)
| Lỗi | Phòng |
|---|---|
| **Máy quay lùi xa hoặc tiến gần** giữa hai khung (tập 13, 14 D2) | Khối `CAM`: "Keep exactly the camera position, distance and framing of the SECOND reference" |
| **Sản phẩm đổi dáng, đổi cỡ giữa các cảnh** (tập 14: bình cao thon, rồi tròn, rồi thấp kiểu thùng) | Khối `SHAPE` trong mọi khung; luôn gửi kèm G |
| Chi tiết bước trước biến mất (viền sơn xám tập 13, vòng đáy tập 14) | Câu khóa riêng, ví dụ `RIM`, nhắc lại ở mọi khung sau |
| Gửi kèm ảnh thành phẩm ở khung bật đèn thì sản phẩm bị vẽ khác | Khung bật đèn chỉ gửi kèm khung ngay trước |
| Gen lại mà Codex trả đúng ảnh cũ | Ảnh chưa gửi Muse: xóa rồi gen. Ảnh đã gửi Muse: đặt tên mới (`chay-tool.md` mục 3.2) |
| Tàn nhang lúc có lúc không | "no freckles" + câu về da |
| Tự thêm áo khoác, ba lô | Ghi rõ "bare arms", "no backpack" |
| **Bộ lọc chặn ảnh đầu ra "sexual" khi mặc short và cúi người** (Garden bản dài SH017-c, 2026-11-06: chặn 3 lần, cả lần tool tự đổi khung kín đáo) | Không tả "bending over". Tả đứng thẳng hoặc quỳ, nhìn nghiêng, tay vươn đặt đồ ("stands upright, seen in profile, lowering it at arm's length"), thêm "She does not bend over". **Ngồi xổm/quỳ chính diện ở khung cận cũng bị chặn** (SH037, 2026-11-10); lần thử lại "kín đáo hơn" của tool còn đổi hẳn góc máy và kiểu tóc. Cảnh cận thao tác: quay ngang từ bên hông, chỉ thấy tay và đồ vật, người và chân ngoài khung |

## Cách đọc lỗi trước khi quyết định gen lại
1. Lỗi nằm ở **ảnh khung** (dáng sai, máy lệch)? Sửa ảnh trước. Gen lại clip mà khung vẫn sai thì vô ích.
2. Lỗi là **Muse làm hộ hàng loạt**? Đổi cách quay (cận, ít vật hơn), đừng chỉ thêm câu "FIX".
3. Lỗi chỉ ở **một đoạn** của clip? Cắt, không gen.
