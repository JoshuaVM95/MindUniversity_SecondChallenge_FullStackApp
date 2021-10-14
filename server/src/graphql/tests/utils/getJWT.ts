import { loginMutation } from "../user/queries";
import { testConnection } from "../utils/apolloConnection";

export const getJWT = async (): Promise<string> => {
	const { server: loginServer } = testConnection();
	const { data: dataLogin } = await loginServer.executeOperation({
		query: loginMutation,
		variables: { email: process.env.SUPER_USER_EMAIL, password: process.env.SUPER_USER_PASSWORD }
	});
	return dataLogin?.login;
};
