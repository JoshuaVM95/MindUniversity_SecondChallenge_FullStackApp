import { addUserAccount, updateUserAccount } from "./mutations";
import { AuthenticationError, UserInputError, ValidationError } from "apollo-server";
import { decodeToken } from "../../auth/jwtOperations";
import { UserAccountArgs, UsersAccountsArgs, UsersAccountsResponse } from "./types";
import { GraphqlContext, UserAccount as IUserAccount, User, Account } from "../../types";
import { Role } from "../user/types";

export const Query = {
	userAccount: async (
		root: undefined,
		args: UserAccountArgs,
		{ knex, schema, token }: GraphqlContext
	): Promise<IUserAccount> => {
		const decodedToken = decodeToken(token);
		if (decodedToken) {
			if (decodedToken.role !== Role.NORMAL) {
				if (args.userAccountId) {
					const userAccount = await knex(schema.userAccounts)
						.where("id", "=", args.userAccountId)
						.first()
						.then();
					if (userAccount) {
						return userAccount;
					} else {
						throw new ValidationError("Invalid user account id");
					}
				} else {
					throw new UserInputError("Please send an id");
				}
			} else {
				throw new AuthenticationError("Not Authorized");
			}
		} else {
			throw new AuthenticationError("Invalid token");
		}
	},
	usersAccounts: async (
		root: undefined,
		args: UsersAccountsArgs,
		{ knex, schema, token }: GraphqlContext
	): Promise<UsersAccountsResponse> => {
		const decodedToken = decodeToken(token);
		if (decodedToken) {
			if (decodedToken.role !== Role.NORMAL) {
				const currentPage = args.page;
				const offset = currentPage * args.rowsPerPage;
				const limit = offset + args.rowsPerPage;
				const filter = args.filterBy || "";
				const usersAccounts = await knex(schema.userAccounts)
					.where("user", "like", `%${filter}%`)
					.offset(offset)
					.limit(limit)
					.orderBy("user")
					.then();
				const totalUsersAccounts = await knex(schema.userAccounts)
					.where("user", "like", `%${filter}%`)
					.count("id")
					.then((total) => {
						return total[0]["count(`id`)"];
					});
				return {
					usersAccounts,
					totalUsersAccounts:
						typeof totalUsersAccounts === "string" ? parseInt(totalUsersAccounts) : totalUsersAccounts
				};
			} else {
				throw new AuthenticationError("Not Authorized");
			}
		} else {
			throw new AuthenticationError("Invalid token");
		}
	}
};

export const Mutation = {
	addUserAccount,
	updateUserAccount
};

export const UserAccount = {
	user: async (aUserAccount: IUserAccount, root: undefined, { knex, schema }: GraphqlContext): Promise<User> =>
		knex(schema.users).where("id", "=", aUserAccount.user).first().then(),
	account: async (aUserAccount: IUserAccount, root: undefined, { knex, schema }: GraphqlContext): Promise<Account> =>
		knex(schema.accounts).where("id", "=", aUserAccount.account).first().then(),
	addedBy: async (aUserAccount: IUserAccount, root: undefined, { knex, schema }: GraphqlContext): Promise<User> =>
		knex(schema.users).where("id", "=", aUserAccount.addedBy).first().then(),
	removedBy: async (aUserAccount: IUserAccount, root: undefined, { knex, schema }: GraphqlContext): Promise<User> =>
		knex(schema.users)
			.where("id", "=", aUserAccount.removedBy || "")
			.first()
			.then()
};
