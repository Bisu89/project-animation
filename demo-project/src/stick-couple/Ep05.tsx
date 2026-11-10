import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import EP05 from "./ep05.json";
import { GROUND_Y, H, SEAT_Y, W } from "./Park";
import { CAL, DOOR_MID, DoorPanel, LivingRoom, Sofa, Telly } from "./LivingRoom";
import { Emo, INK, Look, Pose, Pt, SEATED, STANDING, Stick } from "./Stick";
import { backOut, Captions, clamp01, FONT, FPS, Hook, keys, keysPt, LaughTag, Line, makeWords } from "./common";

// Stick couple, ep05 "What Day Is It?" (9:16). Beats are in content/stick-couple/README.md; cut times come from the
// voice timings in ep05.json (`python scripts/gen_gag_voice.py ep05 stick-couple`). Set in a living room (LivingRoom.tsx).
const ep = EP05 as unknown as { hook: string; lines: Line[] };
const [L0, L1, L2, L3] = ep.lines;
const WORDS = makeWords(ep.lines);

// ---------- timeline ----------
const T_IN = 0.1; // she walks in and stops in front of the TV
const T_STOP = 0.9;
const T_PANIC = L0.end + 0.06; // his close-up: thought bubble cake? ring? heart?
const T_CAL = T_PANIC + 1.35; // close-up of the blank calendar
const T_WIDE1 = L1.start - 0.1; // wide: "Of course I know! Wait right here!"
const T_STAND = L1.start + 0.45;
const T_RUN = L1.end - 0.45; // runs out of the door
const T_GONE = T_RUN + 0.3; // through the door, it slams
const T_CARD = T_GONE + 0.35; // "10 minutes later..."
const T_BURST = T_CARD + 0.85; // door flies open, he dashes in with the gifts
const T_BLANK = L2.end + 0.1; // her close-up: blank stare, two blinks
const T_BAG = L3.start; // she lifts the trash bag
const T_TWO = L3.start + 1.25; // two-shot for "You forgot the trash. Again."
const T_FROZEN = L3.end + 0.1; // his close-up, frozen, a petal falls
const T_WALK = T_FROZEN + 1.4; // wide: he carries the trash out, she plays his game
const T_LAUGH = T_WALK + 2.1;
const T_END = T_LAUGH + 2.5;
export const DURATION = Math.ceil(T_END * FPS);

const HIP = SEAT_Y - 4;
const STAND_HIP = GROUND_Y - 4 - STANDING.feet[1][1];
const BOY_SEAT = 420;
const BOY_STAND = 330;
const GIRL_X = 760;
const GIRL_SEAT = 600;

const talkOf = (who: Line["who"], t: number, f: number) => {
  const l = ep.lines.find((x) => x.who === who && t >= x.start && t <= x.end);
  return l ? Math.max(0, Math.sin(f * 1.1)) ** 1.2 : 0;
};
const walkFeet = (ph: number, stride = 45): [Pt, Pt] => [
  [-22 + Math.sin(ph) * stride, STANDING.feet[0][1] - Math.max(0, Math.cos(ph)) * 22],
  [26 - Math.sin(ph) * stride, STANDING.feet[1][1] - Math.max(0, -Math.cos(ph)) * 22],
];
const mixFeet = (a: [Pt, Pt], b: [Pt, Pt], k: number): [Pt, Pt] => [
  [a[0][0] + (b[0][0] - a[0][0]) * k, a[0][1] + (b[0][1] - a[0][1]) * k],
  [a[1][0] + (b[1][0] - a[1][0]) * k, a[1][1] + (b[1][1] - a[1][1]) * k],
];
// where a hand target lands in the world (scale 1; the rig keeps hand targets in the un-leaned frame)
const handAt = (x: number, hip: number, dir: number, p: Pt): Pt => [x + dir * p[0], hip + p[1]];

// ---------- props ----------
const Controller: React.FC = () => (
  <g>
    <path d="M-38,-14 Q-40,-22 -26,-22 L26,-22 Q40,-22 38,-14 L44,14 Q46,26 32,24 L20,10 L-20,10 L-32,24 Q-46,26 -44,14 Z" fill="#3a3f4b" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M-24,-8 L-24,4 M-30,-2 L-18,-2" stroke="#cfd4e0" strokeWidth={4} strokeLinecap="round" />
    <circle cx={20} cy={-8} r={4} fill="#ff6f61" />
    <circle cx={28} cy={0} r={4} fill="#7be07b" />
  </g>
);

const Roses: React.FC<{ droop?: number }> = ({ droop = 0 }) => (
  <g transform={`rotate(${droop})`}>
    {[-14, 0, 14].map((a, i) => (
      <line key={i} x1={0} y1={0} x2={Math.sin((a * Math.PI) / 180) * 80} y2={-80} stroke="#3f8f3c" strokeWidth={5} />
    ))}
    {[
      [-24, -86],
      [0, -100],
      [24, -84],
    ].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y})`}>
        <circle r={19} fill="#e8354a" stroke={INK} strokeWidth={4} />
        <path d="M-8,2 Q0,-12 9,-2 Q4,8 -4,4" stroke="#a51d30" strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    ))}
    <path d="M-12,-56 Q-34,-60 -40,-44 Q-24,-40 -12,-56 Z M12,-56 Q34,-62 40,-46 Q24,-40 12,-56 Z" fill="#5aa857" stroke={INK} strokeWidth={3} />
    <path d="M-34,-64 L34,-64 L10,12 L-10,12 Z" fill="#ffd1e0" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M-14,-10 Q0,4 14,-10" stroke="#ff7aa2" strokeWidth={6} fill="none" strokeLinecap="round" />
  </g>
);

const Bear: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`} stroke={INK} strokeWidth={4}>
    <ellipse cx={0} cy={0} rx={30} ry={34} fill="#b9814f" />
    <ellipse cx={0} cy={6} rx={17} ry={20} fill="#e8c49a" strokeWidth={0} />
    <circle cx={-26} cy={-58} r={12} fill="#b9814f" />
    <circle cx={26} cy={-58} r={12} fill="#b9814f" />
    <circle cx={0} cy={-44} r={30} fill="#b9814f" />
    <ellipse cx={0} cy={-36} rx={12} ry={9} fill="#e8c49a" />
    <circle cx={0} cy={-39} r={4} fill={INK} strokeWidth={0} />
    <circle cx={-11} cy={-50} r={4} fill={INK} strokeWidth={0} />
    <circle cx={11} cy={-50} r={4} fill={INK} strokeWidth={0} />
    <path d="M-14,-20 L0,-14 L14,-20 L14,-8 L0,-14 L-14,-8 Z" fill="#e8354a" strokeWidth={3} strokeLinejoin="round" />
  </g>
);

// cake box held from below (hand at 0,0), teddy bear sitting on top
const CakeBox: React.FC<{ bear?: boolean }> = ({ bear = true }) => (
  <g>
    {bear && (
      <g transform="translate(0 -62)">
        <Bear s={0.8} />
      </g>
    )}
    <rect x={-60} y={-44} width={120} height={70} rx={6} fill="#fff4f7" stroke={INK} strokeWidth={5} />
    <rect x={-8} y={-44} width={16} height={70} fill="#ff7aa2" />
    <rect x={-60} y={-14} width={120} height={12} fill="#ff7aa2" />
    <path d="M0,-44 Q-24,-64 -28,-48 Q-20,-38 0,-44 Q24,-64 28,-48 Q20,-38 0,-44 Z" fill="#ff7aa2" stroke={INK} strokeWidth={4} />
  </g>
);

// black bin bag hanging from the hand (knot at 0,0)
const TrashBag: React.FC<{ sway: number }> = ({ sway }) => (
  <g transform={`rotate(${sway})`}>
    <path d="M-10,-6 Q-26,-22 -14,-26 Q-4,-14 0,-4 Q4,-14 14,-26 Q26,-22 10,-6 Z" fill="#2a2a30" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-8,0 Q-62,40 -58,104 Q-52,150 0,152 Q52,150 58,104 Q62,40 8,0 Z" fill="#2f3037" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M-30,50 Q-36,90 -24,124 M22,40 Q30,80 26,110" stroke="#5a5c68" strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d="M-40,150 L-46,166 M30,150 L36,162" stroke="#2f3037" strokeWidth={0} />
  </g>
);

const Sparkles: React.FC<{ t: number; at: Pt; k: number }> = ({ t, at, k }) => (
  <g opacity={k}>
    {[0, 1, 2, 3].map((i) => {
      const s = Math.abs(Math.sin(t * 5 + i * 1.7));
      const [dx, dy] = [[-120, -150], [130, -120], [-140, 40], [150, 60]][i];
      return <path key={i} transform={`translate(${at[0] + dx} ${at[1] + dy}) scale(${0.5 + s * 0.7})`} d="M0,-20 L5,-5 L20,0 L5,5 L0,20 L-5,5 L-20,0 L-5,-5 Z" fill="#ffd84d" stroke={INK} strokeWidth={3} />;
    })}
  </g>
);

// ---------- thought bubble: cake? ring? heart? each crossed out ----------
const IconCake = () => (
  <g>
    <rect x={-56} y={-20} width={112} height={56} rx={8} fill="#ffd1e0" stroke={INK} strokeWidth={6} />
    <path d="M-56,-4 Q-42,10 -28,-4 Q-14,10 0,-4 Q14,10 28,-4 Q42,10 56,-4" stroke="#fff" strokeWidth={7} fill="none" />
    {[-28, 0, 28].map((x) => (
      <g key={x}>
        <rect x={x - 5} y={-52} width={10} height={32} fill="#7cc8f5" stroke={INK} strokeWidth={3} />
        <path d={`M${x},-56 Q${x - 7},-64 ${x},-76 Q${x + 7},-64 ${x},-56 Z`} fill="#ffb238" />
      </g>
    ))}
  </g>
);
const IconRing = () => (
  <g>
    <circle cx={0} cy={14} r={40} fill="none" stroke="#f2c14e" strokeWidth={14} />
    <circle cx={0} cy={14} r={40} fill="none" stroke={INK} strokeWidth={3} />
    <path d="M-22,-40 L22,-40 L32,-28 L0,0 L-32,-28 Z" fill="#bfe6ff" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
  </g>
);
const IconHeart = () => <path d="M0,40 C-80,-14 -40,-72 0,-30 C40,-72 80,-14 0,40 Z" fill="#ff6f91" stroke={INK} strokeWidth={6} />;

const Bubble: React.FC<{ t: number }> = ({ t }) => {
  const k = t - T_PANIC;
  if (k < 0.12) return null;
  const items: [React.ReactNode, number, number][] = [
    [<IconCake key="c" />, 0.2, 0.5],
    [<IconRing key="r" />, 0.58, 0.88],
    [<IconHeart key="h" />, 0.96, 1.22],
  ];
  const cur = items.filter(([, at]) => k >= at).pop();
  return (
    <g transform={`translate(600 520) scale(${backOut((k - 0.12) / 0.25)})`}>
      {[
        [-92, 175, 14],
        [-70, 140, 22],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#fff" stroke={INK} strokeWidth={6} />
      ))}
      <path d="M-120,40 Q-150,-20 -100,-60 Q-90,-120 -20,-112 Q30,-150 80,-110 Q150,-110 140,-40 Q180,20 120,70 Q100,120 30,100 Q-30,130 -70,95 Q-140,100 -120,40 Z" fill="#fff" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      {cur && (
        <g transform={`scale(${backOut((k - cur[1]) / 0.2)})`}>
          <g transform="translate(-20 0)">{cur[0]}</g>
          <text x={78} y={34} textAnchor="middle" fontFamily={FONT} fontSize={90} fill={INK}>
            ?
          </text>
          {k >= cur[2] && <path d="M-80,-50 L60,50 M60,-50 L-80,50" stroke="#e0202a" strokeWidth={14} strokeLinecap="round" strokeDasharray={180} strokeDashoffset={180 * (1 - clamp01((k - cur[2]) / 0.08))} />}
        </g>
      )}
    </g>
  );
};

// ---------- the scene ----------
const doorOpen = (t: number) =>
  keys(t, [
    [T_RUN + 0.04, 0],
    [T_RUN + 0.14, 1],
    [T_GONE, 1],
    [T_GONE + 0.07, 0],
    [T_BURST - 0.06, 0],
    [T_BURST, 1],
    [T_BURST + 0.5, 1],
    [T_BURST + 0.75, 0],
    [T_WALK + 0.45, 0],
    [T_WALK + 0.7, 1],
    [T_WALK + 1.15, 1],
    [T_WALK + 1.45, 0],
  ]);

const Scene: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const final = t >= T_WALK;

  // --- girl ---
  let gx = GIRL_X;
  let gHip = STAND_HIP;
  let gDir: 1 | -1 = -1;
  let gFeet: [Pt, Pt] = STANDING.feet;
  let gNear: Pt = [-5, -150];
  let gFar: Pt = [38, -162];
  let gHeld: React.ReactNode;
  let gEmo: Emo = "suspicious";
  let gGaze: Pt = [0.8, 0];
  if (final) {
    gx = GIRL_SEAT;
    gHip = HIP;
    gDir = 1;
    gFeet = SEATED.feet;
    gNear = [108, -150 + Math.abs(Math.sin(t * 14)) * 6];
    gFar = [88, -145];
    gHeld = <Controller />;
    gEmo = "happy";
    gGaze = [0.9, -0.1];
  } else {
    if (t < T_STOP) {
      gx = GIRL_X + (T_STOP - Math.max(t, T_IN)) * 560;
      gFeet = walkFeet((t - T_IN) * 11);
      gNear = [25 + Math.sin((t - T_IN) * 11) * 30, -20];
      gFar = [20 - Math.sin((t - T_IN) * 11) * 30, -20];
    } else {
      // arms folded, foot tapping while she waits
      const tap = t < T_WIDE1 ? Math.max(0, Math.sin(t * 12)) * 16 : 0;
      gFeet = [STANDING.feet[0], [STANDING.feet[1][0] + 8, STANDING.feet[1][1] - tap]];
    }
    if (t >= T_WIDE1) gEmo = "neutral";
    if (t >= T_BLANK) gEmo = "neutral";
    if (t >= T_BAG) gEmo = "tired";
    if (t >= T_BAG) {
      gNear = keysPt(t, [
        [T_BAG, [10, -40]],
        [T_BAG + 0.3, [112, -222]],
      ]);
      gHeld = <TrashBag sway={Math.sin((t - T_BAG) * 5) * 6 * Math.exp(-(t - T_BAG) * 1.5)} />;
    }
  }
  const blinkAt = (a: number) => t >= a && t < a + 0.13;
  const gLook: Look = {
    emo: gEmo,
    talk: talkOf("girl", t, f),
    blink: (f % 113 > 109 && t < T_BLANK) || blinkAt(T_BLANK + 0.45) || blinkAt(T_BLANK + 0.85),
    gaze: gGaze,
    t,
  };
  const gPose: Pose = { near: gNear, far: gFar, feet: gFeet, tilt: t >= T_BLANK && !final ? -3 : 0, bob: Math.sin(t * 2.2 + 1) * 2 };

  // --- boy ---
  let bx = BOY_SEAT;
  let bHip = HIP;
  let bDir: 1 | -1 = 1;
  let bFeet: [Pt, Pt] = SEATED.feet;
  let bNear: Pt = [110, -150 + Math.abs(Math.sin(t * 15)) * 6];
  let bFar: Pt = [90, -146];
  let bLean = 0;
  let bBob = Math.sin(t * 2.2) * 2;
  let bHeld: React.ReactNode = <Controller />;
  let bEmo: Emo = "happy";
  let bGaze: Pt = [0.8, -0.1];
  let bTalk = talkOf("boy", t, f);
  let bSweat = 0;
  let bBlush = 0;
  let visible = true;
  let bScale = 1;
  let bOpacity = 1;
  let farProp: React.ReactNode; // drawn at the far hand (cake box / roses)
  let farBehind = false;
  const panic = t >= T_PANIC && t < T_WIDE1;
  if (t < T_STAND) {
    if (t >= T_STOP) bEmo = "neutral";
    if (t >= L0.start) bGaze = [0.8, 0];
    if (panic) {
      bEmo = "nervous";
      bSweat = 1;
      bGaze = t >= T_CAL ? [0.5, -1] : Math.sin(t * 9) > 0 ? [1, 0] : [-0.9, 0];
      bHeld = <Controller />;
    }
    if (t >= T_WIDE1) {
      bEmo = "happy";
      bSweat = 0.6;
    }
  } else if (t < T_BURST) {
    // stands up, drops the controller, turns and runs out the door
    const k = clamp01((t - T_STAND) / 0.3);
    bHeld = undefined;
    bEmo = "happy";
    bSweat = 0.6;
    bHip = HIP + (STAND_HIP - HIP) * k;
    bFeet = mixFeet(SEATED.feet, STANDING.feet, k);
    bNear = [70, -60];
    bFar = [50, -50];
    if (t >= T_RUN) {
      const rt = t - T_RUN;
      bDir = -1;
      bx = BOY_SEAT - rt * ((BOY_SEAT - DOOR_MID) / 0.3);
      bHip = STAND_HIP;
      bFeet = walkFeet(rt * 18, 60);
      bLean = 18;
      bNear = [40 + Math.sin(rt * 18) * 60, -40];
      bFar = [30 - Math.sin(rt * 18) * 60, -40];
      bEmo = "nervous";
      visible = t < T_GONE;
    }
  } else if (!final) {
    // bursts back in with roses + cake box + bear, out of breath
    const rt = t - T_BURST;
    bHip = STAND_HIP;
    bx = DOOR_MID + (BOY_STAND - DOOR_MID) * clamp01(rt / 0.3);
    bFeet = rt < 0.3 ? walkFeet(rt * 18, 60) : STANDING.feet;
    const offer = t >= L2.start - 0.1;
    bNear = offer ? keysPt(t, [[L2.start - 0.1, [130, -250]], [L2.start + 0.15, [150, -285]]]) : [130, -250];
    bFar = offer ? [140, -40] : [110, -30];
    bLean = rt < 0.3 ? 14 : t < L2.start ? 6 : 0;
    bBob = t < L2.start ? Math.abs(Math.sin(rt * 8.5)) * 7 : bBob;
    bHeld = <g transform="scale(1.5)"><Roses /></g>;
    farProp = <g transform="scale(1.45)"><CakeBox /></g>;
    bEmo = "happy";
    bSweat = t < T_TWO ? 1 : 0;
    bTalk = t < L2.start ? 0.35 + 0.3 * Math.abs(Math.sin(rt * 8.5)) : bTalk;
    bBlush = offer ? 1 : 0;
    if (t >= T_TWO + 0.3) {
      bEmo = "shock";
      bBlush = 0;
      bSweat = 1;
      bNear = keysPt(t, [[T_TWO + 0.3, [150, -285]], [T_TWO + 1.0, [125, -190]]]);
      bFar = [125, -20];
    }
    if (t >= T_TWO + 1.3) {
      bEmo = "tired"; // deflates while she lists his failure
      bTalk = 0;
    }
    if (t >= T_FROZEN) {
      bEmo = "awkward";
      bGaze = [-0.15, 0];
    }
  } else {
    // final: trudges out with the bag, roses drooping behind him
    const wt = t - T_WALK;
    const arrive = 0.95;
    bHip = STAND_HIP;
    bDir = -1;
    bx = BOY_STAND - (BOY_STAND - DOOR_MID) * clamp01(wt / arrive);
    bFeet = wt < arrive ? walkFeet(wt * 7, 32) : STANDING.feet;
    bLean = 10;
    bNear = [36, -18];
    bFar = [24, -60];
    bHeld = <TrashBag sway={Math.sin(wt * 7) * 5} />;
    farProp = <g transform="scale(1.4)"><Roses droop={-120} /></g>;
    farBehind = true;
    bEmo = "tired";
    bGaze = [0.6, 0.6];
    bScale = 1 - 0.08 * clamp01((wt - arrive) / 0.4);
    bOpacity = 1 - clamp01((wt - 1.3) / 0.15);
  }
  const bLook: Look = {
    emo: bEmo,
    talk: bTalk,
    blink: f % 97 > 93 && !panic && bEmo !== "shock",
    gaze: bGaze,
    sweat: bSweat,
    blush: bBlush,
    t,
  };
  const bPose: Pose = { near: bNear, far: bFar, feet: bFeet, lean: bLean, bob: bBob, tilt: t >= T_FROZEN && !final ? 3 : 0 };
  const farAt = handAt(bx, bHip, bDir, bFar);
  const nearAt = handAt(bx, bHip, bDir, bNear);
  const farNode = farProp && <g transform={`translate(${farAt[0]} ${farAt[1]}) scale(${bDir} 1)`}>{farProp}</g>;

  // the petal: drops off the bouquet in his frozen close-up
  const pk = t - (T_FROZEN + 0.35);
  const petal = pk > 0 && pk < 1.6 && !final && (
    <ellipse cx={nearAt[0] + Math.sin(pk * 5) * 26 - 10} cy={nearAt[1] - 150 + pk * 230} rx={12} ry={7} transform={`rotate(${Math.sin(pk * 5) * 40} ${nearAt[0] - 10} ${nearAt[1] - 150 + pk * 230})`} fill="#e8354a" stroke={INK} strokeWidth={3} />
  );

  const doorFront = (t >= T_RUN && t < T_BURST) || final;
  const shake = t >= T_GONE && t < T_GONE + 0.4 ? Math.sin((t - T_GONE) * 70) * 8 * (1 - (t - T_GONE) / 0.4) : 0;
  const boy = visible && (
    <g opacity={bOpacity}>
      {farBehind && farNode}
      <g transform={`translate(${bx} ${bHip}) scale(${bScale}) translate(${-bx} ${-bHip})`}>
        <Stick x={bx} hip={bHip} dir={bDir} hair="spiky" pose={bPose} look={bLook} held={bHeld} />
      </g>
      {!farBehind && farNode}
    </g>
  );

  return (
    <g>
      {!doorFront && <DoorPanel open={doorOpen(t)} />}
      <Telly t={t} />
      <Sofa />
      {(t >= T_STAND || final) && (
        <g transform={final ? "translate(450 1170)" : `translate(500 ${SEAT_Y - 16}) rotate(-12)`}>{final ? <Bear s={1.7} /> : <Controller />}</g>
      )}
      {final && (
        <g transform={`translate(880 ${GROUND_Y - 40}) scale(1.45)`}>
          <CakeBox bear={false} />
        </g>
      )}
      <Stick x={gx} hip={gHip} dir={gDir} hair="bob" girl pose={gPose} look={gLook} held={gHeld} />
      {boy}
      {petal}
      {t >= L2.start && t < T_BLANK && <Sparkles t={t} at={[nearAt[0] - 20, nearAt[1] + 40]} k={clamp01((t - L2.start) / 0.2)} />}
      {doorFront && <DoorPanel open={doorOpen(t)} shake={shake} />}
      {panic && t < T_CAL && <Bubble t={t} />}
    </g>
  );
};

// ---------- "10 minutes later" card ----------
const Card: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #ffe98a 0%, #ffcf3f 70%, #f0a92a 100%)", alignItems: "center", justifyContent: "center" }}>
    <svg width={260} height={260} viewBox="-130 -130 260 260" style={{ transform: `scale(${backOut(t / 0.25)})` }}>
      <circle r={110} fill="#fff" stroke={INK} strokeWidth={12} />
      <line x1={0} y1={0} x2={0} y2={-60} stroke={INK} strokeWidth={12} strokeLinecap="round" transform={`rotate(${t * 720})`} />
      <line x1={0} y1={0} x2={0} y2={-88} stroke="#e0202a" strokeWidth={7} strokeLinecap="round" transform={`rotate(${t * 2400})`} />
      <circle r={12} fill={INK} />
    </svg>
    <div style={{ marginTop: 40, fontFamily: FONT, fontSize: 120, color: "#fff", WebkitTextStroke: `18px ${INK}`, paintOrder: "stroke fill", textAlign: "center", lineHeight: 1.0, transform: `rotate(-4deg) scale(${backOut((t - 0.08) / 0.25)})` }}>
      10 minutes
      <br />
      later...
    </div>
  </AbsoluteFill>
);

// ---------- camera ----------
type Cam = { cx: number; cy: number; z: number };
const camAt = (t: number): Cam => {
  const punch = (from: number, amp: number) => amp * Math.exp(-(t - from) * 9);
  const wide = { cx: 540, cy: 1010, z: 1.12 };
  if (t < L0.start) return { ...wide, z: 1.12 + t * 0.006 };
  if (t < T_PANIC) return { cx: 600, cy: 960, z: 1.2 + (t - L0.start) * 0.03 };
  if (t < T_CAL) return { cx: 420, cy: 800, z: 1.6 + punch(T_PANIC, 0.25) + (t - T_PANIC) * 0.04 };
  if (t < T_WIDE1) return { cx: CAL.x, cy: CAL.y + 10, z: 3.0 + punch(T_CAL, 0.3) + (t - T_CAL) * 0.1 };
  if (t < T_BURST) return wide;
  if (t < T_BLANK) return { cx: 520, cy: 990, z: 1.18 };
  if (t < T_TWO) return { cx: 740, cy: 850, z: 1.6 + (t - T_BLANK) * 0.02 };
  if (t < T_FROZEN) return { cx: 545, cy: 950, z: 1.28 };
  if (t < T_WALK) return { cx: 340, cy: 770, z: 1.7 + punch(T_FROZEN, 0.2) + (t - T_FROZEN) * 0.05 };
  return { cx: 500, cy: 1000, z: 1.02 };
};

// ---------- video ----------
export const Ep05: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const cam = camAt(t);
  const S = (at: number, src: string, volume = 1, dur?: number) => (
    <Sequence from={Math.round(at * FPS)} durationInFrames={dur ? Math.round(dur * FPS) : undefined}>
      <Audio src={staticFile(`stick-couple/ep05/${src}`)} volume={volume} />
    </Sequence>
  );
  const card = t >= T_CARD && t < T_BURST;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {t >= T_LAUGH ? (
        <LaughTag t={t - T_LAUGH} f={f} />
      ) : card ? (
        <Card t={t - T_CARD} />
      ) : (
        <AbsoluteFill style={{ background: "#c48d5a" }}>
          <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
            <g transform={`translate(${W / 2 - cam.cx * cam.z} ${H / 2 - cam.cy * cam.z}) scale(${cam.z})`}>
              <LivingRoom t={t} />
              <Scene t={t} f={f} />
            </g>
          </svg>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 62% 38%, rgba(255,200,110,0.10) 0%, rgba(30,30,70,0.16) 55%, rgba(15,15,45,0.42) 100%)" }} />
        </AbsoluteFill>
      )}
      {t < T_LAUGH && !card && <Hook t={t} text={ep.hook} />}
      {t < T_LAUGH && <Captions t={t} words={WORDS} />}
      {S(0, "music.wav", 0.15, T_PANIC)}
      {S(0, "game.wav", 0.1, T_PANIC)}
      {ep.lines.map((l, i) => S(l.start, `voice_${i}.mp3`))}
      {S(T_PANIC, "scratch.wav", 0.5)}
      {S(T_PANIC + 0.2, "ticking.wav", 0.5, T_WIDE1 - T_PANIC - 0.2)}
      {S(T_WIDE1 - 0.3, "gulp.wav", 0.7)}
      {S(T_STAND, "music.wav", 0.14, T_GONE - T_STAND)}
      {S(T_RUN, "whoosh.wav", 0.4)}
      {S(T_GONE, "slam.wav", 0.7)}
      {S(T_CARD, "ticking.wav", 0.6, T_BURST - T_CARD)}
      {S(T_BURST - 0.05, "slam.wav", 0.6)}
      {S(T_BURST + 0.25, "pant.wav", 0.45, L2.start - T_BURST - 0.25)}
      {S(L2.start, "ding.wav", 0.4)}
      {S(L2.start, "music.wav", 0.14, T_BLANK - L2.start)}
      {S(T_BAG, "grab.wav", 0.5)}
      {S(T_FROZEN, "freeze.wav", 0.5)}
      {S(T_WALK, "game.wav", 0.1, T_LAUGH - T_WALK)}
      {S(T_WALK + 1.4, "slam.wav", 0.25)}
      {S(T_LAUGH, "laugh.wav", 0.8)}
    </AbsoluteFill>
  );
};
