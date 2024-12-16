import { TourListResponse } from "./TourListResponse";

export interface TourPaginate {
 nextCursor: string;
 prevCursor: string;
 totalResults: number;
 tours: TourListResponse[] | null;
}