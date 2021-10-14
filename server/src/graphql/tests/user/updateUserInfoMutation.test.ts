import { updateUserInfoMutation } from "./queries";
import { getJWT, testConnection } from "../utils";
import { GraphQLResponse } from "apollo-server-types";
import knexfile from "../../../db/knexfile";
import { generateToken } from "../../../auth";
import { EnglishLevel } from "../../../types";

afterAll(() => {
	const { knex } = testConnection();
	knex.destroy();
});

interface initConnectionArgs {
	englishLevel?: string;
	technicalSkills?: string;
	cvLink?: string;
	mockToken?: string;
	getValidJWT?: boolean;
}

describe("Update user info mutation tests", () => {
	const initConnection = async ({
		englishLevel,
		technicalSkills,
		cvLink,
		mockToken = "",
		getValidJWT = false
	}: initConnectionArgs): Promise<GraphQLResponse> => {
		let jwt = "";
		if (getValidJWT) {
			jwt = await getJWT();
		}
		const { server } = testConnection(jwt || mockToken);
		return await server.executeOperation({
			query: updateUserInfoMutation,
			variables: { englishLevel, technicalSkills, cvLink }
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
	it("throws an error if the user doesnt exist", async () => {
		const mockToken = generateToken("123", "firstName", "lastName", 2);
		const result = await initConnection({ mockToken });
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("The user that you are trying to update doesnt exist");
		}
	});
	it("throws an error if the args are empty", async () => {
		const { knex } = testConnection();
		const normalUser = "update_info_normal_user@unit-test.com";
		await knex(knexfile.schema.users).insert({
			email: normalUser,
			password: "1234",
			salt: "123"
		});
		const user = await knex(knexfile.schema.users).select("id").where("email", "=", normalUser).first();
		const mockToken = generateToken(user.id, "firstName", "lastName", 2);
		const result = await initConnection({
			mockToken
		});
		expect(result.errors).toHaveLength(1);
		if (result.errors) {
			expect(result.errors[0].message).toBe("Please send some arguments");
		}
		await knex(knexfile.schema.users).delete().where("id", "=", user.id);
	});
	it("updates the user info if the jwt is valid, the user id exist and some args are send", async () => {
		const { knex } = testConnection();
		const normalUser = "update_info_normal_user@unit-test.com";
		await knex(knexfile.schema.users).insert({
			email: normalUser,
			password: "1234",
			salt: "123"
		});
		const user = await knex(knexfile.schema.users).select("id").where("email", "=", normalUser).first();
		await knex(knexfile.schema.usersInfo).insert({
			id: user.id,
			firstName: "Unit",
			lastName: "Test",
			createdBy: user.id,
			isAdmin: false
		});
		const userInfo = await knex(knexfile.schema.usersInfo).where("id", "=", user.id).first();
		expect(userInfo.englishLevel).toBeNull();
		expect(userInfo.technicalSkills).toBeNull();
		expect(userInfo.cvLink).toBeNull();
		const mockToken = generateToken(user.id);
		const technicalSkills = "Js, Ts, Css";
		const cvLink = "https://www.google.com";
		const result = await initConnection({
			mockToken,
			englishLevel: EnglishLevel.INTERMEDIATE,
			technicalSkills,
			cvLink
		});
		const updatedUser = await knex(knexfile.schema.usersInfo).where("id", "=", user.id).first();
		expect(result.data?.updateUserInfo).toBeTruthy();
		expect(result.data?.updateUserInfo.message).toBe("User updated succesfully");
		expect(result.data?.updateUserInfo.code).toBe(200);
		expect(updatedUser.englishLevel).not.toBeNull();
		expect(updatedUser.englishLevel).toBe(EnglishLevel.INTERMEDIATE);
		expect(updatedUser.technicalSkills).not.toBeNull();
		expect(updatedUser.technicalSkills).toBe(technicalSkills);
		expect(updatedUser.cvLink).not.toBeNull();
		expect(updatedUser.cvLink).toBe(cvLink);
		await knex(knexfile.schema.usersInfo)
			.delete()
			.where("id", "=", user.id)
			.then(() => knex(knexfile.schema.users).delete().where("id", "=", user.id));
	});
});
