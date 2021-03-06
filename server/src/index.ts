import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import typeDefs from "./graphql/shcema";
import resolvers from "./graphql/resolvers";

import dotenv from "dotenv";
dotenv.config();

import knexfile from "./db/knexfile";
import knex from "knex";
const knexConfig = knex(knexfile);

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
			token,
			prisma
		};
	},
	plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
	introspection: true
});

server.listen({ port }).then(({ url }) => {
	console.log(`🚀  Server ready at ${url}  `);
});
