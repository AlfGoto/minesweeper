import type { DefaultSession } from "next-auth";
import type { CellSkin } from "@/features/homepage/components/cell-skins";

declare module "next-auth" {
  interface Session extends DefaultSession {
    skins: {
      background: string;
      banner: string;
      cells: CellSkin;
    };
  }
}
