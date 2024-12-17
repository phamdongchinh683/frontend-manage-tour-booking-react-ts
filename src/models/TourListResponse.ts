import { PriceTour } from "./PriceTour";
export interface TourListResponse {
 _id: string;
 city: string;
 attractions: string[] | null;
 days: string | null;
 prices: PriceTour | null;
 guide: string | null;
 images: string[] | null;
 createAt: string | null;
}