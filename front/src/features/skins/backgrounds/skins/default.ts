import type { BackgroundSkinData } from "./types";

export const defaultSkin: BackgroundSkinData = {
  value: "bg-background",
  name: "Classic",
  slug: "classic-background",
  description:
    "A clean neutral Minesweeper background skin with the default light canvas and distraction-free contrast.",
  longDescription:
    "The Classic background skin keeps Minesweeper on a bright neutral canvas that matches the default app style. It is designed for players who want maximum readability, familiar contrast, and a lightweight visual frame around the board without extra color intensity. Because the background stays understated, the game grid, skins, timers, and statistics remain the main focus during play.",
  keywords: [
    "classic minesweeper background",
    "default minesweeper background skin",
    "light minesweeper theme",
    "clean minesweeper background",
    "minimal minesweeper background",
    "neutral minesweeper skin",
  ],
  faq: [
    {
      question: "What is the Classic background skin in Minesweeper?",
      answer:
        "The Classic background skin keeps the game on the default light neutral canvas, giving players a clean and familiar backdrop with strong readability.",
    },
    {
      question: "Who should use the Classic Minesweeper background?",
      answer:
        "It is ideal for players who want a distraction-free look, predictable contrast, and a background that keeps the board and cell skins as the main visual focus.",
    },
    {
      question: "Does the Classic background change gameplay?",
      answer:
        "No. It only changes the visual backdrop around the game interface and does not affect Minesweeper rules, controls, or difficulty.",
    },
  ],
};
