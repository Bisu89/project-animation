"""Cut the crops that ChatGPT will edit, and write the prompts for them.

Usage: python scripts/cozy_crops.py <scene_id>
Reads demo-project/src/cozy-scene/scenes/<id>.json and content/<content>/master.png. For the fire plate and every creature patch:
  - saves the crop (box from the config, in master pixels) to content/<content>/<crop file>,
  - writes content/<content>/assets_variants.csv: one row per variant with a ready prompt (attach <crop>.png, change ONLY ...).
Then: attach each crop in ChatGPT, paste its prompt, save the result as the `from` file name next to the crop (1536x1024 is fine).
"""
import csv
import os
import sys

from PIL import Image

import cozy_lib as L

cfg = L.load(sys.argv[1])
d = L.content_dir(cfg)
master = Image.open(os.path.join(d, "master.png")).convert("RGB")
if list(master.size) != [cfg["master"]["w"], cfg["master"]["h"]]:
    print("WARNING: master.png is %s but the config says %sx%s" % (master.size, cfg["master"]["w"], cfg["master"]["h"]))

IN = "Attach %s. EDIT this picture. Output the SAME framing and aspect (%s). Keep the exact painting style, colours and lighting. Change ONLY what is described below; everything else (fur, blanket, background, every edge) must stay pixel-identical, same position and same size. No text, no watermark."
rows = []
for n, (vid, frm, crop, box, pub, prompt) in enumerate(L.variants(cfg), 1):
    b = (box["x"], box["y"], box["x"] + box["w"], box["y"] + box["h"])
    master.crop(b).save(os.path.join(d, crop))
    aspect = "3:2" if abs(box["w"] / box["h"] - 1.5) < 0.02 else "%d:%d" % (box["w"], box["h"])
    rows.append(("V%d" % n, "variant", frm, aspect, IN % (crop, aspect) + " " + prompt, "crop box %s; shown in the video as %s" % (box, pub)))

out = os.path.join(d, "assets_variants.csv")
with open(out, "w", encoding="utf-8", newline="") as f:
    w = csv.writer(f)
    w.writerow(["id", "type", "image_filename", "aspect", "prompt", "notes"])
    w.writerows(rows)
print(len(rows), "crops and prompts ->", d)
