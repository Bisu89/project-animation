# Sinh gen-anh.csv cho ảnh mẫu nhân vật series Lời Chưa Nói (chạy: python tao_csv.py)
import csv, os
HERE = os.path.dirname(os.path.abspath(__file__))
FACE = ("a 24-year-old Vietnamese woman, very pretty with soft natural Vietnamese features: oval face, gentle almond-shaped "
        "dark brown eyes, straight nose, full natural lips, light warm skin with natural realistic skin texture and fine "
        "pores, no airbrushing, minimal natural makeup")
HAIR = ("long straight glossy black hair gathered in a loose low bun at the nape, a few soft strands framing her face")
BODY = ("about 165 cm tall, slim graceful feminine figure with a defined waist and elegant natural proportions, "
        "realistic healthy body, no exaggerated curves")
OUTFIT = ("a fitted cream chunky-knit cardigan buttoned over a soft white silk blouse, high-waisted light-brown linen "
          "wide-leg trousers, simple tan flat sandals, a thin plain silver bangle on her left wrist, no other jewellery")
BG = ("inside a small old rural Vietnamese wooden house at dusk: dark wooden table by a wooden-framed glass window, "
      "warm orange-blue evening light from the window plus one warm tungsten bulb, softly blurred background")
TAIL = "Modest, wholesome, elegant, family-friendly look. Real photo, photorealistic, no text, no logos, no watermark."
rows = [
 (1, "lcn-chandung.png", "9:16", "",
  f"Photorealistic vertical 9:16 portrait photo from the waist up of {FACE}. {HAIR}. She wears {OUTFIT}. "
  f"Facing the camera, calm gentle slightly melancholic expression, a faint soft smile, relaxed shoulders. {BG}. {TAIL}"),
 (2, "lcn-toanthan-truoc.png", "9:16", "lcn-chandung.png",
  f"Photorealistic vertical 9:16 full-body photo, head to feet in frame, of the same young Vietnamese woman as in the "
  f"reference image (identical face, hair, bun and outfit). She is {BODY}. She wears {OUTFIT}. Standing upright facing "
  f"the camera, relaxed natural pose, arms relaxed at her sides. {BG}. {TAIL}"),
 (3, "lcn-toanthan-sau.png", "9:16", "lcn-toanthan-truoc.png",
  f"Photorealistic vertical 9:16 full-body photo, head to feet in frame, of the same young Vietnamese woman as in the "
  f"reference image, seen from behind at a three-quarter back angle: we see her back, the low black hair bun and only a "
  f"glimpse of her cheek and profile. She is {BODY}. Identical outfit: {OUTFIT}. She stands looking out of the window. "
  f"{BG}. {TAIL}"),
]
with open(os.path.join(HERE, "gen-anh.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(["stt", "ten_file", "ty_le", "gui_kem", "prompt"]); w.writerows(rows)
print("ok", len(rows))
