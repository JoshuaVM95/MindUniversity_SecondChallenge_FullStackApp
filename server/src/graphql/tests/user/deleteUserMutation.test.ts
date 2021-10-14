import { deleteUsersMutation } from "./queries";
import { getJWT, testConnection } from "../utils";
import { GraphQLResponse } from "apollo-server-types";
import knexfile from "../../../db/knexfile";
import { generateToken } from "../../../auth";

afterAll(() => {
	const { knex } = testConnection();
	knex.destroy();
});

interface initConnectionArgs {
	userIds?: string[];
	mockToken?: string;
	getValidJWT?: boolean;
}

describe("Delete users mutation tests", () => {
	const initConnection = async ({
		userIds = [],
		mockToken = "",
		getValidJWT = false
	}: initConnectionArgs): Promise<GraphQLResponse> => {
		let jwt = "";
		if (getValidJWT) {
			jwt = await getJWT();
		}
		const { server } = testConnection(jwt || mockToken);
		return await server.executeOperation({
			query: deleteUsersMutation,
			variables: { userIds }
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
			expect(result.errors[0].message).toBe("Send one or more userId");
		}
	});
	it("throws an error if you try to delete the super user", async () => {
		const { knex } = testConnection();
		const user = await knex(knexfile.schema.users)
			.select("id")
			.where("email", "=", process.env.SUPER_USER_EMAIL || "")
			.first();
		const result = await initConnection({ userIds: [user.id], getValidJWT: true });
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("You cant delete a super user");
		}
	});
	it("throws an error if the user that request the delete is not an admin", async () => {
		const { knex } = testConnection();
		const normalUser = "delete_normal_user@unit-test.com";
		await knex(knexfile.schema.users).insert({
			email: normalUser,
			password: "1234",
			salt: "123"
		});
		const user = await knex(knexfile.schema.users).select("id").where("email", "=", normalUser).first();
		const mockToken = generateToken(user.id);
		const result = await initConnection({
			userIds: ["aaa", "bbb"],
			mockToken
		});
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("You need to be an admin");
		}
		await knex(knexfile.schema.users).delete().where("id", "=", user.id);
	});
	it("delets the users if the jwt is valid, the user making the request is an admin and the required fields are send", async () => {
		const { knex } = testConnection();
		const userEmail = "delete_unit-test@unit-test.com";
		await knex(knexfile.schema.users).insert({
			email: userEmail,
			password: "1234",
			salt: "abcd"
		});
		const createdUser = await knex(knexfile.schema.users).select("id").where("email", "=", userEmail).first();
		const result = await initConnection({
			userIds: [createdUser.id],
			getValidJWT: true
		});
		const archivedUser = await knex(knexfile.schema.users)
			.select("isArchived")
			.where("email", "=", userEmail)
			.first();
		expect(result.data?.deleteUsers).toBeTruthy();
		expect(result.data?.deleteUsers.message).toBe("Users deleted correctly");
		expect(result.data?.deleteUsers.code).toBe(204);
		expect(archivedUser.isArchived).toBe(1);
		await knex(knexfile.schema.users).delete().where("id", "=", createdUser.id);
	});
});
