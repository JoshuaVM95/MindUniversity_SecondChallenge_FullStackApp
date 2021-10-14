import { createUserMutation } from "./queries";
import { getJWT, testConnection } from "../utils";
import { GraphQLResponse } from "apollo-server-types";
import knexfile from "../../../db/knexfile";
import { generateToken } from "../../../auth";

afterAll(() => {
	const { knex } = testConnection();
	knex.destroy();
});

interface initConnectionArgs {
	email?: string;
	password?: string;
	firstName?: string;
	lastName?: string;
	isAdmin?: boolean;
	mockToken?: string;
	getValidJWT?: boolean;
}

describe("Create user mutation tests", () => {
	const initConnection = async ({
		email = "",
		password = "",
		firstName = "",
		lastName = "",
		isAdmin,
		mockToken = "",
		getValidJWT = false
	}: initConnectionArgs): Promise<GraphQLResponse> => {
		let jwt = "";
		if (getValidJWT) {
			jwt = await getJWT();
		}
		const { server } = testConnection(jwt || mockToken);
		return await server.executeOperation({
			query: createUserMutation,
			variables: { email, password, firstName, lastName, isAdmin }
		});
	};
	it("throws an error if no token is send", async () => {
		const result = await initConnection({});
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("Not authorized, no token");
		}
	});
	it("throws an error if the token is not valid", async () => {
		const result = await initConnection({ mockToken: "aaa" });
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("Not authorized, invalid token");
		}
	});
	it("throws an error if the required fields are not fill", async () => {
		const result = await initConnection({ getValidJWT: true });
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("Complete the form before sending the request");
		}
	});
	it("throws an error if the user that request the creation is not an admin", async () => {
		const { knex } = testConnection();
		const normalUser = "normal_user@unit-test.com";
		await knex(knexfile.schema.users).insert({
			email: normalUser,
			password: "1234",
			salt: "123"
		});
		const user = await knex(knexfile.schema.users).select("id").where("email", "=", normalUser).first();
		const mockToken = generateToken(user.id);
		const result = await initConnection({
			email: "unit-test@unit-test.com",
			password: "1234",
			firstName: "Unit",
			lastName: "Test",
			mockToken
		});
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("You need to be an admin");
		}
		await knex(knexfile.schema.users).delete().where("id", "=", user.id);
	});
	it("creates the user if the jwt is valid, the user making the request is an admin and the required fields are send", async () => {
		const { knex } = testConnection();
		const userEmail = "unit-test@unit-test.com";
		const result = await initConnection({
			email: userEmail,
			password: "1234",
			firstName: "Unit",
			lastName: "Test",
			isAdmin: true,
			getValidJWT: true
		});
		expect(result.data?.createUser).toBeTruthy();
		expect(result.data?.createUser.message).toBe("User created succesfully");
		expect(result.data?.createUser.code).toBe(201);
		const createdUser = await knex(knexfile.schema.users).select("id").where("email", "=", userEmail).first();
		await knex(knexfile.schema.usersInfo)
			.delete()
			.where("id", "=", createdUser.id)
			.then(async () => await knex(knexfile.schema.users).delete().where("id", "=", createdUser.id));
	});
});
