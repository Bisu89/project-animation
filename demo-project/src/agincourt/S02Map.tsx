import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Stakes } from "../stickman/crowd";
import { COL, FONT, ease } from "../stickman/fx";
import { ENG, FR } from "./Stills";
import type { SceneProps } from "./Video";

// Top-down schematic: a narrow strip of open field pinched between two woods, with the English
// line (small, stakes planted) sitting in the gap and the larger French block still in open ground.
// Not a reconstruction of a specific documented layout — see docs/history-pipeline/agincourt-historical-notes.md.

const FIELD = { x: 260, y: 260, w: 1400, h: 560 };
const WOOD = "#5c6b4a";

export const S02Map: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const fieldIn = ease(f, 0, 20);
  const woodIn = ease(f, 10, 34);
  const engIn = ease(f, 40, 60);
  const frIn = ease(f, 66, 88);
  const pinchIn = ease(f, 90, 112);

  return (
    <AbsoluteFill style={{ background: "#ece3cb" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
        <rect x={FIELD.x} y={FIELD.y} width={FIELD.w} height={FIELD.h} fill="#c9b98a" opacity={fieldIn} stroke={COL.ink} strokeWidth={5} />
        {/* woods pinching the middle of the field from top and bottom */}
        <g opacity={woodIn}>
          <path d="M700,260 Q960,440 1220,260 L1220,160 L700,160 Z" fill={WOOD} />
          <path d="M700,820 Q960,640 1220,820 L1220,920 L700,920 Z" fill={WOOD} />
        </g>
        {/* inward arrows calling out the narrow gap */}
        <g opacity={pinchIn} stroke={COL.ink} strokeWidth={6} strokeLinecap="round">
          <line x1={860} y1={440} x2={920} y2={440} markerEnd="url(#pinchArrow)" />
          <line x1={1060} y1={440} x2={1000} y2={440} markerEnd="url(#pinchArrow)" />
        </g>
        <defs>
          <marker id="pinchArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L7,4 L0,8 Z" fill={COL.ink} />
          </marker>
        </defs>

        {/* English line: small, at the narrow point, stakes in front */}
        <g opacity={engIn} transform="translate(860 540)">
          {Array.from({ length: 3 }).map((_, r) => (
            <g key={r} transform={`translate(${-r * 22} 0)`}>
              {Array.from({ length: 10 }).map((__, c) => (
                <circle key={c} cx={0} cy={(c - 4.5) * 16} r={6} fill={ENG} stroke={COL.ink} strokeWidth={2} />
              ))}
            </g>
          ))}
          <g transform="translate(26 0)">
            <Stakes x={0} y={-72} n={10} dx={0} dy={16} s={0.5} lean={1} seed="map1" />
          </g>
          <text x={-54} y={-100} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={26} fill={COL.ink}>
            ENGLISH
          </text>
        </g>

        {/* French block: larger, further out in the open ground */}
        <g opacity={frIn} transform="translate(1380 540)">
          {Array.from({ length: 6 }).map((_, r) => (
            <g key={r} transform={`translate(${r * 24} 0)`}>
              {Array.from({ length: 16 }).map((__, c) => (
                <circle key={c} cx={0} cy={(c - 7.5) * 15} r={6} fill={FR} stroke={COL.ink} strokeWidth={2} />
              ))}
            </g>
          ))}
          <text x={60} y={-150} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={26} fill={COL.ink}>
            FRENCH
          </text>
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
          color: COL.ink,
          opacity: ease(f, 6, 24) * ease(f, dur - 30, dur - 12, 1, 0),
        }}
      >
        THE FIELD AT AGINCOURT
      </div>
    </AbsoluteFill>
  );
};
