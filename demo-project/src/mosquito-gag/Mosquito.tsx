import React from "react";

// Cartoon "tiger" mosquito drawn in local units (body ~270 long, facing LEFT at flip=1). Parts, back to front:
// far wing, far legs, striped abdomen, fuzzy thorax, head (antennae, proboscis, big glossy eyes with lids, mouth),
// near wing, near legs, pose extras (legs over the eyes, white flag), sweat drops.
// Wings flap near the frame rate so they read as a blur; `flap` 0 folds them back and still.
const INK = "#141317";
const BODY = "#2d2b35";
const BODY_HI = "#625f72";
const BAND = "#eeede6";
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const rad = (d: number) => (d * Math.PI) / 180;

export type MMouth = "grin" | "smile" | "wobble" | "oh" | "flat" | "laugh";
// puppy 0..1: huge shiny pupils + tears (begging); swirl 0..1: dizzy spirals instead of pupils; dead 0..1: X eyes
export type MMood = { eyeOpen: number; eyeScale: number; px: number; py: number; lid: number; mouth: MMouth; sweat: number; puppy?: number; swirl?: number; dead?: number };
export const MOODS = {
  sneaky: { eyeOpen: 0.62, eyeScale: 1, px: -0.55, py: 0.1, lid: 1, mouth: "grin", sweat: 0 },
  happy: { eyeOpen: 0.9, eyeScale: 1, px: -0.4, py: 0, lid: 0.2, mouth: "smile", sweat: 0 },
  shock: { eyeOpen: 1, eyeScale: 1.25, px: 0.5, py: 0, lid: -0.4, mouth: "oh", sweat: 0.4 },
  scared: { eyeOpen: 1, eyeScale: 1.1, px: -0.6, py: 0.1, lid: -1, mouth: "wobble", sweat: 1 },
  flat: { eyeOpen: 0.55, eyeScale: 1, px: 0, py: 0, lid: 0, mouth: "flat", sweat: 0.3 },
  hide: { eyeOpen: 0, eyeScale: 1, px: 0, py: 0, lid: 0, mouth: "wobble", sweat: 0.6 },
  laugh: { eyeOpen: 0, eyeScale: 1, px: 0, py: 0, lid: 0, mouth: "laugh", sweat: 0 },
  bliss: { eyeOpen: 0.3, eyeScale: 1, px: 0, py: 0.3, lid: -0.3, mouth: "smile", sweat: 0 },
  burn: { eyeOpen: 1, eyeScale: 1.3, px: 0, py: -0.3, lid: -0.6, mouth: "oh", sweat: 1 },
  beg: { eyeOpen: 1, eyeScale: 1.3, px: 0.15, py: 0.15, lid: -0.9, mouth: "wobble", sweat: 0, puppy: 1 },
  dizzy: { eyeOpen: 1, eyeScale: 1.1, px: 0, py: 0, lid: 0, mouth: "wobble", sweat: 0, swirl: 1 },
  dead: { eyeOpen: 1, eyeScale: 1, px: 0, py: 0, lid: 0, mouth: "wobble", sweat: 0, dead: 1 },
} satisfies Record<string, MMood>;
export type MoodName = keyof typeof MOODS;
const mixMood = (a: MMood, b: MMood, k: number): MMood => ({
  eyeOpen: lerp(a.eyeOpen, b.eyeOpen, k), eyeScale: lerp(a.eyeScale, b.eyeScale, k), px: lerp(a.px, b.px, k), py: lerp(a.py, b.py, k),
  lid: lerp(a.lid, b.lid, k), mouth: k < 0.5 ? a.mouth : b.mouth, sweat: lerp(a.sweat, b.sweat, k),
  puppy: lerp(a.puppy ?? 0, b.puppy ?? 0, k), swirl: lerp(a.swirl ?? 0, b.swirl ?? 0, k), dead: lerp(a.dead ?? 0, b.dead ?? 0, k),
});
export const moodAt = (t: number, ks: [number, MoodName][], blend = 0.15): MMood => {
  let cur: MMood = MOODS[ks[0][1]];
  for (let i = 1; i < ks.length; i++) {
    const k = Math.max(0, Math.min(1, (t - ks[i][0]) / blend));
    if (k > 0) cur = mixMood(MOODS[ks[i - 1][1]], MOODS[ks[i][1]], k * k * (3 - 2 * k));
  }
  return cur;
};

export type LegPose = "dangle" | "stiff" | "rub" | "cover" | "flag" | "sing" | "pray";
// [femur, tibia, tarsus] absolute angles in degrees (0 = backwards/+x, 90 = down, 180 = forwards)
const LEGS: Record<LegPose, number[][]> = {
  dangle: [[150, 110, 98], [105, 85, 95], [45, 75, 100]],
  stiff: [[158, 158, 158], [96, 96, 96], [28, 28, 28]],
  rub: [[150, 195, 172], [105, 85, 95], [45, 75, 100]],
  cover: [[250, 205, 150], [105, 85, 95], [45, 75, 100]],
  flag: [[235, 265, 275], [105, 85, 95], [45, 75, 100]],
  sing: [[150, 110, 98], [105, 85, 95], [45, 75, 100]], // front legs replaced by hand-placed points below
  pray: [[150, 110, 98], [105, 85, 95], [45, 75, 100]],
};
const LEN = [[34, 44, 52], [38, 50, 58], [42, 56, 66]];
const ATTACH = [[-14, 20], [0, 24], [14, 21]];

const legPts = (ax: number, ay: number, ang: number[], len: number[]) => {
  const pts = [[ax, ay]];
  let x = ax;
  let y = ay;
  ang.forEach((a, i) => {
    x += Math.cos(rad(a)) * len[i];
    y += Math.sin(rad(a)) * len[i];
    pts.push([x, y]);
  });
  return pts;
};

const Leg: React.FC<{ pts: number[][]; far?: boolean }> = ({ pts, far }) => {
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  return (
    <g opacity={far ? 0.75 : 1}>
      <path d={d} stroke={INK} strokeWidth={6.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={far ? "#1f1e25" : "#4a4756"} strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {pts.slice(1, 3).map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={2.6} fill={BAND} stroke={INK} strokeWidth={1} />
      ))}
      {/* white "sock" bands on the tarsus, the tiger-mosquito look */}
      {[0.3, 0.6].map((k) => {
        const [a, b] = [pts[2], pts[3]];
        return <circle key={k} cx={lerp(a[0], b[0], k)} cy={lerp(a[1], b[1], k)} r={2.1} fill={BAND} />;
      })}
    </g>
  );
};

const WING = "M0,0 C28,-24 98,-30 130,-9 C138,-2 126,12 100,13 C62,16 24,10 0,0 Z";
const Wing: React.FC<{ angle: number; far?: boolean; ghost?: number; burnt?: number }> = ({ angle, far, ghost, burnt = 0 }) => (
  <g transform={`translate(4 -22) rotate(${angle})`} opacity={(ghost ?? (far ? 0.55 : 0.85)) * (1 - burnt * 0.75)}>
    <path d={WING} fill={far ? "rgba(190,205,235,0.35)" : "url(#mq-wing)"} stroke="rgba(255,255,255,0.85)" strokeWidth={1.6} />
    {!ghost && (
      <g stroke="rgba(120,135,170,0.6)" strokeWidth={0.9} fill="none">
        <path d="M2,0 C40,-10 90,-14 128,-8 M6,1 C44,0 88,2 118,8 M30,-6 C40,-14 48,-18 56,-22 M64,-5 C74,-14 84,-20 92,-22 M60,0 C72,6 84,10 96,12" />
      </g>
    )}
  </g>
);

export const Mosquito: React.FC<{
  x: number; y: number; s: number; f: number; flip?: number; mood: MMood; legs?: LegPose; flap?: number;
  tilt?: number; tremble?: number; flagWave?: number; id: string;
  mic?: boolean; // tiny microphone in the front leg (legs "sing")
  belly?: number; // 0..1 abdomen swollen red with blood
  heat?: number; // 0..1 face glowing red + steam from the antennae (chili blood)
  char?: number; // 0..1 burnt black (eyes stay white)
}> = ({ x, y, s, f, flip = 1, mood, legs = "dangle", flap = 1, tilt = 0, tremble = 0, flagWave = 0, id, belly = 0, heat = 0, char = 0, mic = false }) => {
  const t = f / 30;
  const jx = tremble * (Math.sin(f * 2.9) * 2.2 + Math.sin(f * 5.3) * 1.2);
  const jy = tremble * Math.cos(f * 3.7) * 1.8;
  const bob = Math.sin(t * 9) * 2 * flap;
  // wing: rest angle folds back along the abdomen; flapping alternates between the up and down strokes every frame
  const rest = lerp(14, -28, flap);
  const wa = rest + flap * 38 * Math.sin(f * 2.6);
  const sway = (i: number) => (legs === "stiff" ? 0 : Math.sin(t * 3.2 + i * 1.3) * 7 * (flap > 0.2 ? 1 : 0.3));
  const pose = LEGS[legs];
  const rub = legs === "rub" ? Math.sin(t * 14) * 14 : 0;
  const legSet = (far: boolean) =>
    pose.map((ang, i) => {
      const a = ang.map((v, j) => v + (j > 0 ? sway(i) * (j === 1 ? 0.6 : 1) : sway(i) * 0.3) + (i === 0 && j === 2 ? rub : 0) + (far ? (i === 0 && (legs === "cover" || legs === "flag") ? 0 : -8) : 0));
      const [ax, ay] = ATTACH[i];
      return legPts(ax + (far ? 7 : 0), ay - (far ? 4 : 0), a, LEN[i]);
    });
  const nearLegs = legSet(false);
  const farLegs = legSet(true);
  const overEyes = legs === "cover";
  // covering: the far front leg crosses the near one in an X over both eyes
  if (overEyes) {
    const w = Math.sin(t * 11) * 2;
    nearLegs[0] = [[-14, 20], [-30, -2], [-80, -27 + w], [-102, -6 + w]];
    farLegs[0] = [[-4, 14], [-22, -38], [-82, -2 - w], [-106, -12 - w]];
  }
  // singing: near front leg holds the mic under the mouth, far front leg reaches out dramatically; praying: both together
  const frontUp = legs === "sing" || legs === "pray";
  if (legs === "sing") {
    const reachOut = Math.sin(t * 2.4) * 6;
    nearLegs[0] = [[-14, 20], [-34, 30], [-52, 40], [-60, 36]];
    farLegs[0] = [[-4, 14], [-30, 32], [-70, 34], [-102, 10 + reachOut * 1.5]];
  }
  if (legs === "pray") {
    nearLegs[0] = [[-14, 20], [-40, 30], [-72, 24], [-94, 4]];
    farLegs[0] = [[-4, 14], [-36, 26], [-70, 18], [-93, 0]];
  }

  // eyes: far eye sits higher and smaller, both look the same way
  const eyes = [
    { cx: -40, cy: -20, r: 15 * mood.eyeScale },
    { cx: -60, cy: -11, r: 18.5 * mood.eyeScale },
  ];
  const lw = 2.2;
  const bl = Math.min(1, belly);
  const mx = -54;
  const my = 14;
  const flagPt = nearLegs[0][3];
  return (
    <g transform={`translate(${x + jx * s} ${y + (jy + bob) * s}) scale(${s * flip} ${s}) rotate(${tilt})`}>
      <defs>
        <radialGradient id={`mq-body-${id}`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor={BODY_HI} />
          <stop offset="0.7" stopColor={BODY} />
          <stop offset="1" stopColor="#1b1a20" />
        </radialGradient>
        <linearGradient id="mq-wing" x1="0" y1="0" x2="1" y2="0.3">
          <stop offset="0" stopColor="rgba(235,242,255,0.65)" />
          <stop offset="0.6" stopColor="rgba(205,225,255,0.35)" />
          <stop offset="1" stopColor="rgba(240,230,255,0.5)" />
        </linearGradient>
        {eyes.map((e, i) => (
          <clipPath key={i} id={`mq-eye-${id}-${i}`}>
            <circle cx={e.cx} cy={e.cy} r={e.r} />
          </clipPath>
        ))}
      </defs>

      {/* far wing + motion ghosts */}
      {flap > 0.3 && <Wing angle={rest - 38} far ghost={0.13 * flap} />}
      <Wing angle={wa - 9} far burnt={char} />
      {farLegs.map((p, i) => <Leg key={i} pts={p} far />)}

      {/* abdomen: 7 tapering segments, dark with a white band at the front of each */}
      <g transform={`translate(24 8) rotate(${16 + Math.sin(t * 4) * 3 * flap})`}>
        {Array.from({ length: 7 }, (_, i) => {
          const sx = 6 + i * 15 * (1 + bl * 0.15);
          const ry = (20 - i * 1.9) * (1 + bl * Math.sin(Math.PI * (i + 1) / 8) * 0.75);
          return (
            <g key={i}>
              <ellipse cx={sx} cy={0} rx={13 * (1 + bl * 0.3)} ry={ry} fill={`url(#mq-body-${id})`} stroke={INK} strokeWidth={lw} />
              {bl > 0 && <ellipse cx={sx} cy={0} rx={13 * (1 + bl * 0.3)} ry={ry} fill="#c4202c" opacity={bl * 0.85} stroke={INK} strokeWidth={lw} />}
              {bl > 0.5 && <ellipse cx={sx - 3} cy={-ry * 0.45} rx={4} ry={ry * 0.2} fill="#ff9aa0" opacity={(bl - 0.5) * 1.6} />}
              {char > 0 && <ellipse cx={sx} cy={0} rx={13 * (1 + bl * 0.3)} ry={ry} fill="#0c0b0d" opacity={char * 0.92} stroke={INK} strokeWidth={lw} />}
              <path d={`M${sx - 6},${-ry * 0.92} Q${sx - 9},0 ${sx - 6},${ry * 0.92}`} stroke={BAND} strokeWidth={3.2} fill="none" strokeLinecap="round" opacity={1 - bl * 0.6} />
            </g>
          );
        })}
        <path d="M104,-2 L116,0 L104,4 Z" fill={INK} />
        {/* belly > 1: blown up into a round blood balloon (stretched white bands, shine) */}
        {belly > 1 && (() => {
          const fat = Math.min(1, belly - 1);
          const rx = lerp(62, 92, fat);
          const ry = lerp(30, 78, fat);
          const cx = lerp(52, 70, fat);
          return (
            <g opacity={Math.min(1, (belly - 1) * 6)}>
              <ellipse cx={cx} cy={0} rx={rx} ry={ry} fill="#c4202c" stroke={INK} strokeWidth={lw * 1.2} />
              {[-0.45, 0, 0.45].map((k) => (
                <path key={k} d={`M${cx + k * rx - 6},${-ry * Math.sqrt(1 - k * k) * 0.94} Q${cx + k * rx - 16},0 ${cx + k * rx - 6},${ry * Math.sqrt(1 - k * k) * 0.94}`} stroke="#f2d6d0" strokeWidth={3} fill="none" opacity={0.45} strokeLinecap="round" />
              ))}
              <ellipse cx={cx - rx * 0.35} cy={-ry * 0.5} rx={rx * 0.22} ry={ry * 0.14} fill="#ff9aa0" opacity={0.85} transform={`rotate(-25 ${cx - rx * 0.35} ${-ry * 0.5})`} />
              <circle cx={cx - rx * 0.12} cy={-ry * 0.62} r={4} fill="#fff" opacity={0.8} />
              <path d={`M${cx + rx - 2},-3 L${cx + rx + 12},0 L${cx + rx - 2},4 Z`} fill={INK} />
            </g>
          );
        })()}
      </g>

      {/* thorax with fuzz and the white lyre mark */}
      <g>
        {Array.from({ length: 16 }, (_, i) => {
          const a = rad(190 + i * 11);
          return <line key={i} x1={Math.cos(a) * 28} y1={Math.sin(a) * 24} x2={Math.cos(a) * 34} y2={Math.sin(a) * 30} stroke={INK} strokeWidth={1.6} strokeLinecap="round" />;
        })}
        <ellipse cx={0} cy={0} rx={31} ry={27} fill={`url(#mq-body-${id})`} stroke={INK} strokeWidth={lw} transform="rotate(-10)" />
        {char > 0 && <ellipse cx={0} cy={0} rx={31} ry={27} fill="#0c0b0d" opacity={char * 0.92} transform="rotate(-10)" />}
        <path d="M-12,-16 Q-2,-2 -6,14 M2,-19 Q10,-4 6,14" stroke={BAND} strokeWidth={2.6} fill="none" strokeLinecap="round" opacity={0.9} />
      </g>

      {/* head */}
      <g>
        {/* antennae: feathery curves */}
        {[[-46, -32, -72, -80], [-60, -28, -96, -66]].map(([x0, y0, x1, y1], i) => (
          <g key={i} opacity={i ? 1 : 0.75}>
            <path d={`M${x0},${y0} Q${(x0 + x1) / 2 + 8},${(y0 + y1) / 2 - 6} ${x1 + Math.sin(t * 5 + i) * 2},${y1}`} stroke={INK} strokeWidth={2.2} fill="none" strokeLinecap="round" />
            {[0.3, 0.45, 0.6, 0.75, 0.9].map((k) => {
              const px = lerp(x0, x1, k);
              const py = lerp(y0, y1, k) - Math.sin(Math.PI * k) * 5;
              return <path key={k} d={`M${px - 5},${py - 1} L${px + 5},${py + 1}`} stroke={INK} strokeWidth={1.3} strokeLinecap="round" />;
            })}
          </g>
        ))}
        {/* proboscis: long tapered needle with a darker tip */}
        <path d="M-72,3 Q-106,11 -148,28 L-147,31 Q-106,16 -70,10 Z" fill="#3b3540" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
        <path d="M-134,23 L-148,28 L-147,31 L-133,27 Z" fill="#9a3a3a" />
        <circle cx={-48} cy={-5} r={29} fill={`url(#mq-body-${id})`} stroke={INK} strokeWidth={lw} />
        {heat > 0 && <circle cx={-48} cy={-5} r={29} fill="#ff3a22" opacity={heat * 0.75} stroke={INK} strokeWidth={lw} />}
        {char > 0 && <circle cx={-48} cy={-5} r={29} fill="#0c0b0d" opacity={char * 0.92} stroke={INK} strokeWidth={lw} />}
        {heat > 0.3 &&
          [[-72, -80], [-96, -66]].map(([ax, ay], i) =>
            [0, 1, 2].map((j) => {
              const ph = (t * 1.6 + j / 3 + i * 0.5) % 1;
              return <circle key={`${i}${j}`} cx={ax + Math.sin(ph * 7 + j) * 6} cy={ay - ph * 60} r={5 + ph * 12} fill="#f4f4f4" opacity={(heat - 0.3) * (1 - ph) * 0.9} />;
            }),
          )}
        {mood.mouth === "laugh" ? (
          eyes.map((e, i) => (
            <path key={i} d={`M${e.cx - e.r * 0.8},${e.cy + e.r * 0.2} Q${e.cx},${e.cy - e.r * 0.8} ${e.cx + e.r * 0.8},${e.cy + e.r * 0.2}`} stroke={INK} strokeWidth={lw * 1.4} fill="none" strokeLinecap="round" />
          ))
        ) : eyes.map((e, i) => {
          const open = Math.max(0, Math.min(1, mood.eyeOpen));
          const puppy = mood.puppy ?? 0;
          const swirl = mood.swirl ?? 0;
          const pr = e.r * lerp(mood.eyeScale > 1.15 ? 0.32 : 0.46, 0.68, puppy);
          const pcx = e.cx + mood.px * e.r * 0.42;
          const pcy = e.cy + mood.py * e.r * 0.35;
          // lid: slanted line; lid>0 = sly/angry (drops towards the front), lid<0 = worried (rises towards the front)
          const top = e.cy - e.r + 2 * e.r * (1 - open);
          const slant = mood.lid * e.r * 0.45;
          return (
            <g key={i}>
              <circle cx={e.cx} cy={e.cy} r={e.r} fill="#fbfaf4" stroke={INK} strokeWidth={lw} />
              <g clipPath={`url(#mq-eye-${id}-${i})`}>
                {(mood.dead ?? 0) > 0.5 ? (
                  <path d={`M${e.cx - e.r * 0.55},${e.cy - e.r * 0.55} L${e.cx + e.r * 0.55},${e.cy + e.r * 0.55} M${e.cx + e.r * 0.55},${e.cy - e.r * 0.55} L${e.cx - e.r * 0.55},${e.cy + e.r * 0.55}`} stroke={INK} strokeWidth={lw * 1.5} strokeLinecap="round" />
                ) : swirl > 0.5 ? (
                  <path transform={`rotate(${t * 720} ${e.cx} ${e.cy})`} d={Array.from({ length: 28 }, (_, j) => {
                    const a = j * 0.55;
                    const rr = (j / 27) * e.r * 0.85;
                    return `${j ? "L" : "M"}${(e.cx + Math.cos(a) * rr).toFixed(1)},${(e.cy + Math.sin(a) * rr).toFixed(1)}`;
                  }).join(" ")} stroke={INK} strokeWidth={lw * 0.9} fill="none" strokeLinecap="round" />
                ) : (
                  <>
                    <circle cx={pcx} cy={pcy} r={pr} fill="#8e1b1b" />
                    <circle cx={pcx} cy={pcy} r={pr * 0.55} fill={INK} />
                    <circle cx={pcx + pr * 0.35} cy={pcy - pr * 0.4} r={pr * 0.28} fill="#fff" />
                    {puppy > 0.3 && <circle cx={pcx - pr * 0.35} cy={pcy + pr * 0.3} r={pr * 0.14} fill="#fff" opacity={puppy} />}
                    {puppy > 0.3 && <ellipse cx={pcx} cy={pcy + pr * 0.6} rx={pr * 0.9} ry={pr * 0.25} fill="#9fd8ff" opacity={puppy * 0.55} />}
                  </>
                )}
                {open < 0.98 && (
                  <path d={`M${e.cx - e.r * 1.2},${top + slant - e.r * 3} L${e.cx + e.r * 1.2},${top - slant - e.r * 3} L${e.cx + e.r * 1.2},${top - slant} L${e.cx - e.r * 1.2},${top + slant} Z`} fill={BODY} />
                )}
              </g>
              {open < 0.98 && <line x1={e.cx - e.r} y1={top + slant * 0.85} x2={e.cx + e.r} y2={top - slant * 0.85} stroke={INK} strokeWidth={lw * 1.1} strokeLinecap="round" />}
              <circle cx={e.cx} cy={e.cy} r={e.r} fill="none" stroke={INK} strokeWidth={lw} />
            </g>
          );
        })}
        {mood.mouth === "grin" && (
          <g>
            <path d={`M${mx - 9},${my - 2} Q${mx},${my + 9} ${mx + 13},${my - 1} Q${mx + 2},${my + 3} ${mx - 9},${my - 2} Z`} fill="#fff" stroke={INK} strokeWidth={1.5} strokeLinejoin="round" />
            <path d={`M${mx - 3},${my + 1} L${mx - 2},${my + 4} M${mx + 4},${my + 1} L${mx + 4},${my + 4}`} stroke={INK} strokeWidth={0.9} />
          </g>
        )}
        {mood.mouth === "laugh" && (
          <g>
            <path d={`M${mx - 12},${my - 3} Q${mx + 2},${my - 1} ${mx + 15},${my - 4} Q${mx + 10},${my + 14} ${mx},${my + 14} Q${mx - 10},${my + 13} ${mx - 12},${my - 3} Z`} fill="#3a0d10" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
            <ellipse cx={mx + 1} cy={my + 9} rx={6} ry={3.5} fill="#e0606c" />
          </g>
        )}
        {mood.mouth === "smile" &&<path d={`M${mx - 8},${my} Q${mx + 1},${my + 7} ${mx + 11},${my - 1}`} stroke={INK} strokeWidth={1.8} fill="none" strokeLinecap="round" />}
        {mood.mouth === "flat" && <line x1={mx - 6} y1={my + 2} x2={mx + 9} y2={my + 1} stroke={INK} strokeWidth={1.8} strokeLinecap="round" />}
        {mood.mouth === "oh" && <ellipse cx={mx + 2} cy={my + 3} rx={4.5} ry={6} fill="#3a0d10" stroke={INK} strokeWidth={1.5} />}
        {mood.mouth === "wobble" && (
          <path d={`M${mx - 9},${my + 3} l4,-3 l4,3 l4,-3 l4,3 l4,-3`} stroke={INK} strokeWidth={1.7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </g>

      {/* near wing + ghost */}
      {flap > 0.3 && <Wing angle={rest + 38} ghost={0.16 * flap} />}
      <Wing angle={wa} burnt={char} />
      {nearLegs.map((p, i) => <Leg key={i} pts={p} />)}
      {(overEyes || frontUp) && <Leg pts={farLegs[0]} />}
      {legs === "sing" && mic && (
        <g>
          <line x1={-56} y1={46} x2={-66} y2={22} stroke="#1b1b1f" strokeWidth={5} strokeLinecap="round" />
          <circle cx={-68} cy={17} r={7.5} fill="#8a8d96" stroke={INK} strokeWidth={1.6} />
          <path d="M-73,15 L-63,15 M-74,19 L-62,19 M-68,10 L-68,24" stroke="#55585f" strokeWidth={0.9} />
        </g>
      )}
      {/* tears while begging: two streams falling from the eyes */}
      {(mood.puppy ?? 0) > 0.4 &&
        eyes.map((e, i) =>
          [0, 1].map((j) => {
            const ph = (t * 1.4 + j / 2 + i * 0.3) % 1;
            return <path key={`${i}${j}`} transform={`translate(${e.cx + 2} ${e.cy + e.r * 0.8 + ph * 46})`} opacity={(mood.puppy ?? 0) * (1 - ph)} d="M0,-6 Q4,0 3,3 Q0,6 -3,3 Q-4,0 0,-6 Z" fill="#a9dcff" stroke="#2a6fa3" strokeWidth={1} />;
          }),
        )}

      {legs === "flag" && (
        <g transform={`translate(${flagPt[0]} ${flagPt[1]})`}>
          <line x1={0} y1={10} x2={-4} y2={-78} stroke="#c79a62" strokeWidth={3.2} strokeLinecap="round" />
          <path d={`M-4,-78 Q${-28 - flagWave * 4},${-86 + Math.sin(t * 9) * 4 * flagWave} -52,${-74 + Math.sin(t * 9 + 1) * 6 * flagWave} Q${-30},${-62 + Math.sin(t * 9 + 2) * 4 * flagWave} -4,-54 Z`} fill="#fbfbf6" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
        </g>
      )}

      {/* sweat: drops spawn at the top of the head and slide down */}
      {mood.sweat > 0.05 &&
        [0, 1, 2].map((i) => {
          const ph = (t * 0.9 + i / 3) % 1;
          const dx = [-30, -62, -18][i];
          const dy = -32 + ph * 34;
          return (
            <path key={i} opacity={mood.sweat * Math.sin(Math.PI * ph)} transform={`translate(${dx} ${dy})`} d="M0,-7 Q5,0 3.5,3.5 Q0,7 -3.5,3.5 Q-5,0 0,-7 Z" fill="#a9dcff" stroke="#2a6fa3" strokeWidth={1.1} />
          );
        })}
    </g>
  );
};
