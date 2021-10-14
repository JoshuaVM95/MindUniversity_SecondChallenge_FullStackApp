import { usersQuery } from "./queries";
import { testConnection } from "../utils/apolloConnection";
import { GraphQLResponse } from "apollo-server-types";
import { getJWT } from "../utils";

afterAll(() => {
	const { knex } = testConnection();
	knex.destroy();
});

describe("Users query tests", () => {
	const initConnection = async ({
		filterByEmail = "",
		page = 0,
		rowsPerPage = 0,
		mockToken = "",
		getValidJWT = false
	}): Promise<GraphQLResponse> => {
		let jwt = "";
		if (getValidJWT) {
			jwt = await getJWT();
		}
		const { server } = testConnection(jwt || mockToken);
		return await server.executeOperation({
			query: usersQuery,
			variables: { filterByEmail, page, rowsPerPage }
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
	it("returns the users list and the total number of users when a valid token is send", async () => {
		const result = await initConnection({ getValidJWT: true });
		expect(result.data?.users.totalUsers).toBeGreaterThan(0);
		expect(result.data?.users.users).toBeTruthy();
		expect(result.data?.users.users.length).toBeGreaterThan(0);
	});
});
