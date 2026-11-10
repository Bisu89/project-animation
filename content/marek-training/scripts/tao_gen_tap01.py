"""Sinh gen-anh.csv + gen-video.csv cho Marek Training tap 01 (deadlift san thuong).
Chay: python -X utf8 tao_gen_tap01.py [--ghi-de]
"""
import argparse
import csv
import os

TAP = "ep01-deadlift-san-thuong"
TT = "mi"
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", TAP)

CHAR = "mi-marek-truoc.png"       # anh tham chieu nhan vat, chep tu models/
POSE = "mi-ref-pose-flex.png"     # anh goc chu du an gui, dung lam dich tu the chot
E2 = "mi-E2-tha-ta-video.png"     # khung cuoi THAT trich tu clip7.mp4 (ffmpeg -sseof), dung lam khung dau clip 8
                                   # de khop mau troi/ty le voi doan truoc, thay vi dung lai anh tinh goc

MAN = ("the muscular man from the reference: tousled dark auburn hair falling over his forehead, sharp focused "
       "eyes, no smile, extremely muscular bodybuilder physique with broad shoulders, defined chest and visible "
       "abs, natural realistic skin texture with visible pores and muscle striations, no airbrushing, no "
       "smoothing, shirtless, loose burgundy red sweatpants, white sneakers, no jewelry")
SCENE = ("abandoned warehouse rooftop at dusk, a rusty steel crane structure on the left, weathered cracked "
         "concrete wall and floor, dramatic orange-purple sunset sky, faint city skyline silhouette in the "
         "distance")
BAR = "a thick steel barbell loaded with large black cast-iron weight plates on both ends"
END = " Real photo, no text, no logos."

WIDE = (f"Photorealistic vertical 9:16 photo, {SCENE}. Wide shot, fixed camera at a distance, straight-on, low "
        f"angle from waist height: the man's full body from head to his sneakers is always visible in frame, with "
        f"visible floor space in front of his feet for the barbell. Exactly the same rooftop, crane, camera "
        f"distance and light as the reference. ")
SAME = "Same rooftop, crane, exact camera distance/framing (full body and feet always visible) and dusk light as the previous reference scene. "
CAM = ("Keep exactly the camera position, distance and framing of the SECOND reference: the man and the barbell "
       "have exactly the same size and position in the frame. ")

# (stt, ten_file, gui_kem, prompt)
ANH = [
    (1, f"{TT}-A-cam-ta.png", CHAR,
     WIDE + BAR + " rests on the concrete floor. " + MAN +
     ", crouched in a deadlift starting stance gripping the barbell with both hands, back straight, hips low, "
     "looking down at the bar." + END),
    (2, f"{TT}-B-hit-tho.png", f"{CHAR}; {TT}-A-cam-ta.png",
     SAME + CAM + BAR + " still rests on the floor, untouched. " + MAN +
     ", still crouched in the same deadlift stance gripping the bar, now with his head lifted, chest filled with "
     "a deep breath, eyes sharp and focused forward." + END),
    (3, f"{TT}-C-keo-giua-duong.png", f"{CHAR}; {TT}-B-hit-tho.png",
     SAME + CAM + BAR + " is now lifted a short distance off the floor, the thick bar flexing slightly under the "
     "heavy load. " + MAN +
     ", mid-pull, knees and hips half extended, neck and forearm veins bulging with effort, face straining." + END),
    (4, f"{TT}-D-dung-thang.png", f"{CHAR}; {TT}-C-keo-giua-duong.png",
     SAME + CAM + BAR + " is held at thigh height, both arms straight. " + MAN +
     ", standing fully upright with hips completely locked out, exhaling sharply, shoulders back." + END),
    (5, f"{TT}-E-tha-ta.png", f"{CHAR}; {TT}-D-dung-thang.png",
     SAME + CAM + BAR + " now lies back on the concrete floor where it was just dropped, a small burst of dust "
     "settling around the plates. " + MAN +
     ", standing fully straight with empty hands, chest still rising from the effort." + END),
]

BASE = ("Real cinematic phone video of solo heavy strength training, vertical 9:16, photorealistic, real-time "
        "speed, not animated, no text, no logos. One continuous fixed shot: same framing as the start frame, no "
        "zoom, no pan, no cuts, no scene changes. The video must start exactly like the start-frame image and end "
        "exactly like the end-frame image. The rooftop stays exactly as in the start frame the whole clip: rusty "
        "steel crane on the left, cracked concrete wall and floor, dramatic dusk sky. Only this one man is ever in "
        "the scene; no other person appears. " + MAN + ": ")
TAIL = (" He moves at a natural, steady pace and never stands idle or sways; nothing appears, vanishes or changes "
        "by itself. His muscular build, the barbell and the rooftop keep their exact shape, size and position "
        "throughout.")

# (stt, doan, khung_dau, khung_cuoi, anh_tham_chieu, prompt, am_thanh, dung_giay, che_do, cat_den, chuyen_canh)
VID = [
    (1, "hit tho truoc khi keo", f"{TT}-A-cam-ta.png", f"{TT}-B-hit-tho.png", CHAR,
     BASE + "crouches in a deadlift stance gripping the barbell with both hands, back straight and hips low, "
     "takes one deep breath and lifts his head to look forward with sharp focus, as in the end frame. One action "
     "only: the breath before lifting." + TAIL,
     "Tieng tho sau, im lang cang thang.", 3, "cat", "", ""),
    (2, "keo ta roi san", f"{TT}-B-hit-tho.png", f"{TT}-C-keo-giua-duong.png", CHAR,
     BASE + "pulls the barbell straight up off the floor, knees and hips extending together, forearm and neck "
     "veins bulging, the thick bar flexing slightly under the heavy load, as in the end frame. One action only: "
     "the initial pull." + TAIL,
     "Trong tram cham dan nhip, tieng gang nang ken ket.", 4, "cat", "", "mo"),
    (3, "dung thang khoa hong", f"{TT}-C-keo-giua-duong.png", f"{TT}-D-dung-thang.png", CHAR,
     BASE + "finishes standing fully upright, hips locked out completely, the barbell held at thigh height with "
     "both arms straight, exhales sharply, as in the end frame. One action only: locking out." + TAIL,
     "Trong dong nhip manh, tieng tho hat ra.", 3, "cat", "", "mo"),
    (4, "tha ta xuong san", f"{TT}-D-dung-thang.png", f"{TT}-E-tha-ta.png", CHAR,
     BASE + "releases the barbell, letting it drop straight down and slam onto the concrete floor with a burst of "
     "dust, then stands up fully straight with empty hands, as in the end frame. One action only: dropping the "
     "bar." + TAIL,
     "Tieng ta sat va cham manh xuong be tong, bui ban nhe.", 3.5, "cat", "", "mo"),
    (5, "khoe tu the gong co", f"{TT}-E-tha-ta.png", "", f"{CHAR}; {POSE}",
     "Real cinematic phone video of solo heavy strength training, vertical 9:16, photorealistic, real-time speed, "
     "not animated, no text, no logos. One continuous fixed shot: exact same camera position, distance and framing "
     "as the start frame the whole clip, no zoom, no pan, no walking toward the camera, no cut. The video must "
     "start exactly like the start-frame image. Only this one man is ever in the scene; no other person appears. " +
     MAN + ": turns in place to face the camera directly, then flexes his shoulders, chest and abs with both fists "
     "clenched at his sides (not in front of his stomach), chin level, standing powerfully still against the dusk "
     "sky and the rusty crane, matching the flexed pose of the second reference photo while keeping the exact same "
     "full-body camera distance and framing as the start frame. Nothing else in the rooftop changes.",
     "Trong cham dong dan den cao trao, roi lang lai, giu nhip den het.", 6, "cat", "", "mo"),
    (6, "keo va khoa hong gop lam mot", f"{TT}-B-hit-tho.png", f"{TT}-D-dung-thang.png", CHAR,
     BASE + "pulls the barbell straight up off the floor in one single continuous motion, knees and hips extending "
     "together without ever pausing or lowering back down, neck and forearm veins bulging, finishing standing "
     "fully upright with hips locked out completely and the barbell held at thigh height with both arms straight, "
     "as in the end frame. One continuous action only: the full pull to lockout; never pause, lower the bar again, "
     "or repeat part of the motion." + TAIL,
     "Trong dong nhip manh tang dan, tieng tho hat ra luc khoa hong.", 5.5, "cat", "", "mo"),
    (7, "nang ta roi dat xuong - gop 1 clip", f"{TT}-A-cam-ta.png", f"{TT}-E-tha-ta.png", CHAR,
     BASE + "takes one deep breath, then pulls the barbell straight up off the floor in one continuous motion to "
     "full standing lockout with hips completely extended, holds for about a second, then lowers the barbell back "
     "down with control and releases it, letting it drop the last few centimetres onto the concrete floor with a "
     "small burst of dust, ending standing fully straight with empty hands, as in the end frame. One single "
     "continuous take: breathe, lift, lockout, lower, drop. Never pause for more than a second, never repeat or "
     "reverse part of the motion." + TAIL,
     "Tieng tho sau, tieng gang nang ken ket luc keo, tieng ta cham san luc dat xuong.", 10, "cat", "", ""),
    (8, "gong co ket - gop 1 clip", E2, "", f"{CHAR}; {E2}; {POSE}",
     "Real cinematic phone video of solo heavy strength training, vertical 9:16, photorealistic, real-time speed, "
     "not animated, no text, no logos. One continuous fixed shot: exact same camera position, distance, framing, "
     "sky colour and lighting as the start frame the whole clip, no zoom, no pan, no walking, no change of the "
     "sky or background, no cut. The video must start exactly like the start-frame image, matching its exact sky "
     "colour, light and camera distance. Only this one man is ever in the scene; no other person appears. " + MAN +
     ": within the first second turns in place (feet planted, no steps) to face the camera directly, then flexes "
     "his shoulders, chest and arms hard into a powerful bodybuilder pose (either fists clenched beside his hips, "
     "or a classic double-biceps pose with both arms raised) and holds that exact pose completely still for the "
     "rest of the clip, matching the energy of the third reference photo. Nothing else in the rooftop changes; he "
     "never relaxes, changes pose or steps his feet once flexed.",
     "Trong cham dong dan den cao trao, roi giu nguyen den het.", 8.5, "cat", "", "mo_dai"),
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
        for s, doan, a, b, ref, pr, am, dg, cd, den, cc in VID:
            w.writerow({"stt": s, "doan": f"Clip {s} - {doan}", "luu_tai": f"video\\clip{s}.mp4", "khung_dau": a,
                        "khung_cuoi": b, "anh_tham_chieu": ref, "prompt": pr, "am_thanh": am, "dung_giay": dg,
                        "che_do": cd, "cat_tu": "", "cat_den": den, "chuyen_canh": cc})
    print(f"{len(ANH)} images, {len(VID)} clips")


if __name__ == "__main__":
    main()
