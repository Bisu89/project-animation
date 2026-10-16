import type { Pose } from "../stickman/stick";

// Ground-locked run cycle. runCycle() in the engine swings the legs on a fixed sine, so the planted
// foot slides along the ground unless the speed happens to match. Here the phase comes from the
// DISTANCE travelled and each foot is solved with two-bone IK: the stance foot is pinned to the ground
// (its position relative to the hip moves back at exactly the body speed), the swing foot lifts and
// reaches forward, and the hip height follows from the stance leg, which gives a natural run bounce.
// All lengths are in unscaled stick units (stick.tsx: thigh 48, shin 46); `s` converts the world stride.

const TH = 48;
const SH = 46;
const LMAX = (TH + SH) * 0.985;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const deg = (r: number) => (r * 180) / Math.PI;

// angles (stick.tsx convention: 0 = down, + = forward) that put the foot at (fx, fy) from the hip, knee forward
const leg = (fx: number, fy: number) => {
  const d = clamp(Math.hypot(fx, fy), 20, TH + SH - 0.01);
  const a0 = Math.atan2(fx, fy);
  const A = Math.acos(clamp((TH * TH + d * d - SH * SH) / (2 * TH * d), -1, 1));
  const B = Math.acos(clamp((SH * SH + d * d - TH * TH) / (2 * SH * d), -1, 1));
  return { a1: deg(a0 + A), a2: -deg(A + B) };
};

export type GaitOpts = { stride: number; lift?: number; lean?: number; arm?: number; crouch?: number };
export type Gait = { pose: Partial<Pose>; hipH: number };

// d = distance travelled (world px), s = character scale, stride = world px per full cycle (left + right step)
export const groundedRun = (d: number, s: number, o: GaitOpts): Gait => {
  const Su = o.stride / s;
  const lift = o.lift ?? 26;
  const ph = d / o.stride;
  const uL = ((ph % 1) + 1) % 1;
  const uR = (uL + 0.5) % 1;
  const foot = (u: number) => {
    if (u < 0.5) return { x: (Su / 4) * (1 - 4 * u), up: 0 }; // stance: slides back with the ground
    const t = (u - 0.5) * 2;
    return { x: -Su / 4 + (Su / 2) * ((1 - Math.cos(Math.PI * t)) / 2), up: lift * Math.sin(Math.PI * t) };
  };
  const L = foot(uL);
  const R = foot(uR);
  const st = uL < 0.5 ? L : R;
  const hipH = Math.sqrt(Math.max(LMAX * LMAX - st.x * st.x, 40 * 40)) * (1 - (o.crouch ?? 0));
  const l = leg(L.x, hipH - L.up);
  const r = leg(R.x, hipH - R.up);
  const fL = L.x / (Su / 4);
  const arm = o.arm ?? 45;
  return {
    hipH,
    pose: { ll1: l.a1, ll2: l.a2, rl1: r.a1, rl2: r.a2, la1: -arm * fL, la2: 75, ra1: arm * fL, ra2: 75, lean: (o.lean ?? 12) + (o.crouch ?? 0) * 70 },
  };
};

export const REST: Partial<Pose> = { lean: 0, la1: -18, la2: 8, ra1: 18, ra2: -8, ll1: -12, ll2: 4, rl1: 12, rl2: -4 };
export const REST_HIP = 92.5;

// blend two partial poses by b (0 = a, 1 = b) for the keys present in `a`
export const blend = (a: Partial<Pose>, b: Partial<Pose>, t: number): Partial<Pose> => {
  const out: Partial<Pose> = {};
  (Object.keys(a) as (keyof Pose)[]).forEach((k) => {
    const x = a[k] as number;
    const y = (b[k] ?? x) as number;
    out[k] = x + (y - x) * t;
  });
  return out;
};

export const smooth = (t: number) => {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
};
