// Pure motion helpers for the camp demo. Everything is a function of the frame number, so scrubbing and
// out-of-order rendering give the same picture. Times are written in seconds and converted to frames here only.
export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);

export type V = { x: number; y: number };
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

// Easings: out for arrivals (decelerate onto a target), in-out for reaching/lifting, sine for gentle swings.
export const ease = {
  inOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: (t: number) => 1 - Math.pow(1 - t, 3),
  inOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerpV = (a: V, b: V, t: number): V => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });

// Quadratic Bezier: a curved path through a control point instead of a straight interpolation.
export const bez = (a: V, c: V, b: V, t: number): V => {
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
};

// Progress 0..1 of time t (seconds) inside [t0, t1], shaped by an easing.
export const seg = (t: number, t0: number, t1: number, e: (x: number) => number = ease.inOut) => e(clamp01((t - t0) / (t1 - t0)));

// Two-bone IK in screen coordinates (y down). Returns the elbow for a shoulder S, target T and bone lengths.
// bend = +1 puts the elbow below the shoulder-target line (a relaxed arm), -1 above it.
export const ik2 = (S: V, T: V, l1: number, l2: number, bend = 1): { elbow: V; hand: V } => {
  let dx = T.x - S.x;
  let dy = T.y - S.y;
  const d0 = Math.hypot(dx, dy) || 1e-6;
  const d = Math.min(l1 + l2 - 0.5, Math.max(Math.abs(l1 - l2) + 0.5, d0));
  const a = Math.atan2(dy, dx);
  const cosA = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d);
  const s = a + bend * Math.acos(Math.min(1, Math.max(-1, cosA)));
  const elbow = { x: S.x + l1 * Math.cos(s), y: S.y + l1 * Math.sin(s) };
  const hand = { x: S.x + (dx / d0) * d, y: S.y + (dy / d0) * d };
  return { elbow, hand };
};

// Mug action. All points are on the 1920x1080 scene.
export const SHOULDER: V = { x: 715, y: 530 };
export const L1 = 185;
export const L2 = 175;
export const CUP_REST: V = { x: 1030, y: 640 }; // cup centre when standing on the table (its bottom is at TABLE_Y)
export const CUP_HALF = { w: 45, h: 50 };
export const TABLE_Y = CUP_REST.y + CUP_HALF.h;
export const GRIP: V = { x: -CUP_HALF.w - 17, y: 0 }; // handle grip point, relative to the cup centre
export const HAND_LAP: V = { x: 800, y: 700 };
export const HAND_CUP: V = { x: CUP_REST.x + GRIP.x, y: CUP_REST.y + GRIP.y };
export const HAND_HOLD: V = { x: 905, y: 505 };

// Beats (seconds): reach, close, lift, hold, lower, open, retract.
export const T = {
  reach0: 2.0, reach1: 3.3, // hand travels from the lap to the handle and decelerates onto it
  close: 3.45, // fingers close (hand state swaps); the cup is still resting
  lift0: 3.7, lift1: 4.9, // cup leaves the table
  hold1: 7.0,
  lower1: 8.2, // cup is back on the table at this instant
  open: 8.55, // the hand lets go after resting for a moment
  retract0: 8.7, retract1: 9.7,
};

// Where the hand (the grip point) is at time t.
export const handAt = (t: number): V => {
  if (t < T.reach0) return HAND_LAP;
  if (t < T.reach1) return bez(HAND_LAP, { x: 930, y: 610 }, HAND_CUP, seg(t, T.reach0, T.reach1, ease.inOut));
  if (t < T.lift0) return HAND_CUP;
  if (t < T.lift1) return bez(HAND_CUP, { x: 905, y: 640 }, HAND_HOLD, seg(t, T.lift0, T.lift1, ease.inOut));
  if (t < T.hold1) {
    // small sway whose amplitude is zero at both ends, so it joins the lift and the lowering with no jump
    const p = (t - T.lift1) / (T.hold1 - T.lift1);
    const w = Math.sin(Math.PI * p) ** 2;
    return { x: HAND_HOLD.x + 3 * w * Math.sin(p * 5.2), y: HAND_HOLD.y + 3.5 * w * Math.sin(p * 3.1 + 0.8) };
  }
  if (t < T.lower1) return bez(HAND_HOLD, { x: 960, y: 600 }, HAND_CUP, seg(t, T.hold1, T.lower1, ease.inOutSine));
  if (t < T.retract0) return HAND_CUP;
  if (t < T.retract1) return bez(HAND_CUP, { x: 930, y: 640 }, HAND_LAP, seg(t, T.retract0, T.retract1, ease.inOut));
  return HAND_LAP;
};

// The cup is attached to the hand from `close` until `open`. While attached its centre is the hand minus the grip,
// which equals CUP_REST at both ends of the attachment, so there is no jump when it is picked up or put down.
export const attached = (t: number) => t >= T.close && t < T.open;
// The cup tips slightly toward the face while raised: 0 on the table, -7 degrees at the top, and back.
export const cupTilt = (t: number) => {
  if (t < T.lift0 || t >= T.lower1) return 0;
  if (t < T.lift1) return -7 * seg(t, T.lift0, T.lift1, ease.inOutSine);
  if (t < T.hold1) return -7;
  return -7 * (1 - seg(t, T.hold1, T.lower1, ease.inOutSine));
};
export const cupAt = (t: number): { c: V; a: number } => {
  if (!attached(t)) return { c: CUP_REST, a: 0 };
  const a = cupTilt(t);
  const r = (a * Math.PI) / 180;
  const h = handAt(t);
  return { c: { x: h.x - (Math.cos(r) * GRIP.x - Math.sin(r) * GRIP.y), y: h.y - (Math.sin(r) * GRIP.x + Math.cos(r) * GRIP.y) }, a };
};

// Blinks at fixed, uneven moments (seconds); returns 0 (open) .. 1 (closed).
const BLINKS = [1.7, 4.25, 6.05, 8.9];
export const blinkAt = (t: number) => {
  for (const b of BLINKS) {
    const d = t - b;
    if (d >= 0 && d < 0.2) return d < 0.08 ? d / 0.08 : 1 - (d - 0.08) / 0.12;
  }
  return 0;
};
