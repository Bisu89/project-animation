// Entry for every "cozy night" scene. One scene = one JSON in ./scenes (see ../cozy-scene/types.ts) registered in ./registry.ts.
//   npx remotion studio src/cozy-scene/index.ts
//   npx remotion render src/cozy-scene/index.ts <id>-reel  out.mp4 --public-dir=<dir>     (Reels, config.timing.reel seconds)
//   npx remotion render src/cozy-scene/index.ts <id>-full  out.mp4 --public-dir=<dir>     (long cut, config.timing.full seconds)
import React from "react";
import { Composition, registerRoot } from "remotion";
import { CozyScene, FPS } from "./CozyScene";
import { SCENES } from "./registry";

const make = (id: string, total: number, reel: boolean): React.FC => {
  const entry = SCENES[id];
  const C: React.FC = () => React.createElement(CozyScene, { config: entry.config, features: entry.features, total, reel });
  return C;
};

registerRoot(() =>
  React.createElement(
    React.Fragment,
    null,
    ...Object.entries(SCENES).flatMap(([id, entry]) => {
      const [w, h] = entry.config.view.out;
      return [
        React.createElement(Composition, { key: `${id}-reel`, id: `${id}-reel`, component: make(id, entry.timing.reel * FPS, true), durationInFrames: entry.timing.reel * FPS, fps: FPS, width: w, height: h }),
        React.createElement(Composition, { key: `${id}-full`, id: `${id}-full`, component: make(id, entry.timing.full * FPS, false), durationInFrames: entry.timing.full * FPS, fps: FPS, width: w, height: h }),
      ];
    }),
  ),
);
