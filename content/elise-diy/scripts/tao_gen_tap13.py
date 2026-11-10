"""Tạo gen-anh.csv (giữ hàng 1-2 đã gen) và gen-video.csv cho tập 13 lốp xe thành hồ sen."""
import csv
import os

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ep13-tire-pond")

WIDE = ("Photorealistic vertical 9:16 photo, real outdoor DIY tutorial look. Wide shot, fixed camera at exactly the same "
        "position, height and framing as the finished-pond reference: the big tractor tyre lying flat in the middle of the "
        "warm wooden deck, the wooden barrel with a lantern on top at the left, banana leaves and ferns behind, pink hydrangea "
        "bushes at the back right, the wooden barrel with a folded white towel and candles at the right, the rustic wooden stool "
        "with three candles at the front right, round river stones and terracotta pots at the front left. ")
DAY = ("Warm late-afternoon sunlight. All lanterns and candles are unlit, there is no LED strip. ")
DUSK = ("Dusk: the sun has set, soft blue twilight, the garden is dim. ")
SAME = "Same garden, same tyre with exactly the same size and position, same props, same camera as the previous reference scene. "
WOMAN = ("The same young woman from the first reference: light brown hair in a neat bun, natural face, light-wash denim short "
         "overalls over a white sleeveless tank top, white sneakers")
GLOVES = WOMAN + ", tan suede gardening gloves"
NOGLOVES = WOMAN + ", no gloves"
END = " Real photo, no text, no logos."
RIM = ("The top rim of the tyre is clearly painted light weathered stone grey all the way round, exactly like the finished "
       "pond, in strong contrast with the black tread below. ")
CAM = ("Keep exactly the camera position, distance and framing of the SECOND reference: the tyre has exactly the same size "
       "and position in the frame. ")

# (stt, ten_file, gui_kem, prompt)
ANH = [
    (3, "lx-B-cu.png", "lx-A-elise-truoc.png; lx-B2-sach.png; lx-G-thanh-pham.png",
     WIDE + DAY + CAM + "The THIRD reference is the finished project: recreate exactly the same deck, props and camera, but at the "
     "very start of the project: the tyre is an old dirty tractor tyre caked with dried mud and dust, plain black rubber, "
     "empty inside so the deck shows through; there is no water, no liner, no bamboo post (only banana leaves there), no "
     "lilies. " + GLOVES + " kneels at the front-left of the tyre in three-quarter view, face visible, scrubbing the tread "
     "with a stiff brush; a galvanised bucket of soapy water stands beside her. There is NO drop cloth and NO paint can on "
     "the deck, only bare wooden planks around her." + END),
    (4, "lx-B2-sach.png", "lx-A-elise-truoc.png; lx-B-cu.png; lx-G-thanh-pham.png",
     WIDE + DAY + SAME + "The whole tyre is now scrubbed clean, wet glossy black rubber, no mud left, soap suds on the deck "
     "around it. " + GLOVES + " still kneels at the front-left, lifting the brush, smiling." + END),
    (5, "lx-C-son.png", "lx-A-elise-truoc.png; lx-B2-sach.png; lx-G-thanh-pham.png",
     WIDE + DAY + SAME + "Later: the tyre is clean and dry, matte black, the bucket is gone. A beige drop cloth lies on the "
     "deck at the front-left, with an open can of light stone-grey paint. " + GLOVES + " kneels there, face visible, "
     "dry-brushing stone grey onto the top rim of the tyre with a wide brush; only a short section of the rim at the left is "
     "grey so far. The tread on the outer side stays black." + END),
    (6, "lx-C2-son-nua.png", "lx-A-elise-truoc.png; lx-C-son.png; lx-G-thanh-pham.png",
     WIDE + DAY + SAME + "About half of the top rim, from the left round to the front, is now dry-brushed weathered stone grey "
     "exactly like the finished pond, the rest of the rim still black; the tread stays black. " + GLOVES + " keeps brushing "
     "at the front." + END),
    (7, "lx-D-son-can.png", "lx-C2-son-nua.png; lx-G-thanh-pham.png",
     "Photorealistic vertical 9:16 photo, real outdoor DIY tutorial look, warm late-afternoon sunlight. Close-up, fixed "
     "camera, on the front of the tractor tyre's top rim, the deck and garden softly blurred behind. Her gloved hand (tan "
     "suede gardening glove) dry-brushes light stone grey over the black rubber rim with a wide brush: the left part of the "
     "rim is already textured weathered grey like the finished pond, the right part still plain black; the deep tread blocks "
     "below stay black." + END),
    (8, "lx-D2-son-can-xong.png", "lx-D-son-can.png; lx-G-thanh-pham.png",
     "Exactly the same close-up framing, tyre, light and hand as the first reference. The whole visible rim is now textured "
     "weathered stone grey like the finished pond; the tread stays black. Her gloved hand lifts the brush away." + END),
    (9, "lx-E-lot.png", "lx-A-elise-truoc.png; lx-C2-son-nua.png; lx-G-thanh-pham.png; lx-J2-sen-xong.png",
     WIDE + DAY + SAME + RIM + "The whole top rim is now dry-brushed stone grey exactly like the finished pond, the tread black; "
     "the paint and drop cloth are gone. " + GLOVES + " stands at the left front, face visible, spreading a big black rubber "
     "pond liner into the tyre; part of it already lies inside, the rest is folded in her arms." + END),
    (10, "lx-E2-lot-xong.png", "lx-A-elise-truoc.png; lx-E-lot.png; lx-G-thanh-pham.png",
     WIDE + DAY + SAME + RIM + "The black liner now lines the whole inside of the tyre, its edge tucked neatly under the grey rim so "
     "no liner shows on the outside. " + GLOVES + " kneels at the front-left pressing the tucked edge down." + END),
    (11, "lx-F-tre.png", "lx-A-elise-truoc.png; lx-E2-lot-xong.png; lx-G-thanh-pham.png",
     WIDE + DAY + SAME + RIM + "Now a tall bamboo post stands upright just behind the tyre at the back-left, exactly where it is in "
     "the finished pond, but without its spout. " + GLOVES + " stands behind the tyre beside the post, face visible, holding "
     "the cut bamboo spout piece up to the top of the post. A green garden hose lies coiled on the deck." + END),
    (12, "lx-F2-tre-xong.png", "lx-A-elise-truoc.png; lx-F-tre.png; lx-G-thanh-pham.png",
     WIDE + DAY + SAME + RIM + "The bamboo spout is now fixed at the top of the post pointing over the pond, exactly like the "
     "finished pond, dry. A thin black pump cable runs down into the empty lined tyre. " + GLOVES + " ties it on with "
     "cord." + END),
    (13, "lx-H-nuoc.png", "lx-A-elise-truoc.png; lx-F2-tre-xong.png; lx-G-thanh-pham.png",
     WIDE + DAY + SAME + "The bamboo spout is fixed and dry. " + NOGLOVES + " kneels at the front-left, face visible, holding "
     "the green garden hose over the lined tyre; clear water pours from it and a shallow layer of water covers the bottom." + END),
    (14, "lx-H2-day.png", "lx-A-elise-truoc.png; lx-H-nuoc.png; lx-G-thanh-pham.png",
     WIDE + DAY + SAME + "The pond is now full of clear dark water up to just below the grey rim; " + NOGLOVES + " lifts the "
     "hose away. The bamboo spout is still dry. No plants in the water yet." + END),
    (15, "lx-I-voi-can.png", "lx-H2-day.png; lx-G-thanh-pham.png",
     "Photorealistic vertical 9:16 photo, warm late-afternoon sunlight. Close-up, fixed camera, of the cut bamboo spout at "
     "the top of the bamboo post with the calm water surface of the pond below it and part of the grey tyre rim; ferns and "
     "banana leaves softly blurred behind. The spout is dry, the water is still." + END),
    (16, "lx-I2-voi-chay.png", "lx-I-voi-can.png; lx-G-thanh-pham.png",
     "Exactly the same close-up framing and light as the first reference. A clear thin stream of water now pours from the "
     "bamboo spout into the pond with a small splash and rings of ripples." + END),
    (17, "lx-J-sen.png", "lx-A-elise-truoc.png; lx-H2-day.png; lx-G-thanh-pham.png",
     WIDE + DAY + SAME + "The pond is full of clear water and the bamboo spout pours a thin stream with ripples, exactly like "
     "the finished pond. No plants in the water yet. " + NOGLOVES + " kneels at the front-left, face visible, holding a "
     "shallow basket with round green lily pads and a small black pot of pink water lilies in bloom, about to lower it in." + END),
    (18, "lx-J2-sen-xong.png", "lx-A-elise-truoc.png; lx-J-sen.png; lx-G-thanh-pham.png",
     WIDE + DAY + SAME + "Now round green lily pads and two or three open pink water lilies float in the pond exactly like the "
     "finished pond; the spout still pours. " + NOGLOVES + " smiles, hands on the grey rim, the empty basket beside her." + END),
    (19, "lx-K-den.png", "lx-A-elise-truoc.png; lx-J2-sen-xong.png; lx-G-thanh-pham.png",
     WIDE + DUSK + SAME + "The lantern on the left barrel and the small lantern behind glow warm, the candles on the right "
     "barrel are lit, but the three candles on the stool are unlit. A golden LED light strip now runs around the base of "
     "the tyre on the deck but it is OFF. " + NOGLOVES + " crouches at the front right, face visible, holding the LED "
     "strip's plug next to a small outdoor socket box on the deck." + END),
    (20, "lx-K2-den-sang.png", "lx-A-elise-truoc.png; lx-K-den.png; lx-G-thanh-pham.png",
     WIDE + DUSK + SAME + "Everything as in the previous reference, but the LED strip around the base of the tyre now glows "
     "warm gold and reflects on the deck, exactly like the finished pond. The three candles on the stool are still unlit. "
     + NOGLOVES + " smiles, the plug now in the socket." + END),
    (21, "lx-L-nen.png", "lx-A-elise-truoc.png; lx-K2-den-sang.png; lx-G-thanh-pham.png",
     WIDE + DUSK + SAME + CAM + "Everything as in the previous reference, LED strip glowing. " + NOGLOVES + " crouches by the stool "
     "at the front right, face visible, holding a long candle lighter with a small flame close to the wick of the first "
     "candle on the stool. IMPORTANT: all three candles on the stool are UNLIT: plain white wax, black wicks, no flame and "
     "no glow on them; only the tip of the lighter has a tiny flame." + END),
    (22, "lx-L2-nen-sang.png", "lx-A-elise-truoc.png; lx-L-nen.png; lx-G-thanh-pham.png",
     WIDE + DUSK + SAME + CAM + "Everything as in the previous reference, but now all three candles on the stool are lit. "
     + NOGLOVES + " lowers the lighter, smiling at the pond." + END),
]

BASE = ("Real outdoor DIY timelapse video, vertical 9:16, photorealistic, not animated, no text, no logos. One continuous "
        "fixed shot: same framing as the start frame, no zoom, no pan, no cuts, no scene changes. The video must start "
        "exactly like the start-frame image and end exactly like the end-frame image. The backyard deck, plants and props "
        "stay exactly as in the start frame the whole clip. Only this one woman is ever in the scene; no other person appears. ")
WHO_G = ("the young woman from the reference (light brown hair in a bun, light-wash denim short overalls, white sleeveless "
         "tank top, white sneakers, tan gardening gloves): ")
WHO = ("the young woman from the reference (light brown hair in a bun, light-wash denim short overalls, white sleeveless "
       "tank top, white sneakers, no gloves): ")
TAIL = (" She works at a natural, steady pace and never stands idle or sways while holding an item; nothing appears, "
        "vanishes or changes by itself.")
TYRE = " The tyre keeps exactly its size, tread and position."

# (stt, doan, khung_dau, khung_cuoi, prompt, am_thanh, dung_giay, che_do, cat_den, chuyen_canh)
VID = [
    (1, "Mở đầu - thành phẩm", "lx-G-thanh-pham.png", "",
     "Real outdoor video, vertical 9:16, photorealistic, no text, no logos. Static camera, exactly the start frame. No "
     "person. Water gently pours from the bamboo spout into the pond with soft ripples, candle and lantern flames flicker "
     "slightly. Nothing else moves, nothing appears or vanishes.", "Tiếng nước chảy, nhạc acoustic nhẹ bắt đầu.", 1.5, "cat", "", ""),
    (2, "Cọ lốp", "lx-B-cu.png", "lx-B2-sach.png",
     BASE + WHO_G + "scrubs the muddy tyre tread with the stiff brush, dipping it in the soapy bucket, working round the "
     "near side until the rubber is clean and wet, as in the end frame. Mud comes off only where the brush passes." + TYRE + TAIL,
     "Nhạc acoustic nhẹ, tiếng bàn chải, tiếng nước.", 3, "tang_toc", "", "trang"),
    (3, "Sơn xám mép lốp", "lx-C-son.png", "lx-C2-son-nua.png",
     BASE + WHO_G + "dry-brushes stone grey paint along the top rim of the tyre with the wide brush, moving from the left "
     "round to the front, as in the end frame. Grey appears only exactly where the brush passes; the tread stays black." + TYRE + TAIL,
     "Nhạc acoustic nhẹ, tiếng cọ.", 3, "tang_toc", "", "mo_dai"),
    (4, "Cận sơn phủ khô", "lx-D-son-can.png", "lx-D2-son-can-xong.png",
     "Real outdoor DIY video, vertical 9:16, photorealistic, no text, no logos. One continuous fixed close-up shot, same "
     "framing as the start frame, no zoom, no cuts. Her gloved hand slowly sweeps the wide brush to the right along the "
     "black rubber rim; textured stone grey appears only exactly where the bristles pass, until the whole visible rim is "
     "grey, as in the end frame. The tread blocks below stay black. Nothing else changes.", "Nhạc acoustic nhẹ, tiếng cọ khô.",
     4, "cat", "4", "mo"),
    (5, "Lót bạt", "lx-E-lot.png", "lx-E2-lot-xong.png",
     BASE + WHO_G + "unfolds the black rubber pond liner into the tyre, smooths it over the bottom and walls and tucks its "
     "edge under the grey rim all round the near side, as in the end frame. The liner is one sheet; it only moves where her "
     "hands push it." + TYRE + TAIL, "Nhạc acoustic nhẹ, tiếng bạt sột soạt.", 3, "tang_toc", "", "mo_dai"),
    (6, "Gắn vòi tre", "lx-F-tre.png", "lx-F2-tre-xong.png",
     BASE + WHO_G + "fits the cut bamboo spout onto the top of the bamboo post, ties it firmly with cord and lays the thin "
     "pump cable down into the lined tyre, as in the end frame. The post stays upright and in place." + TYRE + TAIL,
     "Nhạc acoustic nhẹ, tiếng tre gõ.", 3, "tang_toc", "", "mo"),
    (7, "Xả nước", "lx-H-nuoc.png", "lx-H2-day.png",
     BASE + WHO + "holds the garden hose over the pond; clear water pours from the hose only and the water level rises slowly "
     "and evenly until it is just below the grey rim, then she lifts the hose away, as in the end frame. The bamboo spout "
     "stays dry." + TYRE + TAIL, "Nhạc acoustic nhẹ, tiếng nước xả.", 3, "tang_toc", "", "mo"),
    (8, "Cận vòi tre chảy", "lx-I-voi-can.png", "lx-I2-voi-chay.png",
     "Real outdoor video, vertical 9:16, photorealistic, no text, no logos. One continuous fixed close-up shot, same framing "
     "as the start frame, no zoom, no cuts. After a moment, water starts to flow from the dry bamboo spout: first a few drops, "
     "then a clear thin stream pouring into the pond with a small splash and spreading ripples, as in the end frame. The "
     "bamboo and the pond edge never change.", "Tiếng nước bắt đầu chảy róc rách.", 4, "cat", "", "mo"),
    (9, "Thả sen", "lx-J-sen.png", "lx-J2-sen-xong.png",
     BASE + WHO + "lowers the small pot of pink water lilies into the pond, then takes the round lily pads from the basket "
     "one by one and floats them on the water around it, as in the end frame. Each pad and flower appears only from her "
     "hands; the bamboo spout keeps pouring." + TYRE + TAIL, "Nhạc acoustic nhẹ, tiếng nước.", 5, "cat", "", "mo"),
    (10, "Bật đèn LED", "lx-K-den.png", "lx-K2-den-sang.png",
     BASE + WHO + "pushes the LED strip's plug into the outdoor socket; the golden LED strip around the base of the tyre "
     "lights up all at once and glows on the deck, as in the end frame. Only the LED strip changes; the lanterns stay as "
     "they are and the stool candles stay unlit. The sky stays the same dusk." + TYRE + TAIL,
     "Nhạc acoustic nhẹ, tiếng tách công tắc.", 4, "cat", "", "mo_dai"),
    (11, "Châm nến", "lx-L-nen.png", "lx-L2-nen-sang.png",
     BASE + WHO + "lights the three candles on the stool one after another with the long candle lighter; each flame appears "
     "only when the lighter touches that wick, as in the end frame. Nothing else lights up." + TYRE + TAIL,
     "Nhạc acoustic nhẹ, tiếng bật lửa.", 4, "cat", "", "mo"),
    (12, "Quay vòng thành phẩm", "lx-G-thanh-pham.png", "",
     "Real outdoor video, vertical 9:16, photorealistic, no text, no logos. It must start exactly like the start-frame "
     "image. No person. The finished tyre pond at dusk: water pours from the bamboo spout with ripples, pink water lilies "
     "and lily pads, LED strip glowing around the base, lanterns and candles flickering. One smooth, slow cinematic camera "
     "orbit around the pond at the same height, moving about 60 degrees to the right, keeping it centred and in sharp "
     "focus. The pond, plants and props never change, nothing appears or vanishes.",
     "Nhạc acoustic nhẹ kết, tiếng nước, tiếng côn trùng tối.", 6, "tang_toc", "5", "mo_dai"),
]


def main():
    p = os.path.join(D, "gen-anh.csv")
    with open(p, encoding="utf-8-sig", newline="") as f:
        rows = [r for r in csv.DictReader(f) if int(r["stt"]) <= 2]
    rows += [{"stt": str(s), "ten_file": t, "ty_le": "9:16", "gui_kem": g, "prompt": pr} for s, t, g, pr in ANH]
    with open(p, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["stt", "ten_file", "ty_le", "gui_kem", "prompt"])
        w.writeheader()
        w.writerows(rows)
    cols = ["stt", "doan", "luu_tai", "khung_dau", "khung_cuoi", "anh_tham_chieu", "prompt", "am_thanh", "dung_giay",
            "che_do", "cat_tu", "cat_den", "chuyen_canh"]
    with open(os.path.join(D, "gen-video.csv"), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for s, doan, a, b, pr, am, dg, cd, den, cc in VID:
            ref = "" if s in (1, 12) or "can" in a else "lx-A-elise-truoc.png"
            w.writerow({"stt": s, "doan": f"Clip {s} - {doan}", "luu_tai": f"video\\clip{s}.mp4", "khung_dau": a,
                        "khung_cuoi": b, "anh_tham_chieu": ref, "prompt": pr, "am_thanh": am, "dung_giay": dg,
                        "che_do": cd, "cat_tu": "", "cat_den": den, "chuyen_canh": cc})
    print(f"gen-anh.csv: {len(rows)} rows, gen-video.csv: {len(VID)} clips")


if __name__ == "__main__":
    main()
