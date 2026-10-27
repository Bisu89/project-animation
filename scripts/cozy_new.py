"""Start a new cozy scene from an existing one.

Usage: python scripts/cozy_new.py <new_id> portrait|wide [--from <existing_id>] [--no-fire]
Creates demo-project/src/cozy-scene/scenes/<new_id>.json (a copy of the reference scene with new names), content/<new_id>/
(README + master prompt), and registers the scene in registry.ts. Then edit the JSON for the new picture: every x/y/w/h
is in MASTER pixels (open master.png and read coordinates in any image viewer). Layers you do not need can be deleted
from the JSON (fire, snow, steam, lights, candles, creature, glows, audio, reel are all optional).
"""
import json
import os
import re
import sys

import cozy_lib as L

args = [a for a in sys.argv[1:] if not a.startswith("--")]
if len(args) < 2 or args[1] not in ("portrait", "wide"):
    sys.exit(__doc__)
new_id, kind = args[0], args[1]
ref = sys.argv[sys.argv.index("--from") + 1] if "--from" in sys.argv else ("xmas-cat" if kind == "portrait" else "xmas-cat-wide")
cfg = L.load(ref)
cfg["id"], cfg["assets"], cfg["content"] = new_id, new_id, new_id
cfg["_todo"] = "Edit every box/point for the new master (pixels of content/%s/master.png), and master.w/h. Delete layers you do not need." % new_id
if "--no-fire" in sys.argv:
    cfg.pop("fire", None)
    cfg.pop("glows", None)
cfg.pop("audio", None)
path = os.path.join(L.SCENES, new_id + ".json")
if os.path.exists(path):
    sys.exit("%s already exists" % path)
with open(path, "w", encoding="utf-8") as f:
    json.dump(cfg, f, indent=2)

d = os.path.join(L.ROOT, "content", new_id)
os.makedirs(d, exist_ok=True)
aspect = "9:16" if kind == "portrait" else "3:2 (it will be cropped to 16:9: keep everything important inside the middle 80 percent of the height)"
with open(os.path.join(d, "assets_master.csv"), "w", encoding="utf-8", newline="") as f:
    f.write('id,type,image_filename,aspect,prompt,notes\n')
    f.write('M1,master,master.png,"%s","Painterly anime illustration, soft hand-painted look, warm cozy night, rich detail, gentle film grain. <DESCRIBE THE ROOM>. A single <CREATURE> asleep, whole body visible and large, nothing covering it. <LIGHT SOURCE: fireplace / lantern / stove> as a clearly separate area, <WINDOW with falling snow or rain> as another, with space between them. Strong contrast: cold blue night outside, warm amber light inside. No people, no text, no watermark.","Generate 3 options, choose the one where the light source / creature / window are cleanly separated. Save as content/%s/master.png"\n' % (aspect, new_id))
with open(os.path.join(d, "README.md"), "w", encoding="utf-8") as f:
    f.write("# %s\n\nSee docs/series/xmas-cat/KHUON_COZY.md. Steps: master -> edit scenes/%s.json -> cozy_crops.py -> ChatGPT -> cozy_check.py -> cozy_prepare.py -> cozy_sfx.py -> render.\n" % (new_id, new_id))

reg = os.path.join(L.ROOT, "demo-project", "src", "cozy-scene", "registry.ts")
s = open(reg, encoding="utf-8").read()
var = re.sub(r"[^A-Za-z0-9]+(.)", lambda m: m.group(1).upper(), new_id) + "Cfg"
s = s.replace('import wideFeatures', 'import %s from "./scenes/%s.json";\nimport wideFeatures' % (var, new_id), 1)
secs = (45, 600) if kind == "wide" else (45, 40)
s = s.rstrip()
assert s.endswith("};")
s = s[:-2] + '  "%s": { config: %s as unknown as CozyConfig, timing: { reel: %d, full: %d } },\n};\n' % (new_id, var, secs[0], secs[1])
open(reg, "w", encoding="utf-8").write(s)
print("created", path)
print("created", d)
print("registered %s in registry.ts (render ids: %s-reel, %s-full)" % (new_id, new_id, new_id))
