import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createPlayerSlug(userName: string, userId: string): string {
  const firstName = userName.split(" ")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${firstName}-${userId}`;
}

export function extractUserIdFromSlug(slug: string): string {
  return slug.split("-").pop() ?? slug;
}
