// Mirrors content/cook-ep01/scenes.csv. Images: public/cook-ep01/images/sNN.png, sound effects: public/cook-ep01/sfx/<name>.wav
export type Camera = "zoom-in" | "zoom-out" | "pan-left" | "pan-right";
export type Fx = "steam" | "sparks" | "flame" | "dust" | "light";
export type Scene = { image: string; sec: number; camera: Camera; fx: Fx[]; sfx: { name: string; at: number }[] };

const S = (n: number, sec: number, camera: Camera, fx: Fx[], sfx: [string, number][]): Scene => ({
  image: `cook-ep01/images/s${String(n).padStart(2, "0")}.png`,
  sec,
  camera,
  fx,
  sfx: sfx.map(([name, at]) => ({ name, at })),
});

export const FPS = 30;
export const FADE = 6; // frames of crossfade between scenes

export const SCENES: Scene[] = [
  S(1, 1.8, "zoom-in", ["dust", "light"], [["ambience", 0]]),
  S(2, 1.6, "zoom-in", ["dust"], [["tap", 0.1], ["whisk", 0.5]]),
  S(3, 1.6, "pan-right", ["dust"], [["chop", 0.1]]),
  S(4, 1.6, "zoom-in", ["flame", "steam"], [["flame", 0]]),
  S(5, 1.6, "zoom-out", ["steam", "sparks"], [["sizzle", 0.1]]),
  S(6, 1.6, "pan-left", ["steam", "sparks"], [["sizzle", 0], ["stir", 0.3]]),
  S(7, 2.2, "zoom-in", ["steam", "sparks"], [["stir", 0.5]]),
  S(8, 1.6, "zoom-in", ["steam", "sparks"], [["sizzle", 0], ["stir", 0.2]]),
  S(9, 1.6, "pan-right", ["steam"], [["scoop", 0.2]]),
  S(10, 2.2, "zoom-out", ["steam", "dust", "light"], [["ding", 0.3]]),
];

// Each scene overlaps the next by FADE frames, so starts are cumulative minus the overlap.
export const starts = (): number[] => {
  const out: number[] = [];
  let t = 0;
  for (const s of SCENES) {
    out.push(t);
    t += Math.round(s.sec * FPS) - FADE;
  }
  return out;
};
export const DURATION = starts()[SCENES.length - 1] + Math.round(SCENES[SCENES.length - 1].sec * FPS);
