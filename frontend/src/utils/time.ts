export const formatTime = (milliseconds: number): string => {
  if (!milliseconds) return "0min 0s 0ms";

  const totalMs = Math.floor(milliseconds);

  const days = Math.floor(totalMs / 86400000);
  const hours = Math.floor((totalMs % 86400000) / 3600000);
  const min = Math.floor((totalMs % 3600000) / 60000);
  const sec = Math.floor((totalMs % 60000) / 1000);
  const ms = totalMs % 1000;

  const parts: string[] = [];

  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (min) parts.push(`${min}min`);
  if (sec) parts.push(`${sec}s`);

  const isShort = days === 0 && hours === 0 && min === 0;

  if (isShort && ms) parts.push(`${ms}ms`);

  // If no major parts, show all zeros
  if (parts.length === 0) return "0min 0s 0ms";

  return parts.join(" ");
};
