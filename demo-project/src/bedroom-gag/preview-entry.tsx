import React from "react";
import { Composition, registerRoot, staticFile } from "remotion";
import { Face, PRESETS } from "./Face";
import { Stand, Wife } from "./Characters";
import { Hand, Arm } from "./Primitives";
import { Video, DURATION, FPS } from "./Video";

// Independent entry keeps review renders separate from the main composition registry.
const ModelComparison: React.FC = () => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ background: "#d5d5d3" }}>
    <defs>
      <clipPath id="wife-panel"><rect x={480} y={400} width={480} height={680} /></clipPath>
    </defs>
    {["husband_sheet.png", "wife_sheet.png", "expressions_sheet.png", "hands_sheet.png"].map((name, i) => (
      <g key={name}>
        <text x={i * 480 + 20} y={32} fontFamily="sans-serif" fontSize={22} fill="#222">CS{i + 1} · GPT model</text>
        <image href={staticFile(`bedroom-gag/${name}`)} x={i * 480} y={50} width={480} height={320} />
        <text x={i * 480 + 20} y={408} fontFamily="sans-serif" fontSize={22} fill="#222">SVG rig</text>
        {i > 0 && <line x1={i * 480} x2={i * 480} y1={0} y2={1080} stroke="#aaa" />}
      </g>
    ))}
    <Stand x={240} feet={1020} r={92} face={{ ...PRESETS.scheme, eyeOpen: 1, tilt: 0, brow: 0 }} talk={0} walk={0} dark={0} idp="review" />
    <g clipPath="url(#wife-panel)">
      <g transform="translate(480 420) scale(.444444)">
        <Wife x={540} y={650} t={0} p={{ ...PRESETS.scheme, eyeOpen: 1, tilt: 0, brow: 0 }} talk={0} cross />
      </g>
    </g>
    {Object.entries(PRESETS).map(([name, p], i) => (
      <g key={name}>
        <Face x={1080 + (i % 2) * 240} y={495 + Math.floor(i / 2) * 150} r={48} hair="husband" p={p} id={`review-${name}`} />
        <text x={1080 + (i % 2) * 240} y={563 + Math.floor(i / 2) * 150} textAnchor="middle" fontFamily="sans-serif" fontSize={17}>{name}</text>
      </g>
    ))}
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <Arm pts={[[1510, 520 + i * 130], [1580, 555 + i * 130], [1700, 510 + i * 130]]} w={8} />
        <Hand x={1700} y={510 + i * 130} r={28} flip={i % 2 ? -1 : 1} />
      </g>
    ))}
    <text x={1460} y={1020} fontFamily="sans-serif" fontSize={17}>Black hands follow CS1 / CS2.</text>
    <text x={1460} y={1046} fontFamily="sans-serif" fontSize={17}>CS4 supplies pose references.</text>
  </svg>
);

const PreviewRoot: React.FC = () => <>
  <Composition id="BedroomModelComparison" component={ModelComparison} durationInFrames={1} fps={FPS} width={1920} height={1080} />
  <Composition id="BedroomGagEp01" component={Video} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} />
</>;
registerRoot(PreviewRoot);
