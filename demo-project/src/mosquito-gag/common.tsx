import React from "react";
import { staticFile } from "remotion";
import { BACKGROUNDS, clamp01, smooth } from "../bedroom-gag/config";

// Shared by every mosquito-gag episode: the bedroom world (bedroom-gag background, comp px), measured spots on it,
// small easing helpers and the recurring overlays (backdrop, steam puffs, anger mark, Zzz).

export const W = 1080;
export const H = 1920;
// measured on the background (940x1673 stretched to 1080x1920)
export const SHADE = "M52,609 L121,609 L147,699 L32,699 Z";
export const BLANKET = "M0,1920 L0,915 Q70,885 150,880 Q240,858 330,852 Q440,850 560,868 L1080,880 L1080,1920 Z";
export const FACE = { x: 300, y: 762, r: 96 };
export const LAMP_HAND = [118, 768];
export const ARM_W = 26; // limb thickness (world px) and hand size, twice the bedroom-gag close-ups (owner: chunkier hands)
export const HAND_R = 46;
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const ramp = (t: number, a: number, b: number) => smooth(clamp01((t - a) / (b - a)));
export const hash = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
// eased path through [t, x, y] keys
export const track = (t: number, ks: number[][]) => {
  if (t <= ks[0][0]) return [ks[0][1], ks[0][2]];
  for (let i = 1; i < ks.length; i++) {
    if (t <= ks[i][0]) {
      const k = smooth((t - ks[i - 1][0]) / (ks[i][0] - ks[i - 1][0]));
      return [lerp(ks[i - 1][1], ks[i][1], k), lerp(ks[i - 1][2], ks[i][2], k)];
    }
  }
  const l = ks[ks.length - 1];
  return [l[1], l[2]];
};
export const Backdrop: React.FC<{ on: number; blur: number }> = ({ on, blur }) => (
  <g filter={blur > 0 ? "url(#bgblur)" : undefined}>
    <image href={staticFile(BACKGROUNDS.night)} width={W} height={H} preserveAspectRatio="none" />
    <image href={staticFile(BACKGROUNDS.lamp)} width={W} height={H} preserveAspectRatio="none" opacity={on} />
  </g>
);
export const Puffs: React.FC<{ t: number; x: number; y: number; k: number; color?: string; size?: number }> = ({ t, x, y, k, color = "#f2f2f2", size = 1 }) => (
  <g>
    {[0, 1, 2, 3].map((i) => {
      const ph = (t * 1.3 + i / 4) % 1;
      return <circle key={i} cx={x + Math.sin(ph * 6 + i * 2) * 22 * size + (i - 1.5) * 26 * size} cy={y - ph * 110 * size} r={(10 + ph * 22) * size} fill={color} opacity={k * (1 - ph) * 0.85} />;
    })}
  </g>
);
export const AngerMark: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#e0202a" strokeWidth={5} fill="none" strokeLinecap="round">
    {[0, 90, 180, 270].map((a) => (
      <path key={a} transform={`rotate(${a})`} d="M6,-18 Q4,-6 18,-6" />
    ))}
  </g>
);
export const Zzz: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const ph = (t * 0.55 + i / 3) % 1;
      return (
        <text key={i} x={x + ph * 70 + Math.sin(ph * 6) * 8} y={y - ph * 120} fontFamily="Arial Black, Arial" fontWeight={900} fontSize={18 + ph * 22} fill="#dfe6ff" stroke="#1a1f3a" strokeWidth={2} opacity={Math.sin(Math.PI * ph)}>
          z
        </text>
      );
    })}
  </g>
);
