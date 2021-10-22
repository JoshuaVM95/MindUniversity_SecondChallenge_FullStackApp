import { Knex } from "knex";
import { generateHash } from "../../auth/hashOperations";
import { User } from "@mindu-second-challenge/apollo-server-types";

exports.seed = async (knex: Knex): Promise<void> => {
	const hasUsers: User | undefined = await knex("users").select().first().then();
	if (!hasUsers) {
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
	}
};
