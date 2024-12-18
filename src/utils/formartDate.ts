export function formatDate(param: string) {
 const dateObj = new Date(param);
 const month: number = dateObj.getUTCMonth() + 1;
 const day: number = dateObj.getUTCDate();
 const year: number = dateObj.getUTCFullYear();
 const newDate: string = `${year}/${month}/${day}`;
 return newDate;
}
