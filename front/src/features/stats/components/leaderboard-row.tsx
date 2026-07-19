import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDate, formatTime } from "@/lib/dates";
import { createPlayerSlug } from "@/lib/utils";
import { BestGame } from "@/types/bff";

interface LeaderboardRowProps {
  game: BestGame;
  rank: number;
}

export function LeaderboardRow({ game, rank }: LeaderboardRowProps) {
  const href = `/players/${createPlayerSlug(game.userName, game.userId)}`;

  return (
    <TableRow className="hover:bg-gray-100">
      <TableCell style={{ textAlign: "left" }}>
        <Link href={href} className="block">
          {rank === 1 ? (
            <span className="text-xl">🥇</span>
          ) : rank === 2 ? (
            <span className="text-xl">🥈</span>
          ) : rank === 3 ? (
            <span className="text-xl">🥉</span>
          ) : (
            <span className="text-muted-foreground font-medium">{rank}</span>
          )}
        </Link>
      </TableCell>
      <TableCell style={{ textAlign: "left" }}>
        <Link href={href} className="flex items-center gap-3">
          <Image
            src={game.userPicture}
            alt={game.userName}
            width={36}
            height={36}
            className="rounded-full ring-2 ring-muted"
          />
          <span className="font-medium">{game.userName}</span>
        </Link>
      </TableCell>
      <TableCell
        className="font-mono font-semibold"
        style={{ textAlign: "left" }}
      >
        <Link href={href} className="block">
          {formatTime(game.time)}
        </Link>
      </TableCell>
      <TableCell className="text-muted-foreground" style={{ textAlign: "left" }}>
        <Link href={href} className="block">
          {game.flags}
        </Link>
      </TableCell>
      <TableCell className="text-muted-foreground" style={{ textAlign: "left" }}>
        <Link href={href} className="block">
          {formatDate(game.date)}
        </Link>
      </TableCell>
    </TableRow>
  );
}
