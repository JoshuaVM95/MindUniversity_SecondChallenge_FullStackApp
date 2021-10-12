import { Account } from "../../types";
import Knex from "knex";

export interface AccountArgs {
	accountId: string;
}

export interface AccountsArgs {
	filterByName: string;
	page: number;
	rowsPerPage: number;
}

export interface AccountsResponse {
	accounts: Account[];
	totalAccounts: number;
}

export interface CreateAccountArgs {
	name: string;
	client: string;
	lead: string;
}

export interface DeleteAccountsArgs {
	accountIds: string[];
}

export interface UpdateAccountArgs {
	accountId: string;
	name?: string;
	client?: string;
	lead?: string;
}

export interface UpdateAccount {
	name?: string;
	client?: string;
	lead?: string;
	updatedBy: string;
	updatedAt: Knex.QueryBuilder;
}
