import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Hero } from "../stickman/cast";
import { ArrowVolley } from "../stickman/weather";
import { At, Bow } from "../stickman/props";
import { COL, FONT, ease } from "../stickman/fx";
import { Backdrop } from "./Field";
import { EN_ARCHER } from "./Roles";
import type { SceneProps } from "./Video";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CYCLE = 100; // frames per draw-loose-recover cycle
const RELEASE = 62; // frame of the cycle where the string is loosed
const BOW_TILT = -18; // top of the bow leans back a little: they are shooting high

// back row first so the front row draws on top; `off` staggers each archer so the line ripples
const ARCHERS = [
  { x: 420, g: 858, s: 0.82, off: 11 },
  { x: 660, g: 858, s: 0.82, off: 2 },
  { x: 900, g: 858, s: 0.82, off: 9 },
  { x: 300, g: 902, s: 0.95, off: 0 },
  { x: 540, g: 902, s: 0.95, off: 7 },
  { x: 780, g: 902, s: 0.95, off: 3 },
];

// ready -> raise bow -> draw -> hold -> loose -> recover, as absolute arm angles (bow arm = right, string arm = left)
const drawPose = (c: number) => ({
  ra1: interpolate(c, [0, 18, 34, 62, 78, 100], [30, 30, 88, 88, 80, 30], clamp),
  la1: interpolate(c, [0, 18, 34, 56, 62, 66, 78, 100], [-12, -12, -25, -95, -95, -60, -25, -12], clamp),
  la2: interpolate(c, [0, 34, 56, 62, 66, 78, 100], [10, 10, -125, -125, -40, 10, 10], clamp),
  lean: interpolate(c, [0, 34, 56, 62, 78, 100], [0, 0, -5, -5, -1, 0], clamp),
});

export const S03Volley: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const push = 1 + 0.05 * (f / dur);

  return (
    <AbsoluteFill style={{ background: "#bcc8d8" }}>
      <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "960px 700px" }}>
        <Backdrop id="s3" />
        <AbsoluteFill>
          <Img src={staticFile("agincourt/far.png")} />
        </AbsoluteFill>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
          {ARCHERS.map((a, i) => {
            const c = f < a.off ? 0 : (f - a.off) % CYCLE;
            const bs = a.s * 0.85;
            return (
              <Hero
                key={i}
                f={f}
                who={EN_ARCHER}
                x={a.x}
                ground={a.g}
                scale={a.s}
                seed={i}
                mod={(t, p) => ({ ...p, ...drawPose(c) })}
                held={(j) => {
                  const [gx, gy] = j.rHand;
                  const dx = j.lHand[0] - gx;
                  const dy = j.lHand[1] - gy;
                  const r = (BOW_TILT * Math.PI) / 180;
                  const drawing = c >= 36 && c < RELEASE;
                  const pull: [number, number] | undefined = drawing
                    ? [(dx * Math.cos(r) + dy * Math.sin(r)) / bs, (-dx * Math.sin(r) + dy * Math.cos(r)) / bs]
                    : undefined;
                  return (
                    <At x={gx} y={gy} s={bs} r={BOW_TILT}>
                      <Bow pull={pull} color="#6b4a24" />
                    </At>
                  );
                }}
              />
            );
          })}
          {ARCHERS.map((a, i) =>
            [0, 1, 2].map((k) => {
              const at = a.off + k * CYCLE + RELEASE;
              if (at >= dur) return null;
              return (
                <ArrowVolley
                  key={`${i}-${k}`}
                  f={f}
                  at={at}
                  from={{ x: a.x + 80 * a.s, y: a.g - 150 * a.s }}
                  to={{ x: 1450 + (i - 3) * 22, y: 690 }}
                  seed={`a${i}-${k}`}
                  count={5}
                  stagger={4}
                  life={48}
                  arc={230}
                  spread={120}
                  color={COL.ink}
                />
              );
            }),
          )}
        </svg>
      </AbsoluteFill>
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
          color: COL.ink,
          opacity: ease(f, 6, 24),
        }}
      >
        THE LONGBOWMEN LOOSE
      </div>
    </AbsoluteFill>
  );
};
