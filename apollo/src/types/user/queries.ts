import { User } from "../index";

export interface UserQueryVariables {
	userId: string;
}

export interface UsersQueryVariables {
	filterByEmail: string;
	page: number;
	rowsPerPage?: number;
}

export interface UsersQueryResponse {
	users: User[];
	totalUsers: number;
}
