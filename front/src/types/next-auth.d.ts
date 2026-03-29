import type { DefaultSession } from "next-auth";
import type { CellSkin, BackgroundSkin, BannerSkin } from "@/types/bff";

declare module "next-auth" {
  interface Session extends DefaultSession {
    skins: {
      background: BackgroundSkin;
      banner: BannerSkin;
      cells: CellSkin;
    };
  }
}
