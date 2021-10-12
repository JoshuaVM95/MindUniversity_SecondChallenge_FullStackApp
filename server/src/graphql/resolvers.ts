import { Query as UserQuery, Mutation as UserMutation, User, UserInfo } from "./user/resolvers";
import { Query as AccountQuery, Mutation as AccountMutation, Account } from "./account/resolvers";
import { Query as UserAccountQuery, Mutation as UserAccountMutation, UserAccount } from "./userAccount/resolvers";

const resolvers = {
	Query: {
		...UserQuery,
		...AccountQuery,
		...UserAccountQuery
	},
	Mutation: {
		...UserMutation,
		...AccountMutation,
		...UserAccountMutation
	},
	User,
	UserInfo,
	Account,
	UserAccount
};

export default resolvers;
