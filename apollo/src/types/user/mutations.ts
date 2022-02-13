import { EnglishLevel } from "../index";

export interface LoginMutationVariables {
	email: string;
	password: string;
}

export interface CreateUserMutationVariables {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	isAdmin?: boolean;
}

export interface DeleteUsersMutationVariables {
	userIds: string[];
}

export interface UpdateUserMutationVariables {
	userId: string;
	email?: string;
	password?: string;
	firstName?: string;
	lastName?: string;
	isAdmin?: boolean;
}

export interface UpdateUserInfoMutationVariables {
	englishLevel?: EnglishLevel;
	technicalSkills?: string;
	cvLink?: string;
}
