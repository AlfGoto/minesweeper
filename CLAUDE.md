# CLAUDE.md

## Product
Minesweeper.fr is a free, competitive browser Minesweeper (20×20 grid, 30% bombs). Every game is played server-side and ranked worldwide. Players earn AlfCoins to unlock cosmetic skins.

## Repo map
4 independent npm folders. Keep it that way.

- `front/`: Next.js on Cloudflare Workers via OpenNext.
- `websocket/`: Cloudflare Worker + Durable Object. Server-side game logic.
- `api/`: BFF on AWS (DynamoDB + Lambda + HTTP API), built with projalf.
- `video/`: Remotion skin demos.

## Rules
- **Words:** use `CONTEXT.md`. Never use its _Avoid_ words.
- **Scope:** build only what the issue says. If something is not decided, ask in a comment.
- **Git:** never push to `main`. Work on a branch, open a PR.
- **Agents never deploy.** Merging to `main` deploys the front (Cloudflare). Alfred deploys `websocket/` and `api/` by hand.
- Ignore `api/.github/workflows/ci-cd.yml` (from projalf).
- **Back:** never read every player to render a page. Keep DynamoDB reads small.
- **UI:** light mode only, never dark mode. UI work → read `docs/design-system/README.md` first. Use its tokens and components. Never paste raw colors, sizes or fonts.
- **Language:** everything in English: code, comments, PRs, issues, docs.
