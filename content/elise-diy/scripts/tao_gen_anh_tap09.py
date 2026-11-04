import csv, os, sys

# Chạy: python -I -X utf8 tao_gen_anh_tap09.py <đường dẫn content/elise-diy>
# Giữ 2 dòng ng-A, ng-G đã gen; thêm các khung B→F. Ảnh đã có thì gpt_anh bỏ qua.
ROOT = sys.argv[1]
EP = os.path.join(ROOT, "ep09-fairy-stump")
TAIL = " Real photo, no text, no logos."
SKIN = "natural realistic skin texture with fine pores, no freckles, no airbrushing"
WHO = (f"the young European woman from the first reference: light brown hair in a neat bun with a few loose strands, {SKIN}, "
       "small gold hoop earrings and a thin gold necklace, light-wash denim short overalls over a plain white sleeveless V-neck "
       "tank top, white ankle socks, white sneakers, grey-green gardening gloves; modest, wholesome family-friendly DIY tutorial look")
HEAD = ("Photorealistic vertical 9:16 photo, real outdoor DIY tutorial look, warm golden-hour sunlight from the left, low sun "
        "behind the trees. Wide shot, fixed camera at the same low position and framing as the garden reference: the old tree "
        "stump in the middle, weathered wooden fence and green garden behind, gravel path at the bottom-left, lawn, a few big "
        "round stones at the base. ")
HEAD_CLOSE = "Photorealistic vertical 9:16 photo, real outdoor DIY tutorial look, warm golden-hour sunlight from the left. "
SAME = ("Same garden, same stump with exactly the same shape, bark and roots, same camera and light as the previous reference "
        "scene. ")
CLOSE = ("Close-up, fixed camera, same garden and golden-hour light as the previous reference scene, the stump bark filling the "
         "frame. ")
KIT = ("On the lawn at the bottom-left foreground lies a beige canvas tarp with {kit}. ")
REEL = "A small green outdoor cable reel sits on the lawn at the bottom-right. "
POSE = ("{W} kneels on the lawn at the left side of the stump, body turned three-quarter toward it so her face is visible, ")

FRAMES = [
    # (tên, gửi kèm, prompt)
    ("B-goc", "ng-A-elise-truoc.png; ng-G-thanh-pham.png",
     "The SECOND reference image is the finished fairy house: recreate exactly the same garden, the same stump shape, size, "
     "roots and bark, and the same camera framing, but at the very start of the project. Nothing has been added to the stump "
     "yet: bare bark with only natural small patches of moss, a bare sawn top, no door, no windows, no lantern, no roof, no "
     "chimney, no steps, no flower pot, no flowers at the base, no ivy, no roses. "
     + KIT.format(kit="an open wooden crate full of fairy house parts (wooden parts and black iron pieces poking out), a pile "
     "of four flat round stepping stones, a wide plastic garden tray holding a terracotta pot of pink flowers, several small "
     "pink flowering plants, a trailing ivy plant, a pink climbing rose plant and folded sheets of green moss, and a cordless "
     "drill") + REEL + POSE + "lifting an arched honey-brown wooden plank door with black iron strap hinges and a ring knocker "
     "out of the crate with both hands."),
    ("B2-ap-cua", "ng-A-elise-truoc.png; ng-B-goc.png",
     SAME + "Everything on the tarp and the cable reel stay as before. " + POSE + "now pressing the arched wooden door flat "
     "against the front of the stump, low in the middle above the roots, holding it in place with both hands."),
    ("B3-can-khoan", "ng-B2-ap-cua.png",
     CLOSE + "The arched honey-brown wooden plank door with black iron strap hinges and a ring knocker is held against the "
     "bark by her left gloved hand (grey-green gardening glove); her right gloved hand presses a cordless drill to the top "
     "hinge, driving the first screw. Only her gloved hands and forearms are visible."),
    ("C0-can-xong", "ng-B3-can-khoan.png",
     CLOSE + "Same close-up framing. The door is now fixed to the stump inside a neat arched wooden frame, all hinge screws "
     "driven; her right gloved hand holds the cordless drill on the last screw of the bottom hinge, her left hand rests on "
     "the door. Only her gloved hands and forearms are visible."),
    ("C-cua", "ng-A-elise-truoc.png; ng-B2-ap-cua.png; ng-C0-can-xong.png",
     SAME + "The arched wooden door in its arched frame is now fixed to the stump, exactly as in the third reference. "
     "The crate, stones, plant tray and drill on the tarp and the cable reel stay as before. " + POSE + "lifting a small "
     "round wooden window frame with glass out of the crate."),
    ("C2-cua-so", "ng-A-elise-truoc.png; ng-C-cua.png; ng-G-thanh-pham.png",
     SAME + "Now also fitted to the stump, exactly where they are in the last reference: the round window high on the right, "
     "the small square window to the right of the door, and the black iron lantern on its curved bracket on the left of the "
     "door. All lights are OFF, the window glass is dark. No roof, no chimney, no steps, no plants yet. The tarp, stones, "
     "plant tray, drill and cable reel stay as before. " + POSE + "both hands still pressing the square window into place."),
    ("D-mai", "ng-A-elise-truoc.png; ng-C2-cua-so.png; ng-G-thanh-pham.png",
     SAME + "Now also on the stump, exactly as in the last reference: the small curved wooden shingle roof awning over the "
     "door, and the small stone chimney turret with its tiny shingle roof standing on top of the stump. Lights still OFF. No "
     "steps, no moss on top, no plants yet. The tarp, stones, plant tray, drill and cable reel stay as before. " + POSE
     + "both hands still settling the chimney turret on top of the stump."),
    # khung giữa của việc xếp đá: Muse không đếm được 4 phiến trong 1 clip (đá trên bạt tự đầy lại)
    ("D1-hai-bac", "ng-A-elise-truoc.png; ng-D-mai.png; ng-D2-bac.png",
     SAME + "Everything on the stump is exactly as in the second reference scene, lights still OFF. Now only the two bottom "
     "flat round stone steps lie in front of the door, exactly where the two lowest steps are in the third reference; the "
     "pile on the tarp now has only TWO flat round stones left. The crate, plant tray, drill and cable reel stay as before. "
     + POSE + "both hands still setting the second stone step in place."),
    ("D2-bac","ng-A-elise-truoc.png; ng-D-mai.png; ng-G-thanh-pham.png",
     SAME + "Now four flat round stone steps lead up to the door, exactly as in the last reference; the stone pile on the "
     "tarp is gone. Lights still OFF. No moss blanket on top, no plants yet. The tarp with the crate, plant tray and drill, "
     "and the cable reel stay as before. " + POSE + "both hands still setting the top step stone in place under the door."),
    ("E-hoa", "ng-A-elise-truoc.png; ng-D2-bac.png; ng-G-thanh-pham.png",
     SAME + "Now planted and placed exactly as in the last reference: thick green moss covering the top of the stump and the "
     "roofs, pink climbing roses spilling over the top right, ivy climbing up the right side, the terracotta pot of pink "
     "flowers on the step beside the door, and pink flowering plants around the base. Lights still OFF. The garden tray on "
     "the tarp is now empty; the crate and drill stay, and the cable reel. " + POSE + "both gloved hands still pressing "
     "soil around the last pink plant at the base."),
    # khung đầu clip 7: đã ngồi sẵn ở cuộn dây, để Muse không phải cho cô di chuyển (bản đầu đèn sáng trước khi cắm)
    ("E2-cam", "ng-A-elise-truoc.png; ng-E-hoa.png; ng-F-sang.png",
     SAME + "Everything on the stump and the tarp is exactly as in the second reference scene, and all lights are still OFF: "
     "the round window, the square window and the lantern are dark. A black cable runs from the base of the stump to the "
     "green cable reel at the bottom-right. {W} kneels beside the cable reel exactly where she kneels in the third "
     "reference, face visible, holding the black plug in her gloved hand just in front of the reel socket, about to push "
     "it in."),
    ("F-sang", "ng-A-elise-truoc.png; ng-E-hoa.png; ng-G-thanh-pham.png",
     SAME + "Everything on the stump is as in the previous reference scene, but now the round window, the square window and "
     "the lantern are all ON, glowing warm yellow exactly as in the last reference. Still golden-hour daylight, not dark. "
     "The tarp stays exactly as in the previous reference scene: the wooden crate still holding the same leftover parts, "
     "the empty garden tray and the drill. A black cable runs from the base of the stump to the green "
     "cable reel at the bottom-right. " + WHO + " kneels beside the cable reel, face visible, one hand still on the plug she "
     "has just pushed into the reel, smiling at the glowing fairy house."),
    # thành phẩm cho clip 8: lấy từ F để gốc cây không đổi dáng khi cắt
    ("H-thanh-pham", "ng-F-sang.png",
     "Recreate the reference image exactly: same garden, same fairy house stump with every detail, same glowing windows and "
     "lantern, same golden-hour light and camera framing. Only one change: there is no person and no work gear: remove the "
     "woman, the tarp, the crate, the garden tray, the drill, the cable reel and the black cable; where they were, show the "
     "same green lawn and gravel path. No person in the scene."),
]


def main():
    path = os.path.join(EP, "gen-anh.csv")
    with open(path, encoding="utf-8") as f:
        rows = [r for r in csv.DictReader(f) if r["ten_file"] in ("ng-A-elise-truoc.png", "ng-G-thanh-pham.png")]
    for name, refs, prompt in FRAMES:
        rows.append({"stt": "", "ten_file": f"ng-{name}.png", "ty_le": "9:16", "gui_kem": refs,
                     "prompt": (HEAD_CLOSE if prompt.startswith(CLOSE) else HEAD) + prompt.replace("{W}", WHO) + TAIL})
    for i, r in enumerate(rows, 1):
        r["stt"] = str(i)
    with open(path, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["stt", "ten_file", "ty_le", "gui_kem", "prompt"])
        w.writeheader()
        w.writerows(rows)
    print(f"{len(rows)} dòng -> {path}")


if __name__ == "__main__":
    main()
