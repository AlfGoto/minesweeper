export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userImage: string | null;
  time: number;
  date: string;
}

export interface UserStats {
  userId: string;
  userName: string;
  userImage: string | null;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  fastestWin: number;
  averageWinTime: number;
  bombsExploded: number;
  noFlagWins: number;
  timePlayed: number;
  averageGameTime: number;
  totalCellsRevealed: number;
  gameRestarts: number;
  abandonedGames: number;
  restartedGames: number;
  totalFlagsUsed: number;
  recentGames: RecentGame[];
}

export interface RecentGame {
  id: string;
  status: string;
  time: number;
  date: string;
  cellsRevealed: number;
  usedFlags: number;
}