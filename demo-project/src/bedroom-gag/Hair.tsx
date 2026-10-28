import React from "react";

// Normalized to the head radius. Trace the silhouette of CS1 / CS2,
// including the off-centre part, swept fringe and tapered bob ends.
const ink = "#111";
export const HusbandHair: React.FC<{ r: number }> = ({ r }) => (
  <g transform={`scale(${r})`} stroke={ink} strokeWidth={0.035} strokeLinejoin="round">
    <path d="M-1,.12 Q-1.12,-.22 -1.04,-.62 L-1.12,-.57 Q-.96,-.81 -.64,-1.02 C-.24,-1.29 .36,-1.3 .52,-1.03 C.85,-1.12 1.15,-.78 1.06,-.26 L.97,.16 Q.9,-.24 .66,-.49 Q.53,-.63 .48,-.78 C.13,-.82 -.34,-.63 -.71,-.35 L-.62,-.56 Q-.87,-.32 -1,.12 Z" fill="#1e1e1d" />
    <g fill="none" stroke="#0e0e0e" strokeWidth={0.018} strokeLinecap="round">
      <path d="M-1.04,-.62 Q-.38,-1.08 .22,-.98 Q.47,-.95 .48,-.78 M-.94,-.75 Q-.3,-1.2 .2,-1.12 Q.5,-1.08 .52,-1.03 M-.86,-.48 Q-.18,-.92 .48,-.78 M.52,-1.03 Q.92,-.96 1.04,-.54 M.5,-.88 Q.85,-.8 1.01,-.36" />
    </g>
  </g>
);

export const WifeHairBack: React.FC<{ r: number }> = ({ r }) => (
  <g transform={`scale(${r})`} fill="#401c15" stroke={ink} strokeWidth={0.035} strokeLinejoin="round">
    <path d="M-1.03,-.28 C-1.26,.16 -1.2,.74 -.94,.93 L-.69,.99 L-.84,.87 Q-.67,.99 -.46,.9 L.58,.92 Q.86,1.06 1.1,.78 L.96,.82 C1.29,.4 1.17,-.02 1.03,-.4 Q.81,-1.12 .26,-1.12 Q-.61,-1.25 -1.03,-.28 Z" />
    <path d="M-1.03,.02 Q-1.19,.64 -.94,.86 M1.02,-.06 Q1.22,.49 .94,.88 M-.88,.29 Q-1.01,.69 -.73,.94" fill="none" stroke="#29130f" strokeWidth={0.018} />
  </g>
);

export const WifeHairFront: React.FC<{ r: number }> = ({ r }) => (
  <g transform={`scale(${r})`} fill="#401c15" stroke={ink} strokeWidth={0.035} strokeLinejoin="round">
    <path d="M-1.02,.27 C-1.22,-.22 -.99,-.86 -.45,-1.08 C-.07,-1.24 .32,-1.24 .46,-1.03 Q.92,-1.12 1.06,-.62 Q1.15,-.22 1.02,.27 Q.89,-.34 .63,-.57 L.46,-.8 Q.21,-.63 -.1,-.43 L.03,-.66 Q-.36,-.29 -.85,-.08 Q-1.12,.35 -.97,.68 Q-1.31,.42 -1.02,.04 Z" />
    <path d="M-1.02,-.16 Q-.58,-.89 .2,-1.04 Q.43,-1.07 .46,-1.03 M-.92,-.48 Q-.5,-1.14 .14,-1.16 M-.84,-.1 Q-.31,-.57 .46,-.8 M.46,-1.03 Q.92,-.97 1.02,-.44" fill="none" stroke="#29130f" strokeWidth={0.018} strokeLinecap="round" />
  </g>
);
