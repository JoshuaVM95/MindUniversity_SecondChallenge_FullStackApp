import { Query as UserQuery, Mutation as UserMutation, User, UserInfo } from "./user/resolvers";

const resolvers = {
	Query: {
		...UserQuery
	},
	Mutation: {
		...UserMutation
	},
	User,
	UserInfo
};

export default resolvers;
