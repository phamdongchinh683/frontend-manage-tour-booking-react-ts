
export interface TourCreation {
 city: string;
 attractions: string;
 days: string;
 prices: {
  adult: number;
  child: number;
 }
 guide: string;
 images: string[];
}