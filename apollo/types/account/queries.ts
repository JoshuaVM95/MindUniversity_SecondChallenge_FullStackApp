import { Account } from "../index";

export interface AccountQueryVariables {
	accountId: string;
}

export interface AccountQueryResponse {
	account: Account;
}

export interface AccountsQueryVariables {
	filterByName: string;
	page: number;
	rowsPerPage?: number;
}

export interface AccountsQueryResponse {
	accounts: Account[];
	totalAccounts: number;
}
