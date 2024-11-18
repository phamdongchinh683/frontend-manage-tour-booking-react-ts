import { GuideTour } from "./GuideTour";
import { PriceTour } from "./PriceTour";

export interface TourUpdate {
 _id: string;
 city: string;
 attractions: string[];
 days: string;
 prices: PriceTour;
 guides: GuideTour[];
 images: string[];
 createAt: string;
}