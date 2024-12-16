import { UsersResponse } from "./UsersReponse";

export interface UserPaginate {
 nextCursor: string;
 prevCursor: string;
 totalResults: number;
 users: UsersResponse[] | null;
}