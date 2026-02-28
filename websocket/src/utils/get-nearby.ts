import { HEIGHT } from "../vars";

export function getNearbySquares(id: number) {
  const row = Math.floor(id / HEIGHT);
  const col = id % HEIGHT;

  let nerbs = [];

  const isLeft = col === 0;
  const isRight = col === HEIGHT - 1;
  const isTop = row === 0;
  const isBottom = row === HEIGHT - 1;

  if (!isLeft) nerbs.push(id - 1);
  if (!isRight) nerbs.push(id + 1);
  if (!isTop) nerbs.push(id - HEIGHT);
  if (!isBottom) nerbs.push(id + HEIGHT);
  if (!isLeft && !isTop) nerbs.push(id - 1 - HEIGHT);
  if (!isRight && !isTop) nerbs.push(id + 1 - HEIGHT);
  if (!isLeft && !isBottom) nerbs.push(id - 1 + HEIGHT);
  if (!isRight && !isBottom) nerbs.push(id + 1 + HEIGHT);

  return nerbs;
}

