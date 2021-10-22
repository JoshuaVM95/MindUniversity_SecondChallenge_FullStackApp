import { UserInputError } from "apollo-server";
import { isUserPasswordValid, generateToken } from "../../../auth";
import { GraphqlContext } from "../../../types";
import { LoginMutationVariables, UserInfo } from "@mindu-second-challenge/apollo-server-types";
import { UserDB } from "../types";

export const login = async (
	root: undefined,
	args: LoginMutationVariables,
	{ knex, schema }: GraphqlContext
): Promise<string> => {
	if (args.email && args.password) {
		const user: UserDB | undefined = await knex(schema.users).where("email", "=", args.email).first().then();
		if (user) {
			if (isUserPasswordValid(args.password, user.password, user.salt)) {
				const userInfo: UserInfo | undefined = !user.isSuper
					? await knex(schema.usersInfo).where("id", "=", user.id).first().then()
					: undefined;
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
