import { Metadata } from "next";
import { UserProfilePage } from "@/features/user-stats";

export const metadata: Metadata = {
  title: "User Profile",
  description: "View player statistics, game history, and best times.",
  openGraph: {
    title: "Minesweeper User Profile",
    description: "View player statistics, game history, and best times.",
  },
};

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { userId } = await params;
  return <UserProfilePage userId={userId} />;
}
