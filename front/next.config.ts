import type { NextConfig } from "next";
// import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  outputFileTracingExcludes: {
    "*": [
      "**/node_modules/@swc/**",
      "**/node_modules/@swc/core/**",
      "**/node_modules/@swc/core-*/**",
      "**/node_modules/@parcel/watcher/**",
      "**/node_modules/@parcel/watcher-*/**",
      "**/node_modules/next-intl-swc-plugin-extractor/**",
    ],
  },
};

// const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// export default withNextIntl(nextConfig);
export default nextConfig;