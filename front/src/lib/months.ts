export const FIRST_MONTH = "2026-07";

// A valid month key (yyyy-MM) from the first month to the current UTC month
export const isValidMonth = (month: string): boolean => {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return false;
  return month >= FIRST_MONTH && month <= new Date().toISOString().slice(0, 7);
};

// Month name for a yyyy-MM key, always in UTC
export const formatMonth = (month: string, locale: string): string =>
  new Date(`${month}-01T00:00:00Z`).toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
