"""Put a cozy scene's pictures where Remotion reads them, optionally mirrored into a private render folder.

Usage: python scripts/cozy_prepare.py <scene_id> [out_dir]
  - copies content/<content>/master.png to demo-project/public/<assets>/master.png
  - resizes every ChatGPT result (`from` in the config) to 2x its crop box (sharper than 1x) and saves it as <src>
  - with out_dir: mirrors demo-project/public/<assets>/ to out_dir/<assets>/ for `--public-dir=out_dir`
    (the default render copies the whole public/ folder of every series and has failed on a vanished file)
Audio comes from scripts/cozy_sfx.py (ambience.wav) and your music.mp3 in the same public folder; this script says what is missing.
"""
import os
import shutil
import sys

from PIL import Image

import cozy_lib as L

cfg = L.load(sys.argv[1])
src, dst = L.content_dir(cfg), L.public_dir(cfg)
os.makedirs(dst, exist_ok=True)
shutil.copyfile(os.path.join(src, "master.png"), os.path.join(dst, "master.png"))
for vid, frm, crop, box, pub, prompt in L.variants(cfg):
    p = os.path.join(src, frm)
    if not os.path.exists(p):
        print("MISSING result", frm, "(variant", vid + ")")
        continue
    Image.open(p).convert("RGB").resize((box["w"] * 2, box["h"] * 2), Image.LANCZOS).save(os.path.join(dst, pub))
print("pictures ->", dst)

need = [a["file"] for a in (cfg.get("audio") or {}).values()]
if len(sys.argv) > 2:
    out = os.path.join(os.path.abspath(sys.argv[2]), cfg["assets"])
    shutil.rmtree(out, ignore_errors=True)
    shutil.copytree(dst, out)
    print("mirrored ->", out, " use: --public-dir=" + os.path.abspath(sys.argv[2]))
    dst = out
for n in need:
    if not os.path.exists(os.path.join(dst, n)):
        print("MISSING audio file:", n)
