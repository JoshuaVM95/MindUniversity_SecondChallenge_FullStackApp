import { createAccount, deleteAccounts, updateAccount } from "./mutations";
import { AuthenticationError, UserInputError, ValidationError } from "apollo-server";
import { decodeToken } from "../../auth/jwtOperations";
import { AccountArgs, AccountsArgs, AccountsResponse } from "./types";
import { GraphqlContext, Account as IAccount, User } from "../../types";
import { Role } from "../user/types";

export const Query = {
	account: async (root: undefined, args: AccountArgs, { knex, schema, token }: GraphqlContext): Promise<IAccount> => {
		const decodedToken = decodeToken(token);
		if (decodedToken) {
			if (decodedToken.role !== Role.NORMAL) {
				if (args.accountId) {
					const account = await knex(schema.accounts).where("id", "=", args.accountId).first().then();
					if (account) {
						return account;
					} else {
						throw new ValidationError("Invalid account id");
					}
				} else {
					throw new UserInputError("Please send a account id");
				}
			} else {
				throw new AuthenticationError("Not Authorized");
			}
		} else {
			throw new AuthenticationError("Invalid token");
		}
	},
	accounts: async (
		root: undefined,
		args: AccountsArgs,
		{ knex, schema, token }: GraphqlContext
	): Promise<AccountsResponse> => {
		const decodedToken = decodeToken(token);
		if (decodedToken) {
			if (decodedToken.role !== Role.NORMAL) {
				const currentPage = args.page;
				const offset = currentPage * args.rowsPerPage;
				const limit = offset + args.rowsPerPage;
				const filter = args.filterByName || "";
				const accounts = await knex(schema.accounts)
					.where("name", "like", `%${filter}%`)
					.offset(offset)
					.limit(limit)
					.orderBy("name")
					.then();
				const totalAccounts = await knex(schema.accounts)
					.where("name", "like", `%${filter}%`)
					.count("id")
					.then((total) => {
						return total[0]["count(`id`)"];
					});
				return {
					accounts,
					totalAccounts: typeof totalAccounts === "string" ? parseInt(totalAccounts) : totalAccounts
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
	createAccount,
	deleteAccounts,
	updateAccount
};

export const Account = {
	lead: async (aAccount: IAccount, root: undefined, { knex, schema }: GraphqlContext): Promise<User> =>
		knex(schema.users).where("id", "=", aAccount.lead).first().then(),
	createdBy: async (aAccount: IAccount, root: undefined, { knex, schema }: GraphqlContext): Promise<User> =>
		knex(schema.users).where("id", "=", aAccount.createdBy).first().then()
};
