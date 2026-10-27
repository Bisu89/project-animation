"""Shared helpers for the cozy-scene scripts: find and load a scene config (demo-project/src/cozy-scene/scenes/<id>.json)."""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCENES = os.path.join(ROOT, "demo-project", "src", "cozy-scene", "scenes")


def load(scene_id):
    p = os.path.join(SCENES, scene_id + ".json")
    if not os.path.exists(p):
        sys.exit("no config %s (create one with: python scripts/cozy_new.py %s portrait|wide)" % (p, scene_id))
    with open(p, encoding="utf-8") as f:
        return json.load(f)


def content_dir(cfg):
    return os.path.join(ROOT, "content", cfg["content"])


def public_dir(cfg):
    return os.path.join(ROOT, "demo-project", "public", cfg["assets"])


def variants(cfg):
    """[(id, from_file, crop_file, box, public_name, prompt)] for the fire plate and every creature patch."""
    out = []
    fp = (cfg.get("fire") or {}).get("plate")
    if fp:
        out.append(("fire", fp["from"], fp["crop"], fp["box"], fp["src"], fp["prompt"]))
    for p in (cfg.get("creature") or {}).get("patches", []):
        out.append((p["id"], p["from"], p["crop"], p["box"], p["src"], p["prompt"]))
    return out
