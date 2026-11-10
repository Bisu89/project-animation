import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { INK, Pt, STANDING, Stick } from "../stick-couple/Stick";

// Style test (option A): GPT background + code-drawn stick survivor (yellow raincoat, backpack) walking, rain, slow push-in.
const S = 0.42;
const GROUND = 1010;
const HIP = GROUND - STANDING.feet[1][1] * S;
const walkFeet = (ph: number): [Pt, Pt] => [
  [-22 + Math.sin(ph) * 45, STANDING.feet[0][1] - Math.max(0, Math.cos(ph)) * 22],
  [26 - Math.sin(ph) * 45, STANDING.feet[1][1] - Math.max(0, -Math.cos(ph)) * 22],
];
export const StyleTest: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const walking = t < 2.6;
  const ph = t * 7;
  const x = 620 + Math.min(t, 2.6) * 150;
  const z = 1 + t * 0.025;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "55% 60%" }}>
        <Img src={staticFile("survival-logs/test-nen.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          <ellipse cx={x} cy={GROUND + 4} rx={60} ry={10} fill="#000" opacity={0.35} />
          <g>
            <Stick
              x={x}
              hip={HIP + (walking ? Math.abs(Math.cos(ph)) * -3 : 0)}
              dir={1}
              scale={S}
              hair="none"
              pose={{
                near: walking ? [30 + Math.sin(ph) * 35, -20] : [70, -150],
                far: walking ? [20 - Math.sin(ph) * 35, -20] : [60, -140],
                feet: walking ? walkFeet(ph) : STANDING.feet,
                lean: walking ? 6 : 0,
              }}
              look={{ emo: walking ? "nervous" : "shock", gaze: walking ? [0.9, 0] : [1, -0.2], sweat: 1, t }}
              headExtras={
                // raincoat hood
                <path d="M-125,40 Q-150,-150 0,-150 Q150,-150 130,-10 Q110,-90 0,-95 Q-100,-90 -110,60 Z" fill="#f2c230" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
              }
            />
            <g transform={`translate(${x} ${HIP}) scale(${S})`}>
              {/* raincoat body + backpack (drawn over the torso) */}
              <rect x={-150} y={-240} width={80} height={150} rx={20} fill="#4a4436" stroke={INK} strokeWidth={8} />
              <path d="M-62,-255 Q0,-272 62,-255 L92,-40 Q0,-24 -92,-40 Z" fill="#f2c230" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
              <rect x={20} y={-140} width={40} height={30} rx={6} fill="#d9a51c" stroke={INK} strokeWidth={5} />
            </g>
          </g>
          {Array.from({ length: 140 }, (_, i) => {
            const sx = (i * 137) % 1920;
            const y = ((t * 1900 + i * 211) % 1180) - 100;
            return <line key={i} x1={sx - y * 0.08} y1={y} x2={sx - y * 0.08 - 6} y2={y + 34} stroke="#cfe0f2" strokeWidth={2.5} opacity={0.35} />;
          })}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
