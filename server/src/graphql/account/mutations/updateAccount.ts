import { UpdateAccount, UpdateAccountArgs } from "../types";
import { UserInputError, ApolloError, ForbiddenError } from "apollo-server";
import { decodeToken } from "../../../auth";
import { Account, GraphqlContext, ResponseMessage } from "../../../types";
import { Role } from "../../user/types";

export const updateAccount = async (
	root: undefined,
	args: UpdateAccountArgs,
	{ knex, schema, token }: GraphqlContext
): Promise<ResponseMessage> => {
	const jwtDecoded = decodeToken(token);
	if (jwtDecoded) {
		if (jwtDecoded.role !== Role.NORMAL) {
			const selectedAccount: Account | undefined = await knex(schema.accounts)
				.where("id", "=", args.accountId)
				.first()
				.then();
			if (selectedAccount) {
				const { name, client, lead } = args;
				if (name || client || lead) {
					const accountVariables: UpdateAccount = {
						updatedBy: jwtDecoded.userId,
						updatedAt: knex.fn.now()
					};
					if (name) accountVariables.name = name;
					if (client) accountVariables.client = client;
					if (lead) accountVariables.lead = lead;
					return await knex(schema.accounts)
						.update(accountVariables)
						.where("id", "=", args.accountId)
						.then(() => {
							return {
								message: "Account updated succesfully",
								code: 200
							};
						})
						.catch((error) => {
							console.log(error);
							throw new ApolloError(error);
						});
				} else {
					throw new UserInputError("Please send some arguments");
				}
			} else {
				throw new UserInputError("The account that you are trying to update doesnt exist");
			}
		} else {
			throw new ForbiddenError("You need to be an admin");
		}
	} else {
		return {
			message: "Forbidden",
			code: 403
		};
	}
};
