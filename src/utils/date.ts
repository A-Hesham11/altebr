export const formatDate = (dateObj: Date) =>
  dateObj?.toISOString()?.slice(0, 10);

// get after day date
export function getDayAfter(date = new Date()) {
  const newDay = new Date(date.getTime());
  newDay.setDate(date.getDate() + 1);
  return newDay;
}

// get last day date
export function getDayBefore(date = new Date()) {
  const newDay = new Date(date.getTime());
  newDay.setDate(date.getDate() - 1);
  return newDay;
}

export const formatDateAndTime = (date: Date) => {
  return new Intl.DateTimeFormat("en-Us", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

export const isValidDate = (d: unknown): d is Date =>
  d instanceof Date && !Number.isNaN(d.getTime());

export const toDateSafe = (v: unknown): Date | null => {
  if (v == null || v === "") return null;
  if (v instanceof Date) return isValidDate(v) ? v : null;
  if (typeof v === "string") {
    // prefer ISO 8601 strings from your API like 2025-08-28
    const d = new Date(v);
    return isValidDate(d) ? d : null;
  }
  return null;
};
