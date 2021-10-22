import { gql } from "@apollo/client";
import {
	Account,
	AccountsQueryResponse,
	ResponseMessage,
	UsersQueryResponse
} from "@mindu-second-challenge/apollo-server-types";

export interface CreateAccountResponse {
	createAccount: ResponseMessage;
}
export const CreateAccountMutation = gql`
	mutation createAccount($name: String!, $client: String!, $lead: String!) {
		createAccount(name: $name, client: $client, lead: $lead) {
			message
			code
		}
	}
`;

export interface AccountsResponse {
	accounts: AccountsQueryResponse;
}
export const AccountsQuery = gql`
	query accounts($filterByName: String!, $page: Int!, $rowsPerPage: Int!) {
		accounts(filterByName: $filterByName, page: $page, rowsPerPage: $rowsPerPage) {
			accounts {
				id
				name
				client
				lead {
					id
					userInfo {
						firstName
						lastName
					}
				}
				createdAt
				createdBy {
					id
					userInfo {
						firstName
						lastName
					}
				}
				latestUsers {
					user {
						id
						userInfo {
							firstName
							lastName
						}
					}
					position
					initDate
					endDate
				}
			}
			totalAccounts
		}
	}
`;

export interface DeleteAccountsResponse {
	deleteAccounts: ResponseMessage;
}
export const DeleteAccountsMutation = gql`
	mutation deleteAccounts($accountIds: [String!]!) {
		deleteAccounts(accountIds: $accountIds) {
			message
			code
		}
	}
`;

export interface AccountResponse {
	account: Account;
}
export const AccountQuery = gql`
	query account($accountId: String!) {
		account(accountId: $accountId) {
			id
			name
			client
			lead {
				id
				email
				isSuper
				userInfo {
					firstName
					lastName
					createdBy {
						id
						userInfo {
							firstName
							lastName
						}
					}
					isAdmin
				}
			}
			createdAt
			createdBy {
				id
				email
				isSuper
				userInfo {
					firstName
					lastName
					createdBy {
						id
						userInfo {
							firstName
							lastName
						}
					}
					isAdmin
				}
			}
		}
	}
`;

export interface UpdateAccountResponse {
	updateAccount: ResponseMessage;
}
export const UpdateAccountMutation = gql`
	mutation updateAccount($accountId: String!, $name: String, $client: String, $lead: String) {
		updateAccount(accountId: $accountId, name: $name, client: $client, lead: $lead) {
			message
			code
		}
	}
`;

export interface UsersResponse {
	users: UsersQueryResponse;
}
export const UsersQuery = gql`
	query users($filterByEmail: String!, $page: Int!, $rowsPerPage: Int!) {
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
