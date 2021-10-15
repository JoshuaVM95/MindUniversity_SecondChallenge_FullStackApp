import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { generateHash } from "../src/auth/hashOperations";
import crypto from "crypto";

async function generateSuperUser() {
	const { hash, salt } = generateHash(process.env.SUPER_USER_PASSWORD || "123456");
	const id = crypto.randomUUID();
	const superUser = await prisma.user.upsert({
		where: { email: process.env.SUPER_USER_EMAIL },
		update: {},
		create: {
			id,
			email: process.env.SUPER_USER_EMAIL || "superUser@superUser.com",
			password: hash,
			salt,
			isSuper: true
		}
	});
	console.log({ superUser });
}

generateSuperUser()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
