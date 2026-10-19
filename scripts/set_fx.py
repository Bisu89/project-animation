"""Replace the fx tokens of chosen scenes in content/<slug>/prompts.txt without touching the picture descriptions.

usage: python scripts/set_fx.py zs-ep01 fx.json     fx.json = {"1": "mo:in screen:0.27,...", "2": "..."}
Then re-run build_scenes.py (no new voice needed).
"""
import json
import os
import sys

slug, fx_file = sys.argv[1], sys.argv[2]
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
path = os.path.join(root, "content", slug, "prompts.txt")
new = json.load(open(fx_file, encoding="utf-8"))
lines = open(path, encoding="utf-8").read().split("\n")
n = 0
for i, l in enumerate(lines):
    if not l.strip() or l.startswith("#"):
        continue
    n += 1
    if str(n) in new:
        desc = l.split("|", 1)[1]
        lines[i] = new[str(n)] + " |" + desc
open(path, "w", encoding="utf-8").write("\n".join(lines))
print("updated", len(new), "scenes")
