import { gql } from "@apollo/client";
import { GenericResponse, Position } from "../../types";

export interface CreateAccountResponse {
	createAccount: GenericResponse;
}
export const CreateAccountMutation = gql`
	mutation createAccount($name: String!, $client: String!, $lead: String!) {
		createAccount(name: $name, client: $client, lead: $lead) {
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
interface LatestUser {
	user: User;
	position: Position;
	initDate: string;
	endDate?: string;
}
interface Account {
	id: string;
	name: string;
	client: string;
	lead: User;
	createdAt: string;
	createdBy: User;
	latestUsers: LatestUser[];
}
export interface AccountsResponse {
	accounts: {
		accounts: Account[];
		totalAccounts: number;
	};
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
	deleteAccounts: GenericResponse;
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

export interface UpdateAccountVariables {
	accountId: string;
	name?: string;
	client?: string;
	lead?: string;
}
export interface UpdateAccountResponse {
	updateAccount: GenericResponse;
}
export const UpdateAccountMutation = gql`
	mutation updateAccount($accountId: String!, $name: String, $client: String, $lead: String) {
		updateAccount(accountId: $accountId, name: $name, client: $client, lead: $lead) {
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
