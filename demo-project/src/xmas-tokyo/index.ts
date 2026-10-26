import React from "react";
import { Composition, registerRoot } from "remotion";
import { Video, PASS_FRAMES, Short, SHORT_FRAMES } from "./Video";

// One pass = one playlist + 2 s (crossfaded into the next pass by scripts/xmas_long.py). Picture only.
const PASS = PASS_FRAMES + 60;
const First: React.FC = () => React.createElement(Video, { loop: false });
const Loop: React.FC = () => React.createElement(Video, { loop: true });

registerRoot(() =>
  React.createElement(
    React.Fragment,
    null,
    React.createElement(Composition, { id: "XmasTokyo", component: First, durationInFrames: PASS, fps: 30, width: 1920, height: 1080 }),
    React.createElement(Composition, { id: "XmasTokyoLoop", component: Loop, durationInFrames: PASS, fps: 30, width: 1920, height: 1080 }),
    React.createElement(Composition, { id: "XmasTokyoShort", component: Short, durationInFrames: SHORT_FRAMES, fps: 30, width: 1080, height: 1920 }),
  ),
);
