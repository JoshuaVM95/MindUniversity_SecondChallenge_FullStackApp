import { user } from "@prisma/client";
import { EnglishLevel } from "@mindu-second-challenge/apollo-server-types";

export interface UsersResponse {
	users: user[];
	totalUsers: number;
}

export interface UpdateUser {
	email?: string;
	password?: string;
	salt?: string;
}

export interface UpdateUserInfo {
	firstName?: string;
	lastName?: string;
	isAdmin?: boolean;
	updatedBy: string;
}

export interface UpdateMyUserInfo {
	updatedBy: string;
	englishLevel?: EnglishLevel;
	technicalSkills?: string;
	cvLink?: string;
}
