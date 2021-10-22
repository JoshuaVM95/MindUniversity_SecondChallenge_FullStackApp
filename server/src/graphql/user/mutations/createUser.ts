import { UserInputError, ApolloError, ForbiddenError } from "apollo-server";
import crypto from "crypto";
import { decodeToken, generateHash } from "../../../auth";
import { GraphqlContext } from "../../../types";
import {
	CreateUserMutationVariables,
	ResponseMessage,
	User,
	UserInfo
} from "@mindu-second-challenge/apollo-server-types";

export const createUser = async (
	root: undefined,
	args: CreateUserMutationVariables,
	{ knex, schema, token }: GraphqlContext
): Promise<ResponseMessage> => {
	const jwtDecoded = decodeToken(token);
	if (jwtDecoded) {
		const user: User | undefined = await knex(schema.users).where("id", "=", jwtDecoded.userId).first().then();
		const userInfo: UserInfo | undefined = await knex(schema.usersInfo)
			.where("id", "=", jwtDecoded.userId)
			.first()
			.then();
		if (user?.isSuper || userInfo?.isAdmin) {
			if (args.email && args.password && args.firstName && args.lastName) {
				const { hash, salt } = generateHash(args.password);
				const uuid = crypto.randomUUID();
				return await knex(schema.users)
					.insert({
						id: uuid,
						email: args.email,
						password: hash,
						salt: salt
					})
					.then(async () => {
						return knex(schema.usersInfo)
							.insert({
								id: uuid,
								firstName: args.firstName,
								lastName: args.lastName,
								createdBy: jwtDecoded.userId,
								isAdmin: args.isAdmin
							})
							.then(() => {
								return {
									message: "User created succesfully",
									code: 201
								};
							});
					})
					.catch((error) => {
						throw new ApolloError(error);
					});
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
