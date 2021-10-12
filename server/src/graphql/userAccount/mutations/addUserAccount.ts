import { AddUserAccountArgs } from "../types";
import { UserInputError, ApolloError, ForbiddenError } from "apollo-server";
import { decodeToken } from "../../../auth";
import { Account, GraphqlContext, ResponseMessage, User, UserAccount } from "../../../types";
import crypto from "crypto";
import { Role } from "../../user/types";

export const addUserAccount = async (
	root: undefined,
	args: AddUserAccountArgs,
	{ knex, schema, token }: GraphqlContext
): Promise<ResponseMessage> => {
	const jwtDecoded = decodeToken(token);
	if (jwtDecoded) {
		if (jwtDecoded.role !== Role.NORMAL) {
			if (args.accountId && args.userId && args.position) {
				const user: User | undefined = await knex(schema.users).where("id", "=", args.userId).first().then();
				if (user !== undefined) {
					const account: Account | undefined = await knex(schema.accounts)
						.where("id", "=", args.accountId)
						.first()
						.then();
					if (account !== undefined) {
						const isInAccountAlready: UserAccount[] | undefined = await knex(schema.userAccounts)
							.where({ user: args.userId, account: args.accountId })
							.first()
							.then();
						if (isInAccountAlready) {
							throw new UserInputError("This user is already active in that account");
						} else {
							const uuid = crypto.randomUUID();
							return await knex(schema.userAccounts)
								.insert({
									id: uuid,
									user: args.userId,
									account: args.accountId,
									addedBy: jwtDecoded.userId,
									position: args.position
								})
								.then(async () => {
									return {
										message: "User added to the account correctly",
										code: 201
									};
								})
								.catch((error) => {
									console.log(error);
									throw new ApolloError(error);
								});
						}
					} else {
						throw new UserInputError("Please send a valid account id");
					}
				} else {
					throw new UserInputError("Please send a valid user id");
				}
			} else {
				throw new UserInputError("Complete the form before sending the request");
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
