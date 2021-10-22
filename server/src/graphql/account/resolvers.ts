import { AuthenticationError, UserInputError, ValidationError } from "apollo-server";
import { decodeToken } from "../../auth";
import { GraphqlContext } from "../../types";
import {
	Account as IAccount,
	AccountQueryVariables,
	AccountsQueryVariables,
	AccountsQueryResponse,
	User,
	UserAccount,
	Role
} from "@mindu-second-challenge/apollo-server-types";
import { createAccount, deleteAccounts, updateAccount } from "./mutations";

export const Query = {
	account: async (
		root: undefined,
		args: AccountQueryVariables,
		{ knex, schema, token }: GraphqlContext
	): Promise<IAccount> => {
		const decodedToken = decodeToken(token);
		if (decodedToken) {
			if (decodedToken.role !== Role.NORMAL) {
				if (args.accountId) {
					const account = await knex(schema.accounts)
						.where("id", "=", args.accountId)
						.andWhere("isArchived", "=", false)
						.first()
						.then();
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
		args: AccountsQueryVariables,
		{ knex, schema, token }: GraphqlContext
	): Promise<AccountsQueryResponse> => {
		const decodedToken = decodeToken(token);
		if (decodedToken) {
			if (decodedToken.role !== Role.NORMAL) {
				const filter = args.filterByName || "";
				const totalAccounts = await knex(schema.accounts)
					.where("name", "like", `%${filter}%`)
					.andWhere("isArchived", "=", false)
					.count("id")
					.then((total) => {
						return total[0]["count(`id`)"];
					});
				const totalNumber = typeof totalAccounts === "string" ? parseInt(totalAccounts) : totalAccounts;

				const currentPage = args.page;
				const offset = currentPage * (args.rowsPerPage || totalNumber);
				const limit = offset + (args.rowsPerPage || totalNumber);
				const accounts = await knex(schema.accounts)
					.where("name", "like", `%${filter}%`)
					.andWhere("isArchived", "=", false)
					.offset(offset)
					.limit(limit)
					.orderBy("name")
					.then();
				return {
					accounts,
					totalAccounts: totalNumber
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
		knex(schema.users).where("id", "=", aAccount.createdBy).first().then(),
	latestUsers: async (aAccount: IAccount, root: undefined, { knex, schema }: GraphqlContext): Promise<UserAccount> =>
		knex(schema.userAccounts).where("account", "=", aAccount.id).orderBy("initDate", "desc").limit(3).then()
};
