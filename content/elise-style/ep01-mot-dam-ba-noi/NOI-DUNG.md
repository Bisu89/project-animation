# Elise Style — tập 01: "1 chiếc đầm đen — 3 nơi"

**Trạng thái:** ĐỀ XUẤT, chờ chủ dự án duyệt (2026-11-12). Chưa gen ảnh, chưa chạy Muse.
**Khung:** 9:16 · **Độ dài:** 18,5 s · **Tiền tố file:** `es1-`

---

## 1. Video tham khảo và bài học rút ra

Nguồn: `FSave.com_Reels_Bi-kip-phoi-Dam-Di-tiec-cuc-sang-cho-nan_Media_1151910817509829_001_1080p.mp4`
(1080×1920, 30 fps, 16,37 s, có nhạc nền).

Dò scene-cut ngưỡng 0,08 ra đúng **4 cảnh, không có hiệu ứng morph nào**:

| Mốc cắt | Dài | Trang phục | Chữ đè |
|---|---|---|---|
| 0,00 s | 3,57 s | Đồ ngủ kẻ caro xanh, kính cận, tóc tết hai bên | `Bí kíp phối **Đầm đi tiệc**` / `lên hình **cực sang** cho nàng` |
| **3,57 s** | 4,70 s | Đầm cúp ngực kem, túi kem đeo vai, tóc búi | `1. Đi Du Lịch` |
| **8,27 s** | 4,17 s | Đầm lụa đỏ đô trễ vai, túi đen | `2. Đi Đám cưới` |
| **12,43 s** | 3,94 s | Đầm đen trễ vai ôm, túi đen | `3. Đi nhà hàng` |

**Cảm giác "mượt" đến từ 3 thứ, không phải kỹ xảo:**

1. **Máy khóa cứng tuyệt đối.** Cùng phòng showroom (giàn treo đồ bên phải, cục điều hòa góc trái,
   tủ gỗ, sàn xám), cùng vị trí máy, cùng ánh sáng. Không zoom, không lia. Nền trước và sau cú cắt
   trùng khít → người xem đọc là "cùng một khoảnh khắc, chỉ quần áo đổi".
2. **Cú cắt số 1 là match-cut trên động tác quét tay.** Ở 3,53 s cô quét tay ngang trước ngực, tay
   che gần hết thân; khung ngay sau (3,57 s) tay vẫn ở đúng vị trí đó, vẫn đang quét, nhưng đã là
   đầm kem. Đây là cú đắt nhất, trông như biến hình.
3. **Cú cắt 2 và 3 chỉ là cắt cứng rơi đúng phách nhạc.** Tư thế trước/sau không khớp. Vẫn mượt vì
   nền trùng và nhạc đỡ.

Mỗi look dài 4–4,7 s, trong đó có 3–4 động tác nhỏ (chỉ tay, đưa tay lên cằm, **xoay lưng khoe dáng
sau**, bước tới). Không giây nào đứng không.

---

## 2. Dựng lại trong pipeline Muse

Thuộc kiểu **ít điểm nối, máy tĩnh** — đúng vùng Muse làm tốt.
Theo `muse-video/noi-clip.md` §1 cách (b): clip độc lập rồi cắt thẳng.

- Gen **1 ảnh gốc**, rồi 3 ảnh còn lại bằng `Recreate exactly the same room, camera position,
  distance, framing and lighting. Only change: the outfit → ...`
  (mẹo "gen thành phẩm trước rồi lùi ngược" trong `muse-video/prompt.md` §1 — kiến trúc và góc máy
  giữ ổn hơn hẳn gen xuôi).
- Mỗi look = **1 clip Muse 10 s**, lấy ~4,5 s sạch.
  `CAMERA: Fixed camera, exactly the framing of the start frame, no zoom, no pan, no tilt.`
- **Chuyển cảnh:** làm mạnh hơn bản gốc — cả 3 cú đều là match-cut quét tay. Mỗi clip kết bằng
  "tay phải quét ngang trước ngực, lòng bàn tay hướng máy"; clip sau mở bằng đúng tư thế tay đó rồi
  hạ xuống. `chuyen_canh = cat` (nối cứng 1 khung), **không** dùng `mo`.
  - *Rủi ro đã biết:* `noi-clip.md` cảnh báo Muse hay lặp lại động tác ở khung đầu. Nếu clip 2–4 bị
    lặp quét tay, đổi sang **wipe lòng bàn tay che ống kính**: tay tiến sát máy đến khi che kín
    khung, cắt ở khung che kín. Che kín thì mọi sai lệch đều ẩn.
- Chữ đè thêm lúc dựng bằng ffmpeg, không để AI vẽ chữ (`prompt.md` §1).
- Render 24 fps gốc Muse, cắt rơi đúng phách nhạc.

**Rủi ro lớn nhất:** trôi mặt/dáng giữa 4 clip gen riêng (`noi-clip.md` §2 — lỗi số 1).
Chống bằng: 4 ảnh khung đều sinh từ cùng một ảnh gốc, và mỗi lần gen video đều gửi kèm ảnh khung trước.

---

## 3. Tiêu đề + thumbnail

| | Phương án | Khoảng trống tò mò & lời hứa |
|---|---|---|
| **A** ✅ | **"1 chiếc đầm đen — 3 nơi"**. Thumbnail: khung chia 3 dọc, cùng một chiếc đầm đen, 3 cách phối khác hẳn; chữ to `CÙNG 1 CHIẾC ĐẦM` | Thấy *cùng một chiếc đầm* ở 3 ô nhưng trông như 3 bộ khác nhau → "làm sao ra được vậy?". Hứa: 18 giây biết 3 cách phối từ 1 món có sẵn trong tủ. **Lợi thế kỹ thuật:** đầm giữ nguyên ở cả 3 ảnh, chỉ thêm/bớt lớp ngoài và phụ kiện → ít đất cho AI trôi hình nhất |
| B | **"Từ đồ ngủ đến dự tiệc trong 15 giây"** (bám bản gốc). Thumbnail: nửa trái đồ ngủ, nửa phải đầm đỏ, mũi tên giữa | Tương phản trước/sau. Yếu hơn: công thức đã bão hòa, không có gì mới để hứa |
| C | **"4 món trong tủ = 7 ngày không trùng đồ"**. Thumbnail: 4 món xếp phẳng, góc phải `×7` | Con số 4→7 gây hụt logic, lời hứa lớn nhất. Yếu hơn: 18 s không đủ trả 7 bộ → thành hứa hão, `CLAUDE.md` cấm |

**Chốt: phương án A.** Gap rõ, trả thưởng trọn vẹn trong 18 s, rủi ro AI thấp nhất.

## 4. Hook 0–3 s

1. **Hành động:** mở thẳng vào Elise đang quét tay — chưa kịp thấy mặt đã thấy đầm đen trơn,
   chữ đè `Chiếc đầm này đi được 3 nơi.`
2. ✅ **Kết quả trước:** 1,2 s đầu là 3 look đã hoàn chỉnh nhấp nháy liên tiếp (0,4 s/look), rồi quay
   về đầm trơn.
3. **Phản đề:** Elise cầm chiếc đầm đen trên móc, lắc đầu, chữ `"Đầm đen thì chán"?`, rồi quét tay
   vào look 1.

**Chốt: hook 2.** Trả thưởng sớm (thấy ngay 3 kết quả) mà không lộ *cách* làm — đúng yêu cầu "trả
thưởng sớm nhưng không lộ hết". Hook 1 đẹp nhưng không nêu được câu hỏi trung tâm; hook 3 tốn 3 giây
cho một câu đùa.

## 5. Bảng nhịp (18,5 s)

| # | Giây | Nội dung | Clip | Chữ đè | chuyen_canh |
|---|---|---|---|---|---|
| 0 | 0,0–1,2 | **Hook:** 3 look nhấp nháy 0,4 s/look (cắt từ clip 2, 3, 4) | tái dùng | `1 CHIẾC ĐẦM ĐEN` | cat |
| 1 | 1,2–4,5 | Elise trong đầm đen trơn, không phụ kiện. Xoay nửa vòng khoe dáng, quay lại, **quét tay ngang ngực** | clip1 | `Chiếc đầm này đi được 3 nơi` | **cat** (match-cut) |
| 2 | 4,5–9,0 | **Look 1 – Đi làm:** blazer xám khoác hờ, giày mũi nhọn be, túi tote be. Chỉ tay → chỉnh cổ blazer → xoay lưng → **quét tay** | clip2 | `1. Đi làm` | **cat** |
| 3 | 9,0–13,5 | **Look 2 – Hẹn cà phê:** bỏ blazer, thắt lưng da nâu bản to, áo khoác denim vắt vai, sneaker trắng. Đút tay túi → hất áo denim → xoay lưng → **quét tay** | clip3 | `2. Đi cà phê` | **cat** |
| 4 | 13,5–18,0 | **Look 3 – Dự tiệc:** khăn lụa đỏ quấn eo thắt nơ hông, hoa tai dài, clutch đen, cao gót. Bước một bước tới → xoay tròn 1 vòng cho váy bay → đứng, nhìn máy, cười | clip4 | `3. Đi tiệc` | — |
| 5 | 18,0–18,5 | Khung cuối đứng yên 0,5 s | clip4 | `Đầm: 1 — Outfit: 3` | — |

Mỗi look **4,5 s** = đúng vùng sạch của clip Muse 10 s. Không giây nào đứng không: mọi nhịp đều là
đổi tư thế, xoay, hoặc chỉnh một món phụ kiện.

## 6. Storyboard — 4 ảnh khung GPT

| Ảnh | Nội dung | Cách gen |
|---|---|---|
| `es1-A` | Elise, đầm đen trơn midi trễ vai, giày đen trơn, phòng thay đồ sáng (giàn treo đồ bên phải, gương bên trái, sàn gỗ nhạt), máy ngang ngực, toàn thân | Ảnh gốc. Gửi kèm `elise-*-truoc.png` |
| `es1-B` | **Y hệt A, chỉ đổi:** blazer xám khoác vai, giày mũi nhọn be, túi tote be | `Recreate exactly… Only change:` + kèm ảnh A |
| `es1-C` | **Y hệt A, chỉ đổi:** thắt lưng da nâu bản to, áo khoác denim vắt vai trái, sneaker trắng | `Recreate exactly…` + kèm ảnh A |
| `es1-D` | **Y hệt A, chỉ đổi:** khăn lụa đỏ quấn eo, hoa tai vàng dài, clutch đen, cao gót đen | `Recreate exactly…` + kèm ảnh A |

Trang phục dòng Style là bộ mới, chưa có trong bảng ở `.claude/skills/elise/nhan-vat.md`.
Nếu được duyệt: gen ảnh thử → chủ dự án chọn → ghi bộ này vào skill.

## 7. Tự rà soát

- **Nhịp độ:** 4,5 s/look, có hook 1,2 s phía trước — không có khoảng chết. ✔
- **Độ rõ:** chữ đè đánh số 1/2/3 báo hiệu mỗi lần đổi look, đúng luật "cắt sang cảnh khác hẳn thì
  cần một tín hiệu" (`noi-clip.md` §4). ✔
- **Độ mới:** "1 món ra 3 bộ" khác công thức "đồ ngủ → đầm tiệc" nhan nhản. ✔
- **Điểm yếu còn lại:** nếu Muse làm trôi mặt giữa 4 clip thì ảo giác "cùng một khoảnh khắc" vỡ ngay,
  mà video này sống nhờ ảo giác đó. Đề nghị **gen clip 1 và clip 2 trước, ghép thử đúng cú match-cut
  đầu tiên rồi chủ dự án xem** — cú đó ăn thì 2 cú còn lại chắc chắn ăn; không ăn thì đổi sang wipe
  lòng bàn tay, không tốn công gen cả 4.

## 8. Câu hỏi còn chờ chủ dự án

1. Phương án A ("1 chiếc đầm đen — 3 nơi") hay bám sát bản gốc theo phương án B?
2. Mở dòng mới `content/elise-style/`, hay xếp tập này vào một dòng sẵn có?
3. Có làm bước thử 2 clip trước, hay gen thẳng cả 4?
