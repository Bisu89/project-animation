# Survival Logs — series zombie người que (KẾ HOẠCH, chờ chủ dự án duyệt)

Ngày lập: 2026-11-05. Series mới, không dùng bộ tài liệu cũ `docs/series/100-days-zombie-survival/` (chỉ lấy lại code người que/zombie và
pipeline ảnh + lời dẫn đã có). Chưa sản xuất gì; mọi mục dưới đây là **đề xuất**.

## 1. Vì sao chọn format này
Ngách đang xuất hiện nhiều trên YouTube (10–11/2026, nhận định từ các video mới đăng, **chưa có số liệu view kiểm chứng**): **nhật ký sinh tồn zombie người que kể theo ngày** — video dài, giọng kể ngôi thứ nhất, người que
đơn giản trên nền thế giới u tối chi tiết, tiêu đề có số ngày + địa điểm + một chi tiết gây tò mò. Ví dụ các video đang đăng:
"Zombie Outbreak: 14 Days In A City Of Lights. One Wrong Move And They See You", "Zombie Outbreak: A Stranger Fired A Flare And The Zombies
Followed It", "Zombie Survival: Days 8–18 — Can We Trust Her?", "Surviving a year in a bunker (Zombie Outbreak)".
Điểm mạnh: mỗi tập một địa điểm (dễ nghĩ ý, dễ làm thumbnail), người xem ở lại vì "ngày tiếp theo chuyện gì xảy ra", cắt được nhiều Shorts.

Tận dụng thứ đã có: pipeline ảnh GPT (`gpt_anh.py`) + Ken Burns + lời dẫn (`vibi_tts.py`, ElevenLabs) + phụ đề, và bộ người que/zombie
vẽ bằng code (`survival-test/`, `zombie-walk/`: chạy có IK, zombie lê bước, cửa cuốn).

## 2. Định dạng
| Mục | Đề xuất |
|---|---|
| Tên series | **Survival Logs** (tên kênh/thương hiệu có thể đổi) |
| Công thức tiêu đề | `I Survived [N] Days in [Địa điểm] During a Zombie Outbreak` hoặc `Zombie Outbreak: [N] Days in [Địa điểm]. [Chi tiết gây tò mò]` |
| Độ dài | Mỗi tập = **3 phần × 12–15 phút** (16:9) + **bản Full Movie ~40–45 phút** dựng liền mạch (chủ dự án duyệt 2026-11-06; xem `PHAN-TICH-DOODLESURVIVALS.md`) + **2–3 Shorts** 30–60 s, mỗi Short có mở–biến cố–kết riêng |
| Lời kể | Ngôi thứ nhất, quá khứ. **Giọng Titan** (vibi.pro, id `dtSEyYGNJqjrtBArPCVZ`; chủ dự án chốt 2026-11-06 sau 9 mẫu trong `test-giong/`). Model **eleven_multilingual_v2** (chủ dự án chốt sau mẫu 10/11; không dùng tag cảm xúc, chỉnh bằng stability ~0.35, style ~0.4) |
| Hình | **Tạm thời KHÔNG dùng Muse** (chủ dự án 2026-11-06: Muse từ chối 2/3 clip thử có nhân vật chính + zombie/ống thép, kể cả bản không zombie). Chuyển động làm bằng Remotion: Ken Burns, lớp hiệu ứng (mưa, đèn, hơi thở mờ kính, rung), nhân vật tách lớp cử động nhẹ. **GPT vẽ cả cảnh lẫn nhân vật** (test 2026-11-05: người que ghép bằng code trông như sticker, 5,3/10). Model sheet nhân vật gửi kèm mỗi ảnh; khóa sơ đồ bối cảnh và vài góc máy gốc. Ảnh tĩnh + Ken Burns + hiệu ứng nhẹ, mỗi cảnh tĩnh vẫn phải có thông tin mới; clip AI (Muse image→video) cho khoảnh khắc đổi tình thế |
| Dấu hiệu nhận diện | **HUD nhật ký** tối giản: `DAY 7` + tối đa hai tài nguyên đang quan trọng (không đếm zombie, không thanh máu kiểu game); chữ đè "Rule #3: ..." |
| Nhân vật chính | Người que **mũ boonie kaki trơn + ba lô olive có ô vàng** (mẫu F, Codex 9/10; chủ dự án chốt 2026-11-06). Bỏ mũ đỏ D vì trùng mũ trucker đỏ của @DoodleSurvivals; mũ len đã có kênh khác dùng. Vô danh, người bình thường, giỏi dần qua sai lầm |
| Nhạc | Drone/ambient tự tổng hợp (`gen_audio.py`), tiếng zombie, mưa, gió |

Tập độc lập (mỗi tập một địa điểm, một nhân vật chính dùng chung; **cấu trúc mỗi tập phải khác nhau thực chất**, không lặp khuôn kiểm kê → người lạ → nơi trú vỡ → radio thất hứa, để tránh bị YPP xem là nội dung lặp lại), nhưng có sợi dây xuyên suốt nhẹ: chiếc radio, những người lạ, "vùng an toàn"
không ai tìm thấy. Người xem vào giữa vẫn hiểu.

## 3. Khung mỗi tập (12–18 phút)
1. **Mở lạnh 0:00–0:40:** khoảnh khắc nguy hiểm nhất tập (cửa sắp vỡ, đèn pin tắt), dừng ngay trước kết quả → "But let me start from Day 1."
2. **Ngày 1–2:** sự cố ập đến, chọn chỗ trú, sai lầm đầu tiên (luôn có giá phải trả).
3. **Ngày 3–N:** quy luật sinh tồn, kiểm kê đồ (HUD đổi), một sự kiện mỗi vài ngày (tiếng động, người lạ, hết nước).
4. **Bước ngoặt giữa tập:** một người lạ / tín hiệu / kế hoạch thất bại → câu hỏi "tin hay không".
5. **Cao trào:** thoát thân hoặc mất chỗ trú (mở lạnh quay lại đúng lúc này).
6. **Kết + móc câu tập sau:** ngày cuối, cái giá, câu kết một dòng; hé địa điểm tiếp theo.

Shorts: mỗi tập cắt mở lạnh + 2–4 sự kiện căng nhất, thêm chữ "Day 7: ..." trên đầu.

## 4. Danh sách tập (10 ý đầu)
| # | Tiêu đề làm việc | Địa điểm / chiêu chính |
|---|---|---|
| 1 | I Survived 14 Days in a Locked Supermarket | Đồ ăn thì nhiều, nhưng cửa kính trước mặt cả đàn zombie; tiếng chuông cửa tự động là kẻ thù |
| 2 | 30 Days on a Rooftop. The Stairs Were Never Safe | Sống trên sân thượng, hứng nước mưa, nhìn thành phố tắt đèn dần |
| 3 | 7 Days Trapped in a Snowed-In Highway Jam | Hàng nghìn xe kẹt trong tuyết, zombie chậm vì lạnh, chọn xe nào để ngủ |
| 4 | A Stranger Knocked at 3 AM | Tập "tin hay không": người gõ cửa xin vào |
| 5 | 21 Days in an Abandoned Hospital | Thuốc men, máy phát điện, tầng bị khóa |
| 6 | 10 Days on a Cargo Ship Drifting Away | Tưởng an toàn giữa biển, trong container có tiếng động |
| 7 | The Radio Promised a Safe Zone | Tín hiệu cứu hộ: thật, cũ hay bẫy |
| 8 | 40 Days in a Mountain Bunker | Hết đồ dự trữ, phải ra ngoài |
| 9 | 14 Days in an Amusement Park | Bánh xe đu quay làm tháp canh, nhạc tự bật lúc nửa đêm |
| 10 | The Island With No Zombies | Đến được nơi "an toàn"... vì sao không có zombie? |

## 5. Quy trình sản xuất một tập
1. **Kịch bản** (Claude viết, Codex phản biện) → gửi chủ dự án **duyệt** (quy tắc dự án).
2. Lời kể vibi.pro (Titan) → mốc thời gian từng câu → chia **60–100 cảnh** (mỗi cảnh 8–12 s).
3. Ảnh nền GPT theo prompt từng cảnh (một bộ style chung để nhất quán), tự xem, ảnh đạt thì dùng.
4. Remotion: Ken Burns + mưa/sương/đèn chập chờn + người que ghép + HUD + phụ đề; 5–10 cảnh hành động dựng bằng code.
5. QA bằng Codex (thang riêng cho video dài: bám kịch bản, nhịp, nhất quán HUD/đồ đạc, hình, âm thanh) → sửa → render 1080p.
6. Cắt 3–5 Shorts, thumbnail (người que mũ len + zombie + chữ số ngày to). Đăng: bật nhãn nội dung AI.

Ước lượng: chưa cam kết tần suất trước khi đo pilot; giai đoạn đầu khoảng 1 tập/tuần. Trước khi đặt 80 ảnh: test **12 ảnh khó + 3 clip** của nhân vật D (cúi, chạy, quay lưng, cầm đồ, hai người tương tác).

## 6. Rủi ro và cách giữ an toàn cho kênh
- **YouTube "nội dung lặp lại / sản xuất hàng loạt"** (ngách faceless AI dễ bị từ chối kiếm tiền): kịch bản viết riêng có cốt truyện và nhân vật
  xuyên suốt, giọng kể cố định, hình có hoạt hình riêng (không chỉ ảnh tĩnh), không lặp khung tập.
- Bạo lực: giữ mức hoạt hình, không máu me chi tiết (đe dọa bằng âm thanh, bóng, cửa, khoảng cách) — tránh giới hạn quảng cáo.
- Không sao chép tên, nhân vật, hình của kênh khác; chỉ dùng chung thể loại và công thức tiêu đề phổ biến.

## 7. Cần chủ dự án quyết
1. Tập dài 12–18 phút + Shorts, hay chỉ làm Shorts/Reels (60–90 s, mỗi tập một "ngày")?
2. Giọng kể Titan có ổn không (hay tìm giọng khác)?
3. Tên series và nhân vật mũ len + ba lô.
4. Tập thử: đề xuất **#1 Locked Supermarket** (bối cảnh dễ, chiêu rõ, hợp làm thumbnail).
