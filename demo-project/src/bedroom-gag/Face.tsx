import React from "react";
import { HusbandHair, WifeHairBack, WifeHairFront } from "./Hair";

// Big round face redrawn from the GPT model sheets (content/bedroom-gag/models): outlined circle eyes with small dot pupils,
// thin arched brows, a single-line mouth that opens into the sheet's talking / shout / "O" / teeth shapes, plus side-part black
// hair (husband) and a brown bob (wife). Everything is in units of the head radius r, so it works tiny in a wide shot and huge
// in a close-up. All numbers that matter for the look are collected in PALETTE / the constants below.
export const PALETTE = {
  ink: "#111",
  skin: "#f8f8f7",
  skinEdge: "#dfe1e6",
  husbandHair: "#1e1e1d",
  husbandShirt: "#213059",
  husbandShorts: "#1d2c56",
  slipper: "#936b42",
  wifeHair: "#401c15",
  wifeTop: "#c3aed6",
  wifeShorts: "#8871a2",
  mouthDark: "#2a0c0c",
  tongue: "#d8606a",
};
const INK = PALETTE.ink;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export type Mouth = "smile" | "flat" | "frown" | "smirk" | "open" | "teeth" | "oh" | "shout";
export type FaceP = {
  eyeOpen: number; // 0 closed .. 1 open
  eyeScale: number; // 1 normal, >1 wide-eyed
  px: number; // pupil offset -1..1
  py: number;
  brow: number; // raise (+) / lower (-)
  tilt: number; // 0 neutral, 1 angry (inner ends down), <0 worried
  mouth: Mouth;
  open: number; // 0..1 mouth openness for the talking shapes
};

export const PRESETS = {
  sleep: { eyeOpen: 0.0, eyeScale: 1, px: 0, py: 0, brow: -0.1, tilt: 0, mouth: "flat", open: 0 },
  groggy: { eyeOpen: 0.45, eyeScale: 1, px: 0.3, py: 0.1, brow: -0.1, tilt: 0.2, mouth: "frown", open: 0 },
  scheme: { eyeOpen: 0.9, eyeScale: 1, px: 0.8, py: 0, brow: 0.3, tilt: 0.25, mouth: "smirk", open: 0 },
  smug: { eyeOpen: 0.6, eyeScale: 1, px: 0.7, py: 0.35, brow: 0.1, tilt: 0.15, mouth: "smirk", open: 0 },
  grin: { eyeOpen: 0.75, eyeScale: 1, px: 0.5, py: 0.2, brow: 0.2, tilt: 0.1, mouth: "teeth", open: 0.3 },
  shock: { eyeOpen: 1, eyeScale: 1.2, px: 0, py: 0, brow: 1, tilt: -0.2, mouth: "oh", open: 0.6 },
  angry: { eyeOpen: 0.85, eyeScale: 1, px: -0.4, py: 0, brow: -0.1, tilt: 1, mouth: "shout", open: 0.5 },
  glare: { eyeOpen: 0.75, eyeScale: 1, px: 0.8, py: 0.1, brow: -0.2, tilt: 0.8, mouth: "frown", open: 0 },
} satisfies Record<string, FaceP>;
export type PresetName = keyof typeof PRESETS;

export const mixFace = (a: FaceP, b: FaceP, k: number): FaceP => ({
  eyeOpen: lerp(a.eyeOpen, b.eyeOpen, k),
  eyeScale: lerp(a.eyeScale, b.eyeScale, k),
  px: lerp(a.px, b.px, k),
  py: lerp(a.py, b.py, k),
  brow: lerp(a.brow, b.brow, k),
  tilt: lerp(a.tilt, b.tilt, k),
  mouth: k < 0.5 ? a.mouth : b.mouth,
  open: lerp(a.open, b.open, k),
});

// eased track of presets: [[time, preset], ...]
export const faceAt = (t: number, ks: [number, PresetName][], blend = 0.25): FaceP => {
  let cur: FaceP = PRESETS[ks[0][1]];
  for (let i = 1; i < ks.length; i++) {
    const k = Math.max(0, Math.min(1, (t - ks[i][0]) / blend));
    if (k > 0) cur = mixFace(PRESETS[ks[i - 1][1]], PRESETS[ks[i][1]], k * k * (3 - 2 * k));
  }
  return cur;
};

export const Face: React.FC<{ x: number; y: number; r: number; hair: "husband" | "wife"; p: FaceP; talk?: number; tilt?: number; id: string }> = ({ x, y, r, hair, p, talk = 0, tilt = 0, id }) => {
  const ex = r * 0.43;
  const ey = -r * 0.02;
  const er = r * 0.30 * p.eyeScale;
  const mY = r * 0.46;
  const open = Math.max(p.open, talk * 0.9);
  const talking = talk > 0.05;
  const mouth: Mouth = talking && (p.mouth === "smirk" || p.mouth === "flat" || p.mouth === "frown" || p.mouth === "smile") ? "open" : p.mouth;
  const lw = r * 0.032;
  const eyeOpen = Math.max(0, Math.min(1, p.eyeOpen));
  const lidY = ey - er + 2 * er * (1 - eyeOpen);
  const lidHalfWidth = Math.sqrt(Math.max(0, er * er - (lidY - ey) ** 2));
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <defs>
        <radialGradient id={`sh-${id}`} cx="0.4" cy="0.35" r="0.85">
          <stop offset="0.78" stopColor={PALETTE.skin} />
          <stop offset="1" stopColor={PALETTE.skinEdge} />
        </radialGradient>
        {[-1, 1].map((s) => (
          <clipPath key={s} id={`eye-${id}-${s}`}>
            <circle cx={s * ex} cy={ey} r={er} />
          </clipPath>
        ))}
      </defs>
      {hair === "wife" && <WifeHairBack r={r} />}
      <ellipse rx={r} ry={r * 0.98} fill={`url(#sh-${id})`} stroke={INK} strokeWidth={r * 0.05} />
      {hair === "husband" ? <HusbandHair r={r} /> : <WifeHairFront r={r} />}
      {[-1, 1].map((s) => {
        const cx = s * ex;
        const closed = p.eyeOpen < 0.06;
        // brow: an arch above the eye; angry tilts the inner end (towards the nose) down, worried tilts it up
        const by = -r * 0.5 - p.brow * r * 0.1;
        const inner = -s; // direction towards the nose along x
        const tIn = p.tilt * r * 0.13;
        const outerX = cx - inner * r * 0.26;
        const innerX = cx + inner * r * 0.26;
        return (
          <g key={s}>
            {closed ? (
              <path d={`M${cx - er},${ey} Q${cx},${ey + er * 0.55} ${cx + er},${ey}`} stroke={INK} strokeWidth={lw * 1.3} fill="none" strokeLinecap="round" />
            ) : (
              <>
                <circle cx={cx} cy={ey} r={er} fill="#fff" stroke={INK} strokeWidth={lw} />
                <g clipPath={`url(#eye-${id}-${s})`}>
                  <ellipse cx={cx + Math.max(-1, Math.min(1, p.px)) * er * 0.65} cy={ey + p.py * er * 0.35} rx={er * (p.eyeScale > 1.1 ? 0.23 : 0.28)} ry={er * (p.eyeScale > 1.1 ? 0.26 : 0.34)} fill={INK} />
                  {p.eyeOpen < 0.97 && <rect x={cx - er * 1.1} y={ey - er * 1.1} width={er * 2.2} height={2 * er * (1 - eyeOpen) + er * 0.1} fill="#f1f2f3" />}
                </g>
                {p.eyeOpen < 0.97 && <line x1={cx - lidHalfWidth} y1={lidY} x2={cx + lidHalfWidth} y2={lidY} stroke={INK} strokeWidth={lw * 1.1} strokeLinecap="round" />}
              </>
            )}
            <path d={`M${outerX},${by + (p.tilt < 0 ? 0 : -tIn * 0.2)} Q${cx},${by - r * 0.1} ${innerX},${by + tIn}`} stroke={INK} strokeWidth={lw * 1.1} fill="none" strokeLinecap="round" />
          </g>
        );
      })}
      {mouth === "smile" && <path d={`M${-r * 0.24},${mY} Q${-r * 0.02},${mY + r * 0.15} ${r * 0.24},${mY - r * 0.06}`} stroke={INK} strokeWidth={lw * 1.1} fill="none" strokeLinecap="round" />}
      {mouth === "flat" && <line x1={-r * 0.16} y1={mY + r * 0.04} x2={r * 0.16} y2={mY + r * 0.04} stroke={INK} strokeWidth={lw * 1.1} strokeLinecap="round" />}
      {mouth === "frown" && <path d={`M${-r * 0.2},${mY + r * 0.1} Q0,${mY - r * 0.04} ${r * 0.2},${mY + r * 0.1}`} stroke={INK} strokeWidth={lw * 1.1} fill="none" strokeLinecap="round" />}
      {mouth === "smirk" && <path d={`M${-r * 0.2},${mY + r * 0.06} Q${r * 0.06},${mY + r * 0.14} ${r * 0.3},${mY - r * 0.08}`} stroke={INK} strokeWidth={lw * 1.1} fill="none" strokeLinecap="round" />}
      {mouth === "open" && (
        <g>
          <path d={`M${-r * 0.2},${mY} Q0,${mY - r * 0.06} ${r * 0.2},${mY} Q${r * 0.18},${mY + r * (0.06 + open * 0.2)} 0,${mY + r * (0.08 + open * 0.22)} Q${-r * 0.18},${mY + r * (0.06 + open * 0.2)} ${-r * 0.2},${mY} Z`} fill={PALETTE.mouthDark} stroke={INK} strokeWidth={lw} strokeLinejoin="round" />
          <ellipse cx={0} cy={mY + r * (0.06 + open * 0.17)} rx={r * 0.09} ry={r * 0.04 + open * r * 0.03} fill={PALETTE.tongue} />
        </g>
      )}
      {mouth === "teeth" && (
        <g>
          <rect x={-r * 0.26} y={mY - r * 0.04} width={r * 0.52} height={r * (0.12 + open * 0.2)} rx={r * 0.05} fill="#fff" stroke={INK} strokeWidth={lw * 1.1} />
          {[-0.13, 0, 0.13].map((tx) => (
            <line key={tx} x1={r * tx} y1={mY - r * 0.04} x2={r * tx} y2={mY + r * (0.08 + open * 0.2)} stroke={INK} strokeWidth={lw * 0.7} />
          ))}
          <line x1={-r * 0.26} y1={mY + r * (0.02 + open * 0.1)} x2={r * 0.26} y2={mY + r * (0.02 + open * 0.1)} stroke={INK} strokeWidth={lw * 0.7} />
        </g>
      )}
      {mouth === "oh" && <ellipse cx={0} cy={mY + r * 0.1} rx={r * 0.12} ry={r * (0.12 + open * 0.14)} fill={PALETTE.mouthDark} stroke={INK} strokeWidth={lw} />}
      {mouth === "shout" && (
        <g>
          <path d={`M${-r * 0.3},${mY - r * 0.02} Q0,${mY - r * 0.12} ${r * 0.3},${mY - r * 0.02} Q${r * 0.28},${mY + r * (0.3 + open * 0.2)} 0,${mY + r * (0.34 + open * 0.2)} Q${-r * 0.28},${mY + r * (0.3 + open * 0.2)} ${-r * 0.3},${mY - r * 0.02} Z`} fill={PALETTE.mouthDark} stroke={INK} strokeWidth={lw * 1.2} strokeLinejoin="round" />
          <ellipse cx={0} cy={mY + r * (0.27 + open * 0.15)} rx={r * 0.14} ry={r * 0.06} fill={PALETTE.tongue} />
        </g>
      )}
    </g>
  );
};
