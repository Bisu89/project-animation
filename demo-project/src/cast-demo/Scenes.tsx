import React from "react";
import { useCurrentFrame } from "remotion";
import { Hero } from "../stickman/cast";
import type { PresetName } from "../stickman/cast";
import type { Emotion } from "../stickman/bighead";
import { bow, fall, punch, walkTo, wave } from "../stickman/moves";
import { Fire, FallingLeaves, Rain, Sparks, Water } from "../stickman/weather";
import { COL, FONT, Paper } from "../stickman/fx";
import { Stage } from "../stickman/common";
import type { SceneProps } from "./Video";

const Title: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = COL.ink }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: FONT.title, fontWeight: 900, fontSize: 64, letterSpacing: 4, color }}>
    {children}
  </div>
);

const Name: React.FC<{ x: number; y: number; children: string }> = ({ x, y, children }) => (
  <div style={{ position: "absolute", left: x - 100, width: 200, top: y, textAlign: "center", fontFamily: FONT.title, fontWeight: 800, fontSize: 30, color: COL.ink, textTransform: "uppercase" }}>
    {children}
  </div>
);

const ROW1: PresetName[] = ["hero", "samurai", "ronin", "monk", "soldier", "officer", "villain"];
const ROW2: PresetName[] = ["grandma", "kid", "punk", "hippie", "lady", "athlete"];

// 1. every preset in a lineup
export const CastLineup: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const place = (names: PresetName[], ground: number, x0: number, step: number) =>
    names.map((n, i) => (
      <Hero key={n} f={f} who={n} x={x0 + i * step} ground={ground} scale={0.95} seed={i + ground} emotion={n === "villain" ? "angry" : i % 3 === 1 ? "happy" : "neutral"} />
    ));
  return (
    <Stage
      svg={
        <>
          {place(ROW1, 470, 230, 242)}
          {place(ROW2, 860, 340, 248)}
        </>
      }
      html={
        <>
          <Title>13 READY-MADE CHARACTERS</Title>
          {ROW1.map((n, i) => (
            <Name key={n} x={230 + i * 242} y={490}>
              {n}
            </Name>
          ))}
          {ROW2.map((n, i) => (
            <Name key={n} x={340 + i * 248} y={880}>
              {n}
            </Name>
          ))}
        </>
      }
    />
  );
};

const FACES: Emotion[] = ["neutral", "happy", "sad", "cry", "angry", "shock", "worried", "smug"];

// 2. one face cycling through every emotion
export const CastFaces: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const i = Math.floor(f / 22) % FACES.length;
  return (
    <Stage
      svg={<Hero f={f} who="hero" x={960} ground={900} scale={2.6} emotion={FACES[i]} talking={FACES[i] === "happy" || FACES[i] === "smug"} />}
      html={
        <>
          <Title>8 EMOTIONS</Title>
          <div style={{ position: "absolute", left: 0, right: 0, top: 930, textAlign: "center", fontFamily: FONT.comic, fontSize: 80, color: COL.orange, textTransform: "uppercase" }}>{FACES[i]}</div>
        </>
      }
    />
  );
};

// 3. named moves chained on two characters
export const CastMoves: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  return (
    <Stage
      svg={
        <>
          <Hero f={f} who="samurai" x={420} scale={1.5} emotion="neutral" moves={[walkTo(0, 50, 760), bow(56), punch(108), wave(142, 34)]} />
          <Hero f={f} who="soldier" x={1500} scale={1.5} facing={-1} seed={3} emotion={(t) => (t > 118 ? "shock" : "neutral")} moves={[walkTo(0, 50, 1100), bow(56), fall(120)]} />
        </>
      }
      html={<Title>NAMED MOVES: WALK, BOW, PUNCH, FALL, WAVE</Title>}
    />
  );
};

// 4. rain
export const CastRain: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  return (
    <Stage
      bg={<Paper tint="#c9d3dd" />}
      svg={
        <>
          <Hero f={f} who="grandma" x={500} scale={1.5} emotion="sad" moves={[walkTo(0, 85, 1300)]} />
          <Rain f={f} ground={852} />
        </>
      }
      html={<Title>RAIN</Title>}
    />
  );
};

// 5. falling leaves
export const CastLeaves: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  return (
    <Stage
      bg={<Paper tint="#f3e7cf" />}
      svg={
        <>
          <Hero f={f} who="monk" x={960} scale={1.5} emotion="happy" moves={[wave(8, 70)]} />
          <FallingLeaves f={f} count={26} />
        </>
      }
      html={<Title>FALLING LEAVES</Title>}
    />
  );
};

// 6. flowing water
export const CastWater: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  return (
    <Stage
      svg={
        <>
          <Hero f={f} who="kid" x={400} scale={1.6} emotion="happy" talking moves={[walkTo(0, 85, 1500)]} />
          <Water f={f} />
        </>
      }
      html={<Title>FLOWING WATER</Title>}
    />
  );
};

// 7b. new preset: the spiderman mask head (body still a plain stick for now)
const SPIDEY_FACES: Emotion[] = ["neutral", "shock", "angry", "happy"];

export const CastSpiderman: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const i = Math.floor(f / 36) % SPIDEY_FACES.length;
  return (
    <Stage
      svg={
        <>
          <Hero f={f} who="spiderman" x={560} scale={2.2} emotion={SPIDEY_FACES[i]} />
          <Hero f={f} who="spiderman" x={1420} scale={1.6} facing={-1} seed={2} moves={[walkTo(0, 40, 300), punch(90), wave(130, 40)]} />
        </>
      }
      html={
        <>
          <Title>NEW PRESET: SPIDER-MAN MASK</Title>
          <div style={{ position: "absolute", left: 0, right: 0, top: 930, textAlign: "center", fontFamily: FONT.comic, fontSize: 70, color: COL.red, textTransform: "uppercase" }}>
            {SPIDEY_FACES[i]}
          </div>
        </>
      }
    />
  );
};

// 7. campfire with sparks
export const CastFire: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  return (
    <Stage
      bg={<Paper tint="#8fa3c4" />}
      svg={
        <>
          <Hero f={f} who="ronin" x={560} scale={1.5} emotion="neutral" />
          <Hero f={f} who="lady" x={1360} scale={1.5} facing={-1} seed={5} emotion="smug" />
          <Fire f={f} x={960} y={850} s={2.2} />
          <Sparks f={f} x={960} y={790} size={1.6} />
        </>
      }
      html={<Title color="#fff">FIRE + SPARKS</Title>}
    />
  );
};
