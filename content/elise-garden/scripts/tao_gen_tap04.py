"""Sinh gen-anh.csv + gen-video.csv cho Elise Garden tập 04 (ngô Glass Gem).

Chạy: python -X utf8 tao_gen_tap04.py
Chủ dự án duyệt nội dung 2026-11-09 ("oke 2 tập gen ảnh rồi làm"). Luôn đúng 9 cây (3 x 3), 5 bắp ở khung kết.
Cột cắt sửa ở ghep-v2.csv, không ở đây.
"""
import csv
import os

TAP = "ep04-glass-gem-corn"
TT = "eg4"
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", TAP)

A = f"{TT}-A-elise-truoc.png"
G = f"{TT}-G-thanh-pham.png"
REF = f"{TT}-ref-san-pham.png"
END = " Real photo, no text, no logos, no watermark."

KERNELS = ("large glossy translucent kernels that look like glass beads, set in neat straight rows along the cob, each "
           "kernel a random jewel color: deep wine red, cobalt blue, teal green, golden yellow, orange and purple, mixed "
           "randomly, with a few pale ivory kernels at the tip")
EARS = ("five ears of Glass Gem corn lying diagonally side by side on an old weathered silver-grey wooden table with "
        "cracked grain; four ears fully visible and a fifth cut off at the right edge; their pale creamy light-green "
        f"husks are peeled back toward the top of the frame; {KERNELS}; thin reddish-purple silk threads still cling "
        "to the tips; dark blurred background, warm late-afternoon sunlight from the left making the kernels sparkle")
SEEDS = ("dried Glass Gem corn seeds: glossy translucent kernels like small glass beads in deep wine red, cobalt blue, "
         "teal green, golden yellow, orange and purple")

OUTFIT = ("light brown hair in a neat bun with a few loose strands, natural realistic skin texture with fine pores, no "
          "freckles, no airbrushing, small gold earrings, fine gold necklace, woodland camouflage short bib overalls over a "
          "vivid orange sleeveless V-neck tank top, white sneakers, bare arms, no backpack, no apron, no hat, modest "
          "wholesome family-friendly look")
GLOVES = "light sage-green cotton gardening gloves"
WOMAN = "The same young woman from the first reference: " + OUTFIT + ", bare hands, no gloves, face visible"
WOMAN_G = "The same young woman from the first reference: " + OUTFIT + ", wearing " + GLOVES + ", face visible"
BED = ("a square raised garden bed of dark loose soil in the lower part of the frame, a pale weathered grey horizontal "
       "wooden plank fence behind it, warm golden late-afternoon sunshine from the left; a small green metal watering "
       "can and a small garden hoe lie on the grass at the right edge of the bed")
GRID = "exactly nine planting spots in a neat square grid of three rows of three in the bed"
WIDE = ("Photorealistic vertical 9:16 photo, real backyard gardening look. Wide shot, fixed camera at chest height, "
        "looking slightly across the bed; the woman stands at the far side of the bed, visible from head to toe, with "
        f"the fence and a band of blue sky above her head. Setting: {BED}. ")
SAME = "Same garden bed, fence, sky, light and camera framing as the previous reference scene. "
CAM = ("Keep exactly the camera position, distance and framing of the SECOND reference: the bed, the fence and the "
       "woman have exactly the same size and position in the frame. ")
CLOSE = ("Photorealistic vertical 9:16 photo, warm golden late-afternoon sunshine. Close-up, fixed camera looking down "
         "at the dark loose soil of the garden bed, the grey wooden plank fence softly blurred at the top. ")
STAGE = ("Photorealistic vertical 9:16 photo, no people, no hands, no tools. Exactly the same camera position, "
         "framing, bed, fence, sky and light as the reference. ")

# (stt, ten_file, gui_kem, prompt)
ANH = [
    (1, G, REF,
     "Photorealistic vertical 9:16 photo. Recreate the corn in the reference image exactly, as a vertical frame: same "
     "five ears, same diagonal arrangement, same peeled-back husks, same kernel colors and rows, same weathered table, "
     f"same warm side light and dark blurred background. The scene: {EARS}. Camera close and slightly from above, "
     "exactly like the reference; the ears fill most of the frame. No people, no hands." + END),

    # Clip 1: mở lòng bàn tay đầy hạt (cận)
    (2, f"{TT}-B0-nam-tay.png", f"{G}; {A}",
     CLOSE + "A woman's bare hand (natural skin, short clean nails) is held loosely closed, palm up, above the soil, "
     "fingers curled over a small handful of seeds; only a few colorful seed edges peek between the fingers. Only the "
     "hand and forearm are visible." + END),
    (3, f"{TT}-B1-mo-tay.png", f"{TT}-B0-nam-tay.png; {G}",
     "Exactly the same close-up framing, light, soil and hand as the first reference. Only change: the hand is now open, "
     f"palm up, holding a small heap of {SEEDS}, sparkling in the sun." + END),

    # Clip 2: ấn lỗ, thả 2 hạt (cận vừa, nhìn xuống lưới 3x3)
    (4, f"{TT}-C0-tha-hat.png", f"{TT}-B1-mo-tay.png",
     "Photorealistic vertical 9:16 photo, warm golden late-afternoon sunshine. Close-medium shot, fixed camera looking "
     f"down at the dark loose soil of the bed: {GRID}, each a small finger-pressed hole. The two holes of the front row "
     "on the left each hold two colorful glass-bead-like corn seeds; the other holes are empty. A bare hand drops two "
     "seeds into the third hole of the front row. Only the hand and forearm are visible." + END),
    (5, f"{TT}-C1-tha-xong.png", f"{TT}-C0-tha-hat.png",
     "Exactly the same framing, light, soil and hand as the reference. Only change: now all nine holes in the three by "
     "three grid each hold two colorful corn seeds, and the hand drops the last two seeds into the back-right hole."
     + END),

    # Clip 3: tưới (rộng, có người)
    (6, f"{TT}-H0-tuoi.png", f"{A}; {G}",
     WIDE + f"In the bed: {GRID}, each a small smooth covered spot, nothing growing yet. " + WOMAN + ", standing "
     "upright behind the bed, holding the small green metal watering can and pouring a gentle stream of water on the "
     "left column of spots." + END),
    (7, f"{TT}-H1-tuoi-xong.png", f"{A}; {TT}-H0-tuoi.png; {G}",
     WIDE + SAME + CAM + f"In the bed: {GRID}; the soil of the whole bed is now darker and evenly moist. " + WOMAN +
     ", still pouring a gentle stream of water on the right column of spots." + END),

    # Clip 4: Days later - mầm (cận, không người)
    (8, f"{TT}-M1-nay-mam.png", f"{TT}-C1-tha-xong.png",
     "Photorealistic vertical 9:16 photo, no people, no hands. Exactly the same framing, light and bed as the "
     "reference, but the seeds are now covered with soil. At each of the nine spots of the three by three grid a corn "
     "sprout has emerged: one slender pointed tightly rolled pale-green leaf spike just unfurling above the soil. "
     "Exactly nine sprouts." + END),

    # Clip 5: Weeks later - ngang gối (rộng, không người)
    (9, f"{TT}-M2-ngang-goi.png", f"{TT}-H1-tuoi-xong.png; {G}",
     STAGE.replace("as the reference", "as the first reference") + "The woman and the watering can are gone; the hoe "
     "lies on the grass at the right edge. Only change: nine young corn plants about knee-high grow in the square grid "
     "of three rows of three, each with several long arching bright green strap-shaped leaves. Exactly nine plants."
     + END),

    # Clip 6: vun gốc (rộng, có găng)
    (10, f"{TT}-D0-vun-goc.png", f"{TT}-M2-ngang-goi.png; {A}",
     "Recreate the FIRST reference image exactly: same vertical framing, same straight-on camera position and "
     "distance, the same raised bed seen from the front, the same fence, sky, grass, light and the same nine knee-high "
     "corn plants in the three by three grid, exactly the same size and position in the frame. Only change: add the "
     "young woman from the second reference (" + OUTFIT + ", wearing " + GLOVES + ", face visible), standing upright "
     "on the grass behind the bed on the left, visible from head to toe, holding the small garden hoe (taken from the "
     "grass) and drawing loose soil up against the base of the back-left plant." + END),
    (11, f"{TT}-D1-vun-xong.png", f"{TT}-D0-vun-goc.png",
     "Recreate the reference image exactly: same framing, camera, bed, fence, sky, light, the same nine plants and the "
     "same woman with gloves and hoe. Only change: the three plants of the back row now each stand in a small mound of "
     "hilled-up soil, and she has moved to the right behind the bed, drawing soil with the hoe against the base of the "
     "back-right plant." + END),

    # Clip 7: Weeks later - cao hơn người, trổ cờ (rộng, không người)
    (12, f"{TT}-S1-tro-co.png", f"{TT}-M2-ngang-goi.png; {G}",
     STAGE.replace("as the reference", "as the first reference") + "Only change: the nine corn plants in the three by "
     "three grid are now tall, taller than a person, their thick green stalks rising to the top of the frame with "
     "golden-tan branching tassels at the very top against the sky; each stalk carries one green ear at mid-height with "
     "a tuft of fresh pink-red silk. Long green leaves arch out. Exactly nine stalks." + END),

    # Clip 8: lắc thân cho phấn rơi (cận vừa, tay trần)
    (13, f"{TT}-P0-cam-than.png", f"{A}; {TT}-S1-tro-co.png; {G}",
     "Photorealistic vertical 9:16 photo, warm golden late-afternoon sunshine from the left, backlit. Medium close shot, "
     "fixed camera, inside the tall corn: one thick green corn stalk fills the middle of the frame, its golden-tan "
     "tassel at the top of the frame and a green ear with a tuft of fresh pink-red silk at mid-height. " + WOMAN +
     ", seen from the chest up beside the stalk, her bare hand gripping the stalk just below the tassel." + END),
    (14, f"{TT}-P1-phan-roi.png", f"{TT}-P0-cam-than.png; {A}",
     "Exactly the same framing, light, stalk, tassel, ear, woman and hand as the first reference. Only change: a light "
     "dusting of fine yellow pollen drifts down from the tassel through the sunbeams onto the pink-red silk; the stalk "
     "leans very slightly in her hand." + END),

    # Clip 9: Weeks later - râu khô (cận, không người)
    (15, f"{TT}-S2-rau-kho.png", f"{TT}-P0-cam-than.png",
     "Photorealistic vertical 9:16 photo, no people, no hands. Close-up of one plump corn ear on its thick stalk, the "
     "tall corn leaves softly blurred behind, warm golden late-afternoon sunshine. The silk at the tip has turned dry "
     "and dark brown, and the creamy light-green husk is starting to dry and turn papery at its edges." + END),

    # Clip 10: bẻ bắp (cận tay)
    (16, f"{TT}-R0-be-bap.png", f"{TT}-S2-rau-kho.png",
     "Exactly the same close-up framing, light, stalk and ear as the reference, but a woven wicker basket now sits at "
     "the bottom edge of the frame. A woman's bare hand (natural skin, short clean nails) grips the ear and starts "
     "bending it downward against the stalk." + END),
    (17, f"{TT}-R1-be-xong.png", f"{TT}-R0-be-bap.png",
     "Exactly the same close-up framing, light, stalk, leaves and basket as the reference. Only change: the ear is "
     "snapped off; the hand lowers the husked ear into the wicker basket, a broken short shank left on the stalk."
     + END),

    # Clip 11: lột vỏ lộ hạt (cận, trên bàn gỗ)
    (18, f"{TT}-L1-lot-xong.png", G,
     "Photorealistic vertical 9:16 photo, warm late-afternoon sunlight from the left, dark blurred background. Close-up, "
     "fixed camera slightly from above, over the old weathered silver-grey wooden table of the reference. A woman's two "
     "bare hands hold one Glass Gem corn ear diagonally just above the table; the creamy light-green husk is fully "
     f"peeled back toward the top, revealing the whole ear: {KERNELS}, exactly like the middle ear of the reference; "
     "reddish-purple silk threads at the tip." + END),
    (19, f"{TT}-L0-lot-vo.png", f"{TT}-L1-lot-xong.png",
     "Exactly the same close-up framing, light, table, hands position and ear as the reference. Only change: the ear is "
     "still wrapped in its closed creamy light-green husk with dry brown silk at the tip, and one hand pinches the "
     "top of the husk, just starting to peel it back; only a thin strip of colorful kernels shows." + END),

    # Clip 12: đặt bắp lên bàn (cận)
    (20, f"{TT}-T0-dat-bap.png", f"{G}; {TT}-L1-lot-xong.png",
     "Recreate the FIRST reference image exactly: same vertical framing, same weathered table, light and background, "
     "same four ears in exactly the same places. Only change: the middle ear is missing from the table; instead the "
     "woman's bare hand from the second reference holds that same peeled ear just above its empty place, about to lay "
     "it down." + END),
    (21, f"{TT}-T1-dat-xong.png", G,
     "Recreate the reference image exactly: same vertical framing, all five ears in exactly the same places, same "
     "table, light and background. Only change: a woman's bare fingertips are just letting go of the middle ear at the "
     "edge of the frame." + END),
]

BASE = ("Real backyard gardening video, vertical 9:16, photorealistic, not animated, no text, no logos. One continuous "
        "fixed shot: same framing as the start frame, no zoom, no pan, no cuts, no scene changes. The video must start "
        "exactly like the start-frame image and end exactly like the end-frame image. The garden bed, fence and light "
        "stay exactly as in the start frame. Only this one woman is ever in the scene; no other person appears. The "
        "young woman from the reference (light brown hair in a bun, small gold earrings, woodland camouflage short bib "
        "overalls, orange sleeveless V-neck tank top): ")
TAIL = (" There are always exactly nine plant spots in a three by three grid. She works at a natural, steady pace and "
        "never stands idle or sways while holding an item; nothing appears, vanishes or changes by itself.")
CLOSE_V = ("Real backyard gardening video, vertical 9:16, photorealistic, no text, no logos. One continuous fixed close-up "
           "shot, same framing as the start frame, no zoom, no cuts. The video must start exactly like the start-frame "
           "image and end exactly like the end-frame image. Only one person's hands. ")
STILL_V = ("Real video, vertical 9:16, photorealistic, no text, no logos. Static camera, exactly the start frame. No "
           "person, no hands. Warm late-afternoon sunshine; the leaves stir very slightly in a faint breeze. The plants "
           "do not grow, no leaf, stalk, ear or sprout appears, vanishes, moves or changes.")
ORBIT = ("Real video, vertical 9:16, photorealistic, no text, no logos. It must start exactly like the start-frame image. "
         "No person, no hands. One very slow, smooth cinematic camera move to the right at the same height, about 15 "
         "degrees, keeping the corn ears centered and in sharp focus, the kernels glinting in the warm side light. "
         "Every ear, husk and kernel stays exactly in place and never changes color; nothing appears or vanishes.")
NHAC = "Nhạc acoustic nhẹ không lời"

# (stt, doan, khung_dau, khung_cuoi, prompt, am_thanh, dung_giay, che_do, cat_den, chuyen_canh)
VID = [
    (1, "Mở tay đầy hạt", f"{TT}-B0-nam-tay.png", f"{TT}-B1-mo-tay.png",
     CLOSE_V + "The loosely closed hand slowly opens, palm up, revealing the small heap of colorful glass-bead-like corn "
     "seeds sparkling in the sun, as in the end frame. The seeds never change color or number.",
     NHAC + " bắt đầu, tiếng hạt lạo xạo.", 2, "cat", "", ""),
    (2, "Thả hạt theo ô vuông", f"{TT}-C0-tha-hat.png", f"{TT}-C1-tha-xong.png",
     CLOSE_V + "The hand drops two colorful corn seeds into each remaining hole of the three by three grid in turn, "
     "row by row, as in the end frame. Exactly nine holes; seeds appear only where the fingers release them.",
     NHAC + ", tiếng hạt rơi.", 2.5, "tang_toc", "", "mo"),
    (3, "Tưới ô ngô", f"{TT}-H0-tuoi.png", f"{TT}-H1-tuoi-xong.png",
     BASE + "pours a gentle stream of water from the small green watering can over the spots, left column to right "
     "column, the soil darkening only where the water falls, as in the end frame. Nothing grows." + TAIL,
     NHAC + ", tiếng nước tưới.", 1.5, "tang_toc", "", "mo"),
    (4, "Days later - mầm ngô", f"{TT}-M1-nay-mam.png", "", STILL_V, NHAC + ".", 1.5, "cat", "", "cat"),
    (5, "Weeks later - ngang gối", f"{TT}-M2-ngang-goi.png", "", STILL_V, NHAC + ".", 2, "cat", "", "cat"),
    (6, "Vun gốc", f"{TT}-D0-vun-goc.png", f"{TT}-D1-vun-xong.png",
     BASE.replace("tank top)", "tank top, " + GLOVES + ")") + "draws loose soil up against the base of each back-row "
     "corn plant in turn with the small hoe, left to right, building a small mound at each, as in the end frame. The "
     "soil moves only where the hoe pushes it; the plants never move or multiply." + TAIL,
     NHAC + ", tiếng cuốc đất.", 2.5, "tang_toc", "", "mo"),
    (7, "Weeks later - trổ cờ", f"{TT}-S1-tro-co.png", "", STILL_V, NHAC + ".", 2, "cat", "", "cat"),
    (8, "Lắc thân cho phấn rơi", f"{TT}-P0-cam-than.png", f"{TT}-P1-phan-roi.png",
     "Real backyard gardening video, vertical 9:16, photorealistic, no text, no logos. One continuous fixed shot, same "
     "framing as the start frame, no zoom, no cuts. The video must start exactly like the start-frame image and end "
     "exactly like the end-frame image. Only this one woman. She gives the corn stalk one gentle shake with her bare "
     "hand; a light dusting of fine yellow pollen drifts down from the tassel through the sunbeams onto the pink-red "
     "silk, as in the end frame. The pollen is a fine sparkling dust, never smoke or a cloud. The stalk, tassel and ear "
     "keep their shape; nothing appears or vanishes.",
     NHAC + ", tiếng lá ngô xào xạc.", 3, "cat", "", "mo"),
    (9, "Weeks later - râu khô", f"{TT}-S2-rau-kho.png", "", STILL_V, NHAC + ".", 2, "cat", "", "cat"),
    (10, "Bẻ bắp", f"{TT}-R0-be-bap.png", f"{TT}-R1-be-xong.png",
     CLOSE_V + "The hand bends the ear sharply downward until it snaps off the stalk, then lowers the husked ear into the "
     "wicker basket, as in the end frame. The ear stays in its husk; the stalk and leaves stay in place.",
     NHAC + ", tiếng bẻ bắp giòn.", 2.5, "cat", "", "mo"),
    (11, "Lột vỏ lộ hạt", f"{TT}-L0-lot-vo.png", f"{TT}-L1-lot-xong.png",
     CLOSE_V + "Her fingers peel the creamy light-green husk back from the top of the ear in long strips, gradually "
     "revealing rows of glossy multicolored glass-bead-like kernels, until the whole ear shows, as in the end frame. "
     "The kernels are revealed only where the husk is pulled away; every kernel keeps its color and position; the ear "
     "keeps its size and shape.",
     NHAC + " lên cao trào, tiếng vỏ ngô sột soạt.", 3.5, "cat", "", "mo"),
    (12, "Đặt bắp lên bàn", f"{TT}-T0-dat-bap.png", f"{TT}-T1-dat-xong.png",
     CLOSE_V + "The hand lays the peeled ear down gently into its empty place among the other four ears and lets go, as "
     "in the end frame. The four other ears never move or change.",
     NHAC + ", tiếng bắp chạm gỗ.", 2, "cat", "", "mo"),
    (13, "Thành phẩm", G, "", ORBIT, NHAC + " kết.", 5, "cat", "5", "mo_dai"),
]
KHONG_THAM_CHIEU = {1, 2, 4, 5, 7, 9, 10, 11, 12, 13}   # cận/không người: không gửi ảnh A


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
