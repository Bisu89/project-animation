"""Part 2 — bảng dựng (lời, ảnh, âm thanh, HUD). Nguồn: P2-LOI-KE.md bản nháp 2. Cùng định dạng sự kiện với p1/kich_ban.py.
Vai giọng thêm: ("radio", text) = bản tin radio (giọng Walter)."""

END_TITLE = "PART 3"
END_SUB = "The Last Welcome"

S = [
    # 0 · nhắc lại
    ("hud", "day", 5), ("shot", "s16c"), ("sfx", "drone_cold", 0.4), ("n", "When this started, I thought locking the doors would keep me safe."),
    ("shot", "s14c"), ("n", "I found Maya trapped behind a shelf I'd knocked over. Then I locked her office door while she slept."), ("sfx", "lock", 0.8),
    ("shot", "s16e"), ("n", "And last night, someone used our self-checkout... while every door was shut."), ("pause", 1.2),
    # 1 · ngày 6
    ("hud", "day", 6), ("hud", "water", "102 L"), ("shot", "p2-01"),
    ("n", "The latch came off first thing on Day 6. I unscrewed it myself and left it on the floor where she could see it."),
    ("n", "We ate crackers on opposite sides of the stockroom."), ("n", "Neither of us said much."),
    ("n", "But we both kept looking at the same thing. That receipt."), ("pause", 0.6),
    # 2 · máy thanh toán
    ("shot", "p2-02"), ("sfx", "click", 0.6), ("n", "Maya opened the checkout's front panel. I stayed beside her with the flashlight."),
    ("m", "The clock's broken. It's been stuck on three twelve since the power flickered."),
    ("n", "The receipts still came out in order. The time printed on them was useless."),
    ("shot", "p2-03"), ("n", "Beside the scanner, she found a few coins and a folded note."), ("n", "Someone had written down what they still owed."),
    ("n", "Somebody wasn't stealing from my store."), ("pause", 0.3), ("n", "Somebody was trying to pay."),
    ("shot", "p2-02"), ("tag", "PRINT TICKET FOR ASSISTANCE"), ("n", "Maya showed me the button for printing an unpaid ticket. The machine didn't need their money to let them leave."),
    # 3 · cắt điện
    ("shot", "p2-04"), ("sfx", "switch", 0.8), ("n", "Maya spent the afternoon in the electrical room, killing everything we didn't need."),
    ("shot", "s15d"), ("sfx", "switch", 0.7), ("n", "The exit signs stayed on. So did the checkout. She brought the cameras back for short checks and kept power to the speaker controls."),
    ("n", "I asked why the speaker."), ("m", "Because one day we might need to be loud on purpose."),
    ("shot", "p2-05"), ("sfx", "sco_beep", 0.5), ("pause", 0.8), ("n", "That's when it beeped again. In the middle of the day."),
    ("shot", "p2-06"), ("sfx", "footsteps_run", 0.5), ("n", "We ran out. Nobody. One small bottle of water was gone from the shelf, and a new receipt was waiting."),
    ("n", "It happened while we were both in the stockroom. Whoever it was had waited until the floor was clear."),
    ("hud", "water", "95.5 L"), ("pause", 0.8),
    # 4 · ngày 7 dây lon
    ("hud", "day", 7), ("shot", "p2-07"), ("sfx", "keys", 0.4), ("n", "On Day 7, we strung fishing line across the aisles, ankle high, with empty cans hanging off it."),
    ("n", "If anyone walked through the store at night, we'd hear it."),
    ("shot", "p2-08"), ("pause", 2.0), ("n", "We heard nothing that night."), ("n", "Not a single can moved."),
    ("shot", "p2-09"), ("n", "And in the morning, there was a new receipt anyway."),
    # 5 · tấm ốp
    ("shot", "p2-10"), ("n", "The wires covered the main aisles. Behind the checkout, there was still a way through."),
    ("n", "High on the wall, there was a metal maintenance panel. The edge was scuffed."), ("n", "And beside it, a small, dusty handprint."),
    ("shot", "p2-11"), ("sfx", "tape", 0.5), ("n", "Our ladder was too short. Maya taped the edge of the panel so we'd know if it moved."),
    ("n", "I wanted it to be a raccoon. That still didn't explain the coins."), ("pause", 0.6),
    # 6 · radio
    ("shot", "p2-12"), ("n", "That afternoon, the alley was clear for a few minutes, so we slipped out to the van."),
    ("n", "Maya had the keys. It was the first time I'd sat in that cab."),
    ("shot", "p2-13"), ("sfx", "radio_static", 0.6),
    ("radio", "Final evacuation convoy departs Harbor Stadium at seven a.m., November nineteenth. All evacuees will be registered for family tracing."),
    ("sfx", "radio_static", 0.5), ("n", "November nineteenth. That was Day 14. Seven days."),
    ("hud", "water", "88.5 L"), ("hud", "convoy", "7 DAYS"),
    ("shot", "p2-14"), ("n", "Back inside, Maya spread a city map across the boxes."),
    ("n", "Harbor Stadium was six miles away. Fifteen minutes by car, on a normal day."), ("n", "There were no normal days left."), ("pause", 0.8),
    # 7 · ngày 8 mái
    ("hud", "day", 8), ("hud", "convoy", "6 DAYS"), ("shot", "p2-15"), ("n", "On Day 8, we tried the roof."),
    ("shot", "p2-16"), ("sfx", "wind", 0.5), ("n", "There were solar panels up there. That's why the batteries hadn't died. The sun was keeping our store alive."),
    ("shot", "p2-17"), ("sfx", "crowd", 0.4), ("n", "Then I looked over the edge."), ("n", "Every street around us was full. Not running. Not hunting. Just... waiting."),
    ("shot", "p2-18"), ("n", "The fire escape went down the side of the building and stopped right on top of a burned-out car."),
    ("n", "The roof wasn't an exit. It was a view."),
    # 8 · bản lề
    ("shot", "p2-19"), ("n", "Back downstairs, I tried the maintenance access toward the dock. If it opened, we could avoid most of the stockroom corridor."),
    ("sfx", "metal_bend", 0.8), ("n", "It stuck. I forced it."), ("n", "The top hinge twisted."),
    ("shot", "p2-20"), ("m", "Don't touch that again. Next time it won't open. Or it won't close."), ("sfx", "tape", 0.4), ("n", "She marked it with red tape."),
    ("shot", "p2-22"), ("n", "Then I checked the panel behind the checkout. The tape was torn in half."),
    ("n", "Something had come through while we were on the roof."),
    ("shot", "p2-21"), ("hud", "water", "82 L"), ("n", "That night, Maya turned one of the ceiling cameras to watch that wall."), ("pause", 0.8),
    # 9 · ngày 9 pháo sáng
    ("hud", "day", 9), ("hud", "convoy", "5 DAYS"), ("shot", "p2-23"), ("sfx", "helicopter", 0.5),
    ("n", "On Day 9, the radio told survivors to signal search helicopters from somewhere visible. Then we heard one over the river."),
    ("shot", "p2-24"), ("n", "I had a flare from the van's emergency kit in my hand before I'd even thought about it."),
    ("m", "Don't. They can't land here. Everything down there will see it."), ("n", "She was right. I knew she was right."),
    ("shot", "p2-25"), ("sfx", "flare", 0.9), ("pause", 0.8), ("n", "I lit it anyway."), ("pause", 1.0),
    ("shot", "p2-26"), ("sfx", "helicopter", 0.3), ("n", "The helicopter didn't turn. It didn't slow down. It just kept going, and then it was gone."),
    ("shot", "p2-27"), ("sfx", "crowd", 0.6), ("n", "And everything that was waiting in the streets looked up at the red light on our roof."),
    ("shot", "p2-28"), ("n", "Maya turned the camera back toward the front. By evening, I couldn't see the parking lot anymore. Just bodies."),
    ("n", "They hadn't found us by accident. I'd shown them where we were."), ("pause", 0.4), ("n", "And I didn't even ask her first."),
    ("shot", "p2-29"), ("hud", "water", "75 L"), ("sfx", "glass_thump", 0.8), ("sfx", "glass_crack", 0.7), ("n", "That night, the glass started to crack."),
    ("pause", 1.0),
    # 10 · ngày 10
    ("hud", "day", 10), ("hud", "convoy", "4 DAYS"), ("shot", "p2-30"), ("sfx", "rain", 0.5),
    ("n", "Day 10. It rained all day, and the solar panels gave us almost nothing."), ("n", "We carried what water we could into the stockroom. Thirty liters."),
    ("shot", "p2-31"), ("sfx", "metal_bend", 0.9), ("n", "Then the side door started to bend. The frame, the latch, everything."),
    ("sfx", "shutter_hit", 0.8), ("n", "We braced it with two shelving units and our whole bodies."), ("n", "It held. Barely."),
    ("shot", "s09a"), ("n", "Forty-five liters were still in aisles five and six. After the side door buckled, we couldn't safely reach them."),
    ("shot", "p2-32"), ("hud", "water", "24 L"), ("n", "We sat against the water cases and shared one bottle."), ("n", "Maya didn't say \"I told you so.\""),
    ("pause", 0.5), ("n", "That was worse."), ("pause", 1.2),
    # 11 · bóng nhỏ
    ("shot", "p2-33"), ("card", "CAM 1 · 02:47"), ("n", "We'd turned the camera back toward the checkout that afternoon. At two forty-seven, a small shape appeared on the live feed."),
    ("n", "Small. Beside the checkout. Reaching up toward the scanner."),
    ("shot", "p2-34"), ("sfx", "sco_beep", 0.6), ("n", "A few seconds later, the checkout beeped, and printed a receipt."), ("n", "Three twelve, of course."),
    ("shot", "p2-35"), ("sfx", "footsteps_run", 0.6), ("n", "The shadow went up. Into the wall. Into the ceiling."),
    ("n", "We grabbed the flashlights and ran to the maintenance ladder in the stockroom."),
    ("shot", "p2-36"), ("sfx", "crash", 0.9), ("n", "Before I touched it, an old support bar tore loose and smashed into the floor between us."),
    ("shot", "p2-37"), ("pause", 0.8), ("n", "Maya pointed her light up into the dark."), ("m", "Someone's up there."), ("pause", 0.6),
    ("n", "I looked at the broken support on the floor. We still had to get up there."), ("pause", 2.0),
    # 12 · thẻ kết
    ("shot", "END"), ("pause", 10.0),
]
