// Config for one "cozy night" scene. Everything is placed in the MASTER picture's own pixel space (the ChatGPT image),
// so a new scene = one master + a handful of edited crops + one JSON of this shape (see docs/series/xmas-cat/KHUON_COZY.md).

export type Box = { x: number; y: number; w: number; h: number };

export type SnowCfg = { rect: Box; count: number; shape?: "rect" | "ellipse" };
/** rain seen through a window: slanted streaks falling fast, plus slow drops that slide down the glass */
export type RainCfg = { rect: Box; count: number; shape?: "rect" | "ellipse"; /** sideways px per px fallen, 0.2 = wind from the right */ lean?: number; length?: number; speed?: number; opacity?: number; /** drops sliding down the glass */ drops?: number };
/** a coloured glow (neon tube, CRT screen, jukebox) whose brightness follows one band of the music; needs the music's features.json */
export type NeonCfg = { box: Box; color: string; driver: "bass" | "mid" | "high" | "onset"; base: number; amp: number; shape?: "ellipse" | "rect" };
/** lightning: short double flashes of the whole picture (use with rain) */
export type LightningCfg = { events: Events; strength?: number };
/** a poster opening over the first seconds of the video: dark sepia scene + headline, an RGB glitch, then the poster slams in and dissolves */
export type IntroCfg = { seconds?: number; eyebrow: string; headline: string; subline: string; poster: string; tags: [string, string]; footer: string };
export type SteamCfg = { x: number; y: number; rise: number; spread: number; count: number; life: number; r0: number; rGrow: number; opacity: number; amp0: number; ampGrow: number; drift: number; displace: number };

export type Events = { times: number[] } | { every: number; first: number; seed: string; jitter?: number };

export type CozyConfig = {
  id: string;
  /** folder under demo-project/public/ that holds master.png, the variants, ambience.wav, music.mp3 */
  assets: string;
  /** folder under content/ with the source images (master.png, crops, ChatGPT results) */
  content: string;
  master: { w: number; h: number };
  view: {
    /** output size of the video: [1080, 1920] for Reels, [1920, 1080] for YouTube */
    out: [number, number];
    /** part of the master that is shown (default: all of it); the stage scales to cover `out` */
    crop?: Box;
  };
  camera: {
    zoom: { mode: "linear"; from: number; to: number } | { mode: "sine"; base: number; amp: number; period: number; phase: number };
    origin:
      | { mode: "linear"; from: [number, number]; to: [number, number] }
      | { mode: "sine"; center: [number, number]; swing: [number, number]; periods: [number, number]; phase: [number, number] };
    /** frames of fade-in and fade-out of the picture */
    fade: [number, number];
  };
  vignette?: { at: [number, number]; from: number; alpha: number };

  /** a hearth: a plate picture with the flames painted out, plus procedural flames on top */
  fire?: {
    /** false = keep the painted flames until the plate picture exists (cozy_crops.py still makes its crop and prompt) */
    enabled?: boolean;
    plate?: { src: string; box: Box; from: string; crop: string; prompt: string };
    base: number;
    area: Box;
    mask: "right" | "both";
    /** [x, width, height] of each flame tongue */
    tongues: [number, number, number][];
    embers: { x0: number; w: number; count: number };
  };
  /** firelight: big soft blobs whose brightness breathes with the fire */
  glows?: { box: Box; kind: "big" | "soft"; base: number; amp: number; driver: "fire" | "fire2" }[];

  /** shape "ellipse" clips the flakes to a round window */
  snow?: SnowCfg | SnowCfg[];
  steam?: SteamCfg | SteamCfg[];
  rain?: RainCfg | RainCfg[];
  neon?: NeonCfg[];
  lightning?: LightningCfg;
  intro?: IntroCfg;

  lights?: {
    size: number;
    base: number;
    twinkle: number;
    /** 0 = no reaction to the music; needs `features` */
    react: number;
    regions: (
      | { type: "tree"; count: number; axisX: number; topY: number; height: number; halfTop: number; halfBottom: number; skew: number; clampX?: number }
      | { type: "line"; count: number; from: [number, number]; to: [number, number]; wave: number; waveLen: number; jitter: number }
    )[];
  };
  candles?: { points: [number, number][]; size: number; base: number; flick: number; mid: number; onset: number };

  /** a sleeping creature: breathes, and small edited crops fade in over it now and then */
  creature?: {
    breath: { origin: [number, number]; body: Box; amp: number; speed: number };
    patches: { /** false = not made yet (no picture), skipped in the video */ enabled?: boolean; id: string; src: string; from: string; crop: string; box: Box; events: Events; env: [number, number, number]; prompt: string }[];
  };

  audio?: { ambience?: { file: string; volume: number }; music?: { file: string; volume: number; fadeIn: number; fadeOut: number } };

  /** text for the Reels cut (title at the start, "full version on YouTube" card at the end) */
  reel?: { kicker: string; title: string; cta: [string, string]; ctaSmall: string };
};

/** per-frame (30 fps) music envelopes from scripts/smoke_features.py */
export type Features = { bass: number[]; mid: number[]; high: number[]; onset: number[] };
