import { gql } from "@apollo/client";
import {
	AccountsQueryResponse,
	ResponseMessage,
	UsersAccountsQueryResponse,
	UserAccount,
	UsersQueryResponse
} from "@mindu-second-challenge/apollo-server-types";

export interface AddUserAccountResponse {
	addUserAccount: ResponseMessage;
}
export const AddUserAccountMutation = gql`
	mutation addUserAccount($accountId: String!, $userId: String!, $position: String!) {
		addUserAccount(accountId: $accountId, userId: $userId, position: $position) {
			message
			code
		}
	}
`;

export interface UsersAccountsResponse {
	usersAccounts: UsersAccountsQueryResponse;
}
export const UsersAccountsQuery = gql`
	query usersAccounts($filterBy: UserAccountFilter, $page: Int!, $rowsPerPage: Int!) {
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

export interface UpdateUserAccountResponse {
	updateUserAccount: ResponseMessage;
}
export const UpdateUserAccountMutation = gql`
	mutation updateUserAccount($userAccountId: String!, $position: String, $endDate: String) {
		updateUserAccount(userAccountId: $userAccountId, position: $position, endDate: $endDate) {
			message
			code
		}
	}
`;

export interface UsersResponse {
	users: UsersQueryResponse;
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

export interface AccountsResponse {
	accounts: AccountsQueryResponse;
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
