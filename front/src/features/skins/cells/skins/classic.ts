import type { CellSkinDefinition } from "./types";

export const classicSkin: CellSkinDefinition = {
  green:
    "bg-[#c0c0c0] border-3 border-t-[#fefefe] border-l-[#fefefe] border-r-[#818181] border-b-[#818181]",
  lightGreen:
    "bg-[#c0c0c0] border-3 border-t-[#fefefe] border-l-[#fefefe] border-r-[#818181] border-b-[#818181]",
  gray: "bg-[#bfc1be] border-1 border-[#808280]",
  silver: "bg-[#bfc1be] border-1 border-[#808280]",
  number: {
    0: "",
    1: "text-blue-700",
    2: "text-green-700",
    3: "text-red-700",
    4: "text-violet-700",
    5: "text-amber-700",
    6: "text-cyan-700",
    7: "text-orange-700",
    8: "text-gray-700",
  },
  name: "Classic",
  slug: "classic",
  description:
    "The original Minesweeper look with silver 3D beveled unrevealed cells and flat revealed tiles. A timeless design that brings back nostalgic memories.",
  longDescription:
    "The Classic skin recreates the beloved original Minesweeper aesthetic that millions of players grew up with. Featuring iconic silver beveled cells with 3D raised edges for unrevealed areas and flat gray revealed tiles, this skin delivers pure nostalgia. The familiar Windows 95 style design brings back memories of countless hours spent carefully flagging mines. Perfect for players who appreciate the timeless design that made Minesweeper a worldwide phenomenon.",
  keywords: [
    "classic minesweeper skin",
    "original minesweeper theme",
    "retro minesweeper",
    "nostalgic minesweeper",
    "traditional minesweeper design",
    "windows 95 minesweeper",
  ],
  translations: {
    fr: {
      name: "Classique",
      description:
        "Le look original du Démineur avec des cellules non révélées argentées en relief 3D et des tuiles révélées plates. Un design intemporel qui rappelle des souvenirs nostalgiques.",
      longDescription:
        "Le skin Classique recrée l'esthétique emblématique du Démineur original que des millions de joueurs ont connu. Avec ses cellules argentées emblématiques aux bords en relief 3D pour les zones non révélées et ses tuiles révélées grises plates, ce skin délivre une pure nostalgie. Le design familier du style Windows 95 rappelle d'innombrables heures passées à marquer soigneusement les mines. Parfait pour les joueurs qui apprécient le design intemporel qui a fait du Démineur un phénomène mondial.",
      keywords: [
        "skin démineur classique",
        "thème démineur original",
        "démineur rétro",
        "démineur nostalgique",
        "design démineur traditionnel",
        "démineur windows 95",
      ],
    },
    es: {
      name: "Clásico",
      description:
        "El aspecto original del Buscaminas con celdas sin revelar plateadas en relieve 3D y baldosas reveladas planas. Un diseño atemporal que trae recuerdos nostálgicos.",
      longDescription:
        "El skin Clásico recrea la querida estética original del Buscaminas que millones de jugadores conocieron. Con sus icónicas celdas plateadas con bordes elevados en 3D para áreas sin revelar y baldosas reveladas grises planas, este skin ofrece pura nostalgia. El familiar diseño estilo Windows 95 trae recuerdos de innumerables horas marcando cuidadosamente las minas. Perfecto para jugadores que aprecian el diseño atemporal que hizo del Buscaminas un fenómeno mundial.",
      keywords: [
        "skin buscaminas clásico",
        "tema buscaminas original",
        "buscaminas retro",
        "buscaminas nostálgico",
        "diseño buscaminas tradicional",
        "buscaminas windows 95",
      ],
    },
  },
};
