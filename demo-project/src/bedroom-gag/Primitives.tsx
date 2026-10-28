import React from "react";
import { PALETTE } from "./Face";
const INK = PALETTE.ink;

export const Hand: React.FC<{ x: number; y: number; r?: number; flip?: number }> = ({ x, y, r = 14, flip = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${r * flip} ${r})`}>
    <path d="M-.75,-.65 Q-.2,-1.2 .45,-.8 Q.88,-.6 .98,-.12 Q1.12,.36 .82,.49 Q.6,.56 .46,.2 L.48,.82 Q.4,1.15 .13,.98 L.02,.6 Q.12,1.15 -.18,1.12 Q-.48,1.1 -.5,.7 Q-.6,1.04 -.85,.78 Q-1.12,.24 -.75,-.65 Z" fill={INK} />
  </g>
);
export const Arm: React.FC<{ pts: number[][]; w?: number }> = ({ pts, w = 6 }) => (
  <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={INK} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
);

