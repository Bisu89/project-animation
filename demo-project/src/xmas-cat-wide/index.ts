import React from "react";
import { Composition, registerRoot } from "remotion";
import { Video, DURATION } from "./Video";

registerRoot(() =>
  React.createElement(Composition, { id: "XmasCatWide", component: Video, durationInFrames: DURATION, fps: 30, width: 1920, height: 1080 }),
);
