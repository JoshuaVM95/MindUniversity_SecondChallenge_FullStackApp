export interface UserArgs {
	userId: string;
}

export interface LoginArgs {
	email: string;
	password: string;
}

export interface CreateUserArgs {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	isAdmin?: boolean;
}
