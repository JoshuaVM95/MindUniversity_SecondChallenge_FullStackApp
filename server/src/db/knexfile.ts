import dotenv from "dotenv";
dotenv.config({
	path: "../../.env.development"
});

export default {
	client: "mysql",
	connection: {
		host: process.env.DATABASE_HOST,
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_NAME
	},
	migrations: {
		directory: "./migrations"
	},
	schema: {
		accounts: "accounts",
		userAccounts: "userAccounts",
		users: "users",
		usersInfo: "usersInfo"
	}
};
