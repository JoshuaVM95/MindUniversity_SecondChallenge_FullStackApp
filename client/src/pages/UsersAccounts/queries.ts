import { gql } from "@apollo/client";
import { GenericResponse, Position } from "../../types";

export interface AddUserAccountResponse {
	addUserAccount: GenericResponse;
}
export const AddUserAccountMutation = gql`
	mutation addUserAccount($accountId: String!, $userId: String!, $position: String!) {
		addUserAccount(accountId: $accountId, userId: $userId, position: $position) {
			message
			code
		}
	}
`;

interface User {
	id: string;
	userInfo: {
		firstName: string;
		lastName: string;
	};
}
interface Account {
	id: string;
	name: string;
}
interface UserAccount {
	id: string;
	user: User;
	account: Account;
	position: Position;
	initDate: string;
	endDate: string;
}
export interface UsersAccountsResponse {
	usersAccounts: {
		usersAccounts: UserAccount[];
		totalUsersAccounts: number;
	};
}
export const UsersAccountsQuery = gql`
	query usersAccounts($filterBy: Filter, $page: Int!, $rowsPerPage: Int!) {
		usersAccounts(filterBy: $filterBy, page: $page, rowsPerPage: $rowsPerPage) {
			usersAccounts {
				id
				position
				initDate
				endDate
				user {
					id
					userInfo {
						firstName
						lastName
					}
				}
				account {
					id
					name
				}
			}
			totalUsersAccounts
		}
	}
`;

export interface UserAccountResponse {
	userAccount: UserAccount;
}
export const UserAccountQuery = gql`
	query userAccount($userAccountId: String!) {
		userAccount(userAccountId: $userAccountId) {
			id
			position
			initDate
			endDate
			user {
				id
				userInfo {
					firstName
					lastName
				}
			}
			account {
				id
				name
			}
		}
	}
`;

export interface UpdateUserAccountVariables {
	userAccountId: string;
	position?: string;
	endDate?: string;
}
export interface UpdateUserAccountResponse {
	updateUserAccount: GenericResponse;
}
export const UpdateUserAccountMutation = gql`
	mutation updateUserAccount($userAccountId: String!, $position: String, $endDate: String) {
		updateUserAccount(userAccountId: $userAccountId, position: $position, endDate: $endDate) {
			message
			code
		}
	}
`;

export interface UserOption {
	id: string;
	userInfo: {
		firstName: string;
		lastName: string;
	};
	isSuper: boolean;
}
export interface UsersResponse {
	users: {
		users: UserOption[];
		totalUsers: number;
	};
}
export const UsersQuery = gql`
	query users($filterByEmail: String!, $page: Int!, $rowsPerPage: Int) {
		users(filterByEmail: $filterByEmail, page: $page, rowsPerPage: $rowsPerPage) {
			users {
				id
				userInfo {
					firstName
					lastName
				}
				isSuper
			}
			totalUsers
		}
	}
`;

export interface AccountOption {
	id: string;
	name: string;
	client: string;
}
export interface AccountsResponse {
	accounts: {
		accounts: AccountOption[];
		totalAccounts: number;
	};
}
export const AccountsQuery = gql`
	query accounts($filterByName: String!, $page: Int!, $rowsPerPage: Int) {
		accounts(filterByName: $filterByName, page: $page, rowsPerPage: $rowsPerPage) {
			accounts {
				id
				name
				client
			}
			totalAccounts
		}
	}
`;
