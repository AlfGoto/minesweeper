import {
  HeaderSkeleton,
  StatsSkeleton,
  GamesSkeleton,
} from "@/features/stats/components/skeletons";

export default async function Loading() {
  return (
    <div className="max-w-[1000px] mx-auto w-full h-full flex flex-col justify-center m-4 rounded-lg p-4 gap-6">
      <HeaderSkeleton />
      <StatsSkeleton />
      <GamesSkeleton />
    </div>
  );
}
