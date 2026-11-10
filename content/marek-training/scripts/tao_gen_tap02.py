"""Sinh gen-anh.csv + gen-video.csv cho Marek Training tap 02 (one-arm elbow lever).
Chay: python -X utf8 tao_gen_tap02.py [--ghi-de]
"""
import argparse
import csv
import os

TAP = "ep02-one-arm-lever"
TT = "ml"
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", TAP)

CHAR = "mi-marek-truoc.png"          # anh tham chieu khuon mat, chep tu models/
GOC = "ml-ref-goc.png"               # anh goc chu du an gui (tu the chot)
FINAL = "ml-E-final-pose.png"        # ban chep cua GOC, dung lam khung cuoi clip 1 / khung dau clip 2
E2 = "ml-E2-hold-video.png"          # khung cuoi THAT trich tu clip2.mp4 (ban dung tu the), dung cho clip 3

MAN = ("the muscular man from the reference: tousled dark auburn hair falling over his forehead, sharp focused "
       "eyes, no smile, extremely muscular bodybuilder physique, natural realistic skin texture with visible "
       "pores and muscle striations, no airbrushing, no smoothing, shirtless, black athletic shorts, barefoot, "
       "white athletic tape wrapped around both wrists and both ankles, no jewelry")
SCENE = ("dim indoor calisthenics training room, bare grey stone and concrete floor and walls, low dramatic "
         "moody lighting, no windows, empty and quiet")
END = " Real photo, no text, no logos."

# (stt, ten_file, gui_kem, prompt)
ANH = [
    (1, f"{TT}-A-base-position.png", f"{CHAR}; {GOC}",
     f"Photorealistic photo, {SCENE}. " + MAN + ", kneeling on the floor on both hands and both knees (table-top "
     "base position), back flat, head up looking toward the camera, both palms flat on the stone floor "
     "shoulder-width apart, body diagonal across the frame. Exactly the same room, floor, wall and lighting as "
     "the second reference photo. Keep exactly the same camera distance and horizontal framing as the second "
     "reference photo: his body fills a similar portion of the frame width, low angle close to the floor, no "
     "extra empty floor space compared to that reference, do not zoom out." + END),
]

BASE = ("Real cinematic phone video of solo advanced calisthenics training, vertical 9:16, photorealistic, "
        "real-time speed, not animated, no text, no logos. One continuous fixed shot: same framing as the start "
        "frame, no zoom, no pan, no cuts, no scene changes. The video must start exactly like the start-frame "
        "image and end exactly like the end-frame image. The dim stone training room stays exactly as in the "
        "start frame the whole clip. Only this one man is ever in the scene; no other person appears. " + MAN +
        ": ")
TAIL = (" He moves at a natural, steady pace, muscles visibly straining with the effort; nothing appears, "
        "vanishes or changes by itself. The floor, walls and lighting keep their exact shape, size and "
        "position throughout.")

# (stt, doan, khung_dau, khung_cuoi, anh_tham_chieu, prompt, am_thanh, dung_giay, che_do, cat_tu, cat_den, chuyen_canh)
VID = [
    (1, "vao tu the chong mot tay", f"{TT}-A-base-position.png", FINAL, CHAR,
     BASE + "tucks his right knee in close beside his right elbow, shifting his weight onto his right arm with "
     "the elbow braced against his ribs and hip, then extends his right leg straight out behind him; he then "
     "brings his left leg in and extends it straight too, both legs together, his whole body rising into a fully "
     "horizontal one-arm elbow-lever hold balanced on his right hand and elbow, as in the end frame. One single "
     "continuous take: tuck, extend one leg, extend the other, rise into the hold. Never pause for more than a "
     "second, never repeat or reverse part of the motion, never fall or wobble off balance." + TAIL,
     "Tieng tho gang suc deu, cang co, nhac nen cang thang cham.", 10, "cat", "", "", ""),
    (2, "giu tu the nam ngang", FINAL, "", f"{CHAR}; {GOC}",
     "Real cinematic phone video of solo advanced calisthenics training, vertical 9:16, photorealistic, "
     "real-time speed, not animated, no text, no logos. One continuous fixed shot: exact same camera position, "
     "distance and framing as the start frame the whole clip, no zoom, no pan, no cut. The video must start "
     "exactly like the start-frame image and keep matching it exactly for the whole clip, like the second "
     "reference photo. Only this one man is ever in the scene; no other person appears. " + MAN +
     ": holds this very specific, rare one-arm elbow-lever balance pose exactly as shown, unchanged, for the "
     "whole clip: his right elbow is bent and pressed tightly against his right ribs and hip, right forearm and "
     "palm flat on the floor taking his whole body weight; his torso and BOTH legs are fully extended straight "
     "out behind him in one long straight line, nearly parallel to and just above the floor, ankles together, "
     "both knees locked straight; his body forms one long straight diagonal line from head to pointed toes, "
     "hovering just above the ground. His left arm reaches across his body and tucks his left hand close "
     "against his ribs near his right armpit. His knees stay straight and his legs stay extended behind him the "
     "whole time; they never bend, rise or cross, and his left hand never touches his thigh or knee. This is "
     "NOT a bent-knee one-arm balance pose. Muscles straining visibly from the effort of holding this exact "
     "position. Nothing else in the room changes; he never falls, wobbles or changes pose.",
     "Tieng tho gang suc deu, nhac nen cang thang cham roi lang dan.", 10, "cat", "", "", "mo"),
    (3, "giu tiep, may day nhe", E2, "", f"{CHAR}; {GOC}",
     "Real cinematic phone video of solo advanced calisthenics training, vertical 9:16, photorealistic, "
     "real-time speed, not animated, no text, no logos. The video must start exactly like the start-frame image "
     "and keep matching this exact pose and body shape the whole clip. One slow, subtle cinematic push-in: the "
     "camera creeps slightly closer over the whole clip, staying at the same height and angle, no pan. Only this "
     "one man is ever in the scene; no other person appears. " + MAN +
     ": holds the exact same one-arm elbow-lever pose as the start frame completely still and balanced for the "
     "whole clip: right elbow bent and pressed against his ribs and hip, both legs fully extended straight behind "
     "him nearly parallel to the floor, knees locked straight, left hand tucked near his right forearm. His knees "
     "never bend or rise, his legs never drop to the floor. Muscles straining visibly. Nothing else in the room "
     "changes; he never falls, wobbles or changes pose.",
     "Tieng tho gang suc deu, nhac nen len cao trao nhe roi lang dan.", 6.5, "cat", "", "", "mo_dai"),
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
