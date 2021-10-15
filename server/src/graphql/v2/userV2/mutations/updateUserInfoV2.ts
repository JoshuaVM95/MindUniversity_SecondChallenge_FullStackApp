import { UpdateUserInfoArgs, UpdateMyUserInfo } from "../types";
import { UserInputError, ApolloError } from "apollo-server";
import { decodeToken } from "../../../../auth";
import { GraphqlContext, ResponseMessage } from "../../../../types";

export const updateUserInfoV2 = async (
	root: undefined,
	args: UpdateUserInfoArgs,
	{ token, prisma }: GraphqlContext
): Promise<ResponseMessage> => {
	const jwtDecoded = decodeToken(token);
	if (jwtDecoded) {
		const selectedUser = await prisma.user.findFirst({ where: { id: jwtDecoded.userId } });
		if (selectedUser) {
			const { englishLevel, technicalSkills, cvLink } = args;
			if (englishLevel || technicalSkills || cvLink) {
				const userInfoVariables: UpdateMyUserInfo = {
					updatedBy: jwtDecoded.userId
				};
				if (englishLevel) userInfoVariables.englishLevel = englishLevel;
				if (technicalSkills) userInfoVariables.technicalSkills = technicalSkills;
				if (cvLink) userInfoVariables.cvLink = cvLink;
				return await prisma.userinfo
					.update({
						where: { id: jwtDecoded.userId },
						data: userInfoVariables
					})
					.then(() => {
						return {
							message: "User updated succesfully",
							code: 200
						};
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
		return {
			message: "Forbidden",
			code: 403
		};
	}
};
