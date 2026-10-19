#!/usr/bin/env python3
"""Group a narration script into IMAGE scenes (one picture each, with a smooth zoom/pan) and write
  content/<slug>/scenes.csv   scene, chapter, start_s, end_s, narration, image_filename, motion, fx, image_prompt
  demo-project/src/<slug>/scenes.ts   typed SCENE list (cue-indexed, so a re-recorded voice re-times it)

Needs the timeline made by gen_voice.py (src/<slug>/timeline.json). Prompts and fx come from content/<slug>/prompts.txt:
one line per scene, in order:  fx | image description        (fx = none | rain | wind | flicker | dust, may be empty)
If prompts.txt is shorter than the scene list the missing prompts are left as TODO.

usage: python build_scenes.py --slug zs-ep01 [--target 11] [--style-file content/zs-style.txt]
"""
import argparse, csv, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import gen_voice  # noqa: E402  (reuse the same paragraph/sentence splitting so cue indices match)

MOTIONS = ["in", "out", "in-left", "in-right", "out-left", "in-up", "out-right", "in-down"]


def chapters_and_paragraphs(path):
    raw = open(path, encoding="utf-8-sig").read().replace("\r\n", "\n")
    chapter, out = "", []
    for block in re.split(r"\n\s*\n", raw):
        lines = [l.strip() for l in block.split("\n") if l.strip()]
        heads = [l for l in lines if l.startswith("#")]
        if heads:
            chapter = heads[-1].lstrip("#").strip()
        body = [re.sub(r"^[-*>]\s+", "", l) for l in lines if not l.startswith("#")]
        sents = [s for s in (gen_voice.clean(x) for x in gen_voice.SENT_RE.split(" ".join(body))) if s]
        if sents:
            out.append((chapter, sents))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True)
    ap.add_argument("--target", type=float, default=11.0, help="aim for this many seconds per image")
    ap.add_argument("--min-s", type=float, default=7.0, help="fold scenes shorter than this into the previous one")
    ap.add_argument("--style-file", default="content/zs-style.txt")
    a = ap.parse_args()
    root = os.path.dirname(HERE)
    script = os.path.join(root, "content", a.slug, "script.md")
    tl = json.load(open(os.path.join(root, "demo-project", "src", a.slug, "timeline.json"), encoding="utf-8"))
    cues = tl["cues"]
    paras = chapters_and_paragraphs(script)
    assert sum(len(p[1]) for p in paras) == len(cues), "script and timeline do not match: re-run gen_voice.py"

    scenes, cur, idx = [], None, 0
    for chapter, sents in paras:
        first, last = idx, idx + len(sents) - 1
        idx += len(sents)
        dur = cues[last]["end"] - cues[first]["start"]
        if cur and cur["chapter"] == chapter and (cues[cur["last"]]["end"] - cues[cur["first"]]["start"]) < a.target * 0.75 and dur + (cues[cur["last"]]["end"] - cues[cur["first"]]["start"]) < a.target * 1.5:
            cur["last"] = last
        else:
            cur = {"chapter": chapter, "first": first, "last": last}
            scenes.append(cur)

    # a scene shorter than --min-s is folded into the previous scene of the same chapter (no 2-second pictures)
    merged = []
    for s in scenes:
        short = cues[s["last"]]["end"] - cues[s["first"]]["start"] < a.min_s
        if merged and short and merged[-1]["chapter"] == s["chapter"]:
            merged[-1]["last"] = s["last"]
        else:
            merged.append(s)
    scenes = merged

    prompts = []
    pf = os.path.join(root, "content", a.slug, "prompts.txt")
    if os.path.exists(pf):
        prompts = [l.rstrip("\n") for l in open(pf, encoding="utf-8") if l.strip() and not l.startswith("#")]
    style = open(os.path.join(root, a.style_file), encoding="utf-8").read().strip() if os.path.exists(os.path.join(root, a.style_file)) else ""

    rows, ts = [], []
    for i, s in enumerate(scenes):
        fx, desc = "none", "TODO"
        if i < len(prompts):
            parts = prompts[i].split("|", 1)
            fx, desc = (parts[0].strip() or "none", parts[1].strip()) if len(parts) == 2 else ("none", parts[0].strip())
        start, end = cues[s["first"]]["start"], cues[s["last"]]["end"]
        text = " ".join(c["text"] for c in cues[s["first"] : s["last"] + 1])
        name = f"scene{i + 1:02d}.png"
        motion = MOTIONS[i % len(MOTIONS)]
        toks = fx.split()
        for t in toks:  # `mo:in-left` in the fx column picks this picture's camera move
            if t.startswith("mo:"):
                motion = t[3:]
        fx = " ".join(t for t in toks if not t.startswith("mo:")) or "none"
        rows.append([i + 1, s["chapter"], round(start, 1), round(end, 1), text, name, motion, fx, f"{style} {desc}".strip()])
        ts.append({"i": i + 1, "chapter": s["chapter"], "firstCue": s["first"], "lastCue": s["last"], "image": name, "motion": motion, "fx": fx})

    csv_path = os.path.join(root, "content", a.slug, "scenes.csv")
    with open(csv_path, "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(["scene", "chapter", "start_s", "end_s", "narration", "image_filename", "motion", "fx", "image_prompt"])
        w.writerows(rows)
    out = os.path.join(root, "demo-project", "src", a.slug, "scenes.ts")
    with open(out, "w", encoding="utf-8") as f:
        f.write("// Generated by scripts/build_scenes.py from content/<slug>/script.md + prompts.txt. Re-run instead of editing.\n")
        f.write("export type SceneSpec = { i: number; chapter: string; firstCue: number; lastCue: number; image: string; motion: string; fx: string };\n")
        f.write("export const SCENE_SPECS: SceneSpec[] = " + json.dumps(ts, indent=1) + ";\n")
    print(json.dumps({"scenes": len(scenes), "avg_s": round(sum(r[3] - r[2] for r in rows) / len(rows), 1), "prompts_given": len(prompts), "csv": csv_path, "ts": out}, indent=1))
    for r in rows:
        print(r[0], r[1][:18].ljust(18), r[2], "-", r[3], "|", r[4][:60])


if __name__ == "__main__":
    main()
