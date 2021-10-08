import { LoginArgs } from "../types";
import { UserInputError, AuthenticationError } from "apollo-server";
import { isUserPasswordValid, generateToken } from "../../../auth";
import { GraphqlContext, User } from "../../../types";

export const login = async (root: undefined, args: LoginArgs, { knex, schema }: GraphqlContext): Promise<string> => {
	if (args.email && args.password) {
		const user: User | undefined = await knex(schema.users).select().where("email", "=", args.email).first().then();
		if (user) {
			if (isUserPasswordValid(args.password, user.password, user.salt)) {
				return generateToken(user.id);
			} else {
				throw new AuthenticationError("Wrong password!!");
			}
		} else {
			throw new AuthenticationError("Invalid email!!");
		}
	} else {
		throw new UserInputError("Complete the form before sending the request");
	}
};
