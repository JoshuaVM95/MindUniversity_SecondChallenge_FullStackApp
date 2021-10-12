import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
	uri: "http://localhost:3001/graphql"
});

const authLink = setContext((_, { headers }) => {
	const persistedSession = sessionStorage.getItem("persist:session");
	let token = "";
	if (persistedSession) {
		const session = JSON.parse(persistedSession);
		const currentUser = JSON.parse(session.currentUser);
		token = currentUser.jwt;
	}
	return {
		headers: {
			...headers,
			authorization: `Bearer ${token}`
		}
	};
});

export const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache()
});
