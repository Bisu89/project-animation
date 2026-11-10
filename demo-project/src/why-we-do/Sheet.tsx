import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { INK, Look, Pose, STANDING } from "../stick-couple/Stick";
import { FONT } from "../stick-couple/common";
import { Guy, Phone } from "./Guy";

// Model sheet for the new solo lead: 6 expressions/poses on one 9:16 page, for the owner to approve the look.
const CELLS: { label: string; pose: Pose; look: Omit<Look, "t">; glint?: number; phone?: boolean; dir?: 1 | -1 }[] = [
  { label: "neutral", pose: { near: [150, -430], far: [-20, 5], ...STANDING, palm: true }, look: { emo: "happy", talk: 0.4 } },
  { label: "panic (pockets)", pose: { near: [50, -30], far: [20, -40], ...STANDING, lean: 6 }, look: { emo: "nervous", sweat: 1, gaze: [0.6, 0.6] } },
  { label: "humming", pose: { near: [118, -320], far: [-15, 5], ...STANDING, tilt: -6 }, look: { emo: "hum", talk: 0.6 }, phone: true },
  { label: "blank stare", pose: { near: [25, 5], far: [-15, 5], ...STANDING }, look: { emo: "blank" }, glint: 1, dir: -1 },
  { label: "shock", pose: { near: [130, -400], far: [90, -420], ...STANDING, lean: -6, palm: true }, look: { emo: "shock" } },
  { label: "laugh", pose: { near: [55, -110], far: [30, -95], ...STANDING, lean: 8, tilt: -8 }, look: { emo: "laugh", tears: 1 } },
];

export const Sheet: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30 + 0.4;
  return (
    <AbsoluteFill style={{ background: "#f4efe6" }}>
      <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center", fontFamily: FONT, fontSize: 70, color: INK }}>BENNY · model sheet</div>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
        {CELLS.map((c, i) => {
          const cx = i % 2 === 0 ? 290 : 790;
          const row = Math.floor(i / 2);
          const top = 165 + row * 585;
          const hip = top + 360;
          return (
            <g key={i}>
              <rect x={cx - 240} y={top} width={480} height={565} rx={30} fill="#fff" stroke="#e2dbcf" strokeWidth={4} />
              <Guy x={cx - 20 * (c.dir ?? 1)} hip={hip} dir={c.dir ?? 1} scale={0.56} pose={c.pose} look={{ ...c.look, t }} glint={c.glint} held={c.phone ? <Phone rot={-15} /> : undefined} />
              <text x={cx} y={top + 50} textAnchor="middle" fontFamily={FONT} fontSize={36} fill="#8a8172">
                {c.label}
              </text>
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
