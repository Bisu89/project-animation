---
name: survival-logs
description: Làm series YouTube "Survival Logs" (nhật ký sinh tồn zombie, người que 2D trên nền tranh GPT, lời kể tiếng Anh Titan, 16:9; mỗi tập = 3 phần + Full Movie + 3 Shorts). Dùng khi chủ dự án nói tới Survival Logs, zombie người que, tập/part/short mới, sửa/render/đăng một phần trong content/survival-logs/, hoặc hỏi nhân vật, giọng, quy trình của series này.
---

# Survival Logs

Trả lời chủ dự án bằng tiếng Việt. Series: người que 2D (GPT vẽ) trên thế giới tranh u tối chi tiết; chuyển động làm bằng
Remotion (Ken Burns, mưa, đèn chập chờn, rung, lớp chữ). **Không dùng Muse** (chủ dự án 2026-11-06: Muse từ chối cảnh có nhân vật
chính + zombie/vũ khí). Lời kể ngôi thứ nhất, giọng Titan; mẹo sinh tồn thật ~15–20% thời lượng, lồng trong hành động.

## 1. Đọc đúng file theo việc đang làm
| Việc | File |
|---|---|
| Nhân vật, giọng, model sheet, phong cách ảnh | [nhan-vat.md](nhan-vat.md) |
| Quy trình một tập từ ý tưởng tới đăng (các bước, ai duyệt lúc nào) | [quy-trinh.md](quy-trinh.md) |
| Lệnh chạy: gen ảnh, thu giọng, dựng timeline, render, QA, thumbnail, Short | [lenh.md](lenh.md) |
| Lỗi đã gặp và cách tránh (ảnh GPT, giọng, QA, Muse, hết lượt GPT) | [loi-thuong-gap.md](loi-thuong-gap.md) |

## 2. Ràng buộc không được quên
- **Duyệt trước** (`CLAUDE.md`): cốt truyện → continuity → chia cảnh → lời kể; gửi chủ dự án, chờ OK rồi mới gen/thu/render.
  Codex review mỗi bước trước khi gửi.
- Format: mỗi tập 3 phần (~6–9 phút mỗi phần, cần **hay chứ không cần dài**), bản Full Movie liền mạch, 3 Shorts 9:16.
- Khác biệt với kênh @DoodleSurvivals (vector phẳng, mũ trucker đỏ, kể ngôi "You"): giữ tranh GPT, mũ boonie kaki, ngôi thứ nhất;
  không dùng mô-típ bí ẩn của họ (gõ dưới sàn, giấy chữ của mình, radio giọng mình).
- Bạo lực mức hoạt hình, không máu me. Bật nhãn AI khi đăng.
- GPT (ảnh + Codex) dùng chung hạn mức với các phiên khác: chạy ảnh trước, QA sau; hết lượt thì hẹn giờ chạy lại.
- Sau mỗi video: dọn file trung gian theo `CLAUDE.md` (liệt kê trước khi xóa).

## 3. Đường dẫn
- `$S` = `content/survival-logs/`: `SERIES-PLAN.md`, `PHAN-TICH-DOODLESURVIVALS.md`, `models/` (model sheet), `test-giong/`.
- Một tập: `$S/epNN-<slug>/`
  - `COT-TRUYEN.md`, `CONTINUITY.md`, `P1-CANH.md`, `PN-LOI-KE.md` (tài liệu duyệt);
  - `pN/kich_ban.py` (bảng dựng: lời, ảnh, sfx, HUD), `pN/anh/`, `pN/gen-anh.csv`, `pN/audio/`;
  - `anh_p23.py` (danh sách ảnh P2/P3), `dung_phan.py` (thu giọng + timeline), `tao_thumbnail.py`, `tao_thumb_short.py`;
  - `video/` (mp4 cuối: các Part + Shorts), `thumb/` (thumbnail), `DANG-*.md` (tiêu đề/mô tả/chương), `NOI-DUNG.md` (tình trạng).
- Remotion: `demo-project/src/survival-logs/` (`P1.tsx`, `Part.tsx` dùng chung, `P2.tsx`, `ShortP1.tsx`, `ShortClip.tsx`,
  `pN-data.json`); tài nguyên `demo-project/public/survival-logs/` (`sfx/`, `pN/`).
- Âm thanh tổng hợp: `scripts/gen_survival_sfx.py`. Giọng: `scripts/vibi_tts.py` (key trong `.env`, không in ra).

## 4. Ghi bài học
Lỗi dùng chung → [loi-thuong-gap.md](loi-thuong-gap.md). Tình trạng tập → `NOI-DUNG.md` của tập. Quy tắc mới của chủ dự án → file
tương ứng trong skill này.
