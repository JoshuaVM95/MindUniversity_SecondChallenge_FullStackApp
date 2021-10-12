import { Query as UserQuery, Mutation as UserMutation, User, UserInfo } from "./user/resolvers";
import { Query as AccountQuery, Mutation as AccountMutation, Account } from "./account/resolvers";

const resolvers = {
	Query: {
		...UserQuery,
		...AccountQuery
	},
	Mutation: {
		...UserMutation,
		...AccountMutation
	},
	User,
	UserInfo,
	Account
};

export default resolvers;
