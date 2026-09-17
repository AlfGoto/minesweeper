import path from "node:path";
import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

const frontSrc = path.resolve(process.cwd(), "../front/src");

// The composition reuses front's real grid components (via the "@" alias
// front itself uses) so the video is pixel-identical to the live site,
// instead of a hand-rolled re-implementation that drifts out of sync.
Config.overrideWebpackConfig((config) => {
  const withTailwind = enableTailwind(config);
  return {
    ...withTailwind,
    resolve: {
      ...withTailwind.resolve,
      alias: {
        ...withTailwind.resolve?.alias,
        "@": frontSrc,
      },
    },
  };
});
