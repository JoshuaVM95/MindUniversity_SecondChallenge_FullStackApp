import { UserAccount } from "../../types";

export interface UserAccountArgs {
	userAccountId: string;
}

interface FilterBy {
	account?: string;
	name?: string;
	initDate?: string;
	endDate?: string;
}

export interface UsersAccountsArgs {
	filterBy: FilterBy;
	page: number;
	rowsPerPage: number;
}

export interface UsersAccountsResponse {
	usersAccounts: UserAccount[];
	totalUsersAccounts: number;
}

export interface AddUserAccountArgs {
	accountId: string;
	userId: string;
	position: string;
}

export interface UpdateUserAccountArgs {
	userAccountId: string;
	position?: string;
	endDate?: string;
}
