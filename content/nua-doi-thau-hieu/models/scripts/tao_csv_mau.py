# Sinh gen-anh.csv cho 4 ảnh mẫu nhân vật "Nửa Đời Thấu Hiểu" (chạy: python tao_csv_mau.py)
import csv, os
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "gen-anh.csv")

FACE = ("An elegant East Asian (Vietnamese) woman about 30 years old, youthful yet noble and graceful, oval face, "
        "soft calm intelligent eyes, a gentle knowing half-smile, refined subtle makeup (soft brown eyeliner, light rosy lips, "
        "natural brows), natural realistic skin texture with fine pores, no airbrushing. Glossy black hair combed back smoothly "
        "into a neat low bun at the nape, held by {pin}. Slim, upright, poised posture.")
ROOM = ("Background: a modern minimalist study room with an East Asian scholar aesthetic: warm light oak wall panels, "
        "{wall}, a low dark walnut desk, a brass desk lamp glowing warm amber, a small ceramic teapot and cups, a vase with "
        "{flower}. Calligraphy on the scrolls is abstract expressive ink brushstrokes, not readable characters, no letters. "
        "Soft warm late-afternoon light, shallow depth of field, cinematic, calm and premium mood.")
STYLE = ("Photorealistic real photograph, 85mm lens, vertical 9:16 portrait, medium shot from the waist up, she faces the camera "
         "almost straight on and looks into the lens. Modest, elegant, family-friendly look. No text, no watermark.")

MAU = [
    ("mau1-kem.png", "a slim carved white jade hairpin with a small jade bead",
     "She wears a fitted ivory-cream silk qipao (cheongsam) with a high mandarin collar, cap sleeves, delicate tone-on-tone "
     "plum-blossom embroidery and pale gold frog buttons.",
     "two tall hanging scrolls of black ink calligraphy on rice paper", "a single branch of white plum blossom",
     "She sits at the desk, both hands resting around a small tea cup."),
    ("mau2-hong-tro.png", "a thin gold hairpin with a tiny dangling pearl",
     "She wears a fitted dusty-rose (muted mauve pink) silk qipao with a high collar, short sleeves, a subtle jacquard "
     "peony pattern and dark rose piping along the collar and side opening.",
     "one large framed ink-wash landscape painting with a calligraphy column beside it", "pale pink peonies",
     "She stands beside the desk, one hand lightly resting on a closed hardcover book."),
    ("mau3-xanh-ngoc.png", "a dark sandalwood hairpin with a small carved jade flower",
     "She wears a fitted deep emerald-green silk qipao with a high collar, three-quarter sleeves, a faint bamboo-leaf "
     "jacquard and gold frog buttons, small pearl stud earrings.",
     "a horizontal calligraphy scroll above a shelf of old books and a small bonsai", "white chrysanthemums",
     "She sits in a low wooden armchair holding an open book on her lap, looking up from it."),
    ("mau4-xanh-muc.png", "a silver hairpin shaped like a small branch",
     "She wears a fitted ink-blue silk qipao printed with small white plum blossoms, a high collar, cap sleeves, and thin "
     "light-gold round glasses.",
     "a hanging scroll of bold ink calligraphy next to a tall window with sheer linen curtains", "a few stems of white orchids",
     "She stands by the window, holding a small celadon tea cup with both hands at chest height."),
]

with open(OUT, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["stt", "ten_file", "ty_le", "gui_kem", "prompt"])
    for i, (ten, pin, outfit, wall, flower, pose) in enumerate(MAU, 1):
        p = " ".join([FACE.format(pin=pin), outfit, pose, ROOM.format(wall=wall, flower=flower), STYLE])
        w.writerow([i, ten, "9:16", "", p])
print("da ghi", OUT)
