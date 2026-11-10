import React, { useId } from "react";
import { INK } from "../stick-couple/Stick";

// World units (1080 x 1920), relative to the seated hip. The face is drawn
// facing right; the rig is mirrored as a unit, including its hat and hands.
export const RX = 142;
export const RY = 154;

export type BigEmo = "neutral" | "talk" | "laugh" | "focus" | "annoyed";
export type BigLook = { emo: BigEmo; talk?: number; blink?: boolean; tears?: number; gaze?: [number, number] };
export type BigPose = { bob?: number; tilt?: number; armRaised?: number; legCross?: number };

type Props = {
  x: number;
  hip: number;
  dir: 1 | -1;
  skin: string;
  iris: string;
  shirt: string;
  hat: React.ReactNode;
  fringe?: boolean;
  held?: React.ReactNode;
  pose: BigPose;
  look: BigLook;
};

const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const OUTLINE = 5.5;
const LIMB = 6.5;

const Face: React.FC<{ look: BigLook; dir: 1 | -1; iris: string }> = ({ look, dir, iris }) => {
  // Local IDs keep the two characters' eye/mouth clips independent, including
  // when several copies of the rig are rendered in the same SVG.
  const id = `bestie-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const { emo, blink = false, tears = 0, gaze = [0, 0] } = look;
  const laughing = emo === "laugh";
  const annoyed = emo === "annoyed";
  const focus = emo === "focus";
  const speaking = clamp(look.talk ?? (emo === "talk" ? 0.35 : 0));
  const gx = clamp(gaze[0] * dir, -1, 1) * 15;
  const gy = clamp(gaze[1], -1, 1) * 17;

  // Tall almond shapes: an arched upper lid and a sloping, nearly straight
  // lower lid. The pupil sits towards the partner, clipped by the eye white.
  const eyes = [
    {
      d: annoyed
        ? "M-108,-12 Q-117,-49 -101,-72 Q-61,-68 -15,-51 L-12,-30 Q-61,-28 -108,-12 Z"
        : "M-108,-12 C-122,-53 -105,-106 -77,-115 C-40,-128 -10,-89 -12,-30 Q-61,-28 -108,-12 Z",
      x: -31,
      y: -43,
    },
    {
      d: annoyed
        ? "M12,-32 L12,-58 Q54,-76 94,-77 Q107,-58 109,-27 Q60,-39 12,-32 Z"
        : "M12,-32 C-3,-82 10,-130 42,-131 C78,-132 105,-82 109,-27 Q60,-39 12,-32 Z",
      x: 85,
      y: -47,
    },
  ];

  const opening = Math.max(focus ? 0.28 : 0, speaking);
  const mouthX = 35;
  const mouthY = 27;
  const mouthW = mix(53, 61, opening);
  const mouthH = mix(42, 91, opening);
  const mouth = laughing
    ? "M-48,-77 C-77,-68 -56,35 -23,79 C-5,105 22,115 44,91 C76,56 92,-14 78,-65 Q18,-87 -48,-77 Z"
    : `M${mouthX - mouthW},${mouthY - 5} Q${mouthX},${mouthY + 5} ${mouthX + mouthW},${mouthY - 15} C${mouthX + mouthW + 1},${mouthY + mouthH} ${mouthX - mouthW + 8},${mouthY + mouthH + 14} ${mouthX - mouthW},${mouthY - 5} Z`;

  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <defs>
        {eyes.map((eye, i) => (
          <clipPath key={i} id={`${id}-eye-${i}`}><path d={eye.d} /></clipPath>
        ))}
        <clipPath id={`${id}-mouth`}><path d={mouth} /></clipPath>
        <linearGradient id={`${id}-inside`} x1="0" x2="1" y1="0" y2="0.2">
          <stop offset="0" stopColor="#10070b" />
          <stop offset="0.62" stopColor="#310811" />
          <stop offset="1" stopColor="#6c1028" />
        </linearGradient>
      </defs>

      {laughing ? (
        <g fill="none" stroke={INK} strokeWidth={4.5}>
          <path d="M-104,-94 Q-70,-113 -28,-99 M16,-102 Q53,-124 96,-105" />
          <path d="M-106,-80 Q-73,-91 -30,-80 L-95,-65 M16,-80 Q53,-96 101,-78 L33,-65" />
        </g>
      ) : (
        <>
          <g fill="none" stroke={INK} strokeWidth={4.5}>
            <path d={annoyed ? "M-105,-102 Q-60,-99 -20,-80" : "M-105,-133 Q-68,-149 -27,-135"} />
            <path d={annoyed ? "M14,-87 Q57,-113 98,-105" : focus ? "M12,-151 Q52,-156 94,-138" : "M12,-151 Q51,-164 94,-142"} />
          </g>
          {blink ? (
            <g fill="none" stroke={INK} strokeWidth={OUTLINE}>
              <path d="M-108,-29 Q-64,-8 -13,-37 M13,-42 Q59,-22 108,-40" />
            </g>
          ) : eyes.map((eye, i) => (
            <g key={i}>
              <path d={eye.d} fill="#fffefa" />
              <g clipPath={`url(#${id}-eye-${i})`}>
                <ellipse cx={eye.x + gx} cy={eye.y + gy} rx={17} ry={25} fill={iris} stroke={INK} strokeWidth={1.8} />
                <ellipse cx={eye.x + gx + 1} cy={eye.y + gy - 1} rx={9} ry={17} fill={INK} />
                <ellipse cx={eye.x + gx - 5} cy={eye.y + gy - 12} rx={6} ry={8} fill="#fff" />
                <circle cx={eye.x + gx + 8} cy={eye.y + gy + 9} r={3} fill="#fff" opacity={0.85} />
              </g>
              <path d={eye.d} fill="none" stroke={INK} strokeWidth={OUTLINE} />
            </g>
          ))}
        </>
      )}

      {annoyed && speaking < 0.08 ? (
        <path d="M-7,62 Q37,44 79,58" fill="none" stroke={INK} strokeWidth={5} />
      ) : (
        <>
          <path d={mouth} fill={`url(#${id}-inside)`} />
          <g clipPath={`url(#${id}-mouth)`}>
            {laughing ? (
              <>
                <path d="M-57,-80 Q13,-92 86,-70 L80,-46 Q13,-48 -51,-53 Z" fill="#fffefa" stroke={INK} strokeWidth={3.5} />
                <path d="M-29,83 Q-24,49 3,61 Q29,72 31,115 L-8,121 Z" fill="#ad2847" stroke={INK} strokeWidth={3} />
                <path d="M-5,64 Q7,83 10,105" fill="none" stroke="#6b142c" strokeWidth={3} />
              </>
            ) : (
              <>
                <path d={`M-29,13 Q36,32 104,5 L100,${mouthY + 16} Q38,${mouthY + 27} -25,${mouthY + 14} Z`} fill="#fffefa" stroke={INK} strokeWidth={3} />
                <ellipse cx={mouthX + 3} cy={mouthY + mouthH + 1} rx={35} ry={19} fill="#a92c49" />
              </>
            )}
          </g>
          <path d={mouth} fill="none" stroke={INK} strokeWidth={4.8} />
        </>
      )}

      {tears > 0 && (
        <g fill="#74c7e8" stroke="#399abf" strokeWidth={2} opacity={clamp(tears)}>
          <path d="M-111,-54 Q-139,-30 -123,-19 Q-104,-13 -111,-54 Z" />
          <path d="M105,-54 Q130,-32 116,-19 Q98,-15 105,-54 Z" />
        </g>
      )}
    </g>
  );
};

// A tilted, fitted dome and a diagonal folded cuff, with short knit ribs.
// Its silhouette follows the skull instead of floating above it.
export const Beanie: React.FC = () => (
  <g stroke={INK} strokeLinejoin="round" strokeLinecap="round">
    <path d="M-153,-64 C-161,-126 -124,-192 -66,-201 C-34,-208 -5,-200 19,-178 L54,-143 Z" fill="#727575" strokeWidth={OUTLINE} />
    <g fill="none" strokeWidth={3}>
      <path d="M-125,-101 Q-137,-140 -113,-168 M-87,-126 Q-111,-157 -102,-178 M-48,-145 Q-64,-177 -85,-184 M-9,-161 Q-22,-181 -56,-188" />
    </g>
    <path d="M-159,-66 Q-90,-146 44,-184 Q59,-187 69,-171 L86,-143 Q90,-134 79,-129 Q-45,-102 -139,-26 Q-153,-17 -158,-31 Z" fill="#898b87" strokeWidth={OUTLINE} />
    <g fill="none" strokeWidth={2.8}>
      <path d="M-142,-59 l8,20 M-120,-77 l10,20 M-97,-95 l11,20 M-73,-110 l11,20 M-47,-125 l11,20 M-20,-139 l12,19 M8,-152 l12,20 M35,-161 l12,19 M60,-165 l10,17" />
    </g>
  </g>
);

export const Fringe: React.FC = () => (
  <path d="M-146,-66 Q-66,-158 64,-151 L82,-158 L77,-140 L109,-140 L96,-129 L124,-111 L103,-110 L127,-82 L99,-92 L111,-61 L88,-78 L87,-99 L62,-104 L49,-91 L29,-100 L14,-92 L-3,-108 Q-55,-84 -99,-47 L-105,11 L-117,-5 L-121,39 L-137,13 L-145,-24 Z" fill="#3d2525" />
);

// The long burgundy peak lifts away from the forehead; the red crown remains
// visible behind it. dir selects the peak's direction in head-local space.
export const Cap: React.FC<{ dir: 1 | -1 }> = ({ dir }) => (
  <g transform={`scale(${-dir} 1)`} stroke={INK} strokeWidth={OUTLINE} strokeLinejoin="round">
    <path d="M-116,-115 Q23,-152 91,-113 Q124,-85 132,-39 L101,-64 Q50,-129 -34,-113 Z" fill="#ed3a45" />
    <path d="M-115,-105 C-165,-154 -188,-206 -154,-234 C-111,-277 -14,-226 85,-123 Q33,-141 -12,-133 Q-78,-131 -115,-105 Z" fill="#960633" />
    <path d="M86,-122 Q113,-95 129,-44 L98,-71" fill="none" strokeWidth={3.5} />
  </g>
);

const Mitten: React.FC<{ x: number; y: number; angle?: number }> = ({ x, y, angle = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    <path d="M-10,9 C-18,4 -17,-9 -9,-14 Q-3,-17 6,-12 C14,-18 24,-14 20,-9 L10,-4 C30,-8 33,-2 23,2 L11,4 C29,7 29,14 20,12 L6,8 Q11,24 2,22 L-8,12 Z" fill={INK} />
  </g>
);

export const Bestie: React.FC<Props> = ({ x, hip, dir, skin, iris, shirt, hat, fringe, held, pose, look }) => {
  const { bob = 0, tilt = 0, armRaised = 0, legCross = 0 } = pose;
  const raised = clamp(armRaised);
  const crossed = clamp(legCross, -1, 1);
  const laughing = look.emo === "laugh";
  const hasHeld = held !== undefined && held !== null && held !== false;
  const shoulderY = -204 - bob;
  const headY = shoulderY - RY + 2;
  const headX = 48 - (laughing ? 14 : 0);
  const nearHand = hasHeld
    ? { x: 191 + raised * 18, y: -195 - raised * 65 }
    : { x: mix(61, 6, raised), y: mix(-18, -152, raised) };
  const farHand = hasHeld
    ? { x: nearHand.x - 26, y: nearHand.y + 101 }
    : { x: mix(-40, -10, raised), y: mix(-31, -143, raised) };
  // Positive cross lifts the other ankle onto the forward knee; negative
  // cross raises the forward knee. Both legs remain unfilled line segments.
  const cross = clamp(crossed * 2);
  const kick = clamp(-crossed * 2);

  return (
    <g transform={`translate(${x} ${hip})`}>
      <g transform={`scale(${dir} 1)`} strokeLinecap="round" strokeLinejoin="round">
        <g fill="none" stroke={INK} strokeWidth={LIMB}>
          <path d={`M-30,8 L${65 - kick * 12},${38 - kick * 18} L${58 + kick * 16},${169 - kick * 10} L${103 + kick * 9},${169 - kick * 10}`} />
          <path d={`M5,11 L${100 - cross * 12},${55 - cross * 14} L${129 + cross * 33},${164 - cross * 164} L${166 + cross * 48},${177 - cross * 207}`} />
        </g>

        {/* A narrow tapered shirt connects the chin to the seated hip. */}
        <path d={`M30,${shoulderY - 9} Q47,${shoulderY - 12} 56,${shoulderY + 2} Q41,-96 39,8 Q-9,25 -57,8 Q-18,-100 30,${shoulderY - 9} Z`} fill={shirt} stroke={INK} strokeWidth={OUTLINE} />

        <g fill="none" stroke={INK} strokeWidth={LIMB}>
          <path d={hasHeld
            ? `M34,${shoulderY + 4} L97,${-80 - raised * 30} Q102,${-70 - raised * 30} 114,${-77 - raised * 30} L${farHand.x},${farHand.y}`
            : `M34,${shoulderY + 4} L-78,${-59 - raised * 30} Q-85,${-43 - raised * 30} ${farHand.x},${farHand.y}`} />
          <path d={`M47,${shoulderY + 6} L${hasHeld ? 103 : 116},${hasHeld ? -120 - raised * 40 : -78 - raised * 28} Q${hasHeld ? 125 : 121},${hasHeld ? -113 - raised * 43 : -54 - raised * 30} ${nearHand.x},${nearHand.y}`} />
        </g>

        {hasHeld && (
          // Keep supplied artwork readable when the character faces left.
          <g transform={`translate(${nearHand.x - 6} ${nearHand.y + 93}) rotate(-12) scale(1.25 1.25)`}>
            <g transform={`scale(${dir} 1)`}>{held}</g>
          </g>
        )}
        <Mitten x={farHand.x} y={farHand.y} angle={hasHeld ? -24 : 28} />
        <Mitten x={nearHand.x} y={nearHand.y} angle={hasHeld ? -118 : -24} />

        <g transform={`translate(${headX} ${headY}) rotate(${tilt * dir - (laughing ? 9 : 0)})`}>
          <path d={`M-18,${-RY} C71,${-RY - 4} 131,-100 ${RX},-24 C157,56 105,142 22,${RY} C-68,163 -136,99 -143,19 C-152,-60 -105,-145 -18,${-RY} Z`} fill={skin} stroke={INK} strokeWidth={OUTLINE} />
          {fringe && <Fringe />}
          <Face look={look} dir={dir} iris={iris} />
          {hat}
        </g>
      </g>
    </g>
  );
};
