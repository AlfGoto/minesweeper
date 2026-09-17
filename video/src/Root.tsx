import React from "react";
import { Composition } from "remotion";
import { SkinDemo } from "./SkinDemo";
import defaultSkin from "../data/skins.json";
import "./style.css";

const FPS = 30;
const DURATION_SECONDS = 9;

const sampleSkin = defaultSkin[0];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SkinDemoTikTok"
        component={SkinDemo}
        durationInFrames={FPS * DURATION_SECONDS}
        fps={FPS}
        width={1440}
        height={2560}
        defaultProps={{ skin: sampleSkin }}
      />
      <Composition
        id="SkinDemoYouTube"
        component={SkinDemo}
        durationInFrames={FPS * DURATION_SECONDS}
        fps={FPS}
        width={2560}
        height={1440}
        defaultProps={{ skin: sampleSkin }}
      />
    </>
  );
};
