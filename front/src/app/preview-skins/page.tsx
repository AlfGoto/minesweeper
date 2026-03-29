import type { Metadata } from "next";
import { PreviewSkinsPage } from "@/features/skins";

export const metadata: Metadata = {
  title: "Cell Skins Preview",
  description: "Private preview page for all cell skins.",
  robots: {
    index: false,
    follow: false,
  },
};

export default PreviewSkinsPage;
