import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import CLIPS from "./clips.json"; // written by scripts/cook_clips.py: which sNN.mp4 clips exist
import { DURATION, FADE, FPS, SCENES, Scene, starts } from "./scenes";

export { DURATION };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (t: number) => t * t * (3 - 2 * t);

// Slow camera move on a still; panning scenes use 1.1x so no edge shows.
const camera = (cam: Scene["camera"], t: number) => {
  switch (cam) {
    case "zoom-in": return { s: 1.0 + 0.1 * t, x: 0 };
    case "zoom-out": return { s: 1.1 - 0.1 * t, x: 0 };
    case "pan-left": return { s: 1.1, x: 30 - 60 * t };
    case "pan-right": return { s: 1.1, x: -30 + 60 * t };
  }
};

// Soft blurred puffs rising from the lower middle of the picture.
const Steam: React.FC<{ seed: string }> = ({ seed }) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({ length: 9 }, (_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const life = 70 + r("l") * 40;
        const p = ((f + r("o") * life) % life) / life;
        const x = 280 + r("x") * 520 + Math.sin(p * 6 + r("s") * 6) * 40;
        const y = 1250 - p * 780;
        const size = 160 + p * 260;
        const a = Math.sin(p * Math.PI) * 0.26;
        return <div key={i} style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 68%)", filter: "blur(18px)", opacity: a }} />;
      })}
    </>
  );
};

// Tiny hot flecks that pop up from the pan and fall back.
const Sparks: React.FC<{ seed: string }> = ({ seed }) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({ length: 14 }, (_, i) => {
        const r = (k: string) => random(`${seed}-sp${i}-${k}`);
        const life = 24 + r("l") * 18;
        const p = ((f + r("o") * life) % life) / life;
        const x = 240 + r("x") * 600 + (r("d") - 0.5) * 120 * p;
        const y = 1150 - Math.sin(p * Math.PI) * (160 + r("h") * 240);
        const sz = 8 + r("z") * 8;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: sz, height: sz, borderRadius: "50%", background: "#ffe3a1", boxShadow: "0 0 14px 4px rgba(255,190,90,0.7)", opacity: Math.sin(p * Math.PI) * 0.8 }} />;
      })}
    </>
  );
};

// Blue gas-flame glow flickering at the bottom edge.
const Flame: React.FC = () => {
  const f = useCurrentFrame();
  const flick = 0.55 + 0.25 * Math.sin(f * 0.9) + 0.2 * Math.sin(f * 2.3 + 1);
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 22% at 50% 100%, rgba(90,160,255,0.75) 0%, rgba(90,160,255,0) 100%)", opacity: flick, mixBlendMode: "screen" }} />;
};

// Floating dust motes in the window light.
const Dust: React.FC<{ seed: string }> = ({ seed }) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({ length: 22 }, (_, i) => {
        const r = (k: string) => random(`${seed}-d${i}-${k}`);
        const x = r("x") * 1080 + Math.sin(f * 0.03 + r("p") * 6) * 30;
        const y = (r("y") * 1920 - f * (0.4 + r("v") * 0.8) + 1920) % 1920;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(f * 0.05 + r("t") * 6));
        const sz = 4 + r("z") * 6;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: sz, height: sz, borderRadius: "50%", background: "#fff4d0", opacity: 0.55 * tw, filter: "blur(1px)" }} />;
      })}
    </>
  );
};

// Warm breathing light from the upper left (the window).
const Light: React.FC = () => {
  const f = useCurrentFrame();
  const o = 0.28 + 0.07 * Math.sin(f * 0.07);
  return <AbsoluteFill style={{ background: "linear-gradient(115deg, rgba(255,214,140,0.9) 0%, rgba(255,214,140,0) 55%)", opacity: o, mixBlendMode: "soft-light" }} />;
};

const SceneView: React.FC<{ sc: Scene; idx: number; dur: number }> = ({ sc, idx, dur }) => {
  const f = useCurrentFrame();
  const t = ease(interpolate(f, [0, dur], [0, 1], clamp));
  const c = camera(sc.camera, t);
  // Later scenes sit on top of earlier ones, so a fade-in alone makes the crossfade.
  const o = idx === 0 ? 1 : interpolate(f, [0, FADE], [0, 1], clamp);
  const seed = `s${idx}`;
  const has = (k: string) => (sc.fx as string[]).includes(k);
  const id = sc.image.match(/s\d+/)![0];
  const clipLen = (CLIPS as Record<string, number>)[id];
  // A real clip carries its own motion: no camera move or overlay effects on top of it.
  if (clipLen) {
    return (
      <AbsoluteFill style={{ opacity: o, background: "#120d08" }}>
        <OffthreadVideo src={staticFile(`cook-ep01/clips/${id}.mp4`)} muted style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(20,10,0,0.45) 100%)" }} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ opacity: o, background: "#120d08" }}>
      <AbsoluteFill style={{ transform: `translateX(${c.x}px) scale(${c.s})`, transformOrigin: "50% 55%" }}>
        <Img src={staticFile(sc.image)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
        {has("light") && <Light />}
        {has("flame") && <Flame />}
        {has("steam") && <Steam seed={seed} />}
        {has("sparks") && <Sparks seed={seed} />}
        {has("dust") && <Dust seed={seed} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(20,10,0,0.45) 100%)" }} />
    </AbsoluteFill>
  );
};

export const Video: React.FC<{ sfx: number; music: number }> = ({ sfx }) => {
  const st = starts();
  return (
    <AbsoluteFill style={{ background: "#120d08" }}>
      {SCENES.map((sc, i) => (
        <Sequence key={i} from={st[i]} durationInFrames={Math.round(sc.sec * FPS)}>
          <SceneView sc={sc} idx={i} dur={Math.round(sc.sec * FPS)} />
          {sc.sfx.map((e, j) => (
            <Sequence key={j} from={Math.round(e.at * FPS)}>
              <Audio src={staticFile(`cook-ep01/sfx/${e.name}.wav`)} volume={e.name === "ambience" ? sfx * 0.6 : sfx} />
            </Sequence>
          ))}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
