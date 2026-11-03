import csv, os, sys

ep = sys.argv[1]
A = "kg-A-elise-truoc.png"
HEAD = ("Real sped-up home DIY timelapse video, vertical 9:16, photorealistic, not animated, no text, no logos. Fixed camera, same "
        "framing as the start frame, no zoom, the woman's whole body and face stay in frame. The video must start exactly like the "
        "start-frame image and end exactly like the end-frame image. Same light sage-green wall, walnut sideboard with its gifts and "
        "lantern the whole clip. ")
WHO = "the young woman from the reference (light brown hair in a bun, no freckles, white tank top, black leggings, white Nike sneakers)"
OFF = "All garland bulbs, candles and the lantern stay switched OFF for the whole clip. "
ONE = "Each item appears only in her hand and stays where she puts it; never several items appear at once. "
MUSIC = "Nhạc Giáng sinh nhẹ, ấm, không lời"

clips = [
    ("Clip 1 - lắp kệ", "kg-B-ke-tron.png", "kg-B2-ke-xong.png",
     OFF + WHO + " lifts the walnut shelf boards one at a time from where they lean against the sideboard and slides each one onto "
     "the wall above the sideboard, starting with the longest at the bottom and going up with shorter ones, until six shelves form a "
     "stepped triangle as in the end frame. Then she picks up the pine garland coil. Mounted shelves never move. The decoration box stays "
     "on the floor.", MUSIC + ", tiếng gỗ đặt lên giá lộc cộc.", 4, "tang_toc"),
    ("Clip 2 - quấn dây lá", "kg-B2-ke-xong.png", "kg-C-day-la.png",
     OFF + "The six shelves do not move. " + WHO + " lays the thin pine garland along the front edge of each shelf, from the top shelf "
     "down to the bottom one, as in the end frame. Then she takes one mini frosted bottle-brush tree from the box.",
     MUSIC + ", tiếng lá thông sột soạt.", 4, "tang_toc"),
    ("Clip 3 - bày cây thông và nến", "kg-C-day-la.png", "kg-C2-cay-nen.png",
     OFF + ONE + WHO + " takes mini frosted bottle-brush trees and white LED pillar candles from the box one by one and places them on "
     "the shelves, a few on each shelf, working from the top down, as in the end frame. The box slowly gets emptier.",
     MUSIC + ".", 4, "tang_toc"),
    ("Clip 4 - bày quà nhỏ", "kg-C2-cay-nen.png", "kg-D-qua-nho.png",
     OFF + ONE + WHO + " takes tiny wrapped gifts, small gold bells and red berry picks from the box one by one and places them between "
     "the trees and candles on every shelf, as in the end frame. At the end only the gold star is left in the box and she holds it.",
     MUSIC + ", tiếng chuông nhỏ leng keng.", 4, "tang_toc"),
    ("Clip 5 - gắn sao", "kg-D-qua-nho.png", "kg-D2-sao.png",
     OFF + WHO + " reaches up and stands the gold glitter star on top of the highest shelf, then lifts the empty cardboard box and "
     "sets it down out of frame on the left, and comes back to smile at the shelf tree with hands clasped, as in the end frame. "
     "Shelves and decorations do not change.", MUSIC + ".", 2.5, "tang_toc"),
    ("Clip 6 - bật đèn", "kg-E2-toi.png", "kg-F-sang.png",
     "Evening, the same light sage-green wall (never orange). " + WHO + " stands still holding the small white remote, looks at the "
     "shelf tree and presses the button (about 2 s): the garland bulbs, the LED candles and the lantern all switch on at once with a "
     "soft warm glow. The shelves and every decoration keep exactly the same shape, size and place; no zoom, no reframing. She smiles "
     "happily, as in the end frame.", MUSIC + " lên cao trào, tiếng công tắc tách.", 4, "tang_toc"),
    ("Clip 7 - khoe thành phẩm", "kg-F-sang.png", "",
     "Evening, the glowing shelf Christmas tree from the start frame. Very slow, gentle camera push-in toward the shelf tree; the woman "
     "stays still, smiling. The lights twinkle softly. Shelves, decorations, star, sideboard and gifts keep their exact shape and place; "
     "nothing new appears.", MUSIC + ", kết thúc nhẹ.", 3, "cat"),
]

with open(os.path.join(ep, "gen-video.csv"), "w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f)
    w.writerow(["stt", "doan", "luu_tai", "khung_dau", "khung_cuoi", "anh_tham_chieu", "prompt", "am_thanh",
                "dung_giay", "che_do", "cat_tu", "cat_den"])
    for i, (doan, a, b, body, sound, sec, mode) in enumerate(clips, 1):
        head = HEAD if b else HEAD.replace(" and end exactly like the end-frame image", "")
        w.writerow([i, doan, f"video\\clip{i}.mp4", a, b, A, head + body, sound, sec, mode, "", ""])
print(len(clips), "clips")
