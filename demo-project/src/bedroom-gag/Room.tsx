import React from "react";
import { staticFile } from "remotion";
import { Face, FaceP, PALETTE } from "./Face";
import { Arm, Hand } from "./Primitives";
import { Stand } from "./Characters";
import { BACKGROUNDS as BG, WIDTH as W, HEIGHT as H, clamp01, smooth } from "./config";
const INK = PALETTE.ink;

type BgName = keyof typeof BG;
export type Mode = { bg: BgName; hMode: "lying" | "legs" | "hidden" | "stand" | "exit"; wMode: "lying" | "sit" | "hidden" };

export const Room: React.FC<{ t: number; m: Mode; hFace: FaceP; wFace: FaceP; hTalk: number; wTalk: number }> = ({ t, m, hFace, wFace, hTalk, wTalk }) => {
  const doorOpen = m.bg === "door";
  return (
    <g>
      <image href={staticFile(BG[m.bg])} width={W} height={H} preserveAspectRatio="none" />
      {/* wife: head on the left pillow, or sitting up with the blanket at her waist */}
      {m.wMode !== "hidden" && (
        <g>
          {m.wMode === "sit" && (
            <g>
              <Arm w={6} pts={[[250, 800], [224, 826], [240, 846]]} />
              <Arm w={6} pts={[[346, 800], [372, 826], [356, 846]]} />
              <path d="M242,806 Q258,782 282,778 L314,778 Q338,782 354,806 L360,842 Q298,850 236,842 Z" fill={PALETTE.wifeTop} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
              <Hand x={240} y={848} r={12} flip={-1} />
              <Hand x={356} y={848} r={12} />
            </g>
          )}
          <Face x={298} y={m.wMode === "sit" ? 718 : 756} r={66} hair="wife" p={wFace} talk={wTalk} tilt={m.wMode === "lying" ? -6 : 0} id="w" />
        </g>
      )}
      {/* husband in bed on the right pillow; his legs slide out over the right side of the blanket */}
      {(m.hMode === "lying" || m.hMode === "legs") && <Face x={546} y={756} r={66} hair="husband" p={hFace} talk={hTalk} tilt={6} id="hl" />}
      {m.hMode === "legs" &&
        [0, 1].map((i) => {
          const a = smooth(clamp01((t - 0.9 - i * 0.35) / 0.5));
          const hx = 772 + i * 26;
          const hy = 955 + i * 18;
          const sway = Math.sin(t * 5 + i) * 5 * a;
          return (
            <g key={i} opacity={a}>
              <polyline points={`${hx},${hy} ${hx + 38 * a},${hy + 42 * a} ${hx + 52 * a + sway},${hy + 100 * a}`} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <ellipse cx={hx + 58 * a + sway} cy={hy + 108 * a} rx={30} ry={11} fill={PALETTE.slipper} stroke={INK} strokeWidth={3} />
              <path d={`M${hx - 24},${hy - 22} L${hx + 22},${hy - 30} L${hx + 40 * a},${hy + 16 * a} L${hx - 16},${hy + 10} Z`} fill={PALETTE.husbandShorts} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
            </g>
          );
        })}
      {m.hMode === "stand" && <Stand x={985} feet={1020} r={80} face={hFace} talk={hTalk} walk={0} dark={0} idp="s" />}
      {m.hMode === "exit" && (
        <Stand x={985 - clamp01((t - 0.5) / 1.0) * 55} feet={1020 - clamp01((t - 0.5) / 1.0) * 180} r={80 - clamp01((t - 0.5) / 1.0) * 26} face={hFace} talk={0} walk={t} dark={doorOpen ? 0.9 : 0} idp="e" />
      )}
    </g>
  );
};

