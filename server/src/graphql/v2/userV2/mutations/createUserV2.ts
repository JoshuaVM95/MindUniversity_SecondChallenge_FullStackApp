import { UserInputError, ApolloError, ForbiddenError } from "apollo-server";
import crypto from "crypto";
import { decodeToken, generateHash } from "../../../../auth";
import { GraphqlContext } from "../../../../types";
import { CreateUserMutationVariables, ResponseMessage, Role } from "@mindu-second-challenge/apollo-server-types";

export const createUserV2 = async (
	root: undefined,
	args: CreateUserMutationVariables,
	{ token, prisma }: GraphqlContext
): Promise<ResponseMessage> => {
	const jwtDecoded = decodeToken(token);
	if (jwtDecoded) {
		if (jwtDecoded.role !== Role.NORMAL) {
			if (args.email && args.password && args.firstName && args.lastName) {
				const { hash, salt } = generateHash(args.password);
				const uuid = crypto.randomUUID();
				return await prisma.user
					.create({
						data: {
							id: uuid,
							email: args.email,
							password: hash,
							salt
						}
					})
					.then(async (user) => {
						return await prisma.userinfo
							.create({
								data: {
									id: user.id,
									firstName: args.firstName,
									lastName: args.lastName,
									createdBy: jwtDecoded.userId,
									isAdmin: args.isAdmin
								}
							})
							.then(() => {
								return {
									message: "User created succesfully",
									code: 201
								};
							});
					})
					.catch((error) => {
						if (error.message.includes("unique")) {
							throw new UserInputError("There is already a user registered with that email");
						}
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
