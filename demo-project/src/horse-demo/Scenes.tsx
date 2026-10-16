import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Hero } from "../stickman/cast";
import { ArrowVolley } from "../stickman/weather";
import { P } from "../stickman/stick";
import type { PresetName } from "../stickman/cast";
import type { Pose } from "../stickman/stick";
import { Horse, rideGround } from "../stickman/horse";
import type { Saddle } from "../stickman/horse";
import { At, Lance, Sword } from "../stickman/props";
import { Burst, COL, FONT, SpeedLines } from "../stickman/fx";
import { Stage } from "../stickman/common";
import type { SceneProps } from "./Video";

const S = 0.95; // horse scale
const RS = 1.05; // rider scale
const RIDE: Partial<Pose> = { ll1: 75, ll2: -60, rl1: 88, rl2: -65, lean: 6, la1: 28, la2: 38 };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: FONT.title, fontWeight: 900, fontSize: 60, letterSpacing: 4, color: COL.ink }}>{children}</div>
);

const Rider: React.FC<{ f: number; sd: Saddle; who: PresetName; facing: 1 | -1; weapon: "lance" | "sword"; seed?: number }> = ({ f, sd, who, facing, weapon, seed = 0 }) => (
  <Hero
    f={f}
    who={who}
    x={sd.x}
    ground={rideGround(sd, RS)}
    scale={RS}
    facing={facing}
    seed={seed}
    stance={RIDE}
    emotion="angry"
    mod={(t, p) => ({ ...p, rot: p.rot + sd.tilt, ra1: weapon === "lance" ? 72 : 105 + Math.sin(t * 0.5) * 28, ra2: weapon === "lance" ? 0 : -25 })}
    held={(j) => (
      <At x={j.rHand[0]} y={j.rHand[1]} r={facing * (weapon === "lance" ? 78 : 35)}>
        {weapon === "lance" ? <Lance /> : <Sword />}
      </At>
    )}
  />
);

// one rider galloping across the screen
export const HorseGallop: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, dur], [150, 1750], clamp);
  return (
    <Stage
      svg={
        <>
          <SpeedLines f={f} from={0} to={dur} dir={-1} />
          <Horse f={f} x={x} ground={880} scale={S} cloth="#f2f2f2" trim={COL.red}>
            {(sd) => <Rider f={f} sd={sd} who="officer" facing={1} weapon="lance" />}
          </Horse>
        </>
      }
      html={<Title>GALLOP</Title>}
    />
  );
};

// two charging riders meet and rear up
export const HorseClash: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const ax = interpolate(f, [0, 70], [160, 660], clamp);
  const bx = interpolate(f, [0, 70], [1760, 1260], clamp);
  const amp = interpolate(f, [60, 80], [1, 0], clamp);
  const rear = interpolate(f, [66, 92], [0, 1], clamp);
  return (
    <Stage
      hits={[84]}
      power={20}
      svg={
        <>
          <Horse f={f} x={ax} ground={880} scale={S} amp={amp} rear={rear} cloth="#f2f2f2" trim={COL.red}>
            {(sd) => <Rider f={f} sd={sd} who="officer" facing={1} weapon="lance" />}
          </Horse>
          <Horse f={f + 5} x={bx} ground={880} scale={S} facing={-1} amp={amp} rear={rear} coat="#3a2a22" mane="#111" cloth="#2b4a8a" trim="#c9a227">
            {(sd) => <Rider f={f} sd={sd} who="villain" facing={-1} weapon="sword" seed={4} />}
          </Horse>
          <Burst x={960} y={630} at={84} f={f} size={240} />
        </>
      }
      html={<Title>CLASH</Title>}
    />
  );
};

// archers loosing a volley
export const ArrowRain: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  return (
    <Stage
      svg={
        <>
          {[0, 1, 2, 3].map((i) => (
            <Hero key={i} f={f} who="soldier" x={240 + i * 175} scale={1.1} seed={i} stance={P.pointR} emotion="angry" />
          ))}
          <ArrowVolley f={f} from={{ x: 880, y: 700 }} to={{ x: 1500, y: 820 }} />
        </>
      }
      html={<Title>ARROW VOLLEY</Title>}
    />
  );
};
