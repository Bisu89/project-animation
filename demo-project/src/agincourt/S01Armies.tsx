import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Hero } from "../stickman/cast";
import { P } from "../stickman/stick";
import { COL, FONT, ease } from "../stickman/fx";
import type { SceneProps } from "./Video";
import { Banner } from "./Stills";
import { Backdrop } from "./Field";
import { EN_COMMANDER, FR_COMMANDER } from "./Roles";

const Fog: React.FC<{ y: number; h: number; o: number }> = ({ y, h, o }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, height: h, background: `linear-gradient(to bottom, rgba(245,240,230,0), rgba(245,240,230,${o}) 50%, rgba(245,240,230,0))` }} />
);

// each layer pushes in at its own rate, which is what sells the depth
const Layer: React.FC<{ f: number; dur: number; end: number; children: React.ReactNode }> = ({ f, dur, end, children }) => (
  <AbsoluteFill style={{ transform: `scale(${1 + (end - 1) * (f / dur)})`, transformOrigin: "960px 640px" }}>{children}</AbsoluteFill>
);

export const S01Armies: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#bcc8d8" }}>
      <Layer f={f} dur={dur} end={1.03}>
        <Backdrop id="s1" />
      </Layer>
      <Layer f={f} dur={dur} end={1.07}>
        <Img src={staticFile("agincourt/far.png")} />
      </Layer>
      <Layer f={f} dur={dur} end={1.07}>
        <Fog y={480} h={220} o={0.5} />
      </Layer>
      <Layer f={f} dur={dur} end={1.13}>
        <Img src={staticFile("agincourt/mid.png")} />
      </Layer>
      <Layer f={f} dur={dur} end={1.22}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
          <Hero
            f={f}
            who={EN_COMMANDER}
            x={300}
            ground={985}
            scale={0.8}
            facing={1}
            stance={P.pointR}
            mod={(t, p) => ({ ...p, ra1: p.ra1 + Math.sin(t * 0.07) * 6 })}
          />
          <Hero
            f={f}
            who={FR_COMMANDER}
            x={1620}
            ground={985}
            scale={0.8}
            facing={-1}
            seed={3}
            stance={P.pointR}
            mod={(t, p) => ({ ...p, ra1: p.ra1 + Math.sin(t * 0.07 + 1.5) * 6 })}
          />
          <g transform={`translate(540 985) rotate(${Math.sin(f * 0.08) * 2.5}) scale(1.6)`}>
            <Banner side="english" />
          </g>
          <g transform={`translate(1380 985) rotate(${Math.sin(f * 0.08 + 2) * 2.5}) scale(-1.6 1.6)`}>
            <Banner side="french" />
          </g>
        </svg>
      </Layer>
      <div style={{ position: "absolute", left: 0, right: 0, top: 56, textAlign: "center", fontFamily: FONT.title, fontWeight: 800, fontSize: 50, letterSpacing: 6, color: COL.ink, opacity: ease(f, 12, 30) * (1 - ease(f, dur - 30, dur - 10)) }}>
        AGINCOURT · 25 OCTOBER 1415
      </div>
    </AbsoluteFill>
  );
};
