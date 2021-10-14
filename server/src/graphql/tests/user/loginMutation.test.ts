import { loginMutation } from "./queries";
import { testConnection } from "../utils/apolloConnection";
import { GraphQLResponse } from "apollo-server-types";

afterAll(() => {
	const { knex } = testConnection();
	knex.destroy();
});

describe("Login mutation tests", () => {
	const initConnection = async (email = "", password = ""): Promise<GraphQLResponse> => {
		const { server } = testConnection();
		return await server.executeOperation({
			query: loginMutation,
			variables: { email, password }
		});
	};
	it("throws an error if the email && password are falsy", async () => {
		const result = await initConnection();
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("Complete the form before sending the request");
		}
	});
	it("throws an error if the email doesnt exists in the db", async () => {
		const result = await initConnection("aaaa", "1234");
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("Invalid email!!");
		}
	});
	it("throws an error if the email exists, but the password is incorrect", async () => {
		const result = await initConnection(process.env.SUPER_USER_EMAIL, "1234");
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("Invalid password!!");
		}
	});
	it("logins succesfully if the email and password are correct, and returns a JWT", async () => {
		const result = await initConnection(process.env.SUPER_USER_EMAIL, process.env.SUPER_USER_PASSWORD);
		expect(result.data?.login).toBeTruthy();
		expect(typeof result.data?.login).toBe("string");
	});
});
