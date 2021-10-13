export interface UserAccountOverview {
	account: string;
	position: Position;
	initDate: number;
	endDate?: number;
}

export interface AccountUserOverview {
	name: string;
	position: Position;
	initDate: number;
	endDate?: number;
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
