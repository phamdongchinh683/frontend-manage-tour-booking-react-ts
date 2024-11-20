import { PriceTour } from "./PriceTour";

export interface TourUpdate {
 _id: string;
 city: string;
 attractions: string;
 days: string;
 prices: PriceTour;
 guide: string;
 images: string[];
 createAt: string;
}