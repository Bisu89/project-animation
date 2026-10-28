import React, { useId } from "react";
import { PALETTE } from "./Face";

export const Shirt: React.FC<{ x: number; y: number; r: number; height: number }> = ({ x, y, r, height }) => {
  const clip = `shirt-${useId().replace(/:/g, "")}`;
  const outline = `M-.28,0 L-.68,.08 L-.94,.54 L-.7,.65 L-.6,.42 L-.6,${height} Q0,${height + .06} .6,${height} L.6,.42 L.7,.65 L.94,.54 L.68,.08 L.28,0 Z`;
  return <g transform={`translate(${x} ${y}) scale(${r})`}>
    <defs><clipPath id={clip}><path d={outline} /></clipPath></defs>
    <path d={outline} fill={PALETTE.husbandShirt} stroke={PALETTE.ink} strokeWidth={.045} strokeLinejoin="round" />
    <g clipPath={`url(#${clip})`}>
      {Array.from({ length: Math.ceil(height / .25) }, (_, i) => (
        <path key={i} d={`M-1,${.17 + i * .25} Q0,${.25 + i * .25} 1,${.17 + i * .25}`} stroke="#e9ecf5" strokeWidth={.035} fill="none" />
      ))}
    </g>
    <path d="M-.25,0 Q0,.35 .25,0" fill={PALETTE.skin} stroke={PALETTE.ink} strokeWidth={.03} />
  </g>;
};
