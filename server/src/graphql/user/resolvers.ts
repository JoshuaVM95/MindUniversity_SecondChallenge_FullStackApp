import { AuthenticationError, UserInputError, ValidationError } from "apollo-server";
import { login, createUser, deleteUsers, updateUser, updateUserInfo } from "./mutations";
import { decodeToken } from "../../auth";
import { GraphqlContext } from "../../types";
import {
	User as IUser,
	UserAccount,
	UserInfo as IUserInfo,
	UserQueryVariables,
	UsersQueryVariables,
	UsersQueryResponse
} from "@mindu-second-challenge/apollo-server-types";

export const Query = {
	user: async (
		root: undefined,
		args: UserQueryVariables,
		{ knex, schema, token }: GraphqlContext
	): Promise<IUser> => {
		if (decodeToken(token)) {
			if (args.userId) {
				const user = await knex(schema.users)
					.where("id", "=", args.userId)
					.andWhere("isArchived", "=", false)
					.first()
					.then();
				if (user) {
					return user;
				} else {
					throw new ValidationError("Invalid user id");
				}
			} else {
				throw new UserInputError("Please send a user id");
			}
		} else {
			throw new AuthenticationError("Invalid token");
		}
	},
	users: async (
		root: undefined,
		args: UsersQueryVariables,
		{ knex, schema, token }: GraphqlContext
	): Promise<UsersQueryResponse> => {
		if (decodeToken(token)) {
			const filter = args.filterByEmail || "";

			const totalUsers = await knex(schema.users)
				.where("email", "like", `%${filter}%`)
				.andWhere("isArchived", "=", false)
				.count("id")
				.then((total) => {
					return total[0]["count(`id`)"];
				});
			const totalNumber = typeof totalUsers === "string" ? parseInt(totalUsers) : totalUsers;

			const currentPage = args.page;
			const offset = currentPage * (args.rowsPerPage || totalNumber);
			const limit = offset + (args.rowsPerPage || totalNumber);
			const users = await knex(schema.users)
				.where("email", "like", `%${filter}%`)
				.andWhere("isArchived", "=", false)
				.offset(offset)
				.limit(limit)
				.orderBy("email")
				.then();

			return { users, totalUsers: totalNumber };
		} else {
			throw new AuthenticationError("Invalid token");
		}
	}
};

export const Mutation = {
	login,
	createUser,
	deleteUsers,
	updateUser,
	updateUserInfo
};

export const User = {
	userInfo: async (aUser: IUser, root: undefined, { knex, schema }: GraphqlContext): Promise<IUserInfo> =>
		knex(schema.usersInfo).where("id", "=", aUser.id).first().then(),
	latestPositions: async (aUser: IUser, root: undefined, { knex, schema }: GraphqlContext): Promise<UserAccount> =>
		knex(schema.userAccounts).where("user", "=", aUser.id).orderBy("initDate", "desc").limit(3).then()
};

export const UserInfo = {
	createdBy: async (aUserInfo: IUserInfo, root: undefined, { knex, schema }: GraphqlContext): Promise<IUser> =>
		knex(schema.users).where("id", "=", aUserInfo.createdBy).first().then(),
	updatedBy: async (aUserInfo: IUserInfo, root: undefined, { knex, schema }: GraphqlContext): Promise<IUser> =>
		knex(schema.users)
			.where("id", "=", aUserInfo.updatedBy as IUser)
			.first()
			.then()
};
