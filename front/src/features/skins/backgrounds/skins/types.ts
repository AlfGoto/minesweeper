import type { CSSProperties } from "react";

export type BackgroundSkinFaq = {
  question: string;
  answer: string;
};

export type BackgroundSkinData = {
  value: string;
  style?: CSSProperties;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  keywords: string[];
  faq: BackgroundSkinFaq[];
};
