import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONT, ease } from "../stickman/fx";
import { Fire, Snowfall, Wind } from "../stickman/weather";

// Static photo with a slow Ken Burns zoom/pan, an optional short label, and optional
// ambient weather (falling snow / blizzard wind / a fire glow) layered on top.
export const ImageScene: React.FC<{
  from: number;
  dur: number;
  src: string;
  tag?: string;
  zoomTo?: number;
  panX?: number;
  snow?: boolean;
  blizzard?: boolean; // heavier snow + wind, leaning sideways
  fire?: { x: number; y: number; s?: number };
}> = ({ dur, src, tag, zoomTo = 1.08, panX = 0, snow, blizzard, fire }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = 1 + (zoomTo - 1) * t;
  const tx = panX * t;
  const fade = interpolate(f, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0a0e14", opacity: fade }}>
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translateX(${tx}px)`,
          transformOrigin: "center center",
        }}
      />
      {(snow || blizzard) && (
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          {blizzard && <Wind f={f} seed={src} angle={100} speed={16} opacity={0.25} />}
          <Snowfall
            f={f}
            seed={src}
            angle={blizzard ? 22 : 5}
            speed={blizzard ? 11 : 4}
            count={blizzard ? 140 : 70}
            opacity={blizzard ? 0.9 : 0.6}
          />
        </svg>
      )}
      {fire && (
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <Fire f={f} x={fire.x} y={fire.y} s={fire.s ?? 1} seed={src} />
        </svg>
      )}
      {tag && (
        <div
          style={{
            position: "absolute",
            left: 80,
            top: 70,
            fontFamily: FONT.title,
            fontWeight: 800,
            fontSize: 42,
            letterSpacing: 2,
            color: "#fff",
            textShadow: "0 2px 14px rgba(0,0,0,0.75)",
            opacity: ease(f, 10, 24),
            textTransform: "uppercase",
          }}
        >
          {tag}
        </div>
      )}
    </AbsoluteFill>
  );
};
