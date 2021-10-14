import { userQuery } from "./queries";
import { getJWT, testConnection } from "../utils";
import { GraphQLResponse } from "apollo-server-types";
import knexfile from "../../../db/knexfile";

afterAll(() => {
	const { knex } = testConnection();
	knex.destroy();
});

describe("User query tests", () => {
	const initConnection = async ({ userId = "", mockToken = "", getValidJWT = false }): Promise<GraphQLResponse> => {
		let jwt = "";
		if (getValidJWT) {
			jwt = await getJWT();
		}
		const { server } = testConnection(jwt || mockToken);
		return await server.executeOperation({
			query: userQuery,
			variables: { userId }
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
	it("throws an error if no id is send", async () => {
		const result = await initConnection({ getValidJWT: true });
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("Please send a user id");
		}
	});
	it("throws an error if the id doesnt exist", async () => {
		const result = await initConnection({ userId: "aaaa", getValidJWT: true });
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("Invalid user id");
		}
	});
	it("returns the user data if the jwt is valid and the userId exists", async () => {
		const { knex } = testConnection();
		const user = await knex(knexfile.schema.users).select("id").first().then();
		const result = await initConnection({ userId: user.id, getValidJWT: true });
		expect(result.data?.user).toBeTruthy();
		expect(result.data?.user.id).toBe(user.id);
		expect(result.data?.user).toHaveProperty("email");
	});
});
