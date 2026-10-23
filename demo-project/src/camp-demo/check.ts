// Numeric contact checks for the mug action in the lakeside rig. Run:
//   npx tsc --outDir <dir> --module commonjs --target es2020 --skipLibCheck --resolveJsonModule src/camp-demo/check.ts && node <dir>/src/camp-demo/check.js
import { FPS, T, ik2, sec } from "./motion";
import { CUP_REST, L1, L2, LAYERS, OFF, SHOULDER, TABLE_Y, WRIST_CUP, attached, cupAt, wristAt } from "./rig";

const fails: string[] = [];
const ok = (c: boolean, m: string) => { if (!c) fails.push(m); };
const N = sec(10);
let maxWrist = 0, maxCup = 0, minReach = 1e9, maxReach = 0;
for (let f = 0; f <= N; f++) {
  const t = f / FPS;
  const w = wristAt(t);
  const { hand } = ik2(SHOULDER, w, L1, L2, 1);
  ok(Math.hypot(hand.x - w.x, hand.y - w.y) < 0.6, `arm cannot reach the wrist target at frame ${f}`);
  const d = Math.hypot(w.x - SHOULDER.x, w.y - SHOULDER.y);
  minReach = Math.min(minReach, d); maxReach = Math.max(maxReach, d);
  if (f > 0) {
    const w0 = wristAt((f - 1) / FPS), c0 = cupAt((f - 1) / FPS).c, c1 = cupAt(t).c;
    maxWrist = Math.max(maxWrist, Math.hypot(w.x - w0.x, w.y - w0.y));
    maxCup = Math.max(maxCup, Math.hypot(c1.x - c0.x, c1.y - c0.y));
  }
  const { c, a } = cupAt(t);
  if (a === 0 && !(t >= T.lift0 && t < T.lower1)) ok(Math.abs(c.y + LAYERS.cup.h / 2 - TABLE_Y) < 0.01 && Math.abs(c.x - CUP_REST.x) < 0.01, `cup is off the table at frame ${f}`);
  if (attached(t) && a === 0) ok(Math.hypot(c.x - OFF.x - w.x, c.y - OFF.y - w.y) < 0.01, `wrist and cup part at frame ${f}`);
}
for (const [name, t] of [["close", T.close], ["open", T.open]] as const) {
  const a = cupAt(t - 1 / FPS).c, b = cupAt(t).c;
  ok(Math.hypot(a.x - b.x, a.y - b.y) < 1, `cup jumps at ${name}`);
}
ok(Math.hypot(wristAt(T.close).x - WRIST_CUP.x, wristAt(T.close).y - WRIST_CUP.y) < 0.01, "wrist is not at the handle when the hand closes");
ok(Math.hypot(wristAt(T.open).x - WRIST_CUP.x, wristAt(T.open).y - WRIST_CUP.y) < 0.01, "wrist left the handle before the hand opened");
ok(maxReach < L1 + L2 - 1, `target beyond the arm reach (${maxReach.toFixed(1)} of ${(L1 + L2).toFixed(1)})`);
console.log(`wrist-to-shoulder ${minReach.toFixed(0)}..${maxReach.toFixed(0)} px (arm ${(L1 + L2).toFixed(0)}), max wrist step ${maxWrist.toFixed(1)} px/frame, max cup step ${maxCup.toFixed(1)} px/frame`);
console.log(fails.length ? "FAIL\n" + fails.slice(0, 10).join("\n") : "all contact checks pass");
process.exit(fails.length ? 1 : 0);
