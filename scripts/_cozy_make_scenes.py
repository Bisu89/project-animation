"""One-off generator for the 13 scene configs of the Reels series (attic-cat was written by hand).
Coordinates were read from content/xmas-tokyo/<id>/master.png (pixels of the master). Re-running overwrites the JSON files and
rebuilds the registry. Everything that needs a ChatGPT picture that does not exist yet is `enabled: false`.
Usage: python scripts/_cozy_make_scenes.py"""
import json
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SC = os.path.join(ROOT, "demo-project", "src", "cozy-scene", "scenes")
B = lambda x, y, w, h: {"x": x, "y": y, "w": w, "h": h}


def snow(x, y, w, h, n, ellipse=False):
    d = {"rect": B(x, y, w, h), "count": n}
    if ellipse:
        d["shape"] = "ellipse"
    return d


def steam(x, y, rise=130, spread=16, count=50, r0=8, rgrow=22, op=0.5, drift=16):
    return {"x": x, "y": y, "rise": rise, "spread": spread, "count": count, "life": 170, "r0": r0, "rGrow": rgrow, "opacity": op, "amp0": 5, "ampGrow": 22, "drift": drift, "displace": 20}


def line(a, b, n, wave=8, wl=45, jit=22):
    return {"type": "line", "count": n, "from": list(a), "to": list(b), "wave": wave, "waveLen": wl, "jitter": jit}


def tree(ax, top, h, ht, hb, n, skew=0):
    return {"type": "tree", "count": n, "axisX": ax, "topY": top, "height": h, "halfTop": ht, "halfBottom": hb, "skew": skew}


def fire(plate_box, base, area, tongues, emb, plate_prompt):
    return {
        "enabled": False,
        "plate": {"src": "fire_plate.png", "from": "fire_plate.png", "crop": "fire_crop.png", "box": plate_box, "prompt": plate_prompt},
        "base": base, "area": area, "mask": "both", "tongues": tongues, "embers": {"x0": emb[0], "w": emb[1], "count": emb[2]},
    }


def patch(pid, frm, crop, box, every, first, env, prompt, seed=None):
    return {"enabled": False, "id": pid, "src": pid + ".png", "from": frm, "crop": crop, "box": box,
            "events": {"every": every, "first": first, "seed": seed or pid}, "env": env, "prompt": prompt}


EYES = "CHANGE ONLY the {a}'s eyes: both eyes open just a thin sleepy slit, about one eighth open, only a sliver of the eye visible, the lids still heavy, as if it half-wakes. Do NOT show the full round iris."
EAR = "CHANGE ONLY the {a}'s {side}ear: it is flicked slightly, rotated about 12 degrees backward and a little lower, as in a twitch. Eyes stay closed."
TAIL = "CHANGE ONLY the tip of the {a}'s tail ({where}): it curls up and sideways by a small amount, about 15 degrees, lifted slightly off the surface. The rest unchanged."
BLINK = "CHANGE ONLY her eyes: both eyes fully CLOSED, drawn as soft curved lash lines (a relaxed blink). Eyebrows, blush, mouth and everything else unchanged."
SMILE = "CHANGE ONLY her expression: eyes gently closed and a small content smile, as if she is enjoying the song. Everything else unchanged."
EYESOPEN = "CHANGE ONLY her eyes: both eyes gently OPEN, calm and half-lidded, looking down; the small smile stays. Everything else unchanged."
CATEAR = "CHANGE ONLY the cat's near ear: flicked slightly backward about 12 degrees, as in a twitch. Eyes stay closed."
FIREPLATE = "REMOVE ALL FLAMES. Keep {thing} exactly where they are, and make the logs glow as hot orange-red embers with a few small bright coals, no flames, no smoke, no sparks. Keep the warm orange light on the surroundings."


def animal_patches(a, face, tail=None, ear_side="", tail_where="the free end", ear_box=None):
    p = [
        patch("ear", "face_ear.png", "face_crop.png", face, 30, 5, [0.2, 0.35, 0.3], EAR.format(a=a, side=ear_side)),
        patch("eyes", "face_eyes.png", "face_crop.png", face, 50, 18, [0.8, 0.5, 0.8], EYES.format(a=a)),
    ]
    if tail:
        p.append(patch("tail", "tail_lift.png", "tail_crop.png", tail, 40, 11, [1, 0.4, 1], TAIL.format(a=a, where=tail_where)))
    return p


def girl_patches(face, cat, smile_prompt=SMILE, blink_prompt=BLINK, every_blink=6):
    return [
        patch("blink", "face_blink.png", "face_crop.png", face, every_blink, 2, [0.05, 0.08, 0.07], blink_prompt),
        patch("smile", "face_smile.png", "face_crop.png", face, 24, 9, [0.8, 2.5, 0.8], smile_prompt),
        patch("cat_ear", "cat_ear.png", "cat_crop.png", cat, 34, 7, [0.2, 0.35, 0.3], CATEAR),
    ]


# id: (title kicker, title, music, focus_from, focus_to, parts)
S = {}

S["tokyo-window"] = dict(
    reel=("snow outside, warm in here", "Christmas in Tokyo"), music="Window Prayer", cam=([400, 700], [380, 860]),
    snow=[snow(220, 0, 685, 430, 40), snow(660, 430, 245, 570, 30), snow(745, 1000, 160, 140, 10)],
    steam=steam(512, 768, 110, 14, 40, 7, 18, 0.45),
    lights=[line((168, 20), (175, 520), 14, 3, 40, 10), line((918, 0), (918, 1170), 28, 3, 40, 10), tree(40, 600, 280, 8, 55, 14)],
    candles=[[722, 570], [798, 650], [704, 735], [724, 808], [783, 845], [625, 745], [110, 1480]], csize=34,
    breath=([300, 1330], B(20, 560, 760, 830), 0.005),
    patches=girl_patches(B(200, 500, 450, 300), B(400, 1130, 450, 300)))

S["kotatsu-sleep"] = dict(
    reel=("a nap under the kotatsu", "Cozy Christmas Nap"), music="jazz 3", cam=([470, 900], [500, 1000]),
    snow=[snow(630, 285, 310, 600, 45)], steam=steam(440, 980, 140, 14, 45, 7, 18, 0.45),
    lights=[tree(95, 300, 260, 8, 85, 14), tree(905, 520, 200, 5, 40, 10)],
    candles=[[28, 765], [235, 575], [822, 520], [740, 560], [648, 658], [815, 665]], csize=40,
    breath=([500, 1030], B(20, 560, 900, 520), 0.005),
    patches=[patch("smile", "face_smile.png", "face_crop.png", B(200, 620, 450, 300), 26, 8, [1.0, 2.5, 1.0], "CHANGE ONLY her expression: asleep (eyes stay closed) but a small content smile appears on her lips. Everything else unchanged."),
             patch("cat_ear", "cat_ear.png", "cat_crop.png", B(490, 830, 450, 300), 30, 6, [0.2, 0.35, 0.3], CATEAR)])

S["konbini-bench"] = dict(
    reel=("hot cocoa on a snowy night", "Konbini Christmas"), music="jazz 10", cam=([420, 760], [400, 900]),
    snow=[snow(0, 0, 700, 500, 45), snow(0, 500, 240, 430, 15)], steam=steam(560, 818, 100, 14, 40, 6, 16, 0.4, 30),
    lights=[line((835, 15), (575, 440), 30, 8, 30, 18), tree(750, 680, 200, 6, 36, 10)],
    candles=[[707, 332], [125, 465]], csize=90,
    breath=([400, 1200], B(0, 520, 760, 780), 0.004),
    patches=girl_patches(B(250, 560, 450, 300), B(0, 1050, 450, 300)))

S["nabe-table"] = dict(
    reel=("warm soup, warm heart", "Cozy Hot Pot Night"), music="jazz 7", cam=([430, 760], [420, 900]),
    snow=[snow(120, 0, 820, 300, 40), snow(560, 310, 380, 590, 35), snow(355, 320, 205, 190, 10)],
    steam=[steam(500, 880, 120, 14, 36, 6, 16, 0.4), steam(270, 1160, 250, 150, 70, 10, 26, 0.3, 20)],
    lights=[line((110, 330), (940, 245), 22, 6, 60, 20), tree(95, 420, 340, 8, 90, 20)],
    candles=[[30, 500], [48, 810], [890, 885], [140, 1450], [390, 380], [480, 400], [608, 375], [780, 335]], csize=44,
    breath=([470, 1190], B(0, 480, 940, 720), 0.004),
    patches=[patch("eyes_open", "face_open.png", "face_crop.png", B(200, 560, 450, 300), 28, 8, [0.8, 2.0, 0.8], EYESOPEN),
             patch("cat_ear", "cat_ear.png", "cat_crop.png", B(490, 960, 450, 300), 32, 7, [0.2, 0.35, 0.3], CATEAR)])

S["balcony-blanket"] = dict(
    reel=("wrapped up, watching the snow", "Winter Balcony"), music="jazz 5", cam=([450, 800], [420, 950]),
    snow=[snow(300, 0, 641, 470, 45), snow(470, 470, 471, 270, 15)],
    steam=[steam(500, 858, 120, 14, 40, 6, 16, 0.4), steam(760, 965, 100, 12, 30, 5, 14, 0.3)],
    lights=[line((475, 768), (910, 835), 12, 10, 70, 12), line((150, 20), (215, 540), 24, 14, 50, 40), tree(55, 1150, 300, 30, 50, 14)],
    candles=[[870, 1075], [125, 1430], [780, 520]], csize=70, glow=B(560, 840, 600, 560),
    breath=([330, 1250], B(0, 500, 700, 850), 0.004),
    patches=girl_patches(B(100, 560, 450, 300), B(150, 1060, 450, 300)))

S["attic-reading"] = dict(
    reel=("one more chapter", "Cozy Attic Reading"), music="jazz 1", cam=([450, 800], [430, 950]),
    snow=[snow(5, 360, 405, 170, 18), snow(222, 540, 190, 200, 12)], steam=steam(860, 1135, 130, 14, 36, 6, 16, 0.4),
    lights=[line((0, 290), (640, 520), 20, 10, 50, 30), line((775, 420), (915, 225), 14, 8, 40, 30), tree(785, 450, 140, 4, 40, 8)],
    candles=[[885, 900], [880, 560]], csize=80,
    breath=([400, 1190], B(0, 540, 940, 700), 0.004),
    patches=girl_patches(B(330, 620, 450, 300), B(0, 1000, 450, 300), every_blink=7))

S["windowseat-cat"] = dict(
    reel=("snowfall from the window seat", "Cozy Window Seat"), music="jazz 2", cam=([470, 900], [480, 1020]),
    snow=[snow(195, 250, 140, 580, 22), snow(360, 505, 385, 325, 40), snow(360, 250, 60, 250, 8), snow(770, 250, 160, 580, 25), snow(675, 250, 70, 250, 10)],
    steam=steam(322, 818, 120, 12, 40, 6, 16, 0.4),
    lights=[line((115, 225), (925, 205), 26, 8, 60, 22), tree(70, 450, 330, 8, 95, 22)],
    candles=[[218, 805], [900, 800]], csize=60,
    breath=([480, 1150], B(150, 880, 700, 330), 0.009),
    patches=animal_patches("cat", B(120, 880, 450, 300), B(380, 930, 450, 300), "LEFT ", "the free striped end curling in front"))

S["porch-dog"] = dict(
    reel=("storm outside, quilt inside", "Snowstorm Porch"), music="Window Prayer", cam=([470, 1000], [420, 1080]),
    snow=[snow(315, 0, 625, 760, 90)], steam=steam(140, 830, 130, 12, 40, 6, 16, 0.4),
    lights=[line((425, 760), (940, 740), 24, 6, 40, 16), line((0, 230), (140, 560), 6, 4, 40, 40)],
    candles=[[255, 430], [105, 300]], csize=100,
    breath=([480, 1200], B(100, 930, 790, 290), 0.009),
    patches=animal_patches("dog", B(90, 950, 450, 300), B(450, 950, 450, 300), "near ", "the fluffy end lying on the quilt at the right"))

S["tent-dog"] = dict(
    reel=("warm light in a snowy camp", "Cozy Winter Camp"), music="jazz 3", cam=([470, 900], [500, 1020]),
    snow=[snow(430, 260, 430, 610, 40)], steam=steam(850, 590, 130, 14, 40, 6, 16, 0.4, 20),
    lights=[tree(280, 540, 160, 6, 70, 14)], candles=[[120, 650], [820, 825]], csize=100,
    fire=fire(B(480, 620, 450, 300), 852, B(770, 760, 120, 100), [[812, 5, 25], [822, 6, 40], [832, 6, 45], [842, 5, 32]], (806, 50, 6),
              FIREPLATE.format(thing="the small iron stove, its glass door and the logs next to it")),
    glows=[("big", B(300, 450, 900, 800), 0.06, 0.14, "fire")],
    breath=([450, 1190], B(80, 880, 770, 340), 0.009),
    patches=animal_patches("husky dog", B(480, 900, 450, 300), B(60, 960, 450, 300), "near ", "the fluffy end curled at the left"))

S["bakery-cat"] = dict(
    reel=("closing time at the bakery", "Christmas Bakery Night"), music="jazz 10", cam=([470, 900], [480, 1020]),
    snow=[snow(675, 260, 266, 530, 40)], steam=steam(120, 860, 120, 90, 40, 8, 22, 0.3, 20),
    lights=[line((600, 260), (941, 110), 28, 10, 50, 20)], candles=[[515, 400], [640, 832]], csize=70,
    fire=fire(B(0, 520, 450, 300), 745, B(0, 560, 200, 200), [[15, 8, 60], [35, 10, 95], [55, 11, 120], [75, 10, 100], [95, 9, 75], [115, 7, 50]], (10, 120, 8),
              FIREPLATE.format(thing="the brick oven, its arch and the logs")),
    glows=[("big", B(-300, 380, 850, 700), 0.07, 0.15, "fire")],
    breath=([500, 1130], B(230, 900, 560, 290), 0.009),
    patches=animal_patches("cat", B(400, 900, 450, 300), B(220, 980, 450, 300), "", "the striped end at the left"))

S["library-owl"] = dict(
    reel=("the quietest night of the year", "Cozy Christmas Library"), music="jazz 7", cam=([470, 950], [440, 1050]),
    snow=[snow(705, 60, 236, 720, 40)], steam=[steam(815, 1000, 150, 14, 40, 6, 18, 0.4), steam(770, 1090, 90, 10, 24, 5, 12, 0.3)],
    lights=[line((265, 150), (630, 275), 24, 12, 45, 25), line((0, 420), (300, 640), 22, 10, 40, 40), tree(655, 720, 100, 4, 30, 6)],
    candles=[[220, 385], [180, 405], [250, 450], [455, 695], [545, 548], [918, 825]], csize=50,
    fire=fire(B(0, 760, 450, 300), 1065, B(0, 780, 150, 320), [[12, 9, 110], [30, 11, 170], [48, 12, 220], [66, 11, 200], [84, 10, 150], [102, 8, 110]], (6, 100, 10),
              FIREPLATE.format(thing="the stone fireplace, the iron fire guard and the logs")),
    glows=[("big", B(-300, 600, 800, 800), 0.07, 0.15, "fire")],
    breath=([480, 1100], B(280, 850, 420, 320), 0.01),
    patches=[patch("eyes", "face_eyes.png", "face_crop.png", B(230, 820, 450, 300), 45, 14, [0.8, 0.5, 0.8], "CHANGE ONLY the owl's eyes: one eye (the one facing us) open a thin sleepy slit, the other still closed. Everything else unchanged."),
             patch("tilt", "face_tilt.png", "face_crop.png", B(230, 820, 450, 300), 38, 8, [1.2, 0.5, 1.2], "CHANGE ONLY the owl's head: tilted slightly to the right, about 6 degrees, eyes still closed; the feathers and body unchanged.")])

S["barn-reindeer"] = dict(
    reel=("a quiet night in the barn", "Christmas Eve Barn"), music="jazz 5", cam=([470, 1000], [420, 1100]),
    snow=[snow(615, 290, 290, 650, 45)], steam=steam(262, 1228, 60, 8, 24, 5, 12, 0.25),
    lights=[line((0, 150), (390, 500), 26, 6, 45, 22)], candles=[[105, 425], [337, 545], [812, 367]], csize=90,
    glows=[("big", B(-100, 300, 600, 700), 0.06, 0.12, "fire")],
    breath=([500, 1230], B(100, 920, 780, 350), 0.01),
    patches=animal_patches("reindeer calf", B(100, 960, 450, 300), None, "near "))

S["train-fox"] = dict(
    reel=("the night train through the snow", "Winter Night Train"), music="jazz 1", cam=([470, 950], [440, 1050]),
    snow=[snow(512, 145, 430, 590, 70)], steam=steam(225, 740, 120, 12, 36, 6, 16, 0.4),
    lights=[line((455, 190), (925, 20), 26, 8, 40, 24)], candles=[[85, 610]], csize=180, glow=B(-250, 300, 700, 700),
    breath=([470, 1150], B(180, 850, 640, 340), 0.01),
    patches=animal_patches("fox", B(150, 870, 450, 300), B(350, 900, 450, 300), "near ", "the white-tipped end at the front"))


def build(sid, s):
    w, h = Image.open(os.path.join(ROOT, "content", "xmas-tokyo", sid, "master.png")).size
    cfg = {
        "id": sid, "assets": sid, "content": "xmas-tokyo/" + sid, "master": {"w": w, "h": h}, "view": {"out": [1080, 1920]},
        "camera": {"zoom": {"mode": "linear", "from": 1, "to": 1.12}, "origin": {"mode": "linear", "from": s["cam"][0], "to": s["cam"][1]}, "fade": [20, 45]},
        "vignette": {"at": [50, 55], "from": 55, "alpha": 0.5},
    }
    if "fire" in s:
        cfg["fire"] = s["fire"]
    gl = []
    for g in s.get("glows", []):
        gl.append({"box": g[1], "kind": g[0], "base": g[2], "amp": g[3], "driver": g[4]})
    if s.get("glow"):
        gl.append({"box": s["glow"], "kind": "big", "base": 0.07, "amp": 0.14, "driver": "fire"})
    if gl:
        cfg["glows"] = gl
    cfg["snow"] = s["snow"]
    cfg["steam"] = s["steam"]
    cfg["lights"] = {"size": 18, "base": 0.08, "twinkle": 0.5, "react": 0, "regions": s["lights"]}
    cfg["candles"] = {"points": s["candles"], "size": s["csize"], "base": 0.2, "flick": 0.4, "mid": 0, "onset": 0}
    o, body, amp = s["breath"]
    cfg["creature"] = {"breath": {"origin": o, "body": body, "amp": amp, "speed": 1.55}, "patches": s["patches"]}
    cfg["audio"] = {"ambience": {"file": "ambience.wav", "volume": 0.55}, "music": {"file": "music.mp3", "volume": 0.8, "fadeIn": 60, "fadeOut": 90}}
    cfg["reel"] = {"kicker": s["reel"][0], "title": s["reel"][1], "cta": ["Full version", "on YouTube"], "ctaSmall": "link in the first comment"}
    cfg["_music"] = s["music"]
    return cfg


for sid, s in S.items():
    with open(os.path.join(SC, sid + ".json"), "w", encoding="utf-8") as f:
        json.dump(build(sid, s), f, indent=1)

# registry
ids = ["xmas-cat", "xmas-cat-wide", "attic-cat"] + list(S.keys())
var = lambda i: "".join(p.capitalize() if k else p for k, p in enumerate(i.split("-"))) + "Cfg"
lines = ['// Add one entry per scene. `timing` is in seconds: the Reels cut and the long cut. `features` (optional) = per-frame music',
         '// envelopes (python scripts/smoke_features.py <music.mp3> <features.json>) for lights that react to the music.',
         'import type { CozyConfig, Features } from "./types";']
lines += ['import %s from "./scenes/%s.json";' % (var(i), i) for i in ids]
lines += ['import wideFeatures from "../xmas-cat-wide/features.json";', '',
          'export type SceneEntry = { config: CozyConfig; timing: { reel: number; full: number }; features?: Features };', '',
          'export const SCENES: Record<string, SceneEntry> = {']
for i in ids:
    t = "{ reel: 45, full: 600 }" if i == "xmas-cat-wide" else ("{ reel: 45, full: 40 }")
    extra = ", features: wideFeatures as unknown as Features" if i == "xmas-cat-wide" else ""
    lines.append('  "%s": { config: %s as unknown as CozyConfig, timing: %s%s },' % (i, var(i), t, extra))
lines.append("};")
with open(os.path.join(ROOT, "demo-project", "src", "cozy-scene", "registry.ts"), "w", encoding="utf-8") as f:
    f.write("\n".join(lines) + "\n")
print(len(S), "scenes written;", len(ids), "in registry")
