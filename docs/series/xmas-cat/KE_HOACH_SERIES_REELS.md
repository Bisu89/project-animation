# Series Reels "cozy night" (Facebook -> YouTube): phân tích video mẫu và kế hoạch

Ngày: 2026-10-27. Liên quan: [CACH_LAM.md](CACH_LAM.md) (cách dựng một tập), [TIEP_TUC_LAM.md](TIEP_TUC_LAM.md) (trạng thái).

## 1. Phân tích video mẫu (Reels "Rainy nights like this...")

Đo bằng ffmpeg + numpy trên file tải về (10.0s, 1080x1920, 30fps, 4.7 MB, 3.8 Mbps).

**Hình**
- **Một ảnh minh họa duy nhất** (hiên nhà gỗ, cả nhà ngủ trong chăn, mèo trắng, đèn lồng, mưa bão). Không có cảnh cắt, không có nhân vật hoạt hình theo khung.
- Chuyển động rất ít: độ đổi trung bình giữa hai khung chỉ 2,45/255.
- **Camera zoom vào chậm** (ước lượng ~1.0 -> ~1.19 trong 5s, sau đó giữ/nhích ra nhẹ ~1.15).
- **Mưa** phủ liên tục; **đèn lồng** sáng nhấp nháy; **sấm chớp**: 3 nhóm chớp (0.8-1.3s, 3.6-4.3s, 7.1-8.2s), độ sáng nền tăng dần 55 -> 73.
- Có watermark kênh ("Sadia's story") ở góc dưới trái: **không sao chép ảnh/nhân vật**, chỉ học cấu trúc.

**Âm thanh (quan trọng không kém hình)**
- Phổ: sub/sấm 19%, trầm 27%, giữa 26%, mưa (2-5kHz) 14%, "air" 13%; gần như mono (tương quan hai kênh 0.96).
- **Sấm đúng lúc chớp**: đỉnh âm lượng quanh 3.5-4.5s trùng cụm chớp thứ hai, và quanh 6s; không có nhạc, chỉ tiếng mưa + sấm + (mưa/gió).
- Cả video là **một mood duy nhất**: "ấm áp, an toàn khi ngoài trời bão". Người xem dừng lại vì cảm giác, không vì tình tiết.

**Công thức rút ra (áp dụng được):**
1. 1 cảnh, 1 mood, đọc hiểu ngay trong 1 giây (không chữ).
2. 3 lớp chuyển động nhỏ: thời tiết (mưa/tuyết), ánh sáng nhấp nháy (đèn/lửa), sự sống (mèo thở, tai giật).
3. 1 "sự kiện" có âm thanh (sấm; của mình: tiếng lửa nổ lách tách, chuông gió, tuyết đổ mái).
4. Camera chậm, không cắt cảnh; âm thanh đóng vai chính.
5. Cuối video có hành động kéo sang kênh (ở mẫu là theo dõi; ở mình là link YouTube ở comment).

## 2. Cái mình đã có / còn thiếu

**Đã có (một tập dựng được trong ~1,5-2 giờ nếu đã có ảnh):** cảnh dọc 9:16 mèo + lò sưởi (tuyết, lửa, khói, mèo thở/tai/mắt/đuôi), Reels 45s có tiêu đề + thẻ kết YouTube, bản ngang 10 phút có mở đầu poster, đèn theo nhạc, bộ sinh SFX (lửa/gió/mở đầu), script đo ảnh biến thể.

**Còn thiếu để làm series nhanh:**
- **Khuôn dựng tổng quát** (config theo cảnh): hiện toạ độ lửa/cửa sổ/khói/đèn/mèo nằm cứng trong `Video.tsx` của từng cảnh. Làm một component `CozyScene` đọc file cấu hình JSON (vị trí lửa, vùng tuyết, điểm khói, danh sách đèn, hộp cắt biến thể) thì mỗi tập chỉ thêm 1 ảnh + 1 JSON + vài ảnh biến thể.
- **Thư viện SFX** theo chủ đề (lửa, tuyết đổ, chuông xe trượt, gió trong ống khói, tiếng mèo gừ).
- **Mẫu thẻ cuối/tiêu đề** có thể đổi chữ qua tham số.
- Dữ liệu: biết **tập nào giữ chân người xem** (xem phần đo ở mục 5).

## 3. Công thức mỗi tập (Reels)

- **Độ dài:** 15-45s dọc 9:16. Thử cả hai: ngắn (15-20s, tỉ lệ xem hết cao) và 45s (đủ tiêu đề + thẻ kết, hợp xếp "xem lâu").
- **Khung:** 0-1s vào ngay cảnh (không logo), 1-5s tiêu đề nhỏ (tùy chọn), giữa là cảnh thuần, 3-5s cuối thẻ "Full version on YouTube / link in first comment". Chữ nằm trong vùng an toàn (bỏ ~150px trên, ~280px dưới).
- **Mỗi tập: 1 sự kiện cảm xúc** (mèo mở mắt, lửa bùng lên, tuyết đổ khỏi mái) tại giây ~8-12 với âm thanh đi kèm.
- **Cùng bộ nhận diện** (phông, màu tiêu đề, thẻ kết) nhưng **cảnh khác hẳn nhau** (xem mục 6 về rủi ro lặp).

## 4. Ma trận nội dung (chủ đề Giáng sinh, 25 tập gợi ý)

Cảnh x sinh vật ngủ x hiệu ứng chính. Ưu tiên tập đã gần xong và tập tạo biến thể rẻ.

| # | Cảnh | Sinh vật | Hiệu ứng nổi bật |
|---|---|---|---|
| 1 | Cabin lò sưởi (đã có, dọc + ngang) | mèo vàng | lửa, tuyết, khói cacao |
| 2 | Cabin lò sưởi (đã có) | mèo vàng | biến thể: ban đầu tối, đèn dây bật sáng dần (cùng ảnh, khác cảm xúc) |
| 3 | Phòng áp mái, cửa sổ tròn (L2 đã có prompt) | mèo | tuyết dày, đèn lồng đung đưa |
| 4 | Ghế cạnh cửa sổ + vòng nguyệt quế (L3 đã có prompt) | mèo | tuyết, nến |
| 5 | Hiên cabin trong bão tuyết (gần mẫu nhất, nhưng cảnh Giáng sinh) | chó ngủ trên chăn | gió tuyết, đèn lồng |
| 6 | Lều trong tuyết, đèn vàng | chó | tuyết, đèn nhấp nháy (dùng lại ý camp-demo) |
| 7 | Tiệm bánh đêm, lò nướng còn hồng | mèo trên bao bột | hơi lò, đèn neon "open" |
| 8 | Thư viện cổ có lò sưởi | cú ngủ trên giá sách | lửa, bụi sáng |
| 9 | Chuồng tuần lộc đêm | tuần lộc nhỏ ngủ | tuyết, chuông |
| 10 | Toa tàu đêm tuyết | cáo ngủ cạnh cửa sổ | tuyết lướt ngoài kính |
| 11 | Xưởng quà tặng (không người) | chuột trong chiếc tất | đèn dây, bột tuyết |
| 12 | Nhà kính trồng cây thông, đèn dây | thỏ | hơi nước đọng kính |
| 13-25 | Biến thể thời gian/thời tiết của #1-12 (đêm bão tuyết / đêm yên / sáng sớm / đèn tắt) | | |

Gợi ý: **mỗi cảnh cho 2-3 tập** (khác thời tiết/ánh sáng/sinh vật) để tiết kiệm ảnh và vẫn không lặp.

## 5. Lịch và quy trình sản xuất

- **Mốc:** Giáng sinh 25/12/2026. Lượng tìm nhạc Giáng sinh tăng từ đầu tháng 11. Mục tiêu: đăng Reels đầu tiên ~1/11, đều **1 tập/ngày** (hoặc 4-5/tuần) đến ~25/12 (khoảng 25-40 tập). Trước 1/11 cần sẵn ~7-10 tập đệm.
- **Quy trình một tập (mục tiêu <1 giờ khi đã có khuôn):** 1) ảnh master từ prompt (20-30 phút, tạo 3 phương án); 2) 3-4 ảnh biến thể trên ảnh cắt, chạy `xmas_check_variants.py` (10-15 phút); 3) thêm JSON cấu hình; 4) render (1-3 phút/Reels, ~45 phút cho bản 10 phút YouTube); 5) đăng + comment ghim link.
- **Đo và chỉnh (quan trọng hơn làm thêm):** sau ~10 tập, xem trong Meta Business Suite: tỉ lệ xem hết, thời gian xem trung bình, giữ chân 3 giây đầu, lượt chia sẻ/lưu, số click link ở comment. Giữ tập thắng, làm thêm cùng kiểu, bỏ kiểu thua.
- **Phễu YouTube:** mỗi cảnh thắng làm thêm **bản dài 10 phút -> 1-3 giờ** (pipeline đã có), tiêu đề nêu thời lượng và công dụng ("sleep / study / relax"), playlist theo chủ đề. Link ở **comment đầu và ghim**, không để trong nội dung bài (Facebook giảm tiếp cận link ngoài).

## 6. Kiếm tiền trên Facebook: có không, và rủi ro

**Tóm tắt trung thực:** có thể, nhưng **không nên coi Facebook là nguồn thu chính**; vai trò hợp lý của Reels là **kéo người xem sang YouTube** nơi video dài (nhạc nền, ngủ, học) kiếm tiền tốt hơn. Thông tin dưới đây tra ngày 2026-10-27 và **có nguồn mâu thuẫn**, nên phải kiểm tra trực tiếp trong tài khoản.

- **Chương trình hiện hành:** theo một nguồn, các chương trình cũ (quảng cáo in-stream, Ads on Reels, Performance bonus) đã **đóng ngày 31/8/2025**, thay bằng **Facebook Content Monetization**: Meta **mời** creator đủ điều kiện (có thể xin qua Professional Dashboard). Các bài hướng dẫn khác vẫn ghi ngưỡng cũ nên đừng tin ngưỡng số cụ thể.
- **Điều kiện chung:** dùng **Trang (Page)** hoặc hồ sơ ở **chế độ chuyên nghiệp** (không phải hồ sơ cá nhân); tuổi 18+; ở **quốc gia được hỗ trợ**; nội dung **gốc**, tuân thủ chính sách. **Chưa xác nhận được Việt Nam có thuộc diện hay không:** kiểm tra mục Monetization trong Professional Dashboard/Meta Business Suite của Trang.
- **Rủi ro nội dung lặp/AI:** Meta siết nội dung "unoriginal" (đăng lại, hàng loạt, lặp). AI **không bị cấm**, nhưng nội dung **sản xuất hàng loạt, giống nhau, lặp** có thể bị giảm phân phối và mất quyền kiếm tiền; người lặp lại vi phạm có thể mất quyền một thời gian (có kháng nghị). Ngày công bố trong các nguồn khác nhau (2025 hay 2026).
  - **Cách giảm rủi ro:** mỗi tập cảnh và nhịp khác nhau (không chỉ đổi màu), thêm chi tiết gốc (chuyển động riêng, âm thanh riêng, chữ tiêu đề đổi), tránh đăng cùng một mẫu 25 lần liền không thay đổi, không dùng ảnh/nhân vật của kênh khác, giữ nguồn gốc nhạc và ảnh rõ ràng (ảnh do mình tạo bằng công cụ có quyền thương mại; nhạc tự có hoặc có giấy phép).
- **YouTube (nơi nên đặt mục tiêu kiếm tiền):** chương trình đối tác (YPP) theo hiểu biết của tôi cần khoảng **1.000 người đăng ký + 4.000 giờ xem trong 12 tháng** (hoặc 10 triệu lượt xem Shorts/90 ngày), có mốc sớm thấp hơn (khoảng 500 người đăng ký + 3.000 giờ). **Cần kiểm tra lại ngưỡng hiện hành** trên YouTube Studio. YouTube cũng có chính sách chống nội dung lặp/hàng loạt, nên các điều kiện về nhạc/ảnh giống trên.
- **Thực tế nên kỳ vọng:** video nhạc dài ("sleep/study/fireplace") hợp thời lượng xem, nhưng cạnh tranh mạnh; thu nhập đến chậm (cần vài tháng và nhiều video). Tách rõ việc **đăng ngay trong mùa Giáng sinh để lấy lượt xem/đăng ký**, còn tiền là kết quả sau khi đạt ngưỡng.

Nguồn đã dùng cho mục 6 (không chính thức, chỉ để tham khảo; xác nhận lại trên trang Meta/YouTube):
- [Facebook Content Monetization Program: Complete 2026 Guide](https://cavafy.onassis.org/?p=138089)
- [How to Monetize Facebook Reels in the Philippines (2026)](https://www.truelogic.com.ph/?p=88850)
- [Meta crackdowns on 'unoriginal' Facebook content](https://kanjiai.beehiiv.com/p/meta-crackdowns-on-unoriginal-facebook-content)
- [The fight against "unoriginal" content (including AI slop) is coming to Facebook](https://www.tubefilter.com/?p=187296)
- [Facebook's Monetization Rules for AI-Generated Content (2026)](https://www.cinerads.com/blog/facebook-ai-content-monetization-policy)

## 7. Việc làm tiếp (đề xuất thứ tự)
1. Chốt kiểu Reels: 15-20s hay 45s (hoặc thử cả hai ở 5 tập đầu).
2. ~~Làm khuôn `CozyScene` + cấu hình JSON~~ **Đã làm 2026-10-27: xem [KHUON_COZY.md](KHUON_COZY.md).**
3. Tạo ảnh master cho 6-8 cảnh đầu (xem bảng mục 4), cùng prompt biến thể.
4. Dựng 7-10 tập đệm trước 1/11; đăng thử, đo ở mục 5.
5. Kiểm tra điều kiện Facebook (Professional Dashboard) và YouTube Studio của Trang/kênh.
