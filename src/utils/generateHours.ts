export function generateHours(startHour: number, endHour: number): string[] {
 const hours: string[] = [];
 for (let hour = startHour; hour <= endHour; hour++) {
  hours.push(`${hour}:00`);
 }
 return hours;
}

export const hours: string[] = generateHours(7, 24);
