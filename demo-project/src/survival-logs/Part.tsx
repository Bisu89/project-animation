import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";

// Survival Logs — composition dùng chung cho Part 2, 3... (cùng kiểu dựng với P1.tsx). Dữ liệu: src/survival-logs/<part>-data.json.
const FPS = 30;
const SFX = "survival-logs/sfx/";
const XF = 0.45;

type Line = { role: string; text: string; src: string; at: number; dur: number };
type Shot = { img: string; at: number; to: number };
type Ev = { at: number };
export type PartData = {
  total: number;
  endTitle: string;
  endSub: string;
  lines: Line[];
  shots: Shot[];
  sfx: { s: string; at: number; v: number }[];
  hud: { key: string; val: string | number; at: number }[];
  cards: { text: string; at: number }[];
  tags: { text: string; at: number }[];
  receipts: Ev[];
};

const FLICKER = new Set(["06-hop-dieu-khien", "s01a", "s11b", "p2-33", "p2-34"]);
const RAIN = new Set(["s01b", "08-khoa-tay-cua", "s10b", "s10c", "p2-13", "p2-29", "p2-30", "p2-32", "p3-16", "p3-20"]);
const RED = new Set(["p2-25", "p2-26", "p2-27"]);
const SHAKE_SFX = new Set(["glass_thump", "shutter_hit", "crash", "glass_crack", "metal_bend"]);

const RainLayer: React.FC<{ seed: number }> = ({ seed }) => {
  const f = useCurrentFrame();
  const drops = [];
  for (let i = 0; i < 70; i++) {
    const x = ((i * 137 + seed * 31) % 1920) + Math.sin(i) * 20;
    const y = ((f * (38 + (i % 7) * 6) + i * 97) % 1250) - 120;
    drops.push(<line key={i} x1={x} y1={y} x2={x - 6} y2={y + 26 + (i % 4) * 6} stroke="rgba(200,215,230,0.22)" strokeWidth={1.4} />);
  }
  return <svg width={1920} height={1080} style={{ position: "absolute" }}>{drops}</svg>;
};

const ShotView: React.FC<{ s: Shot; idx: number; base: string }> = ({ s, idx, base }) => {
  const f = useCurrentFrame();
  const len = (s.to - s.at) * FPS;
  const z = interpolate(f, [0, len + XF * FPS], idx % 2 === 0 ? [1.0, 1.07] : [1.07, 1.0]);
  const ox = ["50% 50%", "40% 55%", "60% 45%", "55% 60%", "45% 40%"][idx % 5];
  const fade = interpolate(f, [0, XF * FPS], [0, 1], { extrapolateRight: "clamp" });
  const fl = FLICKER.has(s.img) ? (Math.sin(f * 2.3) > 0.6 || Math.sin(f * 0.9) > 0.93 ? 0.6 : 1) : 1;
  const red = RED.has(s.img) ? 0.9 + 0.1 * Math.sin(f * 1.7) * Math.sin(f * 0.6) : 1;
  return (
    <AbsoluteFill style={{ opacity: fade, overflow: "hidden" }}>
      <Img src={staticFile(base + "img/" + s.img + ".png")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, transformOrigin: ox, filter: `brightness(${fl * red})` }} />
      {RAIN.has(s.img) ? <RainLayer seed={idx} /> : null}
    </AbsoluteFill>
  );
};

const lastAt = <T extends { at: number }>(arr: T[], t: number) => arr.filter((x) => x.at <= t).pop();

export const Part: React.FC<{ data: PartData; base: string; bare?: boolean; mute?: boolean }> = ({ data, base, bare, mute }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const subs = React.useMemo(
    () =>
      data.lines.reduce<{ from: number; to: number; text: string; role: string }[]>((acc, l) => {
        const parts = l.text.match(/[^.!?—]+[.!?—"]*\s*/g) || [l.text];
        const total = parts.reduce((a, p) => a + p.length, 0);
        let tt = l.at;
        parts.forEach((p) => {
          const d = (p.length / total) * l.dur;
          acc.push({ from: tt, to: tt + d + 0.15, text: p.trim(), role: l.role });
          tt += d;
        });
        return acc;
      }, []),
    [data],
  );
  const sub = subs.filter((s) => t >= s.from && t < s.to).pop();
  const shake = data.sfx.some((x) => SHAKE_SFX.has(x.s) && t >= x.at && t < x.at + 0.35) ? Math.sin(f * 7) * 7 : 0;
  const day = lastAt(data.hud.filter((h) => h.key === "day"), t);
  const water = lastAt(data.hud.filter((h) => h.key === "water"), t);
  const convoy = lastAt(data.hud.filter((h) => h.key === "convoy"), t);
  const clock = lastAt(data.hud.filter((h) => h.key === "clock"), t);
  const card = data.cards.filter((c) => t >= c.at && t < c.at + 4).pop();
  const tag = data.tags.filter((c) => t >= c.at && t < c.at + 4).pop();
  const endShot = data.shots[data.shots.length - 1];
  const inEnd = t >= endShot.at;
  const subColor: Record<string, string> = { m: "#ffd27a", nia: "#9fd7ff" };
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.4}px)` }}>
        {data.shots.map((s, i) =>
          s.img === "END" ? null : (
            <Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={Math.round((s.to - s.at + XF) * FPS)}>
              <ShotView s={s} idx={i} base={base} />
            </Sequence>
          ),
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)" }} />
      {inEnd ? (
        <Sequence from={Math.round(endShot.at * FPS)}>
          <AbsoluteFill style={{ background: "#050607" }}>
            <div style={{ position: "absolute", left: 200, top: 430, fontFamily: "Arial Black, Arial, sans-serif", color: "#f2e6c9", fontSize: 90, letterSpacing: 8 }}>{data.endTitle}</div>
            <div style={{ position: "absolute", left: 204, top: 545, fontFamily: "Arial, sans-serif", color: "#b8ad96", fontSize: 34 }}>{data.endSub}</div>
          </AbsoluteFill>
        </Sequence>
      ) : null}
      {!bare && !inEnd && day ? (
        <div style={{ position: "absolute", left: 60, top: 44, fontFamily: "Arial Black, Arial, sans-serif", color: "#f2e6c9", letterSpacing: 4, textShadow: "0 2px 8px #000" }}>
          <span style={{ fontSize: 26, opacity: 0.8 }}>DAY </span>
          <span style={{ fontSize: 46 }}>{day.val}</span>
          {water ? <div style={{ fontSize: 22, marginTop: 6, opacity: 0.85, fontFamily: "Arial, sans-serif", fontWeight: 700 }}>WATER {water.val}</div> : null}
          {convoy ? <div style={{ fontSize: 22, marginTop: 4, color: "#e0b26a", fontFamily: "Arial, sans-serif", fontWeight: 700 }}>CONVOY: {convoy.val}</div> : null}
          {clock ? <div style={{ fontSize: 30, marginTop: 6, color: "#ff8a6a", fontFamily: "Courier New, monospace", fontWeight: 700 }}>{clock.val}</div> : null}
        </div>
      ) : null}
      {card ? (
        <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", opacity: interpolate(t - card.at, [0, 0.4, 3.4, 4], [0, 1, 1, 0]) }}>
          <span style={{ fontFamily: "Courier New, monospace", fontSize: 40, color: "#f2e6c9", background: "rgba(10,10,10,0.6)", padding: "10px 26px" }}>{card.text}</span>
        </div>
      ) : null}
      {tag ? (
        <div style={{ position: "absolute", left: "50%", top: 600, transform: "translateX(-50%)", fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 34, color: "#222", background: "#f1ede2", padding: "10px 24px", boxShadow: "0 10px 30px rgba(0,0,0,0.6)", opacity: interpolate(t - tag.at, [0, 0.3, 3.5, 4], [0, 1, 1, 0]) }}>
          {tag.text}
        </div>
      ) : null}
      {!bare && sub && !inEnd ? (
        <div style={{ position: "absolute", bottom: 64, width: "100%", textAlign: "center" }}>
          <span style={{ fontFamily: "Arial, sans-serif", fontSize: 42, fontWeight: 700, fontStyle: sub.role === "spk" || sub.role === "news" || sub.role === "radio" ? "italic" : "normal", color: subColor[sub.role] || "#fff", background: "rgba(0,0,0,0.55)", padding: "8px 22px", borderRadius: 8 }}>
            {sub.text}
          </span>
        </div>
      ) : null}
      {mute ? null : <Audio src={staticFile(SFX + "drone.wav")} volume={0.22} loop />}
      {mute ? null : data.lines.map((l, i) => (
        <Sequence key={"v" + i} from={Math.round(l.at * FPS)} durationInFrames={Math.round((l.dur + 0.3) * FPS)}>
          <Audio src={staticFile(base + l.src)} volume={l.role === "spk" ? 0.75 : l.role === "news" || l.role === "radio" ? 0.8 : 1} />
        </Sequence>
      ))}
      {mute ? null : data.sfx.map((x, i) => (
        <Sequence key={"f" + i} from={Math.round(x.at * FPS)}>
          <Audio src={staticFile(SFX + x.s + ".wav")} volume={x.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
