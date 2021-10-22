import { UserInputError, ApolloError, ForbiddenError } from "apollo-server";
import { decodeToken } from "../../../../auth";
import { GraphqlContext } from "../../../../types";
import { DeleteUsersMutationVariables, ResponseMessage, Role } from "@mindu-second-challenge/apollo-server-types";

export const deleteUsersV2 = async (
	root: undefined,
	args: DeleteUsersMutationVariables,
	{ token, prisma }: GraphqlContext
): Promise<ResponseMessage> => {
	const jwtDecoded = decodeToken(token);
	if (jwtDecoded) {
		if (jwtDecoded.role !== Role.NORMAL) {
			if (args.userIds.length > 0) {
				const superUser = await prisma.user.findFirst({ where: { isSuper: true }, select: { id: true } });
				const hasSuperUser = args.userIds.includes(superUser?.id || "");
				if (!hasSuperUser) {
					const userList = await prisma.user.findMany({
						where: {
							id: {
								in: args.userIds
							},
							AND: {
								isSuper: false
							}
						},
						select: {
							id: true
						}
					});
					if (userList.length > 0) {
						return await prisma
							.$transaction(
								userList.map((userId) => {
									return prisma.user.update({
										where: {
											id: userId.id
										},
										data: {
											isArchived: true
										}
									});
								})
							)
							.then(() => {
								return {
									message: "Users deleted correctly",
									code: 204
								};
							})
							.catch((error) => {
								throw new ApolloError(error);
							});
					} else {
						throw new UserInputError("The users that you are trying to delete doesnt exists");
					}
				} else {
					throw new UserInputError("You cant delete a super user, remove the id from the list");
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
