"""Show which narration sentence each sound rule fires on (and flag rules that match nothing or many).

usage: python scripts/check_sfx_rules.py zs-ep01
"""
import json
import os
import re
import sys

slug = sys.argv[1] if len(sys.argv) > 1 else "zs-ep01"
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rules = json.load(open(os.path.join(root, "demo-project", "src", slug, "sfxrules.json"), encoding="utf-8"))["rules"]
cues = json.load(open(os.path.join(root, "demo-project", "src", slug, "timeline.json"), encoding="utf-8"))["cues"]
bad = 0
for r in rules:
    hits = [c for c in cues if re.search(r["re"], c["text"], re.I)]
    flag = "" if len(hits) == 1 else ("  <-- NO MATCH" if not hits else "  <-- %d matches" % len(hits))
    bad += bool(flag)
    where = ", ".join("#%d@%.1fs" % (c["i"], c["start"] + r.get("at", 0)) for c in hits)
    print("%-14s %-42s %s%s" % (r["sfx"], r["re"][:42], where, flag))
print("rules:", len(rules), "| need attention:", bad)
