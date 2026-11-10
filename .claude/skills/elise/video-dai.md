# Dựng phim dài 16:9 (Garden bản dài, Wild)

Dùng cho video ngang từ khoảng 8 phút trở lên, ghép từ hàng trăm clip Muse. Reel dọc vẫn theo [ghep-cat.md](ghep-cat.md).
Đọc kèm: [loi-thuong-gap.md](loi-thuong-gap.md). Garden bản dài: dữ liệu ở `content/elise-garden/long-form/data/`; Codex dựng bằng Remotion.

## 1. Đơn vị làm và duyệt
- Chia tập thành **sequence (SQ) hoặc phân đoạn 1–2 phút**. Mỗi SQ có gói prompt riêng, dựng bản xem riêng và được duyệt riêng, rồi mới nối thành tập.
- Làm theo đợt 2 SQ. Trong lúc Muse chạy đợt N thì viết prompt và gen ảnh cho đợt N+1.
- Duyệt bằng cách **xem chạy liền cả SQ**, không chỉ xem lưới khung. Phải soi cả chỗ nối giữa hai SQ.

## 2. Lấy đoạn từ clip Muse
| Việc | Quy tắc |
|---|---|
| Thời lượng | Muse tạo 10 s; timeline dùng **tối đa 8,5 s mỗi clip**. Shot dài hơn thì chia nhiều clip, khung cuối của clip trước là khung đầu của clip sau |
| Đầu clip | Bỏ 0,2–0,4 s đứng hình |
| Giữa clip | Dò mốc Muse tự cắt cảnh, rồi chọn đoạn tránh mốc đó |
| Cuối clip | Cắt trước lúc vật tự hiện hàng loạt (thường từ giây 5–7) và trước lúc đứng không, đung đưa |
| Thiếu đoạn sạch | Không kéo khung đứng, không làm chậm quá 1,5×. Báo người viết prompt để rút shot và cân lại timeline |
| Tiếng gốc Muse | Tắt mặc định. Chỉ dùng khi nghe sạch và khớp động tác |

## 3. Chuyển cảnh
Reel dọc là một khung hình liền nên chỗ nối nào cũng hòa. **Phim dài đổi góc máy liên tục, nên hòa ở mọi chỗ trông như slideshow.**

| Chỗ nối | Cách nối | Giá trị `transitionIn` |
|---|---|---|
| Hai clip trong **cùng một shot** (cùng khung hình) | Hòa 0,25 s để che chỗ Muse không dừng đúng khung cuối | `mo` |
| Sang **shot khác**, cùng lúc trong truyện | **Cắt thẳng**, tốt nhất theo động tác (tay đang làm thì cắt vào cận tay) | `cat` |
| Nhảy thời gian trong cùng ngày | Hòa 0,5 s, hoặc cắt sang cỡ cảnh khác hẳn | `mo_dai` |
| Đổi ngày | Mờ qua đen 0,5–1 s, kèm chữ "Day N" | `den` |
| Trước/sau cùng khung hình | Hòa dài khoảng 2 s | `mo_dai` (ghi rõ độ dài trong `edit` của shot) |

- **Tránh cắt nhảy:** hai shot liền nhau mà cùng camera, cùng cỡ cảnh thì người xem thấy giật. Shot sau phải đổi cỡ cảnh (toàn → cận) hoặc đổi góc từ khoảng 30° trở lên.
- Không dùng trượt, lật, lóe trắng hay light leak. Đây là phim làm vườn thật, không phải video quảng cáo.

## 4. Âm thanh (lớp làm phim mượt nhất)
1. **Lớp nền theo cảnh:** chim, gió hoặc không khí trong bếp chạy liên tục **dưới các cú cắt**. Đổi lớp nền chỉ khi đổi địa điểm hoặc giờ, và đổi bằng cách mờ ra mờ vào 0,5–1 s.
2. **Foley theo clip:** tiếng đất, cưa, nước… khớp động tác. Cho tiếng của shot sau vào sớm 0,3–0,5 s trước hình.
3. **Lời dẫn:** khi có lời thì hạ nền và Foley khoảng 8–10 dB. Lời không đè lên tiếng thao tác quan trọng.
4. **Nhạc:** chỉ ở ranh giới SQ và các cảnh phần thưởng, mờ vào và ra 1–2 s. Phải có quyền sử dụng. Không dùng hiệu ứng âm thanh kiểu meme.
5. Chưa có key ElevenLabs thì giao bản không lời. Không lồng giọng tạm.

## 5. Màu và hình
- Phóng mọi clip Muse (khung nhỏ, ngang khoảng 1248×704) lên **1920×1080 bằng cùng một bộ lọc**. Không cắt mất tay hay đạo cụ.
- **Cân màu theo SQ:** mỗi clip Muse lệch độ sáng và nhiệt màu một chút. Chỉnh từng clip về một khung chuẩn của SQ, rồi áp **một LUT chung cho cả series**.
- So khung cuối và khung đầu của hai clip liền nhau. Lệch sáng thấy rõ thì chỉnh trước khi hòa.
- Cảnh trong nhà hoặc chạng vạng: kiểm tra lỗi cả khung ám cam.

## 6. Nhịp
- Xen cận 3–5 s giữa các cảnh 8 s. Không để quá 3 shot toàn liên tiếp.
- Cứ 30–60 s phải có một mốc tiến độ nhìn thấy được.
- Cảnh "ngắm" không quá 2 s, và chỉ ở cảnh phần thưởng.
- Chữ đè chỉ gồm nhãn AI, "Day N", tiêu đề và minh bạch ở cuối.

## 7. Ghi chú cho Codex khi dựng bằng Remotion
Theo skill `remotion-best-practices`, phần `remotion-markup` (`transitions.md`, `video-editing.md`, `color-correction.md`, `audio.md`):
- **`TransitionSeries.Transition` làm ngắn timeline**, vì hai cảnh chồng lên nhau. Muốn tổng đúng (EP01: 21.600 frame), mỗi chỗ hòa phải lấy thêm đuôi dư của clip trước (Muse tạo 10 s, chỉ dùng ≤ 8,5 s), tức `durationInFrames` của Sequence = slot + độ dài hòa. Nếu không thì dùng `Overlay`. Kiểm tổng sau khi dựng.
- Mỗi clip là một `TransitionSeries.Sequence` có `trimBefore` (bỏ đứng hình, chọn đoạn sạch) và `durationInFrames`. Tên Sequence đặt bằng `clipId`.
- Mờ qua đen: `fade()` sang một Sequence màu đen ngắn, hoặc Overlay. Cắt thẳng: không đặt Transition.
- Màu: `colorCorrection()` gắn vào `effects` của `<Video>`, cộng `lut()` với file `.cube` chung.
- Âm thanh: các `<Audio>` nền nằm trên track riêng, `loop`, `volume` nội suy để mờ và hạ khi có lời. Lời dẫn đặt theo `narration.json`.
- Dự án hiện có `remotion` 4.0.535. `@remotion/transitions`, `@remotion/media`, `@remotion/effects` chưa cài: kiểm phiên bản khớp trước khi thêm.

## 8. Kiểm trước khi giao
- [ ] Tổng thời lượng đúng (EP01: 720 s) và đúng 1920×1080, 30 fps.
- [ ] Không có cắt nhảy (cùng camera, cùng cỡ cảnh liền nhau).
- [ ] Chỗ nối hai clip cùng shot không giật; chỗ cắt giữa các shot không có khung đen hay khung lặp.
- [ ] Lớp nền âm thanh không bị hụt ở chỗ cắt; lời dẫn không bị nhạc lấn.
- [ ] Màu đồng đều trong mỗi SQ; không có cảnh ám cam.
- [ ] Trạng thái vườn và trang phục liên tục giữa các shot.
