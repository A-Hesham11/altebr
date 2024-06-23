 export const formatDate = (dateObj: Date) => dateObj?.toISOString()?.slice(0, 10)

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
