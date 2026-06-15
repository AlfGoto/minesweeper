export const formatTime = (milliseconds: number): string => {
  const totalMs = Math.floor(milliseconds);

  const days = Math.floor(totalMs / 86400000);
  const hours = Math.floor((totalMs % 86400000) / 3600000);
  const min = Math.floor((totalMs % 3600000) / 60000);
  const sec = Math.floor((totalMs % 60000) / 1000);
  const ms = totalMs % 1000;

  const parts: string[] = [];

  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${days ? String(hours).padStart(2, "0") : hours}h`);
  if (min) parts.push(`${days || hours ? String(min).padStart(2, "0") : min}min`);
  if (sec) parts.push(`${days || hours || min ? String(sec).padStart(2, "0") : sec}s`);

  const isShort = days === 0 && hours === 0 && min === 0;

  if (isShort && ms) parts.push(`${sec ? String(ms).padStart(3, "0") : ms}ms`);

  if (parts.length === 0) return "0s";

  return parts.join(" ");
};

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
