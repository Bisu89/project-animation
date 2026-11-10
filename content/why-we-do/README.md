# Why Do We Do This? 😂 (9:16, 12-18 s mỗi tập)

Series solo về các thói quen khó hiểu nhưng ai cũng làm. Cảm hứng từ reel "When You Don't Know The Song Title"
(1 nhân vật, 1 cảnh, không thoại, hài nhờ âm thanh + nét mặt); nhân vật, bối cảnh, truyện là của mình.
Chủ dự án duyệt series 2026-11-10, yêu cầu nhân vật solo mới.

## Nhân vật: Benny (tên tạm)
- `demo-project/src/why-we-do/Guy.tsx`: cùng rig với Stick couple (IK, khuôn mặt `Face` dùng chung) nhưng da đào,
  tóc xoăn nâu, kính tròn (có `glint` lóe trắng kính), hoodie cam, quần jean, sneaker trắng.
- Biểu cảm thêm vào `Stick.tsx` (dùng chung): `hum` (môi chu ậm ừ), `blank` (mặt đơ), `focused` (nheo mắt).
- Model sheet: composition `WhyWeDoSheet` (`Sheet.tsx`).
- Đạo cụ: `Phone` (glow = đèn pin).

## Khuôn tập
- Câu ghim "When you… 😂" trên cùng (`Hook` trong `stick-couple/common.tsx`).
- 0-1 vào cảnh · 1-4 bắt đầu thói quen · 4-10 leo thang 2-3 lần · 10-14 twist/tự bóc phốt · cuối: nhìn camera im lặng hoặc vòng lặp.
- Gần như không thoại: âm không lời (humming, muttering, sighs) giọng ElevenLabs v3 qua vibi + SFX; không phụ đề.
- Mỗi tập một bối cảnh riêng. Quy trình: duyệt nhịp → code → render → `qa_couple.py`-kiểu QA → dọn rác.

## Danh sách ý tưởng
1 Lose your phone (đèn pin điện thoại để tìm điện thoại) · 2 Song stuck in your head (ậm ừ cho app) · 3 Check the fridge again ·
4 Forget why you came in · 5 Remote stops working · 6 Slow elevator · 7 Turn radio down to find address · 8 "Enjoy" → "You too!" ·
9 Wave back at a stranger · 10 Ten alarms · 11 Microwave 0:01 · 12 Push a PULL door · 13 Did I lock the door? ·
14 Shower concert · 15 Guests are coming (nhét đồ vào tủ)

## Tập 1: When You Lose Your Phone (composition `WhyWeDoEp01`, file `Ep01.tsx`, 16,6 s)
Nền GPT `content/why-we-do/ep01-lose-phone/anh/bg-living-night.png` (→ `public/why-we-do/ep01/bg.png`). Giọng Benny = Liam (ElevenLabs v3 qua vibi).
Benny cầm điện thoại trên tay suốt từ đầu.
| Giây | Nhịp |
|---|---|
| 0-1.1 | Phòng khách buổi tối, Benny đứng giữa phòng, vỗ túi quần (điện thoại trong tay), mặt chựng lại. Câu ghim "When you lose your phone 😂" |
| 1.1-2.8 | Zoom giật vào: hai tay giơ lên (vẫn cầm điện thoại), mồ hôi: "Where's my phone?!" |
| 2.8-4.7 | Chộp gối xanh trên sofa ném văng sang phải, quay lại chộp gối đỏ ném sang trái; "Not here... not here..." |
| 4.7-6.0 | Quỳ xuống trước bàn trà, cúi nhìn gầm bàn |
| 6.0-6.5 | Đèn cây chập chờn rồi tắt ("fzzt"), Benny ngước lên ngán ngẩm |
| 6.5-9.5 | "Click": bật đèn pin của chính điện thoại, chùm sáng quét gầm bàn, bò nhích dần, mặt đỏ dần sốt ruột; "Come on, come on..." |
| 9.5-11.2 | Nhạc tắt (scratch), tiếng "ting"; máy quay đẩy chậm vào điện thoại đang sáng trong tay |
| 11.2-13.5 | Cận mặt: đơ nhìn camera, chớp mắt hai lần, liếc xuống điện thoại, nhìn lại camera cười ngượng, mồ hôi, kính lóe trắng |
| 13.5-14.1 | Đèn chập chờn sáng lại; đứng dậy, nhét điện thoại vào túi hoodie (thò nửa ra), quay đi hai bước |
| 14.1-16.6 | Vỗ túi quần, hoảng: "Where's my phone?!" (vòng lặp), zoom vào mặt, hết |

## Lệnh
```bash
python "../muse-auto/gpt_anh.py" --csv content/why-we-do/ep01-lose-phone/gen-anh.csv   # nền GPT (codex)
python scripts/gen_gag_voice.py ep01 why-we-do        # giọng -> public/why-we-do/ep01 + src/why-we-do/ep01.json (ep01: mốc câu 3-4 đã dời -0,6 s tay trong src json)
python scripts/gen_couple_sfx.py --out demo-project/public/why-we-do/ep01 --only music scratch ding whoosh gulp click hiss
cd demo-project && npx remotion render WhyWeDoEp01 out/why-we-do-ep01.mp4
cd .. && python scripts/qa_couple.py ep01 --series why-we-do --effort high   # đạt 70/100; báo cáo lưu ở content/why-we-do/qa/
```
