const medals: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export function RankMedal({ rank }: { rank: number }) {
  return medals[rank] ? (
    <span className="text-xl">{medals[rank]}</span>
  ) : (
    <span className="text-muted-foreground font-medium">{rank}</span>
  );
}
