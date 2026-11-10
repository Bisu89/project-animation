# Kế hoạch sản xuất: phân vai, thư mục, khối lượng, cổng duyệt

Cập nhật 2026-11-06 theo **WORKFLOW CORRECTION** của chủ dự án:
- Muse AI là công cụ tạo video duy nhất, người dùng tự thao tác.
- Codex làm hậu kỳ bằng Remotion.
- Không xây API tạo video, không tích hợp dịch vụ video khác.

## 1. Phân vai

| Ai | Làm gì | Đầu vào | Đầu ra |
|---|---|---|---|
| **Claude**, sản xuất sáng tạo | Kịch bản, storyboard, shot list, prompt ảnh khung, prompt Muse, thiết kế khung đầu và cuối, giữ liên tục | Brief, phản hồi | `data/**.json` → `docs/EP01_STORYBOARD.md`, `episodes/EP01/PILOT_8_SHOTS.md`, `media/gen-anh.csv`, `media/muse_queue.csv` |
| **Người dùng + Muse AI** | Tạo từng clip trên web Muse: tải lên khung đầu, khung cuối và ảnh tham chiếu, dán prompt | `media/anh/*.png` + prompt copy từ PILOT_8_SHOTS | `media/muse/<shotId>_<nn>.mp4` |
| **Codex**, hậu kỳ | Quản lý asset và manifest, nhận video, báo thiếu, sai thời lượng, sai thứ tự; dựng timeline Remotion; lời dẫn, âm thanh, nhạc; render | `media/muse_queue.csv`, `media/muse/`, `data/episodes/EP01/*.json` | Bản dựng thử pilot, rồi cả tập 1920×1080 30 fps |

Ảnh khung: Claude viết prompt. Ảnh tạo bằng GPT/Codex, có thể chạy `muse-auto/gpt_anh.py` với `media/gen-anh.csv`.
Muse **không nhớ gì giữa các lần tạo**. Mỗi prompt tự mô tả lại Elise, trang phục và khu vườn, và lần nào cũng gửi kèm ảnh tham chiếu.

## 2. Thư mục và quy ước tên

```
long-form/
  ELISE_GARDEN_MASTER.md
  data/                              ◄ NGUỒN DUY NHẤT (Claude sửa)
    series.json garden_layout.json garden_state.json assets.json characters/elise.json
    episodes/EP01/ episode.json shots.json narration.json qa_report.json
  tools/garden_ep.py                 validate | views | csv
  docs/                              brief, master, review, plan, status, EP01_STORYBOARD.md (sinh tự động)
  models/                            ảnh Elise bản dài (chưa có)
  episodes/EP01/
    PILOT_8_SHOTS.md                 gói pilot để copy prompt (sinh tự động)
    media/
      gen-anh.csv                    prompt ảnh khung theo thứ tự phụ thuộc (sinh tự động)
      anh/                           ảnh khung + plate, đúng tên trong gen-anh.csv
      muse_queue.csv                 danh sách clip Muse = manifest cho Codex (sinh tự động)
      muse/                          ◄ người dùng thả video Muse vào đây
      exports/                       bản dựng pilot / báo cáo xuất; hiện chưa có render
```

| Loại | Tên | Ví dụ |
|---|---|---|
| Video Muse | `<shotId>_<nn>.mp4`, `nn` là thứ tự clip trong shot | `SH018_01.mp4`, `SH018_02.mp4` |
| Bản làm lại | thêm `_r2`, `_r3`; bản đạt đổi về tên gốc hoặc ghi trong manifest | `SH018_02_r2.mp4` |
| Ảnh khung | `gl1-<shotId>-a/b/c.png` (a là khung đầu) | `gl1-SH052-b.png` |
| Plate nền | `gl1-P-<camera>-<state>.png` | `gl1-P-A-S0.png` |

`muse_queue.csv` có các cột: `order, shot_id, clip_id, output_file, first_frame, last_frame, reference_image, muse_seconds, edit_seconds, timeline_start_s, pilot_start_s, prompt, audio_note, status`.
- `timeline_start_s` là vị trí trong EP01; `pilot_start_s` là vị trí trong bản chọn 8 shot liên tục 80,5 s. Không dùng timecode EP01 để dựng bản pilot.
- `edit_seconds` là số giây dùng trên timeline, luôn ≤ `muse_seconds`. Codex chọn đoạn sạch sau khi xem clip, không mặc định lấy từ giây 0: đầu Muse có thể đứng hình 0,2–0,4 s. Ghi điểm vào/ra của bản chọn trong manifest hậu kỳ riêng, không để sinh lại queue xóa quyết định cắt.
- `status` hiện tự thành `generated` khi file đã có trong `muse/`: chỉ là phát hiện file, **không phải đã QA/approved**. Chưa có watcher/ingest tự động; không coi tính năng này đã hoàn thành.

Ngoại lệ có chủ ý: `SH024_01.mp4` là clip nền không người của cảnh đất hoang. Ngoài 2 s ở SH024, Codex dùng lại nó cho SH004 và SH066.

## 3. Việc của Codex (gợi ý, không bắt buộc cách làm)
1. **Ingest**: quét `media/muse/`, đối chiếu `muse_queue.csv`. Báo các trường hợp:
   - thiếu file, hoặc file không có trong danh sách;
   - thời lượng < `edit_seconds`;
   - khung không phải 16:9.

   Không tự đổi tên file hay bịa đường dẫn.
2. **Timeline Remotion**: mỗi clip là một `<OffthreadVideo>`, đặt ở `timeline_start_s` và dài `edit_seconds`. Tổng tập phải đúng 21.600 frame.
   Chữ đè lấy từ `episode.json.overlays`, lời dẫn từ `narration.json`.
   Chỉ dùng video thật và chữ đơn giản, theo quy tắc Elise: không đồ họa, không hoạt hình, không ảnh tĩnh kéo dài.
3. **Chuyển cảnh**: giữ nguyên slot timeline và tổng 80,5 s pilot / 720 s EP01. Mặc định cắt thẳng. Nếu hòa, chồng hình bên trong slot đã cấp; không trừ thêm thời lượng khỏi tổng. SH024 dùng 2 s cảnh trước + 8,5 s cảnh sau; hòa tùy chọn phải được dựng trong slot 10,5 s, không biến thành 8,5 s. Đổi ngày cắt thẳng kèm chữ.
4. **Âm thanh**: Foley theo `audio_note`, nhạc có quyền sử dụng, lời dẫn (giọng Jessa qua vibi.pro, chỉ khi có key).
5. **Báo cáo QA** ghi vào `qa_report.json`.

## 4. Khối lượng ước tính

| | Pilot (8 shot, 80,5 s) | Cả tập (80 shot, 720 s) |
|---|---:|---:|
| Ảnh Elise + plate | 1 + 5 | 2 + ~19 |
| Ảnh khung | 17 | ~220 |
| Clip Muse (người dùng tạo tay) | **13** | ~110–150 |
| Dự phòng làm lại 30% | ~30 ảnh, ~17 lượt Muse | ~310 ảnh, ~190 lượt Muse |

Chưa có đơn giá GPT ảnh và Muse nên chưa quy ra tiền.
Làm tay khoảng 150 clip là nhiều việc. Vì vậy sản xuất từng sequence (SQ01…SQ10), duyệt xong một SQ rồi mới viết prompt cho SQ kế tiếp.

## 5. Cổng duyệt

| Gate | Điều kiện | Trạng thái |
|---|---|---|
| A, kế hoạch | Bố cục, phạm vi S1, khung 15 cm, timeline 720 s / 80 shot, trang phục, R1–R4 | **Chờ chủ dự án** |
| B, tham chiếu hình | Ảnh Elise bộ linen; 5 plate pilot (A-S0/S1/S2, C-S3, D-S5) | Bị chặn bởi Gate A |
| C, pilot | 13 clip, contact sheet, bản dựng thử Remotion ~80,5 s | Chưa |
| D, cả tập | Prompt và sản xuất theo từng SQ | Chưa |
| E, phát hành | Thời lượng, khung hình, thumbnail, tiêu đề, mô tả, nhãn AI, quyền nhạc | Chưa |

## 6. Rủi ro chính
1. **Hình học vườn giữa 4 camera.** Pilot thử A, C, D và cảnh cận; chưa thử CAM_B. Không coi bốn camera đều đã được kiểm chứng.
2. **Chỗ nối hai clip của cùng một shot** (SH018, SH030, SH048, SH052). Khung cuối của clip 1 chính là khung đầu của clip 2 nên vị trí khớp nhau. Codex vẫn cần hòa ngắn ở chỗ nối.
3. **Muse tự sinh vật hàng loạt** (hạt, vít, cỏ). Đã phòng bằng quay cận và câu "appears only where…".
4. **Ánh sáng 3 ngày phải liên tục.** Mỗi prompt đều ghi giờ và hướng nắng.

## 7. Áp dụng kinh nghiệm DIY/Wild cho Garden

Nguồn tham khảo: [muse-video-pipeline.md](../../../../docs/muse-video-pipeline.md) và
[elise-diy-ban-giao.md](../../../../docs/elise-diy-ban-giao.md). Chỉ kế thừa kinh nghiệm hình ảnh/hậu kỳ;
workflow mới của chủ dự án vẫn ưu tiên: người dùng tạo clip trên Muse, Codex dựng Remotion.

- **Duyệt theo thứ tự:** nội dung → Elise/bố cục vườn → từng keyframe. Xem từng ảnh trước Muse; ảnh phụ thuộc ảnh lỗi phải chờ sửa. Khung nào đạt có thể tạo clip đó ngay.
- **Khóa tham chiếu:** ảnh trực diện giữ mặt/trang phục, plate giữ vườn/camera, khung trước giữ tiến độ. Không gắn cùng ảnh hai lần vào first frame và reference. Ảnh đã gửi Muse khi sửa phải có tên phiên bản mới và cập nhật nguồn JSON rồi sinh lại package.
- **Một thao tác chính mỗi clip:** hạt, vít, rễ phải chuyển động từ tay/dụng cụ; vật dùng sau xuất hiện có lý do. Khung cuối kết thúc lúc tay vừa hoàn tất thao tác, tránh đứng cầm đồ đung đưa. Bước khó dùng cận tay; không để Muse tự hoàn tất cả luống.
- **QA ảnh trước, video sau:** so góc máy, hình học hai luống, nhà/deck/rào, trang phục, dụng cụ và hướng nắng. Số luống **đúng hai** là ràng buộc cứng; không áp dụng ngoại lệ DIY “không trừ điểm vì đếm sai vật” cho luống, nhãn hoặc trạng thái cây.
- **QA clip:** lưới khoảng 2 frame/giây có nhãn thời gian, sau đó xem chạy tại thao tác khó/chỗ nối. Tìm đầu đứng hình, tự cắt cảnh, vật tự hiện cuối clip, tay méo, đổi mặt/đồ. Lưới lấy mẫu không chứng minh chuyển động đã đạt.
- **Cứu trước khi tạo lại:** lỗi chỉ ở đuôi thì trim trước lỗi, kiểm tra vẫn đủ đoạn sạch thể hiện việc chính. Không cắt mất bước chính rồi che bằng chuyển cảnh. Nếu thiếu coverage cho slot 85/720 s, báo thiếu và xin bổ sung clip; không kéo khung đứng hay âm thầm rút timeline.
- **Phân biệt tạo lại:** lỗi nội dung → đính kèm lại ảnh + prompt có `FIX FROM PREVIOUS ATTEMPT`; lỗi Muse không giao video → kiểm tra kết quả đã có trước, rồi gửi lại nguyên yêu cầu nếu cần. Giữ bản cũ và đặt tên `_r2`; không chỉ nhắn “render lại”.
- **Chỗ nối:** cuối clip thực tế có thể lệch keyframe dù prompt đúng. Chọn điểm nối sạch và hòa ngắn trong Remotion khi cần, giữ nguyên slot timeline. Điểm QA chỉ hỗ trợ tìm lỗi; không dùng thang hook của reel để đánh trượt phân đoạn giữa phim dài.
- **Không sao chép quy tắc riêng DIY:** không mặc định tua 10 s thành 3 s, mở thành phẩm 1,5 s, kết orbit 6 s hoặc cấm mọi cảnh chiều tối. Garden theo nhịp, ánh sáng và tốc độ đã chốt trong storyboard.
- **Giữ khả năng dựng lại:** bảo toàn media nguồn đang dùng, keyframe, manifest và điểm cắt. Chỉ dọn bản nháp sau khi chốt, liệt kê trước; không áp dụng danh sách xóa clip DIY nếu Remotion còn tham chiếu clip đó.

Chưa bật QA model/API trả phí hoặc tự động chạy Muse khi áp dụng các quy tắc này.
