import React from "react";
import { COL, FONT } from "./fx";
import type { Emotion } from "./bighead";

// Full-coverage superhero mask (red + black web, big white lenses) as an alternative to
// BigHead's face. Drop-in for the same slot — same x/y/angle/facing/r/emotion/blink/label
// shape as BigHead, minus skin/hair/talk (nothing shows under the mask):
//   <Actor headless f={f} ...>{(j) => <SpiderHead x={j.headC[0]} y={j.headC[1]} angle={headAngle(j)} emotion="angry" />}</Actor>
// cast.tsx's Hero renders this instead of BigHead when a preset sets `mask: "spiderman"`.

const EYE: Record<Emotion, { sx: number; sy: number; rot: number }> = {
  neutral: { sx: 1, sy: 1, rot: 0 },
  happy: { sx: 0.95, sy: 0.8, rot: -6 },
  sad: { sx: 0.85, sy: 0.75, rot: 14 },
  angry: { sx: 0.8, sy: 0.7, rot: -24 },
  shock: { sx: 1.3, sy: 1.3, rot: 0 },
  worried: { sx: 0.85, sy: 0.8, rot: 10 },
  cry: { sx: 0.85, sy: 0.7, rot: 14 },
  smug: { sx: 0.9, sy: 0.6, rot: -10 },
  stern: { sx: 0.9, sy: 0.8, rot: -8 },
};

const WEB_ANGLES = [20, 60, 100, 140, 180, 220, 260, 300, 340];

// one almond lens pointed toward the temple (side = -1 left, 1 right)
const lens = (r: number, side: 1 | -1) =>
  `M${side * r},0 Q${side * r * 0.52},${-r * 0.62} 0,${-r * 0.16} Q${-side * r * 0.4},0 0,${r * 0.22} Q${side * r * 0.52},${r * 0.6} ${side * r},0 Z`;

export const SpiderHead: React.FC<{
  x: number;
  y: number;
  angle?: number; // from headAngle(j) in stick.tsx; 0 = upright
  facing?: number;
  r?: number; // head radius, same scale as BigHead's
  emotion?: Emotion;
  blink?: boolean;
  label?: string;
  main?: string; // mask colour
  web?: string; // web-line / outline colour
  lensColor?: string;
}> = ({ x, y, angle = 0, facing = 1, r = 72, emotion = "neutral", blink = false, label, main = "#c8102e", web = COL.ink, lensColor = "#f4f4f0" }) => {
  const eyeDX = r * 0.42;
  const eyeY = -r * 0.06;
  const eyeR = r * 0.34;
  const shape = EYE[emotion];

  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${facing} 1)`}>
      <circle cx={0} cy={0} r={r} fill={main} stroke={web} strokeWidth={r * 0.06} />
      <g stroke={web} strokeWidth={r * 0.026} opacity={0.8} fill="none">
        {WEB_ANGLES.map((a) => (
          <line key={a} x1={0} y1={0} x2={r * Math.cos((a * Math.PI) / 180)} y2={r * Math.sin((a * Math.PI) / 180)} />
        ))}
        <circle r={r * 0.42} />
        <circle r={r * 0.72} />
      </g>

      {([-1, 1] as const).map((side) => {
        const cx = side * eyeDX;
        return (
          <g key={side} transform={`translate(${cx} ${eyeY}) rotate(${side * shape.rot}) scale(${shape.sx} ${shape.sy})`}>
            {blink ? (
              <line x1={-eyeR * 0.9} y1={0} x2={eyeR * 0.9} y2={0} stroke={web} strokeWidth={r * 0.05} strokeLinecap="round" />
            ) : (
              <path d={lens(eyeR, side)} fill={lensColor} stroke={web} strokeWidth={r * 0.045} />
            )}
          </g>
        );
      })}

      {label && (
        <text
          x={0}
          y={-r * 1.5}
          textAnchor="middle"
          fontFamily={FONT.title}
          fontWeight={800}
          fontSize={r * 0.32}
          fill={COL.ink}
          stroke="#fafaf7"
          strokeWidth={r * 0.08}
          paintOrder="stroke"
        >
          {label}
        </text>
      )}
    </g>
  );
};
