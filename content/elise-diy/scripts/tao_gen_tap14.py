"""Tạo gen-anh.csv và gen-video.csv cho tập 14 bình lưới dây thừng đan nổi."""
import csv
import os

D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "ep14-rope-lattice-vase")

VASE = ("a round-bellied vase about 25 cm tall with a narrower neck and a slightly flared lip")
WIDE = ("Photorealistic vertical 9:16 photo, real home DIY tutorial look, soft bright daylight. Wide shot, fixed camera "
        "straight-on at chest height, exactly the same bright home workshop, table, camera framing and light as the "
        "workshop reference: a long light natural-wood table, a white wall behind with light wood shelves holding small "
        "potted plants, glass jars and brushes. ")
WOMAN = ("The same young woman from the first reference: light brown hair in a neat bun with a few loose strands, natural "
         "face, gold hoop earrings, light-wash denim short overalls over a white sleeveless tank top, no gloves, standing "
         "behind the table, face visible")
SAME = "Same workshop, table, camera framing, light and vase position as the previous reference scene. "
END = " Real photo, no text, no logos."
CLOSE = ("Photorealistic vertical 9:16 photo, soft bright daylight. Close-up, fixed camera, on the neck and lip of the vase "
         "on the light wood workshop table, background softly blurred; the woman's hands only. ")

ANH = [
    (1, "dt-G-thanh-pham.png", "dt-ref-san-pham.png",
     "Photorealistic vertical 9:16 interior product photo, soft warm natural light, no person. Recreate the product in the "
     "reference image exactly, same framing, but WITHOUT the caption label and WITHOUT the round zoom inset (no text, no "
     "UI): " + VASE + ", its body covered in cream-ivory finely ribbed paper with thin vertical grooves, overlaid with a "
     "raised diamond lattice of light tan braided jute rope glued in diagonal lines crossing both ways, a twisted jute rope "
     "ring around the lip and another around the base. In it a bouquet of blush and pale pink roses, white baby's breath "
     "and silver-green eucalyptus. It stands on a cream marble table, soft beige wall and a blurred window behind." + END),
    (2, "dt-B-boc-giay.png", "dt-A-elise-truoc.png; dt-ref-xuong.png; dt-G-thanh-pham.png",
     WIDE + "In the middle of the table stands a plain clear glass vase with exactly the shape and size of the vase in the "
     "third reference (" + VASE + "). Beside it a roll of cream-ivory finely ribbed corrugated craft paper with thin "
     "vertical grooves, scissors and a hot glue gun. " + WOMAN + ", wraps the cream ribbed paper around the vase body: "
     "the left third of the vase is already covered, the rest still clear glass." + END),
    (3, "dt-B2-giay-xong.png", "dt-A-elise-truoc.png; dt-B-boc-giay.png; dt-G-thanh-pham.png",
     WIDE + SAME + "The whole vase from base to lip is now neatly covered in the cream-ivory ribbed paper with thin "
     "vertical grooves, exactly like the body of the finished vase, no rope yet. " + WOMAN + ", smooths the paper "
     "seam with her fingers; the paper roll lies on the table." + END),
    (4, "dt-C-day-cheo.png", "dt-A-elise-truoc.png; dt-B2-giay-xong.png; dt-G-thanh-pham.png",
     WIDE + SAME + "Later: a twisted light tan jute rope ring is now glued around the base of the cream ribbed vase. On the "
     "table a spool of light tan braided jute rope and the hot glue gun. " + WOMAN + ", is gluing braided jute "
     "rope onto the vase in parallel diagonal lines that run up to the right: only two diagonal lines on the front so far, "
     "she presses the third one on with her fingertips. No lines in the other direction yet." + END),
    (5, "dt-C2-mot-chieu.png", "dt-A-elise-truoc.png; dt-C-day-cheo.png; dt-G-thanh-pham.png",
     WIDE + SAME + "Parallel diagonal braided jute lines running up to the right now cover the whole visible body of the "
     "vase, evenly spaced like the finished vase, but there are no lines in the other direction yet. " + WOMAN +
     ", holds the spool and the glue gun." + END),
    (6, "dt-D2-luoi-xong.png", "dt-A-elise-truoc.png; dt-C2-mot-chieu.png; dt-G-thanh-pham.png",
     WIDE + SAME + "Keep exactly the camera distance and framing of the SECOND reference: the vase and the woman have "
     "exactly the same size and position in the frame. Now a second set of braided jute lines running up to the left crosses the first set, forming the full "
     "raised diamond lattice exactly like the finished vase; the base ring is there, the lip has no rope ring yet. " + WOMAN
     + ", presses the last crossing with her fingertip." + END),
    (7, "dt-E-vien-mieng.png", "dt-D2-luoi-xong.png; dt-G-thanh-pham.png",
     CLOSE + "The neck and lip of the vase: cream ribbed paper with the raised braided jute diamond lattice reaching up "
     "to the neck, exactly like the finished vase. Her bare fingers hold a twisted light tan jute rope against the lip; "
     "it covers only the left quarter of the lip so far, the rest of the lip is still plain cream paper." + END),
    (8, "dt-E2-vien-xong.png", "dt-E-vien-mieng.png; dt-G-thanh-pham.png",
     "Exactly the same close-up framing, light, vase and hands as the first reference. The twisted jute rope ring now goes "
     "all the way around the lip exactly like the finished vase; her fingers press the joint at the back." + END),
    (9, "dt-F-cam-hoa.png", "dt-A-elise-truoc.png; dt-D2-luoi-xong.png; dt-G-thanh-pham.png",
     WIDE + SAME + "The finished vase (cream ribbed paper body, raised braided jute diamond lattice, jute rope rings at the "
     "lip and base, exactly like the finished-product reference) stands empty in the middle of the clean table. " + WOMAN
     + ", smiling, holds a bouquet just above it: blush and pale pink roses, white baby's breath and silver-green "
     "eucalyptus." + END),
    (10, "dt-F2-hoa-xong.png", "dt-A-elise-truoc.png; dt-F-cam-hoa.png; dt-G-thanh-pham.png",
     WIDE + SAME + "The bouquet is now arranged in the vase exactly like the finished-product reference. " + WOMAN +
     ", smiling, gently adjusts one rose with her fingers." + END),
]

BASE = ("Real home DIY timelapse video, vertical 9:16, photorealistic, not animated, no text, no logos. One continuous "
        "fixed shot: same framing as the start frame, no zoom, no pan, no cuts, no scene changes. The video must start "
        "exactly like the start-frame image and end exactly like the end-frame image. The bright workshop stays exactly as "
        "in the start frame the whole clip. Only this one woman is ever in the scene; no other person appears. the young "
        "woman from the reference (light brown hair in a bun, gold hoops, light-wash denim short overalls, white sleeveless "
        "tank top, no gloves): ")
TAIL = (" The vase keeps exactly its shape, size and position. She works at a natural, steady pace and never stands idle "
        "or sways while holding an item; nothing appears, vanishes or changes by itself.")

VID = [
    (1, "Mở đầu - thành phẩm", "dt-G-thanh-pham.png", "",
     "Real video, vertical 9:16, photorealistic, no text, no logos. Static camera, exactly the start frame. No person. "
     "Soft natural light; the rose petals and eucalyptus leaves stir very slightly. Nothing else moves, nothing appears or "
     "vanishes.", "Nhạc piano nhẹ bắt đầu.", 1.5, "cat", "", ""),
    (2, "Bọc giấy gợn", "dt-B-boc-giay.png", "dt-B2-giay-xong.png",
     BASE + "dabs hot glue and wraps the cream ribbed paper round the glass vase from left to right, pressing it flat, "
     "until the whole vase is covered, as in the end frame. The paper covers the glass only where her hands lay it." + TAIL,
     "Nhạc piano nhẹ, tiếng giấy.", 3, "tang_toc", "", "trang"),
    (3, "Dán dây chéo một chiều", "dt-C-day-cheo.png", "dt-C2-mot-chieu.png",
     BASE + "dabs a thin line of hot glue and presses braided jute rope onto the vase one diagonal line at a time, each "
     "parallel to the last and running up to the right, until they cover the visible body, as in the end frame. Each new "
     "rope line appears only where her fingers press it; lines already glued never move or change." + TAIL,
     "Nhạc piano nhẹ, tiếng dây sột soạt.", 3, "tang_toc", "", "mo_dai"),
    (4, "Dán dây chéo ngược, thành lưới", "dt-C2-mot-chieu.png", "dt-D2-luoi-xong.png",
     BASE + "glues a second set of braided jute lines running up to the left, one line at a time, across the first set, "
     "so a raised diamond lattice forms, as in the end frame. Each new rope line appears only where her fingers press it; "
     "lines already glued never move or change." + TAIL, "Nhạc piano nhẹ, tiếng dây sột soạt.", 3, "tang_toc", "", "mo"),
    (5, "Cận quấn viền miệng", "dt-E-vien-mieng.png", "dt-E2-vien-xong.png",
     "Real home DIY video, vertical 9:16, photorealistic, no text, no logos. One continuous fixed close-up shot, same "
     "framing as the start frame, no zoom, no cuts. Her bare fingers slowly lay the twisted jute rope along the lip of the "
     "vase, pressing it into the glue bit by bit, until it goes all the way round, as in the end frame. The rope appears "
     "only where her fingers lay it; the lattice below never changes.", "Nhạc piano nhẹ.", 4, "cat", "", "mo"),
    (6, "Cắm hoa", "dt-F-cam-hoa.png", "dt-F2-hoa-xong.png",
     BASE + "lowers the bouquet stems into the vase and gently arranges the roses, baby's breath and eucalyptus so they "
     "spread evenly above the lip, then adjusts one rose, as in the end frame. The flowers keep their colours." + TAIL,
     "Nhạc piano nhẹ.", 5, "cat", "", "mo"),
    (7, "Quay vòng thành phẩm", "dt-G-thanh-pham.png", "",
     "Real video, vertical 9:16, photorealistic, no text, no logos. It must start exactly like the start-frame image. No "
     "person. The finished vase with its cream ribbed body, raised braided jute diamond lattice and the pink rose bouquet "
     "on the cream marble table, soft warm light. One smooth, slow cinematic camera orbit around the vase at the same "
     "height, moving about 60 degrees to the right, keeping it centred and in sharp focus. The vase and flowers never "
     "change, nothing appears or vanishes.", "Nhạc piano nhẹ kết.", 6, "tang_toc", "5", "mo_dai"),
]


def main():
    with open(os.path.join(D, "gen-anh.csv"), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["stt", "ten_file", "ty_le", "gui_kem", "prompt"])
        w.writeheader()
        for s, t, g, pr in ANH:
            w.writerow({"stt": s, "ten_file": t, "ty_le": "9:16", "gui_kem": g, "prompt": pr})
    cols = ["stt", "doan", "luu_tai", "khung_dau", "khung_cuoi", "anh_tham_chieu", "prompt", "am_thanh", "dung_giay",
            "che_do", "cat_tu", "cat_den", "chuyen_canh"]
    with open(os.path.join(D, "gen-video.csv"), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        for s, doan, a, b, pr, am, dg, cd, den, cc in VID:
            ref = "" if s in (1, 5, 7) else "dt-A-elise-truoc.png"
            w.writerow({"stt": s, "doan": f"Clip {s} - {doan}", "luu_tai": f"video\\clip{s}.mp4", "khung_dau": a,
                        "khung_cuoi": b, "anh_tham_chieu": ref, "prompt": pr, "am_thanh": am, "dung_giay": dg,
                        "che_do": cd, "cat_tu": "", "cat_den": den, "chuyen_canh": cc})
    print(f"{len(ANH)} images, {len(VID)} clips")


if __name__ == "__main__":
    main()
