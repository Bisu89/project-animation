// Rig of the lakeside scene, in 1920x1080 canvas px (numbers measured on the exported layers, see scripts/camp_export.py).
// The action is the same as before (reach, close, lift, hold, lower, open, retract), driven by the beats T in motion.ts.
import RIG from "./rig.json";
import { T, V, bez, ease, ik2, seg } from "./motion";

export const LAYERS = RIG.layers as Record<string, { x: number; y: number; w: number; h: number; pivot?: number[]; srcAngle?: number; len?: number }>;

const cv = (x: number, y: number): V => ({ x: (x + 400) * 1.25, y: (y + 270) * 1.25 }); // crop px -> canvas px

export const SHOULDER: V = { x: 906, y: 556 }; // centre of the empty sleeve opening in body.png (measured on a render)
export const L1 = LAYERS.arm_upper.len!;
export const L2 = LAYERS.arm_forearm.len!;
export const HAND_LEN = LAYERS.hand_open.len!;

// cup: its centre when standing on the table, and where the wrist is while it grips the handle
const cup = LAYERS.cup;
export const CUP_REST: V = { x: cup.x + cup.w / 2, y: cup.y + cup.h / 2 };
export const CUP_HALF_H = cup.h / 2;
export const TABLE_Y = cup.y + cup.h; // the cup's flat bottom touches the table top here
export const WRIST_CUP: V = cv(343, 258);
export const OFF: V = { x: CUP_REST.x - WRIST_CUP.x, y: CUP_REST.y - WRIST_CUP.y }; // cup centre relative to the wrist while gripping
export const WRIST_LAP: V = cv(245 + RIG.dx, 222);
export const WRIST_HOLD: V = cv(345, 140);

// Direction of the forearm at the moment of the grasp: the fist keeps this angle (plus the cup tilt) while it holds the cup,
// so the cup stays in the hand even when the forearm swings upward (the wrist bends to compensate).
const e0 = ik2(SHOULDER, WRIST_CUP, L1, L2, 1).elbow;
export const HAND_A0 = Math.atan2(WRIST_CUP.y - e0.y, WRIST_CUP.x - e0.x);

// Where the wrist is at time t (seconds).
export const wristAt = (t: number): V => {
  if (t < T.reach0) return WRIST_LAP;
  if (t < T.reach1) return bez(WRIST_LAP, { x: 990, y: 640 }, WRIST_CUP, seg(t, T.reach0, T.reach1, ease.inOut));
  if (t < T.lift0) return WRIST_CUP;
  if (t < T.lift1) return bez(WRIST_CUP, { x: 1010, y: 590 }, WRIST_HOLD, seg(t, T.lift0, T.lift1, ease.inOut));
  if (t < T.hold1) {
    // sway whose amplitude is zero at both ends, so it joins the lift and the lowering with no jump
    const p = (t - T.lift1) / (T.hold1 - T.lift1);
    const w = Math.sin(Math.PI * p) ** 2;
    return { x: WRIST_HOLD.x + 2.5 * w * Math.sin(p * 5.2), y: WRIST_HOLD.y + 3 * w * Math.sin(p * 3.1 + 0.8) };
  }
  if (t < T.lower1) return bez(WRIST_HOLD, { x: 1010, y: 590 }, WRIST_CUP, seg(t, T.hold1, T.lower1, ease.inOutSine));
  if (t < T.retract0) return WRIST_CUP;
  if (t < T.retract1) return bez(WRIST_CUP, { x: 975, y: 640 }, WRIST_LAP, seg(t, T.retract0, T.retract1, ease.inOut));
  return WRIST_LAP;
};

export const attached = (t: number) => t >= T.close && t < T.open;

// The cup tips toward the face while raised: 0 on the table, -8 degrees at the top.
export const cupTilt = (t: number) => {
  if (t < T.lift0 || t >= T.lower1) return 0;
  if (t < T.lift1) return -8 * seg(t, T.lift0, T.lift1, ease.inOutSine);
  if (t < T.hold1) return -8;
  return -8 * (1 - seg(t, T.hold1, T.lower1, ease.inOutSine));
};

// While attached the cup centre is the wrist plus OFF (turned with the tilt about the wrist); it equals CUP_REST at both ends.
export const cupAt = (t: number): { c: V; a: number } => {
  if (!attached(t)) return { c: CUP_REST, a: 0 };
  const a = cupTilt(t);
  const r = (a * Math.PI) / 180;
  const w = wristAt(t);
  return { c: { x: w.x + Math.cos(r) * OFF.x - Math.sin(r) * OFF.y, y: w.y + Math.sin(r) * OFF.x + Math.cos(r) * OFF.y }, a };
};
