import { ApolloServer } from "apollo-server";
import typeDefs from "./graphql/shcema";
import resolvers from "./graphql/resolvers";
import path from "path";

import dotenv from "dotenv";
dotenv.config({
	path: path.resolve(__dirname, "../.env.development")
});

import knexfile from "./db/knexfile";
import knex from "knex";

const knexConfig = knex(knexfile);

const port = process.env.PORT || 3001;

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => {
		const bearerToken = req.headers.authorization;
		const splitToken = bearerToken?.split(" ");
		const token = splitToken ? splitToken[1] : "";
		return {
			knex: knexConfig,
			schema: knexfile.schema,
			token
		};
	}
});

server.listen({ port }).then(({ url }) => {
	console.log(`🚀  Server ready at ${url}  `);
});
