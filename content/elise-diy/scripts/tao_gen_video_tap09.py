import csv, os, sys

ep = sys.argv[1]
A, ROOM = "ng-A-elise-truoc.png", "ng-B-goc.png"
HEAD = ("Real outdoor DIY timelapse video, vertical 9:16, photorealistic, not animated, no text, no logos. One continuous fixed "
        "shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the start-frame image "
        "and end exactly like the end-frame image. The garden stays as in the garden reference the whole clip: the same old tree "
        "stump with exactly the same shape, bark and roots, weathered wooden fence and green trees behind, gravel path at the "
        "bottom-left, lawn, big round stones at the base, beige tarp on the lawn with the wooden crate, the garden tray and the "
        "cordless drill, a green cable reel at the bottom-right; warm golden-hour sunlight from the left that stays the same. "
        "Only this one woman is ever in the scene. ")
CLOSE = ("Real outdoor DIY timelapse video, vertical 9:16, photorealistic, not animated, no text, no logos. One continuous fixed "
         "close-up shot: same framing as the start frame, no zoom, no pan, no cuts. The video must start exactly like the "
         "start-frame image and end exactly like the end-frame image. Warm golden-hour light that stays the same. Only her two "
         "gloved hands and forearms are ever in the frame. ")
WHO = ("the young woman from the reference (light brown hair in a bun, no freckles, white sleeveless V-neck tank top, light denim "
       "short overalls, white sneakers, grey-green gardening gloves)")
PACE = (" She works at a natural, steady pace from the first second and never stands idle or sways while holding an item. "
        "Everything that appears is carried and placed by her own hands, one item at a time; nothing appears, vanishes or "
        "changes by itself.")
OFF = "The window lights and the lantern stay OFF. "
MUSIC = "Nhạc acoustic nhẹ, ấm, không lời, tiếng chim hót buổi chiều"

clips = [
    ("Clip 1 - áp cửa", "ng-B-goc.png", "ng-B2-ap-cua.png", HEAD,
     WHO + " kneels at the left of the bare stump, lifts the arched wooden door with black iron hinges out of the crate and "
     "presses it flat against the front of the stump, low in the middle above the roots, holding it there with both hands, "
     "as in the end frame. The stump has nothing else on it.", MUSIC + ", tiếng gỗ chạm."),
    ("Clip 2 - khoan vít (cận)", "ng-B3-can-khoan.png", "ng-C0-can-xong.png", CLOSE,
     "Her left gloved hand holds the arched wooden door against the bark; her right gloved hand drives screws through the "
     "black iron hinges with the yellow cordless drill, top hinge first, then the bottom hinge, then fixes the arched wooden "
     "frame around the door, ending on the last screw of the bottom hinge, as in the end frame. The door keeps exactly the "
     "same shape, planks, hinges and ring knocker.", MUSIC + ", tiếng máy khoan ngắn."),
    ("Clip 3 - cửa sổ và đèn lồng", "ng-C-cua.png", "ng-C2-cua-so.png", HEAD,
     OFF + "The door does not change. " + WHO + " fits the round wooden window high on the right of the stump, then takes "
     "the black iron lantern on its curved bracket from the crate and fixes it on the left of the door, then presses the "
     "small square window into place to the right of the door, as in the end frame.", MUSIC + ", tiếng gỗ, tiếng vít."),
    ("Clip 4 - mái và ống khói", "ng-C2-cua-so.png", "ng-D-mai.png", HEAD,
     OFF + "The door, windows and lantern do not change. " + WHO + " takes the curved wooden shingle roof awning from the "
     "crate and fits it over the door, then rises on her knees and sets the small stone chimney turret with its tiny shingle "
     "roof on top of the stump, as in the end frame.", MUSIC + ", tiếng gỗ chạm."),
    # bản đầu xếp 4 phiến trong 1 clip: đá trên bạt tự đầy lại, cuối clip chồng thành cột -> tách 2 clip, mỗi clip 2 phiến
    ("Clip 5a - 2 bậc dưới", "ng-D-mai.png", "ng-D1-hai-bac.png", HEAD,
     OFF + "The stump and everything fixed on it do not change. At the start the pile on the tarp has four flat round "
     "stones. " + WHO + " takes one stone from the pile and lays it flat on the ground in front of the door as the bottom "
     "step, then takes a second stone and lays it just behind and above the first as the second step, as in the end frame. "
     "The pile on the tarp gets smaller by one stone each time she takes one and ends with exactly two stones; stones never "
     "come back to the pile.", MUSIC + ", tiếng đá chạm nhau."),
    ("Clip 5b - 2 bậc trên", "ng-D1-hai-bac.png", "ng-D2-bac.png", HEAD,
     OFF + "The stump, everything fixed on it and the two bottom steps do not change. At the start the pile on the tarp has "
     "exactly two flat round stones. " + WHO + " takes one of them and sets it as the third step, then takes the last one "
     "and sets it as the top step right under the door, as in the end frame. The pile on the tarp gets smaller by one stone "
     "each time and ends empty; stones never come back to the pile and are never stacked into a tower.",
     MUSIC + ", tiếng đá chạm nhau."),
    ("Clip 6 - rêu và hoa", "ng-D2-bac.png", "ng-E-hoa.png", HEAD,
     OFF + "The door, windows, lantern, roof, chimney and steps do not change. " + WHO + " lays sheets of green moss from the "
     "tray over the top of the stump and the roofs, sets the pink climbing rose on top and lets it spill over the right, "
     "tucks the ivy up the right side, and plants the pink flowering plants at the base, ending pressing soil around the last "
     "plant, as in the end frame. The tray ends empty.", MUSIC + ", tiếng đất, tiếng rêu sột soạt."),
    # bản đầu đi từ ng-E-hoa: đèn sáng trước khi cắm và cảnh nhảy khi cô đi tới cuộn dây -> khung đầu mới ng-E2-cam
    ("Clip 7 - cắm điện, đèn sáng", "ng-E2-cam.png", "ng-F-sang.png", HEAD,
     "The fairy house keeps exactly the same shape, details and plants; the daylight stays golden, not dark. The round "
     "window, the square window and the lantern are dark at the start. " + WHO + " stays kneeling beside the green cable "
     "reel and pushes the black plug she is holding into the reel at about 1 second; only at that moment the round window, "
     "the square window and the lantern switch on together with a warm yellow glow; she looks up at the glowing fairy house "
     "and smiles, as in the end frame. The tarp, crate, tray and drill do not move.", MUSIC + ", tiếng cắm điện tách."),
    ("Clip 8 - thành phẩm", "ng-H-thanh-pham.png", "", "",
     "Real outdoor video, vertical 9:16, photorealistic, not animated, no text, no logos. The finished fairy house tree stump "
     "from the start frame in a garden at golden hour, no person. Very slow gentle push-in toward the door, nothing else "
     "moves except leaves and flowers swaying softly in a light breeze, sunlight flickering through the trees and the warm "
     "glow in the windows and lantern. The fairy house keeps exactly the same shape and details the whole clip.",
     MUSIC + ", nhạc lên cao nhẹ ở cuối."),
]

# cắt sau khi xem khung hình (cat_tu, cat_den, dung_giay)
CUTS = {
    1: (0, 3.0, 2.5),    # cửa đã áp xong ~2 s, sau đó chỉ miết tay
    2: (0, 5.0, 3.5),    # từ 5 s nẹp khung cửa tự mọc ra
    3: (0, 5.0, 3.5),    # cửa sổ tròn + đèn lồng; từ 7 s cô gắn cửa sổ vuông lên mặt cửa (sai)
    4: (0, 7.0, 5.0),    # sau 7 s ngồi không
    "5a": (2.0, 5.5, 2.5),  # 1 phiến từ chồng 4 -> bậc 1; từ 6 s đá tự hiện ở bậc
    "5b": (5.0, 9.0, 3.0),  # 1 phiến từ chồng 2 -> bậc trên; đầu clip đá tự hiện
    6: (0.5, 5.5, 4.0),  # bản lần 1: lần 2 rêu và hoa tự phủ kín ở 5 s; lần 1 từ 6 s có người thứ hai
    7: (0, 4.5, 4.0),    # cắm phích ~1,5 s, đèn sáng ~2-2,5 s, cười tới 4,5 s
    8: (0, 6.0, 6.0),
}
FILE = {6: "video\\clip6.mp4.lan1.mp4"}
STT = ["1", "2", "3", "4", "5a", "5b", "6", "7", "8"]  # 5a/5b chèn vào, giữ số các clip đã gen

with open(os.path.join(ep, "gen-video.csv"), "w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f)
    w.writerow(["stt", "doan", "luu_tai", "khung_dau", "khung_cuoi", "anh_tham_chieu", "prompt", "am_thanh",
                "dung_giay", "che_do", "cat_tu", "cat_den"])
    for i, (doan, a, b, head, body, sound) in zip(STT, clips):
        person = head is not CLOSE and head != ""
        refs = (A if a == ROOM else f"{A}; {ROOM}") if person else ""  # Muse từ chối ảnh trùng khung đầu
        key = int(i) if i.isdigit() else i
        file, cut = FILE.get(key, f"video\\clip{i}.mp4"), CUTS.get(key, ("", "", ""))
        w.writerow([i, doan, file, a, b, refs, head + body + (PACE if head else ""), sound,
                    cut[2], "tang_toc", cut[0], cut[1]])
print(len(clips), "clips")
