export const formatTime = (milliseconds: number): string => {
  if (!milliseconds) return "0min 0s 0ms";

  // Convert to total milliseconds
  const totalMs = Math.floor(milliseconds);

  // Calculate minutes, seconds, and milliseconds
  const days = Math.floor(totalMs / 86400000);
  const hours = Math.floor((totalMs % 86400000) / 3600000);
  const min = Math.floor((totalMs % 3600000) / 60000);
  const sec = Math.floor((totalMs % 60000) / 1000);
  const ms = Math.floor(totalMs % 1000);

  if (days === 0 && hours === 0 && min === 0) return `${sec}s ${ms}ms`;
  if (days === 0 && hours === 0) return `${min}min ${sec}s`;
  if (days === 0) return `${hours}h ${min}min`;
  return `${days}d ${hours}h ${min}min`;
};
