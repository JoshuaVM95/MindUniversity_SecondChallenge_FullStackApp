import { LoginArgs, LoginResponse } from "../types";
import { UserInputError } from "apollo-server";
import { isUserPasswordValid, generateToken } from "../../../auth";
import { GraphqlContext, User, UserInfo } from "../../../types";

export const login = async (
	root: undefined,
	args: LoginArgs,
	{ knex, schema }: GraphqlContext
): Promise<LoginResponse> => {
	if (args.email && args.password) {
		const user: User | undefined = await knex(schema.users).where("email", "=", args.email).first().then();
		if (user) {
			if (isUserPasswordValid(args.password, user.password, user.salt)) {
				const userInfo: UserInfo | undefined = !user.isSuper
					? await knex(schema.usersInfo).where("email", "=", args.email).first().then()
					: undefined;
				const role = user.isSuper ? 0 : userInfo?.isAdmin ? 1 : 2;
				return {
					token: generateToken(user.id),
					role
				};
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
