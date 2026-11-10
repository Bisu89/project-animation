"""Tạo gen-anh.csv và gen-video.csv cho tập 15 bình xoắn ngà, đai dây vàng, cành lá vàng.

Xưởng lấy từ tập 11 (ảnh dv-B2-nhac-vai.png chép từ ep11 xv-B2). Chạy: python -X utf8 tao_gen_tap15.py
"""
import csv
import os

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ep15-gold-rope-vase")
A = "dv-A-elise-truoc.png"
G = "dv-G-thanh-pham.png"

SHAPE = ("The vase shape must match the finished vase in the reference exactly: tall body with deep fabric folds twisting "
         "in a diagonal spiral from the foot to the mouth, a narrow waist in the lower third above a slightly rounded "
         "bottom, and the top flaring into a wide wavy ruffled rim. ")
SAME = "Exactly the same workshop, table, camera framing and light as the previous reference scene. "
CAM = ("Keep exactly the camera position, distance and framing of the SECOND reference: the vase and the woman have "
       "exactly the same size and position in the frame. ")
WOMAN = ("The same young woman from the first reference (light brown hair in a neat bun, natural realistic skin texture "
         "with fine pores, no freckles, light-wash denim short overalls over a white tank top) stands behind the table, "
         "face visible, ")
GLOVES = "wearing black nitrile gloves, "
END = " Real photo, no text, no logos."
CLOSE = ("Photorealistic vertical 9:16 photo. Close-up, fixed camera, on the same light wood workshop table, background "
         "softly blurred; only the vase and the woman's hands, no face. ")
LEFT = ("The work stands at the left part of the table beside the tray, completely inside the frame with a clear margin "
        "on every side, never cut off by the frame edge, about 30 cm tall (the same height as the bottle in the second "
        "reference), its top below the woman's waist. ")
M = "dv-M-cam-hoa.png"
SIZE = ("The vase stands in the middle of the table at exactly the same place and size as the vase in the FOURTH reference "
        "(its top just below the woman's waist), completely inside the frame. ")
BANDS = ("three diagonal spiral bands of braided jute rope, each band three or four rope rows laid tightly side by side, "
         "following the folds around the lower half of the vase")

ANH = [
    (2, "dv-C-quan.png", f"{A}; dv-B2-nhac-vai.png; {G}",
     SAME + CAM + LEFT + "The wet grey-white cement-soaked cloth is now wrapped around the tall plastic bottle that is wrapped in "
     "cling film, its top edge standing loosely above the bottle mouth, roughly gathered, not twisted yet; the cement tray "
     "stays on the table. " + WOMAN + GLOVES + "smoothing the wet cloth around the bottle with both hands." + END),
    (3, "dv-D-xoan.png", f"{A}; dv-C-quan.png; {G}",
     SAME + CAM + LEFT + SHAPE + "The wet grey-white cement cloth is now twisted into deep diagonal spiral folds around the whole "
     "body, pinched in at the waist, and its top edge is pinched into a wide wavy ruffled rim. " + WOMAN + GLOVES +
     "pinching the last ruffle of the rim." + END),
    (4, "dv-E-kho.png", f"{A}; dv-D-xoan.png; {G}; {M}",
     SAME + CAM + SIZE + SHAPE + "Time skip, the next day: the twisted cloth vase has dried hard and matte pale grey, exactly the "
     "same shape; the tray is gone, the table is clean. Beside it an open jar of ivory-cream paint. " + WOMAN + GLOVES +
     "brushing ivory-cream paint onto the top of the vase with a wide soft brush: only the ruffled rim is ivory so far." + END),
    (5, "dv-E2-son-nga.png", f"{A}; dv-E-kho.png; {G}; {M}",
     SAME + CAM + SIZE + SHAPE + "The whole vase is now painted smooth ivory-cream, no gold, no rope yet. " + WOMAN + GLOVES +
     "finishing the last brush stroke at the foot." + END),
    (6, "dv-F-day.png", f"dv-E2-son-nga.png; {G}",
     CLOSE + SHAPE + "Close-up on the lower half of the ivory-cream twisted vase. One band of plain light tan braided jute "
     "rope, three or four rows laid tightly side by side, is already glued diagonally into the lowest spiral groove. Her bare "
     "fingers (no gloves) press the rows of a second band into the next groove above: only its left half is laid so far, "
     "the loose rope end comes from a spool on the table. No gold anywhere yet." + END),
    (7, "dv-F2-day-xong.png", f"dv-F-day.png; {G}",
     "Exactly the same close-up framing, light, vase and hands as the first reference. The second jute rope band now runs "
     "all the way across the visible side in its groove; her fingertips press its end. Still no gold." + END),
    (8, "dv-H-son-vang.png", f"dv-F2-day-xong.png; {G}",
     "Exactly the same close-up framing, light and vase as the first reference, a little later: there are now " + BANDS +
     ", all still plain tan jute. A small open jar of liquid gold paint on the table. BOTH her hands wear black nitrile gloves: one steadies the "
     "vase, the other brushes gold "
     "paint onto the top band: its left third is already glossy gold, the rest still tan jute; the other bands stay tan." + END),
    (9, "dv-H2-vang-xong.png", f"dv-H-son-vang.png; {G}",
     "Exactly the same close-up framing, light, vase and hands as the first reference, BOTH hands in black nitrile "
     "gloves. The whole top rope band is now glossy "
     "gold exactly like the finished vase; the brush lifts away at its right end." + END),
    (10, "dv-K-la.png", f"dv-H2-vang-xong.png; {G}",
     CLOSE + SHAPE + "Close-up on the middle of the ivory-cream twisted vase: below, " + BANDS.replace("braided jute rope",
     "glossy gold-painted braided rope") + ", all gold exactly like the finished vase. Her bare fingers hold a ready-made "
     "gold leaf branch (one slim stem with six slim gold leaves) just against the body above the bands, at the same place "
     "and angle as on the finished vase, not pressed on yet." + END),
    (11, "dv-K2-la-xong.png", f"dv-K-la.png; {G}",
     "Exactly the same close-up framing, light, vase and hands as the first reference. The gold leaf branch is now pressed "
     "flat onto the body, raised, exactly like the finished vase; her fingers move away from it." + END),
    (12, "dv-L-vien.png", f"dv-K2-la-xong.png; {G}",
     CLOSE + SHAPE + "Close-up on the wide wavy ruffled rim of the ivory-cream vase, seen slightly from above. Her "
     "black-gloved hand holds a fine thin brush with gold paint on its tip, touching the rim edge at the left, where a "
     "short shiny gold line has just begun; the rest of the rim edge is still ivory." + END),
    (13, "dv-L2-vien-xong.png", f"dv-L-vien.png; {G}",
     "Exactly the same close-up framing, light, vase and hand as the first reference. The thin shiny gold line now runs "
     "along the whole visible ruffled rim edge exactly like the finished vase; the brush lifts away at the right." + END),
    (14, "dv-M-cam-hoa.png", f"{A}; dv-E2-son-nga.png; {G}",
     SAME + CAM + "The finished vase stands empty in the middle of the clean table, exactly like the finished vase in the "
     "third reference (ivory twisted body, gold-edged ruffled rim, three gold rope bands, gold leaf branch, thin gold band "
     "at the foot). " + WOMAN + "no gloves, smiling, holding a bouquet just above the vase: white lilies with green buds, "
     "cream roses, white waxflower and baby's breath, silver-green eucalyptus." + END),
    (15, "dv-M2-hoa-xong.png", f"{A}; dv-M-cam-hoa.png; {G}",
     SAME + CAM + "The bouquet is now arranged in the vase exactly like the finished-product reference. " + WOMAN +
     "no gloves, smiling, gently adjusting one lily with her fingers." + END),
]

BASE = ("Real home DIY timelapse video, vertical 9:16, photorealistic, not animated, no text, no logos. One continuous "
        "fixed shot: same framing as the start frame, no zoom, no pan, no cuts, no scene changes. The video must start "
        "exactly like the start-frame image and end exactly like the end-frame image. The bright workshop stays exactly as "
        "in the start frame the whole clip. Only this one woman is ever in the scene; no other person appears. The young "
        "woman from the reference (light brown hair in a bun, light-wash denim short overalls, white tank top): ")
TAIL = (" She works at a natural, steady pace and never stands idle or sways while holding an item; nothing appears, "
        "vanishes or changes by itself.")
SHAPE_V = " The vase keeps exactly its shape, size and position."
CLOSE_V = ("Real home DIY video, vertical 9:16, photorealistic, no text, no logos. One continuous fixed close-up shot, same "
           "framing as the start frame, no zoom, no cuts. ")

VID = [
    (1, "Mở đầu - thành phẩm", G, "",
     "Real video, vertical 9:16, photorealistic, no text, no logos. Static camera, exactly the start frame. No person. "
     "Warm golden light; the lily petals and eucalyptus leaves stir very slightly, the candle flame flickers. Nothing else "
     "moves, nothing appears or vanishes.", "Nhạc piano nhẹ bắt đầu.", 1.5, "cat", "", ""),
    (2, "Quấn vải xi măng", "dv-B2-nhac-vai.png", "dv-C-quan.png",
     BASE + "wearing black nitrile gloves, lifts the dripping cement-soaked cloth, wraps it around the cling-film-wrapped "
     "bottle and smooths it with both hands, as in the end frame." + TAIL,
     "Nhạc piano nhẹ, tiếng vải ướt.", 3, "tang_toc", "", "mo_dai"),
    (3, "Vặn xoắn, bóp viền bèo", "dv-C-quan.png", "dv-D-xoan.png",
     BASE + "wearing black nitrile gloves, twists the wet cloth into deep diagonal spiral folds from the bottom up, pinches "
     "in the waist, then pinches the top edge into a wavy ruffled rim, as in the end frame. The cloth only changes where her "
     "hands work it." + TAIL, "Nhạc piano nhẹ, tiếng vải ướt.", 3, "tang_toc", "", "mo"),
    (4, "Sơn ngà", "dv-E-kho.png", "dv-E2-son-nga.png",
     BASE + "wearing black nitrile gloves, paints the pale grey vase ivory-cream with a wide brush from the top down; the "
     "colour changes only exactly where the brush passes, as in the end frame." + SHAPE_V + TAIL,
     "Nhạc piano nhẹ, tiếng cọ.", 3, "tang_toc", "", "mo_dai"),
    (5, "Cận dán dây vào rãnh xoắn", "dv-F-day.png", "dv-F2-day-xong.png",
     CLOSE_V + "Her bare fingers press braided jute rope rows one by one into the spiral groove, following it from left to "
     "right, until the second band is complete, as in the end frame. Rope appears only where her fingers press it; the "
     "first band never moves or changes." + SHAPE_V, "Nhạc piano nhẹ, tiếng dây sột soạt.", 3, "tang_toc", "", "mo_dai"),
    (6, "Cận sơn vàng đai dây", "dv-H-son-vang.png", "dv-H2-vang-xong.png",
     CLOSE_V + "Her black-gloved hand slowly brushes liquid gold paint along the top rope band from left to right; the "
     "rope turns glossy gold only exactly where the brush passes, until the whole band is gold, as in the end frame. The "
     "other bands stay tan." + SHAPE_V, "Nhạc piano nhẹ, tiếng cọ.", 4, "cat", "", "mo_dai"),
    (7, "Cận gắn cành lá vàng", "dv-K-la.png", "dv-K2-la-xong.png",
     CLOSE_V + "Her bare fingers slowly press the gold leaf branch flat onto the vase body, hold it a moment, then move "
     "away, as in the end frame. The branch keeps exactly its six leaves and shape." + SHAPE_V,
     "Nhạc piano nhẹ.", 3, "cat", "", "mo"),
    (8, "Cận kẻ vàng viền bèo", "dv-L-vien.png", "dv-L2-vien-xong.png",
     CLOSE_V + "Her black-gloved hand slowly draws the fine gold line along the ruffled rim edge from left to right with "
     "the thin brush; gold appears only exactly at the brush tip, as in the end frame." + SHAPE_V,
     "Nhạc piano nhẹ, tiếng cọ.", 4, "cat", "", "mo"),
    (9, "Cắm hoa", "dv-M-cam-hoa.png", "dv-M2-hoa-xong.png",
     BASE + "no gloves, lowers the bouquet stems into the vase and gently arranges the lilies, roses, waxflower and "
     "eucalyptus so they spread evenly above the rim, then adjusts one lily, as in the end frame. The flowers keep their "
     "colours." + SHAPE_V + TAIL, "Nhạc piano nhẹ.", 5, "cat", "", "mo_dai"),
    (10, "Quay vòng thành phẩm", G, "",
     "Real video, vertical 9:16, photorealistic, no text, no logos. It must start exactly like the start-frame image. No "
     "person. The finished ivory twisted vase with gold rope bands, the gold leaf branch and the lily bouquet on the cream "
     "marble table, warm golden light. One smooth, slow cinematic camera orbit around the vase at the same height, moving "
     "about 60 degrees to the right, keeping it centred and in sharp focus. The vase and flowers never change, nothing "
     "appears or vanishes.", "Nhạc piano nhẹ kết.", 6, "tang_toc", "5", "mo_dai"),
]
KHONG_THAM_CHIEU = {1, 5, 6, 7, 8, 10}


def main():
    with open(os.path.join(D, "gen-anh.csv"), encoding="utf-8-sig") as f:
        g_row = next(r for r in csv.DictReader(f) if r["ten_file"] == G)
    with open(os.path.join(D, "gen-anh.csv"), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["stt", "ten_file", "ty_le", "gui_kem", "prompt"])
        w.writeheader()
        w.writerow({k: g_row[k] for k in ("stt", "ten_file", "ty_le", "gui_kem", "prompt")})
        for s, t, g, pr in ANH:
            w.writerow({"stt": s, "ten_file": t, "ty_le": "9:16", "gui_kem": g, "prompt": pr})
    cols = ["stt", "doan", "luu_tai", "khung_dau", "khung_cuoi", "anh_tham_chieu", "prompt", "am_thanh", "dung_giay",
            "che_do", "cat_tu", "cat_den", "chuyen_canh"]
    with open(os.path.join(D, "gen-video.csv"), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for s, doan, a, b, pr, am, dg, cd, den, cc in VID:
            w.writerow({"stt": s, "doan": f"Clip {s} - {doan}", "luu_tai": f"video\\clip{s}.mp4", "khung_dau": a,
                        "khung_cuoi": b, "anh_tham_chieu": "" if s in KHONG_THAM_CHIEU else A, "prompt": pr,
                        "am_thanh": am, "dung_giay": dg, "che_do": cd, "cat_tu": "", "cat_den": den,
                        "chuyen_canh": cc})
    print(f"{len(ANH) + 1} images, {len(VID)} clips")


if __name__ == "__main__":
    main()
