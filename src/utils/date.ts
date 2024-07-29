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
