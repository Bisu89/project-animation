import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, random, staticFile, useCurrentFrame, Easing } from "remotion";
import LAYERS from "./layers.json";

// "Better Together": 4 climbing beats (0-7.5 s) then a sunset end card. 1080x1920, 30 fps, 12.5 s.
// Background = clean cliff plate; boy and girl are separate keyed sprites; the rope is drawn in SVG between their hands,
// so it always connects. Tune the numbers in LAYOUT after the first render (sprite art decides hand positions).
export const FPS = 30;
export const DURATION = Math.round(12.5 * FPS);
const W = 1080;
const H = 1920;
const IMG = (n: string) => staticFile(`better-together/${n}.png`);

const LAYOUT = {
  bgOffset: 300, // the cliff plate is pushed down so the girl has sky above the top ledge; sky colour fills the gap
  girl: { x: 840, y: 245, h: 380, hand: [0.1, 0.88] as [number, number], handPull: [0.086, 0.85] as [number, number] }, // handPull = tail tip of the rope drawn in girl_pull // centre of sprite, height px, hand as fraction of sprite box
  boyPath: [ // centre of the boy at each beat: [seconds, x, y]
    [0, 520, 1500],
    [2, 560, 1250],
    [4, 610, 1000],
    [6, 640, 760],
    [7.2, 618, 611],
  ] as [number, number, number][],
  boy: { h: 440, hand: [0.76, 0.0] as [number, number], handReach: [0.9, 0.02] as [number, number] },
  pullAt: 5.5,
  endAt: 7.5,
};

const sprite = (n: keyof typeof LAYERS, h: number) => ({ h, w: (h * LAYERS[n].w) / LAYERS[n].h });

const Sprite: React.FC<{ n: keyof typeof LAYERS; cx: number; cy: number; h: number; rot?: number; opacity?: number }> = ({ n, cx, cy, h, rot = 0, opacity = 1 }) => {
  const s = sprite(n, h);
  return <Img src={IMG(n)} style={{ position: "absolute", left: cx - s.w / 2, top: cy - s.h / 2, width: s.w, height: s.h, transform: `rotate(${rot}deg)`, opacity }} />;
};

const boyAt = (t: number) => {
  const p = LAYOUT.boyPath;
  let i = 0;
  while (i < p.length - 2 && t > p[i + 1][0]) i++;
  const [t0, x0, y0] = p[i];
  const [t1, x1, y1] = p[i + 1];
  const k = interpolate(t, [t0, t1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  return { x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k };
};

const Climb: React.FC<{ t: number }> = ({ t }) => {
  const girlPull = t >= LAYOUT.pullAt;
  const reach = t >= 6.3;
  const b = boyAt(t);
  const beat = Math.sin(t * Math.PI * 2 * 1.1); // climbing rhythm
  const bob = reach ? 0 : beat * 9;
  const rot = reach ? 0 : beat * 1.6;
  const by = b.y + bob;
  const girlBreath = Math.sin(t * 2.2) * 3;
  const gy = LAYOUT.girl.y + girlBreath;

  const gS = sprite("girl_look", LAYOUT.girl.h);
  const bn = reach ? "boy_reach" : "boy_climb";
  const bS = sprite(bn, LAYOUT.boy.h);
  const gh = girlPull ? LAYOUT.girl.handPull : LAYOUT.girl.hand;
  const gHand = { x: LAYOUT.girl.x - gS.w / 2 + gS.w * gh[0], y: gy - gS.h / 2 + gS.h * gh[1] };
  const bHand = { x: b.x - bS.w / 2 + bS.w * (reach ? LAYOUT.boy.handReach : LAYOUT.boy.hand)[0], y: by - bS.h / 2 + bS.h * (reach ? LAYOUT.boy.handReach : LAYOUT.boy.hand)[1] };
  // rope: a slightly sagging curve that tightens as he gets close and she pulls
  // rope: a gentle sag that scales with its length and goes slack-to-taut as he nears the top and she pulls
  const len = Math.hypot(bHand.x - gHand.x, bHand.y - gHand.y);
  const sag = len * interpolate(t, [0, 7], [0.14, 0.05], { extrapolateRight: "clamp" });
  const mx = (gHand.x + bHand.x) / 2 - (girlPull ? len * 0.16 : sag) + Math.sin(t * 2.4) * 6;
  const my = (gHand.y + bHand.y) / 2;

  const zoom = 1 + t * 0.004;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(90deg, #49a3fb, #54adfd)", transform: `scale(${zoom})`, transformOrigin: "50% 40%" }}>
      <Img src={IMG("bg_cliff")} style={{ position: "absolute", left: 0, top: LAYOUT.bgOffset, width: W, height: H }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0, opacity: interpolate(t, [6.0, 6.6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        <path d={`M ${gHand.x} ${gHand.y} Q ${mx} ${my} ${bHand.x} ${bHand.y}`} stroke="#5e4326" strokeWidth={9} fill="none" strokeLinecap="round" />
        <path d={`M ${gHand.x} ${gHand.y} Q ${mx} ${my} ${bHand.x} ${bHand.y}`} stroke="#b08555" strokeWidth={5.5} fill="none" strokeLinecap="round" />
        <path d={`M ${gHand.x - 2} ${gHand.y} Q ${mx - 2} ${my} ${bHand.x - 2} ${bHand.y}`} stroke="#d2ad7c" strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d={`M ${gHand.x} ${gHand.y} Q ${mx} ${my} ${bHand.x} ${bHand.y}`} stroke="#6b4a2b" strokeOpacity={0.5} strokeWidth={5.5} fill="none" strokeDasharray="2 5" />
      </svg>
      <Sprite n={girlPull ? "girl_pull" : "girl_look"} cx={LAYOUT.girl.x} cy={gy} h={LAYOUT.girl.h} rot={girlPull ? -2 : 0} />
      <Sprite n={bn} cx={b.x} cy={by} h={LAYOUT.boy.h} rot={rot} />
    </AbsoluteFill>
  );
};

const End: React.FC<{ t: number }> = ({ t }) => {
  const lt = t - LAYOUT.endAt;
  const zoom = 1 + lt * 0.012;
  const glow = 0.35 + Math.sin(lt * 1.6) * 0.08;
  const titleIn = interpolate(lt, [0.5, 1.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subIn = interpolate(lt, [1.2, 2.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const heartIn = interpolate(lt, [2.4, 3.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) });
  return (
    <AbsoluteFill style={{ opacity: interpolate(lt, [0, 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 70%" }}>
        <Img src={IMG("bg_sunset")} style={{ width: W, height: H, position: "absolute" }} />
        <div style={{ position: "absolute", left: W / 2 - 400, top: 1000, width: 800, height: 800, borderRadius: 400, background: "radial-gradient(circle, #ffd27a 0%, transparent 65%)", opacity: glow, mixBlendMode: "screen" }} />
        <Sprite n="couple_back" cx={W / 2} cy={1620} h={520} />
        {Array.from({ length: 6 }, (_, i) => {
          const age = ((lt * 0.35 + i / 6) % 1);
          const x = 480 + (random(`h${i}`) - 0.5) * 140 + Math.sin(age * 6 + i) * 22;
          const y = 1300 - age * 360;
          return <div key={i} style={{ position: "absolute", left: x, top: y, fontSize: 40, opacity: heartIn * Math.sin(Math.PI * age) * 0.9, color: "#e8454f" }}>♥</div>;
        })}
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 190, width: W, textAlign: "center", fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: 84, color: "#111", opacity: titleIn, transform: `translateY(${(1 - titleIn) * 24}px)` }}>BETTER TOGETHER</div>
      <div style={{ position: "absolute", top: 330, width: W, padding: "0 140px", boxSizing: "border-box", textAlign: "center", fontFamily: "Arial, sans-serif", fontSize: 54, lineHeight: 1.25, color: "#111", opacity: subIn }}>The right person helps you reach your dreams.</div>
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile("better-together/audio/music.wav")} volume={(f) => interpolate(f, [0, 20], [0, 0.7], { extrapolateRight: "clamp" })} />
      <Audio src={staticFile("better-together/audio/wind.wav")} volume={0.35} />
      <Sequence from={Math.round((LAYOUT.endAt + 0.5) * FPS)}>
        <Audio src={staticFile("better-together/audio/chime.wav")} volume={0.6} />
      </Sequence>
      {t < LAYOUT.endAt + 0.6 ? <Climb t={t} /> : null}
      {t >= LAYOUT.endAt ? <End t={t} /> : null}
    </AbsoluteFill>
  );
};
