import { UserInputError, ApolloError, ForbiddenError } from "apollo-server";
import { decodeToken } from "../../../auth";
import { GraphqlContext } from "../../../types";
import {
	DeleteUsersMutationVariables,
	ResponseMessage,
	User,
	UserInfo
} from "@mindu-second-challenge/apollo-server-types";

export const deleteUsers = async (
	root: undefined,
	args: DeleteUsersMutationVariables,
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
			if (args.userIds.length > 0) {
				const superUserId = await knex(schema.users).select("id").where("isSuper", "=", true).first().then();
				const userList = args.userIds.filter((userId) => userId !== superUserId.id);
				if (userList.length > 0) {
					return knex(schema.users)
						.update({
							isArchived: true
						})
						.whereIn("id", userList)
						.then(() => {
							return {
								message: "Users deleted correctly",
								code: 204
							};
						})
						.catch((error) => {
							console.log(error);
							throw new ApolloError(error);
						});
				} else {
					throw new UserInputError("You cant delete a super user");
				}
			} else {
				throw new UserInputError("Send one or more userId");
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
