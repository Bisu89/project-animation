# TIẾP TỤC LÀM — đọc file này đầu tiên khi mở phiên mới (cập nhật 2026-10-20)

Repo: `C:\Users\hoavx\Desktop\stickman-video`, nhánh `main`, remote `project-animation` (`https://github.com/Bisu89/project-animation.git`). Đã commit + push ngày 19/10 (commit `cb84154`: kịch bản mới, hiệu ứng, âm thanh, youtube.md). Video/ảnh/âm thanh sinh tự động KHÔNG push (xem `.gitignore`); máy mới phải tạo lại bằng các lệnh bên dưới.
Chi tiết kỹ thuật: `HANDOFF.md` (mục 0, tiếng Anh). Bản tiếng Việt tóm tắt cả series: `TOM_TAT_TIENG_VIET.md` (cùng thư mục).

**Quy tắc viết kịch bản (12 điều, bạn đặt 20/10): đọc `WRITING_RULES.md` cùng thư mục trước khi viết hay sửa bất kỳ tập nào.**

## Quy tắc làm việc bạn đã đặt
1. **Viết truyện trước → bạn duyệt → rồi mới làm video.**
2. Trả lời bằng tiếng Việt; lời bình và chữ trong video là tiếng Anh.
3. Video (`*.mp4`) không push lên git. Nhạc/âm thanh/ảnh sinh tự động cũng không (đã nằm trong `.gitignore`).
4. Kiểu video: ảnh AI + zoom/trượt mượt + giọng đọc + phụ đề + hiệu ứng "ảnh sống" (đèn chập chờn, nhịp tim, rung cửa, thẻ giao diện...). Không làm hoạt hình que đầy đủ.
5. Nhân vật học kỹ năng **từng ngày**; quy tắc 1 (tiếng động hút chúng) ở Tập 1, quy tắc 2 ở Tập 2, quy tắc 3 ở Tập 3.
6. Nhân vật không giới tính cụ thể, không có người thân (bạn đã bỏ tuyến "em gái" vì series là sinh tồn một mình).

## Hiện trạng Tập 1 (2026-10-20): ĐÃ RENDER XONG BẢN FULL, chờ bạn xem
| Hạng mục | Trạng thái |
|---|---|
| Kịch bản | Bản của bạn đã áp dụng: `content/zs-ep01/script.md` (đọc, tiếng Anh) + `script.vi.md`. Đã bỏ "em gái", bỏ câu "khoảng hai giờ" tới cầu. 2105 từ ≈ 12,2 phút. |
| Giọng đọc + timeline | en-US-GuyNeural, rate -2%, nghỉ đoạn 0,55 s. 230 câu, 733 s. |
| Chia cảnh | 48 ảnh (`content/zs-ep01/scenes.csv`, `demo-project/src/zs-ep01/scenes.ts`), ~14,7 s/ảnh. Prompt + hiệu ứng từng cảnh: `content/zs-ep01/prompts.txt`. |
| Ảnh | **Đủ 48 ảnh thật** ở `demo-project/public/zs-ep01/images/scene01..48.png` (không push git). Ảnh cũ cất ở `content/zs-ep01/old_v1/`. Một số ảnh có zombie xuất hiện sớm hơn kịch bản (cảnh 1, 9, 10...) — bạn đã chọn giữ nguyên. |
| Âm thanh | 27 SFX + nhạc nền "dread" đã tạo; SFX gắn theo câu lời bình qua `demo-project/src/zs-ep01/sfxrules.json`. Chưa nghe thử trực tiếp (chỉ đo mức âm lượng). |
| Render | `demo-project/out/zs-ep01.mp4`: 734,9 s (12:15), 526 MB. Đã **tắt rung hình và màn hình đỏ** theo góp ý (`FX_SHAKE`, `FX_RED` = false ở đầu `Fx.tsx`). Tọa độ hiệu ứng cả 48 cảnh đã chỉnh theo ảnh thật. |
| Đóng gói YouTube | `content/zs-ep01/youtube.md`: 3 tiêu đề, mô tả + mốc chương, hashtag, tag (cách nhau dấu phẩy), 2 prompt thumbnail. Mốc chương tính theo giọng đọc hiện tại, phải tính lại nếu đổi giọng/lời bình. |

## Hiệu ứng "ảnh sống" đã làm (file `demo-project/src/zs-ep01/Fx.tsx`, token viết trong `prompts.txt` trước dấu `|`)
- Đèn: `lamp` (đèn đường/trần chập chờn, `fail` = chập chờn rồi tắt hẳn), `glow` (đèn màu: nhấp nháy xi-nhan, nhịp đập), `screen` (màn hình điện thoại sáng nhịp nhàng).
- Ảnh "thở": `breath` (ngực phập phồng), `sway` (rèm/tóc đung đưa) — chỉ vùng nhỏ, biên độ nhẹ.
- **Nhép miệng** `talk` — miệng mở theo độ to của giọng đọc, chỉ dùng cho 2 câu thoại của nhân vật (cảnh 24 "Is anyone home?", cảnh 27 "Sorry… I just need—"). Cần ảnh cận/trung cảnh nhìn rõ miệng + tọa độ chính xác.
- Cả khung: `torch` (phòng tối chỉ sáng bởi chùm đèn pin lắc lư), `heart:bpm` (viền đỏ đập + tiếng tim), `alarm` (đèn đỏ khẩn cấp), `fog` (sương/khói trôi), `dust`, `wind`, `rain`, `flicker`, `hand` (rung tay cầm máy).
- Rung máy theo sự kiện: cửa bị đẩy, va đập, vật đổ (cột `shake` trong `sfxrules.json`).
- Thẻ giao diện chữ thật (AI không viết được chữ): `card:alert` (cảnh báo khẩn cấp), `card:chat` (nhóm chat cư dân), `card:evac` (tin nhắn sơ tán), `card:nosignal`.
- Bảng giờ đầu mỗi chương: "DAY 1 · THE TRAP 07:50"... (bảng `HUD` trong `Fx.tsx`).

## Đã viết thêm (2026-10-20) — chờ bạn duyệt
- Độ dài mục tiêu mỗi tập **13–15 phút ≈ 2300–2600 từ** (giọng đọc ~2,87 từ/giây). Tập 1 hiện 12,2 phút.
- **Tập 2** `content/zs-ep02/script.md` + `script.vi.md` = **bản của bạn** (~2000 từ, nhiều đoạn ngắn nên đọc ra ~13 phút), đã sửa vài chỗ logic nhỏ; quy tắc 2 = "Find another way out before going farther in"; cái loa đúng 12 giờ nói "Evacuation transport is arriving".
- **Tập 3** `content/zs-ep03/script.md` + `script.vi.md` (đã viết lại theo bộ 12 quy tắc, ~1990 từ ≈ 11–12 phút; ngày 3: nước; bình nước nóng phòng khám; quy tắc 3).
- Dàn ý đã cập nhật ở `EPISODE_OUTLINE.md`, sổ trạng thái ở `SURVIVAL_STATE.md` (bảng "Revision"). Tập 4–7 vẫn là nháp/dàn ý cũ, phải viết lại theo bảng mới (thức ăn đã = 0 từ Ngày 1) trước khi duyệt.
- **Tập 2 — CSV ảnh đã tạo** (2026-10-20): giọng đọc + timeline (699 s ≈ 11,7 phút, 223 câu), **47 ảnh** ở `content/zs-ep02/scenes.csv` (prompt + hiệu ứng nhẹ, nguồn `content/zs-ep02/prompts.txt`). Hiệu ứng chỉ là zoom/trượt chậm, ánh sáng ổn định, bụi/gió nhẹ và thẻ ghi chú `card:note1/note2` (hiện chữ quy tắc trên điện thoại) — KHÔNG nhấp nháy đỏ, rung, tim đập. Ảnh lưu vào `demo-project/public/zs-ep02/images/scene01..47.png`; chưa có Video/Composition cho Tập 2 (sao chép từ `zs-ep01/Video.tsx`), bảng giờ `HUD` trong `Fx.tsx` mới có chương của Tập 1.
- Quy trình: duyệt kịch bản → mới tạo giọng đọc/ảnh/render (đúng quy tắc 1).

## Việc kế tiếp
1. Bạn xem `out/zs-ep01.mp4`, báo hiệu ứng/tiếng nào quá tay hay nghe giả (chỉnh volume ở `sfxrules.json`, tắt hiệu ứng bằng cách xóa token trong `prompts.txt`; không cần tạo lại giọng đọc, chỉ cần `build_scenes.py` rồi render).
2. Có thể bật lại rung/đỏ nếu muốn: đổi `FX_SHAKE`/`FX_RED` trong `Fx.tsx`.
3. Tạo thumbnail (prompt trong `youtube.md`), đăng Tập 1.
4. Tập 2 (viết → bạn duyệt → làm). Tập 2–5 trong `content/zs-ep02..05/script.md` mới là nháp cũ, chưa khớp bản Tập 1 mới (nhân vật không giới tính/không người thân; khoảng cách tới cầu để ngỏ; food = 0 cuối Tập 1) — phải rà lại trước khi duyệt.

## Lệnh hay dùng (chạy trong `C:\Users\hoavx\Desktop\stickman-video`)
- Giọng đọc: `python scripts/gen_voice.py --script content/zs-ep01/script.md --out demo-project/public/zs-ep01 --timeline-out demo-project/src/zs-ep01 --rate=-2% --para-pause 0.55` rồi `python scripts/voice_env.py --slug zs-ep01` (độ to giọng cho nhép miệng).
- Chia ảnh: `python scripts/build_scenes.py --slug zs-ep01 --target 15`; ảnh giữ chỗ: `python scripts/make_placeholders.py --slug zs-ep01`.
- Âm thanh: `python scripts/gen_zs_sfx.py --out demo-project/public/zs-ep01`; nhạc: `python scripts/gen_zs_music.py --slug zs-ep01`; kiểm tra luật SFX: `python scripts/check_sfx_rules.py zs-ep01`.
- Render một đoạn (đỡ mệt máy): `cd demo-project && npx remotion render ZsEp01 out/zs-ep01-preview.mp4 --frames=0-3400` (10 cảnh đầu ≈ 0–3400).
- Render đầy đủ: `npx remotion render ZsEp01 out/zs-ep01.mp4`. Kiểm tra kiểu trước: `npx tsc --noEmit`.
- Bảng ảnh vẽ sẵn vị trí hiệu ứng (kiểm nhanh, không render): `python scripts/fx_sheets.py zs-ep01 11 48 --cols 2 --rows 2`; đổi hiệu ứng nhiều cảnh một lần: `python scripts/set_fx.py zs-ep01 fx.json` rồi `build_scenes.py`.
- Ảnh tĩnh kiểm tra hiệu ứng: `npx remotion still ZsEp01 out/x.png --frame=330 --props='{"debug":true}'`.

## Lưu ý kỹ thuật
- Viết file Python bằng công cụ Write rồi chạy, đừng dùng heredoc dài có tiếng Việt (lỗi mã hóa trên Windows).
- Phiên âm tự động: `faster-whisper` bị crash máy này; dùng `openai-whisper` (đã cài) qua script riêng, không dùng `scripts/transcribe_voice.py` (nó thử faster-whisper trước).
- Thư mục `checkvideo/` (2 video tham khảo của kênh Wild Instinct + transcript) nằm trong `.gitignore`.
