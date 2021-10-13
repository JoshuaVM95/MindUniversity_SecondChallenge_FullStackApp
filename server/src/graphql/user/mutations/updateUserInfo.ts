import { UpdateUserInfoArgs, UpdateMyUserInfo } from "../types";
import { UserInputError, ApolloError } from "apollo-server";
import { decodeToken } from "../../../auth";
import { GraphqlContext, ResponseMessage, User } from "../../../types";

export const updateUserInfo = async (
	root: undefined,
	args: UpdateUserInfoArgs,
	{ knex, schema, token }: GraphqlContext
): Promise<ResponseMessage> => {
	const jwtDecoded = decodeToken(token);
	if (jwtDecoded) {
		const selectedUser: User | undefined = await knex(schema.users)
			.where("id", "=", jwtDecoded.userId)
			.first()
			.then();
		if (selectedUser) {
			const { englishLevel, technicalSkills, cvLink } = args;
			if (englishLevel || technicalSkills || cvLink) {
				const userInfoVariables: UpdateMyUserInfo = {
					updatedBy: jwtDecoded.userId,
					updatedAt: knex.fn.now()
				};
				if (englishLevel) userInfoVariables.englishLevel = englishLevel;
				if (technicalSkills) userInfoVariables.technicalSkills = technicalSkills;
				if (cvLink) userInfoVariables.cvLink = cvLink;
				return await knex(schema.usersInfo)
					.update(userInfoVariables)
					.where("id", "=", jwtDecoded.userId)
					.then(() => {
						return {
							message: "User updated succesfully",
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
			throw new UserInputError("The user that you are trying to update doesnt exist");
		}
	} else {
		return {
			message: "Forbidden",
			code: 403
		};
	}
};
