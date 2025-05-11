// Format time as xxmin xxs xxxms
export const formatTime = (milliseconds: number): string => {
  if (!milliseconds) return '0min 0s 0ms';

  // Convert to total milliseconds
  const totalMs = Math.floor(milliseconds);

  // Calculate minutes, seconds, and milliseconds
  const min = Math.floor(totalMs / 60000);
  const sec = Math.floor((totalMs % 60000) / 1000);
  const ms = Math.floor(totalMs % 1000);

  return `${min}min ${sec}s ${ms}ms`;
};

// Format time as xxmin xxs (no milliseconds)
export const formatTimeNoMs = (milliseconds: number): string => {
  if (!milliseconds) return '0min 0s';

  // Convert to total milliseconds
  const totalMs = Math.floor(milliseconds);

  // Calculate minutes, seconds
  const min = Math.floor(totalMs / 60000);
  const sec = Math.floor((totalMs % 60000) / 1000);

  return `${min}min ${sec}s`;
}; 