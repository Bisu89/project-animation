import csv, os, sys

ep = sys.argv[1]
A, ROOM, LIT = "hq-A-elise-truoc.png", "hq-B-dong-qua.png", "hq-F-sang.png"
HEAD = ("Real home DIY timelapse video, vertical 9:16, photorealistic, not animated, no text, no logos. One continuous fixed "
        "shot: same framing as the start frame, no zoom, no pan, no cuts, no scene changes. The video must start exactly like the "
        "start-frame image. The room stays exactly as in the room reference image the whole clip: light grey plank wall, pine "
        "wreath, two gold paper stars, the light grey wingback armchair with the dark green knitted cushion, the round black wire "
        "basket side table with baubles, the small potted pine and the two red mugs, the dark faux fur rug; daylight. Only this one "
        "woman is ever in the scene; no other person appears. ")
WHO = ("the young woman from the reference (light brown hair in a bun, no freckles, white crop top with a small brown logo, "
       "beige pleated skirt, black high heels)")
TREE = (" The tower is a stepped pyramid Christmas tree: every new row is narrower than the row below and centred on it, so it "
        "tapers to a single small box on top.")
PACE = (" She works at a natural, steady pace and never stands idle or sways while holding an item. Every box or bauble that "
        "appears is carried and placed by her own hands, one at a time; nothing appears, vanishes or changes by itself.")
MUSIC = "Nhạc Giáng sinh nhẹ, ấm, không lời"

clips = [
    ("Clip 1 - tầng đáy và tầng giữa", "hq-B-dong-qua.png", "", f"{A}; {ROOM}",
     "The curtain fairy lights on the wall stay OFF. " + WHO + ": from the very first second she lifts the largest boxes from the "
     "pile one by one and sets them side by side on the floor against the wall at the left, forming a wide bottom row (0-4 s); "
     "4-10 s she stacks medium boxes on top, each row narrower. The pile in the middle visibly shrinks with every box she takes."
     + TREE + PACE, MUSIC + ", tiếng hộp giấy đặt xuống."),
    ("Clip 2 - các tầng trên và nơ", "@cuoi:1", "hq-C2-dinh.png", f"{A}; {ROOM}",
     "Continue exactly from the start frame. The curtain fairy lights stay OFF. " + WHO + ": 0-7 s she takes the remaining small "
     "boxes from the pile one by one and stacks them higher, each row narrower, until a single small box sits on top; 7-9 s she "
     "sets the dark green metallic bow on the top box, ending as in the end frame. The open box of baubles stays on the floor."
     + TREE + PACE, MUSIC + "."),
    ("Clip 3 - nhét quả châu", "@cuoi:2", "", f"{A}; {ROOM}",
     "Continue exactly from the start frame; the gift tower keeps exactly its shape and boxes. The curtain fairy lights stay OFF. "
     + WHO + ": she takes gold, copper, red and teal baubles from the open box on the floor one at a time and tucks each into a gap "
     "between the boxes, working from the top of the tower down at a steady pace, so the baubles increase gradually over the whole "
     "10 seconds; she stays beside the tower the whole time and is tucking the last bauble at the end." + PACE,
     MUSIC + ", tiếng quả châu leng keng."),
    ("Clip 4 - cắm điện, đèn sáng", "@cuoi:3", "", f"{A}; {ROOM}; {LIT}",
     "Continue exactly from the start frame; the gift tower keeps exactly the same boxes, bow and baubles. " + WHO + ": 0-2 s she "
     "bends and plugs the fairy light cable into the wall socket at the bottom right; 2-3 s the curtain of warm-white fairy light "
     "strands on the wall switches on all at once and glows softly with gentle bokeh, the gold paper stars shine and the boxes and "
     "baubles catch the warm light, like the lit reference image; 3-6 s she straightens up and smiles at the glowing gift tree. "
     "Nothing new appears." + PACE, MUSIC + ", tiếng cắm điện tách, kết thúc nhẹ."),
]

with open(os.path.join(ep, "gen-video.csv"), "w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f)
    w.writerow(["stt", "doan", "luu_tai", "khung_dau", "khung_cuoi", "anh_tham_chieu", "prompt", "am_thanh",
                "dung_giay", "che_do", "cat_tu", "cat_den"])
    for i, (doan, start, end, refs, body, sound) in enumerate(clips, 1):
        w.writerow([i, doan, f"video\\clip{i}.mp4", start, end, refs, HEAD + body, sound, "", "tang_toc", "", ""])
print(len(clips), "clips")
