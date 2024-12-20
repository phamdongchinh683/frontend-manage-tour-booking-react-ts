import { BookTime } from "./BookTime";
import { TourInfo } from "./TourInfo";
import { UserFullName } from "./UserFullName";

export interface PaymentDetail {
 _id: string;
 booking_id: TourInfo | null;
 user_id: UserFullName | null;
 status: number;
 time: BookTime | null;
 card_number: string;
 total_amount: number;
 createAt: string;
}
