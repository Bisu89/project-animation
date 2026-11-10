"""Tạo gen-anh.csv và gen-video.csv cho tập 16 bàn trà chai thủy tinh xanh + lưới macramé.

Xưởng lấy từ tập 15 (cb-ref-xuong.png chép từ ep15 dv-E-kho.png). Chạy: python -X utf8 tao_gen_tap16.py
"""
import csv
import os

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ep16-bottle-rope-table")
A = "cb-A-elise-truoc.png"
G = "cb-G-thanh-pham.png"
XUONG = "cb-ref-xuong.png"

TABLE_DESC = ("a round coffee table about 45 cm tall and 70 cm across: a thick round tabletop of planked rustic wood stained "
              "dark walnut brown with visible grain and a rounded edge; an identical dark wood round base disc at the bottom; "
              "between them a closed ring of about twenty upright empty wine bottles, necks up, alternating bottle-green and "
              "cobalt-blue glass all the way round, held inside a black iron frame (one ring around the shoulders, one at the "
              "base, thin vertical bars); two rounds of natural beige jute rope wrapped around the bottle shoulders, from which "
              "a macrame net of beige jute rope runs down over the bottles in a row of large diamond shapes with a flat knot at "
              "every crossing; the bottom of the bottles wrapped with many tight rounds of thick jute rope")
G_PROMPT = ("Photorealistic vertical 9:16 interior product photo, warm sunny afternoon light, no person. Recreate the product "
            "and the room in the bottom 'Final Result' picture of the reference image exactly, but WITHOUT any caption label "
            "or text, reframed to vertical 9:16 with the whole table in frame: " + TABLE_DESC + ". On the tabletop a round "
            "jute coaster with a cream macrame-covered vase of small white wildflowers and baby's breath, and an amber glass "
            "candle lantern with a lit candle. The table stands on a large round woven seagrass rug on a light wood floor in a "
            "bright boho living room: cream sofa behind on the right with a kilim-pattern cushion and a rust-orange knitted "
            "throw, a big leafy plant in a woven basket at the left, a glowing rattan lamp, sunlight from the left. Real "
            "photo, no text, no logos.")

SHAPE = ("The table must match the finished table in the finished-product reference exactly: " + TABLE_DESC.replace(
    "a round coffee table", "a round table") + ". ")
BOTTLES = ("about twenty upright empty wine bottles, necks up, strictly alternating bottle-green and cobalt-blue glass, clean "
           "and without labels")
FRAME = ("a black iron frame standing on a round dark walnut wood disc about 60 cm across: one iron ring at the bottom screwed "
         "to the disc, one iron ring about 25 cm higher at bottle-shoulder height, joined by thin vertical iron bars")
WIDE = ("Photorealistic vertical 9:16 photo, real home DIY tutorial look. Wide shot, fixed camera straight-on at chest "
        "height, exactly the same bright workshop as the workshop reference: white wall, pale wood wall shelves with glass "
        "jars, a woven basket and jars of paint brushes, trailing pothos plants, a window at the left, a light wood "
        "workbench in front, grey concrete floor. ")
SAME = "Exactly the same workshop, workbench, camera framing and light as the previous reference scene. "
CAM = ("Keep exactly the camera position, distance and framing of the SECOND reference: the work on the bench and the "
       "woman have exactly the same size and position in the frame. ")
CENTER = ("The work stands in the middle of the workbench, completely inside the frame with a clear margin on both sides, "
          "never cut off by the frame edge. ")
WOMAN = ("The same young woman from the first reference (light brown hair in a neat bun, small gold earrings, natural "
         "realistic skin texture with fine pores, no freckles, light-wash denim short overalls over a white tank top, "
         "modest, wholesome family-friendly look) stands upright behind the workbench, face visible, ")
GLOVES = "wearing black nitrile gloves, "
NOGLOVES = "bare hands, no gloves, "
END = " Only this one woman is in the scene. Real photo, no text, no logos."
END_NP = " Real photo, no text, no logos."
CLOSE = ("Photorealistic vertical 9:16 photo. Close-up, fixed camera, on the same light wood workbench, workshop background "
         "softly blurred; only the work and the woman's hands, no face. ")
ROOM = ("Exactly the same bright boho living room, rug, sofa, plant, lamp, light and camera framing as the finished-product "
        "reference (the second reference), seen in a wide vertical shot that shows the whole table and the woman. ")

ANH = [
    (1, G, "cb-ref-san-pham.png", G_PROMPT),
    (2, "cb-B-rua-chai.png", f"{A}; {XUONG}",
     WIDE + "On the workbench a grey plastic tub of soapy water at the right; at the left a wooden crate of about twenty "
     "empty wine bottles, bottle-green and cobalt-blue, still with old paper labels. In the middle a short row of three "
     "clean label-free bottles already stands. " + WOMAN + GLOVES + "holding a green bottle over the tub and scrubbing its "
     "paper label off with a sponge." + END),
    (3, "cb-B2-chai-sach.png", f"{A}; cb-B-rua-chai.png",
     SAME + CAM + "Now all the bottles are clean and label-free, standing in two neat rows along the back of the workbench, "
     "green and blue; the crate is empty, the tub is still at the right. " + WOMAN + GLOVES + "drying the last cobalt-blue "
     "bottle with a white cloth." + END),
    (4, "cb-C-khung.png", f"{A}; cb-B2-chai-sach.png; {G}",
     SAME + CAM + CENTER + "Later: the tub and crate are gone. In the middle of the workbench stands " + FRAME + ", still "
     "empty. The clean " + BOTTLES + " stand in two rows at the back right of the bench. A cordless drill. " + WOMAN +
     NOGLOVES + "driving a screw with the cordless drill through the bottom iron ring into the wood disc at the left side." +
     END),
    (5, "cb-C2-khung-xong.png", f"{A}; cb-C-khung.png; {G}",
     SAME + CAM + "Exactly the same frame and bottles as the second reference. " + WOMAN + NOGLOVES + "driving the last "
     "screw with the cordless drill through the bottom iron ring into the disc at the right side." + END),
    (6, "cb-D-xep-chai.png", f"{A}; cb-C2-khung-xong.png; {G}",
     SAME + CAM + "Exactly the same iron frame on the wood disc as the second reference. Bottles now stand inside the "
     "frame around the back half of the ring, upright, necks up, strictly alternating green and blue, touching each other; "
     "the front half is still empty. The remaining clean bottles stand at the back right of the bench. " + WOMAN + NOGLOVES +
     "lowering one cobalt-blue bottle into the ring next to a green one." + END),
    (7, "cb-D2-gan-kin.png", f"{A}; cb-D-xep-chai.png; {G}",
     SAME + CAM + "The ring of bottles is now almost closed: only a gap of three bottles remains at the front middle; all "
     "bottles strictly alternate green and blue. Only three spare bottles (green, blue, green) are left on the bench. " +
     WOMAN + NOGLOVES + "holding a green bottle above the gap." + END),
    (8, "cb-E-can-chai.png", f"cb-D2-gan-kin.png; {G}",
     CLOSE + "Close-up at bottle height on the front of the ring of bottles inside the black iron frame from the first "
     "reference: a gap of three bottles in the middle; bottles strictly alternate green and blue. Her bare hand sets a "
     "bottle-green bottle into the left of the gap; a cobalt-blue and a green bottle stand ready on the bench." + END_NP),
    (9, "cb-E2-kin-vong.png", f"cb-E-can-chai.png; {G}",
     "Exactly the same close-up framing, light, frame and bottles as the first reference. The gap is now filled: the ring "
     "is closed, green and blue strictly alternating; her fingers turn the last green bottle straight. The spare bottles "
     "are gone." + END_NP),
    (10, "cb-F-khoan.png", f"{A}; cb-D2-gan-kin.png; {G}",
     SAME + CAM + "The ring of bottles inside the iron frame is now complete and closed, strictly alternating green and "
     "blue, no spare bottles on the bench. A thin black metal strap runs around the bottle necks just above the upper iron "
     "ring. " + WOMAN + NOGLOVES + "driving a screw with the cordless drill through the strap into the upper iron ring at "
     "the left side." + END),
    (11, "cb-F2-khoan-xong.png", f"{A}; cb-F-khoan.png; {G}",
     SAME + CAM + "Exactly the same bottles and frame as the second reference. " + WOMAN + NOGLOVES + "driving the last "
     "screw with the drill through the strap into the upper iron ring at the right side." + END),
    (12, "cb-H-quan-day.png", f"{A}; cb-F2-khoan-xong.png; {G}",
     SAME + CAM + "Same ring of bottles in the iron frame. A big spool of natural beige jute rope on the bench. The first "
     "round of jute rope is wrapped around the bottle shoulders over the upper iron ring, covering only the left half of "
     "the ring so far. " + WOMAN + NOGLOVES + "pulling the rope tight around the front bottles." + END),
    (13, "cb-H2-hai-vong.png", f"{A}; cb-H-quan-day.png; {G}",
     SAME + CAM + "Two full tight rounds of beige jute rope now wrap the bottle shoulders all the way round, hiding the "
     "upper iron ring exactly like on the finished table; many loose jute cords (each about 1 m long) hang down from the "
     "rope rounds in pairs all around. " + WOMAN + NOGLOVES + "tying off the rope end at the front." + END),
    (14, "cb-K-can-nut.png", f"cb-K2-nut-xong.png; {G}",
     "Vertical 9:16. Recreate the first reference image exactly: same close-up framing, light, bottles, rope rounds and "
     "hands. Only one change, it is a moment earlier: only two finished flat knots on the left, joining the cords into the "
     "top of one big diamond shape; her bare hands are tying the third flat knot in the middle; every cord to the right "
     "still hangs straight down." + END_NP),
    (15, "cb-K2-nut-xong.png", f"cb-K-can-nut.png; {G}",
     "Exactly the same close-up framing, light, bottles and rope as the first reference. Now four flat knots are tied: "
     "one full diamond shape of the net is closed and the next one has begun on the right; her fingers pull the last knot "
     "tight. The other cords on the right still hang straight." + END_NP),
    (16, "cb-L-de-day.png", f"{A}; cb-H2-hai-vong.png; {G}",
     SAME + CAM + SHAPE + "Later: the macrame net of large diamonds with flat knots now covers the bottles all the way "
     "round exactly like on the finished table, no loose cords left. At the bottom, two rounds of thick jute rope are wrapped "
     "around the base of the bottles at the left side; the rest of the base is still bare, the thick rope comes from a "
     "coil on the bench. No tabletop yet. " + WOMAN + NOGLOVES + "winding the thick rope around the base." + END),
    (17, "cb-L2-de-xong.png", f"{A}; cb-L-de-day.png; {G}",
     SAME + CAM + "The bottom of the bottles is now wrapped with many tight rounds of thick jute rope all the way round, "
     "exactly like on the finished table. No tabletop yet. " + WOMAN + NOGLOVES + "tucking the rope end in at the front." +
     END),
    (18, "cb-M-ha-mat.png", f"{A}; cb-M2-mat-xong.png; {G}",
     "Recreate the second reference image exactly: same living room, rug, sofa, plant, lamp, light, camera position, "
     "distance and framing, the table base at exactly the same size and place. Only one change, a moment earlier: the "
     "round dark walnut tabletop is not on the base yet; " + WOMAN.replace("stands upright behind the workbench",
     "stands behind the table base") + NOGLOVES + "holds the tabletop level with both hands about 20 cm above the bottle "
     "necks, lowering it. Nothing on the base." + END),
    (19, "cb-M2-mat-xong.png", f"{A}; cb-M-ha-mat.png; {G}",
     "Exactly the same living room, camera framing and light as the second reference. The round tabletop now sits flat "
     "and centred on the bottle base, the whole table looks exactly like the finished table; the tabletop is still empty. " +
     WOMAN.replace("behind the workbench", "behind the table") + NOGLOVES + "her hands just leaving the tabletop edge."
     + END),
    (20, "cb-N-cam-hoa.png", f"{A}; cb-M2-mat-xong.png; {G}",
     "Exactly the same living room, table, camera framing and light as the second reference. On the tabletop a round jute "
     "coaster with an empty cream macrame-covered vase and an amber glass candle lantern with an unlit candle, a box of "
     "long matches. " + WOMAN.replace("behind the workbench", "behind the table") + NOGLOVES + "smiling, holding a bunch "
     "of small white wildflowers and baby's breath just above the vase." + END),
    (21, "cb-N2-hoa-xong.png", f"{A}; cb-N-cam-hoa.png; {G}",
     "Exactly the same living room, table, camera framing and light as the second reference. The white flowers are now "
     "arranged in the macrame vase exactly like the finished-product reference, and the candle in the amber lantern is lit. "
     + WOMAN.replace("behind the workbench", "behind the table") + NOGLOVES + "smiling, shaking out the long match." + END),
]

BASE = ("Real home DIY timelapse video, vertical 9:16, photorealistic, not animated, no text, no logos. One continuous "
        "fixed shot: same framing as the start frame, no zoom, no pan, no cuts, no scene changes. The video must start "
        "exactly like the start-frame image and end exactly like the end-frame image. The room stays exactly as in the "
        "start frame the whole clip. Only this one woman is ever in the scene; no other person appears. The young woman "
        "from the reference (light brown hair in a bun, light-wash denim short overalls, white tank top): ")
TAIL = (" She works at a natural, steady pace and never stands idle or sways while holding an item; nothing appears, "
        "vanishes or changes by itself.")
KEEP = (" The bottles keep exactly their number, colours (strictly alternating green and blue) and positions; the iron "
        "frame and wood disc keep exactly their shape and size.")
CLOSE_V = ("Real home DIY video, vertical 9:16, photorealistic, no text, no logos. One continuous fixed close-up shot, same "
           "framing as the start frame, no zoom, no cuts. ")

VID = [
    (1, "Mở đầu - thành phẩm", G, "",
     "Real video, vertical 9:16, photorealistic, no text, no logos. Static camera, exactly the start frame. No person. "
     "Warm sunny light; the candle flame flickers, the white flowers stir very slightly, sunlight glints in the green and "
     "blue glass. Nothing else moves, nothing appears or vanishes.", "Nhạc acoustic nhẹ bắt đầu.", 1.5, "cat", "", ""),
    (2, "Rửa chai bóc nhãn", "cb-B-rua-chai.png", "cb-B2-chai-sach.png",
     BASE + "wearing black nitrile gloves, takes the labelled bottles from the crate one by one, scrubs each label off "
     "with the sponge in the soapy tub and stands each clean bottle in the rows at the back of the bench, then dries the "
     "last blue bottle with a white cloth, as in the end frame. Labels come off only where the sponge scrubs." + TAIL,
     "Nhạc acoustic nhẹ, tiếng nước, tiếng chai lách cách.", 3, "tang_toc", "", "mo_dai"),
    (3, "Bắt khung sắt lên đế", "cb-C-khung.png", "cb-C2-khung-xong.png",
     BASE + "moves around the iron frame with the cordless drill, driving screws through the bottom iron ring into the "
     "wood disc one by one from the left side to the right side, as in the end frame." + KEEP + TAIL,
     "Nhạc acoustic nhẹ, tiếng khoan bắt vít.", 3, "tang_toc", "", "mo_dai"),
    (4, "Xếp chai xen màu", "cb-D-xep-chai.png", "cb-D2-gan-kin.png",
     BASE + "takes the clean bottles from the bench one by one and stands each upright inside the iron frame next to the "
     "previous one, green then blue then green, filling the ring around the front until only a gap of three remains, as in "
     "the end frame. Each bottle appears in the ring only where her hand sets it down; bottles already placed never move."
     " The iron frame and wood disc keep exactly their shape and size." + TAIL,
     "Nhạc acoustic nhẹ, tiếng chai thủy tinh chạm nhau.", 3, "tang_toc", "", "mo"),
    (5, "Cận đặt chai cuối", "cb-E-can-chai.png", "cb-E2-kin-vong.png",
     CLOSE_V + "Her bare hand sets the green bottle into the gap, then the blue one, then the last green one, each "
     "touching its neighbour, and turns the last bottle straight, as in the end frame. Only the three bottles she handles "
     "move; all other bottles never move or change colour.", "Nhạc acoustic nhẹ, tiếng thủy tinh chạm.", 3, "cat", "",
     "mo"),
    (6, "Khoan bắt đai cổ chai", "cb-F-khoan.png", "cb-F2-khoan-xong.png",
     BASE + "moves around the table base with the cordless drill, driving screws through the thin strap into the upper "
     "iron ring one by one from the left side to the right side, as in the end frame." + KEEP + TAIL,
     "Nhạc acoustic nhẹ, tiếng khoan.", 3, "tang_toc", "", "mo"),
    (7, "Quấn dây đay vai chai", "cb-H-quan-day.png", "cb-H2-hai-vong.png",
     BASE + "walks the jute rope around the bottle shoulders, pulling it tight, finishing the first round and wrapping "
     "the second round just below it, then ties off the end at the front, as in the end frame. Rope appears only where "
     "her hands lay it." + KEEP + TAIL, "Nhạc acoustic nhẹ, tiếng dây sột soạt.", 3, "tang_toc", "", "mo"),
    (8, "Cận thắt nút macramé", "cb-K-can-nut.png", "cb-K2-nut-xong.png",
     CLOSE_V + "Her bare hands slowly tie a flat macrame knot joining two hanging jute cords, pull it tight, then tie one "
     "more knot to its right, closing one diamond shape, as in the end frame. Knots appear only where her fingers tie "
     "them; the finished knots and the bottles never move or change; the cords on the right keep hanging straight.",
     "Nhạc acoustic nhẹ, tiếng dây.", 4, "cat", "", "mo_dai"),
    (9, "Quấn dây thừng đế", "cb-L-de-day.png", "cb-L2-de-xong.png",
     BASE + "winds the thick jute rope round and round the bottom of the bottles, each new round laid tightly above the "
     "last, all the way round the base, then tucks the end in at the front, as in the end frame. Rope appears only where "
     "her hands lay it; the macrame net never changes." + KEEP + TAIL, "Nhạc acoustic nhẹ, tiếng dây.", 3, "tang_toc",
     "", "mo_dai"),
    (10, "Đặt mặt bàn gỗ", "cb-M-ha-mat.png", "cb-M2-mat-xong.png",
     BASE + "slowly lowers the round wooden tabletop level onto the bottle necks, settles it centred on the base and "
     "lets go of its edge, as in the end frame. The tabletop keeps exactly its round shape and size; the base never "
     "changes." + TAIL, "Nhạc acoustic nhẹ, tiếng gỗ đặt xuống.", 3, "tang_toc", "", "mo_dai"),
    (11, "Cắm hoa, châm nến", "cb-N-cam-hoa.png", "cb-N2-hoa-xong.png",
     BASE + "no gloves, lowers the white wildflowers into the macrame vase and spreads them gently, then strikes a long "
     "match and lights the candle in the amber lantern, shaking out the match, as in the end frame. The table, vase and "
     "lantern never move or change shape." + TAIL, "Nhạc acoustic nhẹ, tiếng quẹt diêm.", 5, "cat", "", "mo"),
    (12, "Quay vòng thành phẩm", G, "",
     "Real video, vertical 9:16, photorealistic, no text, no logos. It must start exactly like the start-frame image. No "
     "person. The finished round coffee table: dark walnut tabletop, ring of alternating green and blue bottles wrapped "
     "with jute rope and a macrame diamond net, white flowers in a macrame vase and a lit amber candle lantern on top, in "
     "the sunny boho living room. One smooth, slow cinematic camera orbit around the table at the same height, moving "
     "about 60 degrees to the right, keeping it centred and in sharp focus. The table, bottles, rope and flowers never "
     "change, nothing appears or vanishes.", "Nhạc acoustic nhẹ kết.", 6, "tang_toc", "5", "mo_dai"),
]
KHONG_THAM_CHIEU = {1, 5, 8, 12}


def main():
    with open(os.path.join(D, "gen-anh.csv"), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["stt", "ten_file", "ty_le", "gui_kem", "prompt"])
        w.writeheader()
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
    print(f"{len(ANH)} images, {len(VID)} clips")


if __name__ == "__main__":
    main()
