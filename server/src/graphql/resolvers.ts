import { Query as UserQuery, Mutation as UserMutation, User, UserInfo } from "./user/resolvers";
import { Query as AccountQuery, Mutation as AccountMutation, Account } from "./account/resolvers";
import { Query as UserAccountQuery, Mutation as UserAccountMutation, UserAccount } from "./userAccount/resolvers";
import { Query as V2Queries, Mutation as V2Mutations, resolversV2 } from "./v2/resolversV2";

const resolvers = {
	Query: {
		...UserQuery,
		...AccountQuery,
		...UserAccountQuery,
		...V2Queries
	},
	Mutation: {
		...UserMutation,
		...AccountMutation,
		...UserAccountMutation,
		...V2Mutations
	},
	User,
	UserInfo,
	Account,
	UserAccount,
	...resolversV2
};

export default resolvers;
