import { Query as UserQuery, Mutation as UserMutation, UserV2, UserInfoV2 } from "./userV2/resolver";

export const Query = {
	...UserQuery
};

export const Mutation = {
	...UserMutation
};

export const resolversV2 = {
	UserV2,
	UserInfoV2
};
