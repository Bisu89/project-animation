import React from "react";
import { Composition, registerRoot } from "remotion";
import { Video, DURATION } from "./Video";

const REEL = 30 * 20;
const ReelVideo: React.FC = () => React.createElement(Video, { total: REEL, reel: true });

registerRoot(() =>
  React.createElement(
    React.Fragment,
    null,
    React.createElement(Composition, { id: "XmasCat", component: Video, durationInFrames: DURATION, fps: 30, width: 1080, height: 1920 }),
    React.createElement(Composition, { id: "XmasReel", component: ReelVideo, durationInFrames: REEL, fps: 30, width: 1080, height: 1920 }),
  ),
);
