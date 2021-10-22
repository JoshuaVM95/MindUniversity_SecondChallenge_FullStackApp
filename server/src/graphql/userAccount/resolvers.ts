import { AuthenticationError, UserInputError, ValidationError } from "apollo-server";
import { addUserAccount, updateUserAccount } from "./mutations";
import { decodeToken } from "../../auth";
import { GraphqlContext } from "../../types";
import { Knex } from "knex";
import {
	Account,
	UserAccountQueryVariables,
	UsersAccountsQueryVariables,
	UsersAccountsQueryResponse,
	UserAccount as IUserAccount,
	User,
	Role
} from "@mindu-second-challenge/apollo-server-types";

export const Query = {
	userAccount: async (
		root: undefined,
		args: UserAccountQueryVariables,
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
		args: UsersAccountsQueryVariables,
		{ knex, schema, token }: GraphqlContext
	): Promise<UsersAccountsQueryResponse> => {
		const decodedToken = decodeToken(token);
		if (decodedToken) {
			if (decodedToken.role !== Role.NORMAL) {
				const currentPage = args.page;
				const offset = currentPage * args.rowsPerPage;
				const limit = offset + args.rowsPerPage;
				const whereBuilder = (builder: Knex.QueryBuilder) => {
					if (args.filterBy.name)
						builder.where(`${schema.usersInfo}.firstName`, "like", `%${args.filterBy.name.toLowerCase()}%`);
					if (args.filterBy.account)
						builder.where(`${schema.accounts}.name`, "like", `%${args.filterBy.account.toLowerCase()}%`);
					if (args.filterBy.initDate) builder.where("initDate", ">=", args.filterBy.initDate);
					if (args.filterBy.endDate) builder.andWhere("endDate", "<=", args.filterBy.endDate);
					return builder;
				};
				const usersAccounts = await knex(schema.userAccounts)
					.select("userAccounts.*", "userAccounts.id")
					.leftJoin(schema.usersInfo, `${schema.userAccounts}.user`, `${schema.usersInfo}.id`)
					.leftJoin(schema.accounts, `${schema.userAccounts}.account`, `${schema.accounts}.id`)
					.where(whereBuilder)
					.offset(offset)
					.limit(limit)
					.orderBy("initDate", "desc");

				const totalUsersAccounts = await knex(schema.userAccounts)
					.count("*")
					.leftJoin(schema.usersInfo, `${schema.userAccounts}.user`, `${schema.usersInfo}.id`)
					.leftJoin(schema.accounts, `${schema.userAccounts}.account`, `${schema.accounts}.id`)
					.where(whereBuilder)
					.then((total) => {
						return total[0]["count(*)"];
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
			.where("id", "=", (aUserAccount.removedBy as User) || "")
			.first()
			.then()
};
