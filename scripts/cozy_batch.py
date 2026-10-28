"""Prepare many cozy scenes at once and mirror them into ONE private render folder.

Usage: python scripts/cozy_batch.py <out_dir> [scene_id ...]       (no ids = every scene except xmas-cat-wide)
For each scene: cozy_prepare (master + the ChatGPT results that exist), cozy_sfx (47 s ambience), music.mp3 chosen by the
`_music` key of its JSON (a file name without .mp3 in C:/Users/hoavx/Desktop/audio, or any path), then mirrors to <out_dir>/<assets>/.
Render with --public-dir=<out_dir>.
"""
import json
import os
import shutil
import subprocess
import sys

import cozy_lib as L

AUDIO = "C:/Users/hoavx/Desktop/audio"
out = os.path.abspath(sys.argv[1])
ids = sys.argv[2:] or sorted(f[:-5] for f in os.listdir(L.SCENES) if f.endswith(".json") and f != "xmas-cat-wide.json")
py = sys.executable
for sid in ids:
    cfg = L.load(sid)
    pub = L.public_dir(cfg)
    subprocess.run([py, os.path.join(L.ROOT, "scripts", "cozy_prepare.py"), sid], check=True, stdout=subprocess.DEVNULL)
    subprocess.run([py, os.path.join(L.ROOT, "scripts", "cozy_sfx.py"), sid, "47"], check=True, stdout=subprocess.DEVNULL)
    m = cfg.get("_music") or "Window Prayer"
    src = m if os.path.exists(m) else os.path.join(AUDIO, m + ".mp3")
    shutil.copyfile(src, os.path.join(pub, "music.mp3"))
    # per-frame music features (neon / intro / reacting lights read <assets>/features.json)
    if cfg.get("neon") or cfg.get("intro") or (cfg.get("lights") or {}).get("react", 0) > 0:
        subprocess.run([py, os.path.join(L.ROOT, "scripts", "smoke_features.py"), os.path.join(pub, "music.mp3"), os.path.join(pub, "features.json")], check=True, stdout=subprocess.DEVNULL)
    dst = os.path.join(out, cfg["assets"])
    shutil.rmtree(dst, ignore_errors=True)
    shutil.copytree(pub, dst)
    print("ready", sid, "music:", os.path.basename(src))
print("use --public-dir=" + out)
