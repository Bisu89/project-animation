"""Crop the approved master to the action area and write content/camp-demo/assets_crops.csv (prompts that EDIT that crop).

The crop is edited instead of the full canvas, so each object fills the picture and cannot drift or grow much; the crop offset
is known (content/camp-demo/crops/crops.json), so every result goes back at an exactly known place and scale.
"""
import csv
import json
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BOX = (400, 350, 1000, 750)  # x0, y0, x1, y1 on the 1536x1024 master: person, chair, table, cup
os.makedirs(os.path.join(ROOT, "content", "camp-demo", "crops"), exist_ok=True)
Image.open(os.path.join(ROOT, "content", "camp-demo", "layers", "master.png")).convert("RGB").crop(BOX).save(os.path.join(ROOT, "content", "camp-demo", "crops", "camp_crop.png"))
json.dump({"camp_crop": {"box": BOX, "master": [1536, 1024]}}, open(os.path.join(ROOT, "content", "camp-demo", "crops", "crops.json"), "w"), indent=1)
for f in ("person_crop.png", "table_crop.png"):  # first attempt, superseded
    p = os.path.join(ROOT, "content", "camp-demo", "crops", f)
    if os.path.exists(p):
        os.remove(p)

IN = "Attach camp_crop.png. EDIT this picture. Output the SAME framing and aspect (3:2). Keep the exact painting style, colours and lighting. Do NOT enlarge, move or redraw anything that is kept: kept objects stay at the same pixel position and the same size."
G = " Fill the whole background with a flat, perfectly uniform bright green (#00FF00), no shadow, no gradient, nothing else visible."
TAIL = " Paint the kept object completely, including parts that were hidden. No text, no watermark."
rows = [
    ("K0", "plate", "plate_camp.png",
     IN + " REMOVE ONLY the seated person, the camp chair and the cup (the cup standing on the table). KEEP the low wooden table exactly as it is, with an empty top. Repaint what was behind and under the person and chair: grassy rocky lakeshore ground, shore, trees and water, continuing naturally. Keep the tent edge, the table and everything else untouched.",
     "Plate. Pasted back over the master at the crop box to make a clean background; edges are feathered."),
    ("K1", "object", "person_body.png",
     IN + " KEEP ONLY the seated person's body and the camp chair they sit on. REMOVE the head (leave the neck and collar clean), the whole near arm (shoulder cap with an empty sleeve opening, jacket painted fully behind where the arm was), the table and the cup." + G + TAIL,
     "KEY=green. Breath: scale Y +0.8 percent from the hips."),
    ("K2", "object", "head_open.png", IN + " KEEP ONLY the head and neck with eyes open." + G + TAIL, "KEY=green. Pivot: neck base."),
    ("K3", "object", "head_closed.png", IN + " KEEP ONLY the head and neck and change ONLY the eyes to closed." + G + TAIL, "KEY=green. Blink frame. OPTIONAL: skip it for the first test."),
    ("K4", "object", "arm_upper.png",
     IN + " KEEP ONLY the near arm's upper part (shoulder to elbow) in the jacket sleeve, redrawn straight and horizontal, pointing right, at the same thickness and scale as in the picture. The sleeve extends 15 px past the elbow." + G + TAIL,
     "KEY=green. Pivot: shoulder end. Scale is measured by me, not trusted."),
    ("K5", "object", "arm_forearm.png",
     IN + " KEEP ONLY the near forearm (elbow to wrist) in the jacket sleeve with the cuff, redrawn straight and horizontal, pointing right, same thickness and scale as in the picture, hand NOT included." + G + TAIL,
     "KEY=green. Pivot: elbow end."),
    ("K6", "object", "hand_open.png", IN + " KEEP ONLY the near hand seen from the side, relaxed and slightly open, same size as in the picture, wrist on the left." + G + TAIL, "KEY=green. Pivot: wrist."),
    ("K7", "object", "hand_grip.png", IN + " KEEP ONLY the same near hand with the fingers closed as if gripping a cup handle, same size and wrist position as the open hand." + G + TAIL, "KEY=green."),
    ("K9", "object", "cup.png", IN + " KEEP ONLY the metal camp cup, upright, handle facing LEFT toward the person, same size as in the picture." + G + TAIL, "KEY=green. Pivot: handle. Flat bottom."),
]
out = os.path.join(ROOT, "content", "camp-demo", "assets_crops.csv")
with open(out, "w", encoding="utf-8", newline="") as f:
    w = csv.writer(f)
    w.writerow(["id", "type", "image_filename", "aspect", "prompt", "notes"])
    for r in rows:
        w.writerow([r[0], r[1], r[2], "3:2", r[3], r[4]])
print(len(rows), "rows ->", out)
