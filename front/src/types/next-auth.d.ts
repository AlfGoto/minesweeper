import type { DefaultSession } from "next-auth";
import { CellSkin } from "./skins";

declare module "next-auth" {
  interface Session extends DefaultSession {
    skins: {
      background: string;
      banner: string;
      cells: CellSkin;
    };
  }
}
