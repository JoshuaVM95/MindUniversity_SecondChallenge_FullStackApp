export interface CreateAccountMutationVariables {
	name: string;
	client: string;
	lead: string;
}

export interface DeleteAccountsMutationVariables {
	accountIds: string[];
}

export interface UpdateAccountMutationVariables {
	accountId: string;
	name?: string;
	client?: string;
	lead?: string;
}
