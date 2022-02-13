import { UserAccount, UserAccountFilters } from "../../types";

export interface UserAccountQueryVariables {
	userAccountId: string;
}

export interface UsersAccountsQueryVariables {
	filterBy: UserAccountFilters;
	page: number;
	rowsPerPage: number;
}

export interface UsersAccountsQueryResponse {
	usersAccounts: UserAccount[];
	totalUsersAccounts: number;
}
