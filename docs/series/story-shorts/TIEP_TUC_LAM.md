# Story shorts (9:16, 10-20 s): tổng hợp để làm tiếp

Ngày chốt: 2026-10-28. Ba thử nghiệm làm video ngắn theo mẫu các reel stickman, **toàn bộ nhân vật vẽ bằng code (SVG/Remotion)**, ảnh GPT chỉ dùng làm nền hoặc bảng thiết kế mẫu. Không dùng image-to-video, không tốn tiền.

## Nguyên tắc chủ dự án đã chốt
- Nội dung trước, hình ảnh làm tốt nhất trong khả năng, không bắt buộc giống mẫu.
- Không tách nhân vật GPT khỏi nền xanh (khó kiểm soát). GPT vẽ **bảng mẫu** để mình đọc rồi vẽ lại bằng code; riêng **nền phòng** thì dùng ảnh GPT trực tiếp.
- Nhân vật phải khác kênh gốc (tóc, trang phục): chồng tóc đen rẽ ngôi, vợ tóc bob nâu. Ảnh cắt từ video gốc (`refs/`) chỉ để tham chiếu phong cách, **không commit/push**.
- Image-to-video (LTX/Wan trên RTX 3060 Ti ở nhà) chỉ để dành cho đoạn cần chuyển động thật; chưa dùng cho series nào ở đây.

## Ba bản làm thử

| Bản | Mẫu | Trạng thái | Composition | Thư mục |
|---|---|---|---|---|
| Better Together | reel "leo núi cùng nhau" (12.5 s) | Xong bản đầu, có tiếng; cảnh leo còn cứng (ảnh trượt) | `BetterTogether` | `demo-project/src/better-together/`, `content/better-together/`, kế hoạch ở `docs/series/better-together/KE_HOACH.md` |
| Classroom gag (Who is stupid) | reel hài lớp học, học sinh đầu trắng + thầy đầu đỏ | Xong tập 1, hoạt hình đã nâng (dậm chân, nhảy lùi, giận dần, rung máy) | `ClassroomGagEp01` | `demo-project/src/classroom-gag/`, `content/classroom-gag/` |
| Bedroom gag (Toilet) | reel hài vợ chồng ban đêm (21 s gốc, bản mình 12 s) | Xong bản đầu: nhân vật code theo bảng GPT, nền GPT; còn lệch nhỏ | `BedroomGagEp01` | `demo-project/src/bedroom-gag/`, `content/bedroom-gag/` (có README riêng) |

## Quy trình làm một tập (kiểu gag hội thoại)
1. Viết thoại vào `content/<series>/<tập>.json` (ai nói, câu gì, giọng edge-tts, tốc độ, cao độ; bedroom thêm `lead`, `gap`, `tail`).
2. `python scripts/gen_gag_voice.py <tập> [series]` (series mặc định `classroom-gag`). Ghi giọng vào `demo-project/public/<series>/<tập>/voice_N.mp3`, SFX `pop/whoosh/thud`, và `demo-project/src/<series>/<tập>.json` kèm thời gian từng câu. **mp3/wav bị .gitignore: máy mới phải chạy lại lệnh này.**
3. Render: `cd demo-project && npx remotion render <Composition> ../renders/<tên>.mp4 --port=<cổng khác 3411>`.
4. Kiểm tra bằng khung hình: `ffmpeg -i video.mp4 -vf "select='eq(n,50)+eq(n,150)'" ...`.

Mỗi tập mới = một JSON + đăng ký composition trong `Root.tsx` (marker `// stickman-video:imports` và `{/* stickman-video:compositions */}`).

## Bedroom gag: ảnh GPT và code nhân vật
- Prompt: `content/bedroom-gag/assets.csv` (CS1 bảng chồng, CS2 bảng vợ, CS3 bảng biểu cảm, CS4 bảng tay, BG1-3 nền đêm / bật đèn / cửa mở). Ảnh đính kèm tham chiếu: `refs/montage_faces.png`, `crop_husband_standing.png`, `crop_wife_sitting.png`.
- Ảnh đã tạo nằm ở `content/bedroom-gag/models/`. Muốn đổi, lưu đè đúng tên rồi `python scripts/bedroom_export.py` (kiểm tra đủ 7 ảnh, chép sang `public/`).
- Code: `Video.tsx` (nhịp + cảnh), `Room.tsx` (nền + vị trí nhân vật), `Characters.tsx`/`Shirt.tsx`/`Primitives.tsx` (thân, tay, chân), `Face.tsx`/`Hair.tsx` (mặt, tóc), `config.ts`. Xem trước: `node demo-project/src/bedroom-gag/render-preview.cjs`.
- Bảng màu thật lấy từ ảnh mẫu nằm trong `PALETTE` ở `Face.tsx`.

## Bài học
- Hoạt hình có "hồn" bằng code đến từ: pose keyframe có easing và overshoot, chuẩn bị trước khi nhảy (anticipation), co dãn khi hạ cánh, gật đầu theo lời, mắt đảo, giá trị "giận" liên tục (không đổi mặt đột ngột), tóc/cà vạt/hơi nước chuyển động phụ, giật máy khi punchline.
- Phụ đề lớp học: vàng viền đen, chia theo "and/then". Reel phòng ngủ gốc không có phụ đề.
- Cắt cảnh toàn / cận cảnh: cận cảnh = nền phòng zoom + blur, mặt vẽ to phía trên; rẻ mà có chiều sâu.
- Vị trí nhân vật trên nền GPT phải đo theo ảnh (gối, mép chăn, sàn, cửa). Đo sai là "lệch hết"; kiểm tra bằng khung hình sau mỗi lần chỉnh.
- Chân tay mảnh trông yếu: tay chân đã dày thêm ~40-50% và bàn tay có ngón cái (theo bảng nhân vật).
- Công cụ: Bash heredoc dài kèm dấu nháy dễ vỡ; dùng Write/Python thay vì heredoc. Render still/video chậm (1-2 phút), chạy nền.

## Còn lại / ý tưởng tiếp
- Bedroom: quần short chồng thò ra giường (cảnh đầu) chưa đẹp; cảnh cuối chồng mới là bóng đen đi vào cửa; thân vợ ngồi hơi nhỏ; giãn nhịp thoại (bản gốc 21 s, bản mình 12 s).
- Classroom: viết tập 2-3, thay nền bằng ảnh GPT (`BG_IMAGE` trong `Video.tsx`, prompt trong `content/classroom-gag/assets.csv`).
- Better Together: thay cảnh leo bằng clip image-to-video (kế hoạch ở `docs/series/better-together/KE_HOACH.md`).
- Series: đặt tên, chọn 1 khuôn (hội thoại 4-6 câu, cú lật cuối), viết 5-10 kịch bản gốc (không chép câu đố nổi tiếng nguyên văn).
