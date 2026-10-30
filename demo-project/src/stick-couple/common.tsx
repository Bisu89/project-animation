import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/Baloo2";
import { H, W } from "./Park";
import { INK, Pose, Pt, STANDING, Stick } from "./Stick";

// Shared by every stick-couple episode: easing/keyframe helpers, word captions, the pinned hook and the laugh tag.
export const FPS = 30;
export const { fontFamily: FONT } = loadFont("normal", { weights: ["800"], subsets: ["latin"] });
export type Line = { who: "boy" | "girl"; text: string; start: number; end: number };

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => x * x * (3 - 2 * x);
export const backOut = (x: number) => {
  const c = 1.7;
  const k = clamp01(x) - 1;
  return 1 + (c + 1) * k * k * k + c * k * k;
};
export const keys = (t: number, ks: [number, number][]) => {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) {
    if (t <= ks[i][0]) return lerp(ks[i - 1][1], ks[i][1], smooth((t - ks[i - 1][0]) / (ks[i][0] - ks[i - 1][0])));
  }
  return ks[ks.length - 1][1];
};
export const keysPt = (t: number, ks: [number, Pt][]): Pt => [keys(t, ks.map(([a, p]) => [a, p[0]] as [number, number])), keys(t, ks.map(([a, p]) => [a, p[1]] as [number, number]))];

// ---------- captions ----------
// each line split into chunks of up to 3 words; the word being said is yellow (timed by letter count)
export type Word = { w: string; from: number; to: number; chunk: number };
export const makeWords = (lines: Line[]): Word[] => {
  const out: Word[] = [];
  let chunk = 0;
  lines.forEach((l) => {
    const ws = l.text.split(/\s+/);
    const total = ws.reduce((n, w) => n + w.length + 2, 0);
    let t = l.start;
    ws.forEach((w, i) => {
      const d = ((l.end - l.start) * (w.length + 2)) / total;
      out.push({ w, from: t, to: t + d, chunk });
      t += d;
      if (i % 3 === 2 || /[.?!]$/.test(w)) chunk++;
    });
    chunk++;
  });
  return out;
};
export const Captions: React.FC<{ t: number; words: Word[] }> = ({ t, words: WORDS }) => {
  const cur = WORDS.find((w) => t >= w.from && t < w.to + 0.25);
  if (!cur) return null;
  const words = WORDS.filter((w) => w.chunk === cur.chunk);
  const k = (t - words[0].from) / 0.18;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1560, textAlign: "center", fontFamily: FONT, fontSize: 92, lineHeight: 1.05, transform: `scale(${lerp(0.7, 1, backOut(k))})` }}>
      {words.map((w, i) => (
        <span key={i} style={{ color: t >= w.from && t < w.to ? "#ffe14d" : "#fff", WebkitTextStroke: `16px ${INK}`, paintOrder: "stroke fill", margin: "0 10px", display: "inline-block" }}>
          {w.w.replace(/[,.]+$/, "")}
        </span>
      ))}
    </div>
  );
};

export const Hook: React.FC<{ t: number; text: string }> = ({ t, text }) => (
  <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${backOut(t / 0.3)})` }}>
    <div style={{ background: "#fff", border: `6px solid ${INK}`, borderRadius: 40, padding: "10px 40px", fontFamily: FONT, fontSize: 64, color: INK, boxShadow: `0 8px 0 ${INK}` }}>{text}</div>
  </div>
);

// ---------- laugh tag ----------
export const LaughTag: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const xs = [150, 390, 690, 930];
  return (
    <AbsoluteFill style={{ background: "#f1efe9" }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
        <rect y={1360} width={W} height={H - 1360} fill="#e4e0d6" />
        {xs.map((x, i) => {
          const ph = t * 11 + i * 1.7;
          const bounce = Math.abs(Math.sin(ph)) * -16;
          const lean = Math.sin(ph) * 5;
          const belly = i % 2 === 0;
          const pose: Pose = {
            near: belly ? [55, -110] : [150, -70 + Math.sin(ph * 2) * 20],
            far: belly ? [30, -95] : [60, -40],
            ...STANDING,
            lean,
            tilt: Math.sin(ph) * 6 - 6,
          };
          return <Stick key={i} x={x} hip={1080 + bounce} dir={i < 2 ? 1 : -1} scale={0.82} hair="none" pose={pose} look={{ emo: "laugh", t, tears: 1 }} />;
        })}
      </svg>
      <div style={{ position: "absolute", top: 380, width: "100%", textAlign: "center", fontFamily: FONT, fontSize: 150, color: "#ffe14d", WebkitTextStroke: `18px ${INK}`, paintOrder: "stroke fill", transform: `rotate(${Math.sin(f * 0.6) * 4}deg) scale(${backOut(t / 0.3)})` }}>
        HA HA HA
      </div>
    </AbsoluteFill>
  );
};
