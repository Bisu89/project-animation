# Elise Style — tập 01: "1 quần ống loe đen — 3 nơi"

**Trạng thái:** ĐANG LÀM (2026-11-12). Chủ dự án đã duyệt ý tưởng và gửi ảnh mẫu.
**Khung:** 9:16 · **Độ dài:** ~20 s · **Tiền tố file:** `es1-`
**Muse:** `chrome-profile-3`, cổng 9336, chat mới (`content/elise-style/muse-chat.json`)

---

## 1. Nhân vật

Chủ dự án gửi ảnh cắt rời nền trong suốt: `content/elise-style/models/anh/mau-goc-chu-du-an.png`
(940×1674, RGBA). Cô gái Việt khoảng 25 tuổi, tóc nâu đen dài buộc nửa đầu, vài sợi buông hai bên,
trang điểm nhẹ môi đỏ nhạt, dáng thon.

**Đây là nhân vật mới, không phải Elise Moreau.** Chưa đặt tên — chờ chủ dự án.
Ảnh này dùng làm ảnh nhân vật trực diện (`gui_kem` khi gen ảnh, `anh_tham_chieu` khi gen video).

Bộ đồ trong ảnh gốc (blazer be + áo ren đen + quần ống loe đen + cao gót trong + túi vàng nhỏ)
được dùng nguyên vẹn làm **Look 3 – đi tiệc**.

## 2. Video tham khảo và bài học rút ra

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

1. **Máy khóa cứng tuyệt đối.** Cùng phòng, cùng vị trí máy, cùng ánh sáng, không zoom, không lia.
   Nền trước và sau cú cắt trùng khít → người xem đọc là "cùng một khoảnh khắc, chỉ quần áo đổi".
2. **Cú cắt số 1 là match-cut trên động tác quét tay.** Ở 3,53 s cô quét tay ngang trước ngực; khung
   ngay sau (3,57 s) tay vẫn ở đúng vị trí đó nhưng đã là đầm kem. Đây là cú đắt nhất.
3. **Cú cắt 2 và 3 chỉ là cắt cứng rơi đúng phách nhạc**, tư thế trước/sau không khớp. Vẫn mượt vì
   nền trùng và nhạc đỡ.

Mỗi look 4–4,7 s, có 3–4 động tác nhỏ (chỉ tay, đưa tay lên cằm, **xoay lưng khoe dáng sau**,
bước tới). Không giây nào đứng không.

## 3. Cải tiến so với bản gốc: cả 3 cú đều là match-cut

Thay vì để 2/3 cú cắt lệch tư thế như bản gốc, **cả 4 ảnh khung dùng chung một tư thế**:
đứng thẳng chính diện, **tay phải gập ngang giữa ngực, lòng bàn tay mở hướng máy**, tay trái buông.
Mỗi clip **mở và kết đúng tư thế đó**:

```
0,0–0,6s  giữ đúng tư thế khung đầu
0,6–1,2s  hạ tay phải xuống
1,2–2,6s  động tác riêng của look (chỉnh ve blazer / hất cổ denim / vuốt dây túi)
2,6–3,8s  xoay nửa vòng khoe lưng rồi quay lại
3,8–4,8s  đưa tay phải trở lại ngang ngực — về đúng tư thế khung đầu
4,8–10s   giữ yên, không có gì mới
```

Hai lợi thế:
- 4 ảnh đều gen bằng `Recreate exactly… only change the outfit`, nên **tư thế giống hệt lại dễ khóa
  hơn** là mỗi ảnh một dáng.
- `noi-clip.md` cảnh báo Muse hay lặp lại động tác ở khung đầu — ở đây động tác đó **chính là** thứ
  ta muốn có ở cả hai đầu clip, nên thói quen xấu thành có lợi.

`chuyen_canh = cat` (nối cứng 1 khung) ở cả 3 chỗ nối, **không** dùng `mo`.

**Dự phòng** nếu Muse làm hỏng tư thế mở: đổi sang **wipe lòng bàn tay che ống kính** — tay tiến sát
máy đến khi che kín khung, cắt ở khung che kín. Che kín thì mọi sai lệch đều ẩn.

**Rủi ro lớn nhất:** trôi mặt/dáng giữa 4 clip gen riêng (`noi-clip.md` §2 — lỗi số 1). Chống bằng:
4 ảnh khung đều sinh từ `es1-A`, và mỗi lần gen video đều gửi kèm ảnh mẫu gốc làm `anh_tham_chieu`.

## 4. Tiêu đề + thumbnail

| | Phương án | Khoảng trống tò mò & lời hứa |
|---|---|---|
| **A** ✅ | **"1 quần ống loe đen — 3 nơi"**. Thumbnail: khung chia 3 dọc, cùng một chiếc quần, 3 cách phối khác hẳn; chữ to `CÙNG 1 CHIẾC QUẦN` | Thấy *cùng một chiếc quần* ở 3 ô nhưng trông như 3 bộ khác nhau → "làm sao ra được vậy?". Hứa: 20 giây biết 3 cách phối từ 1 món có sẵn trong tủ. **Lợi thế kỹ thuật:** quần giữ nguyên ở cả 3 ảnh, chỉ thêm/bớt lớp ngoài và phụ kiện → ít đất cho AI trôi hình nhất |
| B | **"Từ đồ ngủ đến dự tiệc trong 15 giây"** (bám bản gốc). Thumbnail: nửa trái đồ ngủ, nửa phải đầm đỏ, mũi tên giữa | Tương phản trước/sau. Yếu hơn: công thức đã bão hòa, không có gì mới để hứa |
| C | **"4 món trong tủ = 7 ngày không trùng đồ"**. Thumbnail: 4 món xếp phẳng, góc phải `×7` | Con số 4→7 gây hụt logic, lời hứa lớn nhất. Yếu hơn: 20 s không đủ trả 7 bộ → thành hứa hão, `CLAUDE.md` cấm |

**Chốt: phương án A** (chủ dự án duyệt 2026-11-12).

## 5. Hook 0–3 s

1. **Hành động:** mở thẳng vào cô đang quét tay, chữ đè `Chiếc quần này đi được 3 nơi.`
2. ✅ **Kết quả trước:** 1,2 s đầu là 3 look đã hoàn chỉnh nhấp nháy liên tiếp (0,4 s/look), rồi quay
   về quần đen cơ bản.
3. **Phản đề:** cô cầm chiếc quần trên móc, lắc đầu, chữ `"Quần đen thì chán"?`

**Chốt: hook 2.** Trả thưởng sớm (thấy ngay 3 kết quả) mà không lộ *cách* làm. Hook 1 không nêu được
câu hỏi trung tâm; hook 3 tốn 3 giây cho một câu đùa.

Hook **không gen riêng** — cắt từ chính clip 2, 3, 4 lúc dựng (`ghep-v2.csv`).

## 6. Bảng nhịp (~20 s)

| # | Giây | Nội dung | Clip | Chữ đè | chuyen_canh |
|---|---|---|---|---|---|
| 0 | 0,0–1,2 | **Hook:** 3 look nhấp nháy 0,4 s/look (cắt từ clip 2, 3, 4) | tái dùng | `1 CHIẾC QUẦN ĐEN` | cat |
| 1 | 1,2–6,0 | **Món chủ đạo:** quần ống loe đen + áo hai dây đen trơn. Vuốt đường bên quần → xoay lưng → quét tay | clip1 | `Chiếc quần này đi được 3 nơi` | **cat** (match-cut) |
| 2 | 6,0–10,8 | **Look 1 – Đi làm:** sơ mi trắng sơ vin + blazer be cài khuy + giày mũi nhọn be + túi tote be. Chỉnh ve blazer → xoay lưng → quét tay | clip2 | `1. Đi làm` | **cat** |
| 3 | 10,8–15,6 | **Look 2 – Đi cà phê:** thun trắng + khoác denim mở + sneaker trắng + túi tote vải. Hất cổ denim → đút tay túi quần → xoay lưng → quét tay | clip3 | `2. Đi cà phê` | **cat** |
| 4 | 15,6–21,0 | **Look 3 – Đi tiệc** (đúng ảnh mẫu): áo ren đen + blazer be khoác hở + cao gót trong + túi vàng nhỏ. Vuốt dây túi → bước tới → xoay trọn 1 vòng cho ống quần bay → cười | clip4 | `3. Đi tiệc` | — |

Mỗi look 4,8 s = đúng vùng sạch của clip Muse 10 s. Chiếc **blazer be** xuất hiện ở look 1 (cài khuy,
đi làm) và look 3 (khoác hở trên áo ren, đi tiệc) — cùng một món, hai hiệu quả khác hẳn.

## 7. Bốn ảnh khung GPT

| Ảnh | Bộ đồ | `gui_kem` |
|---|---|---|
| `es1-A-quan-den.png` | Quần ống loe đen + áo hai dây đen trơn, giày bệt đen. Không áo khoác, không túi, không trang sức | `mau-goc-chu-du-an.png` |
| `es1-B-di-lam.png` | + sơ mi trắng sơ vin, blazer be cài khuy, giày mũi nhọn be, túi tote da be | `mau-goc…; es1-A` |
| `es1-C-ca-phe.png` | + thun trắng sơ vin, khoác denim xanh mở, sneaker trắng, túi tote vải kem | `mau-goc…; es1-A` |
| `es1-D-di-tiec.png` | + áo ren đen cổ vỏ sò crop, blazer be khoác hở, sandal cao gót quai trong, túi vàng nhỏ dây xích, dây chuyền vàng mảnh | `mau-goc…; es1-A` |

Phòng (khóa cứng ở cả 4 ảnh): phòng thay đồ sáng, giàn treo đồ màu trung tính bên phải, gương đứng
khung đen mảnh bên trái, tường trắng ngà, sàn gỗ sồi xương cá, ánh sáng dịu từ trái.
Máy: cố định, ngang ngực, cách ~3 m, toàn thân, dọc 9:16.

Script sinh CSV: `content/elise-style/scripts/tao_gen_tap01.py`.

## 8. Rủi ro đã lường

- **Bộ lọc OpenAI** có thể chặn `es1-D` (áo ren crop). Đã viết "camisole … blazer covers her
  shoulders and sides", "modest, wholesome, family-friendly fashion-catalogue look". Nếu vẫn chặn:
  đổi sang áo hai dây lụa đen.
- **Gương bên trái** có thể phản chiếu sai bộ đồ. Đã thêm vào NEGATIVE: `no mirror reflection showing
  a different outfit`.
- **Trôi mặt giữa 4 clip** — xem §3.

## 9. Kết quả (2026-11-12)

**Bản dựng: `video/final-v4.mp4` — 22,8 s, 1080×1920, 24 fps.** QA GPT 67/100.

Đã làm: 4 ảnh khung (lệch nền 5–7/255), 4 clip Muse, dựng bằng
`content/elise-style/scripts/dung_tap01.py`.

### Phát hiện lớn nhất: Muse bỏ qua mốc giây
Cả 4/4 clip đều trải hành động ra hết 10 s dù prompt ghi "xong ở 3,8 s, giữ tư thế từ 4,8 s".
Tư thế tay giơ có ở **0,0–0,6 s và lại ở ~8,0–9,9 s**. Gửi lại kèm câu FIX cũng y nguyên.
→ Phải lấy **gần trọn clip** (để hai đầu đều là tay giơ) rồi **tăng tốc 1,55×**, không cắt ngắn được.
Đã ghi vào `.claude/skills/muse-video/loi.md` và `noi-clip.md` §1(c).

### Nhịp bản cuối
| Giây | Nội dung | Tốc độ |
|---|---|---|
| 0,0–1,2 | Hook: 3 look nhấp nháy 0,4 s/look | thật |
| 1,2–6,8 | Quần đen + áo hai dây đen | 1,55× |
| 6,8–12,4 | Look 1 đi làm | 1,55× |
| 12,4–18,0 | Look 2 đi cà phê | 1,55× |
| 18,0–21,7 | Look 3 đi tiệc | **thật** |
| 21,7–22,8 | Khung kết đóng băng + `Quần 1 — Outfit 3` | — |

Look cuối chạy tốc độ thật và cắt trước cú xoay vì **Muse không giữ nổi túi vàng nhỏ qua vòng xoay**
(mất từ ~6 s, đã gen lại 3 lần). Đổi lại mất cú bookend tay-giơ ở khung cuối — chọn giữ hình sạch.

### Lỗi còn lại, nói thẳng
- **Gấu quần look "đi làm" hở cổ chân** (đi cao gót nên quần hụt), các look khác chạm sàn. Lệch nhẹ
  giữa các look.
- **Túi vàng nằm hông trái** chứ không phải hông phải như prompt. Vẫn khớp ảnh mẫu chủ dự án gửi.
- **Khung kết cô đang nhìn xuống túi**, chưa phải tư thế chốt nhìn thẳng.
- Tóc trong clip buông dài gợn sóng, khác ảnh khung (buộc nửa đầu) — nhưng **cả 4 clip trôi giống
  nhau**, nên ảo giác "cùng một khoảnh khắc" vẫn giữ.
- QA 67/100 có nhiều ý chấm sai vì nó so với `gen-video.csv` và chỉ xem lưới ảnh tĩnh: chê "ngắn hơn
  kịch bản 40 s" (kế hoạch ~20 s), "mở đầu sai thứ tự" (đó là hook), "có chữ dù prompt ghi không chữ"
  (chữ thêm lúc dựng theo đúng skill), "không có tư thế giơ tay ở đầu look" (tư thế chỉ kéo dài 0,4 s
  nên lưới 1 khung/giây không bắt được — tôi đã soi từng khung 24 fps, **3/3 chỗ nối khớp**).

### Cập nhật sau phản hồi chủ dự án (2026-11-12)
Chủ dự án: "vẫn khá fail, vẫn bị giật, chủ yếu để test hiệu ứng".
- **Nguyên nhân giật:** v1–v4 tăng tốc 1,55× rồi ép về 24 fps → vứt khung không đều. Look cuối (1×) không giật.
- **Đã sửa trong script:** mọi đoạn tăng tốc đúng 1,25× → xuất đúng 30 fps, mọi khung gốc dùng một lần.
  Đã xuất `video/final-v5.mp4` (25,2 s, 30 fps) nhưng **chưa kiểm** — chủ dự án bảo dừng render, chỉ nâng cấp skill.
- Bài học đã ghi vào skill `muse-video` (SKILL.md luật 8/8b, `dung-render.md` §3, `noi-clip.md` §1(c), `loi.md`).
- **Kết luận tập thử:** hiệu ứng match-cut đổi trang phục chạy được; tập này dừng ở mức thử nghiệm.

## 10. Làm tiếp từ đâu

- Ảnh khung `anh/es1-*.png`, ảnh mẫu `models/anh/mau-goc-chu-du-an.png` và clip `video/` **chỉ có trên máy**
  (`.gitignore` bỏ qua `content/*/*/anh/` và `video/`). Máy khác muốn làm tiếp thì phải chép tay hoặc gen lại.
- Sinh lại CSV: `python content/elise-style/scripts/tao_gen_tap01.py`. Dựng lại: `python content/elise-style/scripts/dung_tap01.py --out final.mp4`.
- Muse: `chrome-profile-3` / 9336, chat của series ghi trong `content/elise-style/muse-chat.json`.
- [ ] Nếu làm tập thật: đặt tên nhân vật (không phải Elise), cân nhắc tách khỏi `content/elise-style/`
- [ ] Viết lại SHOTS ít hành động hơn (Muse luôn trải ra 10 s), bỏ cú xoay ở look có túi nhỏ
- [ ] Sửa `muse-auto/ghep.py` chế độ `tang_toc` cho dùng hệ số 1,25×/2× (lỗi giật dùng chung mọi series)
- [ ] Dọn `video/` (~110 MB nháp) khi chủ dự án đồng ý
