export interface UserAccountOverview {
	account: string;
	initDate: number;
	endDate?: number;
}

export interface AccountUserOverview {
	name: string;
	email: string;
	initDate: number;
}

export enum Position {
	DEV = "Developer",
	QA = "Quality Assurance",
	LEAD = "Lead",
	PRODUCT = "Product"
}

export interface UserAccountListOverview {
	user: string;
	account: string;
	position: Position;
	initDate: string;
	endDate: string;
}
