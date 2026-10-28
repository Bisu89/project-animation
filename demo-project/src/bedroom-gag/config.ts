export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
// Exported from content/bedroom-gag/models by scripts/bedroom_export.py.
export const BACKGROUNDS = {
  night: "bedroom-gag/bg_bedroom_wide.png",
  lamp: "bedroom-gag/bg_bedroom_lamp.png",
  door: "bedroom-gag/bg_bedroom_door_open.png",
} as const;
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const smooth = (x: number) => x * x * (3 - 2 * x);
