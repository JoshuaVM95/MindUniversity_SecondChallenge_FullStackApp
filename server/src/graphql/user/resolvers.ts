import { login, createUser, deleteUsers, updateUser } from "./mutations";
import { AuthenticationError, UserInputError, ValidationError } from "apollo-server";
import { decodeToken } from "../../auth/jwtOperations";
import { UserArgs, UsersArgs, UsersResponse } from "./types";
import { GraphqlContext, User as IUser, UserInfo as IUserInfo } from "../../types";

export const Query = {
	user: async (root: undefined, args: UserArgs, { knex, schema, token }: GraphqlContext): Promise<IUser> => {
		if (decodeToken(token)) {
			if (args.userId) {
				const user = await knex(schema.users).where("id", "=", args.userId).first().then();
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
		args: UsersArgs,
		{ knex, schema, token }: GraphqlContext
	): Promise<UsersResponse> => {
		if (decodeToken(token)) {
			const filter = args.filterByEmail || "";

			const totalUsers = await knex(schema.users)
				.where("email", "like", `%${filter}%`)
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
	updateUser
};

export const User = {
	userInfo: async (aUser: IUser, root: undefined, { knex, schema }: GraphqlContext): Promise<IUserInfo> =>
		knex(schema.usersInfo).where("id", "=", aUser.id).first().then()
};

export const UserInfo = {
	createdBy: async (aUserInfo: IUserInfo, root: undefined, { knex, schema }: GraphqlContext): Promise<IUser> =>
		knex(schema.users).where("id", "=", aUserInfo.createdBy).first().then()
};
