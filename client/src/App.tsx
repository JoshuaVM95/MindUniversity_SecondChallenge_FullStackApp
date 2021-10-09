import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Accounts, Login, NotFound, Profile, Users } from "./pages";
import { Routes, Role } from "./types";

const App = (): React.ReactElement => {
	const sessionRole = sessionStorage.getItem("role");
	const userRole = sessionRole !== null ? parseInt(sessionRole) : undefined;
	const hasPermission = userRole === Role.SUPER || userRole === Role.ADMIN;

	return (
		<Router>
			<Switch>
				{hasPermission && <Route exact path={Routes.ACCOUNTS} component={Accounts} />}
				{hasPermission && <Route exact path={Routes.USERS} component={Users} />}
				<Route path={Routes.PROFILE} component={Profile} />
				<Route exact path={Routes.LOGIN} component={Login} />
				<Route component={NotFound} />
			</Switch>
		</Router>
	);
};

export default App;
