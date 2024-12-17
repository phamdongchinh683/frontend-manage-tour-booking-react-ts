export interface IBookingList {
 _id: string;
 tour_id: {
  city: string;
 };
 user_id: {
  fullName: {
   firstName: string;
   lastName: string;
  }
 } | null;
 guide_id: {
  fullName: {
   firstName: string;
   lastName: string;
  }
 };
 number_visitors: number;
 start_tour: string,
 time: {
  start_time: string,
  end_time: string
 },
}