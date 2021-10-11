import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import { client } from "./ApolloClient";

ReactDOM.render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<App />
				</PersistGate>
			</Provider>
		</ApolloProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
