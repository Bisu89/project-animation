import React from "react";
import { useCurrentFrame } from "remotion";
import { Actor, STAND, groundY, headAngle } from "../stickman/stick";
import type { Pose } from "../stickman/stick";
import { SpiderHead } from "../stickman/spiderman";
import { Skyline, WebLine } from "../stickman/props";
import { COL, FONT } from "../stickman/fx";
import { Stage } from "../stickman/common";
import type { SceneProps } from "./Video";
import type { SfxCue } from "./sfx";

// Web-swinging between buildings: SpiderHead (spiderman.tsx) on a fully custom flight path
// (not the ground-based Hero/moves system) — the hip position is a hand-written pendulum arc
// under each web anchor, chained with short ballistic hops while a new web "shoots" out.

export const S01_SFX: SfxCue[] = [
  [6, "whoosh", 0.5],
  [40, "swish", 0.6],
  [106, "whoosh", 0.7],
  [138, "swish", 0.6],
  [206, "whoosh", 0.4],
];

const SCALE = 1.6;

// rooftop surface y (where the feet land) for the start/end ledges — buildings below are
// drawn with their top edge at these same y's, and groundY() converts "feet on this surface"
// to the hip y the pose system actually animates.
const LEDGE_Y = 620;
const LANDING_Y = 560;
const LEDGE = { x: 130, y: groundY(SCALE, LEDGE_Y) };
const LANDING = { x: 1800, y: groundY(SCALE, LANDING_Y) };
const ANCHORS = [
  { x: 620, y: 150 },
  { x: 1320, y: 120 },
];
const L = 400; // web "rope" length
const SWEEP = 58; // degrees each side of straight-down

const LEAD = 26; // jump off the ledge into swing 1
const SWING = 80; // one pendulum arc
const GAP = 16; // freefall + new web shot between arcs
const TAIL = 30; // descend onto the far ledge
const HOLD = 26; // settle in a landed crouch

const t0 = LEAD;
const t1 = t0 + SWING;
const t2 = t1 + GAP;
const t3 = t2 + SWING;
const t4 = t3 + TAIL;
export const DURATION = t4 + HOLD;

const ease = (k: number) => (1 - Math.cos(Math.min(1, Math.max(0, k)) * Math.PI)) / 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rad = (d: number) => (d * Math.PI) / 180;

const pendulum = (anchor: { x: number; y: number }, angleDeg: number) => ({
  x: anchor.x + L * Math.sin(rad(angleDeg)),
  y: anchor.y + L * Math.cos(rad(angleDeg)),
});

type Flight = { pos: { x: number; y: number }; angle: number; line: null | { target: { x: number; y: number }; t: number } };

// one continuous function of the frame: position + pose angle + web-line state, with no pops
// between swinging / freefalling / landing (each phase starts exactly where the last ends).
const flightAt = (f: number): Flight => {
  if (f < t0) {
    const k = f / LEAD;
    const start = pendulum(ANCHORS[0], -SWEEP);
    const e = ease(k);
    return {
      pos: { x: lerp(LEDGE.x, start.x, e), y: lerp(LEDGE.y, start.y, e) - Math.sin(e * Math.PI) * 75 },
      angle: lerp(0, -SWEEP, e),
      line: { target: ANCHORS[0], t: Math.max(0, (k - 0.4) / 0.6) },
    };
  }
  if (f < t1) {
    const k = (f - t0) / SWING;
    const angle = SWEEP * Math.sin(Math.PI * (k - 0.5));
    return { pos: pendulum(ANCHORS[0], angle), angle, line: { target: ANCHORS[0], t: 1 } };
  }
  if (f < t2) {
    const k = (f - t1) / GAP;
    const e = ease(k);
    const end0 = pendulum(ANCHORS[0], SWEEP);
    const start1 = pendulum(ANCHORS[1], -SWEEP);
    return {
      pos: { x: lerp(end0.x, start1.x, e), y: lerp(end0.y, start1.y, e) - Math.sin(e * Math.PI) * 30 },
      angle: lerp(SWEEP, -SWEEP, e),
      line: { target: ANCHORS[1], t: e },
    };
  }
  if (f < t3) {
    const k = (f - t2) / SWING;
    const angle = SWEEP * Math.sin(Math.PI * (k - 0.5));
    return { pos: pendulum(ANCHORS[1], angle), angle, line: { target: ANCHORS[1], t: 1 } };
  }
  if (f < t4) {
    const k = (f - t3) / TAIL;
    const end1 = pendulum(ANCHORS[1], SWEEP);
    return { pos: { x: lerp(end1.x, LANDING.x, ease(k)), y: lerp(end1.y, LANDING.y, ease(k)) }, angle: lerp(SWEEP, 0, ease(k)), line: null };
  }
  return { pos: LANDING, angle: 0, line: null };
};

// the web-hand arm must point at the anchor, which is always "up" but swings from up-right to
// up-left as the body passes under it — lean is subtracted back out so ra1 (torso-relative)
// lands on the correct absolute screen direction (angle + 180, dir()'s down=0/right=90 convention).
const poseFromAngle = (angle: number): Pose => {
  const lean = angle * 0.32;
  return {
    ...STAND,
    lean,
    head: -8 + angle * 0.05,
    ra1: angle + 180 + lean,
    ra2: 14,
    la1: 125 - angle * 0.3,
    la2: -15,
    ll1: -55 + angle * 0.22,
    ll2: 55,
    rl1: -32 + angle * 0.22,
    rl2: 38,
    rot: 0,
  };
};

const SpideyFlight: React.FC<{ f: number }> = ({ f }) => {
  const { line } = flightAt(f);
  const landed = f >= t4;
  const emotion = line && line.t < 0.3 ? "shock" : landed ? "happy" : "neutral";
  return (
    <Actor
      f={f}
      headless
      color={COL.ink}
      scale={SCALE}
      base={STAND}
      keys={[{ f: 0, p: {} }]}
      facing={1}
      mod={(t) => {
        const fl = flightAt(t);
        return { ...poseFromAngle(fl.angle), x: fl.pos.x, y: fl.pos.y };
      }}
    >
      {(j) => {
        const burst = line && line.t > 0 && line.t < 0.15;
        return (
          <>
            {line && (
              <>
                <WebLine
                  x1={j.rHand[0]}
                  y1={j.rHand[1]}
                  x2={lerp(j.rHand[0], line.target.x, line.t)}
                  y2={lerp(j.rHand[1], line.target.y, line.t)}
                  opacity={Math.min(1, line.t * 4)}
                />
                {burst && (
                  <g stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={1 - line.t / 0.15}>
                    {[0, 1, 2, 3, 4].map((i) => {
                      const a = (i / 5) * Math.PI * 2;
                      return (
                        <line
                          key={i}
                          x1={j.rHand[0]}
                          y1={j.rHand[1]}
                          x2={j.rHand[0] + Math.cos(a) * 22}
                          y2={j.rHand[1] + Math.sin(a) * 22}
                        />
                      );
                    })}
                  </g>
                )}
              </>
            )}
            <SpiderHead x={j.headC[0]} y={j.headC[1]} angle={headAngle(j)} facing={1} r={55 * SCALE} emotion={emotion} blink={f % 90 < 4} />
          </>
        );
      }}
    </Actor>
  );
};

// hand-placed foreground buildings: unlike the random Skyline (pure backdrop), these line up
// with LEDGE/LANDING so he visibly starts and lands on a rooftop edge, and a couple of tall
// ones sit under the swing arcs so he reads as passing between towers, not just floating.
const NEAR: { x: number; w: number; topY: number }[] = [
  { x: -20, w: 300, topY: LEDGE_Y }, // start ledge
  { x: 310, w: 170, topY: 520 },
  { x: 540, w: 210, topY: 790 },
  { x: 800, w: 190, topY: 470 },
  { x: 1040, w: 230, topY: 600 },
  { x: 1310, w: 190, topY: 800 },
  { x: 1540, w: 210, topY: 490 },
  { x: 1780, w: 320, topY: LANDING_Y }, // landing ledge
];

const Building: React.FC<{ x: number; w: number; topY: number; seed: number }> = ({ x, w, topY, seed }) => {
  const h = 1080 - topY + 40;
  const rnd = (i: number) => {
    const v = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
    return v - Math.floor(v);
  };
  const cols = Math.max(1, Math.floor(w / 34));
  const rows = Math.max(1, Math.floor((h - 40) / 40));
  return (
    <g>
      <rect x={x} y={topY} width={w} height={h} fill="#262b36" />
      {Array.from({ length: cols * rows }).map((_, k) => {
        if (rnd(k) > 0.4) return null;
        const c = k % cols;
        const r = Math.floor(k / cols);
        return <rect key={k} x={x + 14 + c * (w / cols)} y={topY + 18 + r * 40} width={9} height={13} fill="#f2c96d" opacity={0.5 + rnd(k + 9) * 0.4} />;
      })}
    </g>
  );
};

const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 44, textAlign: "center", fontFamily: FONT.title, fontWeight: 900, fontSize: 56, letterSpacing: 3, color: "#fff" }}>
    {children}
  </div>
);

export const S01WebSwing: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  return (
    <Stage
      bg={
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#5a7fb0 0%, #cfe0ee 55%, #e9d9b8 100%)" }} />
      }
      svg={
        <>
          <Skyline seed={1} tint="#8fa0bd" count={14} minH={160} maxH={420} />
          {NEAR.map((b, i) => (
            <Building key={i} {...b} seed={i} />
          ))}
          <SpideyFlight f={f} />
        </>
      }
      html={<Title>WEB-SWINGING BETWEEN BUILDINGS</Title>}
    />
  );
};
