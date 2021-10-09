export interface UserArgs {
	userId: string;
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

export interface LoginResponse {
	token: string;
	role: Role;
}

export interface CreateUserArgs {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	isAdmin?: boolean;
}
