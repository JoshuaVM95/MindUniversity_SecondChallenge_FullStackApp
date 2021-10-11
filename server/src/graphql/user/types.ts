export interface UserArgs {
	userId: string;
}

export interface UsersArgs {
	filterByEmail: string;
	page: number;
	rowsPerPage: number;
}

interface UserOverview {
	name: string;
	email: string;
	createdBy: string;
	createdAt: number;
	role: Role;
}

export interface UsersResponse {
	users: UserOverview[];
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
