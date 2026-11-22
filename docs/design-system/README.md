# Minesweeper

The mini design system of **minesweeper.fr**. It formalizes what the site already does: shadcn/ui (new-york) tokens from `front/src/app/globals.css`, the Geist font, the `components/ui/` parts the site really uses, and a few site patterns. Nothing new was invented.

## Three hard rules

1. **Light only.** No dark mode, now or later. It looks wrong for this game and it would double the work on every skin.
2. **Skins are not in the design system.** Cell colours, number colours, flag and bomb emojis, and background skins live in each skin file (`features/skins/cells/skins/*`, `features/skins/backgrounds/skins/*`). The interface around them stays neutral so any skin looks good.
3. **The interface is greyscale; the game brings the colour.** UI uses `primary` (near-black), `muted`, `border` and white. The only hue in the UI is the small green accent (`green-700` for text, `green-300`…) and `destructive` for errors.

## Content fundamentals

- **Voice:** short, friendly, direct. Imperative buttons: "Restart", "Back to game", "Play Minesweeper Now", "Sign in to unlock".
- **Three languages:** English, French, Spanish (next-intl). Every visible string comes from `messages/*.json`. Leave room: French and Spanish run ~20–30% longer than English.
- **Names:** AlfCoins (one word, capital A and C). Skins have proper names ("Jade Temple"). "Grid" skins in the UI = cell skins in the code.
- **Emoji:** allowed in the game. Skins use emojis for flags and bombs. Not used as icons in UI chrome. The win title is "You Won!" (no emoji).
- **SEO pages** (`/skins`, `/skins/[skinName]`, `/skins/background/[skinName]`, `/how-to-play`, `/blog`): their texts, titles and structure are frozen. A redesign may change layout and visuals only.

## Visual foundations

- **Canvas:** the page background is the player's background skin (Classic = `background`, white). So content never sits directly on the canvas: it sits in a **white bordered card** (`background` + `border` + `radius-lg`), see PageContainer. On dark backgrounds the card is `white/88` with a blur.
- **Surfaces:** flat. One hairline `border`, small shadows (`shadow-xs` buttons, `shadow-sm` cards, `shadow-lg` dialogs and the game menu). No gradients in UI chrome.
- **Type:** Geist only (`--font-sans`), Geist Mono for numbers if needed. Hierarchy by size and weight, never by colour: H1 36px bold, section H2 24px semibold, body 16px with relaxed leading, helper text 14px `muted-foreground`.
- **Colour use:** text = `foreground`; secondary text = `muted-foreground`; actions = `primary`; hover fills = `accent`; links and the current breadcrumb = `green-700` (about 5:1 on white). `green-600` is no longer used for text: it was only 3.2:1.
- **Radius:** base 10px. Buttons `radius-md`, cards and dialogs `radius-lg`/`radius-xl`, chips and progress bars `radius-full`.
- **Spacing:** Tailwind 4px scale. Pages: `space-4` padding on mobile, `space-8` on md+. Sections: `space-10` apart. Widths: 768px (narrow, skin pages), 896px (default, /skins), 1152px (wide).
- **Motion:** tw-animate-css fade + zoom-95 on dialogs and popovers (200ms). The game has its own keyframes (cell reveal, flag fall, bomb explode, win sweep): those belong to the game, not the UI.
- **Focus:** 3px ring in `ring` at 50%. Never remove it.

## Iconography

- **lucide-react** at 16px (`size-4`) inside buttons, stroke default. Example: the dialog close `X`.
- **Emojis** for game objects (🚩 💣 and each skin's own pair).
- No logo file exists in the repo: the brand is the word "Minesweeper" set in Geist.

## Components in this system

| Component | From | Use |
| --- | --- | --- |
| Button | `ui/button` | Every action. Default (primary), outline, secondary, ghost, link, destructive. |
| Dialog | `ui/dialog` | Win and lose dialogs, confirmations. |
| Tabs | `ui/tabs` | /skins Collection (Grid, Backgrounds, Banners), /stats. |
| Popover | `ui/popover` | Skin preview on click, buy confirmation, sign-in prompt. |
| Select | `ui/select` | Locale switcher, filters. |
| Table | `ui/table` | Leaderboards, latest games. |
| Separator | `ui/separator` | Between groups in the Collection. |
| Skeleton | `ui/skeleton` | Loading states on /stats. |
| Tooltip | `ui/tooltip` | Short hints on icons. |
| Toast | `ui/sonner` | "Skin bought.", "Skin selected.", errors. |
| PageContainer | `components/page-container` | Shell of every content page. |
| Breadcrumbs | `components/breadcrumbs` | Top of SEO pages. |
| SkinChip | skin pages | Pill links to related skins. |
| AlfCoinsCard | `features/skins` | Balance + progress to next AlfCoin. |
| GameMenu | `features/homepage` | Desktop menu beside the grid. |

`alert` and `card` exist in `components/ui/` but no page imports them today.

## Not synced

- Fonts: Geist is loaded by `next/font` (Google). No font file in the repo, so none is stored here.
- `sidebar-*` and `chart-*` tokens: sidebar ones are unused and left out; chart ones kept for /stats.
