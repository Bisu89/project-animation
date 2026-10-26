"""Crop three wind areas from the approved master and write content/camp-demo/assets_wind.csv.

Same method as _camp_crop_csv.py: each crop is edited alone (cannot drift), its box is recorded in crops.json so the result goes
back at a known place and scale. No clean plate is asked for: the sway layer is pasted over the identical pixels of the master and
only bends from the root upward by a few pixels, so the master underneath hides the seam.
"""
import csv
import json
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CROPS = os.path.join(ROOT, "content", "camp-demo", "crops")
MASTER = Image.open(os.path.join(ROOT, "content", "camp-demo", "layers", "master.png")).convert("RGB")
BOXES = {  # x0, y0, x1, y1 on the 1536x1024 master, all 3:2
    "wind_tent": (0, 300, 540, 660),     # tent door curtain + left bush
    "wind_grass": (0, 664, 540, 1024),   # foreground grass blades, bottom left
    "wind_shore": (960, 664, 1500, 1024),  # right shrubs and reeds at the water
}
meta = json.load(open(os.path.join(CROPS, "crops.json")))
for name, box in BOXES.items():
    MASTER.crop(box).save(os.path.join(CROPS, name + ".png"))
    meta[name] = {"box": box, "master": [1536, 1024]}
json.dump(meta, open(os.path.join(CROPS, "crops.json"), "w"), indent=1)

G = " Fill the whole background with a flat, perfectly uniform bright green (#00FF00), no shadow, no gradient, nothing else visible."
TAIL = " Paint the kept object completely, including parts that were hidden behind other things. Soft natural edges, no outline halo. No text, no watermark."
def IN(n):
    return f"Attach {n}.png. EDIT this picture. Output the SAME framing and aspect (3:2). Keep the exact painting style, colours and lighting. Do NOT enlarge, move or redraw anything that is kept: kept objects stay at the same pixel position and the same size."
M = " KEY=green. Pasted over the master at the same box; bends from the root upward."
rows = [
    ("W1", "wind_tent", "tent_curtain.png", IN("wind_tent") + " KEEP ONLY the tent's door curtain flaps and the loose fabric edge hanging at the lit doorway (both sides tied back). Remove the tent walls, poles, the lit interior, the bush and the ground." + G + TAIL, "Sway: curtain edge, 3-5 px, root at the top tie."),
    ("W2", "wind_tent", "bush_left.png", IN("wind_tent") + " KEEP ONLY the leafy bush and the thin bare branches at the bottom left (in front of the tent). Remove the tent, the poles, the curtain and the ground." + G + TAIL, "Sway: leaves 2-4 px, root at the ground."),
    ("W3", "wind_grass", "grass_left.png", IN("wind_grass") + " KEEP ONLY the tall dark grass blades and the leafy plants in the foreground, with the blades fully drawn down to their roots. Remove the large lichen rock, the ground, the path and the stones." + G + TAIL, "Sway: blades 4-8 px, root at the ground. Biggest and slowest motion."),
    ("W4", "wind_shore", "shrubs_right.png", IN("wind_shore") + " KEEP ONLY the small shrubs and thin reeds standing on the shore (spiky leafy stems). Remove the rocks, the water, the ground and the grass." + G + TAIL, "Sway: stems 2-4 px, root at the ground."),
]
out = os.path.join(ROOT, "content", "camp-demo", "assets_wind.csv")
with open(out, "w", encoding="utf-8", newline="") as f:
    w = csv.writer(f)
    w.writerow(["id", "type", "image_filename", "aspect", "prompt", "notes", "attach"])
    for i, c, fn, p, n in rows:
        w.writerow([i, "object", fn, "3:2", p, n + M, c + ".png"])
print(len(rows), "rows ->", out)
