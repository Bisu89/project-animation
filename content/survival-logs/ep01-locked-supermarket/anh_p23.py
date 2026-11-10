"""Danh sách ảnh Part 2 + Part 3 (theo COT-TRUYEN v5 + CONTINUITY v2, đã duyệt). Lời kể viết sau, gán vào các ảnh này.

    python anh_p23.py p2|p3     -> ghi pN/gen-anh.csv (gửi kèm model sheet nhân vật có mặt)
"""
import csv, os, shutil, sys
D = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(D, "p1"))
import kich_ban as K

NIA = ("Nia is the small stick figure from the attached model sheet nia-model-sheet.png, drawn EXACTLY like it: a 9-year-old girl, "
       "about two thirds of the adult stick figures' height, same simple flat stick style, two small round hair puffs, an oversized "
       "mustard-yellow bakery jacket with rolled-up sleeves, small red sneakers. ")
DAD = "The driver (Nia's father) is a REALISTIC painted man in a work jacket, not a stick figure. "
ZOMB = K.ZOMB

# id: (mô tả, hero, maya, nia)
P2 = {
    "p2-01": ("Morning, Day 6, stockroom: the survivor and Maya sit apart on boxes eating crackers in awkward silence; the office door "
              "behind them now has its outside latch unscrewed and lying on the floor. ", True, True, False),
    "p2-02": ("Dim sales floor, grey daylight through cardboard-covered windows: Maya kneels at the self-checkout with its front panel "
              "open, shining a flashlight inside; the screen shows a plain glowing error box (no readable text). ", True, True, False),
    "p2-03": ("Close shot on the bagging shelf of the self-checkout: a few coins stacked neatly beside a small folded paper note "
              "covered in a child's pencil scribbles (no readable words). ", False, False, False),
    "p2-04": ("Electrical room: Maya flips breakers in a panel and sticks pieces of tape on them; a tall battery cabinet with green "
              "status lights; the survivor holds the flashlight. ", True, True, False),
    "p2-05": ("Daytime, stockroom: the survivor and Maya both freeze and turn their heads toward the double doors to the sales floor. ",
              True, True, False),
    "p2-06": ("Bottled water shelf in grey light: one small bottle missing from a neat row, a clean gap; the self-checkout glows in "
              "the background. ", False, False, False),
    "p2-07": ("Day 7, sales floor: the survivor strings a line of fishing wire across an aisle at ankle height with empty tin cans "
              "hanging from it; Maya ties another line across the next aisle. ", True, True, False),
    "p2-08": ("Night, very dark sales floor seen low along the floor: the tin-can alarm wires stretched across the aisles, silent and "
              "still; the self-checkout glows far away. ", False, False, False),
    "p2-09": ("Morning: the survivor holds up a new paper receipt (blank, no text), Maya looks over his shoulder; both puzzled; the "
              "tin-can wires untouched behind them. ", True, True, False),
    "p2-10": ("Behind the self-checkout at the end of the counter: Maya points up at a square metal maintenance panel high on the "
              "wall, its edge scuffed, a small dusty handprint near it; the survivor looks up. ", True, True, False),
    "p2-11": ("Maya, on her toes, sticks a strip of tape across the edge of the high maintenance panel to mark it; a short step "
              "ladder that is clearly too short stands nearby. ", False, True, False),
    "p2-12": ("Overcast day, inside the cab of the white bread van in the alley: Maya in the driver's seat turns on the dashboard "
              "radio with the keys in the ignition; the survivor in the passenger seat watches the empty alley through the windshield. ",
              True, True, False),
    "p2-13": ("Close shot of the van's dashboard radio glowing orange, its display showing only a frequency bar, rain on the windshield "
              "beyond. ", False, False, False),
    "p2-14": ("Stockroom, lantern light: a paper city map spread on boxes; Maya draws a route with a marker from a small corner shop "
              "to a big stadium by the water; the survivor counts on his fingers. Map has no readable text. ", True, True, False),
    "p2-15": ("Day 8, stockroom: the survivor climbs a fixed metal ladder up to an open roof hatch, grey daylight pouring down; Maya "
              "holds the ladder below. ", True, True, False),
    "p2-16": ("Rooftop of the small supermarket, overcast: rows of solar panels and HVAC units; the survivor and Maya crouch behind "
              "an air unit looking out at a city with smoke columns. ", True, True, False),
    "p2-17": ("View from the roof edge looking down: the streets around the supermarket full of slowly wandering zombies, abandoned "
              "cars, a corner intersection. " + ZOMB, False, False, False),
    "p2-18": ("From the roof edge: the fire-escape ladder going down the side wall ends right on a burned-out car wreck that blocks "
              "the bottom; zombies nearby. " + ZOMB, False, False, False),
    "p2-19": ("Stockroom, a narrow metal maintenance door between the stockroom and the loading dock: the survivor pries it with a "
              "crowbar; the top hinge bends with a visible twist. ", True, False, False),
    "p2-20": ("Close shot: the bent metal hinge of the maintenance door; Maya's hand sticks a strip of red tape beside it as a warning. ",
              False, True, False),
    "p2-21": ("Night: Maya on a ladder turns a small ceiling security camera near the self-checkout to face the wall behind it; the "
              "survivor holds the ladder. ", True, True, False),
    "p2-22": ("Close shot, flashlight beam: the high maintenance panel behind the self-checkout sits slightly crooked; the strip of "
              "tape across its edge is torn in half. ", False, False, False),
    "p2-23": ("Day 9, rooftop, grey sky: far over the city skyline a small military helicopter flies; the survivor points at it. ",
              True, False, False),
    "p2-24": ("Rooftop, grey evening: Maya grabs the survivor's arm, shaking her head urgently, while he holds an UNLIT red emergency "
              "flare stick (cap still on, no fire, no smoke, no red glow anywhere). ", True, True, False),
    "p2-25": ("Rooftop: the survivor holds a burning red flare high over his head, bright red glare and smoke, the helicopter tiny in "
              "the distance. ", True, False, False),
    "p2-26": ("The helicopter flies away over distant rooftops without turning; red flare smoke drifts in the foreground. ", False,
              False, False),
    "p2-27": ("High wide view over the neighborhood: zombies streaming out of side streets toward the small supermarket glowing red "
              "on its roof. " + ZOMB, False, False, False),
    "p2-28": ("Stockroom: a small security monitor showing grainy black-and-white footage of a dense crowd in front of the store; "
              "Maya stares at it, the survivor behind her with his head down. ", True, True, False),
    "p2-29": ("Night: the storefront seen from inside: the cardboard-covered glass shudders under pounding hands; a crack runs from "
              "the bottom corner of one pane; the barricade stands three feet back. ", False, False, False),
    "p2-30": ("Day 10, rainy and dark: the survivor and Maya carry cases of bottled water from the front aisles into the stockroom. ",
              True, True, False),
    "p2-31": ("The side door on the west wall of the sales floor: its metal frame bent, the latch half pulled out; the survivor and "
              "Maya brace it with two shelving units. ", True, True, False),
    "p2-32": ("Stockroom in rainy gloom: the survivor and Maya slump against stacked water cases, exhausted, sharing one bottle. ",
              True, True, False),
    "p2-33": ("Close shot of a small security monitor at night. The screen shows grainy black-and-white footage from a high ceiling "
              "angle looking down at the self-checkout machine. Clearly visible ON THE SCREEN, right next to the scanner, is a SMALL "
              "CHILD-SIZED dark silhouette (half the height of the machine) reaching up to the scanner, unmistakable even though "
              "blurry. The silhouette is the focus of the frame. No readable text. ", False, False, False),
    "p2-34": ("Night: the self-checkout in the dark store, its screen glowing, a paper receipt sliding out of the printer; nobody "
              "visible. ", False, False, False),
    "p2-35": ("Night, stockroom: the survivor and Maya rush to a maintenance landing high on the wall reached by a metal ladder, "
              "shining flashlights upward into a dark opening. ", True, True, False),
    "p2-36": ("Night, stockroom: an old rusty support bar breaks off the maintenance ladder and crashes onto the concrete floor in a "
              "burst of dust, right in front of the survivor and Maya. ", True, True, False),
    "p2-37": ("Looking up from below: a dark square opening above the maintenance landing, faint dust falling through two flashlight "
              "beams, total darkness above. ", False, False, False),
}

DOCK_P3 = 'INSIDE the enclosed loading dock (an indoor concrete room lit by one caged wall lamp at dawn: bread crates, a pallet jack, the big roll-up shutter CLOSED on the back wall). On the side wall, at the top of a short steep steel stair, is the narrow hinged steel maintenance door from the attached reference p3-11.png (same grey door, red tape strips, bent top hinge), which leads up to the loft. '

VAN_P3 = 'The van is EXACTLY the white bread delivery van from the attached reference p3-30.png: a plain white high-roof cargo van, no side windows behind the cab, mud-splashed. '
P3 = {
    "p3-01": ("Day 11, stockroom: the survivor and Maya climb the repaired maintenance ladder (new rope lashings) toward the dark "
              "opening with flashlights. ", True, True, False),
    "p3-02": ("Inside the maintenance loft: a long metal walkway deck between humming air-conditioning units; at the end a little "
              "nest: sleeping bag, bottles of water, a mustard-yellow bakery jacket, crayon drawings taped to a duct, a flashlight. ",
              False, False, False),
    "p3-03": ("Maintenance loft: behind a stack of boxes, Nia peeks out with wide frightened eyes. ", False, False, True),
    "p3-04": ("Maintenance loft: Nia backs away from the survivor, clutching a flashlight; the survivor freezes with his hands up. ",
              True, False, True),
    "p3-05": ("Maintenance loft: Maya kneels down to Nia's height and talks gently; the survivor stays back near the hatch, ashamed. ",
              True, True, True),
    "p3-06": ("Flashback, night of Day 1, loading dock: Nia's father lifts Nia up through the maintenance door into the loft, passing "
              "her a flashlight, worried face. " + DAD, False, False, True),
    "p3-07": ("Flashback, night: Nia stands on tiptoe at the self-checkout scanning a box of crackers, a few coins and a folded paper "
              "note in her other hand. ", False, False, True),
    "p3-08": ("Flashback, night, Nia's point of view looking down through a narrow ventilation slot: below, the survivor slides a "
              "latch shut on the outside of the office door. ", True, False, False),
    "p3-09": ("Maintenance loft: the survivor has set a bottle of water down on the metal walkway between them and is stepping back with open empty hands; Nia, crouched by her sleeping bag, looks at the bottle. ",
              True, False, True),
    "p3-10": ("Day 12, maintenance loft walkway: Nia leads with her flashlight, the survivor and Maya follow crouching under ducts. ",
              True, True, True),
    "p3-11": ("End of the loft walkway: the narrow maintenance door with the bent hinge and red tape, leading down into the loading "
              "dock. ", False, False, False),
    "p3-12": ("Overcast, inside the van cab in the alley: Maya checks the fuel gauge, the survivor counts three seats; Nia peeks from "
              "the dock door window. ", True, True, True),
    "p3-13": ("Service desk near the storefront, dim: Maya wires a cable from the speaker control box along the floor toward the "
              "back, a coil of wire on the floor. ", False, True, False),
    "p3-14": ("Exterior at the storefront, from across the street: the small loudspeaker under the awning; zombies in the street turn "
              "toward it all at once. " + ZOMB, False, False, False),
    "p3-15": ("Stockroom: Maya and Nia watch a security monitor showing the alley; a few zombies still linger there. ", False, True,
              True),
    "p3-16": ("The storefront from inside: a much denser crowd presses on the cardboard-covered glass, the crack longer. ", False, False,
              False),
    "p3-17": ("Day 13, stockroom floor: three backpacks being packed, a few bottles of water, cans, tools, a coil of rope; the survivor "
              "and Maya kneel packing. ", True, True, False),
    "p3-18": ("Service desk: Maya fixes a metal spring clamp onto the speaker switch so it can stay pressed. ", False, True, False),
    "p3-19": ("Night, maintenance loft: Nia sits on her sleeping bag looking at her crayon drawings, then puts her bakery jacket on "
              "and packs a small backpack. ", False, False, True),
    "p3-20": ("Night: the survivor shines a flashlight on a new long crack spreading across the front glass. ", True, False, False),
    "p3-21": ("Day 14, dawn, exterior: the loudspeaker under the awning blares; the zombies in the street and in the alley mouth turn "
              "and shuffle toward the storefront. " + ZOMB, False, False, False),
    "p3-22": ("Stockroom: Maya and Nia watch the alley on the security monitor; the alley empties; Maya holds a two-way radio. ",
              False, True, True),
    "p3-23": ("Dawn, maintenance loft metal walkway seen from the side: the three move in single file toward the RIGHT edge of the frame, crouching under ducts with flashlights pointing right. Order from right (front) to left (back): Nia in front leading the way, Maya in the middle, the survivor at the back. Backpacks on. ", True, True, True),
    "p3-24": (DOCK_P3 + "Maya stands on the top step holding the sagging hinged door wide open, clear of its frame, with both hands; Nia squeezes past under her arm and climbs down the steel stair into the dock carrying a small backpack. ",
              False, True, True, ["p3-11.png"]),
    "p3-25": (DOCK_P3 + "The hinged door has torn loose at its bent top hinge, dropped onto its lower corner and wedged crooked in the frame; only a narrow gap at the bottom, where a small white round stick-figure hand with a bandage reaches through. At the foot of the stair the survivor and Nia stare up at it in shock. ",
              True, False, True, ["p3-11.png"]),
    "p3-26": (DOCK_P3 + "Wide shot: Nia stands beside the survivor in the middle of the dock holding the bags; the closed roll-up shutter is a few steps behind them. The survivor turns his back on the shutter and looks up at the jammed door. ",
              True, False, True, ["p3-11.png"]),
    "p3-27": (DOCK_P3 + "At the top of the stair, the survivor has wedged his steel pipe under the bottom edge of the jammed door and presses down on it with all his weight, using the sill as a lever; the door lifts off the sill and Maya squeezes through the opening toward him. ",
              True, True, False, ["p3-11.png"]),
    "p3-28": ("Loading dock at dawn: the survivor heaves the roll-up shutter up by hand; the white bread van waits in the alley. ",
              True, False, False),
    "p3-29": ("Inside the van cab at dawn: Maya turns the key, the survivor in the passenger seat, Nia squeezed between them; in the "
              "side mirror zombies turn in the alley. " + ZOMB, True, True, True),
    "p3-30": ("The white bread van reverses out of the alley around a dumpster at the alley mouth, tires splashing. ", False, False,
              False),
    "p3-31": ("Dawn, exterior wide: the front glass of Corner Fresh shatters under the crowd, zombies pour into the empty store; "
              "the loudspeaker still on the awning. " + ZOMB, False, False, False),
    "p3-32": ("Dawn: seen from behind, the van drives down an empty main road between parked wrecks, the city skyline ahead. " + VAN_P3, False, False,
              False, ["p3-30.png"]),
    "p3-33": ("Main road at dawn completely blocked by a pile-up of abandoned cars filling every lane, gaunt shapes moving between them; the van brakes hard in front of the pile-up. " + VAN_P3 + ZOMB, False, False,
              False, ["p3-30.png"]),
    "p3-34": ("The van drives through a gloomy industrial zone of warehouses and cranes at dawn. ", False, False, False),
    "p3-35": ("Dawn, a steel river bridge far from any shops: several wrecked cars are crashed and tangled into a police barricade, completely blocking both lanes; the white bread van has stopped in front of the wreck. No buildings or stores nearby. ", False, False, False),
    "p3-36": ("Grey morning: the van stopped in the empty parking lot of Harbor Stadium in front of huge closed gates, scattered tents, nobody there. " + VAN_P3,
              False, False, False, ["p3-30.png"]),
    "p3-37": ("Abandoned registration tent at the stadium: folding tables, scattered papers, a whiteboard with a hand-drawn route map "
              "to a harbor (no readable text); the survivor and Maya search. ", True, True, False),
    "p3-38": ("Outdoors under the open flap of the abandoned registration tent at Harbor Stadium (stadium wall and floodlights blurred behind, grey morning light): close shot of Nia in her oversized bakery jacket, her small round white hand touching one line on a long printed list pinned to a corkboard (lines are blurry, "
              "no readable text). ", False, False, True),
    "p3-39": ("Morning, stadium parking lot: the survivor, Maya and Nia stand by the van looking toward distant harbor cranes and the "
              "sea. ", True, True, True),
    "p3-40": ("Wide final shot: the white bread van on an empty coastal road toward the harbor under a pale sunrise. ", False, False,
              False),
    "p3-27b": (DOCK_P3 + "The hinged door is still wedged crooked in its frame. At the top of the stair the survivor has jammed his steel pipe under the bottom edge of the stuck door and leans down on it with all his weight, straining, feet braced on the top step; through the narrow gap at the bottom a small white round stick-figure hand with a bandage reaches out. Nia watches from the foot of the stair. ",
               True, False, True, ["p3-11.png", "p3-25.png"]),
    "p3-27c": ("Close shot INSIDE the dock at the top of the steel stair: the bottom edge of the grey steel maintenance door (red tape, from reference p3-11.png) is wedged crooked on the steel sill; the end of a steel pipe is jammed under that bottom edge, the survivor's white round stick hand pressing the pipe down; through the narrow gap under the door a small white round stick-figure hand wrapped in a white bandage reaches out. Tight framing on the door edge, sill, pipe and the two hands. ",
               False, False, False, ["p3-11.png", "p3-27b.png"]),
    "p3-35b": ("Inside the white van cab at dawn, close shot over the survivor's shoulder: his white round stick hands hold a folded paper road map, one finger tracing a route along a river to a second bridge (map lines only, no readable text); through the windshield the bridge blocked by wrecked cars and a police barricade. ",
               True, False, False, ["p3-35.png"]),
    "p3-31b": ("Dawn, INSIDE Corner Fresh looking toward the shattered front windows: the barricade of shopping carts and a toppled shelf has been shoved back across the floor, cans scattered; gaunt zombies pour in over it through the broken glass; the small loudspeaker above the door still glows. No stick figures. " + ZOMB,
               False, False, False, ["p3-31.png"]),
    "p3-35c": ("Morning: the white van crosses a second, narrower old river bridge, seen from the side; far ahead beyond the river the floodlight towers of a stadium rise above the trees. " + VAN_P3,
               False, False, False, ["p3-30.png"]),
}


def write(part):
    imgs = P2 if part == "p2" else P3
    out = os.path.join(D, part)
    os.makedirs(os.path.join(out, "anh"), exist_ok=True)
    for n in ("nhan-vat-chinh-F.png", "maya-model-sheet.png", "nia-model-sheet.png"):
        src = os.path.join(D, "..", "models", n)
        if os.path.exists(src):
            shutil.copy(src, os.path.join(out, "anh", n))
    with open(os.path.join(out, "gen-anh.csv"), "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(["stt", "ten_file", "ty_le", "prompt", "gui_kem"])
        for i, (k, v) in enumerate(imgs.items(), 1):
            desc, hero, maya, nia = v[:4]
            extra = list(v[4]) if len(v) > 4 else []
            refs = extra + (["nhan-vat-chinh-F.png"] if hero else []) + (["maya-model-sheet.png"] if maya else []) + (["nia-model-sheet.png"] if nia else [])
            p = K.STYLE + desc + (K.HERO if hero else "") + (K.MAYA if maya else "") + (NIA if nia else "") + K.FLAT
            if not (hero or maya or nia):
                p += " No stick figures in this frame."
            w.writerow([i, k + ".png", "16:9", p, ";".join(refs)])
    print(part, len(imgs))


if __name__ == "__main__":
    write(sys.argv[1])
