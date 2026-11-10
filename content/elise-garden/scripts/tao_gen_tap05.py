"""Sinh gen-anh.csv + gen-video.csv cho Elise Garden tập 05 (bông cải tím).

Chạy: python -X utf8 tao_gen_tap05.py
Chủ dự án duyệt nội dung 2026-11-09. Luôn đúng 3 cây một hàng: cây trái bị cắt, cây giữa là khung kết.
Ảnh mẫu chưa có file: ảnh G gen theo mô tả; có file eg5-ref-san-pham.png thì thêm vào gui_kem của G và gen lại.
Cột cắt sửa ở ghep-v2.csv, không ở đây.
"""
import csv
import os

TAP = "ep05-purple-cauliflower"
TT = "eg5"
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", TAP)

A = f"{TT}-A-elise-truoc.png"
G = f"{TT}-G-thanh-pham.png"
REF = f"{TT}-ref-san-pham.png"
END = " Real photo, no text, no logos, no watermark."
BARE = (" Her forearms are bare: she wears a sleeveless orange tank top, so no sleeve, cuff or fabric is visible "
        "on her arms, only natural skin.")

HEAD = ("a deep vivid purple cauliflower head, round, dense and tight, made of many small knobbly coral-like florets")
LEAVES = ("large blue-green, slightly greyish cabbage-like leaves with prominent white midribs and veins and wavy "
          "edges, opening around the head like a rose")
ROOM = ("a backyard vegetable garden softly blurred behind, a weathered wooden fence and green trees far in the "
        "background, soft early-morning daylight slightly from behind")

OUTFIT = ("light brown hair in a neat bun with a few loose strands, natural realistic skin texture with fine pores, no "
          "freckles, no airbrushing, small gold earrings, fine gold necklace, woodland camouflage short bib overalls over a "
          "vivid orange sleeveless V-neck tank top, white sneakers, bare arms, bare hands, no gloves, no backpack, no "
          "apron, no hat, modest wholesome family-friendly look")
WOMAN = "The same young woman from the first reference: " + OUTFIT + ", face visible"
BED = ("a long straight garden bed of dark loose soil runs horizontally across the lower part of the frame, the "
       "vegetable garden and a weathered wooden fence softly blurred far behind, soft early-morning daylight; a bale "
       "of golden straw and a small green metal watering can stand on the grass at the right end of the bed")
THREE = "exactly three plants in one straight row along the bed, widely spaced (left, middle, right)"
WIDE = ("Photorealistic vertical 9:16 photo, real backyard gardening look. Medium-wide shot, fixed camera straight-on "
        "at chest height; the woman stands behind the bed, visible from the knees up, the bed across the lower third of "
        f"the frame. Setting: {BED}. ")
SAME = "Same garden bed, background, light and camera framing as the previous reference scene. "
CAM = ("Keep exactly the camera position, distance and framing of the SECOND reference: the bed and the woman have "
       "exactly the same size and position in the frame. ")
CLOSE = ("Photorealistic vertical 9:16 photo, soft early-morning daylight. Close-up, fixed camera looking slightly down "
         "at the dark loose soil of the garden bed, the garden softly blurred at the top. ")
STAGE = ("Photorealistic vertical 9:16 photo, no people, no hands, no tools, no watering can. Exactly the same camera "
         "position, framing, bed, background and light as the reference. ")
SEEDLING = ("a young purple cauliflower seedling with four or five small blue-green leaves and purple-tinged stems")

# (stt, ten_file, gui_kem, prompt)
ANH = [
    (1, G, "",
     "Photorealistic vertical 9:16 photo, real backyard garden, close shot at the height of the head looking slightly "
     f"down. One purple cauliflower plant growing in the soil fills the frame: {HEAD}, sits in the centre, surrounded by "
     f"{LEAVES}. A few leaves curl up in front of the head at the bottom of the frame. Fresh water droplets bead on the "
     f"leaves and on the purple florets. Background: {ROOM}. No people, no hands." + END),

    # Clip 1: bóp khay ươm (cận tay)
    (2, f"{TT}-B0-bop-khay.png", f"{G}; {A}",
     CLOSE + "At the edge of the bed sits a black plastic seedling cell tray with three cells, each holding "
     f"{SEEDLING}. A woman's bare hand (natural skin, short clean nails) lifts the tray slightly and her fingers squeeze "
     "the bottom of the left cell. Only the hands and forearms are visible." + END),
    (3, f"{TT}-B1-cay-ra.png", f"{TT}-B0-bop-khay.png",
     "Exactly the same close-up framing, light, soil, tray and hands as the reference. Only change: the left seedling "
     "has popped up out of its cell with its whole intact plug of soil and white roots; her other hand holds it gently "
     "by the leaves just above the tray. The other two seedlings stay in their cells." + END),

    # Clip 2: trồng, ấn đất (cận tay)
    (4, f"{TT}-C0-dat-cay.png", f"{TT}-B1-cay-ra.png",
     "Photorealistic vertical 9:16 photo, soft early-morning daylight. Close-up, fixed camera looking down at a small "
     "planting hole in the dark loose soil of the bed. Two bare hands lower the same seedling with its soil plug into "
     "the hole." + END),
    (5, f"{TT}-C1-an-dat.png", f"{TT}-C0-dat-cay.png",
     "Exactly the same close-up framing, light and soil as the reference. Only change: the seedling now stands planted "
     "upright in the soil, the hole filled in, and both hands press the soil firmly around its stem." + END),

    # Clip 3: rải rơm (rộng, có người)
    (6, f"{TT}-D0-rai-rom.png", f"{A}; {G}",
     WIDE + f"In the bed: {THREE}, each {SEEDLING}, freshly planted. A ring of golden straw mulch already lies around "
     "the left seedling. " + WOMAN + ", standing upright behind the bed, laying a handful of golden straw around the "
     "middle seedling." + END),
    (7, f"{TT}-D1-rom-xong.png", f"{TT}-D0-rai-rom.png",
     "Recreate the reference image exactly: same framing, camera, bed, background, light, the same three seedlings and "
     "the same young woman in the same outfit, standing upright, modest and wholesome. Only change: a ring of golden "
     "straw mulch now lies around all three seedlings, and she stands upright behind the right seedling, holding a "
     "small handful of straw at waist height over it." + END),

    # Clip 4: tưới (rộng)
    (8, f"{TT}-H0-tuoi.png", f"{A}; {TT}-D1-rom-xong.png; {G}",
     WIDE + SAME + CAM + f"In the bed: {THREE}, the same seedlings with straw mulch rings. " + WOMAN + ", holding the "
     "small green metal watering can and pouring a gentle stream of water at the base of the left seedling." + END),
    (9, f"{TT}-H1-tuoi-xong.png", f"{A}; {TT}-H0-tuoi.png; {G}",
     WIDE + SAME + CAM + f"In the bed: {THREE}; the straw and soil around all three are now darker and wet. " + WOMAN +
     ", still pouring a gentle stream of water at the base of the right seedling." + END),

    # Clip 5: Weeks later - cây lớn (rộng, không người)
    (10, f"{TT}-M2-cay-lon.png", f"{TT}-H1-tuoi-xong.png; {G}",
     STAGE.replace("as the reference", "as the first reference") + "Only change: the three plants are now large "
     f"cauliflower plants, each a wide rosette of {LEAVES}, almost touching each other and covering the bed above the "
     "straw. No head is visible yet. Exactly three plants in the same three places." + END),

    # Clip 6: vạch lá thấy nụ (cận tay)
    (11, f"{TT}-K0-vach-la.png", f"{TT}-M2-cay-lon.png; {G}",
     "Photorealistic vertical 9:16 photo, soft early-morning daylight. Close-up, fixed camera looking down into the "
     f"centre of the middle cauliflower plant: {LEAVES}, the inner leaves closed together in the centre. Two bare hands "
     "rest on the two inner leaves, about to part them." + END),
    (12, f"{TT}-K1-thay-nu.png", f"{TT}-K0-vach-la.png; {G}",
     "Exactly the same close-up framing, light and leaves as the first reference. Only change: the two hands have "
     "gently parted the inner leaves, revealing in the centre a small young purple cauliflower head about the size of "
     "an egg, tight and deep purple, with the same coral-like florets as the second reference." + END),

    # Clip 7: rắc phân hữu cơ (cận tay)
    (13, f"{TT}-F0-rac-phan.png", f"{TT}-M2-cay-lon.png",
     "Photorealistic vertical 9:16 photo, soft early-morning daylight. Close-up, fixed camera looking down at the base "
     "of one large cauliflower plant: the thick stem, the lower blue-green leaves and the golden straw mulch around it. "
     "A bare hand holds a small handful of brown granular organic fertilizer and has just started to sprinkle it; a few "
     "granules lie on the straw on the left side of the stem." + END),
    (14, f"{TT}-F1-rac-xong.png", f"{TT}-F0-rac-phan.png",
     "Exactly the same close-up framing, light, stem, leaves and straw as the reference. Only change: a full even ring "
     "of brown fertilizer granules now lies on the straw all around the stem, and the empty hand is opening above the "
     "right side." + END),

    # Clip 8: Weeks later - bông lớn hơn (cận, không người, khung G)
    (15, f"{TT}-S1-bong-vua.png", G,
     "Photorealistic vertical 9:16 photo, no people, no hands. Recreate the reference image exactly: same camera "
     "position and framing, same leaves, same background and light. Only change: the purple cauliflower head in the "
     "centre is about half as big, still tight and deep purple, nestled lower between the leaves; no water droplets."
     + END),

    # Clip 9: cắt bông (cận tay, cây trái)
    (16, f"{TT}-R0-cat-bong.png", G,
     "Photorealistic vertical 9:16 photo, soft early-morning daylight. Close-up, fixed camera, of a mature purple "
     "cauliflower head exactly like the reference, the outer leaves pushed open, golden straw at the bottom. A woman's "
     "bare hand holds the top of the head; her other hand holds a small kitchen knife with a wooden handle, its blade "
     "against the thick stem just below the head." + BARE + END),
    (17, f"{TT}-R1-cat-xong.png", f"{TT}-R0-cat-bong.png",
     "Exactly the same close-up framing, light, leaves and straw as the reference. Only change: the stem is cut through; "
     "the hand lifts the purple head a few centimetres, a few blue-green wrapper leaves still attached, a clean cut "
     "stump left below." + BARE + END),

    # Clip 10: đặt vào rổ (cận tay)
    (18, f"{TT}-Q0-nhac-bong.png", f"{TT}-R1-cat-xong.png",
     "Photorealistic vertical 9:16 photo, soft early-morning daylight. Close-up, fixed camera looking down at an empty "
     "woven wicker basket standing on the golden straw. Two bare hands hold the same cut purple cauliflower head with a "
     "few wrapper leaves just above the basket." + BARE + END),
    (19, f"{TT}-Q1-trong-ro.png", f"{TT}-Q0-nhac-bong.png",
     "Exactly the same close-up framing, light, straw and basket as the reference; the round basket has NO handle, "
     "exactly like the reference. Only change: the purple cauliflower "
     "head now rests in the basket, and the hands are just letting go." + BARE + END),

    # Clip 11: rổ + cây giữa, Elise đứng dậy (cận vừa)
    (20, f"{TT}-W0-phui-tay.png", f"{A}; {TT}-Q1-trong-ro.png; {G}",
     "Photorealistic vertical 9:16 photo, soft early-morning daylight. Medium shot, fixed camera at low height: in the "
     "foreground on the golden straw the wicker basket with the cut purple cauliflower head from the second reference; "
     "behind it the middle cauliflower plant with its own mature purple head among large blue-green leaves, like the "
     "third reference. " + WOMAN + ", crouching beside the plant, brushing soil off her hands." + END),
    (21, f"{TT}-W1-dung-day.png", f"{TT}-W0-phui-tay.png",
     "Exactly the same framing, light, basket, cauliflower head and plant as the reference. Only change: the woman has "
     "stood up and is stepping out of the frame on the right; only her legs and one arm are still visible." + END),
    # Clip 13 (chèn sau clip 1): đào hố rồi đặt cây con (cận tay)
    (22, f"{TT}-E0-dao-ho.png", f"{TT}-C0-dat-cay.png; {TT}-B1-cay-ra.png",
     "Exactly the same close-up framing, light and soil as the first reference, but BEFORE planting: the dark loose "
     "soil is flat and undisturbed, no hole yet. A woman's bare hand pushes a small hand trowel with a wooden handle "
     "into the soil at the centre, starting to dig. The same seedling from the second reference, with its whole soil "
     "plug and white roots, lies on the soil just beside, at the left edge of the frame. Only hands and forearms are "
     "visible." + END),
    # Clip 14 (mở đầu): gieo hạt vào khay ươm (cận tay)
    (23, f"{TT}-J0-gieo-hat.png", f"{TT}-B0-bop-khay.png",
     "Exactly the same close-up framing, light, garden bed and the same black plastic three-cell seedling tray as the "
     "reference, but BEFORE any plant exists: the three cells are filled with fresh moist dark seed-starting soil, "
     "flat, with no seedlings and no sprouts. A woman's bare hand (natural skin, short clean nails) holds a pinch of "
     "tiny round dark brown cauliflower seeds just above the left cell, about to drop them; her other hand cups a few "
     "more seeds in the open palm at the edge of the frame. Only hands and forearms are visible." + END),
    (24, f"{TT}-J1-gieo-xong.png", f"{TT}-J0-gieo-hat.png",
     "Exactly the same close-up framing, light, tray and hands as the reference. Only change: the seeds have been sown "
     "and all three cells are now covered with a thin smooth layer of moist soil; one fingertip gently presses the "
     "soil of the right cell. No seeds visible on top, no sprouts." + END),
    # Clip 15: nảy mầm tua nhanh (không người)
    (25, f"{TT}-N0-dat-uom.png", f"{TT}-J1-gieo-xong.png",
     "Exactly the same close-up framing, light and tray as the reference. Only change: no hands, no person. The three "
     "cells show smooth moist dark soil, nothing growing yet, a few tiny water droplets on the soil." + END),
    (26, f"{TT}-N1-mam.png", f"{TT}-N0-dat-uom.png",
     "Exactly the same close-up framing, light and tray as the reference, no hands. Only change: in the centre of each "
     "of the three cells exactly one tiny young sprout has just emerged from the soil: a short purple-tinged stem and "
     "two small rounded heart-shaped green seed leaves, a few soil crumbs lifted around it. Exactly three sprouts, "
     "one per cell." + END),
]

BASE = ("Real backyard gardening video, vertical 9:16, photorealistic, not animated, no text, no logos. One continuous "
        "fixed shot: same framing as the start frame, no zoom, no pan, no cuts, no scene changes. The video must start "
        "exactly like the start-frame image and end exactly like the end-frame image. The garden bed, background and "
        "light stay exactly as in the start frame. Only this one woman is ever in the scene; no other person appears. "
        "The young woman from the reference (light brown hair in a bun, small gold earrings, woodland camouflage short "
        "bib overalls, orange sleeveless V-neck tank top, bare hands): ")
TAIL = (" There are always exactly three plants in one row. She works at a natural, steady pace and never stands idle "
        "or sways while holding an item; nothing appears, vanishes or changes by itself.")
CLOSE_V = ("Real backyard gardening video, vertical 9:16, photorealistic, no text, no logos. One continuous fixed close-up "
           "shot, same framing as the start frame, no zoom, no cuts. The video must start exactly like the start-frame "
           "image and end exactly like the end-frame image. Only one person's hands. ")
STILL_V = ("Real video, vertical 9:16, photorealistic, no text, no logos. Static camera, exactly the start frame. No "
           "person, no hands. Soft early-morning daylight; the leaves stir very slightly in a faint breeze. The plants "
           "do not grow, no leaf or head appears, vanishes, moves or changes.")
PUSH = ("Real video, vertical 9:16, photorealistic, no text, no logos. It must start exactly like the start-frame image. "
        "No person, no hands. One very slow, smooth cinematic push-in toward the purple cauliflower head, keeping it "
        "centred and in sharp focus; a water droplet glints. The head, every floret and every leaf stay exactly in "
        "place and never change shape or color; nothing appears or vanishes.")
NHAC = "Nhạc acoustic nhẹ không lời"

# (stt, doan, khung_dau, khung_cuoi, prompt, am_thanh, dung_giay, che_do, cat_den, chuyen_canh)
VID = [
    (1, "Bóp khay, cây con ra", f"{TT}-B0-bop-khay.png", f"{TT}-B1-cay-ra.png",
     CLOSE_V + "Her fingers squeeze the bottom of the left cell and the seedling pops up with its whole soil plug; her "
     "other hand takes it by the leaves, as in the end frame. The other two seedlings stay in their cells.",
     NHAC + " bắt đầu, tiếng khay nhựa.", 2, "cat", "", ""),
    (2, "Trồng, ấn đất", f"{TT}-C0-dat-cay.png", f"{TT}-C1-an-dat.png",
     CLOSE_V + "The hands set the seedling into the hole, fill in soil around the plug and press it firmly around the "
     "stem, as in the end frame. The seedling keeps the same leaves.",
     NHAC + ", tiếng đất.", 2.5, "tang_toc", "", "mo"),
    (3, "Rải rơm", f"{TT}-D0-rai-rom.png", f"{TT}-D1-rom-xong.png",
     BASE + "lays handfuls of golden straw around the middle seedling, then the right one, as in the end frame. Straw "
     "appears only where her hands lay it; the seedlings never move." + TAIL,
     NHAC + ", tiếng rơm sột soạt.", 2, "tang_toc", "", "mo"),
    (4, "Tưới gốc", f"{TT}-H0-tuoi.png", f"{TT}-H1-tuoi-xong.png",
     BASE + "pours a gentle stream of water from the small green watering can at the base of each seedling in turn, "
     "left to right, the straw darkening only where the water falls, as in the end frame. Nothing grows." + TAIL,
     NHAC + ", tiếng nước tưới.", 1.5, "tang_toc", "", "mo"),
    (5, "Weeks later - cây lớn", f"{TT}-M2-cay-lon.png", "", STILL_V, NHAC + ".", 2, "cat", "", "cat"),
    (6, "Vạch lá thấy nụ", f"{TT}-K0-vach-la.png", f"{TT}-K1-thay-nu.png",
     CLOSE_V + "Both hands gently part the two inner leaves, revealing the small egg-sized purple cauliflower head in "
     "the centre, as in the end frame. The head is already there under the leaves; it does not grow or change color.",
     NHAC + ", tiếng lá.", 2.5, "cat", "", "mo"),
    (7, "Rắc phân hữu cơ", f"{TT}-F0-rac-phan.png", f"{TT}-F1-rac-xong.png",
     CLOSE_V + "The hand sprinkles the brown granules in a ring on the straw around the stem, moving round from left to "
     "right, as in the end frame. Granules appear only where they fall from the hand.",
     NHAC + ".", 2, "tang_toc", "", "mo"),
    (8, "Weeks later - bông lớn", f"{TT}-S1-bong-vua.png", "", STILL_V, NHAC + ".", 2, "cat", "", "cat"),
    (9, "Cắt bông", f"{TT}-R0-cat-bong.png", f"{TT}-R1-cat-xong.png",
     CLOSE_V + "The knife cuts through the thick stem below the head in one steady stroke, then the hand lifts the head "
     "a little, as in the end frame. The purple head keeps exactly its size, shape and florets; nothing appears.",
     NHAC + ", tiếng dao cắt cuống giòn.", 3, "cat", "", "mo"),
    (10, "Đặt vào rổ", f"{TT}-Q0-nhac-bong.png", f"{TT}-Q1-trong-ro.png",
     CLOSE_V + "The hands lower the purple cauliflower head into the wicker basket and let go, as in the end frame. The "
     "head keeps its size, shape and color.",
     NHAC + ".", 2.5, "cat", "", "mo"),
    (11, "Rổ bông, đứng dậy", f"{TT}-W0-phui-tay.png", f"{TT}-W1-dung-day.png",
     "Real backyard gardening video, vertical 9:16, photorealistic, no text, no logos. One continuous fixed shot, same "
     "framing as the start frame, no zoom, no cuts. The video must start exactly like the start-frame image and end "
     "exactly like the end-frame image. Only this one woman. She brushes the soil off her hands once, stands up and "
     "steps out of the frame to the right, as in the end frame. The basket, the cut head and the growing plant never "
     "move or change.",
     NHAC + ".", 3, "cat", "", "mo"),
    (12, "Thành phẩm", G, "", PUSH, NHAC + " kết.", 5, "cat", "5", "mo_dai"),
    (13, "Đào hố, đặt cây con", f"{TT}-E0-dao-ho.png", f"{TT}-C0-dat-cay.png",
     CLOSE_V + "The hand digs a small planting hole with the trowel, lifting out two scoops of soil, sets the trowel "
     "aside, then both hands pick up the seedling by its soil plug and lower it into the hole, as in the end frame. "
     "The seedling keeps the same leaves; nothing appears by itself.",
     NHAC + ", tiếng xẻng xúc đất.", 2.5, "tang_toc", "", "cat"),
    (14, "Gieo hạt", f"{TT}-J0-gieo-hat.png", f"{TT}-J1-gieo-xong.png",
     CLOSE_V + "The fingers drop two tiny seeds into each cell in turn, left to right, then sprinkle a thin layer of "
     "soil over them and press it lightly with a fingertip, as in the end frame. The tray never moves; nothing grows.",
     NHAC + " bắt đầu, tiếng hạt rơi.", 3, "tang_toc", "", ""),
    (15, "Nảy mầm", f"{TT}-N0-dat-uom.png", f"{TT}-N1-mam.png",
     "Real time-lapse video, vertical 9:16, photorealistic, no text, no logos. Static camera, exactly the start frame, "
     "no person, no hands. Time-lapse of germination: in each of the three cells one sprout slowly pushes up through "
     "the soil, a curved purple stem straightens and two small rounded seed leaves unfold, ending exactly like the "
     "end-frame image. Exactly one sprout per cell; nothing else appears; the tray and light stay the same.",
     NHAC + ".", 2.5, "tang_toc", "", "cat"),
]
KHONG_THAM_CHIEU = {1, 2, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15}   # cận/không người: không gửi ảnh A


def main():
    os.makedirs(os.path.join(D, "anh"), exist_ok=True)
    os.makedirs(os.path.join(D, "video"), exist_ok=True)
    co_ref = os.path.exists(os.path.join(D, "anh", REF))
    with open(os.path.join(D, "gen-anh.csv"), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["stt", "ten_file", "ty_le", "gui_kem", "prompt"])
        for s, t, g, pr in ANH:
            if s == 1 and co_ref:
                g = REF
                pr = pr.replace("Photorealistic vertical 9:16 photo, real backyard garden,",
                                "Photorealistic vertical 9:16 photo. Recreate the cauliflower plant in the reference "
                                "image exactly (same head, leaves, droplets, light, background),")
            w.writerow([s, t, "9:16", g, pr])
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
    print(f"{len(ANH)} images, {len(VID)} clips, ref={'co' if co_ref else 'khong'}")


if __name__ == "__main__":
    main()
