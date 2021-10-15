import { LoginArgs } from "../types";
import { UserInputError } from "apollo-server";
import { isUserPasswordValid, generateToken } from "../../../../auth";
import { GraphqlContext } from "../../../../types";

export const loginV2 = async (root: undefined, args: LoginArgs, { prisma }: GraphqlContext): Promise<string> => {
	if (args.email && args.password) {
		const user = await prisma.user.findFirst({ where: { email: args.email } });
		if (user) {
			if (isUserPasswordValid(args.password, user.password, user.salt)) {
				const userInfo = await prisma.userinfo.findFirst({ where: { id: user.id } });
				const firstName = user.isSuper ? "Super" : userInfo?.firstName;
				const lastName = user.isSuper ? "Super" : userInfo?.lastName;
				const role = user.isSuper ? 0 : userInfo?.isAdmin ? 1 : 2;
				const token = generateToken(user.id, firstName, lastName, role);
				return token;
			} else {
				throw new UserInputError("Invalid password!!");
			}
		} else {
			throw new UserInputError("Invalid email!!");
		}
	} else {
		throw new UserInputError("Complete the form before sending the request");
	}
};
