import { ApolloServer } from "apollo-server";
import typeDefs from "./graphql/shcema";
import resolvers from "./graphql/resolvers";

const port = process.env.PORT || 3001;

const server = new ApolloServer({
	typeDefs,
	resolvers
});

server.listen({ port }).then(({ url }) => {
	console.log(`🚀  Server ready at ${url}  `);
});
