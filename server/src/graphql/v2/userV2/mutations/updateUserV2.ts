import { Role, UpdateUser, UpdateUserArgs, UpdateUserInfo } from "../types";
import { UserInputError, ApolloError, ForbiddenError } from "apollo-server";
import { decodeToken, generateHash } from "../../../../auth";
import { GraphqlContext, ResponseMessage } from "../../../../types";

export const updateUserV2 = async (
	root: undefined,
	args: UpdateUserArgs,
	{ token, prisma }: GraphqlContext
): Promise<ResponseMessage> => {
	const jwtDecoded = decodeToken(token);
	if (jwtDecoded) {
		if (jwtDecoded.role !== Role.NORMAL) {
			if (args.userId) {
				const selectedUser = await prisma.user.findFirst({ where: { id: args.userId } });
				if (selectedUser) {
					const { email, password, firstName, lastName, isAdmin } = args;
					if (email || password || firstName || lastName || (isAdmin !== undefined && isAdmin !== null)) {
						const userInfoVariables: UpdateUserInfo = {
							updatedBy: jwtDecoded.userId
						};
						if (firstName) userInfoVariables.firstName = firstName;
						if (lastName) userInfoVariables.lastName = lastName;
						if (isAdmin !== undefined) userInfoVariables.isAdmin = isAdmin;
						return await prisma.userinfo
							.update({
								where: { id: args.userId },
								data: userInfoVariables
							})
							.then(async () => {
								if (email || password) {
									const userVariables: UpdateUser = {};
									if (email) userVariables.email = email;
									if (password) {
										const { hash, salt } = generateHash(password);
										userVariables.password = hash;
										userVariables.salt = salt;
									}
									return await prisma.user
										.update({
											where: { id: args.userId },
											data: userVariables
										})
										.then(() => {
											return {
												message: "User updated succesfully",
												code: 200
											};
										});
								} else {
									return {
										message: "User updated succesfully",
										code: 200
									};
								}
							})
							.catch((error) => {
								throw new ApolloError(error);
							});
					} else {
						throw new UserInputError("Please send some arguments");
					}
				} else {
					throw new UserInputError("The user that you are trying to update doesnt exist");
				}
			} else {
				throw new UserInputError("Please send a user id");
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
