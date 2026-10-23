"""Writes content/camp-demo/assets_action.csv (asset prompts for the lakeside camp scene). Re-run after editing the text here."""
import csv
import os

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "content", "camp-demo", "assets_action.csv")
KEEP = " EDIT the approved master picture (attached): keep the SAME canvas size, SAME framing, and keep every remaining object at EXACTLY the same position, size, colour and lighting."
G = " Delete everything else and fill the whole background with a flat, perfectly uniform bright green (#00FF00), no shadow, no gradient."
M = " Delete everything else and fill the whole background with a flat, perfectly uniform bright magenta (#FF00FF), no shadow, no gradient."
TAIL = " Paint the object completely, including parts that were hidden behind other things. No text, no watermark."
LIGHT = "LIGHT RULE (all pictures): warm yellow light comes from the tent on the LEFT; cool blue-violet dusk light comes from the sky and lake on the RIGHT and above."

rows = [
    ("M0", "master", "master.png", "3:2",
     "Cinematic 2D hand-painted illustration, subtle fine linework, natural shapes, muted palette with blue-violet dusk and soft warm yellow. Wide landscape 1536x1024; keep all important content inside the central 16:9 band (leave about 80 px free at top and bottom). Scene: an adult sits beside an earth-coloured tent by a lake in a pine forest at dusk. SIDE VIEW: the person faces RIGHT toward the lake, sitting on a low folding camp chair, wearing a long-sleeved jacket, the near arm resting in the lap. The tent is on the LEFT with a soft warm yellow glow inside the open doorway. A low wooden camp table stands in front of the person with ONE metal camp cup on it (no steam drawn). Several layers of pine forest and mountains across the lake, grass and a couple of rocks in the foreground. Natural proportions, depth, material texture of cloth, wood, stone and trees, not cluttered. "
     + LIGHT + " No 3D render, no photo, no stick figure, no icon style, no text, no logo, no watermark.",
     "FIRST. Generate several and pick one. Every other picture is made by EDITING this one. It is not used as a layer."),
    ("B1", "plate", "bg_far.png", "3:2",
     "EDIT the master picture: remove the tent, the person, the chair, the table, the cup, the near pines and the foreground grass and rocks. Keep sky, distant mountains, the lake and the far tree line exactly where they are; repaint the removed areas as natural lake, shore and forest. Same canvas size. " + LIGHT,
     "Plate, not keyed. Static apart from a very slow light shift."),
    ("B2", "object", "pines_mid.png", "3:2",
     KEEP + " Keep ONLY the nearer pine trees and the dark ground band they stand on (no tent, person, table or foreground)." + M + TAIL,
     "KEY=magenta (trees are green). Sways very slightly: a horizontal shear of the top only."),
    ("C1", "object", "tent_body.png", "3:2",
     KEEP + " Keep ONLY the tent with its warm lit interior and the ground under it, but REMOVE the door flap (doorway fully open and lit)." + G + TAIL,
     "KEY=green. Static."),
    ("C2", "object", "tent_flap.png", "3:2",
     KEEP + " Keep ONLY the loose door flap of the tent, hanging at its original position and shape." + G + TAIL,
     "KEY=green. Pivot: top hinge. Rotates +/-2 deg."),
    ("C3", "plate", "tent_glow.png", "3:2",
     "From the master picture create a light map: the warm yellow glow of the tent interior and the soft light it throws on the ground and nearby objects, drawn as soft yellow-orange light on a pure BLACK background, no objects, same canvas size, same positions.",
     "Additive layer (blend mode screen). Opacity 0.9 to 1.0, slow and uneven."),
    ("F1", "object", "foreground.png", "3:2",
     KEEP + " Keep ONLY the foreground grass tufts and rocks along the bottom edge and any branch at the top edge." + M + TAIL,
     "KEY=magenta. In front of everything. Each grass tuft sways with its own phase."),
    ("P1", "object", "person_body.png", "3:2",
     KEEP + " Keep ONLY the seated person without the head and without the NEAR arm (the arm closer to the camera), plus the chair under them. Paint the jacket fully where the removed arm was, with a clean shoulder cap." + G + TAIL,
     "KEY=green. Breath: scale Y +0.8 percent, pivot at the hips. Tell me the shoulder joint pixel when delivering."),
    ("P2", "object", "head_open.png", "3:2", KEEP + " Keep ONLY the head and neck, eyes open." + G + TAIL, "KEY=green. Pivot: neck base."),
    ("P3", "object", "head_closed.png", "3:2",
     KEEP + " Keep ONLY the head and neck; change ONLY the eyes to closed. Nothing else changes." + G + TAIL, "KEY=green. Blink frame, shown for about 5 frames."),
    ("A1", "object", "arm_upper.png", "3:2",
     KEEP + " Keep ONLY the near arm's upper part, shoulder to elbow, in the jacket sleeve, straightened and horizontal as if reaching forward, the sleeve extending 40 px past the elbow. Its shoulder end sits exactly at the shoulder joint." + G + TAIL,
     "KEY=green. Pivot: shoulder end. The sleeve overlaps the forearm so no gap shows when it bends."),
    ("A2", "object", "arm_forearm.png", "3:2",
     KEEP + " Keep ONLY the near forearm, elbow to wrist, straightened and horizontal, in the jacket sleeve with the cuff at the wrist, the same length as the upper arm (+/-5 percent), hand NOT included." + G + TAIL,
     "KEY=green. Pivot: elbow end."),
    ("A3", "object", "hand_open.png", "3:2",
     KEEP + " Keep ONLY the near hand seen from the side, relaxed and slightly open, its wrist at the right end of the forearm." + G + TAIL, "KEY=green. Pivot: wrist."),
    ("A4", "object", "hand_grip.png", "3:2",
     KEEP + " Keep ONLY the same near hand with the fingers closed as if gripping a cup handle, the same size and wrist position as the open hand." + G + TAIL,
     "KEY=green. Swapped at the moment of grasp."),
    ("T1", "object", "table.png", "3:2",
     KEEP + " Keep ONLY the low wooden camp table with its shadow on the ground; the top is EMPTY." + G + TAIL, "KEY=green. The table top is the contact line for the cup."),
    ("T2", "object", "cup.png", "3:2",
     KEEP + " Keep ONLY the metal camp cup standing on the table, no steam. If the handle is not visible, repaint it so it faces the person." + G + TAIL,
     "KEY=green. Pivot: handle grip point. Its flat bottom touches the table top."),
]

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8", newline="") as f:
    w = csv.writer(f)
    w.writerow(["id", "type", "image_filename", "aspect", "prompt", "notes"])
    w.writerows(rows)
print(len(rows), "rows ->", OUT)
