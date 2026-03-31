"use client";

type AlfCoinsProgressCardProps = {
  coins: number;
  revealedCells: number;
  coinStep?: number;
};

export function AlfCoinsProgressCard({
  coins,
  revealedCells,
  coinStep = 1000,
}: AlfCoinsProgressCardProps) {
  const revealedTowardNextCoin = ((revealedCells % coinStep) + coinStep) % coinStep;
  const progressPercent = (revealedTowardNextCoin / coinStep) * 100;

  return (
    <div className="rounded-lg border bg-white px-4 py-3 space-y-2 w-fit">
      <div className="flex gap-3 items-center justify-between">
        <h2 className="text-lg font-semibold">Your AlfCoins</h2>
        <p className="text-2xl font-bold">{coins}</p>
      </div>
      <div className="space-y-1">
        <p className="text-[0.625rem] text-muted-foreground">
          {revealedTowardNextCoin}/{coinStep} revealed cells to next AlfCoin
        </p>
        <div className="h-2 w-48 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-green-300 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
