import type { CellSkinDefinition } from "./types";

export const defaultSkin: CellSkinDefinition = {
  green: "bg-[limegreen] contrast-[0.8]",
  lightGreen: "bg-[lightgreen] contrast-[0.8]",
  gray: "bg-[tan] contrast-[0.9] transition-none",
  silver: "bg-[wheat] contrast-[0.9] transition-none",
  flagEmoji: "🚩",
  bombEmoji: "💣",
  number: {
    0: "",
    1: "text-blue-600",
    2: "text-green-600",
    3: "text-red-600",
    4: "text-purple-600",
    5: "text-yellow-600",
    6: "text-pink-600",
    7: "text-orange-600",
    8: "text-gray-600",
  },
  name: "Green Grass",
  slug: "green-grass",
  description:
    "A fresh nature-inspired theme with vibrant grass green unrevealed cells and soft earth-toned revealed tiles. Play Minesweeper on a lush meadow.",
  longDescription:
    "The Green Grass skin brings the outdoors to your Minesweeper game with a fresh nature-inspired aesthetic. Unrevealed cells feature vibrant lime and light green tones that evoke a lush grass lawn, while revealed tiles display warm tan and wheat colors reminiscent of sun-dried earth beneath the grass. The classic red flag and bomb emojis complete the outdoor feel. Perfect for players who want a cheerful, natural look that makes every game feel like a walk in the park.",
  keywords: [
    "grass minesweeper skin",
    "green minesweeper theme",
    "nature minesweeper",
    "meadow minesweeper skin",
    "outdoor minesweeper design",
    "lawn minesweeper theme",
  ],
  translations: {
    fr: {
      name: "Herbe Verte",
      description:
        "Un thème inspiré de la nature avec des cellules non révélées vert vif et des tuiles révélées aux tons terreux. Jouez au Démineur sur une prairie luxuriante.",
      longDescription:
        "Le skin Herbe Verte apporte le plein air à votre jeu de Démineur avec une esthétique fraîche inspirée de la nature. Les cellules non révélées présentent des tons vert citron et vert clair vibrants qui évoquent une pelouse luxuriante, tandis que les tuiles révélées affichent des couleurs chaudes de tan et de blé rappelant la terre séchée au soleil sous l'herbe. Le drapeau rouge classique et les emojis de bombe complètent l'ambiance extérieure. Parfait pour les joueurs qui veulent un look naturel et joyeux qui rend chaque partie comme une promenade dans le parc.",
      keywords: [
        "skin démineur herbe",
        "thème démineur vert",
        "démineur nature",
        "skin démineur prairie",
        "design démineur extérieur",
        "thème démineur pelouse",
      ],
    },
    es: {
      name: "Hierba Verde",
      description:
        "Un tema inspirado en la naturaleza con celdas sin revelar de color verde vibrante y baldosas reveladas en tonos tierra. Juega al Buscaminas en un prado exuberante.",
      longDescription:
        "El skin Hierba Verde trae el exterior a tu juego de Buscaminas con una estética fresca inspirada en la naturaleza. Las celdas sin revelar presentan tonos vibrantes de lima y verde claro que evocan un césped exuberante, mientras que las baldosas reveladas muestran colores cálidos de bronceado y trigo que recuerdan a la tierra secada por el sol bajo la hierba. La bandera roja clásica y los emojis de bomba completan la sensación al aire libre. Perfecto para jugadores que quieren un aspecto natural y alegre que hace que cada partida se sienta como un paseo por el parque.",
      keywords: [
        "skin buscaminas hierba",
        "tema buscaminas verde",
        "buscaminas naturaleza",
        "skin buscaminas pradera",
        "diseño buscaminas exterior",
        "tema buscaminas césped",
      ],
    },
  },
};
