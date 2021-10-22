import { Position } from "@mindu-second-challenge/apollo-server-types";

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

export interface UserAccountListOverview {
	user: string;
	account: string;
	position: Position;
	initDate: string;
	endDate: string;
}
