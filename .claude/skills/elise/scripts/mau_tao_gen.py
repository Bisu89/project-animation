"""MẪU sinh gen-anh.csv + gen-video.csv cho một tập Elise DIY.

Chép thành content/elise-<dòng>/scripts/tao_gen_tapNN.py, sửa TAP, TT, các khối mô tả và hai danh sách ANH, VID.
Chạy: python -X utf8 tao_gen_tapNN.py [--ghi-de]   (chỉ in ASCII để tránh lỗi cp1252)
Script dừng nếu còn chỗ "<...>" chưa điền, hoặc CSV đã có mà không có --ghi-de
(CSV có thể đã được sửa tay; cột cắt thì sửa ở ghep-v2.csv, không ở đây).
Bản đầy đủ đã chạy thật: content/elise-diy/scripts/tao_gen_tap14.py (xưởng), tao_gen_tap13.py (ngoài trời).
"""
import argparse
import csv
import os
import re

TAP = "epNN-slug"   # thư mục tập
TT = "xx"           # tiền tố file của tập
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", TAP)

A = f"{TT}-A-elise-truoc.png"
G = f"{TT}-G-thanh-pham.png"
XUONG = f"{TT}-ref-xuong.png"   # ảnh phòng (xưởng sáng: chép ep12 rr-J-cam-hoa)

VAT = "a round-bellied vase about 25 cm tall with a narrower neck"   # tả dáng sản phẩm, dùng lại mọi nơi
WIDE = ("Photorealistic vertical 9:16 photo, real home DIY tutorial look, soft bright daylight. Wide shot, fixed camera "
        "straight-on at chest height, exactly the same bright home workshop, table, camera framing and light as the "
        "workshop reference: <kể tên đồ đạc trong phòng>. ")
SAME = "Same workshop, table, camera framing, light and vase position as the previous reference scene. "
CAM = ("Keep exactly the camera position, distance and framing of the SECOND reference: the vase and the woman have "
       "exactly the same size and position in the frame. ")
SHAPE = ("The vase has exactly the shape, proportions and size of the vase in the finished-product reference (" + VAT +
         "). ")
WOMAN = ("The same young woman from the first reference: light brown hair in a neat bun with a few loose strands, natural "
         "realistic skin texture with fine pores, no freckles, no airbrushing, gold hoop earrings, light-wash denim short "
         "overalls over a white sleeveless tank top, no gloves, standing behind the table, face visible")
END = " Real photo, no text, no logos."
CLOSE = ("Photorealistic vertical 9:16 photo, soft bright daylight. Close-up, fixed camera, on <phần đang làm> of the vase "
         "on the workshop table, background softly blurred; the woman's hands only. ")

# (stt, ten_file, gui_kem, prompt)
ANH = [
    (1, G, f"{TT}-ref-san-pham.png",
     "Photorealistic vertical 9:16 interior product photo, no person. Recreate the product in the reference image exactly, "
     "same framing, but WITHOUT any caption label, zoom inset or UI: " + VAT + ", <tả chi tiết>." + END),
    (2, f"{TT}-B-buoc1.png", f"{A}; {XUONG}; {G}",
     WIDE + SHAPE + "<đồ dùng trên bàn>. " + WOMAN + ", <đang làm bước 1: chỉ phần bên trái xong>." + END),
    (3, f"{TT}-B2-buoc1-xong.png", f"{A}; {TT}-B-buoc1.png; {G}",
     WIDE + SAME + CAM + SHAPE + "<bước 1 gần xong>. " + WOMAN + ", <tay vẫn đang làm>." + END),
    # Bước có vật nhỏ lặp lại: cặp khung CẬN, mỗi khung chỉ thêm 2-3 vật
    (4, f"{TT}-C-can.png", f"{TT}-B2-buoc1-xong.png; {G}",
     CLOSE + "<2 sợi đã dán, ngón tay ấn sợi thứ 3>." + END),
    (5, f"{TT}-C2-can-xong.png", f"{TT}-C-can.png; {G}",
     "Exactly the same close-up framing, light, vase and hands as the first reference. <thêm đúng 2-3 vật>." + END),
]

BASE = ("Real home DIY timelapse video, vertical 9:16, photorealistic, not animated, no text, no logos. One continuous "
        "fixed shot: same framing as the start frame, no zoom, no pan, no cuts, no scene changes. The video must start "
        "exactly like the start-frame image and end exactly like the end-frame image. The bright workshop stays exactly as "
        "in the start frame the whole clip. Only this one woman is ever in the scene; no other person appears. The young "
        "woman from the reference (light brown hair in a bun, gold hoops, light-wash denim short overalls, white sleeveless "
        "tank top, no gloves): ")
TAIL = (" The vase keeps exactly its shape, size and position. She works at a natural, steady pace and never stands idle "
        "or sways while holding an item; nothing appears, vanishes or changes by itself.")
CLOSE_V = ("Real home DIY video, vertical 9:16, photorealistic, no text, no logos. One continuous fixed close-up shot, same "
           "framing as the start frame, no zoom, no cuts. ")
ORBIT = ("Real video, vertical 9:16, photorealistic, no text, no logos. It must start exactly like the start-frame image. "
         "No person. One smooth, slow cinematic camera orbit around the vase at the same height, moving about 60 degrees "
         "to the right, keeping it centred and in sharp focus. The vase and flowers never change, nothing appears or vanishes.")

# (stt, doan, khung_dau, khung_cuoi, prompt, am_thanh, dung_giay, che_do, cat_den, chuyen_canh)
VID = [
    (1, "Mở đầu - thành phẩm", G, "",
     "Real video, vertical 9:16, photorealistic, no text, no logos. Static camera, exactly the start frame. No person. "
     "Soft natural light; the petals stir very slightly. Nothing else moves, nothing appears or vanishes.",
     "Nhạc piano nhẹ bắt đầu.", 1.5, "cat", "", ""),
    (2, "Bước 1", f"{TT}-B-buoc1.png", f"{TT}-B2-buoc1-xong.png",
     BASE + "<một động từ chính, làm từng phần từ trái sang phải>, as in the end frame." + TAIL,
     "Nhạc piano nhẹ.", 3, "tang_toc", "", "mo_dai"),
    (3, "Cận bước 2", f"{TT}-C-can.png", f"{TT}-C2-can-xong.png",
     CLOSE_V + "<ngón tay ấn từng sợi>. Each new <vật> appears only where her fingers press it; <vật> already glued never "
     "move or change.", "Nhạc piano nhẹ.", 4, "cat", "", "mo_dai"),
    (9, "Quay vòng thành phẩm", G, "", ORBIT, "Nhạc piano nhẹ kết.", 6, "tang_toc", "5", "mo_dai"),
]
KHONG_THAM_CHIEU = {1, 3, 9}   # clip không có người hoặc là cảnh cận: không gửi ảnh A


def kiem_tra(ghi_de):
    loi = []
    if "NN" in TAP or TT == "xx":
        loi.append("chua dat TAP / TT")
    for s, t, g, pr in ANH:
        if re.search(r"<[^>]+>", pr):
            loi.append(f"anh {s} ({t}): con cho <...> chua dien")
    for row in VID:
        if re.search(r"<[^>]+>", row[4]):
            loi.append(f"clip {row[0]}: con cho <...> chua dien")
    for ten in ("gen-anh.csv", "gen-video.csv"):
        if os.path.exists(os.path.join(D, ten)) and not ghi_de:
            loi.append(f"{ten} da ton tai (them --ghi-de neu chac chan)")
    if loi:
        raise SystemExit("DUNG:\n  " + "\n  ".join(loi))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ghi-de", action="store_true", help="cho phep ghi de CSV da co")
    kiem_tra(ap.parse_args().ghi_de)
    os.makedirs(os.path.join(D, "anh"), exist_ok=True)
    os.makedirs(os.path.join(D, "video"), exist_ok=True)
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
            w.writerow({"stt": s, "doan": f"Clip {s} - {doan}", "luu_tai": f"video\\clip{s}.mp4", "khung_dau": a,
                        "khung_cuoi": b, "anh_tham_chieu": "" if s in KHONG_THAM_CHIEU else A, "prompt": pr,
                        "am_thanh": am, "dung_giay": dg, "che_do": cd, "cat_tu": "", "cat_den": den,
                        "chuyen_canh": cc})
    print(f"{len(ANH)} images, {len(VID)} clips")


if __name__ == "__main__":
    main()
