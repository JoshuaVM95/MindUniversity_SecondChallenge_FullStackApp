import { UpdateUser, UpdateUserArgs, UpdateUserInfo } from "../types";
import { UserInputError, ApolloError, ForbiddenError } from "apollo-server";
import { decodeToken, generateHash } from "../../../auth";
import { GraphqlContext, ResponseMessage, User, UserInfo } from "../../../types";

export const updateUser = async (
	root: undefined,
	args: UpdateUserArgs,
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
			const selectedUser: User | undefined = await knex(schema.users)
				.where("id", "=", args.userId)
				.first()
				.then();
			if (selectedUser) {
				const { email, password, firstName, lastName, isAdmin } = args;
				if (email || password || firstName || lastName || isAdmin) {
					const userInfoVariables: UpdateUserInfo = {
						updatedBy: jwtDecoded.userId,
						updatedAt: knex.fn.now()
					};
					if (firstName) userInfoVariables.firstName = firstName;
					if (lastName) userInfoVariables.lastName = lastName;
					if (isAdmin) userInfoVariables.isAdmin = isAdmin;
					return await knex(schema.usersInfo)
						.update(userInfoVariables)
						.where("id", "=", args.userId)
						.then(async () => {
							if (email || password) {
								const userVariables: UpdateUser = {};
								if (email) userVariables.email = email;
								if (password) {
									const { hash, salt } = generateHash(password);
									userVariables.password = hash;
									userVariables.salt = salt;
								}
								return await knex(schema.users)
									.update(userVariables)
									.where("id", "=", args.userId)
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
							console.log(error);
							throw new ApolloError(error);
						});
				} else {
					throw new UserInputError("Please send some arguments");
				}
			} else {
				throw new UserInputError("The user that you are trying to update doesnt exist");
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
