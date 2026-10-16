import { SKIN } from "../stickman/cast";
import type { Preset } from "../stickman/cast";
import { ENG, FR, GOLD } from "./Stills";

// One consistent, sober character set for the whole pilot: head ~20% smaller than the engine default,
// dot eyes (no white sclera, so no "glasses" read under a helmet), a stern resting face, and period
// headwear. Roles are told apart by headwear + garment colour, never by limb colour (limbs stay ink).
const BASE = { head: 0.8, eyes: "dot", emotion: "stern", outfit: "soldier" } as const;

// English archer: brimmed kettle hat, undyed brown-green jerkin
export const EN_ARCHER: Preset = { ...BASE, hair: "kettle", hairColor: "#70757b", skin: SKIN.light, shape: "round", outfitColor: "#7b6f48", trim: "#3b3322" };
// English man-at-arms: bascinet, white surcoat with the red cross colour as trim
export const EN_MAA: Preset = { ...BASE, hair: "bascinet", hairColor: "#9aa0a6", skin: SKIN.light, shape: "round", outfitColor: "#ece8dc", trim: ENG };
// French man-at-arms: bascinet with a gold plume, blue surcoat with gold trim
export const FR_MAA: Preset = { ...BASE, hair: "bascinet", hairColor: "#7d838a", skin: SKIN.pale, shape: "oval", outfitColor: FR, trim: GOLD, crest: GOLD };
// commanders: same kit as their men, slightly larger and with a coloured crest
export const EN_COMMANDER: Preset = { ...EN_MAA, crest: ENG, scale: 1.1 };
export const FR_COMMANDER: Preset = { ...FR_MAA, outfitColor: "#1f3a73", crest: "#e8d9a0", scale: 1.1 };
