# Bước 4: xem, cắt, ghép, báo cáo, dọn

Biến `$TOOL`, `$TAP`, `$LUOI` xem `chay-tool.md`.

## 4.1 Xem từng clip
```
python "$LUOI" "$TAP/video/clip4.mp4" <scratchpad>/c4.png --fps 2
```
Lưới có ghi giây. Với mỗi clip, ghi lại:
- đoạn đầu đứng hình (`ghep.py` tự bỏ khi `cat_tu` trống);
- **mốc Muse tự nhảy cảnh** (`ghep.py` in `CẢNH BÁO clip N: nhảy cảnh ở Xs`);
- mốc vật bắt đầu tự hiện ra hàng loạt, tự đổi màu hoặc đổi dáng: **cắt trước mốc đó**;
- đoạn thừa ở cuối (đứng cầm đồ, ngắm, đung đưa).

## 4.2 Bản cắt `ghep-v2.csv`
Chép `gen-video.csv` thành `ghep-v2.csv` rồi sửa:
- `cat_tu` / `cat_den` (giây trong clip gốc);
- `luu_tai` trỏ sang `video\clipN.mp4.lan1.mp4` nếu bản lần 1 đẹp hơn;
- bỏ hẳn hàng của clip không cứu được (tập 13 bỏ clip 3 và 7);
- ở chỗ nối sau một clip bị cắt sớm, đổi `chuyen_canh` thành `mo_dai`.

Không sửa `gen-video.csv`: đó là bản gốc để gen lại. Tên `ghep-v2.csv` không chứa chữ "video", nên lệnh `auto` không đụng tới nó.

## 4.3 Chuyển cảnh (`chuyen_canh`)
| Giá trị | Hiệu ứng | Dùng khi |
|---|---|---|
| `mo` | mờ chéo 0,25 s | hai clip liền nhau |
| `mo_dai` | mờ chéo 0,5 s | nhảy thời gian, đổi rộng↔cận, vào thành phẩm, che chỗ cắt sớm |
| `cat` | nối cứng (1 khung) | gần như không dùng, vì Muse không bao giờ dừng đúng khung cuối |
| `trang` / `den` | lóe trắng / đen 0,4 s | hạn chế: lóe trắng ở tập 14 trông như lỗi |
| `kieu:giay` hoặc số | kiểu xfade tùy chọn | |

Ô để trống thì dùng `--xfade` (mặc định 0,2).

## 4.4 Ghép, chấm, tự kiểm
```
cd "$TOOL" && python ghep.py --csv "$TAP/ghep-v2.csv" --out "$TAP/video/final-v2.mp4"
cd "$TOOL" && python qa.py --video "$TAP/video/final-v2.mp4" --csv "$TAP/gen-video.csv" --chi gpt
python "$LUOI" "$TAP/video/final-v2.mp4" <scratchpad>/v2.png
```
Đọc lưới như người xem:
1. Bước tạo nét đặc trưng của sản phẩm có được thấy hình thành không, hay bị chuyển cảnh nhảy qua?
2. Sản phẩm có giữ một dáng, một cỡ từ đầu đến cuối không?
3. Chi tiết làm ở bước trước (vòng đáy, viền sơn) có còn ở các cảnh sau không?
4. Có khung trắng hoặc đen toàn màn hình không?
5. Có đoạn đứng không, đung đưa, ngắm lâu không?

Lỗi ở câu 1–3 thì chưa gửi. Sửa bằng cắt khác, hoặc gen lại đúng clip đó theo `loi-thuong-gap.md`.

## 4.5 Báo cáo chủ dự án
- Đường dẫn video và độ dài.
- Đã xem bằng cách nào (lưới khung hay xem chạy).
- Điểm GPT, và là điểm của bản nào.
- Clip nào trượt, đã cắt gì, vì sao.
- **Lỗi còn lại, nói thẳng.**

Cập nhật mục Trạng thái trong `NOI-DUNG.md`.

## 4.6 Dọn sau khi chủ dự án chốt
Đây là danh sách dọn duy nhất của series. Các file khác chỉ dẫn về đây.

1. Đổi tên bản được chọn thành `video/final.mp4`.
2. **Liệt kê** những file sẽ xóa trong câu trả lời, rồi chỉ xóa đúng các nhóm sau:
   - trong `video/`: `clip*.mp4`, `*.lan1.mp4`, `*.truoc.mp4`, `clip*.qa.json`, thư mục `qa/` và `_thu*/`, mọi `final-*.mp4` khác `final.mp4`;
   - trong `anh/`: ảnh so sánh (`*-so-sanh.png`), storyboard (`*-storyboard.png`), lưới khung (`*-bang-khung.png`, `*luoi*.png`);
   - file tạm của tập trong scratchpad.
3. **Không xóa** những thứ sau. Thứ gì không có trong danh sách xóa ở trên thì phải hỏi trước khi xóa.
   - `video/final.mp4`;
   - mọi ảnh khung nguồn trong `anh/` (cần để gen lại);
   - `gen-anh.csv`, `gen-video.csv`, `ghep-v2.csv`;
   - `NOI-DUNG.md`;
   - script `content/elise-<dòng>/scripts/`;
   - `goc.mp4`.
4. Ghi "XONG (ngày)" vào `NOI-DUNG.md` (dòng DIY tập 01–11: cả bảng trong `docs/elise-diy-ban-giao.md`).
