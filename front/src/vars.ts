export const HEIGHT = 20;
export const BOMBS_PERCENTAGE = 30;

export const TOTAL_CELLS = HEIGHT * HEIGHT;
export const NUMBER_OF_BOMBS = Math.floor(
  TOTAL_CELLS * (BOMBS_PERCENTAGE / 100)
);
