# Minesweeper.fr

A free, competitive browser Minesweeper (20×20 grid, 30% bombs) where every game is played server-side, ranked worldwide, and rewards players with currency to unlock cosmetic skins.

## Players and games

**Player**:
A person signed in with Google whose games are saved and ranked.
_Avoid_: User (in product copy), account

**Visitor**:
Someone browsing the site without being signed in. Can play, but nothing is saved or ranked.
_Avoid_: Guest, anonymous user

**Game**:
One attempt at a grid, ending as won, lost or restarted.
_Avoid_: Match, round, run

**Won game**:
A game where every safe cell was revealed.

**Lost game**:
A game ended by revealing a bomb.

**Restarted game**:
A game abandoned by the player starting a new grid before winning or losing. Counts as a game.

**No-flag win**:
A won game with zero flags placed.

**Win rate**:
Won games divided by all games (restarted games included).

**End-game dialog**:
The dialog shown when a game ends, either a win dialog or a lose dialog. Not shown for a restarted game.
_Avoid_: Modal, popup, game over screen

**Win dialog**:
The end-game dialog shown after a won game.

**Lose dialog**:
The end-game dialog shown after a lost game.

## Rankings

**Best time**:
A player's fastest won game, all time.
_Avoid_: Record (except for the single top time of a leaderboard)

**Time played**:
The total time a player spent across all their games.

**Leaderboard**:
A ranked list of players on one metric (best time, time played, monthly best time).
_Avoid_: Ranking table, scoreboard

**Month**:
A calendar month in UTC. Every game belongs to exactly one month, by its UTC date.

**Monthly best time**:
A player's fastest won game within one month.

**Monthly leaderboard**:
The leaderboard of monthly best times for one month, top 100 at most.

**Current month**:
The month in progress, shown first on the stats page.

**Percentile**:
A player's position among all ranked players, shown as "top X%".
_Avoid_: Rank (when a percentage is meant)

## Economy and cosmetics

**AlfCoins**:
The in-game currency, earned by revealing cells (1 per 1,000 revealed cells) and spent to unlock skins.
_Avoid_: Coins, credits, points

**Skin**:
A cosmetic that changes the look of the game. Three kinds: cell skin, background, banner.
_Avoid_: Theme

**Cell skin**:
A skin that changes the grid: cell colors, number colors 1–8, flag and bomb.
_Avoid_: Tile skin, board theme

**Background**:
A skin that changes the page behind the grid.
_Avoid_: Wallpaper, background skin (in copy)

**Banner**:
A skin kind announced but not yet available.

**Default skin**:
The skin a player uses when they have never selected one of that kind. Games with no selected skin count for it.

**Selected skin**:
The skin of each kind a player currently uses. A game is credited to the skins selected when it is saved.

**Unlocked skin**:
A skin a player owns, bought with AlfCoins or given by default.
_Avoid_: Purchased skin, owned skin

**Skin stats**:
Totals for one skin across all players: games, wins, win rate, time played, best time.

## Site

**Collection**:
The `/skins` page, for everyone: every skin as a card with a live preview. Visitors see prices and a login banner; players also see their AlfCoins and unlock and select skins there.
_Avoid_: Shop, gallery, catalog

**Design system**:
The documented light-mode tokens and UI components of the site, excluding skins and game colors.
