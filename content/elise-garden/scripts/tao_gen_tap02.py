"""Sinh gen-anh.csv + gen-video.csv cho Elise Garden tập 02 (chậu dâu tây).

Chạy: python -X utf8 tao_gen_tap02.py [--ghi-de]
Ảnh G (eg2-G-thanh-pham.png) đã được chủ dự án chốt 2026-11-06; gpt_anh.py bỏ qua ảnh đã có.
Cột cắt sửa ở ghep-v2.csv, không ở đây.
"""
import argparse
import csv
import os
import re

TAP = "ep02-strawberry-pot"
TT = "eg2"
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", TAP)

A = f"{TT}-A-elise-truoc.png"
G = f"{TT}-G-thanh-pham.png"
REF = f"{TT}-ref-san-pham.png"

POT = ("a round matte terracotta pot in warm orange-brown clay, walls gently tapering toward the base, plain rim with no "
       "thick lip, about 28 cm wide")
PLANT_G = (
    "a dense, evenly rounded mound of fresh green trifoliate strawberry leaves with serrated edges and clear veins above "
    "the pot; about 25 to 30 glossy ripe red strawberries with tiny yellow seeds and green calyxes hang on long thin stems "
    "all around the rim and drape down over the outside of the pot, mixed with 6 to 8 smaller pale green and white unripe "
    "berries; one white five-petal strawberry flower with a yellow center near the top middle, next to one small green bud"
)
ROOM = ("light natural wood tabletop, soft blurred cream-white wall with a sheer cream curtain on the left, gentle diffused "
        "daylight from the left, calm cozy home corner near a window, exactly as in the finished-product reference")
SHAPE = ("The terracotta pot has exactly the shape, color, proportions and size of the pot in the finished-product "
         f"reference ({POT}). ")
WIDE = ("Photorealistic vertical 9:16 photo, real home gardening tutorial look, soft bright daylight. Medium shot, fixed "
        "camera straight-on at chest height, the woman visible from mid-thigh up behind the table, the pot in the "
        f"center of the table in the lower part of the frame. Setting: {ROOM}. ")
SAME = "Same room, table, curtain, light and pot position as the previous reference scene. "
CAM = ("Keep exactly the camera position, distance and framing of the SECOND reference: the pot and the woman have "
       "exactly the same size and position in the frame. ")
OUTFIT = ("light brown hair in a neat bun with a few loose strands, natural realistic skin texture with fine pores, no "
          "freckles, no airbrushing, small gold earrings, fine gold necklace, woodland camouflage short bib overalls over a "
          "vivid orange sleeveless V-neck tank top, bare arms, no backpack, no apron, modest wholesome family-friendly look")
GLOVES = "light sage-green cotton gardening gloves"
WOMAN_G = ("The same young woman from the first reference: " + OUTFIT + ", wearing " + GLOVES +
           ", standing upright behind the table, face visible")
END = " Real photo, no text, no logos, no watermark."
CLOSE = ("Photorealistic vertical 9:16 photo, soft bright daylight. Close-up, fixed camera, on the terracotta pot on the "
         "light wood table, cream curtain background softly blurred; only the woman's hands and forearms are visible. ")
STAGE = ("Photorealistic vertical 9:16 photo, no people, no hands. Exactly the same camera position, framing, pot, table, "
         "cream background and light as the finished-product reference. The pot keeps exactly its shape, size and "
         "position. ")
YOUNG = ("three young strawberry plants, each a small rosette of 5 to 6 trifoliate serrated leaves, planted in a triangle "
         "(two at the back, one at the front), each crown sitting exactly at the soil surface, not buried")

# (stt, ten_file, gui_kem, prompt)
ANH = [
    (1, G, REF,
     "Photorealistic vertical 9:16 photo. Recreate the strawberry pot in the reference image exactly. "
     f"The pot: {POT}, on a light natural wood tabletop. The plant: {PLANT_G}. Background: {ROOM}. "
     "Camera close: pot and plant fill about 90 percent of the frame width, centered. No people." + END),

    # Clip 1: xúc giá thể vào chậu (cận vừa, có người)
    (2, f"{TT}-C0-xuc-dat.png", f"{A}; {G}",
     WIDE + SHAPE + "The pot is EMPTY of plants, filled only in its bottom third with dark moist potting mix. On the "
     "table to the right: an open brown paper bag of dark potting mix; to the left: three young strawberry plants in "
     "small black plastic nursery pots and a small green watering can. " + WOMAN_G + ", holding a small metal hand trowel "
     "full of potting mix, tipping it into the pot." + END),
    (3, f"{TT}-C1-dat-day.png", f"{A}; {TT}-C0-xuc-dat.png; {G}",
     WIDE + SAME + CAM + SHAPE + "The pot is now filled with dark potting mix up to about 3 cm below the rim; the paper "
     "bag, the three black nursery pots and the watering can are in the same places. " + WOMAN_G + ", tipping one last "
     "trowel of potting mix into the pot." + END),

    # Clip 2: rút cây con khỏi bầu (cận tay)
    (4, f"{TT}-D0-bop-bau.png", f"{TT}-C1-dat-day.png; {G}",
     CLOSE + "Above the pot full of potting mix, her gloved hands (" + GLOVES + ") hold one small black plastic nursery "
     "pot with a young strawberry plant, fingers squeezing the sides of the nursery pot." + END),
    (5, f"{TT}-D1-rut-ra.png", f"{TT}-D0-bop-bau.png; {G}",
     "Exactly the same close-up framing, light, pot and gloved hands as the first reference. Only change: the young "
     "strawberry plant has just slid out of the black nursery pot, held by its base; its root ball keeps the pot shape, "
     "intact, with white roots visible through the dark soil. The empty nursery pot is in her other hand." + END),

    # Clip 3: đặt cây thứ ba (cận vừa)
    (6, f"{TT}-E0-dat-cay.png", f"{A}; {TT}-C1-dat-day.png; {G}",
     WIDE + SAME + CAM + SHAPE + "Two young strawberry plants are already planted at the back left and back right of the "
     "pot, crowns at the soil surface. Two empty black nursery pots stand on the table to the left. " + WOMAN_G +
     ", lowering the third young strawberry plant with its intact root ball toward the front of the pot." + END),
    (7, f"{TT}-E1-du-ba-cay.png", f"{A}; {TT}-E0-dat-cay.png; {G}",
     WIDE + SAME + CAM + SHAPE + f"The pot now holds {YOUNG}. Three empty black nursery pots on the table to the left. "
     + WOMAN_G + ", both gloved hands still settling the front plant into the soil." + END),

    # Clip 4: nén đất quanh gốc (cận tay)
    (8, f"{TT}-F0-nen-goc.png", f"{TT}-E1-du-ba-cay.png; {G}",
     CLOSE + f"Looking slightly down into the pot: {YOUNG}. Her gloved fingers (" + GLOVES + ") press the potting mix "
     "around the crown of the left back plant." + END),
    (9, f"{TT}-F1-nen-xong.png", f"{TT}-F0-nen-goc.png; {G}",
     "Exactly the same close-up framing, light, pot, plants and gloved hands as the first reference. Only change: her "
     "fingers now press the soil around the front plant; the soil around all three plants is firmed and level, each "
     "crown still sitting exactly at the soil surface." + END),

    # Clip 5: tưới (cận vừa)
    (10, f"{TT}-H0-tuoi.png", f"{A}; {TT}-E1-du-ba-cay.png; {G}",
     WIDE + SAME + CAM + SHAPE + f"The pot holds {YOUNG}, soil firmed. " + WOMAN_G + ", tilting the small green watering "
     "can so a gentle stream of water falls on the soil at the base of the back left plant." + END),
    (11, f"{TT}-H1-tuoi-xong.png", f"{A}; {TT}-H0-tuoi.png; {G}",
     WIDE + SAME + CAM + SHAPE + f"The pot holds {YOUNG}; the soil surface is now darker and evenly moist all around. "
     + WOMAN_G + ", still pouring a gentle stream of water at the base of the front plant." + END),

    # Clip 6: Weeks later - lá dày, có hoa (không người)
    (12, f"{TT}-S1-ra-hoa.png", f"{TT}-S3-qua-xanh.png; {G}",
     "Photorealistic vertical 9:16 photo, no people, no hands. Recreate the FIRST reference image exactly: same camera "
     "position, distance and framing, same terracotta pot (same shape, no thick rim band, same size and position), same "
     "table, cream background and light. Only change: there are NO strawberries at all yet. The leaf mound is a little smaller "
     "and lower, fresh green, and about 6 white five-petal strawberry flowers with yellow centers and a few green buds "
     "sit on short stems just above the rim, spread around the pot. A few thin flower stems arch over the rim." + END),

    # Clip 7: thụ phấn bằng cọ (cận tay, không găng)
    (13, f"{TT}-P0-cham-hoa.png", f"{TT}-S1-ra-hoa.png",
     "Photorealistic vertical 9:16 photo, soft bright daylight. Close-up, fixed camera, of the white strawberry flowers "
     "near the rim of the same terracotta pot, strawberry leaves around, cream background softly blurred. Two open white "
     "flowers with yellow centers side by side. A woman's bare hand (no gloves, natural skin, short clean nails) holds a "
     "small soft paintbrush with a wooden handle; its tip gently touches the yellow center of the left flower, a little "
     "yellow pollen on the bristles." + END),
    (14, f"{TT}-P1-cham-hoa-2.png", f"{TT}-P0-cham-hoa.png",
     "Exactly the same close-up framing, light, flowers, leaves and hand as the reference. Only change: the brush tip now "
     "gently touches the yellow center of the right flower." + END),

    # Clip 8: cắt ngó bò (cận tay)
    (15, f"{TT}-R0-ngo-bo.png", f"{TT}-S1-ra-hoa.png",
     "Photorealistic vertical 9:16 photo, soft bright daylight. Close-up, fixed camera, of the rim of the same terracotta "
     "pot with strawberry leaves and white flowers, cream background softly blurred. One long thin reddish strawberry "
     "runner grows out from the leaves and hangs over the rim, a tiny baby plantlet at its tip. A woman's bare hand holds "
     "small garden snips with green handles, the open blades around the runner near where it leaves the plant." + END),
    (16, f"{TT}-R1-cat-ngo.png", f"{TT}-R0-ngo-bo.png",
     "Exactly the same close-up framing, light, pot, leaves, flowers, runner and hand as the reference. Only change: the "
     "snip blades are closed on the runner, cutting it near the plant." + END),

    # Clip 9: Days later - quả xanh vừa đậu (cận, không người)
    (17, f"{TT}-S2-qua-non.png", f"{TT}-P0-cham-hoa.png; {TT}-S1-ra-hoa.png",
     "Photorealistic vertical 9:16 photo, no people, no hands. Exactly the same close-up framing, leaves and light as the "
     "first reference. Only change: the two flowers have dropped their white petals; at each center a tiny pale green "
     "strawberry has formed, about the size of a pea, with its green calyx. A few white petals lie on the soil." + END),

    # Clip 10: Weeks later - quả lớn còn xanh (không người)
    (18, f"{TT}-S3-qua-xanh.png", G,
     STAGE + "Same leaf mound, same stems and same berry positions as the reference. Only change: every strawberry is "
     "still unripe, pale green or greenish white, slightly smaller, hanging in exactly the same places over the rim. The "
     "white flower and bud are unchanged." + END),

    # Clip 11: Ripening - quả đang chín (không người)
    (19, f"{TT}-S4-dang-chin.png", f"{G}; {TT}-S3-qua-xanh.png",
     STAGE + "Same leaf mound, same stems and same berry positions as the first reference. Only change: the ripening "
     "is halfway: about half of the strawberries are already red, others are pink, blush or white with green tips, a few "
     "still pale green; each berry stays exactly in its place." + END),

    # Clip 12: hái một quả (cận tay)
    (20, f"{TT}-K0-hai-qua.png", G,
     "Photorealistic vertical 9:16 photo, soft bright daylight. Close-up, fixed camera, on the front rim of the same "
     "strawberry pot from the reference, ripe red strawberries hanging over the rim, leaves above, cream background "
     "softly blurred. A woman's bare hand (no gloves) pinches the green stem of one ripe red strawberry just above its "
     "calyx with thumb and forefinger." + END),
    (21, f"{TT}-K1-hai-xong.png", f"{TT}-K0-hai-qua.png",
     "Exactly the same close-up framing, light, pot, leaves and the other strawberries as the reference. Only change: "
     "the picked strawberry with a short piece of green stem is now lifted a little away from the plant in her fingers; "
     "all other strawberries stay exactly in place." + END),

    # Đoạn gieo hạt mở đầu (chủ dự án duyệt 2026-11-06): tách hạt -> gieo vào 3 bầu -> phun sương -> mầm -> cây con
    (22, f"{TT}-Q0-tach-hat.png", G,
     "Photorealistic vertical 9:16 photo, soft bright daylight. Close-up, fixed camera, on the same light natural wood "
     "tabletop with the soft blurred cream curtain background as the reference. A small white saucer holds one ripe red "
     "strawberry; a folded white paper towel lies beside it with three tiny yellow strawberry seeds on it. A woman's bare "
     "hands (no gloves, natural skin, short clean nails): one hand steadies the strawberry, the other holds a wooden "
     "toothpick whose tip lifts one tiny yellow seed off the strawberry skin." + END),
    (23, f"{TT}-Q1-tach-hat-2.png", f"{TT}-Q0-tach-hat.png",
     "Exactly the same close-up framing, light, saucer, strawberry, paper towel and hands as the reference. Only change: "
     "about ten tiny yellow seeds now lie on the paper towel, and the toothpick tip lifts another seed off the strawberry; "
     "a few small bare spots show on the strawberry skin where seeds were removed." + END),
    (24, f"{TT}-V0-gieo-hat.png", f"{TT}-Q1-tach-hat-2.png; {TT}-C0-xuc-dat.png",
     "Photorealistic vertical 9:16 photo, soft bright daylight. Close-up, fixed camera, on the same light wood tabletop "
     "and cream background as the first reference. Three small black plastic nursery pots, exactly like the black pots "
     "in the second reference, stand side by side in a row, each filled with dark moist potting mix, nothing growing. "
     "The folded paper towel with tiny yellow seeds lies at the left. A woman's bare hand holds the wooden toothpick and "
     "places one tiny yellow seed on the soil surface of the left pot, where two seeds already lie." + END),
    (25, f"{TT}-V1-gieo-xong.png", f"{TT}-V0-gieo-hat.png",
     "Exactly the same close-up framing, light, three black pots, soil, paper towel and hand as the reference. Only "
     "change: three tiny yellow seeds now lie on the soil of each pot, and the toothpick places the last seed on the "
     "right pot." + END),
    (26, f"{TT}-W0-phun.png", f"{TT}-V1-gieo-xong.png",
     "Exactly the same close-up framing, light, three black pots with their tiny seeds on the soil, and paper towel as "
     "the reference. Only change: the toothpick is gone; the woman's bare hand holds a small white trigger spray bottle "
     "above the pots, a fine mist falling on the left pot." + END),
    (27, f"{TT}-W1-phun-xong.png", f"{TT}-W0-phun.png",
     "Recreate the reference image exactly: same camera position, distance and close-up framing (the three black pots "
     "have exactly the same size and position in the frame, the paper towel in the same place), same light, pots, spray "
     "bottle and hand. Do not zoom out. Only change: the hand and spray bottle have moved to the right, the fine mist now "
     "falls on the right pot, and the soil surface in all three pots is darker and evenly damp." + END),
    (28, f"{TT}-M1-nay-mam.png", f"{TT}-W1-phun-xong.png",
     "Photorealistic vertical 9:16 photo, no people, no hands, no spray bottle. Exactly the same close-up framing, light, "
     "table, background and three black nursery pots as the reference; the paper towel is gone. Only change: in each pot "
     "two or three tiny strawberry seedlings have sprouted, each with two small round pale green seed leaves on a thin "
     "stem, just above the soil." + END),
    (29, f"{TT}-M2-cay-con.png", f"{TT}-M1-nay-mam.png; {TT}-C0-xuc-dat.png",
     "Photorealistic vertical 9:16 photo, no people, no hands. Exactly the same close-up framing, light, table, background "
     "and three black nursery pots as the first reference. Only change: each pot now holds exactly one young strawberry "
     "plant (the others thinned out), a small rosette of 4 to 6 serrated trifoliate leaves, exactly like the young plants "
     "in the black pots of the second reference." + END),

    # Trồng cây đầu tiên (sửa lỗi nhảy từ 1 cây rút ra sang 2 cây đã trồng, chủ dự án 2026-11-06)
    (30, f"{TT}-E-a0-cay-dau.png", f"{A}; {TT}-C1-dat-day.png; {TT}-E0-dat-cay.png",
     WIDE + SAME + CAM + SHAPE + "The pot is filled with dark potting mix and has NO plants yet. On the table to the "
     "left: one empty black nursery pot and two black nursery pots that still hold young strawberry plants; the small "
     "green watering can and the paper bag in the same places. " + WOMAN_G + ", lowering one young strawberry plant with "
     "its intact root ball into the LEFT side of the pot, near the left rim, exactly where the left plant stands in the "
     "third reference; the center and right side of the soil stay bare." + END),
    (31, f"{TT}-E-a1-cay-dau-xong.png", f"{A}; {TT}-E-a0-cay-dau.png; {TT}-E0-dat-cay.png",
     WIDE + SAME + CAM + SHAPE + "Exactly one young strawberry plant is now planted at the LEFT side of the pot near the "
     "left rim, exactly where the left plant stands in the third reference, its crown at the soil surface; the center "
     "and right side of the soil are bare. The same one empty and two full black nursery pots on the "
     "table to the left. " + WOMAN_G + ", both gloved hands still pressing the soil around the base of that one plant."
     + END),
]

BASE = ("Real home gardening video, vertical 9:16, photorealistic, not animated, no text, no logos. One continuous fixed "
        "shot: same framing as the start frame, no zoom, no pan, no cuts, no scene changes. The video must start exactly "
        "like the start-frame image and end exactly like the end-frame image. The cozy cream room and wood table stay "
        "exactly as in the start frame. Only this one woman is ever in the scene; no other person appears. The young "
        "woman from the reference (light brown hair in a bun, small gold earrings, woodland camouflage short bib "
        "overalls, orange sleeveless V-neck tank top, " + GLOVES + "): ")
TAIL = (" The terracotta pot keeps exactly its shape, size and position. She works at a natural, steady pace and never "
        "stands idle or sways while holding an item; nothing appears, vanishes or changes by itself.")
CLOSE_V = ("Real home gardening video, vertical 9:16, photorealistic, no text, no logos. One continuous fixed close-up "
           "shot, same framing as the start frame, no zoom, no cuts. The video must start exactly like the start-frame "
           "image and end exactly like the end-frame image. Only one pair of hands. ")
STILL_V = ("Real video, vertical 9:16, photorealistic, no text, no logos. Static camera, exactly the start frame. No "
           "person, no hands. Soft natural light; the leaves stir very slightly in a faint breeze. The plant does not "
           "grow, no fruit or flower appears, vanishes, moves or changes color.")
ORBIT = ("Real video, vertical 9:16, photorealistic, no text, no logos. It must start exactly like the start-frame image. "
         "No person. One very slow, smooth cinematic camera move around the strawberry pot at the same height, about 30 "
         "degrees to the right, keeping it centered and in sharp focus. Every strawberry, leaf and the flower stay exactly "
         "in place and never change; nothing appears or vanishes.")
NHAC = "Nhạc acoustic nhẹ không lời"

# (stt, doan, khung_dau, khung_cuoi, prompt, am_thanh, dung_giay, che_do, cat_den, chuyen_canh)
VID = [
    (1, "Xúc giá thể vào chậu", f"{TT}-C0-xuc-dat.png", f"{TT}-C1-dat-day.png",
     BASE + "scoops dark potting mix from the paper bag with the hand trowel and tips it into the terracotta pot, scoop "
     "after scoop, until the pot is filled to about 3 cm below the rim, as in the end frame. The soil level rises only "
     "where she pours it." + TAIL,
     NHAC + " bắt đầu, tiếng đất đổ.", 2.5, "tang_toc", "", ""),
    (2, "Rút cây con khỏi bầu", f"{TT}-D0-bop-bau.png", f"{TT}-D1-rut-ra.png",
     CLOSE_V + "Her gloved fingers squeeze the sides of the small black nursery pot, then she gently slides the young "
     "strawberry plant out by its base; the root ball comes out whole, keeping the pot shape, white roots visible, as in "
     "the end frame. The plant keeps the same leaves.",
     NHAC + ", tiếng bầu nhựa sột soạt.", 2.5, "cat", "", "mo"),
    (3, "Đặt cây thứ ba", f"{TT}-E0-dat-cay.png", f"{TT}-E1-du-ba-cay.png",
     BASE + "lowers the third young strawberry plant with its root ball into the front of the pot and settles it so the "
     "crown sits at the soil surface, as in the end frame. The two plants already at the back never move or change; "
     "there are exactly three plants." + TAIL,
     NHAC + ", tiếng đất.", 3, "tang_toc", "", "mo"),
    (4, "Nén đất quanh gốc", f"{TT}-F0-nen-goc.png", f"{TT}-F1-nen-xong.png",
     CLOSE_V + "Her gloved fingers press and firm the potting mix around each of the three young strawberry plants, one "
     "after another, from the back left plant to the front plant, as in the end frame. The crowns stay at the soil "
     "surface, never buried; there are always exactly three plants and their leaves do not change.",
     NHAC + ", tiếng nén đất.", 2, "cat", "", "mo"),
    (5, "Tưới quanh gốc", f"{TT}-H0-tuoi.png", f"{TT}-H1-tuoi-xong.png",
     BASE + "pours a gentle stream of water from the small green watering can onto the soil around the base of each of "
     "the three plants in turn, the soil darkening only where the water falls, as in the end frame. The plants stay "
     "upright and do not grow." + TAIL,
     NHAC + ", tiếng nước tưới.", 2, "cat", "", "mo"),
    (6, "Weeks later - lá dày, ra hoa", f"{TT}-S1-ra-hoa.png", "", STILL_V,
     NHAC + ".", 2, "cat", "", "cat"),
    (7, "Thụ phấn bằng cọ", f"{TT}-P0-cham-hoa.png", f"{TT}-P1-cham-hoa-2.png",
     CLOSE_V + "Her bare hand dabs the small soft paintbrush gently around the yellow center of the left flower, then "
     "moves it to the right flower and dabs its yellow center, as in the end frame. The flowers stay open and in place; "
     "no new flower appears.",
     NHAC + ".", 3, "cat", "", "cat"),
    (8, "Cắt ngó bò", f"{TT}-R0-ngo-bo.png", f"{TT}-R1-cat-ngo.png",
     CLOSE_V + "Her bare hand closes the small garden snips on the long thin runner near the plant and cuts it, as in "
     "the end frame. Only the runner is cut; the leaves and flowers stay exactly in place.",
     NHAC + ", tiếng kéo cắt.", 2, "cat", "", "mo"),
    (9, "Days later - quả non", f"{TT}-S2-qua-non.png", "", STILL_V,
     NHAC + ".", 2, "cat", "", "cat"),
    (10, "Weeks later - quả xanh", f"{TT}-S3-qua-xanh.png", "", STILL_V,
     NHAC + ".", 2, "cat", "", "cat"),
    (11, "Ripening - quả đang chín", f"{TT}-S4-dang-chin.png", "", STILL_V,
     NHAC + ".", 2.5, "cat", "", "cat"),
    (12, "Hái một quả", f"{TT}-K0-hai-qua.png", f"{TT}-K1-hai-xong.png",
     CLOSE_V + "Her bare fingers snap the green stem of the ripe red strawberry just above the calyx and lift the picked "
     "berry a little away from the plant, as in the end frame. All other strawberries stay exactly in place, none "
     "appears or vanishes.",
     NHAC + ", tiếng cuống gãy nhẹ.", 3, "cat", "", "cat"),
    (13, "Thành phẩm", G, "", ORBIT,
     NHAC + " kết.", 5, "cat", "5", "mo_dai"),
    # Đoạn gieo hạt: đứng trước clip 1 trong ghep-v2.csv
    (14, "Tách hạt dâu", f"{TT}-Q0-tach-hat.png", f"{TT}-Q1-tach-hat-2.png",
     CLOSE_V + "Her bare fingers steady the strawberry while the wooden toothpick lifts tiny yellow seeds off its skin one "
     "at a time and sets each on the paper towel, as in the end frame. Each seed on the towel arrives only from the "
     "toothpick; the strawberry keeps its shape.",
     NHAC + " bắt đầu.", 2, "cat", "", ""),
    (15, "Gieo hạt vào 3 bầu", f"{TT}-V0-gieo-hat.png", f"{TT}-V1-gieo-xong.png",
     CLOSE_V + "The wooden toothpick places tiny yellow seeds one at a time on the soil of the three black nursery pots, "
     "from the left pot to the right pot, as in the end frame. Each seed appears only where the toothpick sets it; the "
     "pots never move. Nothing grows.",
     NHAC + ".", 2.5, "tang_toc", "", "mo"),
    (16, "Phun sương", f"{TT}-W0-phun.png", f"{TT}-W1-phun-xong.png",
     CLOSE_V + "Her hand squeezes the small white spray bottle, a fine mist falling on each pot from left to right, the "
     "soil darkening only where the mist lands, as in the end frame. The seeds stay in place; nothing grows.",
     NHAC + ", tiếng bình phun.", 1.5, "cat", "", "mo"),
    (17, "Days later - nảy mầm", f"{TT}-M1-nay-mam.png", "", STILL_V,
     NHAC + ".", 1.5, "cat", "", "cat"),
    (18, "Weeks later - cây con", f"{TT}-M2-cay-con.png", "", STILL_V,
     NHAC + ".", 2, "cat", "", "cat"),
    # Trồng cây đầu tiên: đứng giữa clip 2 và clip 3 trong ghep-v2.csv
    (19, "Trồng cây đầu tiên", f"{TT}-E-a0-cay-dau.png", f"{TT}-E-a1-cay-dau-xong.png",
     BASE + "lowers the young strawberry plant with its root ball into the left side of the empty pot near the rim and settles it so "
     "the crown sits at the soil surface, as in the end frame. There is exactly ONE plant in the pot the whole clip; the "
     "black nursery pots on the table never move." + TAIL,
     NHAC + ", tiếng đất.", 2.5, "cat", "", "mo"),
]
KHONG_THAM_CHIEU = {2, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18}   # cảnh cận hoặc không người: không gửi ảnh A


def kiem_tra(ghi_de):
    loi = []
    for s, t, g, pr in ANH:
        if re.search(r"<[^>]+>", pr):
            loi.append(f"anh {s} ({t}): con cho <...> chua dien")
    for ten in ("gen-video.csv",):
        if os.path.exists(os.path.join(D, ten)) and not ghi_de:
            loi.append(f"{ten} da ton tai (them --ghi-de neu chac chan)")
    if loi:
        raise SystemExit("DUNG:\n  " + "\n  ".join(loi))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ghi-de", action="store_true", help="cho phep ghi de CSV da co")
    kiem_tra(ap.parse_args().ghi_de)
    os.makedirs(os.path.join(D, "anh"), exist_ok=True)
    os.makedirs(os.path.join(D, "video"), exist_ok=True)
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
