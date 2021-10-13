import { loginMutation, usersQuery } from "./queries";
import { testConnection } from "../utils/apolloConnection";

afterAll(() => {
	const { knex } = testConnection();
	knex.destroy();
});

describe("User schema tests", () => {
	let jwt = "";
	it("throws an error if the email && password are falsy", async () => {
		const { server } = testConnection();
		const result = await server.executeOperation({
			query: loginMutation,
			variables: { email: "", password: "" }
		});
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("Complete the form before sending the request");
		}
	});
	it("throws an error if the email doesnt exists in the db", async () => {
		const { server } = testConnection();
		const result = await server.executeOperation({
			query: loginMutation,
			variables: { email: "aaaa", password: "1234" }
		});
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("Invalid email!!");
		}
	});
	it("throws an error if the email exists, but the password is incorrect", async () => {
		const { server } = testConnection();
		const result = await server.executeOperation({
			query: loginMutation,
			variables: { email: process.env.SUPER_USER_EMAIL, password: "1234" }
		});
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("Invalid password!!");
		}
	});
	it("logins succesfully if the email and password are correct, and returns a JWT", async () => {
		const { server } = testConnection();
		const result = await server.executeOperation({
			query: loginMutation,
			variables: { email: process.env.SUPER_USER_EMAIL, password: process.env.SUPER_USER_PASSWORD }
		});
		jwt = result.data?.login;
		expect(result.data?.login).toBeTruthy();
		expect(typeof result.data?.login).toBe("string");
	});
	it("throws an error if no token is send", async () => {
		const { server } = testConnection();
		const result = await server.executeOperation({
			query: usersQuery,
			variables: { filterByEmail: "", page: 0, rowsPerPage: 100 }
		});
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("Not authorized, no token");
		}
	});
	it("throws an error if the token is not valid", async () => {
		const { server } = testConnection("aaa");
		const result = await server.executeOperation({
			query: usersQuery,
			variables: { filterByEmail: "", page: 0, rowsPerPage: 100 }
		});
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("Not authorized, invalid token");
		}
	});
	it("returns the users list and the total number of users", async () => {
		const { server } = testConnection(jwt);
		const result = await server.executeOperation({
			query: usersQuery,
			variables: { filterByEmail: "", page: 0, rowsPerPage: 100 }
		});
		expect(result.data?.users.totalUsers).toBeGreaterThan(0);
		expect(result.data?.users.users).toBeTruthy();
		expect(result.data?.users.users.length).toBeGreaterThan(0);
	});
});
