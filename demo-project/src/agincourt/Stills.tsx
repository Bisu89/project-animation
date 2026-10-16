import React from "react";
import { AbsoluteFill } from "remotion";
import { Formation, Soldier, Stakes } from "../stickman/crowd";
import { Horse } from "../stickman/horse";
import { At } from "../stickman/props";
import { COL } from "../stickman/fx";

// Rendered ONCE to PNG (npx remotion still AgincourtFar / AgincourtMid) and used as parallax layers,
// so the thousand-strong armies cost nothing per frame.
export const ENG = "#c0392b"; // English tabard (St George's red, simplified)
export const FR = "#2b4a8a"; // French tabard (blue)
export const GOLD = "#c9a227";


// pole + heraldic flag (English: red cross on white; French: gold marks on blue), base at (0,0)
export const Banner: React.FC<{ side: "english" | "french" }> = ({ side }) => (
  <g>
    <line x1={0} y1={0} x2={0} y2={-150} stroke={COL.ink} strokeWidth={6} strokeLinecap="round" />
    {side === "english" ? (
      <>
        <rect x={0} y={-150} width={96} height={66} fill="#f6f2e8" stroke={COL.ink} strokeWidth={4} />
        <rect x={40} y={-150} width={16} height={66} fill={ENG} />
        <rect x={0} y={-124} width={96} height={16} fill={ENG} />
      </>
    ) : (
      <>
        <rect x={0} y={-150} width={96} height={66} fill={FR} stroke={COL.ink} strokeWidth={4} />
        {[24, 48, 72].map((x) => (
          <polygon key={x} points={`${x},-136 ${x + 8},-124 ${x},-100 ${x - 8},-124`} fill={GOLD} />
        ))}
      </>
    )}
  </g>
);

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      {children}
    </svg>
  </AbsoluteFill>
);

// distant armies: dense small silhouettes
export const FarLayer: React.FC = () => (
  <Frame>
    <Formation x={470} y={650} cols={26} rows={11} dx={26} dy={9} s={0.2} falloff={0.97} facing={1} mix={{ bow: 5, spear: 3, sword: 1 }} patch={ENG} seed="ef" />
    <Formation x={1450} y={650} cols={32} rows={13} dx={21} dy={8.5} s={0.2} falloff={0.97} facing={-1} mix={{ spear: 6, sword: 2, bow: 1 }} patch={FR} plume={GOLD} seed="ff" />
  </Frame>
);

// middle ground: distinguishable ranks, banners, stakes, a few mounted knights
export const MidLayer: React.FC = () => (
  <Frame>
    <Formation x={480} y={860} cols={10} rows={4} dx={66} dy={30} s={0.58} falloff={0.95} facing={1} mix={{ bow: 6, spear: 3, sword: 1 }} patch={ENG} seed="em" />
    <Stakes x={850} y={850} n={6} dx={14} dy={-9} s={0.62} lean={1} seed="s1" />
    <Stakes x={875} y={824} n={6} dx={14} dy={-9} s={0.62} lean={1} seed="s2" />
    <At x={640} y={850} s={1}>
      <Banner side="english" />
    </At>
    <Formation x={1440} y={860} cols={13} rows={5} dx={62} dy={30} s={0.58} falloff={0.95} facing={-1} mix={{ spear: 6, sword: 3, bow: 1 }} patch={FR} plume={GOLD} seed="fm" />
    <At x={1180} y={850} s={1}>
      <Banner side="french" />
    </At>
    {[0, 1, 2, 3].map((i) => (
      <Horse key={i} f={0} x={1690 + i * 55} ground={770 + (i % 2) * 20} scale={0.36} facing={-1} amp={0} coat={i % 2 ? "#e8e4da" : "#6a4a2a"} cloth={FR} trim={GOLD}>
        {(sd) => <Soldier x={sd.x} y={sd.y + 8} s={0.46} facing={-1} gear="spear" patch={FR} plume={GOLD} mounted />}
      </Horse>
    ))}
  </Frame>
);
