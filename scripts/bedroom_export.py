"""Validate and sync bedroom-gag models to Remotion. Never generates images."""
import argparse
import csv
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content" / "bedroom-gag"
EXPECTED = {
    "CS1": "husband_sheet.png", "CS2": "wife_sheet.png",
    "CS3": "expressions_sheet.png", "CS4": "hands_sheet.png",
    "BG1": "bg_bedroom_wide.png", "BG2": "bg_bedroom_lamp.png",
    "BG3": "bg_bedroom_door_open.png",
}
REFS = ("montage_faces.png", "crop_husband_standing.png", "crop_wife_sitting.png")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--public-root", type=Path, default=ROOT / "demo-project" / "public")
    args = parser.parse_args()
    with (CONTENT / "assets.csv").open(encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    if len(rows) != len(EXPECTED) or {r["id"]: r["image_filename"] for r in rows} != EXPECTED:
        raise SystemExit("assets.csv must contain CS1-CS4 and BG1-BG3 with the established filenames.")
    if any(not r["prompt"].strip() for r in rows):
        raise SystemExit("Every asset needs a prompt.")
    files = [(CONTENT / "models" / name, Path(name)) for name in EXPECTED.values()]
    files += [(CONTENT / "refs" / name, Path("refs") / name) for name in REFS]
    # Preflight everything before overwriting any exported file.
    for src, _ in files:
        if not src.is_file() or src.read_bytes()[:8] != b"\x89PNG\r\n\x1a\n":
            raise SystemExit(f"Missing or invalid PNG: {src}")
    dest = args.public_root.resolve() / "bedroom-gag"
    for src, rel in files:
        target = dest / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, target)
    print(f"Synced {len(files)} PNGs to {dest}")
    print("CS1/CS2 and video references use black hands; CS4 uses white hands. This difference is intentional in the preview.")


if __name__ == "__main__":
    main()
