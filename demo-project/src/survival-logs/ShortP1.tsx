import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { P1 } from "./P1";
import data from "./p1-data.json";

// Short 9:16 từ Part 1: cảnh 5 + 6A "The door kept saying Welcome". Khung ngang đặt giữa, nền mờ, phụ đề to.
const FPS = 30;
const START = (data.shots.find((s) => s.img === "01-zombie-toi-cua") as { at: number }).at - 0.3;
const LAST = data.lines.find((l) => l.text.indexOf("That's how long") === 0) as { at: number; dur: number };
const END = LAST.at + LAST.dur + 1.2;
export const SHORT_DURATION = Math.round((END - START + 2.5) * FPS);

type Line = { role: string; text: string; at: number; dur: number };
type Sub = { from: number; to: number; text: string; role: string };
const SUBS: Sub[] = (data.lines as Line[]).reduce<Sub[]>((acc, l) => {
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

const W = 1080;
const K = 0.95; // khung chính
const BG = 1.78; // nền phủ kín chiều cao 1920

export const ShortP1: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS + START;
  const sub = SUBS.filter((s) => t >= s.from && t < s.to).pop();
  const inCta = t > END;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* nền mờ, không tiếng */}
      <div style={{ position: "absolute", left: (W - 1920 * BG) / 2, top: 0, width: 1920, height: 1080, transform: `scale(${BG})`, transformOrigin: "0 0", filter: "blur(14px) brightness(0.4)" }}>
        <Sequence from={-Math.round(START * FPS)}>
          <P1 bare mute />
        </Sequence>
      </div>
      {/* khung chính: 1824x1026, cắt hai bên */}
      <div style={{ position: "absolute", left: 0, top: 450, width: W, height: 1080 * K, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: (W - 1920 * K) / 2, top: 0, width: 1920, height: 1080, transform: `scale(${K})`, transformOrigin: "0 0" }}>
          <Sequence from={-Math.round(START * FPS)}>
            <P1 bare />
          </Sequence>
        </div>
      </div>
      {/* tiêu đề trên */}
      <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center", fontFamily: "Arial Black, Arial, sans-serif" }}>
        <div style={{ fontSize: 46, color: "#f2e6c9", letterSpacing: 6 }}>DAY 1</div>
        <div style={{ fontSize: 64, color: "#ffd23f", lineHeight: 1.05, marginTop: 10, textShadow: "0 4px 0 #000" }}>The door kept saying<br />"Welcome"</div>
      </div>
      {/* phụ đề */}
      {sub && !inCta ? (
        <div style={{ position: "absolute", top: 1560, width: "100%", textAlign: "center", padding: "0 60px", boxSizing: "border-box" }}>
          <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 58, lineHeight: 1.25, color: sub.role === "spk" ? "#ffd23f" : "#fff", textShadow: "0 4px 10px #000, 0 0 3px #000" }}>
            {sub.text}
          </span>
        </div>
      ) : null}
      {inCta ? (
        <div style={{ position: "absolute", top: 1540, width: "100%", textAlign: "center", fontFamily: "Arial Black, Arial, sans-serif", opacity: interpolate(t - END, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }) }}>
          <div style={{ fontSize: 54, color: "#fff" }}>14 days. 1 supermarket.</div>
          <div style={{ fontSize: 46, color: "#ffd23f", marginTop: 16 }}>Full story on the channel</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
