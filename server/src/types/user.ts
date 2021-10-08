export interface User {
	id: string;
	email: string;
	password: string;
	salt: string;
	isSuper: boolean;
	createdAt: number;
}
