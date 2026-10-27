"""Check the ChatGPT results of a cozy scene against their crops (position shift + how much changed).

Usage: python scripts/cozy_check.py <scene_id>
Writes content/<content>/variants.json from the config, then runs scripts/xmas_check_variants.py on that folder.
Shift (0,0) = fine. Anything else: the generator moved the picture, make it again.
"""
import json
import os
import subprocess
import sys

import cozy_lib as L

cfg = L.load(sys.argv[1])
d = L.content_dir(cfg)
pairs = {os.path.splitext(frm)[0]: os.path.splitext(crop)[0] for _, frm, crop, _, _, _ in L.variants(cfg)}
with open(os.path.join(d, "variants.json"), "w", encoding="utf-8") as f:
    json.dump(pairs, f, indent=1)
subprocess.run([sys.executable, os.path.join(L.ROOT, "scripts", "xmas_check_variants.py"), d], check=True)
print("look at", os.path.join(d, "_sbs_*.png"), "then delete them")
