import csv, os, sys

# Chạy: python -I -X utf8 tao_gen_anh_tap10.py <đường dẫn content/elise-diy>
# Giữ dòng tb-G đã gen; thêm các khung B→F và H. Ảnh đã có thì gpt_anh bỏ qua.
ROOT = sys.argv[1]
EP = os.path.join(ROOT, "ep10-boat-garden")
TAIL = " Real photo, no text, no logos."
SKIN = "natural realistic skin texture with fine pores, no freckles, no airbrushing"
WHO = (f"the young European woman from the first reference: light brown hair in a neat bun with a few loose strands, {SKIN}, "
       "small gold hoop earrings and a thin gold necklace, light-wash denim short overalls over a plain white sleeveless V-neck "
       "tank top, white ankle socks, white sneakers, grey-green gardening gloves; modest, wholesome family-friendly DIY tutorial look")
HEAD = ("Photorealistic vertical 9:16 photo, real outdoor DIY tutorial look, warm golden-hour sunlight from the back-left, low "
        "sun behind the trees. Wide shot, fixed camera at the same position and framing as the garden reference: the wooden "
        "rowboat lying on the lawn in three-quarter view, pointed bow at the front-left and stern at the back-right, a row of "
        "big smooth grey river stones along its base, lush garden, weathered wooden fence and trees behind, a small gravel "
        "path in the foreground. ")
SAME = ("Same garden, same boat with exactly the same shape, size and position, same stones, same camera and light as the "
        "previous reference scene. ")
GEAR = ("On the lawn at the bottom-right foreground, beside the gravel path: a wheelbarrow {soil} with a shovel, a can of "
        "pastel sky-blue paint with a roller tray and paint roller, a roll of black landscape fabric, a wide garden tray holding "
        "{plants}, and a wooden lantern post with a black iron lantern lying on the grass. ")
ALL_PLANTS = ("two pots of blue-violet hydrangeas, pots of pink cosmos, pastel pink roses, white daisies and trailing ivy")
POSE = "{W} kneels on the lawn in front of the boat near the bow, body turned three-quarter toward it so her face is visible, "
OLD = ("the hull is old and neglected: cracked, peeling old white and faded blue paint flaking off, weathered grey wood "
       "showing through, a dull grey weathered rim")

FRAMES = [
    # (tên, gửi kèm, prompt)
    ("B-cu", "tb-A-elise-truoc.png; tb-G-thanh-pham.png",
     "The SECOND reference image is the finished project: recreate exactly the same garden, the same boat shape, size and "
     "position, the same stones and camera framing, but at the very start of the project: " + OLD + "; the boat is empty "
     "inside except a few dry leaves: no soil, no flowers, no lantern post. "
     + GEAR.format(soil="full of dark garden soil", plants=ALL_PLANTS) + POSE
     + "scraping the peeling paint off the near side of the hull with a wire brush, flakes of old paint falling."),
    ("B2-cao", "tb-A-elise-truoc.png; tb-B-cu.png",
     SAME + "The near side of the hull is now scraped clean: bare weathered grey-brown wood with only a few small specks of "
     "old paint left; the rim is still dull grey. Everything in the foreground stays exactly as before. " + POSE
     + "still brushing the last patch near the stern with the wire brush."),
    ("C-son", "tb-A-elise-truoc.png; tb-B2-cao.png; tb-G-thanh-pham.png",
     SAME + "Now about half of the near side of the hull, from the bow, is freshly painted smooth pastel sky blue exactly like "
     "the colour in the last reference; the rest toward the stern is still bare scraped wood. Everything in the foreground "
     "stays as before. " + POSE + "rolling pastel blue paint onto the hull with the paint roller, the wet edge of the paint "
     "just in front of the roller."),
    ("C2-lot", "tb-A-elise-truoc.png; tb-C-son.png; tb-G-thanh-pham.png",
     SAME + "The whole hull is now painted smooth pastel sky blue and the rim and bow post are honey-varnished wood, exactly "
     "as in the last reference. Inside, the boat is lined with black landscape fabric, still empty of soil. The paint can "
     "and roller are closed and set aside; the fabric roll is gone. The wheelbarrow is still full of soil. "
     + POSE + "tipping the first shovelful of dark soil from the wheelbarrow into the bow end of the boat."),
    ("D-dat", "tb-A-elise-truoc.png; tb-C2-lot.png",
     SAME + "The boat is now filled with dark garden soil level just below the rim along its whole length; the wheelbarrow "
     "is now empty. No plants yet. Everything else stays as before. " + POSE + "patting the soil flat with the back of the "
     "shovel."),
    ("E1-cam-tu", "tb-A-elise-truoc.png; tb-D-dat.png; tb-G-thanh-pham.png",
     SAME + "Now two big blue-violet hydrangea bushes are planted at the stern end of the boat, exactly as in the last "
     "reference; the rest of the soil is still bare. The two hydrangea pots on the tray are now empty; the other plant pots "
     "stay. " + POSE + "both gloved hands still pressing soil around the second hydrangea."),
    ("E2-hoa", "tb-A-elise-truoc.png; tb-E1-cam-tu.png; tb-G-thanh-pham.png",
     SAME + "Now the middle and bow end are also planted exactly as in the last reference: pink cosmos, pastel pink roses, "
     "white daisies, and trailing ivy spilling over the near side. The garden tray now holds only empty pots. No lantern post "
     "yet: it still lies on the grass. " + POSE + "both hands still draping the last ivy trail over the rim."),
    # khung cuối clip 6 mới: bản đầu cột đèn ngắn rồi tự dài ra cắm xuống đất -> cho Muse thấy cột đủ dài ngay khi dựng
    ("F00-dung-cot", "tb-F0-den.png",
     "Recreate the reference image exactly: same garden, same flower boat, same upright wooden lantern post at the bow "
     "with the lantern OFF, same gear on the lawn (nothing lying on the grass where the post used to be), same light and "
     "camera framing, same woman and clothes. Only one change: she now stands just left of the post, both gloved hands "
     "gripping the post at chest height, leaning on it to push it down into the ground; her face is visible."),
    # khung đầu clip 6 bản 4: Muse nhặt cột từ cỏ thì nhân đôi đèn và cắm cột ra ngoài -> bắt đầu lúc đã cầm cột trên mũi
    ("F01-cam-cot", "tb-F00-dung-cot.png",
     "Recreate the reference image exactly: same garden, same flower boat, same gear on the lawn (no lantern and no post on "
     "the grass), same light and camera framing, same woman and clothes, same wooden lantern post with the black iron "
     "lantern hanging from its arm, lantern OFF and dark. Only one change: the post is not in the soil yet: she holds it "
     "upright with both gloved hands, lifted so its bottom end hangs about 30 cm above the soil inside the boat, just behind "
     "the pointed bow, right above the spot where it stands in the reference; her face is visible."),
    ("F0-den","tb-A-elise-truoc.png; tb-E2-hoa.png; tb-G-thanh-pham.png",
     SAME + "Now the wooden lantern post stands at the bow with the black iron lantern hanging from its arm, exactly as in the "
     "last reference, but the lantern is OFF and dark. Everything else is as in the second reference scene. "
     "The foreground gear stays exactly as in the second reference scene: the wheelbarrow, the shovel, the paint can, the roller tray and the garden tray with its empty pots; only the lantern post has moved from the grass to the bow. {W} stands beside "
     "the post, face visible, one gloved hand on the small switch on the lantern, about to switch it on."),
    ("F-sang", "tb-A-elise-truoc.png; tb-F0-den.png; tb-G-thanh-pham.png",
     SAME + "Everything is as in the second reference scene, but now the lantern is ON, glowing warm yellow exactly as in the "
     "last reference. Still golden-hour daylight, not dark. The foreground gear stays exactly as in the second "
     "reference scene. {W} stands beside the post, face visible, her hand just leaving "
     "the switch, smiling at the flower boat."),
    # thành phẩm cho clip cuối: lấy từ F để thuyền không đổi dáng khi cắt
    ("H-thanh-pham", "tb-F-sang.png",
     "Recreate the reference image exactly: same garden, same flower boat with every detail, same glowing lantern, same "
     "golden-hour light and camera framing. Only one change: there is no person and no work gear: remove the woman, the "
     "wheelbarrow, the shovel, the paint can, the roller tray, the garden tray and the empty pots; where they were, show the "
     "same green lawn and gravel path. No person in the scene."),
]


def main():
    path = os.path.join(EP, "gen-anh.csv")
    with open(path, encoding="utf-8") as f:
        rows = [r for r in csv.DictReader(f) if r["ten_file"] == "tb-G-thanh-pham.png"]
    for name, refs, prompt in FRAMES:
        head = "" if name.startswith("H-") else HEAD
        rows.append({"stt": "", "ten_file": f"tb-{name}.png", "ty_le": "9:16", "gui_kem": refs,
                     "prompt": head + prompt.replace("{W}", WHO) + TAIL})
    for i, r in enumerate(rows, 1):
        r["stt"] = str(i)
    with open(path, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["stt", "ten_file", "ty_le", "gui_kem", "prompt"])
        w.writeheader()
        w.writerows(rows)
    print(f"{len(rows)} dòng -> {path}")


if __name__ == "__main__":
    main()
