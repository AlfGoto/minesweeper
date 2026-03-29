import type { Metadata } from "next";
import { CellSkinsPage } from "@/features/cell-skins";

export const metadata: Metadata = {
  title: "Cell Skins Preview",
  description: "Private preview page for all cell skins.",
  robots: {
    index: false,
    follow: false,
  },
};

export default CellSkinsPage;
