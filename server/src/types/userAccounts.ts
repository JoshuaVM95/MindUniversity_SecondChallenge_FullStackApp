export interface userAccounts {
	user: string;
	account: string;
	initDate: number;
	endDate?: number;
	addedBy: string;
	removedBy?: string;
	isLead: boolean;
}
