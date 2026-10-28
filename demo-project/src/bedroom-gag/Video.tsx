import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import EP01 from "./ep01.json";
import { FaceP, faceAt } from "./Face";
import { Husband, Wife } from "./Characters";
import { Room, Mode } from "./Room";
import { WIDTH as W, HEIGHT as H, FPS } from "./config";
export { FPS } from "./config";
type Line = { who: "wife" | "husband"; text: string; start: number; end: number };
const ep = EP01 as { lines: Line[]; total: number };
export const DURATION = Math.ceil(ep.total * FPS);

// ---------- video ----------
export const Video: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const [l1, l2, l3, l4, l5, l6] = ep.lines;
  const cut = (l: Line) => l.end + 0.17;
  const b = [0, cut(l1), cut(l2), cut(l3), cut(l4), cut(l5), cut(l6)];
  const shot = b.filter((x) => t >= x).length - 1; // 0..6
  const lt = t - b[shot];
  const cur = ep.lines.find((l) => t >= l.start && t <= l.end + 0.05);
  const talk = (who: Line["who"]) => (cur && cur.who === who ? Math.max(0, Math.sin(f * 1.2)) ** 1.3 : 0);
  const dart = Math.sin(t * 2.2) > 0.2 ? 1 : -0.6; // husband's eyes shift between the wife and the door

  const hF0 = faceAt(t, [[0, "scheme"], [l2.start - 0.3, "smug"], [l4.start - 0.2, "smug"], [l6.start - 0.2, "grin"]]);
  const hFace: FaceP = { ...hF0, px: hF0.px * dart };
  const wFace = faceAt(t, [[0, "sleep"], [l1.start - 0.5, "groggy"], [l3.start - 0.05, "shock"], [l3.end, "angry"], [l5.start - 0.1, "glare"], [l5.end, "angry"], [l6.end, "glare"]], 0.3);

  const wide: Mode =
    shot === 0 ? { bg: "night", hMode: "legs", wMode: "lying" } :
    shot === 3 ? { bg: "lamp", hMode: "stand", wMode: "sit" } :
    { bg: "door", hMode: "exit", wMode: "sit" };
  const closeBg: Record<number, Mode> = {
    1: { bg: "night", hMode: "hidden", wMode: "lying" },
    2: { bg: "lamp", hMode: "hidden", wMode: "hidden" },
    4: { bg: "lamp", hMode: "hidden", wMode: "hidden" },
    5: { bg: "lamp", hMode: "hidden", wMode: "hidden" },
  };
  const focus: Record<number, [number, number, number]> = { 1: [650, 900, 2.0], 2: [200, 800, 2.2], 4: [330, 900, 2.0], 5: [850, 800, 2.0] };
  const isClose = shot in closeBg;
  const fz = focus[shot];
  const push = 1 + lt * 0.018; // slow push-in
  const shock = shot === 2 && lt < 0.4 ? Math.exp(-lt * 8) : 0;

  return (
    <AbsoluteFill style={{ background: "#0d1330" }}>
      {!isClose ? (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", transform: `scale(${1 + lt * 0.006})`, transformOrigin: "40% 50%" }}>
          <Room t={lt} m={wide} hFace={hFace} wFace={wFace} hTalk={talk("husband")} wTalk={talk("wife")} />
        </svg>
      ) : (
        <>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", filter: "blur(10px)", transform: `translate(${W / 2 - fz[0] * fz[2]}px, ${H / 2 - fz[1] * fz[2]}px) scale(${fz[2]})`, transformOrigin: "0 0" }}>
            <Room t={t} m={closeBg[shot]} hFace={hFace} wFace={wFace} hTalk={0} wTalk={0} />
          </svg>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", transform: `translate(${Math.sin(f * 40) * 10 * shock}px, ${Math.cos(f * 33) * 8 * shock}px) scale(${push})`, transformOrigin: "50% 45%" }}>
            {shot === 1 && <Husband t={t} p={hFace} talk={talk("husband")} x={560} y={760} />}
            {shot === 2 && <Wife t={t} p={wFace} talk={talk("wife")} x={560} y={880} />}
            {shot === 4 && <Wife t={t} p={wFace} talk={talk("wife")} x={470} y={820} cross />}
            {shot === 5 && <Husband t={t} p={hFace} talk={talk("husband")} x={520} y={740} />}
          </svg>
        </>
      )}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(5,8,25,0.45) 100%)", pointerEvents: "none" }} />
      {ep.lines.map((l, i) => (
        <Sequence key={i} from={Math.round(l.start * FPS)}>
          <Audio src={staticFile(`bedroom-gag/ep01/voice_${i}.mp3`)} />
        </Sequence>
      ))}
      <Sequence from={Math.round(l3.start * FPS)}>
        <Audio src={staticFile("bedroom-gag/ep01/pop.wav")} volume={0.35} />
      </Sequence>
      <Sequence from={Math.round(b[6] * FPS + 15)}>
        <Audio src={staticFile("bedroom-gag/ep01/whoosh.wav")} volume={0.25} />
      </Sequence>
    </AbsoluteFill>
  );
};
