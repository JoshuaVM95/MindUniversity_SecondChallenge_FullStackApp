import { UserInputError, ApolloError, ForbiddenError } from "apollo-server";
import { decodeToken } from "../../../auth";
import { GraphqlContext } from "../../../types";
import { DeleteAccountsMutationVariables, ResponseMessage, Role } from "@mindu-second-challenge/apollo-server-types";

export const deleteAccounts = async (
	root: undefined,
	args: DeleteAccountsMutationVariables,
	{ knex, schema, token }: GraphqlContext
): Promise<ResponseMessage> => {
	const jwtDecoded = decodeToken(token);
	if (jwtDecoded) {
		if (jwtDecoded.role !== Role.NORMAL) {
			if (args.accountIds.length > 0) {
				return await knex(schema.accounts)
					.update({
						isArchived: true
					})
					.whereIn("id", args.accountIds)
					.then(async () => {
						return {
							message: "Accounts deleted correctly",
							code: 204
						};
					})
					.catch((error) => {
						console.log(error);
						throw new ApolloError(error);
					});
			} else {
				throw new UserInputError("Send one or more accountId");
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
