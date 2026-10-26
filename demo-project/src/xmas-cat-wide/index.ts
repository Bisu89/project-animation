import React from "react";
import { Composition, registerRoot } from "remotion";
import { Video, DURATION, POSTER_FRAMES } from "./Video";

// XmasPoster / XmasPosterLoop: the poster stays on for the whole video; picture only (sound is mixed by scripts/xmas_long.py).
// They run 2 s past one playlist: xmas_long.py uses those 2 s to crossfade each pass into the next one.
const PASS = POSTER_FRAMES + 60; // one pass = the whole playlist (scripts/xmas_playlist.py)
const PosterFirst: React.FC = () => React.createElement(Video, { poster: true, audio: false });
const PosterLoop: React.FC = () => React.createElement(Video, { poster: true, loop: true, audio: false });

registerRoot(() =>
  React.createElement(
    React.Fragment,
    null,
    React.createElement(Composition, { id: "XmasCatWide", component: Video, durationInFrames: DURATION, fps: 30, width: 1920, height: 1080 }),
    React.createElement(Composition, { id: "XmasPoster", component: PosterFirst, durationInFrames: PASS, fps: 30, width: 1920, height: 1080 }),
    React.createElement(Composition, { id: "XmasPosterLoop", component: PosterLoop, durationInFrames: PASS, fps: 30, width: 1920, height: 1080 }),
  ),
);
