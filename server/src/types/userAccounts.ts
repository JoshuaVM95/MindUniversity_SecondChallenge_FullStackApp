export interface UserAccount {
	id: string;
	user: string;
	account: string;
	initDate: number;
	endDate?: number;
	addedBy: string;
	removedBy?: string;
	position: string;
}
