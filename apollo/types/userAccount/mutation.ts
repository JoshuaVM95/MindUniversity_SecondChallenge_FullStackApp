export interface AddUserAccountMutationVariables {
	accountId: string;
	userId: string;
	position: string;
}

export interface UpdateUserAccountMutationVariables {
	userAccountId: string;
	position?: string;
	endDate?: string;
}
