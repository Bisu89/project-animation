"""Write content/cozy-retro/assets_masters.csv: ChatGPT prompts for 'chill night, older decades' master pictures (9:16)."""
import csv
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "content", "cozy-retro")
os.makedirs(OUT, exist_ok=True)

LAYOUT = (" LAYOUT RULES (important): the sleeping animal is the hero, drawn LARGE (about 30 percent of the picture height) in the lower-middle "
          "of the frame (55 to 80 percent of the height), asleep with its eyes closed, WHOLE body visible, nothing covering it. The light source, "
          "the animal and the window are three clearly separate areas with empty space between them. Keep the top 20 percent calmer and darker "
          "(a title will be written there) and the bottom 12 percent plain floor. No people. No text, no watermark, no logo, no readable brand names.")

# id, decade, style, scene, animal, notes
S = [
 ("r70-livingroom", "1970s", "1970s analog film photograph look, warm Kodak colours, soft grain, slightly faded, painterly anime-realistic blend, Vertical 9:16 portrait.",
  "A 1970s living room at night: wood-panelled walls, orange shag carpet, a brown corduroy sofa, a record player with a vinyl spinning and floor speakers, a lava-orange table lamp, a big window with rain running down the glass and blurred city lights outside, a houseplant, a steaming cup on a coffee table.",
  "A ginger cat curled up asleep on the shag carpet in the centre.",
  "Layers: rain (window rect, reuse snow with strong lean), steam (cup), glows (lamp), creature. Variants: eyes half, ear, tail."),
 ("r80-neon-room", "1980s", "1980s synthwave-cosy illustration, magenta and cyan neon glow, VHS softness, light film grain, anime style, Vertical 9:16 portrait.",
  "A 1980s teenager's bedroom at night: posters (abstract, no text), a CRT television glowing blue with static, a cassette player and tapes, neon tube lights in pink and cyan along the wall, a big window with a night city skyline and falling rain, a bed with a patterned duvet.",
  "A black cat asleep on the duvet in the centre.",
  "Layers: rain (window), glows (neon pink/cyan react to music, CRT flicker), steam none, creature. Variants: eyes half, ear, tail."),
 ("r90-gameboy", "1990s", "1990s nostalgic anime illustration, soft CRT glow, warm lamp light, slight VHS grain, Vertical 9:16 portrait.",
  "A 1990s bedroom at night: a chunky CRT television with a game console and controllers on the carpet, a bunk bed, stickers and a map on the wall, a desk lamp, a window with a street lamp and light rain, a bowl of snacks and a can of soda.",
  "A tabby cat asleep on a beanbag in the centre.",
  "Layers: rain (window), glows (TV flicker), steam none, lights (street lamp), creature. Variants: eyes half, ear, tail."),
 ("r00-lavalamp", "2000s", "early-2000s nostalgic anime illustration, soft bloom, cool blue monitor glow, light grain, Vertical 9:16 portrait.",
  "A 2000s bedroom at night: a bulky CRT computer monitor and a beige tower on a desk, a glowing lava lamp, string fairy lights, a window with a dim suburban street and falling snow, an old stereo with a CD, a hoodie on a chair.",
  "A white cat asleep on a floor cushion in the centre.",
  "Layers: snow (window), glows (monitor, lava lamp), lights (string), creature. Variants: eyes half, ear, tail."),
 ("r80-diner", "1980s", "1980s American diner night illustration, neon reflections, film grain, anime style, Vertical 9:16 portrait.",
  "An empty 1980s roadside diner at night: red vinyl booths, a jukebox, a pink and blue neon sign glowing in the big window (no readable text), rain on the glass and a wet empty highway outside, a steaming coffee cup and a slice of pie on the table.",
  "A grey cat asleep on the booth seat in the centre.",
  "Layers: rain (window), steam (coffee), glows (neon, jukebox on music), creature. Variants: eyes half, ear, tail."),
 ("r70-van", "1970s", "1970s road-trip film look, golden hour fading to dusk, warm grain, anime style, Vertical 9:16 portrait.",
  "The inside of a parked 1970s camper van at night: orange curtains, wood cabinets, a small gas stove with a kettle, a cassette radio, a big open sliding door framing a starry sky and a campfire glowing outside by a lake.",
  "A golden dog asleep on a striped blanket in the centre.",
  "Layers: fire (campfire seen through the door), steam (kettle), glows, creature. Variants: eyes half, ear, tail. Fire plate: remove the flames."),
 ("r90-videostore", "1990s", "1990s small-town night illustration, fluorescent and neon colours, soft VHS grain, anime style, Vertical 9:16 portrait.",
  "A small 1990s video rental shop after closing: shelves full of VHS tapes (no readable titles), a CRT television on a trolley playing static light, a counter with a bell, a big glass door with rain and a glowing street sign outside, a steaming cup of noodles on the counter.",
  "An orange cat asleep on the counter on a folded jacket in the centre.",
  "Layers: rain (door glass), steam (noodles), glows (TV, sign), creature. Variants: eyes half, ear, tail."),
 ("r60-radio", "1960s", "1960s mid-century illustration, muted teal and mustard palette, warm tube-lamp light, film grain, anime style, Vertical 9:16 portrait.",
  "A 1960s mid-century living room at night: teak furniture, a tube radio with glowing dial and a tube-glow, a record on the turntable, a big window with snow falling over a quiet suburban street, a steaming teacup on a teak table, a hanging globe lamp.",
  "A cream cat asleep on a woven rug in the centre.",
  "Layers: snow (window), steam (tea), glows (radio, lamp), creature. Variants: eyes half, ear, tail."),
]
with open(os.path.join(OUT, "assets_masters.csv"), "w", newline="", encoding="utf8") as f:
    w = csv.writer(f)
    w.writerow(["id", "type", "image_filename", "aspect", "prompt", "notes"])
    for i, dec, style, scene, animal, notes in S:
        w.writerow([i, "master", f"{i}/master.png", "9:16", f"{style} {scene} {animal}{LAYOUT}",
                    f"decade: {dec}. Generate 3 options, pick the one where light / animal / window are cleanly separated; save as content/{i}/master.png (then python scripts/cozy_new.py {i} portrait). {notes}"])
print(len(S), "rows")
