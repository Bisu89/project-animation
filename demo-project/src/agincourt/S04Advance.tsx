import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Hero } from "../stickman/cast";
import { Soldier, Formation, Stakes } from "../stickman/crowd";
import type { Gear } from "../stickman/crowd";
import { Rain } from "../stickman/weather";
import { walkCycle } from "../stickman/stick";
import { At, Sword } from "../stickman/props";
import { COL, FONT, ease } from "../stickman/fx";
import { FR, GOLD, ENG } from "./Stills";
import { Backdrop, MudPatch } from "./Field";
import { FR_MAA } from "./Roles";
import type { SceneProps } from "./Video";

// --- the advance, simulated once: French ranks (front = index 0) walk left toward the English line;
// ground left of MUD_X is mud (speed x SLOW); a rank can never overlap the one in front of it. The
// front ranks therefore slow first while the rear keeps coming, and the ranks visibly bunch up.
const RANKS = 8;
const V0 = 2.6; // px/frame on firm ground
const SLOW = 0.22; // speed factor in mud
const MUD_X = 1080;
const MIN_GAP = 64;
const FRAMES = 340;
const START = Array.from({ length: RANKS }, (_, r) => 1230 + r * 135);

const SIM: number[][] = (() => {
  const out: number[][] = [START.slice()];
  for (let t = 1; t < FRAMES; t++) {
    const prev = out[t - 1];
    const next: number[] = [];
    for (let r = 0; r < RANKS; r++) {
      let x = prev[r] - (prev[r] < MUD_X ? V0 * SLOW : V0);
      if (r > 0) x = Math.max(x, next[r - 1] + MIN_GAP);
      next.push(x);
    }
    out.push(next);
  }
  return out;
})();
const at = (f: number) => SIM[Math.max(0, Math.min(FRAMES - 1, f))];
const jit = (a: number, b: number) => Math.sin(a * 12.9898 + b * 78.233) * 9;

// back lanes first; lane 0 is the near lane, drawn with live Heroes, the rest are cheap Soldiers
const LANES = [
  { y: 762, s: 0.78 },
  { y: 790, s: 0.88 },
  { y: 822, s: 1.0 },
  { y: 858, s: 1.12 },
];
const GEAR: Gear[] = ["spear", "sword", "spear", "sword", "spear"];

export const S04Advance: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const pos = at(f);
  const prev = at(Math.max(0, f - 1));

  return (
    <AbsoluteFill style={{ background: "#8f979e" }}>
      <Backdrop id="s4" overcast mud />
      <AbsoluteFill style={{ opacity: 0.85 }}>
        <Img src={staticFile("agincourt/far.png")} />
      </AbsoluteFill>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
        <MudPatch x0={560} x1={1180} />

        {/* the English line waiting behind its stakes */}
        <Formation x={250} y={868} cols={6} rows={3} dx={70} dy={34} s={1.0} falloff={0.95} facing={1} mix={{ bow: 5, sword: 2, spear: 1 }} patch={ENG} seed="adv-en" />
        <Stakes x={560} y={752} n={5} dx={0} dy={34} s={1.1} lean={1} seed="adv-st" />

        {/* French soldier lanes (far to near) */}
        {LANES.map((ln, li) =>
          pos.map((x, r) => {
            const mudness = Math.max(0, Math.min(1, (MUD_X + 80 - x) / 160));
            const moving = Math.max(0, Math.min(1, (prev[r] - x) / V0));
            const d = START[r] - x;
            const bob = -Math.abs(Math.sin(d * 0.09)) * 3 * (0.4 + 0.6 * moving);
            return (
              <Soldier
                key={`${li}-${r}`}
                x={x + jit(li, r)}
                y={ln.y + bob + mudness * 4}
                s={ln.s}
                facing={-1}
                gear={GEAR[(li + r) % GEAR.length]}
                patch={FR}
                plume={(li * 3 + r) % 5 === 0 ? GOLD : undefined}
              />
            );
          }),
        )}

        {/* near lane: live men-at-arms whose steps follow the ground actually covered */}
        {pos.map((x, r) => {
          const moving = Math.max(0, Math.min(1, (prev[r] - x) / V0));
          const d = START[r] - x;
          const w = walkCycle(d, 0.09);
          const k = 0.35 + 0.65 * moving;
          return (
            <Hero
              key={`h${r}`}
              f={f}
              who={FR_MAA}
              x={x + jit(9, r)}
              ground={890}
              scale={0.64}
              facing={-1}
              seed={r}
              mod={(t, p) => ({
                ...p,
                ll1: (w.ll1 ?? 0) * k,
                ll2: (w.ll2 ?? 0) * k,
                rl1: (w.rl1 ?? 0) * k,
                rl2: (w.rl2 ?? 0) * k,
                lean: 6 + (1 - moving) * 8,
                ra1: 55,
                ra2: 0,
                la1: -12,
              })}
              held={(j) => (
                <At x={j.rHand[0]} y={j.rHand[1]} s={0.7} r={-35}>
                  <Sword />
                </At>
              )}
            />
          );
        })}

        <Rain f={f} count={70} angle={14} ground={960} opacity={0.35} />

        {/* overhead view: ranks compress as the front slows in the mud */}
        <g transform="translate(1490 150)">
          <rect x={0} y={0} width={380} height={190} rx={10} fill="rgba(236,227,203,0.93)" stroke={COL.ink} strokeWidth={3} />
          <text x={190} y={30} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={22} letterSpacing={2} fill={COL.ink}>
            THE ADVANCE, FROM ABOVE
          </text>
          <rect x={20} y={46} width={(MUD_X - 560) * 0.3} height={96} fill="#6f5a34" opacity={0.75} />
          <text x={20 + ((MUD_X - 560) * 0.3) / 2} y={160} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={18} fill={COL.ink}>
            MUD
          </text>
          {pos.map((x, r) => {
            const bx = 20 + (x - 560) * 0.3;
            return <rect key={r} x={bx - 4} y={52} width={8} height={84} rx={2} fill={FR} stroke={COL.ink} strokeWidth={1.5} />;
          })}
          <text x={364} y={160} textAnchor="end" fontFamily={FONT.title} fontWeight={700} fontSize={18} fill={COL.ink}>
            REAR RANKS PRESS ON
          </text>
          <path d="M350,94 L318,94" stroke={COL.ink} strokeWidth={3} markerEnd="url(#adv-arrow)" />
          <defs>
            <marker id="adv-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L7,4 L0,8 Z" fill={COL.ink} />
            </marker>
          </defs>
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 70,
          textAlign: "center",
          fontFamily: FONT.title,
          fontWeight: 800,
          fontSize: 44,
          letterSpacing: 4,
          color: "#fff",
          textShadow: "0 2px 8px rgba(0,0,0,0.6)",
          opacity: ease(f, 6, 24),
        }}
      >
        MUD AND A NARROWING FRONT
      </div>
    </AbsoluteFill>
  );
};

