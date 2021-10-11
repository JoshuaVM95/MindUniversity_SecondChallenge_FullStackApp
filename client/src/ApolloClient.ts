import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
	uri: "/graphql"
});

const authLink = setContext((_, { headers }) => {
	//TODO fix token auth on first login
	const session = JSON.parse(sessionStorage.getItem("persist:session") || "");
	const currentUser = JSON.parse(session.currentUser);
	const token = currentUser.jwt;
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : ""
		}
	};
});

export const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache()
});
