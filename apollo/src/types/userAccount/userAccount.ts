import { Account, User, Position } from "../index";

export interface UserAccount {
	id: string;
	user: User;
	account: Account;
	initDate: string;
	endDate?: string;
	addedBy: User;
	removedBy?: User;
	position: Position;
}

export interface UserAccountFilters {
	account?: string;
	name?: string;
	initDate?: string;
	endDate?: string;
}
