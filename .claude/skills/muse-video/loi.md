# Lỗi Muse/GPT hay gặp: phòng và cứu

Mỗi dòng: lỗi → cách phòng khi viết prompt hoặc ảnh → cách cứu khi dựng. Bản chi tiết theo từng tập Elise: `.claude/skills/elise/loi-thuong-gap.md`.

## Muse (video)
| Lỗi | Phòng | Cứu |
|---|---|---|
| Vật nhỏ tự hiện hàng loạt (hạt, đá, dây, gói hạt) | Quay cận tay, mỗi clip 2–3 vật; "appears only where her fingers place it" | Cắt trước mốc (thường giây 5–7) |
| Vật tự biến mất (gói hạt, thước dây, dụng cụ) | NEGATIVE "no objects vanishing"; vật nằm xa tay ít bị hơn | Lấy đoạn trước khi biến |
| Dụng cụ đổi dáng hoặc màu (khoan đổi màu, khung thành tấm ván, máy cắt cỏ đẩy tay thành máy xăng) | Tả dáng và màu dụng cụ trong CHARACTER/SCENE; NEGATIVE "no tool changing shape" | Lấy đoạn đầu; hỏng ngay từ đầu clip thì gen lại, khung hình chỉ có đúng vật đó |
| Mặt hay trang phục trôi, găng tay mất, tay áo mọc ra | Khối CHARACTER khóa cứng; ảnh tham chiếu trực diện | Cắt; trôi giữa nhiều clip thì giảm số điểm nối |
| Bề mặt đổi đồng loạt (đất tự phẳng, cỏ mọc trên đất trống) | "only the soil under the rake changes" | Cắt trước mốc |
| Muse tự cắt cảnh hoặc đổi góc giữa clip, QA không bắt | "One continuous shot, no internal cut" | Dò `scene>0.18`; dùng phần sau như một góc mới, nối bằng cắt thẳng |
| Đứng hình ở đầu clip 0,2–1 s | — | `freezedetect`, đặt điểm vào sau mốc đó |
| Đứng không, đung đưa ở cuối clip | Khung cuối là lúc còn làm; "never stands idle or sways" | Cắt đuôi |
| Kéo máy vào cận mặt, máy trôi | "Fixed camera, no zoom, no pan" | Cắt; cảnh cần thấy đồ thì quay cận đồ |
| Đi tới lui, đổi hướng | SHOTS theo giây, nói rõ một hướng đi | Lấy đoạn đi một mạch |
| Lặp lại hành động thay vì chuyển sang việc khác | Khung đầu là tư thế tĩnh, không phải đang giữa hành động | — |
| Người lạ xuất hiện | "Only this one woman/man is ever in the scene" | Cắt |
| **Vật rắn nhỏ tự phình to khi tay xoay hoặc nâng nó lên gần máy** (Garden EP28, 2026-11-11: quả bí mini thành gần kín bàn tay ở giây 3,5; QA GPT cho qua ở một clip khác cùng lỗi) | **Bỏ động tác xoay/nâng**: tay chỉ chạm rồi rời khỏi khung, vật nằm yên tại chỗ. Thêm NEGATIVE "is a rigid solid object… never grows, swells or changes size relative to the hand, and is NEVER lifted or brought closer to the camera" | Lấy đoạn trước mốc phình (thường 3–5 s). Thêm câu FIX suông thì vô ích — phải đổi cách quay |
| **Muse vẽ chữ nhảm lên bao bì, nhãn, gói giấy** dù ảnh khung đã khóa là gói trơn (Garden EP28, 2026-11-11) | Để bao bì **ra ngoài khung** hẳn, đừng chỉ ghi "no letters"; NEGATIVE thêm "no packet, label, paper, writing, letters or printed text ever appears" | Gen lại ảnh khung không có vật đó rồi gen lại clip |
| **Muse bỏ qua mốc giây trong SHOTS, luôn trải đều hành động ra hết 10 s** (Elise Style EP01, 2026-11-12: viết "xong việc ở 3,8 s, giữ tư thế từ 4,8 s", cả 4/4 clip đều xoay tới 6–7 s và về tư thế tận ~8,5 s; gửi lại kèm FIX cũng y nguyên) | **Coi mốc giây chỉ là thứ tự, không phải thời lượng.** Khi lên kế hoạch, giả định mỗi hành động chiếm `10 s ÷ số hành động`. Cần đoạn ngắn thì **giảm số hành động**, đừng ghi mốc giây nhỏ hơn | Lấy gần trọn clip rồi tăng tốc **đúng 1,25× / 2×** (bảng ở `dung-render.md` §3; hệ số khác thì giật). Đừng tốn lượt gen lại chỉ để ép mốc giây — Muse không nghe |
| **Vật nhỏ đeo/cầm (túi nhỏ, ví) biến mất sau khi nhân vật xoay người** (Elise Style EP01: túi vàng mất từ ~6 s, gen lại 3 lần kèm FIX vẫn mất) | Look có vật nhỏ thì bỏ cú xoay khỏi SHOTS; vật to (túi tote) thì giữ được | Cắt trước cú xoay |

## GPT (ảnh)
| Lỗi | Phòng |
|---|---|
| Máy lùi xa hoặc tiến gần giữa hai khung | Câu khóa máy với ảnh thứ hai |
| Vật đổi dáng, đổi cỡ, xoay hướng (luống bị xoay 90°) | Câu khóa hình + hướng ("runs left-to-right across the frame") |
| Bộ lọc chặn "sexual" (quần short + cúi, xổm, quỳ chính diện) | Quay ngang hông hoặc cận tay; "She does not bend over"; "modest, wholesome" |
| Tự thêm tay áo len, áo khoác, ba lô; đổi màu găng | "bare forearms, no sleeves", "no backpack", ghi màu găng |
| Chữ méo trên nhãn, bao bì | Quay nghiêng, ghi "no letters"; chữ thật thêm lúc dựng |
| Gen lại mà nhận về y ảnh cũ | Xóa file trước khi gen; ảnh đã gửi Muse thì đặt tên mới |

## Prompt clip KHÔNG có người (cảnh nền, trước/sau)
- Không được để lọt câu về nhân vật ("she keeps working", "her own hands"): Muse sẽ **tự thêm một người lạ** vào giữa clip (Garden SH001, 2026-11-11).
- Ghi rõ: "Nobody ever enters the frame: no person, no hands"; NEGATIVE thêm "no person, figure or silhouette appearing".
- Cảnh "trước khi làm" phải tả bối cảnh đúng trạng thái đó (sân hoang), không dùng câu SCENE chung có luống/đất đã xới.

## Muse quá tải: ô video kẹt "Loading"
Muse báo đã giao nhưng ô video không tải xong. Link file `muse.ai/files/...<job>...mp4` (thẻ `<a href>`) vẫn có:
`muse_auto.py run ... --chi-gui` tải qua link đó bằng `fetch` trong trang (gọi thẳng từ Python bị chặn mạng).

## Đọc lỗi trước khi gen lại
1. Lỗi nằm ở **ảnh khung** (dáng sai, máy lệch)? Sửa ảnh trước. Gen lại clip mà ảnh vẫn sai thì vô ích.
2. Lỗi là **Muse làm hộ hàng loạt**? Đổi cách quay (cận hơn, ít vật hơn), đừng chỉ thêm câu FIX.
3. Lỗi chỉ ở **một đoạn** của clip? Cắt, không gen lại.
