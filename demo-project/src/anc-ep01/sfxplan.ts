import { TIMELINE } from "./timeline";
import RULES from "./sfxrules.json";
import { buildPlan } from "../anc-lib/sfxplan";

const plan = buildPlan(TIMELINE, RULES);
export const SFX_EVENTS = plan.events;
export const BEDS = plan.beds;
export const HITS: [number, number][] = [];
