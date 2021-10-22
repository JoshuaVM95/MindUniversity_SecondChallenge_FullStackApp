import Knex from "knex";
import { User, EnglishLevel } from "@mindu-second-challenge/apollo-server-types";

export interface UserDB extends User {
	password: string;
	salt: string;
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
	updatedAt: Knex.QueryBuilder;
}

export interface UpdateMyUserInfo {
	updatedBy: string;
	updatedAt: Knex.QueryBuilder;
	englishLevel?: EnglishLevel;
	technicalSkills?: string;
	cvLink?: string;
}
