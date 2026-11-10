"""Sinh gen-anh.csv + gen-video.csv cho Marek Training tap 03 (footwork combo).
Chay: python -X utf8 tao_gen_tap03.py [--ghi-de]
"""
import argparse
import csv
import os

TAP = "ep03-footwork-combo"
TT = "mf"
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", TAP)

CHAR = "mi-marek-truoc.png"   # anh tham chieu khuon mat, chep tu models/

MAN = ("the muscular man from the reference: tousled dark auburn hair falling over his forehead, sharp focused "
       "eyes, no smile, extremely muscular bodybuilder physique, natural realistic skin texture with visible "
       "pores and muscle striations, no airbrushing, no smoothing, shirtless, fitted black athletic track pants, "
       "barefoot, white athletic tape wrapped around both wrists, black boxing gloves, no other jewelry")
SCENE = ("dim indoor calisthenics training room, bare grey stone and concrete floor and walls, low dramatic "
         "moody lighting, no windows, empty and quiet")
END = " Real photo, no text, no logos."

# (stt, ten_file, gui_kem, prompt)
ANH = [
    (1, f"{TT}-A-the-thu.png", CHAR,
     f"Photorealistic photo, {SCENE}. " + MAN + ", standing in a classic boxing guard stance facing slightly "
     "sideways toward the camera, both gloved fists up near his chin, knees soft and bent, weight balanced, "
     "feet shoulder-width apart, full body visible head to feet, low angle, dramatic side lighting." + END),
    (2, f"{TT}-B-combo-nhanh.png", f"{CHAR}; {TT}-A-the-thu.png",
     f"Photorealistic photo, {SCENE}. " + MAN + ", mid-motion in a fast boxing combo: torso pivoted sharply, "
     "weight shifted onto his front leg, back heel lifted, both fists snapped out in a sharp punching position, "
     "visible motion energy, full body visible head to feet, same camera distance and framing as the first "
     "reference photo, low angle, dramatic side lighting." + END),
    (3, f"{TT}-C-da-xoay.png", CHAR,
     f"Photorealistic photo, {SCENE}. " + MAN + ", frozen at the peak of a spinning back kick: body rotated "
     "mid-air in profile, one leg fully extended straight out to the side at hip height with a pointed bare "
     "foot, the other leg bent underneath for balance, both arms whipped in tight to his torso for rotation, "
     "head turned looking back toward the camera over his shoulder, intense focused expression, full body "
     "visible head to feet, dynamic low angle, dramatic side lighting, slight motion blur only at the very "
     "edges of the kicking leg." + END),
    (4, f"{TT}-D-da-ngang.png", f"{CHAR}; {TT}-B-combo-nhanh.png",
     f"Photorealistic photo, {SCENE}. " + MAN + ", standing in a controlled high side kick, body turned to a "
     "clean side profile toward the camera so his whole physique is on display: fully balanced and grounded on "
     "his bent left supporting leg, planted flat on the floor, right leg raised straight out to the side at "
     "shoulder/head height, pointed bare foot, knee and hip in natural realistic alignment, torso upright and "
     "rotated side-on with his chest, abs, shoulders and both arms clearly visible and flexed, both arms bent "
     "at his sides for balance, intense focused expression toward camera, full body visible head to feet, same "
     "camera distance and framing as the second reference photo, low angle, dramatic side lighting." + END),
]

BASE = ("Real cinematic phone video of solo boxing/footwork training, vertical 9:16, photorealistic, "
        "real-time speed, not animated, no text, no logos. One continuous fixed shot: same framing as the start "
        "frame, no zoom, no pan, no cuts, no scene changes. The video must start exactly like the start-frame "
        "image. The dim stone training room stays exactly as in the start frame the whole clip. Only this one "
        "man is ever in the scene; no other person appears. " + MAN + ": ")
TAIL = (" Nothing appears, vanishes or changes by itself. The floor, walls and lighting keep their exact shape, "
        "size and position throughout.")

# (stt, doan, khung_dau, khung_cuoi, anh_tham_chieu, prompt, am_thanh, dung_giay, che_do, cat_tu, cat_den, chuyen_canh)
VID = [
    (1, "3 level footwork", f"{TT}-A-the-thu.png", f"{TT}-B-combo-nhanh.png", CHAR,
     BASE + "demonstrates 3 clearly separate drills like a tutorial, one single continuous take, pausing briefly "
     "on each move so it reads clearly before moving to the next, each move visibly harder than the last: "
     "(1) first, simple side-to-side boxing shuffle footwork in the guard stance, holding the rhythm steady for "
     "about 2 seconds; (2) then a crisp jab-cross two-punch combo while stepping forward, snapping back to guard "
     "and holding briefly; (3) finally a sharp pivot with a hard hook punch, ending held in the pivoted punching "
     "pose shown in the end frame. Each of the 3 moves is clearly readable, with a short, distinct hold after "
     "it before the next move begins; never blend two moves into one blur." + TAIL,
     "Tieng buoc chan, tieng dam gio ro nhip, nhac nen tang dan theo tung muc.", 10, "cat", "", "", ""),
    (2, "LV4 da ngang cao giu", f"{TT}-D-da-ngang.png", "", f"{CHAR}; {TT}-D-da-ngang.png",
     "Real cinematic phone video of solo boxing/footwork training, vertical 9:16, photorealistic, real-time "
     "speed, not animated, no text, no logos. One continuous fixed shot: exact same camera position, distance "
     "and framing as the start frame the whole clip, no zoom, no pan, no cut. The video must start exactly like "
     "the start-frame image and keep matching this exact pose and body shape the whole clip. Only this one man "
     "is ever in the scene; no other person appears. " + MAN +
     ": holds the exact same high side kick pose as the start frame completely still for the whole clip: left "
     "leg planted flat on the floor as the only support, right leg extended straight out to the side at "
     "shoulder/head height, pointed foot, torso held side-on toward the camera with chest, abs, shoulders and "
     "arms clearly visible and flexed. His right leg never drops, bends, kicks again or changes angle. His left "
     "foot never lifts or slides. Muscles straining visibly from holding this exact position. Nothing else in "
     "the room changes; he never falls, wobbles or changes pose.",
     "Tieng tho gang suc deu, nhac nen len cao trao roi lang dan.", 5, "cat", "", "", "cat"),
]


def kiem_tra(ghi_de):
    loi = []
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
        for s, doan, a, b, ref, pr, am, dg, cd, ct, den, cc in VID:
            w.writerow({"stt": s, "doan": f"Clip {s} - {doan}", "luu_tai": f"video\\clip{s}.mp4", "khung_dau": a,
                        "khung_cuoi": b, "anh_tham_chieu": ref, "prompt": pr, "am_thanh": am, "dung_giay": dg,
                        "che_do": cd, "cat_tu": ct, "cat_den": den, "chuyen_canh": cc})
    print(f"{len(ANH)} images, {len(VID)} clips")


if __name__ == "__main__":
    main()
