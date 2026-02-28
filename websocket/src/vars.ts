export const HEIGHT = 20;
export const BOMBS_PERCENTAGE = 17.5; // base = 17.5
// export const BOMBS_PERCENTAGE = 5; // base = 17.5

export const TOTAL_CELLS = HEIGHT * HEIGHT;
export const NUMBER_OF_BOMBS = Math.floor(TOTAL_CELLS * (BOMBS_PERCENTAGE / 100));
export const SAFE_CELLS = TOTAL_CELLS - NUMBER_OF_BOMBS;

