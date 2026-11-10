# Lỗi đã gặp và cách tránh

## Ảnh GPT
- Nhân vật phụ bị vẽ thành người que → ghi "REALISTIC painted ... (not a stick figure)".
- GPT tự thêm người/zombie vào trong tiệm → ghi rõ "Nobody else is inside the store: no zombies, no people, no silhouettes inside".
- Đặt sai bối cảnh (cảnh văn phòng thành ngoài đường) → gọi tên phòng + đồ vật đã có ở ảnh trước ("same office as before: desk,
  water jug, wall clock"), thêm "Not outdoors".
- Chi tiết then chốt quá mờ (bóng nhỏ trên màn hình camera) → nói nó là "focus of the frame", kích thước tương đối, tư thế.
- Trạng thái đồ vật sai thời điểm (pháo đã cháy khi còn đang can) → ghi trạng thái ("UNLIT, cap on, no smoke, no red glow").
- Cảnh trong nhà bị vẽ ra ngoài trời (cửa bảo trì trong dock thành cửa cuốn ngoài ngõ; danh sách ở sân vận động thành kệ siêu thị):
  KHÔNG chấp nhận nếu lời kể nói rõ chỗ. Mở prompt bằng "INSIDE the enclosed ..." + đồ vật cố định của phòng, gửi kèm ảnh đã có của
  cùng vật làm mẫu (cột 5 trong `anh_p23.py`, ví dụ `["p3-11.png"]`). Sau mỗi lần sửa lời kể, rà lại contact sheet toàn phần.
- Hết lượt GPT ("usage limit ... try again at HH:MM") dùng chung mọi phiên → hẹn giờ chạy lại (vòng `Start-Sleep` trong lệnh nền),
  `gpt_anh.py` tự bỏ qua ảnh đã có. Không chạy Codex QA cùng lúc với lô ảnh lớn.

## Dựng
- Ảnh đứng > 20 s nhìn chán: chèn ảnh dùng lại (P1/P2 cùng sự việc) vào giữa đoạn, `dung_phan.py` tìm ảnh ở pN, p1, p2, test-75s.

## Giọng / thời lượng
- Titan nhanh (~190–200 từ/phút): ước thời lượng theo tốc độ này, không theo 140. Chủ dự án: cần hay, không cần dài; không độn chữ.
- Câu bị cắt ("Wel—"), bản tin bị cắt: thu đủ câu, cắt bằng dựng (`dur` ngắn trong timeline), không dựa vào dấu gạch ngang.

## QA (Codex)
- Contact sheet lấy mẫu thưa làm Codex tưởng phụ đề lệch → kiểm tra khung đúng mốc trước khi sửa; báo trước trong đề QA.
- Codex đôi khi báo thiếu thứ có trong ảnh (kệ chặn cửa) → luôn tự xem ảnh gốc trước khi sửa.
- Chấm lời kể: effort medium dao động ±3 điểm và mỗi vòng nhặt lỗi mới; dùng effort high, sửa tới khi không còn MUST, rồi gom
  chỗ lặp do vá nhiều vòng (P3 tập 1: 10 vòng, 82 → 92).
- Lỗi thật hay gặp: HUD số liệu đứng yên qua nhiều ngày; mở lạnh thiếu nguy cấp; lời nói tới vật mà hình không có.

## Muse (không dùng cho series này)
- Muse từ chối clip có nhân vật chính + zombie gần / cầm ống thép, kể cả prompt "family-friendly" và bản không zombie; công cụ không
  nhận ra câu từ chối nên chờ đủ 40 phút. Clip zombie một mình thì qua. Chat riêng còn lưu ở `content/survival-logs/muse-chat.json`.

## Remotion
- `tsconfig` es2015: không `padStart`, `flatMap`; dùng `reduce`.
- Short dùng hai lớp Part (nền mờ + khung chính): lớp nền phải `mute`, không thì tiếng bị đôi.
- Chạy lệnh từ đúng thư mục (`demo-project` cho remotion, repo gốc cho python) — lệnh nền dễ bị chạy nhầm thư mục.
