import csv, os, sys

ep = sys.argv[1]
A, ROOM = "cg-A-elise-truoc.png", "cg-B-canh.png"
HEAD = ("Real home DIY timelapse video, vertical 9:16, photorealistic, not animated, no text, no logos. One continuous fixed "
        "shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image "
        "and end exactly like the end-frame image. The room stays as in the room reference the whole clip: white wall with the "
        "brass hook, snowy window at the left, white rustic bench, light grey sofa with cream knit cushions and chunky blanket, "
        "cream wool rug, light oak floor; soft daylight. Only this one woman is ever in the scene. ")
WHO = ("the young woman from the reference (light brown hair in a bun, no freckles, white crop top with a small brown 'Elise' "
       "logo, beige pleated skirt, sheer black polka dot tights, no shoes)")
PACE = (" She works at a natural, steady pace from the first second and never stands idle or sways while holding an item. "
        "Everything that appears is carried and placed by her own hands, one item at a time; nothing appears, vanishes or "
        "changes by itself.")
OFF = "The fairy lights, candles and lantern stay OFF. "
MUSIC = "Nhạc Giáng sinh nhẹ, ấm, không lời"

clips = [
    ("Clip 1 - buộc cành", "cg-B-canh.png", "cg-B2-buoc.png",
     OFF + WHO + " ties the six branches together with the jute twine on the bench, longest at the bottom and shortest at the "
     "top, knotting the twine at both ends of each branch so the branches form a flat triangular ladder; then she lifts it by "
     "the twine loop, as in the end frame.", MUSIC + ", tiếng dây đay sột soạt."),
    ("Clip 2 - treo lên móc", "cg-B2-buoc.png", "cg-C-treo.png",
     OFF + WHO + " carries the branch tree to the wall, hangs its twine loop on the brass hook and straightens the bottom "
     "branch so it hangs level, as in the end frame. The tree keeps its branches and twine.", MUSIC + "."),
    ("Clip 3 - quấn lá thông và dây đèn", "cg-C-treo.png", "cg-C2-la-thong.png",
     OFF + "The hanging tree does not move. " + WHO + " takes green pine sprigs and the thin copper fairy light wire from the "
     "crate and wraps them along each branch, from the top branch down to the bottom one, as in the end frame.",
     MUSIC + ", tiếng lá thông sột soạt."),
    ("Clip 4 - treo đồ trang trí", "cg-C2-la-thong.png", "cg-D-trang-tri.png",
     OFF + "The tree and its pine garland do not move. " + WHO + " takes small pinecones, white and red baubles and little "
     "wooden stars from the crate one at a time and hangs each on a branch, working from the top down, then sets the small "
     "wooden star at the top, ending with the last red bauble on the bottom branch, as in the end frame.",
     MUSIC + ", tiếng quả châu leng keng."),
    ("Clip 5 - bày băng ghế", "cg-D-trang-tri.png", "cg-D2-bay-ghe.png",
     OFF + "The tree does not change. " + WHO + " takes the three white pillar candles on wood slices, the two small white "
     "ceramic trees and the black lantern out of the crate one at a time and arranges them on the bench under the tree, "
     "then with one hand slides the empty crate aside out of frame at the left; she ends setting the lantern down, as in "
     "the end frame.",
     MUSIC + "."),
    ("Clip 6 - cắm điện, đèn sáng", "cg-D2-bay-ghe.png", "cg-F-sang.png",
     "The tree, decorations and bench keep exactly the same shape, size and place; the wall stays white, daylight stays the "
     "same. " + WHO + " crouches at the right end of the bench and pushes the light plug into the wall socket (0-2 s); the "
     "copper fairy lights along every branch switch on at once with tiny warm bulbs and the candles and lantern glow softly; "
     "she smiles at the glowing tree, as in the end frame.", MUSIC + ", tiếng cắm điện tách."),
]

with open(os.path.join(ep, "gen-video.csv"), "w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f)
    w.writerow(["stt", "doan", "luu_tai", "khung_dau", "khung_cuoi", "anh_tham_chieu", "prompt", "am_thanh",
                "dung_giay", "che_do", "cat_tu", "cat_den"])
    for i, (doan, a, b, body, sound) in enumerate(clips, 1):
        w.writerow([i, doan, f"video\\clip{i}.mp4", a, b, f"{A}; {ROOM}", HEAD + body + PACE, sound, "", "tang_toc", "", ""])
print(len(clips), "clips")
