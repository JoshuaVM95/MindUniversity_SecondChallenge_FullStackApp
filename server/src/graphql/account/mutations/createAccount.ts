import { CreateAccountArgs } from "../types";
import { UserInputError, ApolloError, ForbiddenError } from "apollo-server";
import { decodeToken } from "../../../auth";
import { GraphqlContext, ResponseMessage, User } from "../../../types";
import crypto from "crypto";
import { Role } from "../../user/types";

export const createAccount = async (
	root: undefined,
	args: CreateAccountArgs,
	{ knex, schema, token }: GraphqlContext
): Promise<ResponseMessage> => {
	const jwtDecoded = decodeToken(token);
	if (jwtDecoded) {
		if (jwtDecoded.role !== Role.NORMAL) {
			if (args.name && args.client && args.lead) {
				const lead: User | undefined = await knex(schema.users).where("id", "=", args.lead).first().then();
				if (lead !== undefined) {
					const uuid = crypto.randomUUID();
					return await knex(schema.accounts)
						.insert({
							id: uuid,
							name: args.name,
							client: args.client,
							lead: args.lead,
							createdBy: jwtDecoded.userId
						})
						.then(async () => {
							const userAccountUUID = crypto.randomUUID();
							return await knex(schema.userAccounts)
								.insert({
									id: userAccountUUID,
									user: args.lead,
									account: uuid,
									addedBy: jwtDecoded.userId,
									position: "Lead"
								})
								.then(() => {
									return {
										message: "Account created succesfully",
										code: 201
									};
								});
						})
						.catch((error) => {
							console.log(error);
							throw new ApolloError(error);
						});
				} else {
					throw new UserInputError("Please send a valid user lead");
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
