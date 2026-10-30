# Stick couple (9:16, 15-20 s mỗi tập)

Khuôn series: một cặp đôi người que (bạn trai tóc nhọn, bạn gái tóc bob kẹp nơ hồng) gặp một tình huống có twist.
Câu mở ghim trên cùng, thoại tiếng Anh (edge-tts) + phụ đề từng cụm 3 chữ (chữ đang nói tô vàng), kết bằng thẻ cười 2,5 s.
Cảm hứng từ 3 reel trong `checkvideo/` (StickToons, Mr.Stick, Minimal Stick); nhân vật, nền và truyện là của mình.
Mọi hình vẽ bằng code (SVG), không dùng ảnh GPT.

## Tập 1: Face Down (composition `StickCoupleEp01`, 17 s)
| Giây | Nhịp |
|---|---|
| 0-1.0 | Ghế đá công viên; anh đang xem điện thoại, thấy cô nhìn thì úp điện thoại xuống đầu gối |
| 1.0-3.1 | Cô nheo mắt, chỉ tay: "Babe, why is your phone ALWAYS face down?" |
| 3.15-4.3 | Nhạc tắt (scratch), cận mặt anh: mồ hôi, mắt đảo, nuốt nước bọt |
| 4.3-4.9 | Cô nhoài sang giật điện thoại |
| 4.9-6.7 | Cận màn hình: "3 DAYS until HER birthday 🎂", checklist kế hoạch bí mật tick dần |
| 6.7-8.4 | Cận cô: mắt long lanh, nước mắt, tim bay: "Babe... you planned all this?" |
| 8.4-11.5 | Cận anh, mặt mệt mỏi: "Yes. For three months." |
| 11.5-14.7 | Cảnh rộng, anh đưa tay: "Now act surprised." Cô đơ, cười gượng, đổ mồ hôi |
| 14.7-17.2 | Thẻ cười: 4 người que cười chảy nước mắt, "HA HA HA" |

Mốc cắt cảnh tính từ thời điểm thoại thật (hằng số `T_*` đầu `Video.tsx`).

## Tập 2: Per Leg (composition `StickCoupleEp02`, file `Ep02.tsx`, 17,2 s)
Cùng công thức câu đáp phũ như reel mẫu "He's Still Celebrating": khen trước, câu chốt lật ngược.
| Giây | Nhịp |
|---|---|
| 0-1.0 | Ghế đá trên lối đi gỗ ven biển (`Beach.tsx`: biển có sóng, mặt trời, dừa, hải âu); cô liếm kem ốc quế. Câu ghim "Never answer this question 😂" |
| 1.0-2.6 | Cô: "Babe... guess how much I weigh." |
| 2.6-4.4 | Nhạc tắt, cận anh: mồ hôi, mắt đảo, tích tắc; bong bóng suy nghĩ 60? 55? 50? lần lượt bị gạch |
| 4.4-6.1 | Bong bóng hiện "45?" (xanh): "Uh... forty-five kilos?" |
| 6.2-8.7 | Cảnh rộng, cô xích lại áp má anh, má hồng, tim bay: "Aww! You're so sweet!" (nhạc trở lại) |
| 9.5-10.7 | Cảnh hai người, anh cười tươi xòe tay: "...per leg." |
| 10.8-12.9 | Cận cô: sốc, mặt đỏ dần, bốc khói, gân giận; viên kem rơi xuống đất "bộp" |
| 12.9-14.8 | Cảnh rộng: anh trượt ra xa, đứng dậy, đi nhanh khỏi khung hình; cô trừng mắt |
| 14.8-17.3 | Thẻ cười |

## Tập 3: Best I've Ever Had (composition `StickCoupleEp03`, file `Ep03.tsx`, 20,2 s)
Phòng ăn buổi tối (`Dining.tsx`), có chú chó dưới gầm bàn (`Dog.tsx`). Nói dối để làm cô vui, lời nói dối quay lại trả báo.
| Giây | Nhịp |
|---|---|
| 0-3.7 | Bàn ăn có nến, đĩa thức ăn cháy bốc khói, chó dưới gầm bàn. Câu ghim "Never lie about her cooking 😂". Cô: "I cooked for you, babe! Try it!" |
| 3.7-5.7 | Cận anh: xiên một miếng, nhai, mặt xanh dần, rưng rưng nước mắt |
| 5.7-7.0 | Cận cô chống cằm, lấp lánh: "Is it good?" (anh nuốt ực) |
| 7.0-10.2 | Cận anh, cười nhe răng gượng, giơ ngón cái: "Mmm! Best I've ever had!" |
| 10.3-12.8 | Cảnh rộng, cô vỗ tay: "Yay! I'll get you more!", đứng dậy, đi vào bếp |
| 13.0-16.0 | Anh lén đưa đĩa xuống gầm bàn. Cận chó: ngửi ngửi, rồi ngước lên nhìn anh thương hại, rên khẽ, đặt chân lên gối anh. Anh đưa đĩa lại lên bàn |
| 16.0-18.0 | Cô quay lại với một nồi to, đổ thành núi lên đĩa anh: "I made a whole pot!" |
| 18.0-19.5 | Cận anh nhìn thẳng camera, mặt xanh, vô hồn |
| 19.5-22 | Thẻ cười |

## Tập 4: Just Hold My Hand (composition `StickCoupleEp04`, file `Ep04.tsx`, 16,3 s)
Rạp phim (`Cinema.tsx`). Anh ra vẻ che chở, bị đảo vai: chính câu của anh quay lại dành cho anh.
| Giây | Nhịp |
|---|---|
| 0-5.5 | Rạp tối, ánh màn hình nhấp nháy, xô bỏng ngô trên tay vịn; anh gác tay lên ghế cô: "Don't worry, babe. If you get scared... just hold my hand." Câu ghim "Wait for the scary part 😂" |
| 6.1-6.6 | Cô bình thản ăn bỏng ngô: "Okay." |
| 6.9-8.4 | Màn hình phim: hành lang tối, cánh cửa từ từ hé, nhạc rùng rợn + nhịp tim |
| 8.4-9.6 | Hai người: anh trợn mắt, đổ mồ hôi, bấu tay vịn, run; cô chán, vẫn nhai |
| 9.6-10.1 | Màn hình: con ma hoạt hình "BOO!", lóe trắng |
| 10.1-12 | Anh đã ngồi trong lòng cô ôm cổ, tóc dựng đứng, khóc, hét "Aaaaah!"; xô bỏng ngô văng xuống đất, bỏng ngô mưa xuống, một hạt rơi trúng miệng cô |
| 12.2-14.4 | Cô xoa đầu anh: "There, there... just hold my hand." |
| 15.2-16.5 | Anh gật lia lịa nắm tay cô; hàng ghế sau: "Shhh!" |
| 16.5-19 | Thẻ cười |

Bảng nhịp ghi theo giọng cũ; mốc thật hiện tại nằm trong `demo-project/src/stick-couple/epNN.json` (giọng mới nói nhanh hơn nên các nhịp dồn sớm hơn vài phần giây).

## Lệnh
```bash
python scripts/gen_gag_voice.py ep01 stick-couple                          # thoại -> public/stick-couple/ep01/voice_N.mp3 + src/stick-couple/ep01.json
python scripts/gen_couple_sfx.py --out demo-project/public/stick-couple/ep01  # nhạc nền + SFX (ghi cùng bộ cho mọi tập; đổi ep01 -> ep02...; `--only laugh` chỉ tạo lại một tiếng). Tiếng cười = 8 giọng edge-tts, cần mạng
cd demo-project
npx tsc --noEmit
npx remotion render StickCoupleEp01 out/stick-couple-ep01.mp4
npx remotion render StickCoupleEp02 out/stick-couple-ep02.mp4
npx remotion render StickCoupleEp03 out/stick-couple-ep03.mp4
npx remotion render StickCoupleEp04 out/stick-couple-ep04.mp4
```
Giọng (chủ dự án chọn 2026-10-30): anh = `en-US-AndrewMultilingualNeural`, cô = `en-US-AvaMultilingualNeural`, vai phụ = `en-US-BrianMultilingualNeural`, để pitch `+0Hz` (ép cao độ nghe như máy); chỉ chỉnh `rate`, riêng tiếng hét được nâng pitch.
`ep01.json` có `hook` (câu ghim) và mỗi dòng thoại có `pause` (khoảng lặng trước câu, chừa chỗ cho nhịp không lời; `gen_gag_voice.py` đã hỗ trợ).

## Code (`demo-project/src/stick-couple/`)
- `Stick.tsx`: rig người que. Thân đen nét tròn, tay chân IK hai khớp (truyền vị trí tay/chân, rig tự tính khuỷu/gối), `lean` (nghiêng thân), `tilt`, tay `point`/`palm`, `held` (đồ cầm tay).
  Đầu trắng có bóng mờ phía sau, mặt 3/4. Biểu cảm `Emo`: neutral, happy, suspicious, nervous, shock, moved, tired, awkward, laugh, angry; thêm `talk`, `blink`, `gaze`, `blush`, `sweat`, `tears`, `red` (mặt đỏ dần), `sick` (mặt xanh dần); tay `thumb` (giơ ngón cái). Tóc `spiky`/`bob`/`none`.
  `SEATED`/`STANDING` là sẵn vị trí chân.
- `Park.tsx`: nền công viên (mây trôi, cây đung đưa, đèn đường), `Bench`, `PhoneBack`. Toạ độ thế giới 1080x1920; cận cảnh = camera zoom.
- `common.tsx`: phần dùng chung mọi tập (helpers keyframe, phụ đề `makeWords`/`Captions`, câu ghim `Hook`, thẻ cười `LaughTag`).
- `Beach.tsx`: nền bờ biển của tập 2, cùng hệ toạ độ với `Park.tsx` (chân chạm `GROUND_Y`) nên dùng chung `Bench` và nhân vật. Mỗi tập nên một bối cảnh khác.
- `Dining.tsx`: phòng ăn ban đêm của tập 3 (`Dining` nền, `Furniture` bàn/ghế/nến, `TABLE`, `PLATE`).
- `Dog.tsx`: chú chó con ngồi, chế độ `idle` (thè lưỡi, vẫy đuôi), `sniff` (ngửi), `pity` (mắt long lanh thương hại), nhấc chân `paw`.
- `Cinema.tsx`: rạp phim của tập 4 (`Cinema` nền + chùm sáng máy chiếu + khán giả, `Seats`, `Bucket`, `Kernel`).
- `Ep04.tsx`: tập 4 (phim trên màn hình `MovieShot`: hành lang, cửa, con ma; ánh sáng màn hình; bỏng ngô bay theo quỹ đạo; ngồi trong lòng; tóc dựng).
- `Ep03.tsx`: tập 3 (đĩa cháy bốc khói, nĩa, nồi, đổ thức ăn, cô đứng dậy đi vào bếp và quay lại).
- `Ep02.tsx`: tập 2 (cây kem rơi được, bong bóng suy nghĩ, khói giận, xích lại gần, đứng dậy và bước đi).
- `Video.tsx`: timeline tập 1, camera (`camAt`), màn hình điện thoại (HTML), âm thanh.
