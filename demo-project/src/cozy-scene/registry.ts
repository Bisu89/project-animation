// Add one entry per scene. `timing` is in seconds: the Reels cut and the long cut. `features` (optional) = per-frame music
// envelopes (python scripts/smoke_features.py <music.mp3> <features.json>) for lights that react to the music.
import type { CozyConfig, Features } from "./types";
import xmasCatCfg from "./scenes/xmas-cat.json";
import xmasCatWideCfg from "./scenes/xmas-cat-wide.json";
import atticCatCfg from "./scenes/attic-cat.json";
import tokyoWindowCfg from "./scenes/tokyo-window.json";
import kotatsuSleepCfg from "./scenes/kotatsu-sleep.json";
import konbiniBenchCfg from "./scenes/konbini-bench.json";
import nabeTableCfg from "./scenes/nabe-table.json";
import balconyBlanketCfg from "./scenes/balcony-blanket.json";
import atticReadingCfg from "./scenes/attic-reading.json";
import windowseatCatCfg from "./scenes/windowseat-cat.json";
import porchDogCfg from "./scenes/porch-dog.json";
import tentDogCfg from "./scenes/tent-dog.json";
import bakeryCatCfg from "./scenes/bakery-cat.json";
import libraryOwlCfg from "./scenes/library-owl.json";
import barnReindeerCfg from "./scenes/barn-reindeer.json";
import trainFoxCfg from "./scenes/train-fox.json";
import t80BubbleNightCfg from "./scenes/t80-bubble-night.json";
import w80NeonStreetCfg from "./scenes/w80-neon-street.json";
import w80ArcadeCfg from "./scenes/w80-arcade.json";
import t70TatamiCfg from "./scenes/t70-tatami.json";
import t90GamerRoomCfg from "./scenes/t90-gamer-room.json";
import t00FlipphoneCfg from "./scenes/t00-flipphone.json";
import t80KissatenCfg from "./scenes/t80-kissaten.json";
import t90SentoCfg from "./scenes/t90-sento.json";
import t70TrainNightCfg from "./scenes/t70-train-night.json";
import t80RooftopCfg from "./scenes/t80-rooftop.json";
import w90KonbiniCfg from "./scenes/w90-konbini.json";
import w70ApartmentCfg from "./scenes/w70-apartment.json";
import w00SuburbCfg from "./scenes/w00-suburb.json";
import w60StationCfg from "./scenes/w60-station.json";
import wideFeatures from "../xmas-cat-wide/features.json";

export type SceneEntry = { config: CozyConfig; timing: { reel: number; full: number }; features?: Features };

export const SCENES: Record<string, SceneEntry> = {
  "xmas-cat": { config: xmasCatCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "xmas-cat-wide": { config: xmasCatWideCfg as unknown as CozyConfig, timing: { reel: 45, full: 600 }, features: wideFeatures as unknown as Features },
  "attic-cat": { config: atticCatCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "tokyo-window": { config: tokyoWindowCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "kotatsu-sleep": { config: kotatsuSleepCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "konbini-bench": { config: konbiniBenchCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "nabe-table": { config: nabeTableCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "balcony-blanket": { config: balconyBlanketCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "attic-reading": { config: atticReadingCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "windowseat-cat": { config: windowseatCatCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "porch-dog": { config: porchDogCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "tent-dog": { config: tentDogCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "bakery-cat": { config: bakeryCatCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "library-owl": { config: libraryOwlCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "barn-reindeer": { config: barnReindeerCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "train-fox": { config: trainFoxCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "t80-bubble-night": { config: t80BubbleNightCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "w80-neon-street": { config: w80NeonStreetCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "w80-arcade": { config: w80ArcadeCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "t70-tatami": { config: t70TatamiCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "t90-gamer-room": { config: t90GamerRoomCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "t00-flipphone": { config: t00FlipphoneCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "t80-kissaten": { config: t80KissatenCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "t90-sento": { config: t90SentoCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "t70-train-night": { config: t70TrainNightCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "t80-rooftop": { config: t80RooftopCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "w90-konbini": { config: w90KonbiniCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "w70-apartment": { config: w70ApartmentCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "w00-suburb": { config: w00SuburbCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
  "w60-station": { config: w60StationCfg as unknown as CozyConfig, timing: { reel: 45, full: 40 } },
};
