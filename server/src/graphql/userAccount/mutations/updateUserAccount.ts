import { UpdateUserAccountArgs } from "../types";
import { UserInputError, ApolloError, ForbiddenError } from "apollo-server";
import { decodeToken } from "../../../auth";
import { GraphqlContext, ResponseMessage, UserAccount } from "../../../types";
import { Role } from "../../user/types";
import crypto from "crypto";

export const updateUserAccount = async (
	root: undefined,
	args: UpdateUserAccountArgs,
	{ knex, schema, token }: GraphqlContext
): Promise<ResponseMessage> => {
	const jwtDecoded = decodeToken(token);
	if (jwtDecoded) {
		if (jwtDecoded.role !== Role.NORMAL) {
			const selectedUserAccount: UserAccount | undefined = await knex(schema.userAccounts)
				.where("id", "=", args.userAccountId)
				.first()
				.then();
			if (selectedUserAccount) {
				const { position, endDate } = args;
				if (position || endDate) {
					if (position) {
						return await knex(schema.userAccounts)
							.update({
								endDate: endDate || knex.fn.now(),
								removedBy: jwtDecoded.userId
							})
							.where("id", "=", args.userAccountId)
							.then(async () => {
								const uuid = crypto.randomUUID();
								return await knex(schema.userAccounts)
									.insert({
										id: uuid,
										user: selectedUserAccount.user,
										account: selectedUserAccount.account,
										addedBy: jwtDecoded.userId,
										position: args.position
									})
									.then(() => {
										return {
											message: "Position in account updated",
											code: 200
										};
									});
							})
							.catch((error) => {
								console.log(error);
								throw new ApolloError(error);
							});
					} else if (endDate) {
						return await knex(schema.userAccounts)
							.update({
								endDate,
								removedBy: jwtDecoded.userId
							})
							.where("id", "=", args.userAccountId)
							.then(() => {
								return {
									message: "User account updated succesfully",
									code: 200
								};
							})
							.catch((error) => {
								console.log(error);
								throw new ApolloError(error);
							});
					} else {
						return {
							message: "Theres nothing to update",
							code: 200
						};
					}
				} else {
					throw new UserInputError("Please send some arguments");
				}
			} else {
				throw new UserInputError("The user account that you are trying to update doesnt exist");
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
