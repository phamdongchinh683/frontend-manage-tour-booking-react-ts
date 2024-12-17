import { IBookingList } from "./BookingList";

export interface BookingPaginate {
 nextCursor: string;
 prevCursor: string;
 totalResults: number;
 bookings: IBookingList[] | null;
}