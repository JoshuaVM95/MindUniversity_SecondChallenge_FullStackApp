export enum Role {
	SUPER,
	ADMIN,
	NORMAL
}

export interface UserOverview {
	name: string;
	email: string;
	createdBy: string;
	createdAt: number;
	role: Role;
}
