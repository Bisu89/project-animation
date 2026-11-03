import csv, os, sys

ROOT = sys.argv[1]  # content/elise-diy
TAIL = " Real photo, no text, no logos."
HEAD = ("Photorealistic vertical 9:16 photo, real home DIY tutorial look. Wide shot, fixed camera, straight-on at chest height, "
        "the woman's whole body and face in frame. ")
SAME = "Same room, furniture, camera and light as the previous reference scene. "
FIRST = ("The SECOND reference image is the finished room: recreate exactly the same room, wall, furniture, floor and camera framing, "
         "but at the very start of the project, as described here. ")
END_REF = "The finished product must look exactly like the one in the last reference image. "
SKIN = "natural realistic skin texture with fine pores, no freckles, no airbrushing"
EAR = "small gold hoop earrings and a thin gold necklace"
WHO = {
    "legging": (f"the young European woman from the first reference: light brown hair in a neat bun with a few loose strands, {SKIN}, "
                f"{EAR}, fitted white tank top, plain black high-waisted full-length leggings, white ankle socks, white leather Nike "
                "low-top sneakers; modest, wholesome family-friendly DIY tutorial look"),
    "cao-got": (f"the young European woman from the first reference: light brown hair in a neat bun with a few loose strands, {SKIN}, "
                f"{EAR}, fitted white short-sleeve crop top with a small embroidered brown logo on the left chest (line-art girl with "
                "a bun in a circle, cursive 'Elise' below), high-waisted light beige pleated skirt just above the knee, black patent "
                "high heel pumps; modest, wholesome family-friendly look"),
    "cham-bi": (f"the young European woman from the first reference: light brown hair in a neat bun with a few loose strands, {SKIN}, "
                f"{EAR}, fitted white short-sleeve crop top with a small embroidered brown logo on the left chest (line-art girl with "
                "a bun in a circle, cursive 'Elise' below), high-waisted light beige pleated skirt just above the knee, sheer black "
                "polka dot tights, no shoes; modest, wholesome family-friendly cozy at-home look"),
}

# (tên ảnh, prompt, gửi kèm ảnh thành phẩm?) ; ảnh G (thành phẩm) đã có, gpt_anh bỏ qua ảnh đã có
EPS = {
    "ep04-shelf-tree": ("kg", "legging", [
        ("B-ke-tron", FIRST + "The light sage-green wall above the dark walnut sideboard is completely empty (no shelves). On the "
         "sideboard already sit the red gift with a white ribbon, the kraft gift with twine, the red plaid gift and the small lantern "
         "(unlit). Six dark walnut shelf boards of decreasing length lean against the side of the sideboard, and on the floor beside them "
         "stands an open cardboard box of decorations (mini frosted bottle-brush trees, white LED pillar candles, tiny gifts, gold bells, "
         "red berry picks, a gold glitter star) and a coil of pine garland with tiny unlit bulbs. {W} stands upright at the right of the "
         "sideboard, face visible, holding the longest walnut board in both hands.", True),
        ("B2-ke-xong", SAME + "The six dark walnut floating shelves are now mounted on the wall above the sideboard, centred and "
         "stepped: the longest at the bottom, each one above shorter, forming a triangle tree shape; the shelves are empty. The box of "
         "decorations and the garland coil are still on the floor. {W} stands at the right, face visible, holding the garland coil.", False),
        ("C-day-la", SAME + "A thin pine garland with tiny unlit bulbs now runs along the front edge of all six shelves. {W} stands at "
         "the right, face visible, holding a mini frosted bottle-brush tree taken from the box.", False),
        ("C2-cay-nen", SAME + "On the shelves now stand the mini frosted bottle-brush trees and the white LED pillar candles (unlit), a "
         "few on each shelf, nothing else yet. The box on the floor still holds the tiny gifts, gold bells, berry picks and the star. "
         "{W} stands at the right, face visible, holding a tiny wrapped gift.", False),
        ("D-qua-nho", SAME + "Now the tiny wrapped gifts, small gold bells and red berry picks are also arranged among the trees and "
         "candles on every shelf. The box on the floor holds only the gold glitter star. {W} stands at the right, face visible, "
         "holding the gold glitter star.", False),
        ("D2-sao", SAME + "The gold glitter star now stands on top of the highest shelf. The empty box is gone from the floor. {W} "
         "stands at the right, face visible, smiling at the shelf tree, hands clasped.", False),
        ("E2-toi", SAME + "It is evening, the room is dim, lit softly by warm light off-frame; the wall stays light sage-green. The "
         "garland bulbs, candles and lantern are still OFF. {W} stands at the right, face visible, holding a small white remote, about "
         "to press it.", False),
        ("F-sang", SAME + "Same evening, but now the garland bulbs, the LED candles and the lantern are all ON, glowing warm "
         "white along every shelf. {W} stands at the right, face lit warmly, smiling happily at the glowing shelf tree.", False),
    ]),
    "ep05-gift-tree": ("hq", "cao-got", [
        ("B-dong-qua", FIRST + "The curtain fairy lights on the wall are switched OFF and it is daytime. The area at the left against "
         "the wall is empty: no gift tower yet. On the floor in the middle stands a big loose pile of about thirty wrapped gift boxes "
         "of many sizes (kraft, champagne gold, emerald green, copper and dark grey papers with dark green ribbons and metallic bows), "
         "and beside it an open box of gold, copper, red and teal baubles. {W} stands upright at the right in front of the armchair, "
         "face visible, holding one large gold gift box in both hands.", True),
        ("B2-tang-day", SAME + "At the left against the wall now stands the bottom layer of the gift tree: a wide row of the largest "
         "boxes side by side. The pile in the middle is smaller. {W} stands beside the tower, face visible, with both hands still on "
         "the last large box of the row as she pushes it into place.", False),
        ("C-tang-giua", SAME + "The gift tree has grown to about chest height: medium boxes stacked on the bottom layer, narrowing "
         "upward in a slightly irregular stepped triangle. Only a few small boxes are left in the pile. {W} stands beside the tower, "
         "face visible, both hands setting the last medium box on top of the stack.", False),
        ("C2-dinh", SAME + "The gift tree is now complete up to one small box on top with a dark green metallic bow, tall and narrow "
         "at the top like a tree. The pile is gone; only the open box of baubles remains on the floor. {W} stands upright beside the "
         "tower, face visible, her hand still adjusting the dark green bow on the top box.", False),
        ("D-qua-chau", SAME + "Gold, copper, red and teal baubles are now tucked into the gaps all over the gift tree. The bauble box "
         "on the floor is empty. {W} stands beside the tower, face visible, tucking the last gold bauble into a gap.", False),
        ("F-sang", "Exactly the same room, camera, daylight and gift tree as the reference scene, every box, bow and bauble in exactly "
         "the same place and size, but the woman and the empty bauble box are no longer in the room, and the curtain of warm-white fairy "
         "light strands on the wall is now switched ON, glowing softly with gentle bokeh; the gold paper stars shine and the boxes and "
         "baubles catch the warm light. Finished DIY result, no people.", False),
    ]),
    "ep06-branch-tree": ("cg", "cham-bi", [
        ("B-canh", FIRST + "The white wall is empty except the small brass hook. On the white bench lie six natural dry wooden "
         "branches of different lengths and a spool of jute twine. On the floor beside the bench stands a wooden crate holding pine "
         "sprigs, a coil of unlit copper fairy lights, small pinecones, white and red baubles, small wooden stars, three white pillar "
         "candles, two small white ceramic trees and the black lantern. {W} stands upright behind the bench, face visible, laying the "
         "branches in a row from longest to shortest.", True),
        ("B2-buoc", SAME + "On the bench the six branches are now tied together with jute twine into a flat triangular ladder, the "
         "longest at the bottom and the shortest at the top, the twine running from a loop at the top down both sides. {W} stands "
         "upright behind the bench, face visible, lifting the branch tree by its twine loop with both hands.", False),
        ("C-treo", SAME + "The branch tree now hangs flat on the white wall from the brass hook by its twine loop, above the bench; "
         "the bench is empty. {W} stands at the right of the bench, face visible, both hands still straightening the bottom branch "
         "so the tree hangs level.", False),
        ("C2-la-thong", SAME + "Every branch is now wrapped with green pine sprigs and thin unlit copper fairy lights. {W} stands "
         "at the right, face visible, both hands still wrapping the last pine sprig around the bottom branch.", False),
        ("D-trang-tri", SAME + "Small pinecones, white and red baubles and little wooden stars now hang along the branches, and a small "
         "wooden star sits at the top. The crate now holds only the candles, the ceramic trees and the lantern. {W} stands at the "
         "right, face visible, hanging the last red bauble on the bottom branch.", False),
        ("D2-bay-ghe", SAME + "The three white pillar candles (unlit, on wood slices), the two small white ceramic trees and the "
         "black lantern are now arranged on the bench under the branch tree. The crate is gone. {W} stands beside the bench, face "
         "visible, setting the black lantern down at the end of the bench.", False),
        ("F-sang", "Exactly the same room, camera, daylight, branch tree, decorations and bench arrangement as the reference scene, "
         "every object in exactly the same place and size. Only change: the thin copper fairy lights along every branch are now "
         "switched ON with tiny warm bulbs, and the three pillar candles and the lantern glow softly; the wall stays white. "
         "{W} is crouching at the right end of the bench, face visible and smiling, her hand still on the light plug she has just "
         "pushed into the wall socket.", False),
    ]),
}

for ep, (pfx, outfit, frames) in EPS.items():
    d = os.path.join(ROOT, ep)
    a, g = f"{pfx}-A-elise-truoc.png", f"{pfx}-G-thanh-pham.png"
    assert os.path.exists(os.path.join(d, "anh", a)) and os.path.exists(os.path.join(d, "anh", g)), ep
    with open(os.path.join(d, "gen-anh.csv"), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["stt", "ten_file", "ty_le", "gui_kem", "prompt"])
        prev = None
        for i, (name, text, use_g) in enumerate(frames, 1):
            nobody = "no people" in text  # ảnh thành phẩm: không có Elise, không gửi ảnh tham chiếu nhân vật
            refs = ([] if nobody else [a]) + ([prev] if prev else []) + ([g] if use_g else [])
            head = "Photorealistic vertical 9:16 photo, real home interior, fixed camera. " if nobody else HEAD
            prompt = head + text.replace("{W}", WHO[outfit]) + TAIL
            prev = f"{pfx}-{name}.png"
            w.writerow([i, prev, "9:16", "; ".join(refs), prompt])
        w.writerow([len(frames) + 1, g, "9:16", "", "(đã có: ảnh thành phẩm chủ dự án duyệt, không gen lại)"])
    print(ep, len(frames), "khung +", g)
