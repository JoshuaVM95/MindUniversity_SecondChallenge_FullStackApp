import { updateUserMutation } from "./queries";
import { getJWT, testConnection } from "../utils";
import { GraphQLResponse } from "apollo-server-types";
import knexfile from "../../../db/knexfile";
import { generateToken } from "../../../auth";

afterAll(() => {
	const { knex } = testConnection();
	knex.destroy();
});

interface initConnectionArgs {
	userId?: string;
	email?: string;
	password?: string;
	firstName?: string;
	lastName?: string;
	isAdmin?: boolean;
	mockToken?: string;
	getValidJWT?: boolean;
}

describe("Update user mutation tests", () => {
	const initConnection = async ({
		userId = "",
		email,
		password,
		firstName,
		lastName,
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
			query: updateUserMutation,
			variables: { userId, email, password, firstName, lastName, isAdmin }
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
	it("throws an error if the user id is undefined", async () => {
		const result = await initConnection({ getValidJWT: true });
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("Please send a user id");
		}
	});
	it("throws an error if the user id doesnt exist in the db", async () => {
		const result = await initConnection({ userId: "aaa", getValidJWT: true });
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("The user that you are trying to update doesnt exist");
		}
	});
	it("throws an error if there is no values to update", async () => {
		const { knex } = testConnection();
		const user = await knex(knexfile.schema.users)
			.select("id")
			.where("email", "=", process.env.SUPER_USER_EMAIL || "")
			.first();
		const result = await initConnection({ userId: user.id, getValidJWT: true });
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("Please send some arguments");
		}
	});
	it("throws an error if the user that request the update is not an admin", async () => {
		const { knex } = testConnection();
		const normalUser = "update_normal_user@unit-test.com";
		await knex(knexfile.schema.users).insert({
			email: normalUser,
			password: "1234",
			salt: "123"
		});
		const user = await knex(knexfile.schema.users).select("id").where("email", "=", normalUser).first();
		const mockToken = generateToken(user.id, "firstName", "lastName", 2);
		const result = await initConnection({
			userId: user.id,
			mockToken,
			email: "update_email@unit-tes.com"
		});
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("You need to be an admin");
		}
		await knex(knexfile.schema.users).delete().where("id", "=", user.id);
	});
	it("update the user if the jwt is valid, the user making the request is an admin and the required fields are send", async () => {
		const { knex } = testConnection();
		const userEmail = "update_unit-test@unit-test.com";
		await knex(knexfile.schema.users).insert({
			email: userEmail,
			password: "1234",
			salt: "abcd"
		});
		const createdUser = await knex(knexfile.schema.users)
			.select("id", "email")
			.where("email", "=", userEmail)
			.first();
		expect(createdUser.email).toBe(userEmail);
		const updatedUserEmail = "updated_unit-test@unit-test.com";
		const result = await initConnection({
			userId: createdUser.id,
			getValidJWT: true,
			email: updatedUserEmail
		});
		const updatedUser = await knex(knexfile.schema.users).select("email").where("id", "=", createdUser.id).first();
		expect(result.data?.updateUser).toBeTruthy();
		expect(result.data?.updateUser.message).toBe("User updated succesfully");
		expect(result.data?.updateUser.code).toBe(200);
		expect(updatedUser.email).not.toBe(userEmail);
		expect(updatedUser.email).toBe(updatedUserEmail);
		await knex(knexfile.schema.users).delete().where("id", "=", createdUser.id);
	});
});
