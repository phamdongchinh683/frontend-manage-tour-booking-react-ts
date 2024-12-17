export interface BookingDetail {
 _id: string,
 tour_id: string,
 user_id: string,
 guide_id: string,
 number_visitors: number,
 start_tour: string,
 time: {
  start_time: string,
  end_time: string
 },
 createAt: string;
}