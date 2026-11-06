"""Sinh gen-anh.csv + gen-video.csv cho Elise Garden tập 03 (giàn dưa leo chữ A).

Chạy: python -X utf8 tao_gen_tap03.py
Ảnh G (eg3-G-thanh-pham.png) chủ dự án chốt 2026-11-06; gpt_anh.py bỏ qua ảnh đã có.
Cột cắt sửa ở ghep-v2.csv, không ở đây. Luôn đúng 4 gốc cây dọc luống.
"""
import csv
import os

TAP = "ep03-cucumber-trellis"
TT = "eg3"
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", TAP)

A = f"{TT}-A-elise-truoc.png"
G = f"{TT}-G-thanh-pham.png"
REF = f"{TT}-ref-san-pham.png"
END = " Real photo, no text, no logos, no watermark."

TRELLIS = (
    "a rustic A-frame trellis made of rough unpeeled wooden branch poles: on each side two poles lean in and cross "
    "near the top, one long rough wooden crossbar rests across the crossings and is lashed with natural jute twine; "
    "several vertical jute strings hang from the crossbar down to the plants"
)
PLANT = (
    "lush green cucumber vines cover the trellis, large heart-shaped serrated leaves with clear veins, curling tendrils "
    "wrapped around the strings and poles, many small bright yellow five-petal cucumber flowers scattered through the "
    "vines; about 7 dark green cucumbers with bumpy, slightly spiny skin, each about 15 to 20 cm long, hang straight down "
    "in the middle of the trellis, a few with a small withered flower still at the tip"
)
ROOM = ("dark loose soil garden bed at the bottom, a pale weathered grey horizontal wooden plank fence behind, soft "
        "diffused daylight on a slightly overcast day, backyard vegetable garden")

OUTFIT = ("light brown hair in a neat bun with a few loose strands, natural realistic skin texture with fine pores, no "
          "freckles, no airbrushing, small gold earrings, fine gold necklace, woodland camouflage short bib overalls over a "
          "vivid orange sleeveless V-neck tank top, white sneakers, bare arms, no backpack, no apron, no hat, modest "
          "wholesome family-friendly look")
GLOVES = "light sage-green cotton gardening gloves"
WOMAN_G = "The same young woman from the first reference: " + OUTFIT + ", wearing " + GLOVES + ", face visible"
BED = ("a long straight raised garden bed of dark loose soil runs horizontally across the lower part of the frame, the "
       "pale weathered grey horizontal wooden plank fence behind it, soft diffused overcast daylight; a bundle of rough "
       "unpeeled wooden branch poles and a roll of natural jute twine lean against the fence at the right")
FOUR = "exactly four planting spots evenly spaced in one straight row along the middle of the bed"
WIDE = ("Photorealistic vertical 9:16 photo, real backyard gardening look. Medium-wide shot, fixed camera straight-on "
        "at chest height; the woman stands behind the bed, visible from the knees up, the bed across the lower third of "
        f"the frame. Setting: {BED}. ")
SAME = "Same garden bed, fence, poles, light and camera framing as the previous reference scene. "
CAM = ("Keep exactly the camera position, distance and framing of the SECOND reference: the bed, the fence and the "
       "woman have exactly the same size and position in the frame. ")
CLOSE = ("Photorealistic vertical 9:16 photo, soft diffused overcast daylight. Close-up, fixed camera looking slightly "
         "down at the dark loose soil of the garden bed, the grey wooden plank fence softly blurred at the top. ")
STAGE = ("Photorealistic vertical 9:16 photo, no people, no hands. Exactly the same camera position, framing, trellis "
         "poles, crossbar, strings, fence, soil and light as the finished-product reference. ")

# (stt, ten_file, gui_kem, prompt)
ANH = [
    (1, G, REF,
     "Photorealistic vertical 9:16 photo. Recreate the cucumber trellis in the reference image exactly: same rustic "
     "A-frame poles, crossbar and twine, same vines, leaves, yellow flowers, same number, size and placement of the "
     f"cucumbers, same camera angle (straight-on at cucumber height), same light and background. The trellis: {TRELLIS}. "
     f"The plants: {PLANT}. Setting: {ROOM}. Camera CLOSE, exactly like the reference: the two leaning pole pairs stand "
     "at the left and right edges of the frame, only ONE horizontal crossbar is visible, crossing the upper third of the "
     "frame; the top of the A-frame is out of frame. The foliage is dense and lush and fills almost the whole frame, as "
     "in the reference; the cucumbers hang in the middle of the frame. Only a thin strip of dark soil shows at the very "
     "bottom between leaves, and the fence shows only in small gaps at the top. No people, no hands." + END),

    # Clip 1: ấn lỗ, thả 2 hạt (cận tay)
    (2, f"{TT}-B0-an-lo.png", f"{G}; {A}",
     CLOSE + "One gloved fingertip (" + GLOVES + ") presses a small hole into the soil; the other gloved hand holds "
     "a few flat oval creamy-white cucumber seeds in its palm. A small open paper seed packet lies on the soil at the "
     "edge of the frame. Only the hands and forearms are visible." + END),
    (3, f"{TT}-B1-tha-hat.png", f"{TT}-B0-an-lo.png",
     "Exactly the same close-up framing, light, soil, seed packet and gloved hands as the reference. Only change: two "
     "flat creamy-white cucumber seeds now lie inside the small hole, and the gloved fingers have just released them "
     "just above the hole." + END),

    # Clip 2: lấp đất dọc luống (cận vừa nhìn dọc luống)
    (4, f"{TT}-C0-lap-dat.png", f"{TT}-B1-tha-hat.png; {G}",
     "Photorealistic vertical 9:16 photo, soft diffused overcast daylight. Close-medium shot, fixed camera looking "
     f"down along the dark soil garden bed with the grey wooden plank fence behind: {FOUR}, each a small hole with two "
     "flat creamy-white seeds visible inside. A gloved hand (" + GLOVES + ") pushes soil over the first hole on the "
     "left. Only the hand and forearm are visible." + END),
    (5, f"{TT}-C1-lap-xong.png", f"{TT}-C0-lap-dat.png",
     "Exactly the same framing, light, bed, fence and gloved hand as the reference. Only change: all four holes are now "
     "covered with soil, no seeds visible, four small smooth mounds in the row; the gloved hand pats the soil over the "
     "fourth spot on the right." + END),

    # Clip 3: tưới (rộng, có người)
    (6, f"{TT}-H0-tuoi.png", f"{A}; {G}",
     WIDE + f"In the bed: {FOUR}, each a small smooth covered mound, nothing growing yet. " + WOMAN_G + ", standing "
     "upright behind the bed, holding a small green metal watering can and pouring a gentle stream of water on the "
     "leftmost mound." + END),
    (7, f"{TT}-H1-tuoi-xong.png", f"{A}; {TT}-H0-tuoi.png; {G}",
     WIDE + SAME + CAM + f"In the bed: {FOUR}; the soil along the row is now darker and evenly moist. " + WOMAN_G +
     ", still pouring a gentle stream of water on the rightmost mound." + END),

    # Clip 4: Days later - nảy mầm (cận, không người)
    (8, f"{TT}-M1-nay-mam.png", f"{TT}-C1-lap-xong.png",
     "Photorealistic vertical 9:16 photo, no people, no hands. Exactly the same framing, light, bed and fence as the "
     "reference. Only change: at each of the four spots in the row a cucumber seedling has sprouted, two large smooth "
     "oval pale-green seed leaves on a short thick stem just above the soil. Exactly four seedlings." + END),

    # Clip 5: Weeks later - cây con có ngọn leo (rộng, không người)
    (9, f"{TT}-M2-cay-con.png", f"{TT}-H1-tuoi-xong.png; {G}",
     "Photorealistic vertical 9:16 photo, no people, no hands, no watering can. Exactly the same camera position, "
     "framing, bed, fence, light and the bundle of poles and twine at the right as the first reference. Only change: "
     "at each of the four spots grows one young cucumber plant with four or five heart-shaped serrated true leaves and "
     "a short young vine tip with a small curling tendril starting to reach upward. Exactly four plants, evenly spaced "
     "in one row." + END),

    # Clip 6: cắm cọc chữ A (rộng, có người)
    (10, f"{TT}-D0-cam-coc.png", f"{A}; {TT}-M2-cay-con.png; {G}",
     WIDE + SAME + CAM + "The same four young cucumber plants in one row. At the left end of the row one rough unpeeled "
     "wooden pole already stands pushed into the soil, leaning to the right. " + WOMAN_G + ", pushing a second rough "
     "pole into the soil at the left end so it crosses the first one near the top, forming an A." + END),
    (11, f"{TT}-D1-cam-xong.png", f"{A}; {TT}-D0-cam-coc.png; {G}",
     WIDE + SAME + CAM + "The same four young cucumber plants in one row. A crossed A-pair of rough poles now stands at "
     "the left end of the row, and at the right end one pole already stands. " + WOMAN_G + ", pushing the last rough "
     "pole into the soil at the right end so it crosses the other one near the top, forming the second A." + END),

    # Clip 7: gác thanh ngang, quấn dây gai (rộng)
    (12, f"{TT}-E0-gac-thanh.png", f"{A}; {TT}-D1-cam-xong.png; {G}",
     WIDE + SAME + CAM + "The same four young cucumber plants; both crossed A-pairs of rough poles stand at the two "
     "ends of the row. " + WOMAN_G + ", lifting one long rough wooden crossbar and laying it into the crossing of the "
     "left A-pair." + END),
    (13, f"{TT}-E1-buoc-thanh.png", f"{A}; {TT}-E0-gac-thanh.png; {G}",
     WIDE + SAME + CAM + "The same four young cucumber plants; the long rough crossbar now rests across both A-pair "
     "crossings, the left crossing already lashed with a few neat turns of jute twine. " + WOMAN_G + ", wrapping jute "
     "twine around the right crossing to lash the crossbar." + END),

    # Clip 8: thả dây xuống từng gốc (rộng)
    (14, f"{TT}-F0-tha-day.png", f"{A}; {TT}-E1-buoc-thanh.png; {G}",
     WIDE + SAME + CAM + "The same A-frame with the lashed crossbar and the same four young cucumber plants. One jute "
     "string already hangs from the crossbar down to the leftmost plant. " + WOMAN_G + ", letting a second jute string "
     "drop from the crossbar down toward the second plant." + END),
    (15, f"{TT}-F1-tha-xong.png", f"{A}; {TT}-F0-tha-day.png; {G}",
     WIDE + SAME + CAM + "The same A-frame with the lashed crossbar; now four jute strings hang from the crossbar, one "
     "down to each of the four young cucumber plants, their lower ends tucked into the soil beside each plant. "
     + WOMAN_G + ", pressing the end of the fourth string into the soil beside the rightmost plant." + END),

    # Clip 9: quấn đọt vào dây (cận tay trần)
    (16, f"{TT}-K0-quan-dot.png", f"{TT}-F1-tha-xong.png",
     "Photorealistic vertical 9:16 photo, soft diffused overcast daylight. Close-up, fixed camera, of one young "
     "cucumber plant at the foot of a vertical jute string, a rough wooden pole and the grey fence softly blurred behind. "
     "A woman's bare hand (no gloves, natural skin, short clean nails) gently holds the soft young vine tip with its "
     "curling tendril next to the string." + END),
    (17, f"{TT}-K1-quan-xong.png", f"{TT}-K0-quan-dot.png",
     "Exactly the same close-up framing, light, plant, string and hand as the reference. Only change: the young vine tip "
     "is now wrapped once around the jute string, its tendril curled on the string, and the fingers are just letting "
     "go." + END),

    # Clip 10: Weeks later - leo nửa giàn, có hoa (không người, khung G)
    (18, f"{TT}-S1-ra-hoa.png", f"{TT}-S3-trai-lon.png; {G}",
     "Photorealistic vertical 9:16 photo, no people, no hands. Recreate the FIRST reference image exactly: same camera "
     "position, distance and close framing, the same pole pairs at the left and right edges, the same single crossbar "
     "in the upper third, same fence, soil and light. Only change: there are NO cucumbers yet. The vines have climbed about halfway up the "
     "strings and poles, the foliage is thinner, the upper part of the trellis and the crossbar are still mostly bare, "
     "and a few small bright yellow flowers are open on the vines." + END),

    # Clip 11: hoa cái có trái non (cận, không người)
    (19, f"{TT}-S2-trai-non.png", f"{TT}-S1-ra-hoa.png",
     "Photorealistic vertical 9:16 photo, no people, no hands. Close-up of one open bright yellow female cucumber "
     "flower on the vine next to a jute string, with a tiny spiny baby cucumber about 3 cm long behind the flower, "
     "heart-shaped leaves around, soft diffused overcast daylight, background softly blurred." + END),

    # Clip 12: Days later - trái lớn dần (không người, khung G)
    (20, f"{TT}-S3-trai-lon.png", G,
     STAGE + "Same vines, leaves, flowers and the same seven cucumber positions as the reference. Only change: every "
     "cucumber is about half the length, lighter green, with a yellow flower still at its tip, hanging in exactly the "
     "same places." + END),

    # Clip 13: cắt một trái (cận tay trần)
    (21, f"{TT}-R0-cat-trai.png", G,
     "Photorealistic vertical 9:16 photo, soft diffused overcast daylight. Close-up, fixed camera, on the cucumbers "
     "hanging in the trellis from the reference, heart-shaped leaves around, a woven wicker basket at the bottom edge of "
     "the frame. A woman's bare hand holds one dark green cucumber; her other hand holds small garden snips with green "
     "handles, the open blades around its short stem." + END),
    (22, f"{TT}-R1-cat-xong.png", f"{TT}-R0-cat-trai.png",
     "Exactly the same close-up framing, light, vines, leaves, basket and the other cucumbers as the reference. Only "
     "change: the stem is cut and her hand lowers the picked cucumber into the wicker basket; all other cucumbers stay "
     "exactly in place." + END),
]

BASE = ("Real backyard gardening video, vertical 9:16, photorealistic, not animated, no text, no logos. One continuous "
        "fixed shot: same framing as the start frame, no zoom, no pan, no cuts, no scene changes. The video must start "
        "exactly like the start-frame image and end exactly like the end-frame image. The garden bed, fence and light "
        "stay exactly as in the start frame. Only this one woman is ever in the scene; no other person appears. The "
        "young woman from the reference (light brown hair in a bun, small gold earrings, woodland camouflage short bib "
        "overalls, orange sleeveless V-neck tank top, " + GLOVES + "): ")
TAIL = (" There are always exactly four plants in one row. She works at a natural, steady pace and never stands idle or "
        "sways while holding an item; nothing appears, vanishes or changes by itself.")
CLOSE_V = ("Real backyard gardening video, vertical 9:16, photorealistic, no text, no logos. One continuous fixed close-up "
           "shot, same framing as the start frame, no zoom, no cuts. The video must start exactly like the start-frame "
           "image and end exactly like the end-frame image. Only one pair of hands. ")
STILL_V = ("Real video, vertical 9:16, photorealistic, no text, no logos. Static camera, exactly the start frame. No "
           "person, no hands. Soft overcast daylight; the leaves stir very slightly in a faint breeze. The plants do not "
           "grow, no leaf, vine, flower or cucumber appears, vanishes, moves or changes.")
ORBIT = ("Real video, vertical 9:16, photorealistic, no text, no logos. It must start exactly like the start-frame image. "
         "No person. One very slow, smooth cinematic camera move to the right at the same height, about 20 degrees, "
         "keeping the cucumbers centered and in sharp focus. Every cucumber, leaf, flower, pole and string stays exactly "
         "in place and never changes; nothing appears or vanishes.")
NHAC = "Nhạc acoustic nhẹ không lời"

# (stt, doan, khung_dau, khung_cuoi, prompt, am_thanh, dung_giay, che_do, cat_den, chuyen_canh)
VID = [
    (1, "Ấn lỗ, thả hạt", f"{TT}-B0-an-lo.png", f"{TT}-B1-tha-hat.png",
     CLOSE_V + "The gloved fingertip finishes pressing the small hole, then the other gloved hand drops exactly two flat "
     "creamy-white seeds into it, as in the end frame. The seeds appear only where the fingers release them.",
     NHAC + " bắt đầu, tiếng đất.", 2, "cat", "", ""),
    (2, "Lấp đất dọc luống", f"{TT}-C0-lap-dat.png", f"{TT}-C1-lap-xong.png",
     CLOSE_V + "The gloved hand pushes soil over each of the four seed holes in turn, from left to right, and pats each "
     "mound, as in the end frame. Exactly four holes; the soil moves only where the hand pushes it.",
     NHAC + ", tiếng đất.", 2, "tang_toc", "", "mo"),
    (3, "Tưới dọc luống", f"{TT}-H0-tuoi.png", f"{TT}-H1-tuoi-xong.png",
     BASE + "pours a gentle stream of water from the small green watering can on each of the four mounds in turn, left "
     "to right, the soil darkening only where the water falls, as in the end frame. Nothing grows." + TAIL,
     NHAC + ", tiếng nước tưới.", 1.5, "tang_toc", "", "mo"),
    (4, "Days later - nảy mầm", f"{TT}-M1-nay-mam.png", "", STILL_V, NHAC + ".", 1.5, "cat", "", "cat"),
    (5, "Weeks later - cây con", f"{TT}-M2-cay-con.png", "", STILL_V, NHAC + ".", 2, "cat", "", "cat"),
    (6, "Cắm cọc chữ A", f"{TT}-D0-cam-coc.png", f"{TT}-D1-cam-xong.png",
     BASE + "pushes rough wooden poles into the soil in crossed pairs, first finishing the A at the left end of the row, "
     "then the A at the right end, as in the end frame. Each pole appears only from her hands; the four plants never "
     "move." + TAIL,
     NHAC + ", tiếng cọc cắm đất.", 2.5, "tang_toc", "", "mo"),
    (7, "Gác thanh ngang, buộc dây", f"{TT}-E0-gac-thanh.png", f"{TT}-E1-buoc-thanh.png",
     BASE + "lays the long rough crossbar into the crossing of the left A-pair, rests its other end in the right "
     "crossing, then wraps jute twine around the crossing a few turns with her hands, as in the end frame. The twine "
     "turns appear only where she wraps them; the poles never move by themselves." + TAIL,
     NHAC + ", tiếng dây gai.", 2.5, "tang_toc", "", "mo"),
    (8, "Thả dây xuống gốc", f"{TT}-F0-tha-day.png", f"{TT}-F1-tha-xong.png",
     BASE + "lets jute strings drop from the crossbar, one down to each of the four plants in turn, and tucks each "
     "lower end into the soil beside the plant, as in the end frame. Each string appears only from her hands." + TAIL,
     NHAC + ".", 2, "tang_toc", "", "mo"),
    (9, "Quấn đọt vào dây", f"{TT}-K0-quan-dot.png", f"{TT}-K1-quan-xong.png",
     CLOSE_V + "Her bare fingers gently wrap the soft young vine tip once around the jute string and let go, as in the "
     "end frame. The plant keeps the same leaves; the vine does not grow.",
     NHAC + ".", 2.5, "cat", "", "mo"),
    (10, "Weeks later - leo nửa giàn, ra hoa", f"{TT}-S1-ra-hoa.png", "", STILL_V, NHAC + ".", 2, "cat", "", "cat"),
    (11, "Hoa cái có trái non", f"{TT}-S2-trai-non.png", "", STILL_V, NHAC + ".", 1.5, "cat", "", "cat"),
    (12, "Days later - trái lớn", f"{TT}-S3-trai-lon.png", "", STILL_V, NHAC + ".", 2, "cat", "", "cat"),
    (13, "Cắt một trái", f"{TT}-R0-cat-trai.png", f"{TT}-R1-cat-xong.png",
     CLOSE_V + "The garden snips close on the short stem of the cucumber she holds, then she lowers the picked cucumber "
     "into the wicker basket, as in the end frame. All other cucumbers stay exactly in place; none appears or vanishes.",
     NHAC + ", tiếng kéo cắt.", 3, "cat", "", "mo"),
    (14, "Thành phẩm", G, "", ORBIT, NHAC + " kết.", 5, "cat", "5", "mo_dai"),
]
KHONG_THAM_CHIEU = {1, 2, 4, 5, 9, 10, 11, 12, 13, 14}   # cận hoặc không người: không gửi ảnh A


def main():
    os.makedirs(os.path.join(D, "anh"), exist_ok=True)
    os.makedirs(os.path.join(D, "video"), exist_ok=True)
    with open(os.path.join(D, "gen-anh.csv"), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["stt", "ten_file", "ty_le", "gui_kem", "prompt"])
        for s, t, g, pr in ANH:
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
    print(f"{len(ANH)} images, {len(VID)} clips")


if __name__ == "__main__":
    main()
