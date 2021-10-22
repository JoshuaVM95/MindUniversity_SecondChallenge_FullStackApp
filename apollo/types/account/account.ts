import { User, UserAccount } from "../index";

export interface Account {
	id: string;
	name: string;
	client: string;
	lead: User;
	createdAt: string;
	createdBy: User;
	latestUsers: UserAccount[];
}
