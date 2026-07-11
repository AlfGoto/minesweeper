import type { Metadata } from "next";
import { PreviewSkinsPage } from "@/features/skins";

export const metadata: Metadata = {
  title: "Skins Preview",
  description: "Private preview page for cell skins and background skins.",
  robots: {
    index: false,
    follow: false,
  },
};

export default PreviewSkinsPage;
