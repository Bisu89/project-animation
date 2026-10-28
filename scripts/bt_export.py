"""Key the green-screen sprites of content/better-together/ and copy everything into the Remotion project.

Input : content/better-together/{bg_cliff,bg_sunset}.png and sprites/{girl_look,girl_pull,boy_climb,boy_reach,couple_back}.png
Output: demo-project/public/better-together/*.png (sprites cropped to their bbox) and src/better-together/layers.json (sizes).
"""
import json
import os
import shutil
import sys

from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
from camp_layers import key  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "content", "better-together")
DST = os.path.join(ROOT, "demo-project", "public", "better-together")
BGS = ["bg_cliff", "bg_sunset"]
SPRITES = ["girl_look", "girl_pull", "boy_climb", "boy_reach", "couple_back"]

os.makedirs(DST, exist_ok=True)
sizes = {}
for n in BGS:
    shutil.copy(os.path.join(SRC, n + ".png"), os.path.join(DST, n + ".png"))
for n in SPRITES:
    im = key(Image.open(os.path.join(SRC, "sprites", n + ".png")))
    box = im.getchannel("A").point(lambda v: 255 if v > 40 else 0).getbbox()
    im = im.crop(box)
    im.save(os.path.join(DST, n + ".png"))
    sizes[n] = {"w": im.width, "h": im.height}
    print(n, im.size)
with open(os.path.join(ROOT, "demo-project", "src", "better-together", "layers.json"), "w") as f:
    json.dump(sizes, f, indent=2)
