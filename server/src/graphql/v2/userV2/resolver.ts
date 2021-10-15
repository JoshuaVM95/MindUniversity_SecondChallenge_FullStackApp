import { loginV2, createUserV2, deleteUsersV2, updateUserV2, updateUserInfoV2 } from "./mutations";
import { AuthenticationError, UserInputError, ValidationError } from "apollo-server";
import { decodeToken } from "../../../auth/jwtOperations";
import { UserArgs, UsersArgs, UsersResponse } from "./types";
import { GraphqlContext } from "../../../types";
import { user, userinfo, useraccount } from "@prisma/client";

export const Query = {
	userV2: async (root: undefined, args: UserArgs, { token, prisma }: GraphqlContext): Promise<user> => {
		if (decodeToken(token)) {
			if (args.userId) {
				const user = await prisma.user.findFirst({ where: { id: args.userId, AND: { isArchived: false } } });
				if (user) {
					return user;
				} else {
					throw new ValidationError("Invalid user id");
				}
			} else {
				throw new UserInputError("Please send a user id");
			}
		} else {
			throw new AuthenticationError("Invalid token");
		}
	},
	usersV2: async (root: undefined, args: UsersArgs, { token, prisma }: GraphqlContext): Promise<UsersResponse> => {
		if (decodeToken(token)) {
			const filter = args.filterByEmail || "";
			const currentPage = args.page;
			const totalUsers = await prisma.user.count();

			const offset = currentPage * (args.rowsPerPage || totalUsers);
			const limit = offset + (args.rowsPerPage || totalUsers);

			const users = await prisma.user.findMany({
				skip: offset,
				take: limit,
				where: {
					email: {
						contains: filter
					},
					AND: {
						isArchived: false
					}
				},
				orderBy: {
					email: "desc"
				}
			});

			return { users, totalUsers };
		} else {
			throw new AuthenticationError("Invalid token");
		}
	}
};

export const Mutation = {
	loginV2,
	createUserV2,
	deleteUsersV2,
	updateUserV2,
	updateUserInfoV2
};

export const UserV2 = {
	userInfo: async (aUser: user, root: undefined, { prisma }: GraphqlContext): Promise<userinfo | null> =>
		await prisma.userinfo.findFirst({ where: { id: aUser.id } }),
	latestPositions: async (aUser: user, root: undefined, { prisma }: GraphqlContext): Promise<useraccount[] | null> =>
		await prisma.useraccount.findMany({ where: { user: aUser.id }, orderBy: { initDate: "desc" }, take: 3 })
};

export const UserInfoV2 = {
	createdBy: async (aUserInfo: userinfo, root: undefined, { prisma }: GraphqlContext): Promise<user | null> =>
		await prisma.user.findFirst({ where: { id: aUserInfo.createdBy } }),
	updatedBy: async (aUserInfo: userinfo, root: undefined, { prisma }: GraphqlContext): Promise<user | null> =>
		await prisma.user.findFirst({ where: { id: aUserInfo.updatedBy || "" } })
};
