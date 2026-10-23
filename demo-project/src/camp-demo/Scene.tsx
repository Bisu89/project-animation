import React from "react";
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from "remotion";
import { FPS, T, V, blinkAt, ik2 } from "./motion";
import WATER from "./water.json";
import { HAND_A0, L1, L2, LAYERS, SHOULDER, TABLE_Y, attached, cupAt, cupTilt, wristAt } from "./rig";

// The picture is the approved master with the person, chair and cup removed (bg.png); the person is rebuilt from
// layers: body, head (open/closed eyes), two arm bones and a hand (open/closed), the table in front of the legs, and the cup.
// Nothing else moves except light and steam, so the background is never warped.
const W = 1920;
const H = 1080;
const IMG = (n: string) => staticFile(`camp-demo/scene/${n}.png`);

const Layer: React.FC<{ n: string; style?: React.CSSProperties }> = ({ n, style }) => {
  const l = LAYERS[n];
  return <Img src={IMG(n)} style={{ position: "absolute", left: l.x, top: l.y, width: l.w, height: l.h, ...style }} />;
};

// Draw an arm piece so that its bone starts at `from` and points along `angle` (radians).
const Bone: React.FC<{ n: string; from: V; angle: number }> = ({ n, from, angle }) => {
  const l = LAYERS[n];
  const [px, py] = l.pivot!;
  return (
    <Img
      src={IMG(n)}
      style={{ position: "absolute", left: from.x - px, top: from.y - py, width: l.w, height: l.h, transformOrigin: `${px}px ${py}px`, transform: `rotate(${((angle - l.srcAngle!) * 180) / Math.PI}deg)` }}
    />
  );
};

// Steam leaves the cup rim. Each puff keeps the rim position of the moment it was born, so a lifted cup drags its plume.
const Steam: React.FC<{ t: number }> = ({ t }) => {
  const N = 10;
  const LIFE = 3.4;
  return (
    <g style={{ mixBlendMode: "screen" }}>
      {Array.from({ length: N }, (_, i) => {
        const off = (i / N) * LIFE + random(`st${i}`) * 0.2;
        const tt = t + off;
        const born = tt - (tt % LIFE);
        const age = (tt - born) / LIFE;
        const tb = Math.max(0, t - age * LIFE);
        const c = cupAt(tb);
        const rim: V = { x: c.c.x + (random(`sx${i}${Math.floor(born)}`) - 0.5) * 26, y: c.c.y - 26 };
        const x = rim.x + Math.sin((age * LIFE) / 1.6 * Math.PI * 2 + i * 1.3) * (6 + age * 16) + age * 22;
        const y = rim.y - age * 150;
        const r = 7 + age * 20;
        const o = Math.sin(Math.PI * Math.min(1, age * 1.15)) * 0.34 * (1 - age * 0.35);
        return <circle key={i} cx={x} cy={y} r={r} fill="#fff0da" opacity={Math.max(0, o)} style={{ filter: `blur(${3 + age * 5}px)` }} />;
      })}
    </g>
  );
};

// The lake: the water pixels of the background cut into thin horizontal strips that slide sideways by a few px,
// each with its own phase, so the reflections shimmer the way real ripples do. Larger near the viewer, nothing outside the mask.
const BAND = 6;
const Water: React.FC<{ t: number }> = ({ t }) => {
  const bands = Math.ceil((WATER.bottom - WATER.top + 1) / BAND);
  return (
    <AbsoluteFill>
      {Array.from({ length: bands }, (_, i) => {
        const y = WATER.top + i * BAND;
        const depth = (y - WATER.top) / (WATER.bottom - WATER.top);
        const amp = 0.8 + 3.2 * depth;
        const dx = amp * (0.65 * Math.sin(y * 0.045 + t * 1.15) + 0.35 * Math.sin(y * 0.113 - t * 0.7 + 2));
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: y, width: W, height: BAND, overflow: "hidden" }}>
            <Img src={IMG("water")} style={{ position: "absolute", left: dx, top: -y, width: W, height: H }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Warm glow from the tent doorway breathes a little; two slow, unrelated waves so it never ticks.
const Glow: React.FC<{ t: number }> = ({ t }) => {
  const o = 0.2 + 0.035 * Math.sin((t / 5.3) * Math.PI * 2) + 0.02 * Math.sin((t / 1.9) * Math.PI * 2 + 1.1);
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse 420px 340px at 330px 560px, rgba(255,190,90,0.9) 0%, rgba(255,150,40,0) 100%)", opacity: o, mixBlendMode: "screen" }} />;
};

export const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const breath = Math.sin((t / 4.4) * Math.PI * 2 + 0.3);
  const body = LAYERS.body;
  const lift = -breath * 0.9; // the upper body rises a hair on the in-breath
  const S: V = { x: SHOULDER.x, y: SHOULDER.y + lift };

  const wrist = wristAt(t);
  const { elbow } = ik2(S, wrist, L1, L2, 1);
  const aUpper = Math.atan2(elbow.y - S.y, elbow.x - S.x);
  const aFore = Math.atan2(wrist.y - elbow.y, wrist.x - elbow.x);
  const closed = t >= T.close && t < T.open;
  const aHand = attached(t) ? HAND_A0 + (cupTilt(t) * Math.PI) / 180 : aFore; // holding: the fist turns with the cup, not with the forearm
  const { c: cupC, a: cupA } = cupAt(t);
  const rise = Math.max(0, TABLE_Y - (cupC.y + LAYERS.cup.h / 2));
  const k = Math.max(0.3, 1 - rise / 220);
  const blink = blinkAt(t) > 0.5;
  const cupL = LAYERS.cup;

  return (
    <AbsoluteFill style={{ background: "#0d1020" }}>
      <Img src={IMG("bg")} style={{ position: "absolute", width: W, height: H }} />
      <Water t={t} />
      {/* body: breathes from the hips; the head and the shoulder joint ride on the same lift */}
      <div style={{ position: "absolute", inset: 0, transformOrigin: `${body.x + body.w * 0.55}px ${body.y + body.h * 0.8}px`, transform: `scaleY(${1 + breath * 0.006})` }}>
        <Layer n="body" />
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${lift}px)` }}>
        <Layer n={blink ? "head_closed" : "head_open"} />
      </div>
      <Layer n="table" />
      {/* contact shadow: stays on the table and shrinks as the cup rises */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <ellipse cx={CUP_X(cupL)} cy={TABLE_Y + 2} rx={26 * k + 3} ry={4 * k + 1} fill="#000" opacity={0.35 * k} />
      </svg>
      <div style={{ position: "absolute", left: cupC.x - cupL.w / 2, top: cupC.y - cupL.h / 2, width: cupL.w, height: cupL.h, transformOrigin: "50% 50%", transform: `rotate(${cupA}deg)` }}>
        <Img src={IMG("cup")} style={{ width: "100%", height: "100%" }} />
      </div>
      {/* arm: upper arm, forearm, then the hand last so the fingers sit in front of the handle */}
      <Bone n="arm_upper" from={S} angle={aUpper} />
      <Bone n="arm_forearm" from={elbow} angle={aFore} />
      <Bone n={closed ? "hand_grip" : "hand_open"} from={wrist} angle={aHand} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <Steam t={t} />
      </svg>
      <Glow t={t} />
    </AbsoluteFill>
  );
};

const CUP_X = (c: { x: number; w: number }) => c.x + c.w / 2;
