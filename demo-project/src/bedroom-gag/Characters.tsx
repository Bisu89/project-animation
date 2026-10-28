import React from "react";
import { Face, FaceP, PALETTE } from "./Face";
import { Shirt } from "./Shirt";
import { Arm, Hand } from "./Primitives";
import { WIDTH as W, HEIGHT as H } from "./config";
const INK = PALETTE.ink;

// full-body husband from the model sheet: head sits straight on the striped shirt (no neck), long thin legs, brown slippers
export const Stand: React.FC<{ x: number; feet: number; r: number; face: FaceP; talk: number; walk: number; dark: number; idp: string }> = ({ x, feet, r, face, talk, walk, dark, idp }) => {
  const sw = Math.sin(walk * 7) * r * 0.35;
  const hip = feet - 1.7 * r;
  const shirtBottom = hip - 0.5 * r;
  const shirtTop = shirtBottom - 1.3 * r;
  return (
    <g style={{ filter: dark > 0 ? `brightness(${1 - dark})` : undefined }}>
      <Arm w={r * 0.09} pts={[[x - 0.62 * r, shirtTop + 0.3 * r], [x - 0.85 * r - sw * 0.3, shirtTop + 1.0 * r], [x - 0.8 * r + sw * 0.3, shirtTop + 1.7 * r]]} />
      <Hand x={x - 0.8 * r + sw * 0.3} y={shirtTop + 1.8 * r} r={r * 0.24} flip={-1} />
      <Arm w={r * 0.09} pts={[[x + 0.62 * r, shirtTop + 0.3 * r], [x + 0.85 * r + sw * 0.3, shirtTop + 1.0 * r], [x + 0.8 * r - sw * 0.3, shirtTop + 1.7 * r]]} />
      <Hand x={x + 0.8 * r - sw * 0.3} y={shirtTop + 1.8 * r} r={r * 0.24} />
      <Arm w={r * 0.09} pts={[[x - 0.28 * r, hip], [x - 0.3 * r - sw, hip + 0.8 * r], [x - 0.3 * r - sw * 1.4, feet - 0.1 * r]]} />
      <Arm w={r * 0.09} pts={[[x + 0.28 * r, hip], [x + 0.3 * r + sw, hip + 0.8 * r], [x + 0.3 * r + sw * 1.4, feet - 0.1 * r]]} />
      <ellipse cx={x - 0.4 * r - sw * 1.4} cy={feet} rx={r * 0.42} ry={r * 0.18} fill={PALETTE.slipper} stroke={INK} strokeWidth={r * 0.05} />
      <ellipse cx={x + 0.4 * r + sw * 1.4} cy={feet} rx={r * 0.42} ry={r * 0.18} fill={PALETTE.slipper} stroke={INK} strokeWidth={r * 0.05} />
      <path d={`M${x - .6 * r},${shirtBottom - .05 * r} L${x + .6 * r},${shirtBottom - .05 * r} L${x + .6 * r},${hip + .15 * r} L${x + .05 * r},${hip + .15 * r} L${x},${hip - .3 * r} L${x - .05 * r},${hip + .15 * r} L${x - .6 * r},${hip + .15 * r} Z`} fill={PALETTE.husbandShorts} stroke={INK} strokeWidth={r * .045} />
      <Shirt x={x} y={shirtTop} r={r} height={1.3} />
      <Face x={x} y={shirtTop - 0.85 * r} r={r} hair="husband" p={face} talk={talk} id={`${idp}h`} />
    </g>
  );
};

// ---------- close-ups ----------
const R = 320;
export const Husband: React.FC<{ t: number; p: FaceP; talk: number; x: number; y: number }> = ({ t, p, talk, x, y }) => {
  const r = R;
  const top = y + r * 0.9;
  return (
    <g>
      <Arm w={r * .09} pts={[[x - .79 * r, top + .55 * r], [x - .9 * r, top + 1.5 * r], [x - .84 * r, top + 2.1 * r]]} />
      <Arm w={r * .09} pts={[[x + .79 * r, top + .55 * r], [x + .9 * r, top + 1.5 * r], [x + .84 * r, top + 2.1 * r]]} />
      <Shirt x={x} y={top} r={r} height={2.2} />
      <Hand x={x - .84 * r} y={top + 2.15 * r} r={r * .16} flip={-1} />
      <Hand x={x + .84 * r} y={top + 2.15 * r} r={r * .16} />
      <Face x={x} y={y + Math.sin(t * 1.5) * 6} r={r} hair="husband" p={p} talk={talk} tilt={Math.sin(t * 0.9) * 2.5} id="hc" />
    </g>
  );
};

export const Wife: React.FC<{ t: number; p: FaceP; talk: number; x: number; y: number; cross?: boolean }> = ({ t, p, talk, x, y, cross }) => {
  const r = R;
  const top = y + r * 0.9;
  const blanket = top + 1.55 * r; // top edge of the blanket
  const tank = [[-0.42, -0.05], [-0.8, 0.2], [-0.9, 0.75], [-0.85, 3], [0.85, 3], [0.9, 0.75], [0.8, 0.2], [0.42, -0.05]].map(([a, b]) => `${x + a * r},${top + b * r}`).join(" ");
  return (
    <g>
      {/* thin bare arms from the shoulders down to the blanket */}
      <Arm w={r * 0.09} pts={[[x - 0.78 * r, top + 0.2 * r], [x - 1.12 * r, top + 0.95 * r], [x - 0.95 * r, blanket - 0.05 * r]]} />
      <Arm w={r * 0.09} pts={[[x + 0.78 * r, top + 0.2 * r], [x + 1.12 * r, top + 0.95 * r], [x + 0.95 * r, blanket - 0.05 * r]]} />
      <polygon points={tank} fill={PALETTE.wifeTop} stroke={INK} strokeWidth={r * 0.045} strokeLinejoin="round" />
      <path d={`M${x - .3 * r},${top} Q${x - .28 * r},${top + .5 * r} ${x},${top + .5 * r} Q${x + .28 * r},${top + .5 * r} ${x + .3 * r},${top} Z`} fill={PALETTE.skin} stroke={INK} strokeWidth={r * .03} />
      <path d={`M0,${blanket + 0.1 * r} Q${x},${blanket - 0.15 * r} ${W},${blanket + 0.1 * r} L${W},${H} L0,${H} Z`} fill="#e6d5b5" stroke="#b9a67e" strokeWidth={8} />
      <path d={`M120,${blanket + 0.5 * r} Q${x},${blanket + 0.35 * r} 900,${blanket + 0.55 * r} M60,${blanket + 1.0 * r} Q${x},${blanket + 0.85 * r} 1000,${blanket + 1.05 * r}`} stroke="#c9b690" strokeWidth={8} fill="none" />
      {cross ? (
        <>
          <path d={`M${x - 0.95 * r},${blanket - 0.05 * r} Q${x - 0.3 * r},${blanket + 0.18 * r} ${x + 0.55 * r},${blanket - 0.28 * r}`} stroke={INK} strokeWidth={r * 0.085} fill="none" strokeLinecap="round" />
          <path d={`M${x + 0.95 * r},${blanket - 0.05 * r} Q${x + 0.3 * r},${blanket + 0.05 * r} ${x - 0.55 * r},${blanket - 0.34 * r}`} stroke={INK} strokeWidth={r * 0.085} fill="none" strokeLinecap="round" />
          <Hand x={x + 0.55 * r} y={blanket - 0.3 * r} r={r * 0.15} />
          <Hand x={x - 0.55 * r} y={blanket - 0.36 * r} r={r * 0.15} flip={-1} />
        </>
      ) : (
        <>
          <Hand x={x - 0.95 * r} y={blanket - 0.05 * r} r={r * 0.14} flip={-1} />
          <Hand x={x + 0.95 * r} y={blanket - 0.05 * r} r={r * 0.14} />
        </>
      )}
      <Face x={x} y={y + Math.sin(t * 1.3) * 6} r={r} hair="wife" p={p} talk={talk} tilt={Math.sin(t * 0.8) * 2} id="wc" />
    </g>
  );
};

