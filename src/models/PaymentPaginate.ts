import { PaymentsResponse } from "./PaymentsResponse";

export interface PaymentPaginate {
 nextCursor: string;
 prevCursor: string;
 totalResults: number;
 paymentList: PaymentsResponse[];
}