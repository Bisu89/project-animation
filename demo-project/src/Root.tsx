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
import { Video as CookEp01, DURATION as CookEp01_DURATION } from "./cook-ep01/Video";
import { Video as CampDemo, DURATION as CampDemo_DURATION } from "./camp-demo/Video";
import { Video as BetterTogether, DURATION as BetterTogether_DURATION } from "./better-together/Video";
import { Video as ClassroomGag, DURATION as ClassroomGag_DURATION } from "./classroom-gag/Video";
import { Video as BedroomGag, DURATION as BedroomGag_DURATION } from "./bedroom-gag/Video";
import { Video as MosquitoGag, DURATION as MosquitoGag_DURATION, MosquitoSheet } from "./mosquito-gag/Video";
import { Ep02 as MosquitoGagEp02, DURATION as MosquitoGagEp02_DURATION } from "./mosquito-gag/Ep02";
import { Ep03 as MosquitoGagEp03, DURATION as MosquitoGagEp03_DURATION } from "./mosquito-gag/Ep03";
import { Video as StickCoupleEp01, DURATION as StickCoupleEp01_DURATION } from "./stick-couple/Video";
import { Ep02 as StickCoupleEp02, DURATION as StickCoupleEp02_DURATION } from "./stick-couple/Ep02";
import { Ep03 as StickCoupleEp03, DURATION as StickCoupleEp03_DURATION } from "./stick-couple/Ep03";
import { Ep04 as StickCoupleEp04, DURATION as StickCoupleEp04_DURATION } from "./stick-couple/Ep04";
import { Ep05 as StickCoupleEp05, DURATION as StickCoupleEp05_DURATION } from "./stick-couple/Ep05";
import { StyleTest as SurvivalStyleTest } from "./survival-logs/StyleTest";
import { P1 as SurvivalEp01P1, DURATION as SurvivalEp01P1_DURATION } from "./survival-logs/P1";
import { ShortP1 as SurvivalShortP1, SHORT_DURATION as SurvivalShortP1_DURATION } from "./survival-logs/ShortP1";
import { P2 as SurvivalEp01P2, DURATION as SurvivalEp01P2_DURATION } from "./survival-logs/P2";
import { P3 as SurvivalEp01P3, DURATION as SurvivalEp01P3_DURATION } from "./survival-logs/P3";
import { ShortClip as SurvivalShortClip, shortDuration as survivalShortDuration } from "./survival-logs/ShortClip";
import { Ep06 as StickCoupleEp06, DURATION as StickCoupleEp06_DURATION } from "./stick-couple/Ep06";
import { Sheet as WhyWeDoSheet } from "./why-we-do/Sheet";
import { Ep01 as WhyWeDoEp01, DURATION as WhyWeDoEp01_DURATION } from "./why-we-do/Ep01";
import { Ep01 as BestieTherapistEp01, DURATION as BestieTherapistEp01_DURATION } from "./bestie-therapist/Ep01";
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
        defaultProps={{ music: 0.16, sfx: 1, voice: "voice.wav", captions: true }}
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
        defaultProps={{ music: 0.16, sfx: 1, voice: "voice.wav", captions: true }}
      />
      <Composition
        id="AncEp03"
        component={AncEp03}
        durationInFrames={AncEp03_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ music: 0.16, sfx: 1, voice: "voice.wav", captions: true }}
      />
      <Composition
        id="CookEp01"
        component={CookEp01}
        durationInFrames={CookEp01_DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ music: 0.3, sfx: 0.8 }}
      />
      <Composition
        id="CampDemo"
        component={CampDemo}
        durationInFrames={CampDemo_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
      {/* stickman-video:compositions */}
      <Composition id="BetterTogether" component={BetterTogether} durationInFrames={BetterTogether_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="ClassroomGagEp01" component={ClassroomGag} durationInFrames={ClassroomGag_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="BedroomGagEp01" component={BedroomGag} durationInFrames={BedroomGag_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="MosquitoGag" component={MosquitoGag} durationInFrames={MosquitoGag_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="MosquitoGagEp02" component={MosquitoGagEp02} durationInFrames={MosquitoGagEp02_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="MosquitoGagEp03" component={MosquitoGagEp03} durationInFrames={MosquitoGagEp03_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="StickCoupleEp01" component={StickCoupleEp01} durationInFrames={StickCoupleEp01_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="StickCoupleEp02" component={StickCoupleEp02} durationInFrames={StickCoupleEp02_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="StickCoupleEp03" component={StickCoupleEp03} durationInFrames={StickCoupleEp03_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="StickCoupleEp04" component={StickCoupleEp04} durationInFrames={StickCoupleEp04_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="StickCoupleEp05" component={StickCoupleEp05} durationInFrames={StickCoupleEp05_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="StickCoupleEp06" component={StickCoupleEp06} durationInFrames={StickCoupleEp06_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="WhyWeDoEp01" component={WhyWeDoEp01} durationInFrames={WhyWeDoEp01_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="WhyWeDoSheet" component={WhyWeDoSheet} durationInFrames={30} fps={30} width={1080} height={1920} />
      <Composition id="BestieTherapistEp01" component={BestieTherapistEp01} durationInFrames={BestieTherapistEp01_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="SurvivalStyleTest" component={SurvivalStyleTest} durationInFrames={120} fps={30} width={1920} height={1080} />
      <Composition id="SurvivalEp01P1" component={SurvivalEp01P1} durationInFrames={SurvivalEp01P1_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="SurvivalEp01P2" component={SurvivalEp01P2} durationInFrames={SurvivalEp01P2_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="SurvivalEp01P3" component={SurvivalEp01P3} durationInFrames={SurvivalEp01P3_DURATION} fps={30} width={1920} height={1080} />
      <Composition id="SurvivalShortP1"component={SurvivalShortP1} durationInFrames={SurvivalShortP1_DURATION} fps={30} width={1080} height={1920} />
      <Composition id="SurvivalShort2" component={SurvivalShortClip} durationInFrames={survivalShortDuration("s2")} fps={30} width={1080} height={1920} defaultProps={{ k: "s2" }} />
      <Composition id="SurvivalShort3" component={SurvivalShortClip} durationInFrames={survivalShortDuration("s3")} fps={30} width={1080} height={1920} defaultProps={{ k: "s3" }} />
      <Composition id="SurvivalShort4" component={SurvivalShortClip} durationInFrames={survivalShortDuration("s4")} fps={30} width={1080} height={1920} defaultProps={{ k: "s4" }} />
      <Composition id="SurvivalShort5" component={SurvivalShortClip} durationInFrames={survivalShortDuration("s5")} fps={30} width={1080} height={1920} defaultProps={{ k: "s5" }} />
      <Composition id="MosquitoSheet" component={MosquitoSheet} durationInFrames={30} fps={30} width={1080} height={1920} />
    </>
  );
};
