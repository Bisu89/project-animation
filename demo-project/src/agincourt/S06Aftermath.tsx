import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONT, ease } from "../stickman/fx";
import type { SceneProps } from "./Video";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Quiet closing scene: the same two still layers from scene 1, graded darker and desaturated,
// with a slow zoom-out and three hedged takeaway lines (no Slam/Burst/Card — see
// docs/history-pipeline/repository-audit.md section D on tone).
const LESSONS = ["A narrow field that blunted the French numbers.", "Mass archery from a protected position.", "Mud, fatigue, and a crush of their own men."];

export const S06Aftermath: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const zoom = interpolate(f, [0, dur], [1.1, 0.96], clamp);

  return (
    <AbsoluteFill style={{ background: "#9aa2ac" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "960px 540px", filter: "grayscale(0.55) brightness(0.72) contrast(1.05)" }}>
        <Img src={staticFile("agincourt/far.png")} />
        <Img src={staticFile("agincourt/mid.png")} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(10,10,10,0) 55%, rgba(10,10,10,0.55) 100%)" }} />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 70,
          textAlign: "center",
          fontFamily: FONT.title,
          fontWeight: 800,
          fontSize: 48,
          letterSpacing: 4,
          color: "#fff",
          textShadow: "0 2px 10px rgba(0,0,0,0.7)",
          opacity: ease(f, 6, 26),
        }}
      >
        WHY THE SMALLER ARMY WON
      </div>

      {/* kept well clear of the burned-in caption's top edge at ~870px (bottom=60 + its own
          wrapped-line height) — a first pass placed this at top:760 and the third line was
          hidden behind the caption pill; see docs/history-pipeline/checkpoint-log.md */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        {LESSONS.map((line, i) => {
          const at = 30 + i * 36;
          const o = ease(f, at, at + 16);
          return (
            <div
              key={i}
              style={{
                opacity: o,
                transform: `translateY(${(1 - o) * 18}px)`,
                background: "rgba(10,10,10,0.5)",
                padding: "4px 18px",
                borderRadius: 8,
                fontFamily: FONT.body,
                fontWeight: 600,
                fontSize: 26,
                color: "#fff",
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
