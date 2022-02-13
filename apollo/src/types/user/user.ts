import { UserAccount, EnglishLevel, Role } from "../index";

export interface User {
	id: string;
	email: string;
	userInfo?: UserInfo;
	isSuper: boolean;
	createdAt: string;
	latestPositions?: UserAccount[];
	isArchived: boolean;
}

export interface UserInfo {
	id: string;
	firstName: string;
	lastName: string;
	createdBy: User;
	updatedBy?: User;
	updatedAt?: string;
	isAdmin: boolean;
	englishLevel?: EnglishLevel;
	technicalSkills?: string;
	cvLink?: string;
}

export interface UserOverview {
	name: string;
	email: string;
	createdBy: string;
	createdAt: number;
	role: Role;
}
