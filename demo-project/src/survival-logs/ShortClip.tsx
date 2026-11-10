import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Part, PartData } from "./Part";
import p2data from "./p2-data.json";
import p3data from "./p3-data.json";

// Short 9:16 ghép một hoặc nhiều đoạn cắt từ một Part (dữ liệu Part.tsx). Khung ngang giữa, nền mờ, tiêu đề trên, phụ đề to.
const FPS = 30;
const W = 1080;
const K = 0.95;
const BG = 1.78;

type Seg = { from: number; to: number };
type Cfg = { data: PartData; base: string; segs: Seg[]; day: string; title: string; cta1: string; cta2: string };

const lineEnd = (d: PartData, prefix: string, pad = 0.8) => {
  const l = d.lines.find((x) => x.text.indexOf(prefix) === 0);
  if (!l) throw new Error("không thấy câu: " + prefix);
  return l.at + l.dur + pad;
};
const lineAt = (d: PartData, prefix: string, pad = 0.2) => {
  const l = d.lines.find((x) => x.text.indexOf(prefix) === 0);
  if (!l) throw new Error("không thấy câu: " + prefix);
  return Math.max(0, l.at - pad);
};
const shotAt = (d: PartData, img: string, pad = 0.3) => {
  const s = d.shots.find((x) => x.img === img);
  if (!s) throw new Error("không thấy ảnh: " + img);
  return s.at - pad;
};

const P2 = p2data as PartData;
const P3 = p3data as PartData;
export const SHORTS: Record<string, Cfg> = {
  s2: {
    data: P2, base: "survival-logs/p2/", day: "DAY 6–10", title: "Someone pays for\ngroceries at 3:12 AM",
    segs: [
      { from: shotAt(P2, "p2-02"), to: lineEnd(P2, "Maya showed me the button") },
      { from: shotAt(P2, "p2-33"), to: lineEnd(P2, "I looked at the broken support", 1.2) },
    ],
    cta1: "Who's up there?", cta2: "Full story on the channel",
  },
  s3: {
    data: P2, base: "survival-logs/p2/", day: "DAY 9", title: "Never fire\na flare",
    segs: [{ from: shotAt(P2, "p2-23"), to: lineEnd(P2, "That night, the glass started", 1.5) }],
    cta1: "14 days. 1 supermarket.", cta2: "Full story on the channel",
  },
  s4: {
    data: P3, base: "survival-logs/p3/", day: "DAY 11", title: "Who was paying\nat 3:12 AM?",
    segs: [
      { from: lineAt(P3, "And at the end of it"), to: lineEnd(P3, "Not from Maya") },
      { from: lineAt(P3, "Dad said to leave money"), to: lineEnd(P3, "I didn't want him to come back", 1.0) },
    ],
    cta1: "The 3:12 mystery, solved.", cta2: "Full story on the channel",
  },
  s5: {
    data: P3, base: "survival-logs/p3/", day: "DAY 14", title: "I needed the door\nto scream",
    segs: [
      { from: lineAt(P3, "Five thirty. I switched"), to: lineEnd(P3, "Now I need it to scream") },
      { from: lineAt(P3, "The bent top hinge"), to: lineEnd(P3, "I turned away from the shutter") },
      { from: lineAt(P3, "The bottom edge cleared"), to: lineEnd(P3, "The bottom edge cleared") },
      { from: lineAt(P3, "Behind us, the front glass"), to: lineEnd(P3, "And the speaker was still welcoming", 2.2) },
    ],
    cta1: "14 days. 1 supermarket.", cta2: "Full story on the channel",
  },
};

export const shortDuration = (k: string) => {
  const c = SHORTS[k];
  return Math.round((c.segs.reduce((a, s) => a + (s.to - s.from), 0) + 2.5) * FPS);
};

type Line = { role: string; text: string; at: number; dur: number };
const subsOf = (lines: Line[]) =>
  lines.reduce<{ from: number; to: number; text: string; role: string }[]>((acc, l) => {
    const parts = l.text.match(/[^.!?—]+[.!?—"]*\s*/g) || [l.text];
    const total = parts.reduce((a, p) => a + p.length, 0);
    let t = l.at;
    parts.forEach((p) => {
      const d = (p.length / total) * l.dur;
      acc.push({ from: t, to: t + d + 0.15, text: p.trim(), role: l.role });
      t += d;
    });
    return acc;
  }, []);

const SegView: React.FC<{ c: Cfg; seg: Seg }> = ({ c, seg }) => {
  const f = useCurrentFrame();
  const t = f / FPS + seg.from;
  const sub = subsOf(c.data.lines).filter((s) => t >= s.from && t < s.to).pop();
  const off = -Math.round(seg.from * FPS);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: (W - 1920 * BG) / 2, top: 0, width: 1920, height: 1080, transform: `scale(${BG})`, transformOrigin: "0 0", filter: "blur(14px) brightness(0.4)" }}>
        <Sequence from={off}>
          <Part data={c.data} base={c.base} bare mute />
        </Sequence>
      </div>
      <div style={{ position: "absolute", left: 0, top: 450, width: W, height: 1080 * K, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: (W - 1920 * K) / 2, top: 0, width: 1920, height: 1080, transform: `scale(${K})`, transformOrigin: "0 0" }}>
          <Sequence from={off}>
            <Part data={c.data} base={c.base} bare />
          </Sequence>
        </div>
      </div>
      {sub ? (
        <div style={{ position: "absolute", top: 1560, width: "100%", textAlign: "center", padding: "0 60px", boxSizing: "border-box" }}>
          <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 58, lineHeight: 1.25, color: sub.role === "m" ? "#ffd27a" : sub.role === "radio" ? "#9fd7ff" : "#fff", textShadow: "0 4px 10px #000, 0 0 3px #000" }}>
            {sub.text}
          </span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const ShortClip: React.FC<{ k: string }> = ({ k }) => {
  const c = SHORTS[k];
  const f = useCurrentFrame();
  const total = c.segs.reduce((a, s) => a + (s.to - s.from), 0);
  const t = f / FPS;
  let acc = 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {c.segs.map((s, i) => {
        const from = Math.round(acc * FPS);
        const len = Math.round((s.to - s.from) * FPS);
        acc += s.to - s.from;
        return (
          <Sequence key={i} from={from} durationInFrames={len}>
            <SegView c={c} seg={s} />
          </Sequence>
        );
      })}
      <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center", fontFamily: "Arial Black, Arial, sans-serif" }}>
        <div style={{ fontSize: 46, color: "#f2e6c9", letterSpacing: 6 }}>{c.day}</div>
        <div style={{ fontSize: 64, color: "#ffd23f", lineHeight: 1.05, marginTop: 10, textShadow: "0 4px 0 #000", whiteSpace: "pre-line" }}>{c.title}</div>
      </div>
      {t > total ? (
        <AbsoluteFill style={{ background: "rgba(0,0,0,0.75)" }}>
          <div style={{ position: "absolute", top: 1500, width: "100%", textAlign: "center", fontFamily: "Arial Black, Arial, sans-serif", opacity: interpolate(t - total, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }) }}>
            <div style={{ fontSize: 54, color: "#fff" }}>{c.cta1}</div>
            <div style={{ fontSize: 46, color: "#ffd23f", marginTop: 16 }}>{c.cta2}</div>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
