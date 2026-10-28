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

R = lambda x, y, w, h, n=90: RAIN({"x": x, "y": y, "w": w, "h": h}, n)
CND = lambda pts, size=90, base=0.25, flick=0.45: {"points": pts, "size": size, "base": base, "flick": flick, "mid": 0, "onset": 0}
REEL = lambda kicker, title: {"kicker": kicker, "title": title, "cta": CTA, "ctaSmall": "link in the first comment"}
LIGHTS = lambda regions: {"size": 14, "base": 0.15, "twinkle": 0.5, "react": 0, "regions": regions}
LINE = lambda a, b, n, wave=3: {"type": "line", "count": n, "from": a, "to": b, "wave": wave, "waveLen": 40, "jitter": 8}
SNOW = lambda x, y, w, h, n: {"rect": {"x": x, "y": y, "w": w, "h": h}, "count": n}

S.update({
    "t70-tatami": dict(_music="jazz 4", body=[0, 540, 940, 900], camera=CAM([470, 950], [440, 1050], 1.1), rain=[R(535, 385, 380, 500)], steam=STEAM(545, 978),
                       candles=CND([[55, 650]], 130), reel=REEL("rain on the roofs, warm at the kotatsu", "Showa Rainy Night")),
    "t90-gamer-room": dict(_music="jazz 6", body=[0, 520, 940, 900], camera=CAM([470, 900], [450, 1000], 1.1), rain=[R(520, 290, 385, 600)],
                           candles=CND([[70, 640], [790, 448], [900, 880]], 90), reel=REEL("rain outside, games inside", "Heisei Rainy Evening")),
    "t00-flipphone": dict(_music="jazz 8", body=[0, 560, 940, 800], camera=CAM([470, 900], [450, 1000], 1.1), snow=[SNOW(505, 360, 435, 240, 40), SNOW(590, 600, 350, 230, 30)],
                          steam=STEAM(545, 885), lights=LIGHTS([LINE([15, 385], [235, 455], 10), LINE([610, 865], [920, 875], 8)]),
                          candles=CND([[115, 560]], 110), reel=REEL("first snow over the rooftops", "Tokyo Snow Night 2003")),
    "t80-kissaten": dict(_music="jazz 9", body=[0, 540, 940, 800], camera=CAM([470, 850], [450, 950], 1.1), rain=[R(685, 230, 256, 650), R(460, 330, 130, 190, 40)],
                         steam=STEAM(500, 1165), candles=CND([[535, 265], [115, 420], [75, 530], [45, 720], [775, 365]], 110),
                         reel=REEL("coffee, rain and a quiet street", "Kissaten After Midnight")),
    "t90-sento": dict(_music="jazz 2", body=[0, 420, 940, 1000], camera=CAM([470, 900], [450, 1000], 1.1), rain=[R(560, 310, 90, 700, 40), R(400, 310, 155, 130, 20)],
                      candles=CND([[210, 330], [840, 40], [550, 370], [750, 590]], 100), reel=REEL("rain at the bathhouse", "Sento Waiting Room")),
    "t70-train-night": dict(_music="Locket Rainfall", body=[0, 520, 940, 900], camera=CAM([470, 950], [450, 1050], 1.1), rain=[R(615, 330, 326, 590)], steam=STEAM(540, 830),
                            candles=CND([[235, 370], [200, 468], [20, 470], [755, 665], [835, 690]], 80), reel=REEL("the last train home in the rain", "Rainy Night Train")),
    "t80-rooftop": dict(_music="jazz 5", body=[0, 540, 940, 950], camera=CAM([470, 900], [450, 1000], 1.1), rain=[R(560, 0, 381, 830, 80), R(180, 0, 380, 520, 50)], steam=STEAM(510, 845),
                        candles=CND([[105, 385], [905, 1000], [620, 700], [710, 730], [793, 380]], 100), reel=REEL("rooftop, rain and Tokyo lights", "Rooftop Rain")),
    "w90-konbini": dict(_music="jazz 7", exterior=True, camera=CAM([470, 980], [470, 1050]), rain=[R(0, 0, 941, 1300, 110)], steam=STEAM(575, 1075, 50, 0.4),
                        candles=CND([[105, 585], [80, 820], [515, 825], [695, 830], [200, 790]], 100), reel=REEL("the corner shop never closes", "Konbini in the Rain")),
    "w70-apartment": dict(_music="jazz 1", exterior=True, camera=CAM([470, 1000], [450, 1080]), rain=[R(0, 0, 941, 1400, 110)],
                          candles=CND([[148, 745], [545, 435], [545, 720], [115, 1180], [525, 1005]], 110), reel=REEL("a quiet danchi in the rain", "Showa Apartment Night")),
    "w00-suburb": dict(_music="Window Prayer", exterior=True, camera=CAM([400, 760], [430, 900]), snow=[SNOW(0, 0, 941, 1400, 70)], steam=STEAM(388, 745, 50, 0.3),
                       candles=CND([[865, 605], [340, 577], [505, 1000], [878, 960], [878, 1018]], 80), reel=REEL("snow by the railway crossing", "Suburb Snow Night")),
    "w60-station": dict(_music="jazz 3", exterior=True, camera=CAM([400, 900], [470, 950]), rain=[R(0, 0, 941, 1250, 150)], steam=STEAM(390, 905, 50, 0.3),
                        candles=CND([[695, 740], [400, 750], [885, 823]], 120), reel=REEL("the last platform in the rain", "Rainy Station Night")),
})
S["t80-bubble-night"]["_music"] = "Locket Rainfall"
S["w80-neon-street"]["_music"] = "jazz 10"
S["w80-arcade"]["_music"] = "jazz 6"

# music-reactive glows (neon tubes, CRT screens, jukebox), lightning on some rainy scenes, and the poster intro on the first scene
N = lambda x, y, w, h, color, driver, base, amp: {"box": {"x": x, "y": y, "w": w, "h": h}, "color": color, "driver": driver, "base": base, "amp": amp}
PINK, CYAN, ORANGE, BLUE = "rgba(255,60,150,0.9)", "rgba(40,220,255,0.9)", "rgba(255,150,40,0.9)", "rgba(120,190,255,0.9)"
EXTRA = {
    "t80-bubble-night": dict(neon=[N(340, 340, 80, 200, CYAN, "mid", 0.1, 0.5), N(-60, 300, 400, 500, PINK, "bass", 0.08, 0.3), N(790, 790, 150, 150, BLUE, "onset", 0.15, 0.5), N(520, 560, 90, 130, PINK, "high", 0.1, 0.4)],
                             lightning={"events": {"every": 16, "first": 9, "seed": "lt"}, "strength": 0.3},
                             intro={"seconds": 6, "eyebrow": "TOKYO LO-FI  ·  1985", "subline": "Lost in the warmth.", "headline": "Rainy Tokyo Night", "poster": "TOKYO", "tags": ["RAIN ON THE GLASS,\nI NEED THIS.", "LO-FI JAZZ\nSLEEPY CAT VIBE"], "footer": "LO-FI JAZZ"}),
    "w80-neon-street": dict(neon=[N(700, 980, 180, 200, CYAN, "mid", 0.1, 0.45), N(650, 1330, 260, 260, PINK, "bass", 0.08, 0.35)]),
    "w80-arcade": dict(neon=[N(230, 640, 550, 110, PINK, "bass", 0.15, 0.45), N(640, 400, 150, 100, PINK, "onset", 0.12, 0.5), N(270, 960, 100, 130, CYAN, "mid", 0.1, 0.4), N(500, 960, 100, 130, CYAN, "mid", 0.1, 0.4), N(610, 960, 100, 130, CYAN, "high", 0.1, 0.4), N(720, 920, 100, 190, CYAN, "mid", 0.1, 0.3), N(280, 1330, 500, 250, PINK, "bass", 0.08, 0.3)]),
    "t90-gamer-room": dict(neon=[N(850, 790, 120, 180, BLUE, "onset", 0.2, 0.5)]),
    "t00-flipphone": dict(neon=[N(0, 610, 165, 190, CYAN, "onset", 0.15, 0.45)]),
    "t80-kissaten": dict(neon=[N(0, 600, 110, 260, ORANGE, "bass", 0.12, 0.4), N(850, 290, 90, 320, PINK, "mid", 0.12, 0.45)]),
    "t70-tatami": dict(neon=[N(840, 900, 100, 140, BLUE, "onset", 0.15, 0.4)]),
    "w60-station": dict(lightning={"events": {"every": 20, "first": 8, "seed": "st"}, "strength": 0.35}),
    "w70-apartment": dict(lightning={"events": {"every": 24, "first": 11, "seed": "ap"}, "strength": 0.3}),
    "t70-train-night": dict(lightning={"events": {"every": 22, "first": 7, "seed": "tn"}, "strength": 0.25}),
}


def apply(sid, extra=None):
    p = os.path.join(L.SCENES, sid + ".json")
    c = json.load(open(p, encoding="utf8"))
    for k in ("snow", "lights", "steam", "candles", "rain", "_music", "neon", "lightning", "intro"):
        c.pop(k, None)
    spec = dict(S[sid])
    if spec.pop("exterior", False):
        c.pop("creature", None)
    else:
        cr = c["creature"]
        b = spec.pop("body", [0, 560, 940, 830])
        cr["breath"]["body"] = {"x": b[0], "y": b[1], "w": b[2], "h": b[3]}
        for pt in cr["patches"]:
            pt["enabled"] = False
    spec.pop("body", None)
    spec.update(EXTRA.get(sid, {}))
    c.update(spec)
    c.pop("_todo", None)
    json.dump(c, open(p, "w", encoding="utf8"), indent=1, ensure_ascii=False)
    print("ok", sid)


if __name__ == "__main__":
    apply(sys.argv[1])

