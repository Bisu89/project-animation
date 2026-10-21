#!/usr/bin/env python3
"""Scaffold a new episode of the ancient-battles series from the Thermopylae episode.

  python scripts/new_anc_episode.py --slug anc-ep02 --id AncEp02 --title "Cannae: ..."

Creates   content/<slug>/script.md, plan.py, sources.md           (skeletons to fill in)
          demo-project/src/<slug>/Video.tsx, Diagrams.tsx, KenBurns.tsx, Fx.tsx, cues.ts, sfxplan.ts
          demo-project/public/<slug>/images/
and registers the composition <id> in demo-project/src/Root.tsx (at the `stickman-video:` markers).
Action (sprite) scenes are not scaffolded: add a Scenes file and an ACTION entry in Video.tsx when the episode has them.
Full recipe: docs/series/ancient-battles-style/TEMPLATE_LAM_TAP_MOI.md
"""
import argparse, os, re, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = "anc-ep01"


def rd(p):
    return open(p, encoding="utf-8").read()


def wr(p, s):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, "w", encoding="utf-8", newline="\n").write(s)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True)
    ap.add_argument("--id", required=True, help="Remotion composition id, e.g. AncEp02")
    ap.add_argument("--title", default="TITLE: subtitle")
    a = ap.parse_args()
    sd = os.path.join(ROOT, "demo-project", "src", a.slug)
    if os.path.exists(sd):
        raise SystemExit(f"{sd} already exists")
    src = os.path.join(ROOT, "demo-project", "src", SRC)
    for f in ("KenBurns.tsx", "Fx.tsx", "cues.ts", "sfxplan.ts"):
        os.makedirs(sd, exist_ok=True)
        shutil.copy(os.path.join(src, f), os.path.join(sd, f))
    v = rd(os.path.join(src, "Video.tsx"))
    v = v.replace(f'const ASSETS = "{SRC}";', f'const ASSETS = "{a.slug}";')
    v = re.sub(r'import \{ EngineFade \} from "\.\./anc-pilot1/Action";\n', 'import { EngineFade } from "../anc-pilot1/Action";\n', v)
    v = re.sub(r'import \{ SceneMarch, SceneShieldWall, SceneWalkAway \} from "\.\./anc-pilot1/ActionSprites";\n', "", v)
    v = re.sub(r"const ACTION: Record<string, React.FC> = \{[^}]*\};", "const ACTION: Record<string, React.FC> = {}; // key -> sprite scene component (see ../anc-pilot1/ActionSprites.tsx)", v)
    wr(os.path.join(sd, "Video.tsx"), v)
    wr(os.path.join(sd, "Diagrams.tsx"), '''import React from "react";
import { Arrow, BLUE, Card, Dot, GOLD, INK, LAND, Paper, RED, ROCK, SAND, SEA, SERIF, Ship, Unit, bez, ease } from "../anc-lib/kit";

// This episode's diagrams. Build each one from the primitives in ../anc-lib/kit.tsx (see ../anc-ep01/Diagrams.tsx for D1-D5).
// A diagram is a component taking { stage }; several narration scenes can reuse one diagram with different stages.
void [Arrow, BLUE, Card, Dot, GOLD, INK, LAND, Paper, RED, ROCK, SAND, SEA, SERIF, Ship, Unit, bez, ease];

export const DIAGRAMS: Record<string, React.FC<{ stage: number }>> = {};
''')
    cd = os.path.join(ROOT, "content", a.slug)
    wr(os.path.join(cd, "script.md"), f"# {a.title}\n\nCold open: the most dramatic moment, no greeting.\n\n## Chapter one\n\nOne sentence per fact. Present tense. Specific numbers.\n")
    wr(os.path.join(cd, "sources.md"), f"# {a.slug}: source notes\n\n## Well attested\n\n## Disputed or later (wording is hedged)\n\n## Our own analysis (not from the sources)\n\n## Check before voicing\n")
    wr(os.path.join(cd, "plan.py"), '"""Visual plan, see content/anc-ep01/plan.py for the format. Fill P after gen_voice.py + a first anc_plan run shows the scene count."""\nTARGET = 10\nMIN_S = 5\nP = {}\n')
    os.makedirs(os.path.join(ROOT, "demo-project", "public", a.slug, "images"), exist_ok=True)
    rp = os.path.join(ROOT, "demo-project", "src", "Root.tsx")
    r = rd(rp)
    comp = a.id
    const = a.id.replace("-", "")
    if f'id="{comp}"' not in r:
        r = r.replace("// stickman-video:imports", f'import {{ Video as {const}, DURATION as {const}_DURATION }} from "./{a.slug}/Video";\n// stickman-video:imports', 1)
        block = f'''<Composition
        id="{comp}"
        component={{{const}}}
        durationInFrames={{{const}_DURATION}}
        fps={{30}}
        width={{1920}}
        height={{1080}}
        defaultProps={{{{ music: 0, sfx: 0, voice: "voice.wav", captions: true }}}}
      />
'''
        marker = "{/* stickman-video:compositions */}"
        r = r.replace(marker, block + "      " + marker, 1)
        wr(rp, r)
    print("scaffolded", a.slug, "-> composition", comp)
    print("next: write script.md, then gen_voice.py (see TEMPLATE_LAM_TAP_MOI.md step 3)")


if __name__ == "__main__":
    main()
