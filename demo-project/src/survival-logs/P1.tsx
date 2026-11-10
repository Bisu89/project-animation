import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import data from "./p1-data.json";

// Survival Logs — Tập 1 Part 1 "The Door Kept Saying Welcome". Dữ liệu từ content/survival-logs/ep01-locked-supermarket/p1/.
const FPS = 30;
const P = "survival-logs/p1/";
const IMG = "survival-logs/p1/img/";
const SFX = "survival-logs/sfx/";
export const DURATION = Math.ceil(data.total * FPS);

type Line = { role: string; text: string; src: string; at: number; dur: number };
type Shot = { img: string; at: number; to: number };
const LINES = data.lines as Line[];
const SHOTS = data.shots as Shot[];

// hiệu ứng riêng theo ảnh
const VIDEO: Record<string, string> = { "02-cua-tu-dong-mo": "c02-cua-mo.mp4" };
const FLICKER = new Set(["06-hop-dieu-khien", "s01a", "s11b"]);
const RAIN = new Set(["s01b", "02-cua-tu-dong-mo", "03-dan-quay-dau", "04-vuong-xe-day", "08-khoa-tay-cua", "s10b", "s10c", "09-lui-xa"]);
const FOG: Record<string, [number, number]> = { "08-khoa-tay-cua": [0.69, 0.42] };
const SHAKE_SFX = new Set(["glass_thump", "shutter_hit", "crash", "glass_crack"]);
const XF = 0.45; // giây chuyển cảnh mờ

const sec = (f: number) => f / FPS;

const RainLayer: React.FC<{ seed: number }> = ({ seed }) => {
  const f = useCurrentFrame();
  const drops = [];
  for (let i = 0; i < 70; i++) {
    const x = ((i * 137 + seed * 31) % 1920) + Math.sin(i) * 20;
    const sp = 38 + (i % 7) * 6;
    const y = ((f * sp + i * 97) % 1250) - 120;
    drops.push(<line key={i} x1={x} y1={y} x2={x - 6} y2={y + 26 + (i % 4) * 6} stroke="rgba(200,215,230,0.22)" strokeWidth={1.4} />);
  }
  return <svg width={1920} height={1080} style={{ position: "absolute" }}>{drops}</svg>;
};

const ShotView: React.FC<{ s: Shot; idx: number }> = ({ s, idx }) => {
  const f = useCurrentFrame();
  const len = (s.to - s.at) * FPS;
  const zoomIn = idx % 2 === 0;
  const z = interpolate(f, [0, len + XF * FPS], zoomIn ? [1.0, 1.07] : [1.07, 1.0]);
  const ox = ["50% 50%", "40% 55%", "60% 45%", "55% 60%", "45% 40%"][idx % 5];
  const fade = interpolate(f, [0, XF * FPS], [0, 1], { extrapolateRight: "clamp" });
  const fl = FLICKER.has(s.img) ? (Math.sin(f * 2.3) > 0.6 || Math.sin(f * 0.9) > 0.93 ? 0.6 : 1) : 1;
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, transformOrigin: ox, filter: `brightness(${fl})` };
  const fog = FOG[s.img];
  const br = fog ? Math.max(0, Math.sin(sec(f) * Math.PI / 0.8)) : 0;
  return (
    <AbsoluteFill style={{ opacity: fade, overflow: "hidden" }}>
      {VIDEO[s.img] ? <OffthreadVideo src={staticFile(P + VIDEO[s.img])} muted style={st} /> : <Img src={staticFile(IMG + s.img + ".png")} style={st} />}
      {RAIN.has(s.img) ? <RainLayer seed={idx} /> : null}
      {fog ? (
        <div
          style={{
            position: "absolute", left: `${fog[0] * 100}%`, top: `${fog[1] * 100}%`, width: 260 + br * 120, height: 200 + br * 90,
            transform: "translate(-50%,-50%)", borderRadius: "50%", opacity: 0.25 + br * 0.6, filter: "blur(6px)",
            background: "radial-gradient(ellipse, rgba(220,230,235,0.55) 0%, rgba(220,230,235,0.25) 45%, rgba(220,230,235,0) 70%)",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

const RECEIPT = ["CORNER FRESH", "SELF CHECKOUT", "", "03:12", "", "CRACKERS            x1", "AA BATTERIES (4-PK) x2", "", "PAYMENT PENDING"];
const Receipt: React.FC = () => {
  const f = useCurrentFrame();
  const y = interpolate(f, [0, 12], [60, 0], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", right: 220, top: 150 + y, width: 420, padding: "28px 30px", background: "#f1ede2", boxShadow: "0 20px 60px rgba(0,0,0,0.7)", transform: "rotate(-3deg)", fontFamily: "Courier New, monospace", color: "#222", opacity: interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" }) }}>
      {RECEIPT.map((r, i) => (
        <div key={i} style={{ fontSize: r === "03:12" ? 64 : 24, fontWeight: r === "03:12" || i === 0 ? 700 : 400, textAlign: i < 4 ? "center" : "left", minHeight: 14, color: r === "PAYMENT PENDING" ? "#a3261c" : "#222", whiteSpace: "pre" }}>
          {r}
        </div>
      ))}
    </div>
  );
};

type Sub = { from: number; to: number; text: string; role: string };
const SUBS: Sub[] = LINES.reduce<Sub[]>((acc, l) => {
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

const lastAt = <T extends { at: number }>(arr: T[], t: number) => arr.filter((x) => x.at <= t).pop();

export const P1: React.FC<{ bare?: boolean; mute?: boolean }> = ({ bare, mute }) => {
  const f = useCurrentFrame();
  const t = sec(f);
  const sub = SUBS.filter((s) => t >= s.from && t < s.to).pop();
  const shakeEv = data.sfx.filter((x) => SHAKE_SFX.has(x.s) && t >= x.at && t < x.at + 0.35).length > 0;
  const shake = shakeEv ? Math.sin(f * 7) * 7 : 0;
  const day = lastAt(data.hud.filter((h) => h.key === "day"), t);
  const water = lastAt(data.hud.filter((h) => h.key === "water"), t);
  const key = lastAt(data.hud.filter((h) => h.key === "key"), t);
  const keyShow = key && t - key.at < 5;
  const card = data.cards.filter((c) => t >= c.at && t < c.at + 4).pop();
  const tag = data.tags.filter((c) => t >= c.at && t < c.at + 3.5).pop();
  const rec = data.receipts[0];
  const recShot = rec ? SHOTS.find((s) => s.at <= rec.at && s.to > rec.at) : undefined;
  const endShot = SHOTS[SHOTS.length - 1];
  const inEnd = t >= endShot.at;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.4}px)` }}>
        {SHOTS.map((s, i) =>
          s.img === "END" ? null : (
            <Sequence key={i} from={Math.round(s.at * FPS)} durationInFrames={Math.round((s.to - s.at + XF) * FPS)}>
              <ShotView s={s} idx={i} />
            </Sequence>
          ),
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)" }} />
      {rec && recShot ? (
        <Sequence from={Math.round(rec.at * FPS)} durationInFrames={Math.round((recShot.to - rec.at) * FPS)}>
          <Receipt />
        </Sequence>
      ) : null}
      {inEnd ? (
        <Sequence from={Math.round(endShot.at * FPS)}>
          <AbsoluteFill style={{ background: "#050607" }}>
            <Receipt />
            <div style={{ position: "absolute", left: 200, top: 430, fontFamily: "Arial Black, Arial, sans-serif", color: "#f2e6c9", fontSize: 90, letterSpacing: 8 }}>PART 2</div>
            <div style={{ position: "absolute", left: 204, top: 545, fontFamily: "Arial, sans-serif", color: "#b8ad96", fontSize: 34 }}>I Locked Her In</div>
          </AbsoluteFill>
        </Sequence>
      ) : null}
      {/* HUD */}
      {!bare && !inEnd && day ? (
        <div style={{ position: "absolute", left: 60, top: 44, fontFamily: "Arial Black, Arial, sans-serif", color: "#f2e6c9", letterSpacing: 4, textShadow: "0 2px 8px #000" }}>
          <span style={{ fontSize: 26, opacity: 0.8 }}>DAY </span>
          <span style={{ fontSize: 46 }}>{day.val}</span>
          {water ? <div style={{ fontSize: 22, marginTop: 6, opacity: 0.85, fontFamily: "Arial, sans-serif", fontWeight: 700 }}>WATER {water.val}</div> : null}
          {keyShow && key ? (
            <div style={{ fontSize: 22, marginTop: 4, fontFamily: "Arial, sans-serif", fontWeight: 700, color: key.val === "FOUND" ? "#9fd17a" : "#e0806a", opacity: interpolate(t - key.at, [0, 0.3, 4.5, 5], [0, 1, 1, 0]) }}>
              VAN KEY: {key.val}
            </div>
          ) : null}
        </div>
      ) : null}
      {card ? (
        <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", opacity: interpolate(t - card.at, [0, 0.4, 3.4, 4], [0, 1, 1, 0]) }}>
          <span style={{ fontFamily: "Courier New, monospace", fontSize: 40, color: "#f2e6c9", background: "rgba(10,10,10,0.6)", padding: "10px 26px", letterSpacing: 1 }}>{card.text}</span>
        </div>
      ) : null}
      {tag ? (
        <div style={{ position: "absolute", left: "50%", top: 640, transform: "translateX(-50%) rotate(-4deg)", fontFamily: "Arial Black, Arial, sans-serif", fontSize: 30, color: "#3a2a10", background: "#e8d9a8", padding: "6px 18px", borderRadius: 6, opacity: interpolate(t - tag.at, [0, 0.3, 3, 3.5], [0, 1, 1, 0]) }}>
          {tag.text}
        </div>
      ) : null}
      {!bare && sub && !inEnd ? (
        <div style={{ position: "absolute", bottom: 64, width: "100%", textAlign: "center" }}>
          <span style={{ fontFamily: "Arial, sans-serif", fontSize: 42, fontWeight: 700, fontStyle: sub.role === "spk" || sub.role === "news" ? "italic" : "normal", color: sub.role === "m" ? "#ffd27a" : "#fff", background: "rgba(0,0,0,0.55)", padding: "8px 22px", borderRadius: 8 }}>
            {sub.text}
          </span>
        </div>
      ) : null}
      {mute ? null : <Audio src={staticFile(SFX + "drone.wav")} volume={0.22} loop />}
      {mute ? null : LINES.map((l, i) => (
        <Sequence key={"v" + i} from={Math.round(l.at * FPS)} durationInFrames={Math.round((l.role === "spk" && l.dur < 1 ? l.dur : l.dur + 0.3) * FPS)}>
          <Audio src={staticFile(P + l.src)} volume={l.role === "spk" ? 0.75 : l.role === "news" ? 0.85 : 1} />
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
