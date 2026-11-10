---
name: marek-training
description: Làm series "Marek Training" (nhân vật nam lực sĩ/võ sĩ gốc, cảm hứng Baki nhưng người thật, video AI quay thật bằng GPT ảnh + Muse video + ffmpeg). Dùng khi chủ dự án nói tới Marek, Marek Training, tập luyện/tạ/võ của Marek, bảo làm tiếp/sửa/ghép/dọn một tập trong content/marek-training/, hoặc hỏi nhân vật, trang phục, bài học, quy trình của series này.
---

# Marek Training

Trả lời chủ dự án bằng tiếng Việt. Nam lực sĩ/võ sĩ thực thụ **Marek Ivanov** (tên gốc, không phải "Baki" — nhân vật
truyện có bản quyền), tập hàng ngày: tạ cực nặng, bài thân thể khó, đòn võ hoa mỹ gợi cảm hứng truyện tranh nhưng vẫn
là người thật, không siêu năng lực. Cùng pipeline với Elise (ảnh GPT quay thật → video Muse → ghép ffmpeg), nhân vật
và series riêng.

## 1. Đọc đúng file theo việc đang làm

| Việc | File |
|---|---|
| Ngoại hình cố định, trang phục/bối cảnh từng tập, danh sách tập | [../../content/marek-training/models/marek.md](../../content/marek-training/models/marek.md) |
| Lệnh chạy gen ảnh/video Muse/ghép/QA (dùng chung với Elise) | [elise:chay-tool.md](../elise/chay-tool.md) — đổi `$TAP` thành `content/marek-training/epNN-<slug>` |
| Bài học đã rút ra, lỗi hay gặp, cách viết prompt chuyển động | [bai-hoc.md](bai-hoc.md) |

## 2. Ràng buộc không được quên

- **Duyệt nội dung trước** (`CLAUDE.md`): viết danh sách nhịp có giây, gửi chủ dự án, chờ duyệt rõ ràng rồi mới gen/render.
  Sửa nhỏ trên tập đã duyệt thì làm luôn.
- Mỗi tập giữ **càng ít clip càng tốt** (xem bài học #1 trong `bai-hoc.md`) — ưu tiên một lần quay Muse liên tục dài
  (~10s) cho mỗi "cảnh", chỉ tách clip khi một chuyển động liên tục là bất khả thi với Muse.
- Marek không được làm mượt mất cơ: luôn có "natural realistic skin texture with visible pores and muscle striations,
  no airbrushing, no smoothing" trong prompt ảnh/video.
- Muse: side chat riêng `content/marek-training/muse-chat.json`; profile/cổng ghi trong đó — kiểm tra
  `curl http://127.0.0.1:<cổng>/json/version` trước khi chạy; đổi profile thì sửa file này và xoá `url` cũ để tool tự
  tạo session mới.
- QA do GPT chấm chỉ để tham khảo — **luôn tự trích khung và so trực tiếp với ảnh tham chiếu** cho tư thế khó, đừng
  chỉ tin lưới khung hay điểm QA tự động (xem bài học #3).
- Sau mỗi video render xong + đã kiểm tra: dọn file trung gian theo `CLAUDE.md` (liệt kê trước khi xoá).

## 3. Đường dẫn

- `$REPO` = `C:\Users\HoaVan\Desktop\tool AI\project-animation\`
- `$TOOL` = `C:\Users\HoaVan\Desktop\tool AI\muse-auto\`
- Nhân vật: `content/marek-training/models/marek.md` + `models/anh/` (ảnh gốc, `mi-marek-truoc.png` dùng làm tham
  chiếu khuôn mặt cho mọi tập).
- Một tập: `content/marek-training/epNN-<slug>/`, gồm `NOI-DUNG.md`, `anh/`, `gen-anh.csv`, `gen-video.csv`,
  `ghep-v2.csv`, `video/`.
- Script sinh CSV: `content/marek-training/scripts/tao_gen_tapNN.py`.
- Tiền tố ảnh riêng từng tập, không trùng: `mi-` (tập 01), `ml-` (tập 02), `mf-` (tập 03).

## 4. Các tập

| Tập | Thư mục | Nội dung |
|---|---|---|
| 01 | `ep01-deadlift-san-thuong/` | Deadlift tạ đòn cực nặng trên sân thượng, kết bằng tư thế gồng cơ |
| 02 | `ep02-one-arm-lever/` | One-arm elbow lever (chống một tay, thân ngang) trong phòng tập trong nhà |
| 03 | `ep03-footwork-combo/` | Footwork/đấm bốc theo level (lấy cảm hứng app "FunPunch"), kết bằng đá cao |

## 5. Ghi bài học

Lỗi và cách tránh dùng chung cho mọi tập → [bai-hoc.md](bai-hoc.md). Tình trạng từng tập → `NOI-DUNG.md` của tập đó.
Quy tắc ngoại hình/trang phục mới → `models/marek.md`.
