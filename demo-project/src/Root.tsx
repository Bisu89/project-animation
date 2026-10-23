import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { Video as CompoundInterest, DURATION as CompoundInterest_DURATION } from "./compound-interest/Video";
import { Video as WhyIgloos, DURATION as WhyIgloos_DURATION } from "./why-igloos/Video";
import { Video as BigheadTest, DURATION as BigheadTest_DURATION } from "./bighead-test/Video";
import { Video as BigheadDemo, DURATION as BigheadDemo_DURATION } from "./bighead-demo/Video";
import { Video as CastDemo, DURATION as CastDemo_DURATION } from "./cast-demo/Video";
import { Video as HorseDemo, DURATION as HorseDemo_DURATION } from "./horse-demo/Video";
import { Video as Agincourt, DURATION as Agincourt_DURATION } from "./agincourt/Video";
import { FarLayer, MidLayer } from "./agincourt/Stills";
import { Video as SpidermanDemo, DURATION as SpidermanDemo_DURATION } from "./spiderman-demo/Video";
import { Video as SurvivalTest, DURATION as SurvivalTest_DURATION } from "./survival-test/Video";
import { Video as ZombieWalk, DURATION as ZombieWalk_DURATION } from "./zombie-walk/Video";
import { Video as ZsEp01, DURATION as ZsEp01_DURATION } from "./zs-ep01/Video";
import { Video as ZsEp02, DURATION as ZsEp02_DURATION } from "./zs-ep02/Video";
import { Video as AncPilot1, DURATION as AncPilot1_DURATION } from "./anc-pilot1/Video";
import { Video as AncEp01, DURATION as AncEp01_DURATION } from "./anc-ep01/Video";
import { Video as AncEp02, DURATION as AncEp02_DURATION } from "./anc-ep02/Video";
import { Video as AncEp03, DURATION as AncEp03_DURATION } from "./anc-ep03/Video";
// stickman-video:imports

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CompoundInterest"
        component={CompoundInterest}
        durationInFrames={CompoundInterest_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ music: 0.35, sfx: 0.8, voice: "", captions: false }}
      />
      <Composition
        id="WhyIgloos"
        component={WhyIgloos}
        durationInFrames={WhyIgloos_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ music: 0.5, sfx: 0.8, voice: "", captions: true }}
      />
      <Composition
        id="BigheadTest"
        component={BigheadTest}
        durationInFrames={BigheadTest_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ music: 0.35, sfx: 0.8, voice: "", captions: false }}
      />
      <Composition
        id="BigheadDemo"
        component={BigheadDemo}
        durationInFrames={BigheadDemo_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ music: 0.4, sfx: 0.8, voice: "", captions: true }}
      />
      <Composition
        id="CastDemo"
        component={CastDemo}
        durationInFrames={CastDemo_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ music: 0.35, sfx: 0.8, voice: "", captions: false }}
      />
      <Composition
        id="HorseDemo"
        component={HorseDemo}
        durationInFrames={HorseDemo_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ music: 0.35, sfx: 0.8, voice: "", captions: false }}
      />
      <Composition
        id="Agincourt"
        component={Agincourt}
        durationInFrames={Agincourt_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ music: 0.35, sfx: 0.8, voice: "", captions: true }}
      />
      <Composition id="AgincourtFar" component={FarLayer} durationInFrames={1} fps={30} width={1920} height={1080} />
      <Composition id="AgincourtMid" component={MidLayer} durationInFrames={1} fps={30} width={1920} height={1080} />
      <Composition
        id="SpidermanDemo"
        component={SpidermanDemo}
        durationInFrames={SpidermanDemo_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ music: 0.35, sfx: 0.8, voice: "", captions: false }}
      />
      <Composition
        id="SurvivalTest"
        component={SurvivalTest}
        durationInFrames={SurvivalTest_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ music: 0.35, sfx: 0.8, voice: "", captions: false }}
      />
      <Composition
        id="ZombieWalk"
        component={ZombieWalk}
        durationInFrames={ZombieWalk_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ music: 0.35, sfx: 0.8, voice: "", captions: false }}
      />
      <Composition
        id="ZsEp01"
        component={ZsEp01}
        durationInFrames={ZsEp01_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ music: 0.25, sfx: 0.8, voice: "voice.wav", captions: true }}
      />
      <Composition
        id="ZsEp02"
        component={ZsEp02}
        durationInFrames={ZsEp02_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ music: 0.25, sfx: 0.8, voice: "voice.wav", captions: true }}
      />
      <Composition
        id="AncEp01"
        component={AncEp01}
        durationInFrames={AncEp01_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ music: 0, sfx: 0, voice: "voice.wav", captions: true }}
      />
      <Composition
        id="AncPilot1"
        component={AncPilot1}
        durationInFrames={AncPilot1_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ music: 0.18, sfx: 0, voice: "voice.wav", captions: true }}
      />
      <Composition
        id="AncEp02"
        component={AncEp02}
        durationInFrames={AncEp02_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ music: 0, sfx: 0, voice: "voice.wav", captions: true }}
      />
      <Composition
        id="AncEp03"
        component={AncEp03}
        durationInFrames={AncEp03_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ music: 0, sfx: 0, voice: "voice.wav", captions: true }}
      />
      {/* stickman-video:compositions */}
    </>
  );
};
