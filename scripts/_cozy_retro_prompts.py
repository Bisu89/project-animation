"""Write content/cozy-retro/assets_masters.csv: ChatGPT prompts for pure-Tokyo 'chill night in older decades' masters (9:16),
with the same young woman as the xmas-tokyo series (attach content/xmas-tokyo/closeup.png). Run once; edit the CSV afterwards."""
import csv
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "content", "cozy-retro")
os.makedirs(OUT, exist_ok=True)

STYLE = ("Lo-fi anime illustration in the style of 90s Japanese anime cels: clean thin dark line art, flat cel shading with only one soft shadow tone, "
         "soft pink blush on the cheeks, slightly muted and desaturated colours, gentle paper grain, calm and quiet mood. Vertical 9:16 portrait.")
HERO = (" The hero is the same original character as in the attached reference picture: a young woman with a short navy-black bob with straight bangs "
        "and one small star hair clip, an oversized cream knit sweater, a red scarf and big white over-ear headphones (keep her face, hair and clothes "
        "identical to the reference; only the setting and era props change).")
IN_RULES = (" LAYOUT RULES (a big title will be printed over the picture): the TOP 25 percent is a calm, plain area with no important detail; the BOTTOM 12 percent "
            "is plain (floor, tatami or blanket). The young woman is the hero, her face clearly visible and large, in the 30 to 70 percent height band; the light "
            "source, the window and the cat are separate areas with space between them. Many small separate lights, each clearly visible. Pure Japan: Tokyo only, "
            "no Western props. No text, no letters, no watermark, no logo (signs are abstract glowing shapes).")
OUT_RULES = (" LAYOUT RULES (a big title will be printed over the picture): a wide establishing shot of a Tokyo street at night, seen from across the road, nobody in the street. "
             "ONE lit window or doorway is the hero spot in the lower-middle, where the young woman and the sleeping cat are visible small but readable. Around it: separate, "
             "clearly distinct areas for the wet street, glowing signs and the dark sky, with space between them so each can get its own animation. The TOP 18 percent is a calm dark sky; "
             "the BOTTOM 10 percent is plain ground. Pure Japan: Tokyo only. No text, no letters, no watermark, no logo (signs are abstract glowing shapes).")

# interiors: id, era, scene, layers
IN = [
    ("t70-tatami", "1970s Showa",
     "A 1970s Showa Tokyo apartment at night, seen from inside: tatami floor, sliding shoji doors, a low kotatsu with an orange futon, a wood-cased tube TV, an electric fan, a paper lantern lamp. She sits at the kotatsu holding a plain cup (no steam), eyes calm. A ginger-and-white cat sleeps on a cushion beside her. Through the window: rain falling on tiled roofs and the glow of Tokyo Tower in the distance. Warm yellowed film colours.",
     "rain (window), steam (cup, code), glows (lantern, TV)"),
    ("t80-bubble-night", "1980s bubble era",
     "A 1980s bubble-era Tokyo apartment at night: a cassette boom box, a Walkman and tapes, a small CRT TV with a console, magenta and cyan neon tubes, posters made of abstract shapes. She sits on the bed listening, a cup in her hands (no steam). The ginger-and-white cat sleeps on the duvet. Through the big window: rain on a Shinjuku-style skyline with glowing towers and Tokyo Tower.",
     "rain (window), glows (neon, CRT on music), steam (cup)"),
    ("t90-gamer-room", "1990s Heisei",
     "A 1990s Heisei Tokyo bedroom at night: a chunky CRT TV with a Super Famicom and controllers on the tatami, a bunk bed, anime posters made of abstract shapes, a desk lamp. She sits on a floor cushion holding a can of soda, eyes calm. The ginger-and-white cat sleeps in a basket. Through the window: light rain, a street lamp and a narrow Tokyo side street with a glowing vending machine.",
     "rain (window), glows (TV, lamp)"),
    ("t00-flipphone", "2000s",
     "A 2000s Tokyo apartment at night: a bulky CRT monitor and beige PC on a desk, a flip phone and a MiniDisc player, string fairy lights, a floor cushion. She sits with a cup, eyes calm. The ginger-and-white cat sleeps on the cushion. Through the window: light snow over a quiet Tokyo suburb with a train line and small lit windows.",
     "snow (window), glows (monitor), lights (string), steam (cup)"),
    ("t80-kissaten", "1980s",
     "A small 1980s Tokyo kissaten (retro coffee shop) at night: red vinyl booth, a counter with a siphon coffee maker, a jukebox, a pink neon sign in the window (abstract shapes), rain on the glass and a narrow lit street outside. She sits in the booth with a cup of coffee (no steam), eyes calm. The ginger-and-white cat sleeps on the seat beside her.",
     "rain (window), steam (cup, siphon), glows (neon, jukebox on music)"),
    ("t90-sento", "1990s",
     "The waiting area of a 1990s Tokyo sento (public bath) at night: wooden lockers, a bench, a fridge of glass milk bottles, a noren curtain, a sliding door with frosted glass and rain outside. She sits on the bench with her scarf and headphones over a light yukata, holding a milk bottle, eyes calm. The ginger-and-white cat sleeps on the bench beside her.",
     "rain (door glass), steam (warm air from the bath door), glows (fridge, lamp)"),
    ("t70-train-night", "1970s",
     "Inside a 1970s Tokyo commuter train carriage at night: vintage green seats, hanging straps, a wide window with rain streaming and blurred city lights and an elevated track. She sits by the window, a cup in her hands (no steam), eyes calm. The ginger-and-white cat sleeps on a blanket on the seat beside her. Empty carriage, warm ceiling lights.",
     "rain (window), glows (ceiling lights), steam (cup)"),
    ("t80-rooftop", "1980s",
     "A Tokyo rooftop balcony of a 1980s apartment block at night: a laundry pole, potted plants, a small folding table with a cup, a view over rooftops with water towers, neon signs and Tokyo Tower glowing, light rain. She sits on a stool under a small awning, eyes calm. The ginger-and-white cat sleeps on a blanket at her feet.",
     "rain (open sky), glows (neon, tower), steam (cup)"),
]
# exteriors: id, era, scene, layers
OUTS = [
    ("w80-neon-street", "1980s",
     "A narrow 1980s Tokyo street in the rain, seen from across the road: a two-storey building with a glowing sign (abstract shapes), a lit upstairs window where the young woman sits at the sill with a cup and the ginger-and-white cat sleeps beside her, wet asphalt full of pink and cyan reflections, a lamp post, a vending machine.",
     "rain (whole picture), glows (sign, window on music), steam (vending machine)"),
    ("w90-konbini", "1990s",
     "A 1990s Tokyo konbini (convenience store) at night in light rain, seen from the pavement: a glowing glass storefront with shelves, a vending machine beside it, a bicycle. The young woman sits on the window counter inside with a cup and the ginger-and-white cat sleeps next to her. Telephone poles with wires, wet road.",
     "rain, glows (shop, vending machine), steam"),
    ("w70-apartment", "1970s",
     "A 1970s Tokyo danchi apartment block at dusk turning to night, seen from the street: many lit windows with curtains and plants, a balcony with laundry, light rain, a glowing phone booth. In the central lit window the young woman sits with a cup and the ginger-and-white cat sleeps on the sill.",
     "rain, glows (windows, phone booth), steam (rooftop vent)"),
    ("w00-suburb", "2000s",
     "An early-2000s Tokyo suburban house at night in falling snow, seen from the front: a lit upstairs window where the young woman sits with a cup, the ginger-and-white cat asleep beside her, a CRT glow, a bicycle and mailbox, a railway crossing light glowing red in the distance.",
     "snow (whole picture), glows (window, crossing light), lights"),
    ("w60-station", "1960s",
     "A small 1960s Tokyo railway halt at night in the rain: a wooden platform with a lit waiting room window where the young woman sits on the bench with a cup and the ginger-and-white cat sleeps next to her, a hanging station lamp, an empty track into misty dark, a red signal light.",
     "rain, glows (lamp, signal), steam (cup)"),
    ("w80-arcade", "1980s",
     "A 1980s Tokyo game arcade entrance at night in the rain, seen from the pavement: a glass door glowing with machine screens (abstract pixels), a neon sign shape, puddles reflecting pink and cyan, a vending machine. Just inside the door the young woman sits on a stool with a cup and the ginger-and-white cat sleeps on the next stool.",
     "rain, glows (neon, screens on music), steam (vending machine)"),
]


def note(i, era, layers, kind):
    return ("ATTACH content/xmas-tokyo/closeup.png as the character reference (same face, hair, clothes). Era: %s. Generate 3 options, choose one, save as "
            "content/cozy-retro/masters/%s.png; later python scripts/cozy_new.py %s portrait. Layers: %s; creature = girl (breath; patches blink, smile) + cat ear. %s"
            % (era, i, i, layers, "Pick the one where window, sign and street are cleanly separated." if kind == "out" else "Pick the one where light, window and cat are separate."))


with open(os.path.join(OUT, "assets_masters.csv"), "w", newline="", encoding="utf8") as f:
    w = csv.writer(f)
    w.writerow(["id", "type", "image_filename", "aspect", "prompt", "notes"])
    for i, era, scene, layers in IN:
        w.writerow([i, "master", "cozy-retro/masters/%s.png" % i, "9:16", STYLE + " SCENE: " + scene + HERO + IN_RULES, note(i, era, layers, "in")])
    for i, era, scene, layers in OUTS:
        w.writerow([i, "master", "cozy-retro/masters/%s.png" % i, "9:16", STYLE + " SCENE: " + scene + HERO + OUT_RULES, note(i, era, layers, "out")])
print(len(IN) + len(OUTS), "rows")
