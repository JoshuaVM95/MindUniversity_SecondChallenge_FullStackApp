import { EnglishLevel } from "../../../types";
import { user } from "@prisma/client";

export interface UserArgs {
	userId: string;
}

export interface UsersArgs {
	filterByEmail: string;
	page: number;
	rowsPerPage?: number;
}

export interface UsersResponse {
	users: user[];
	totalUsers: number;
}

export interface LoginArgs {
	email: string;
	password: string;
}

export enum Role {
	SUPER,
	ADMIN,
	NORMAL
}

export interface CreateUserArgs {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	isAdmin?: boolean;
}

export interface DeleteUsersArgs {
	userIds: string[];
}

export interface UpdateUserArgs {
	userId: string;
	email?: string;
	password?: string;
	firstName?: string;
	lastName?: string;
	isAdmin?: boolean;
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

export interface UpdateUserInfoArgs {
	englishLevel: EnglishLevel;
	technicalSkills: string;
	cvLink: string;
}
export interface UpdateMyUserInfo {
	updatedBy: string;
	englishLevel?: EnglishLevel;
	technicalSkills?: string;
	cvLink?: string;
}
