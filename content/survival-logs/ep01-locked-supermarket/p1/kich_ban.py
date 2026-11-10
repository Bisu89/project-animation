"""Part 1 — bảng dựng duy nhất: lời, giọng, ảnh, âm thanh, HUD. Nguồn: P1-LOI-KE.md (bản nháp 2), CONTINUITY.md v2.

Mỗi phần tử trong SCENES là một sự kiện theo thứ tự thời gian:
  ("shot", id)              đổi ảnh tại thời điểm hiện tại (id trong IMAGES hoặc TEST_IMAGES)
  ("n", text)               lời kể Titan        ("m", text) Maya     ("news", text) bản tin
  ("spk",) loa đầy đủ       ("spkcut",) loa bị cắt "Wel—"
  ("sfx", name[, vol])      âm thanh tại thời điểm hiện tại
  ("pause", s)              khoảng lặng
  ("hud", key, value)       key: day / water / key
  ("card", text)            dòng nhật ký / chữ trên hình (hiện 4 s)
  ("receipt",)              hiện phiếu 03:12
  ("tag", text)             nhãn chữ nhỏ (vd. SUNRISE BAKERY trên chìa)
"""

STYLE = ("Wide cinematic 16:9 frame, highly detailed atmospheric digital painting of a small American neighborhood supermarket "
         "called Corner Fresh during a zombie outbreak, moody palette, cinematic lighting, no gore, no blood. ")
HERO = ("The survivor is the stick figure from the attached model sheet nhan-vat-chinh-F.png, drawn EXACTLY like it: simple flat 2D "
        "cartoon stick figure, single black lines of constant thickness for body and limbs (no filled torso), round plain white head "
        "with thin black outline and two small black dot eyes, small round white hands, plain light khaki boonie hat with olive band "
        "and chin cord, small olive backpack with a yellow square patch. ")
MAYA = ("Maya is the stick figure from the attached model sheet maya-model-sheet.png, drawn EXACTLY like it: same simple flat stick "
        "style, short dark ponytail, bright orange work vest with a grey reflective stripe, small grey tool pouch, white bandage on "
        "her left hand. ")
ZOMB = "Zombies are gaunt grey-skinned shambling people in torn everyday clothes, painted like the world, not cartoon. "
FLAT = "The flat stick figures contrast with the detailed painted world. No text, no logos, no letters anywhere."

# id: (mô tả cảnh, có HERO, có MAYA)
IMAGES = {
    # 1 · mở lạnh ngày 14
    "s01a": ("Dawn, cold blue light. Close shot behind the service desk near the storefront: a stick-figure hand presses and holds a "
             "switch on an open grey control box; a handheld two-way radio lies on the desk. ", True, False),
    "s01b": ("Dawn. The front glass storefront seen from inside: dozens of zombies crushed against the glass, the laminated glass "
             "bowing inward, an old crack spreading in a web across one pane; a barricade of carts and shelves stands about three feet "
             "back from the glass. Inside is dark. " + ZOMB, False, False),
    "s01c": ("Dawn. Wide shot from the back of the store: the survivor stands behind the service desk holding a switch, looking back "
             "over his shoulder toward the stockroom doors; beyond him the storefront glass is covered with pressing silhouettes. " + ZOMB,
             True, False),
    # 2 · ca đêm
    "s02a": ("Night, store brightly lit and normal, before the outbreak. Wide interior: the survivor mops the floor near the "
             "checkout counters; a self-checkout machine stands at the end of the counter; the automatic glass doors at the front; "
             "a small round speaker under the outside awning. Calm, cozy, ordinary. ", True, False),
    "s02b": ("Night, store brightly lit and normal. View from the stockroom through a small window in the loading dock door: in the "
             "back alley a white bread delivery van with its rear cargo doors open, bread crates stacked; a delivery driver carries a "
             "crate. The van side has a simple sunrise logo shape (no letters). ", False, False),
    # 3 · bản tin
    "s03a": ("Night. Close shot of an old radio on the checkout counter, its dial glowing; the survivor leans on the counter "
             "listening, worried. ", True, False),
    "s03b": ("Night. A woman customer drops her shopping basket, groceries spilling on the floor, and runs out through the open "
             "automatic doors into the dark street; the survivor watches stunned from behind the counter. Realistic painted woman. ",
             True, False),
    # 4 · hai người bỏ đi
    "s04a": ("Night. Through the storefront glass: a REALISTIC painted middle-aged man (not a stick figure) in a store manager's shirt and tie sprints across the parking lot to his car, car "
             "door open, headlights on. Seen from inside the store, the survivor's silhouette in the foreground watching. ", True, False),
    "s04b": ("Night. View through the small loading-dock window: in the alley the bread delivery driver (a realistic painted man in a "
             "work jacket) holds a phone to his ear and looks back toward the loading dock door with a worried face. ", False, False),
    "s04c": ("Night. The back alley: the delivery driver runs away toward the main road at the end of the alley; the white bread "
             "van stays parked with its cargo doors open, crates inside. ", False, False),
    # 6B · cửa sau
    "s06a": ("Night. Loading dock interior: the survivor drags a metal roll-up shutter down with both hands, straining; beyond the "
             "gap the dark alley and the bread van. ", True, False),
    "s06b": ("Night. Narrow stockroom corridor lit by one bulb: a tall narrow shelf on wheels, overloaded and crooked, tips over and "
             "crashes against a half-open office door at the end; the survivor runs past toward the camera without looking back, "
             "boxes flying. ", True, False),
    # 7 · đêm 1
    "s07a": ("Night, very dark stockroom, boxes and pallets. The survivor sits on the floor against a stack of boxes holding a "
             "short metal pipe across his knees, staring at a dark corridor blocked by a fallen shelf. ", True, False),
    "s07b": ("Night, dark stockroom, a small work light. Close shot: the survivor's round white hands pull the batteries out of a "
             "toy robot; a phone lies face-down beside a switched-off radio. ", True, False),
    # 8 · ngày 2 mất điện
    "s08a": ("Day 2, power out: the sales floor in gloomy grey daylight from the front windows, the refrigerator cases dark, only "
             "green exit signs glowing; the survivor eats bread at the end of an aisle, cans stacked aside. ", True, False),
    "s08c": ("Power out, gloomy: close shot of a dark refrigerated dairy case, its lights off, milk cartons sweating with condensation; the survivor walks past in the background. ", True, False),
    "s08b": ("Dark stockroom: a small security monitor desk with a video recorder; the survivor switches off the monitor, its screen "
             "fading. ", True, False),
    # 9 · nước + toilet
    "s09a": ("Grey daylight, aisle of bottled water: the survivor counts cases of bottled water stacked on the floor, holding a "
             "clipboard. ", True, False),
    "s09b": ("Close shot of a stainless steel staff sink: the faucet sputters out a last thin stream and drips, the survivor's round "
             "white hand on the tap. ", True, False),
    "s09c": ("A tidy improvised bathroom corner in the back of the stockroom behind a hanging tarp: a white bucket with a lid lined "
             "with a trash bag, a bag of cat litter, a roll of toilet paper, and a small separate hand-washing station with soap and a "
             "water jug, far from food. Clean, not gross. ", False, False),
    # 10 · ánh sáng
    "s10a": ("Grey daylight: the survivor tapes flattened cardboard boxes over the lower half of the storefront glass; a barricade "
             "of shopping carts and low shelves stands about three feet back from the glass. ", True, False),
    "s10b": ("Night, store dark: the survivor holds a flashlight near the front; a thin beam escapes through a gap at the edge of the "
             "cardboard; outside, a dark zombie silhouette presses against the glass exactly where the light leaks. " + ZOMB, True, False),
    "s10c": ("Night, pitch dark store: the survivor crouches behind a shelf, flashlight switched off, holding his breath; across the "
             "room the faint silhouette of a hand sliding on the glass. ", True, False),
    # 11 · bíp đầu tiên
    "s11a": ("Grey daylight: the survivor with a clipboard stares at a shelf of crackers with one empty gap; an expensive bottle of "
             "wine sits untouched beside it. ", True, False),
    "s11b": ("Night, dark store: the self-checkout at the end of the counter glows with its bright welcome screen; the survivor creeps "
             "toward it from an aisle holding a short metal pipe; nobody else there. ", True, False),
    "s11c": ("Night, stockroom: the survivor wedges a wooden pallet against the closed double doors to the sales floor. ", True, False),
    # 12 · ngày 3 cửa sau
    "s12a": ("Day 3, overcast: the survivor peeks through the small window in the loading dock door at the white bread van parked in "
             "the narrow alley; nothing near the van's cab. ", True, False),
    "s12b": ("Overcast, the back alley seen from the loading dock: the metal shutter half raised, the survivor ducking under it; at "
             "the far end of the alley a single zombie turns its head toward the noise. " + ZOMB, True, False),
    "s12c": ("Overcast alley: the survivor pulls on the locked cab door of the white bread van; two zombies come around the corner at "
             "the alley entrance in the background. " + ZOMB, True, False),
    "s12d": ("Overcast: the survivor dives back under the half-closed shutter into the loading dock, dropping a tool bag that spills "
             "tools on the alley ground. ", True, False),
    "s12e": ("Loading dock interior: the shutter is down; the survivor jams a pallet jack against it; the metal shutter dents inward "
             "from a hit on the other side. ", True, False),
    "s12f": ("Loading dock, dim: the survivor sits on the floor with his back against the closed shutter, exhausted, catching his "
             "breath. ", True, False),
    "s12g": ("Night, dark store, flashlight beam: a battery display rack with two empty hooks among full ones. ", False, False),
    # 13 · ngày 4 Maya
    "s13a": ("Day 4, the stockroom corridor: the survivor unloads boxes from the tall narrow shelf lying tipped over in front of an "
             "office door at the end of the corridor. ", True, False),
    "s13b": ("The office door at the end of the corridor is open a crack; through the gap, a stick-figure hand wrapped in a white "
             "bandage grips the door edge. Dim light inside. ", False, True),
    "s13c": ("Inside a small cluttered stockroom office: Maya sits weakly on the floor against the desk; a big water jug, snack boxes, "
             "a tiny washroom door; a high narrow window with broken glass patched with cardboard; the survivor stands at the door. ",
             True, True),
    "s13d": ("Two-shot in the office doorway: Maya holds up a small ring of keys with a plain blank tag; the survivor stares at the "
             "keys. ", True, True),
    "s13e": ("Close two-shot: the survivor looks at Maya's bandaged left hand; Maya looks back, tired. ", True, True),
    # 14 · thỏa thuận
    "s14a": ("Afternoon, the office doorway: Maya inside talks earnestly, raising her bandaged hand; the survivor outside listens, "
             "unsure; a wall clock shows three o'clock. ", True, True),
    "s14b": ("INSIDE the store, in the dim back stockroom corridor at the doorway of the small cluttered office (same office as before: desk, water jug, wall clock): Maya, standing just inside the office, hands the ring of keys to the survivor standing in the corridor. Not outdoors, no street. ", True, True),
    "s14c": ("Night, dim corridor: the survivor's round white hand slides a metal latch closed on the outside of the office door; "
             "above the door frame a dark ventilation slot in the wall. ", True, False),
    # 15 · ngày 5
    "s15a": ("Afternoon: the survivor opens the office door; Maya stands inside looking down at the outside latch, then at him. ",
             True, True),
    "s15b": ("Close shot: Maya, angry but controlled, speaking firmly, bandaged hand on the door frame. ", False, True),
    "s15c": ("The survivor gives the ring of keys back to Maya; awkward, eyes down. ", True, True),
    "s15d": ("Electrical room: a tall battery cabinet with glowing status lights and an inverter; Maya points at it while the "
             "survivor listens. ", True, True),
    "s15e": ("The service desk near the storefront: Maya stands at the open speaker control box, looking at it a moment too long; "
             "the survivor behind her. Dim light. ", True, True),
    # 16 · đêm 5 phiếu
    "s16a": ("Night, stockroom lit by one lantern: the survivor and Maya both turn their heads sharply toward the doors to the sales "
             "floor. ", True, True),
    "s16b": ("Night: the survivor and Maya run through the dark empty sales floor toward the glowing self-checkout at the end of the "
             "counter. Nobody else is inside the store: no zombies, no people, no silhouettes inside; the storefront glass is covered "
             "with cardboard. ", True, True),
    "s16c": ("Close shot: a printed paper receipt sticking out of the self-checkout's receipt tray, its paper blank (no printed text), "
             "lit by the screen glow. ", False, False),
    "s16d": ("Night: the survivor checks the closed loading dock shutter with a flashlight while Maya shines her flashlight on the "
             "chained side door. ", True, True),
    "s16e": ("Night, wide: the survivor and Maya stand still at the glowing self-checkout in the huge dark store, looking around "
             "into the shadows; nobody else visible. ", True, True),
}
TEST_IMAGES = ["01-zombie-toi-cua", "02-cua-tu-dong-mo", "03-dan-quay-dau", "04-vuong-xe-day", "05-chay-toi-quay",
               "06-hop-dieu-khien", "07-sco-khoi-dong", "08-khoa-tay-cua", "09-lui-xa"]

S = [
    # 1 · mở lạnh
    ("hud", "day", 14), ("shot", "s01b"), ("sfx", "drone_cold", 0.4), ("sfx", "crowd", 0.6), ("sfx", "glass_creak", 0.7), ("spk",),
    ("m", "Hold it. A few more seconds."),
    ("shot", "s01a"), ("n", "My thumb is on the switch."), ("n", "Hundreds of them are turning toward the speaker."),
    ("spk",), ("shot", "s01c"), ("n", "I spent two weeks making that door shut up."), ("pause", 0.4), ("n", "Now I need it to scream."),
    ("sfx", "glass_crack", 0.9), ("pause", 1.0),
    # 2 · ca đêm
    ("hud", "day", 1), ("shot", "s02a"), ("sfx", "store_hum", 0.3), ("spk",), ("n", "When this started, the worst thing in my life was that speaker."),
    ("n", "It welcomed everyone. Customers. Delivery guys. Once, a raccoon."),
    ("n", "I worked nights at Corner Fresh."), ("shot", "07-sco-khoi-dong"), ("n", "Six aisles. One self-checkout."),
    ("shot", "s02b"), ("n", "The bread van came every night at one thirty."), ("sfx", "radio_static", 0.5),
    # 3 · bản tin
    ("shot", "s03a"), ("news", "Those bitten develop a high fever and turn within twenty-four hours. Stay indoors. Do not approach."),
    ("sfx", "radio_static", 0.5), ("n", "I thought it was a riot. Some city thing that would be over by morning."),
    ("shot", "s03b"), ("sfx", "basket_drop", 0.8), ("n", "Then my only customer dropped her basket and ran."), ("n", "I'd never seen her run before."),
    # 4 · hai người bỏ đi
    ("shot", "s04a"), ("sfx", "car_away", 0.6), ("n", "My manager left without a word."),
    ("shot", "s04b"), ("n", "Through the dock window, I watched the bread driver answer his phone."), ("n", "He listened. Then he looked back at the dock door."),
    ("shot", "s04c"), ("sfx", "footsteps_run", 0.6), ("n", "Then he ran toward the main road."), ("n", "Two people left that night. Only one of them looked back."),
    ("pause", 0.8),
    # 5 · cửa mở
    ("shot", "01-zombie-toi-cua"), ("sfx", "groan_far", 0.5), ("pause", 1.2), ("n", "The first one reached the doors."),
    ("sfx", "door_slide", 0.6), ("n", "The sensor picked it up. The doors slid open."),
    ("shot", "02-cua-tu-dong-mo"), ("spk",), ("sfx", "groan", 0.55), ("n", "Its head snapped toward the speaker."),
    ("shot", "03-dan-quay-dau"), ("sfx", "crowd", 0.45), ("n", "And across the street, one by one... the others turned too."),
    ("n", "The store did exactly what it was built to do."), ("n", "It invited them in."),
    # 6A · bốn lần Welcome
    ("shot", "04-vuong-xe-day"), ("n", "It got tangled in the carts outside, clear of the door."),
    ("shot", "05-chay-toi-quay"), ("sfx", "footsteps_run", 0.5), ("n", "I ran for the control box behind the service desk."),
    ("shot", "06-hop-dieu-khien"), ("sfx", "switch", 0.9), ("sfx", "flicker", 0.5), ("n", "First switch. The lights flickered."), ("spk",),
    ("sfx", "switch", 0.9), ("shot", "07-sco-khoi-dong"), ("n", "Second switch. The checkout rebooted."), ("sfx", "sco_beep", 0.7), ("pause", 0.3), ("spk",),
    ("shot", "06-hop-dieu-khien"), ("n", "Third switch."), ("sfx", "switch", 0.9), ("spkcut",),
    ("shot", "08-khoa-tay-cua"), ("sfx", "door_slide", 0.6), ("n", "The motor cut out."), ("n", "The emergency closer pulled the doors shut."),
    ("sfx", "lock", 0.9), ("n", "I locked it by hand."), ("sfx", "glass_thump", 0.9), ("n", "Its face pressed against the glass."),
    ("shot", "09-lui-xa"), ("n", "Four \"Welcomes.\""), ("n", "That's how long it took me to find the right switch."), ("pause", 0.6),
    # 6B · cửa sau
    ("shot", "s06a"), ("n", "Then I remembered. The loading dock. Still open for the bread delivery."), ("sfx", "shutter", 0.7),
    ("n", "I sprinted to the back and dragged the shutter down. It screamed the whole way, and I hated it for every inch."),
    ("shot", "s06b"), ("n", "On my way back through the stockroom corridor, my shoulder caught a rolling shelf."),
    ("sfx", "crash", 0.8), ("n", "It tipped, and crashed against something near the office."),
    ("n", "I didn't stop to check what it hit."), ("pause", 0.4), ("n", "That's the part I still think about."), ("pause", 0.8),
    # 7 · đêm 1
    ("shot", "s07a"), ("n", "That night, I sat in the stockroom holding a steel pipe."), ("sfx", "thud_far", 0.6), ("pause", 0.6),
    ("n", "Something fell behind the blocked corridor."), ("n", "I said, \"Hello?\""), ("pause", 1.0), ("n", "Nobody answered."),
    ("shot", "s07b"), ("sfx", "click", 0.6), ("n", "I silenced my phone, shut off the radio, and pulled the batteries from the toys."),
    ("n", "I told myself it was a box."), ("pause", 0.3), ("n", "I needed it to be a box."),
    ("card", "Rule #1: Silence everything you don't need."), ("pause", 2.0),
    # 8 · ngày 2
    ("hud", "day", 2), ("shot", "s08a"), ("sfx", "hum_down", 0.5), ("n", "On Day 2, the power died."),
    ("n", "The exit signs stayed on. So did the self-checkout."), ("n", "Both were on backup power."),
    ("shot", "s08c"), ("n", "The fridges went quiet. When the power dies, a supermarket becomes a clock."),
    ("n", "So I ate the bread and fruit that were still good, and saved the cans for later."),
    ("n", "I wasn't risking the milk or meat once the fridges warmed up."),
    ("shot", "s08b"), ("sfx", "click", 0.6), ("n", "I switched off the camera recorder and the monitors, too. Every watt counted."),
    # 9 · nước
    ("shot", "s09a"), ("hud", "water", "117 L"), ("n", "That morning, I counted the bottled water."), ("n", "About a hundred and twenty liters."),
    ("shot", "s09b"), ("sfx", "faucet", 0.6), ("n", "That afternoon, the tap coughed, hissed, and stopped."),
    ("n", "A hundred and twenty liters sounds like a lot... until the toilets stop flushing."),
    ("shot", "s09a"), ("n", "I needed about four liters a day for drinking and basic hygiene."), ("n", "More if I got sick, or the store got hot."),
    ("shot", "s09c"), ("n", "I lined a lidded bucket with trash bags and added cat litter."),
    ("n", "I kept it away from the food, with soap and a little water for my hands."), ("n", "I wasn't wasting drinking water on a flush."),
    # 10 · ánh sáng
    ("shot", "s10a"), ("sfx", "tape", 0.6), ("n", "I cleared the windows and covered the lower glass with cardboard."),
    ("n", "The carts and shelves went about three feet back."),
    ("shot", "s10b"), ("sfx", "rain", 0.4), ("n", "That night I was working with a flashlight near the front."),
    ("n", "A thin line of light slipped past the edge of the cardboard."), ("sfx", "glass_thump", 0.6),
    ("n", "A shape pressed against the glass. Right where the light was."),
    ("shot", "s10c"), ("sfx", "click", 0.7), ("n", "I clicked it off and didn't breathe."), ("sfx", "scratch", 0.6), ("pause", 3.0),
    ("n", "It didn't hear me."), ("n", "It saw the light."), ("card", "Light is an invitation."), ("pause", 2.0),
    # 11 · bíp
    ("shot", "s11a"), ("n", "Earlier that day, my second count came up one pack of crackers short."), ("n", "Probably I counted wrong."),
    ("shot", "s11b"), ("pause", 0.6), ("sfx", "sco_beep", 0.5), ("pause", 0.8), ("n", "Later that night, I heard one short beep from the front."),
    ("n", "The self-checkout."), ("n", "I crept out with the pipe. The screen was back on its welcome page. No one there."),
    ("n", "Probably the machine glitched."),
    ("shot", "s11c"), ("sfx", "thud", 0.7), ("n", "I went back to the stockroom and wedged a pallet against the double doors."),
    ("n", "I was getting very good at \"probably.\""), ("pause", 1.0),
    # 12 · ngày 3
    ("hud", "day", 3), ("hud", "water", "114 L"), ("shot", "s12a"), ("n", "On Day 3, I decided I couldn't hide in a supermarket forever."),
    ("n", "The bread van was still in the alley. Nothing near the cab."),
    ("n", "I cleared my way back and left the pallet jack beside the shutter."), ("n", "Close enough to grab. Clear of the opening."),
    ("shot", "s12b"), ("sfx", "shutter", 0.7), ("n", "I lifted the shutter halfway."),
    ("n", "Metal on metal. At the end of the alley, one of them turned its head."), ("sfx", "groan_far", 0.5),
    ("shot", "s12c"), ("sfx", "footsteps_run", 0.5), ("n", "I reached the van. The cab was locked."), ("sfx", "groan", 0.5),
    ("n", "Then two more came around the corner."),
    ("shot", "s12d"), ("sfx", "tools_drop", 0.7), ("n", "I dropped my tool bag and ran. Ducked under, dragged the shutter down, jammed the pallet jack against it."),
    ("shot", "s12e"), ("sfx", "shutter_hit", 1.0), ("n", "Something hit the metal right behind my back."),
    ("shot", "s12f"), ("sfx", "breath", 0.6), ("pause", 1.5), ("n", "For a long time, I just sat there, breathing."),
    ("n", "I still needed the van key."), ("n", "And a clear way to the cab."),
    ("shot", "s12g"), ("n", "That night, two four-packs of double A batteries were missing."), ("hud", "key", "MISSING"), ("pause", 1.2),
    # 13 · ngày 4
    ("hud", "day", 4), ("hud", "water", "111 L"), ("shot", "s13a"), ("n", "On Day 4, I finally moved the shelf to reach the cleaning supplies."),
    ("sfx", "drag", 0.6), ("n", "I unloaded it, then dragged it clear."),
    ("shot", "s13b"), ("sfx", "cough", 0.6), ("n", "Then I heard a cough. And a weak knock."), ("sfx", "knock", 0.6),
    ("m", "Please... the shelf. I can't move it."),
    ("shot", "s13c"), ("n", "The office door was open a crack. Behind it was a woman with a bandaged hand."),
    ("n", "Her name was Maya."), ("n", "She'd worked on our doors and speaker."),
    ("shot", "s06a"), ("n", "She said she'd run in through the dock on the first night."), ("shot", "s06b"), ("n", "My shelf had hit the office door."),
    ("n", "The door had knocked her into the desk."), ("shot", "s13c"), ("n", "She'd had water, snacks, and a tiny washroom in there."),
    ("n", "She'd tried calling. Tried the high window that morning."), ("n", "That's where she'd cut her hand."),
    ("n", "She'd been sixty feet away."), ("pause", 0.3), ("n", "The whole time."),
    ("shot", "s13d"), ("sfx", "keys", 0.6), ("n", "Then she held up a set of keys."), ("tag", "SUNRISE BAKERY"),
    ("n", "She'd found them at the dock, where the driver dropped them."),
    ("shot", "s13e"), ("n", "I looked at the keys."), ("pause", 0.4), ("n", "Then I looked at her hand."), ("pause", 0.8),
    # 14 · thỏa thuận
    ("shot", "s14a"), ("card", "DAY 4 · 3:00 P.M."), ("m", "It's glass. I swear it's glass."), ("n", "I believed her. Mostly."),
    ("shot", "s03a"), ("n", "But the news said twenty-four hours. Fever first, then... the rest."),
    ("shot", "s14a"), ("n", "We agreed she'd stay in the office until three the next afternoon."),
    ("n", "Twenty-four hours. I'd check on her every few hours."), ("n", "If a fever started, we'd know."),
    ("shot", "s14b"), ("sfx", "keys", 0.5), ("n", "She handed me the keys so I could keep them safe while she waited."),
    ("n", "It sounded fair when I said it out loud."),
    ("shot", "s14c"), ("n", "That night, I waited until she was asleep."), ("n", "Then I slid the outside latch shut."),
    ("sfx", "lock", 0.9), ("pause", 1.5), ("n", "We agreed on twenty-four hours."), ("n", "I added the latch on my own."), ("pause", 1.0),
    # 15 · ngày 5
    ("hud", "day", 5), ("hud", "water", "108 L"), ("shot", "s15a"), ("n", "At three o'clock on Day 5, she had no fever. No shaking. Nothing."),
    ("sfx", "door_open", 0.6), ("n", "I opened the door. She looked at the latch. Then at me."),
    ("shot", "s15b"), ("m", "I heard that last night."), ("pause", 0.4), ("m", "I agreed to stay. I didn't agree to let you decide when I get out."),
    ("shot", "s15a"), ("n", "She didn't leave. There was nowhere to go."), ("shot", "s15b"), ("n", "She set one rule."), ("m", "From now on, we make those calls together."),
    ("shot", "s15c"), ("n", "I said yes, and I gave her the keys back."), ("hud", "key", "FOUND"),
    ("shot", "s15d"), ("n", "That evening, she showed me the backup circuits."),
    ("shot", "s15e"), ("pause", 2.0), ("n", "I told myself the latch kept us safe."), ("pause", 0.3), ("n", "It only kept me comfortable."), ("pause", 1.0),
    # 16 · đêm 5
    ("shot", "s16a"), ("n", "That night, we were both in the stockroom when it came again."), ("sfx", "sco_beep", 0.45), ("pause", 1.2),
    ("shot", "s16b"), ("sfx", "footsteps_run", 0.6), ("n", "We ran. The checkout screen had already gone back to its welcome page. No one was there."),
    ("shot", "s16c"), ("n", "But a receipt was waiting in the tray."), ("receipt",), ("pause", 2.5),
    ("n", "It listed the same things I'd already counted missing."),
    ("m", "I was with you."),
    ("shot", "s16d"), ("n", "I checked every outside door."), ("n", "Nothing had been forced."),
    ("shot", "s16e"), ("pause", 0.8), ("n", "Maya was right beside me. Every door was locked."), ("pause", 0.6),
    ("n", "So who was shopping in my store?"), ("pause", 2.0),
    # 17 · thẻ kết
    ("shot", "END"), ("pause", 10.0),
]
