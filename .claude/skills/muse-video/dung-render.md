# Xem clip, chọn đoạn sạch, dựng, render

## 1. Xem từng clip (đừng chỉ tin QA GPT)
- Lưới 1–2 khung/giây: `python .claude/skills/elise/scripts/luoi_khung.py clip.mp4 out.png --fps 1 --rong 160 --cot 10`.
- Dò **Muse tự cắt cảnh**:
  ```
  ffmpeg -i clip.mp4 -vf "select='gt(scene,0.18)',showinfo" -f null - 2>&1 | grep pts_time
  ```
- Dò **đứng hình ở đầu clip** (thường 0,2–0,4 s, có khi tới 1 s):
  ```
  ffmpeg -i clip.mp4 -vf "freezedetect=n=0.003:d=0.15" -t 1.5 -f null -
  ```
- Ghi lại mốc vật tự hiện, đổi dáng, găng mất, máy trôi, đứng không. **Cắt trước mốc đó.**
- Ghi điểm vào/ra vào **một file quyết định cắt riêng** (ví dụ `edit_decisions.json` hoặc `ghep-v2.csv`). Không sửa CSV gốc dùng để gen.
- Thiếu đoạn sạch thì **rút shot đó và cân sang shot hay đoạn chưa sản xuất**. Không kéo khung đứng, không làm chậm quá 1,5×.
- Muse tự đổi góc giữa clip: phần sau mốc đổi có thể dùng như một góc máy mới, nối bằng cắt thẳng.

## 2. Chuyển cảnh
| Chỗ nối | Reel dọc ngắn | Phim dài 16:9 |
|---|---|---|
| Hai clip cùng một cảnh hoặc cùng khung hình | Hòa 0,25 s (`mo`) | Hòa 0,25 s |
| Sang shot hoặc góc khác, cùng lúc | Hòa 0,25 s | **Cắt thẳng**, tốt nhất theo động tác |
| Nhảy thời gian | Hòa 0,5 s (`mo_dai`) | Hòa 0,5–1 s hoặc cắt sang cỡ cảnh khác hẳn |
| Đổi ngày hoặc chương | — | Mờ qua đen 0,5 s kèm chữ |
| Trước/sau cùng khung hình | — | Hòa khoảng 2 s |

Muse không bao giờ dừng đúng khung cuối, nên hai clip cùng khung hình mà cắt cứng thì sẽ giật.
Phim dài mà hòa ở mọi chỗ thì trông như slideshow. Tránh cắt nhảy, tức hai shot liền nhau cùng góc và cùng cỡ cảnh.
Phần hòa phải lấy **đuôi dư của clip trước** (Muse tạo 10 s, chỉ dùng khoảng 6 s), nhờ vậy tổng thời lượng không đổi.

## 3. Render: GIỮ 24 FPS (bài học 2026-11-11)
- Clip Muse là **24 fps** (ngang 1248×704, dọc 704×1248). **Đổi sang 30 fps sẽ lặp 1 trong mỗi 5 khung, làm phim giật đều.** Chủ dự án đã bắt lỗi này.
- Dựng bằng **ffmpeg** ở 24 fps:
  - mỗi clip: `trim` đúng khung, `scale=W:H:flags=lanczos`, `setsar=1`;
  - nối bằng `xfade` (hòa), hoặc `xfade` 1 khung (coi như cắt);
  - dựng từng đoạn rồi nối `-c copy` để tiết kiệm RAM.
- **Không** đưa clip Muse vào Remotion `OffthreadVideo`/`Html5Video` ở 30 fps. Máy ít RAM thì `OffthreadVideo` báo lỗi "No frame found at position", còn `Html5Video` lặp khung.
- ffmpeg mới: `-filter_complex_script` đã bỏ, dùng `-/filter_complex <file>`.
- Script mẫu:
  - phim dài: `content/elise-garden/long-form/tools/render_ffmpeg.py` (dựng theo SQ, hòa trong slot, hạ tiếng khi có lời dẫn, chữ đè `drawtext`, chuẩn hóa loudnorm);
  - reel: `muse-auto/ghep.py` (cột `cat_tu`, `cat_den`, `chuyen_canh`).

## 4. Âm thanh
- Tiếng gốc Muse mờ vào và ra khoảng 0,08 s ở mép mỗi clip.
- Có lời dẫn thì hạ tiếng nền: `sidechaincompress` với lời dẫn làm tín hiệu điều khiển.
- Chuẩn hóa: `loudnorm=I=-16:TP=-1.5:LRA=11`. Clip Muse chênh âm lượng nhiều, chưa chuẩn hóa thì LRA lên tới 26 LU.
- Lời dẫn đọc qua vibi.pro (`scripts/vibi_tts.py`, key trong `.env`). **Không lồng giọng tạm.**
- Nhạc chỉ dùng khi có quyền sử dụng rõ ràng.

## 5. Kiểm trước khi giao
```
ffprobe out.mp4                                                   # khung hình, fps, thời lượng
ffmpeg -ss 5 -t 20 -i out.mp4 -vf mpdecimate,showinfo -an -f null - # số khung giữ lại ≈ 24×20 = 480 (không lặp khung)
ffmpeg -i out.mp4 -af ebur128 -f null -                           # I ≈ -16..-19 LUFS, LRA thấp
ffmpeg -i out.mp4 -vf blackdetect=d=0.2:pix_th=0.08 -an -f null - # khung đen ngoài ý muốn
```
Rồi xem lưới khung của cả video. **Nói rõ đã kiểm bằng cách nào**, ví dụ đo máy hay nghe bằng tai, và nói thẳng lỗi còn lại.
