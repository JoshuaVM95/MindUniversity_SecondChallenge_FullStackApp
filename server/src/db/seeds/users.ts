import { Knex } from "knex";
import { generateHash } from "../../auth/hashOperations";

exports.seed = async (knex: Knex): Promise<void> => {
	// Deletes ALL existing entries
	await knex("users").del();

	const superUserEmail = process.env.SUPER_USER_EMAIL || "arkusSuperUser@jvmMindSecondChallenge.com";
	const superUserPassword = process.env.SUPER_USER_PASSWORD || "123456";
	const { hash, salt } = generateHash(superUserPassword);

	// Inserts seed entries
	await knex("users").insert([
		{
			email: superUserEmail,
			password: hash,
			salt: salt,
			isSuper: true
		}
	]);
};
