"""Hand-read layer coordinates for the pure-Tokyo retro scenes (pixel space of each master).
Run: python scripts/_cozy_retro_scene.py <id>   (edits demo-project/src/cozy-scene/scenes/<id>.json)"""
import json
import os
import sys

import cozy_lib as L

RAIN = lambda rect, n=140, lean=0.2, drops=10, op=0.55: {"rect": rect, "count": n, "lean": lean, "drops": drops, "opacity": op}
STEAM = lambda x, y, rise=110, k=1.0: {"x": x, "y": y, "rise": rise, "spread": 14 * k, "count": 40, "life": 170, "r0": 7 * k, "rGrow": 18 * k, "opacity": 0.45, "amp0": 5 * k, "ampGrow": 22 * k, "drift": 16 * k, "displace": 20 * k}
CAM = lambda a, b, z=1.08: {"zoom": {"mode": "linear", "from": 1, "to": z}, "origin": {"mode": "linear", "from": a, "to": b}, "fade": [20, 45]}
CTA = ["Full version", "on YouTube"]

S = {
    "t80-bubble-night": dict(
        camera={"zoom": {"mode": "linear", "from": 1, "to": 1.1}, "origin": {"mode": "linear", "from": [470, 900], "to": [450, 1000]}, "fade": [20, 45]},
        rain=[RAIN({"x": 370, "y": 300, "w": 570, "h": 250}), RAIN({"x": 580, "y": 550, "w": 360, "h": 215}, 90)],
        steam=STEAM(545, 868),
        candles={"points": [[165, 598], [850, 520]], "size": 70, "base": 0.25, "flick": 0.4, "mid": 0, "onset": 0},
        reel={"kicker": "rain over Tokyo, warm inside", "title": "Rainy Tokyo Night", "cta": ["Full version", "on YouTube"], "ctaSmall": "link in the first comment"},
    ),
    "w80-neon-street": dict(
        exterior=True,
        camera=CAM([480, 700], [470, 780]),
        rain=[RAIN({"x": 0, "y": 0, "w": 941, "h": 1300}, 110, 0.2, 0, 0.4)],
        steam=STEAM(527, 682, 50, 0.4),
        candles={"points": [[810, 432], [633, 535]], "size": 110, "base": 0.25, "flick": 0.4, "mid": 0, "onset": 0},
        reel={"kicker": "rain on a quiet street", "title": "Rainy Tokyo Street", "cta": CTA, "ctaSmall": "link in the first comment"},
    ),
    "w80-arcade": dict(
        exterior=True,
        camera=CAM([470, 960], [470, 900]),
        rain=[RAIN({"x": 0, "y": 0, "w": 941, "h": 1300}, 110, 0.2, 0, 0.4)],
        steam=STEAM(458, 1046, 50, 0.4),
        candles={"points": [[857, 395], [242, 643], [757, 659], [819, 660], [311, 739], [508, 878], [624, 893]], "size": 60, "base": 0.25, "flick": 0.5, "mid": 0, "onset": 0},
        reel={"kicker": "neon and rain", "title": "Tokyo Arcade Night", "cta": CTA, "ctaSmall": "link in the first comment"},
    ),
}


def apply(sid, extra=None):
    p = os.path.join(L.SCENES, sid + ".json")
    c = json.load(open(p, encoding="utf8"))
    for k in ("snow", "lights", "steam", "candles", "rain"):
        c.pop(k, None)
    spec = dict(S[sid])
    if spec.pop("exterior", False):
        c.pop("creature", None)
    else:
        cr = c["creature"]
        cr["breath"]["body"] = {"x": 0, "y": 560, "w": 940, "h": 830}
        for pt in cr["patches"]:
            pt["enabled"] = False
    c.update(spec)
    c["_music"] = c.get("_music", "Window Prayer")
    c.pop("_todo", None)
    json.dump(c, open(p, "w", encoding="utf8"), indent=1, ensure_ascii=False)
    print("ok", sid)


if __name__ == "__main__":
    apply(sys.argv[1])
