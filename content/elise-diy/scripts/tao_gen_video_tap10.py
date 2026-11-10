import csv, os, sys

ep = sys.argv[1]
A, ROOM = "tb-A-elise-truoc.png", "tb-B-cu.png"
HEAD = ("Real outdoor DIY timelapse video, vertical 9:16, photorealistic, not animated, no text, no logos. One continuous fixed "
        "shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image "
        "and end exactly like the end-frame image. The garden stays as in the garden reference the whole clip: the same wooden "
        "rowboat with exactly the same shape, size and position, the row of big grey river stones along its base, trees and "
        "wooden fence behind, the gravel path and the gear on the lawn in the foreground; warm golden-hour sunlight from the "
        "back-left that stays the same. Only this one woman is ever in the scene. ")
WHO = ("the young woman from the reference (light brown hair in a bun, no freckles, white sleeveless V-neck tank top, light denim "
       "short overalls, white sneakers, grey-green gardening gloves)")
PACE = (" She works at a natural, steady pace from the first second and never stands idle or sways while holding an item. "
        "Everything that appears is carried and placed by her own hands, one item at a time; nothing appears, vanishes or "
        "changes by itself.")
OFF = "The lantern stays OFF. "
MUSIC = "Nhạc acoustic nhẹ, ấm, không lời, tiếng chim hót buổi chiều"

clips = [
    ("Clip 1 - cạo sơn", "tb-B-cu.png", "tb-B2-cao.png", HEAD,
     WHO + " scrapes the cracked, peeling old paint off the near side of the hull with the wire brush, working from the bow "
     "toward the stern; flakes of old paint fall onto the grass and the bare weathered wood shows, as in the end frame.",
     MUSIC + ", tiếng bàn chải sắt cạo gỗ."),
    ("Clip 2 - lăn sơn", "tb-B2-cao.png", "tb-C-son.png", HEAD,
     WHO + " dips the paint roller in the roller tray and rolls smooth pastel sky-blue paint onto the near side of the hull "
     "in long strokes, starting at the bow; the blue spreads only where the roller passes, ending with about half the side "
     "painted, as in the end frame.", MUSIC + ", tiếng con lăn sơn."),
    ("Clip 3 - xúc đất", "tb-C2-lot.png", "tb-D-dat.png", HEAD,
     "The painted hull and varnished rim do not change. " + WHO + " shovels dark soil from the wheelbarrow into the "
     "fabric-lined boat one shovelful at a time, moving along from the bow to the stern; the soil rises gradually and the "
     "wheelbarrow empties gradually; she ends patting the soil flat, as in the end frame.", MUSIC + ", tiếng xẻng xúc đất."),
    ("Clip 4 - cẩm tú cầu", "tb-D-dat.png", "tb-E1-cam-tu.png", HEAD,
     "The boat and soil do not change. " + WHO + " takes one blue-violet hydrangea pot from the garden tray, tips the plant "
     "out and plants it at the stern end, then does the same with the second hydrangea, ending pressing soil around it, as "
     "in the end frame. Only two hydrangeas, nothing else is planted.", MUSIC + ", tiếng đất."),
    ("Clip 5 - trồng hoa", "tb-E1-cam-tu.png", "tb-E2-hoa.png", HEAD,
     "The boat and the two hydrangeas do not change. " + WHO + " takes the pots of pink cosmos, pastel pink roses and white "
     "daisies from the tray one at a time and plants them in the middle and bow end, then lays the trailing ivy so it spills "
     "over the near side, ending draping the last ivy trail over the rim, as in the end frame. Flowers appear only where "
     "she plants them.", MUSIC + ", tiếng đất, lá sột soạt."),
    # bản 1 cột tự dài ra; bản 2 cắm ra ngoài thuyền; bản 3 nhân đôi đèn, đèn tự sáng -> bản 4 bắt đầu lúc đã cầm cột (F01)
    ("Clip 6 - cột đèn", "tb-F01-cam-cot.png", "tb-F00-dung-cot.png", HEAD,
     OFF + "The flower boat and the gear on the lawn do not change; there is no lantern and no post on the grass. " + WHO
     + " holds the wooden lantern post upright above the soil inside the boat, just behind the pointed bow; she lowers it "
     "straight down so its bottom end goes into the soil inside the boat, then leans on it with both hands and pushes it "
     "firmly down, as in the end frame. There is only one post and one lantern, the one on the post; the lantern stays dark "
     "and unlit the whole clip. The post keeps exactly the same length and shape and never touches the lawn outside the "
     "boat.", MUSIC + ", tiếng gỗ, tiếng đất."),
    ("Clip 7 - bật đèn", "tb-F0-den.png", "tb-F-sang.png", HEAD,
     "The flower boat, the post and the foreground gear do not change; the daylight stays golden, not dark. The lantern is "
     "dark at the start. " + WHO + " flips the small switch on the lantern at about 1 second; only at that moment the "
     "lantern lights up with a warm yellow glow; she lowers her hand and smiles at the flower boat, as in the end frame.",
     MUSIC + ", tiếng công tắc tách."),
    ("Clip 8 - thành phẩm", "tb-H-thanh-pham.png", "", "",
     "Real outdoor video, vertical 9:16, photorealistic, not animated, no text, no logos. The finished flower boat from the "
     "start frame in a garden at golden hour, no person. Very slow gentle push-in toward the flowers, nothing else moves "
     "except leaves and flowers swaying softly in a light breeze, sunlight flickering through the trees and the warm glow of "
     "the lantern. The boat keeps exactly the same shape and details the whole clip.",
     MUSIC + ", nhạc lên cao nhẹ ở cuối."),
]

# cắt sau khi xem khung hình (cat_tu, cat_den, dung_giay)
CUTS = {
    1: (3.0, 10.0, 4.5),  # 0-3 s mảng sơn xanh cũ to, chưa thấy cạo rõ
    2: (3.0, 9.5, 4.5),   # 0-3 s quét chổi, từ 3 s mới lăn sơn
    3: (0, 4.5, 3.5),     # từ 5 s đất tự đầy, xe cút kít nhảy chỗ
    5: (0, 6.0, 4.0),     # từ 6,5 s nhảy sang cận, hoa tự đầy thuyền
    6: (0, 2.5, 2.5),     # hạ cột vào đất trong thuyền; từ 3 s cột nhấc lên hạ xuống
    7: (1.0, 5.0, 3.5),   # đèn sáng ~3,5 s; từ 5 s nhảy sang cận
    8: (0, 5.5, 5.0),
}
FILE = {}

with open(os.path.join(ep, "gen-video.csv"), "w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f)
    w.writerow(["stt", "doan", "luu_tai", "khung_dau", "khung_cuoi", "anh_tham_chieu", "prompt", "am_thanh",
                "dung_giay", "che_do", "cat_tu", "cat_den"])
    for i, (doan, a, b, head, body, sound) in enumerate(clips, 1):
        person = head != ""
        refs = (A if a == ROOM else f"{A}; {ROOM}") if person else ""  # Muse từ chối ảnh trùng khung đầu
        file, cut = FILE.get(i, f"video\\clip{i}.mp4"), CUTS.get(i, ("", "", ""))
        w.writerow([i, doan, file, a, b, refs, head + body + (PACE if head else ""), sound,
                    cut[2], "tang_toc", cut[0], cut[1]])
print(len(clips), "clips")
