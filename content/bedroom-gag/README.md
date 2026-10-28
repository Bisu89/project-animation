# Bedroom gag: ảnh mẫu và code nhân vật

- `assets.csv`: đủ CS1–CS4 và BG1–BG3; prompt đã đồng bộ với mẫu GPT hiện có, gồm các chỉnh sửa đồng hồ.
- `refs/`: ảnh cắt từ video gốc. Đính kèm `montage_faces.png`, `crop_husband_standing.png`, `crop_wife_sitting.png` để tham chiếu phong cách.
- `models/`: ảnh GPT đã tạo. Khi tạo bản mới, lưu đè **đúng tên file** trong CSV. `generation-prompts.json` là lịch sử prompt của lần tạo cũ; sửa prompt mới trong CSV.

Thiết kế hiện tại theo CS1/CS2: chồng tóc đen rẽ ngôi, vợ tóc bob nâu. Video gốc có tóc nhọn/tóc búi; chỉ dùng video làm tham chiếu phong cách. CS1/CS2 và video dùng tay đen, CS4 dùng tay trắng; rig giữ tay đen và dùng CS4 tham khảo tư thế. Rig SVG là bản vẽ lại có thể điều khiển biểu cảm, không phải sprite cắt từ model sheet.

Từ thư mục gốc repo, đồng bộ ảnh cho Remotion sau khi thay model:

```powershell
python scripts/bedroom_export.py
```

Lệnh kiểm tra đủ 7 model và 3 ảnh tham chiếu trước khi ghi đè bản xuất ở `demo-project/public/bedroom-gag/`. Không sửa ảnh nguồn trong `models/`, không tạo ảnh mới. Các bảng CS chỉ dùng để đối chiếu; video dùng 3 nền PNG và nhân vật SVG.

Render bảng so sánh (mẫu GPT phía trên, SVG phía dưới), 7 khung hình đại diện và video 540×960, có tiếng:

```powershell
node demo-project/src/bedroom-gag/render-preview.cjs
```

Kết quả ở `renders/bedroom-gag/`: `model-comparison.png`, `frame-*.png`, `preview.mp4`. Thêm `--stills` nếu chỉ cần ảnh. Script tự đồng bộ ảnh và chỉ gom public assets của tập này để tránh sao chép media của các series khác.

Code ở `demo-project/src/bedroom-gag/`:

- `Video.tsx`: timeline, chuyển cảnh, thoại và âm thanh.
- `Room.tsx`: nền và vị trí nhân vật trong cảnh rộng.
- `Characters.tsx`, `Shirt.tsx`, `Primitives.tsx`: cơ thể, áo sọc, tay và chân dùng chung.
- `Face.tsx`, `Hair.tsx`: biểu cảm, mí mắt, tóc theo CS1/CS2.
- `config.ts`: kích thước, FPS và đường dẫn nền.
- `preview-entry.tsx`: composition kiểm tra riêng, dùng chính rig của video.

SVG đã chỉnh đường tóc rẽ ngôi/bob, mắt lớn, đồng tử lệch bên, mí mắt nằm trong vòng mắt, tay chân mảnh, tay có ngón, áo có tay/cổ và quần có hai ống. Vẫn còn khác biệt với ảnh GPT về chi tiết tô bóng, góc nhìn 3/4 và các dáng bàn tay; không coi bản vẽ là khớp tuyệt đối.
