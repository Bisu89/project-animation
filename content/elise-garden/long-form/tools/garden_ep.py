"""Elise Garden long-form: validate canonical data and derive views.

Usage (from anywhere):
  python garden_ep.py validate [--ep EP01]   # check timing/states/cameras/narration, write qa_report.json
  python garden_ep.py views    [--ep EP01]   # regenerate docs/EP01_STORYBOARD.md and episodes/EP01/PILOT_8_SHOTS.md
  python garden_ep.py csv      [--ep EP01]   # write media/gen-anh.csv (keyframes) + media/muse_queue.csv (manual Muse clips, for Codex ingest)

Source of truth: ../data/**.json. Markdown and CSV are derived; never edit them by hand.
"""
import argparse, csv, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # .../long-form
DATA = os.path.join(ROOT, "data")


def load(*p):
    with open(os.path.join(DATA, *p), encoding="utf-8") as f:
        return json.load(f)


def tc(frames, fps):
    s = frames / fps
    return f"{int(s // 60):02d}:{s % 60:05.2f}" if s % 1 else f"{int(s // 60):02d}:{int(s % 60):02d}"


def ctx(ep):
    return dict(series=load("series.json"), layout=load("garden_layout.json"), states=load("garden_state.json"),
                elise=load("characters", "elise.json"), assets=load("assets.json"),
                episode=load("episodes", ep, "episode.json"), shots=load("episodes", ep, "shots.json"),
                narration=load("episodes", ep, "narration.json"), ep=ep)


# ------------------------------------------------------------------ validate
def validate(c):
    errors, warnings = [], []
    ep, shots, fps = c["episode"], c["shots"]["shots"], c["episode"]["fps"]
    order = c["states"]["order"]
    cams = {x["id"] for x in c["layout"]["cameras"]} | {"CLOSE"} | {i["id"] for i in c["layout"].get("interiors", [])}

    # timing: contiguous, exact runtime
    cur = 0
    for i, s in enumerate(shots):
        exp = f"SH{i + 1:03d}"
        if s["id"] != exp:
            errors.append(f"{s['id']}: id không liên tục (mong đợi {exp})")
        if s["startFrame"] != cur:
            errors.append(f"{s['id']}: startFrame {s['startFrame']} ≠ {cur} (hở hoặc chồng)")
        if s["durationFrames"] <= 0:
            errors.append(f"{s['id']}: durationFrames ≤ 0")
        cur = s["startFrame"] + s["durationFrames"]
    if cur != ep["targetFrames"]:
        errors.append(f"Tổng {cur} khung = {cur / fps:.2f} s ≠ {ep['targetSeconds']} s")

    # sequences align with shots
    for q in ep["sequences"]:
        mine = [s for s in shots if s["sequenceId"] == q["id"]]
        if not mine:
            errors.append(f"{q['id']}: không có shot")
            continue
        a, b = mine[0]["startFrame"], mine[-1]["startFrame"] + mine[-1]["durationFrames"]
        if a != q["startFrame"] or b - a != q["durationFrames"]:
            errors.append(f"{q['id']}: shot phủ {a}–{b}, sequence là {q['startFrame']}–{q['startFrame'] + q['durationFrames']}")

    # cameras, states, chronology
    last_state, last_day = 0, 0
    for s in shots:
        if s["cameraId"] not in cams:
            errors.append(f"{s['id']}: cameraId lạ {s['cameraId']}")
        if s["cameraId"] == "CLOSE" and not s.get("anchorRef"):
            errors.append(f"{s['id']}: cảnh CLOSE thiếu anchorRef")
        for k in ("gardenStateBefore", "gardenStateAfter"):
            if s[k] not in order:
                errors.append(f"{s['id']}: {k} lạ {s[k]}")
        if s["gardenStateBefore"] not in order or s["gardenStateAfter"] not in order:
            continue
        ib, ia = order.index(s["gardenStateBefore"]), order.index(s["gardenStateAfter"])
        if ia < ib:
            errors.append(f"{s['id']}: trạng thái đi lùi {s['gardenStateBefore']}→{s['gardenStateAfter']}")
        if ia - ib > 1:
            warnings.append(f"{s['id']}: nhảy {ia - ib} trạng thái trong một shot")
        if s.get("flashForward"):
            continue
        if ib < last_state:
            errors.append(f"{s['id']}: trạng thái {s['gardenStateBefore']} sớm hơn shot trước (không phải cold open)")
        if s["day"] < last_day:
            errors.append(f"{s['id']}: ngày {s['day']} lùi so với shot trước")
        last_state, last_day = max(last_state, ia), max(last_day, s["day"])
        st = c["states"]["states"][s["gardenStateAfter"]]
        if st["day"] > s["day"]:
            errors.append(f"{s['id']}: trạng thái {s['gardenStateAfter']} thuộc ngày {st['day']} nhưng shot ở ngày {s['day']}")

    # shot length sanity vs Muse
    for s in shots:
        sec = s["durationFrames"] / fps
        if sec > 14:
            warnings.append(f"{s['id']}: {sec:.1f} s > 14 s — cần ≥ 2 clip hoặc cắt ý")

    # pilot completeness
    pilot = [s for s in shots if s.get("pilot") or s.get("wave")]
    produced = set()
    for s in pilot:
        for k in s["promptImage"] or []:
            produced.add(k["file"])
    for s in pilot:
        if not s["promptImage"] or not s["promptVideo"]:
            errors.append(f"{s['id']}: pilot thiếu prompt")
            continue
        used = 0.0
        for i, v in enumerate(s["promptVideo"], 1):
            for f in (v["start"], v.get("end")):
                if f and f not in produced:
                    errors.append(f"{v['clipId']}: khung {f} không có prompt tạo")
            if v.get("ref") and os.path.basename(v["ref"]) == v["start"]:
                errors.append(f"{v['clipId']}: ảnh tham chiếu trùng khung đầu (Muse từ chối)")
            if v["outputFile"] != f"{s['id']}_{i:02d}.mp4" or v["clipId"] != f"{s['id']}_{i:02d}":
                errors.append(f"{v['clipId']}: tên file xuất {v['outputFile']} không khớp shot ID")
            if v["editSeconds"] > 8.5:
                errors.append(f"{v['clipId']}: dùng {v['editSeconds']} s > 8,5 s/clip (Muse đứng hình đầu + đuôi hay lỗi) — chia clip")
            if v["editSeconds"] > v["museSeconds"]:
                errors.append(f"{v['clipId']}: dùng {v['editSeconds']} s nhưng Muse chỉ tạo {v['museSeconds']} s")
            if "Duration:" not in v["prompt"]:
                warnings.append(f"{v['clipId']}: prompt Muse thiếu thời lượng")
            used += v["editSeconds"]
        if abs(used - s["durationFrames"] / fps) > 1e-6:
            errors.append(f"{s['id']}: tổng giây dùng của các clip {used} ≠ thời lượng shot {s['durationFrames'] / fps}")
        for k in s["promptImage"]:
            if "no freckles" not in k["prompt"] and "Elise" in k["prompt"] and "No person" not in k["prompt"]:
                warnings.append(f"{k['file']}: prompt có Elise nhưng thiếu câu 'no freckles'")
    if len([s for s in shots if s.get("pilot")]) != 8:
        warnings.append("Pilot không đủ 8 shot (brief: 8)")

    # narration
    n = c["narration"]
    lo, hi = c["series"]["narration"]["wordsPerEpisode"]
    if not lo <= n["wordsTotal"] <= hi:
        warnings.append(f"Lời dẫn {n['wordsTotal']} từ, ngoài khoảng {lo}–{hi}")
    byid = {s["id"]: s for s in shots}
    cues = sorted(n["cues"], key=lambda x: x["startFrame"])
    for i, q in enumerate(cues):
        sh = byid.get(q["overShot"])
        if sh and not sh["startFrame"] <= q["startFrame"] < sh["startFrame"] + sh["durationFrames"]:
            warnings.append(f"{q['id']}: mốc {q['startSeconds']} s không nằm trong {q['overShot']}")
        end = q["startFrame"] + q["estSeconds"] * fps
        if i + 1 < len(cues) and end > cues[i + 1]["startFrame"]:
            errors.append(f"{q['id']}: chồng lên {cues[i + 1]['id']}")
        if end > ep["targetFrames"]:
            errors.append(f"{q['id']}: vượt cuối tập")

    # assets: report missing real files
    missing = [a["path"] for a in c["assets"]["assets"] if not a["exists"]]

    result = {"errors": errors, "warnings": warnings,
              "totals": {"shots": len(shots), "frames": cur, "seconds": cur / fps,
                         "museClipsEstimate": sum(s["estimate"]["museClips"] for s in shots),
                         "keyframesEstimate": sum(s["estimate"]["keyframes"] for s in shots),
                         "narrationWords": n["wordsTotal"]},
              "assetsMissing": len(missing)}
    qa_path = os.path.join(DATA, "episodes", c["ep"], "qa_report.json")
    with open(qa_path, encoding="utf-8") as f:
        qa = json.load(f)
    qa["validation"] = result
    with open(qa_path, "w", encoding="utf-8") as f:
        json.dump(qa, f, ensure_ascii=False, indent=2)
        f.write("\n")
    return result


# ------------------------------------------------------------------ views
def storyboard_md(c):
    ep, shots, fps = c["episode"], c["shots"]["shots"], c["episode"]["fps"]
    cue_by_shot = {}
    for q in c["narration"]["cues"]:
        cue_by_shot.setdefault(q["overShot"], []).append(q)
    L = [f"# {ep['id']} Storyboard — {ep['title']}", "",
         "> File SINH TỰ ĐỘNG từ `data/episodes/EP01/*.json` bằng `tools/garden_ep.py views`. Không sửa tay.", "",
         f"Tổng: **{len(shots)} shot, {sum(s['durationFrames'] for s in shots) / fps:.0f} s** ở {fps} fps. "
         "Thời lượng là thời lượng trên timeline dựng; một shot có thể gồm nhiều clip Muse ngắn.", "",
         "Ký hiệu camera: A = cổng, B = hiên, C = rào đông, D = cạnh tây; CLOSE = cận, `anchorRef` = camera gần nhất → hướng nhìn.", ""]
    for q in ep["sequences"]:
        L += [f"## {q['id']} · {tc(q['startFrame'], fps)}–{tc(q['startFrame'] + q['durationFrames'], fps)} · {q['durationSeconds']} s",
              f"**{q['content']}** — giữ chân: {q['retentionPurpose']}", "",
              "| Shot | Thời điểm | Dài | Ngày/giờ | Trạng thái | Camera | Cỡ | Mô tả | Giữ chân | Âm thanh / lời |",
              "|---|---|---:|---|---|---|---|---|---|---|"]
        for s in [x for x in shots if x["sequenceId"] == q["id"]]:
            cam = s["cameraId"].replace("CAM_", "").split("_")[0] if s["cameraId"].startswith("CAM_") else s["cameraId"]
            if s.get("anchorRef"):
                cam += f" ({s['anchorRef']})"
            st = s["gardenStateBefore"].split("_")[0]
            if s["gardenStateAfter"] != s["gardenStateBefore"]:
                st += "→" + s["gardenStateAfter"].split("_")[0]
            aud = "; ".join(s["audioCues"])
            for cue in cue_by_shot.get(s["id"], []):
                aud += f" **VO {cue['id']} @{cue['startSeconds']:.0f}s:** “{cue['text']}”"
            name = f"**{s['id']}** ⭐" if s.get("pilot") else s["id"]
            desc = s["description"] + (f" _({s['notes']})_" if s.get("notes") and s["notes"] != "PILOT" else "")
            L.append(f"| {name} | {tc(s['startFrame'], fps)} | {s['durationFrames'] / fps:g} | N{s['day']} {s['timeOfDay']} | {st} | {cam} | "
                     f"{s['shotScale']} | {desc} | {s['retentionPurpose']} | {aud} |")
        L.append("")
    L += ["## Chữ đè (thêm lúc ghép)", "", "| Giây | Dài | Chữ | Vị trí |", "|---:|---:|---|---|"]
    for o in ep["overlays"]:
        L.append(f"| {o['atSeconds']} | {o['durationSeconds']} | {o['text']} | {o['position']} |")
    L += ["", "⭐ = shot pilot, prompt đầy đủ ở `episodes/EP01/PILOT_8_SHOTS.md`."]
    return "\n".join(L) + "\n"


MEDIA = "episodes/{ep}/media"


def image_order(pilot):
    items = {}
    for s in pilot:
        for k in s["promptImage"]:
            items[k["file"]] = k
    done, ordered = set(), []

    def visit(f):
        if f in done or f not in items:
            return
        for r in items[f]["sendWith"]:
            visit(os.path.basename(r))
        done.add(f)
        ordered.append(items[f])
    for f in items:
        visit(f)
    return ordered


def clip_rows(c, pilot):
    fps = c["episode"]["fps"]
    rows = []
    for s in pilot:
        t = s["startFrame"] / fps
        for v in s["promptVideo"]:
            rows.append((s, v, t))
            t += v["editSeconds"]
    return rows


def pilot_md(c, wave=None):
    shots, fps, ep = c["shots"]["shots"], c["episode"]["fps"], c["ep"]
    pilot = [s for s in shots if (s.get("wave") == wave if wave else s.get("pilot"))]
    media = MEDIA.format(ep=ep)
    order = image_order(pilot)
    rank = {k["file"]: i for i, k in enumerate(order, 1)}
    clips = clip_rows(c, pilot)
    L = [f"# {ep}: production package " + (f"đợt {wave} ({len(pilot)} shot)" if wave else "cho 8 shot pilot"), "",
         "> File SINH TỰ ĐỘNG từ `data/episodes/EP01/shots.json` (`tools/garden_ep.py views`). Không sửa tay.", "",
         "**Trạng thái:** prompt đã sẵn sàng, CHƯA có khung hay clip nào. Ảnh Elise dùng trang phục series Garden "
         "(`references/anh/gl1-A-elise-garden-truoc.png`, yếm short rằn ri + áo ba lỗ cam). Plate nền gen ở Gate B (`references/gen-anh.csv`) "
         "rồi chép sang `media/anh/`.", "",
         "## Cách dùng với Muse AI (người dùng tự tạo)",
         "Kinh nghiệm DIY/Wild được áp dụng có chọn lọc trong [PRODUCTION_PLAN §7](../../docs/PRODUCTION_PLAN.md#7-áp-dụng-kinh-nghiệm-diywild-cho-garden): kiểm keyframe trước Muse, chọn đoạn sạch, phân biệt lỗi clip và lỗi giao video. Không áp dụng timelapse reel cho Garden long-form.",
         f"1. Ảnh khung: tạo theo thứ tự trong bảng dưới (ảnh sau cần ảnh trước làm tham chiếu), lưu vào `{media}/anh/` đúng tên file. "
         f"Có thể chạy `muse-auto/gpt_anh.py --csv {media}/gen-anh.csv`.",
         "2. Mỗi clip trên Muse: tải lên **First frame**, **Last frame** (nếu có) và **Reference image**, rồi dán nguyên khối prompt. "
         "Prompt đã tự mô tả Elise và khu vườn, không cần Muse nhớ gì từ lần trước.",
         f"3. Tải video về, đổi tên đúng **Output filename** (`<shotId>_<nn>.mp4`) và thả vào `{media}/muse/`. "
         f"Codex đối chiếu với `{media}/muse_queue.csv`.",
         "4. Khung của clip nào đạt thì tạo clip đó trên Muse luôn, không chờ đủ bộ ảnh. Mỗi lúc chỉ một clip trong một chat.",
         "5. **Clip trượt** (biến hình, vật tự hiện, tay méo, đổi trang phục): gửi lại như một video mới, tức đủ ảnh + prompt + dòng "
         "`FIX FROM PREVIOUS ATTEMPT: <lỗi>`, lưu thành `<clip>_r2.mp4` (bản cũ để nguyên). **Muse lỗi giao hàng** thì gửi lại nguyên tin. "
         "Không bao giờ chỉ nhắn \"render lại\".",
         "6. Ảnh đã gửi Muse mà phải gen lại thì **đặt tên mới** (vd `gl1-SH018-b2.png`), vì Muse dùng lại ảnh trùng tên.",
         "7. Thời lượng nguồn theo từng yêu cầu trong bảng; Codex chọn đoạn sạch (cột *Dùng trên timeline*), không mặc định bắt đầu ở giây 0. Bỏ đầu đứng hình, soi tự cắt cảnh và lỗi vật hiện hàng loạt ở đuôi; nếu không đủ coverage thì báo thiếu, không kéo khung đứng.",
         "8. Nếu Muse không có đúng thời lượng yêu cầu, chọn mức dài hơn gần nhất; Codex kiểm đoạn sạch và trim. Không kéo khung đứng hoặc giảm tốc để bù clip thiếu. File tồn tại chưa có nghĩa là đã QA/approved.", "",
         f"Khối lượng: **{len(order)} ảnh** (5 plate + khung) + 1 ảnh Elise, **{len(clips)} clip Muse**, "
         f"{sum(s['durationFrames'] for s in pilot) / fps:g} s trên timeline. Dự phòng 30% làm lại.", "",
         "## Thứ tự tạo ảnh", "", "| # | File | Gửi kèm |", "|---:|---|---|"]
    for i, k in enumerate(order, 1):
        L.append(f"| {i} | `{k['file']}` | {', '.join('`' + os.path.basename(r) + '`' for r in k['sendWith']) or '—'} |")
    L += ["", "## Danh sách clip Muse", "", "| Output filename | Shot | First frame | Last frame | Reference | Muse tạo | Dùng trên timeline |",
          "|---|---|---|---|---|---:|---|"]
    for s, v, t in clips:
        L.append(f"| `{v['outputFile']}` | {s['id']} | `{v['start']}` | {('`' + v['end'] + '`') if v.get('end') else '—'} | "
                 f"{('`' + os.path.basename(v['ref']) + '`') if v.get('ref') else '—'} | {v['museSeconds']} s | {v['editSeconds']:g} s @ {tc(int(round(t * fps)), fps)} |")
    L += ["", "Bản dựng thử (Codex/Remotion): nối 8 shot theo đúng timecode. Thêm chữ 'Day 1/2/3' và nhãn AI. "
          "SH024 có slot 12 s: 2 s cảnh hoang + 10 s cảnh đã dọn. Mặc định cắt thẳng; nếu hòa thì giữ tổng slot 12 s, không trừ chồng thêm. Chưa cần lời dẫn.",
          "Ảnh/clip vẫn chưa có. Manifest là kế hoạch nhận file; watcher/ingest và composition Garden chưa triển khai. Các bước dưới đây không gọi API hay tự gửi Muse.", ""]
    for s in pilot:
        d = s["pilotDetail"]
        sec = s["durationFrames"] / fps
        L += ["---", "", f"## {s['id']} · {s['sequenceId']} · {tc(s['startFrame'], fps)}–{tc(s['startFrame'] + s['durationFrames'], fps)}", "",
              "| Mục | Nội dung |", "|---|---|",
              f"| 1. Shot ID | **{s['id']}**: {s['description']} |",
              f"| 2. Mục tiêu cảnh | {s['goal']} |",
              f"| 3. Reference asset | {', '.join('`' + os.path.basename(a) + '`' for a in s['assetRefs'] if not a.startswith('gl1-' + s['id']))} |",
              f"| 6. Thời lượng mục tiêu | **{sec:g} s** trên timeline = " + " + ".join(f"{v['outputFile']} dùng {v['editSeconds']:g} s (Muse tạo {v['museSeconds']} s)" for v in s["promptVideo"]) + " |",
              "| 7. First / Last frame | " + "<br>".join(f"{v['outputFile']}: đầu `{v['start']}`, cuối " + (f"`{v['end']}`" if v.get("end") else "không có") for v in s["promptVideo"]) + " |",
              "| 9. Output filename | " + ", ".join(f"`{v['outputFile']}`" for v in s["promptVideo"]) + " |",
              f"| Camera / ánh sáng | {s['cameraId']}{' (' + s['anchorRef'] + ')' if s.get('anchorRef') else ''} · {s['shotScale']} · Ngày {s['day']} {s['timeOfDay']} · {s['gardenStateBefore']}→{s['gardenStateAfter']} |",
              f"| Bố cục | {d['frameComposition']} |",
              f"| Âm thanh (cho Codex) | {' / '.join(v['audio'] for v in s['promptVideo'])} |"]
        if d.get("edit"):
            L.append(f"| Dựng | {d['edit']} |")
        if s['id'] == 'SH052':
            L += ["", "**Continuity SH052:** chỉ đang gieo một phần hàng củ cải. Không tự thêm nhãn, nước tưới hoặc gieo xong các cây khác. S3→S4 hiện là mã pha thô, không phải chỉ thị vẽ toàn bộ trạng thái S4 hoàn chỉnh. Trước full episode cần tinh chỉnh trạng thái từng luống.", ""]
        L += ["", "### 4. Image prompt", ""]
        for k in s["promptImage"]:
            L += [f"**`{k['file']}`** (ảnh #{rank[k['file']]}). Gửi kèm: "
                  + (", ".join('`' + os.path.basename(r) + '`' for r in k["sendWith"]) or "không"), "", "```text", k["prompt"], "```", ""]
        L += ["### 5. Muse AI video prompt", ""]
        for v in s["promptVideo"]:
            L += [f"**`{v['outputFile']}`**: First frame `{v['start']}` · Last frame " + (f"`{v['end']}`" if v.get("end") else "không")
                  + " · Reference " + (f"`{os.path.basename(v['ref'])}`" if v.get("ref") else "không") + f" · {v['museSeconds']} s"
                  + (f". _{v['note']}_" if v.get("note") else ""), "", "```text", v["prompt"], "```", ""]
        L += ["### 8. Negative constraints", "",
              "Các ràng buộc này đã viết sẵn thành câu khẳng định trong prompt. Nếu Muse có ô negative thì dán dòng sau:", "",
              "```text", "Avoid: " + ", ".join(s["negativePrompt"]) + ".", "```", "",
              "**Continuity:** " + "; ".join(d["continuity"]), "",
              "**Đạt khi:**", *[f"- [ ] {a}" for a in d["acceptance"]], ""]
    return "\n".join(L) + "\n"


def views(c):
    out = [(os.path.join(ROOT, "docs", f"{c['ep']}_STORYBOARD.md"), storyboard_md(c)),
           (os.path.join(ROOT, "episodes", c["ep"], "PILOT_8_SHOTS.md"), pilot_md(c))]
    for w in sorted({s["wave"] for s in c["shots"]["shots"] if s.get("wave")}):
        out.append((os.path.join(ROOT, "episodes", c["ep"], f"WAVE{w}_PACKAGE.md"), pilot_md(c, w)))
    for p, txt in out:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "w", encoding="utf-8", newline="\n") as f:
            f.write(txt)
        print("wrote", os.path.relpath(p, ROOT))


# ------------------------------------------------------------------ manifests: keyframe CSV + Muse queue
def to_csv(c, wave=None):
    pilot = [s for s in c["shots"]["shots"] if (s.get("wave") == wave if wave else s.get("pilot"))]
    sfx = f"-w{wave}" if wave else ""
    d = os.path.join(ROOT, MEDIA.format(ep=c["ep"]))
    for sub in ("anh", "muse"):
        os.makedirs(os.path.join(d, sub), exist_ok=True)
    order = image_order(pilot)
    with open(os.path.join(d, f"gen-anh{sfx}.csv"), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["stt", "ten_file", "ty_le", "gui_kem", "prompt"])
        for i, k in enumerate(order, 1):
            w.writerow([i, k["file"], "16:9", "; ".join(os.path.basename(r) for r in k["sendWith"]), k["prompt"]])
    rows = clip_rows(c, pilot)
    with open(os.path.join(d, f"muse_queue{sfx}.csv"), "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["order", "shot_id", "clip_id", "output_file", "first_frame", "last_frame", "reference_image",
                    "muse_seconds", "edit_seconds", "timeline_start_s", "pilot_start_s", "prompt", "audio_note", "status",
                    "transition_in"])
        pilot_start = 0.0
        for i, (s, v, t) in enumerate(rows, 1):
            w.writerow([i, s["id"], v["clipId"], v["outputFile"], v["start"], v.get("end") or "",
                        os.path.basename(v["ref"]) if v.get("ref") else "", v["museSeconds"], v["editSeconds"],
                        round(t, 3), round(pilot_start, 3), v["prompt"], v["audio"],
                        "generated" if os.path.exists(os.path.join(d, "muse", v["outputFile"])) else "todo",
                        v.get("transitionIn", "mo")])
            pilot_start += v['editSeconds']
    print(f"wrote {MEDIA.format(ep=c['ep'])}/gen-anh{sfx}.csv ({len(order)}) + muse_queue{sfx}.csv ({len(rows)})")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["validate", "views", "csv"])
    ap.add_argument("--ep", default="EP01")
    ap.add_argument("--wave", type=int, help="csv cho đợt N (mặc định: pilot)")
    a = ap.parse_args()
    c = ctx(a.ep)
    if a.cmd == "validate":
        r = validate(c)
        for e in r["errors"]:
            print("LỖI   ", e)
        for w in r["warnings"]:
            print("CẢNH BÁO", w)
        print(json.dumps(r["totals"], ensure_ascii=False), "| asset chưa có file:", r["assetsMissing"])
        sys.exit(1 if r["errors"] else 0)
    if a.cmd == "views":
        views(c)
    if a.cmd == "csv":
        to_csv(c, a.wave)


if __name__ == "__main__":
    main()
