import { ApolloServer } from "apollo-server";
import typeDefs from "../../shcema";
import resolvers from "../../resolvers";

import knexfile from "../../../db/knexfile";
import Knex, { Knex as IKnex } from "knex";

const knex = Knex({
	client: "mysql2",
	connection: {
		host: process.env.DATABASE_HOST,
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_NAME
	}
});

interface testConnectionReturn {
	server: ApolloServer;
	knex: IKnex;
}

export const testConnection = (token?: string): testConnectionReturn => {
	return {
		server: new ApolloServer({
			typeDefs,
			resolvers,
			context: {
				knex: knex,
				schema: knexfile.schema,
				token
			}
		}),
		knex
	};
};
