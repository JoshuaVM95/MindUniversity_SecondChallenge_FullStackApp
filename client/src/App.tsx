import React, { useMemo } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { LateralBar } from "./components/lateralBar/lateralBar";
import { Accounts, Login, NotFound, Profile, Users } from "./pages";
import { Routes, Role } from "./types";
import styles from "./App.module.scss";
import { RootState } from "./store/store";
import { useSelector } from "react-redux";

const App = (): React.ReactElement => {
	const currentUser = useSelector((state: RootState) => state.currentUser);
	const hasPermission = useMemo(() => {
		const currentRole = currentUser?.role;
		const userRole: Role | undefined = currentRole !== undefined ? currentRole : undefined;
		return userRole === Role.SUPER || userRole === Role.ADMIN;
	}, [currentUser.role]);

	return (
		<Router>
			<div className={hasPermission ? styles.appContainer : ""}>
				{hasPermission && <LateralBar />}
				<div className={styles.contentContainer}>
					<Switch>
						{hasPermission && <Route exact path={Routes.ACCOUNTS} component={Accounts} />}
						{hasPermission && <Route exact path={Routes.USERS} component={Users} />}
						<Route path={Routes.PROFILE} component={Profile} />
						<Route exact path={Routes.LOGIN} component={Login} />
						<Route component={NotFound} />
					</Switch>
				</div>
			</div>
		</Router>
	);
};

export default App;
