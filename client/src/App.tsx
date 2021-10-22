import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Accounts, Login, NotFound, Profile, Users, UsersAccounts } from "./pages";
import { Routes } from "./types";
import { Role } from "@mindu-second-challenge/apollo-server-types";
import styles from "./App.module.scss";
import { RootState } from "./store/store";
import { useSelector } from "react-redux";
import { hasTokenExpired } from "./utilities";
import { LateralBar, TokenExpiredAlert } from "./components";

const App = (): React.ReactElement => {
	const [isTokenExpired, setIsTokenExpired] = useState<boolean>(false);

	const currentUser = useSelector((state: RootState) => state.currentUser);
	const hasPermission = useMemo(() => {
		const currentRole = currentUser?.role;
		const userRole: Role | undefined = currentRole !== undefined ? currentRole : undefined;
		return userRole === Role.SUPER || userRole === Role.ADMIN;
	}, [currentUser.role]);

	useEffect(() => {
		const checkTokenOnClick = () => {
			if (currentUser.exp && !isTokenExpired) {
				setIsTokenExpired(hasTokenExpired(currentUser.exp));
			} else if (isTokenExpired) {
				setIsTokenExpired(false);
			}
		};
		document.addEventListener("click", checkTokenOnClick);
		return () => {
			document.removeEventListener("click", checkTokenOnClick);
		};
	}, [currentUser.exp, isTokenExpired]);

	return (
		<Router>
			<div className={hasPermission ? styles.appContainer : ""}>
				{hasPermission && <LateralBar />}
				{isTokenExpired && <TokenExpiredAlert />}
				<Switch>
					{hasPermission && <Route exact path={Routes.USERS_ACCOUNTS_HISTORY} component={UsersAccounts} />}
					{hasPermission && <Route exact path={Routes.ACCOUNTS} component={Accounts} />}
					{hasPermission && <Route exact path={Routes.USERS} component={Users} />}
					{currentUser.jwt !== undefined && <Route path={Routes.PROFILE} component={Profile} />}
					<Route exact path={Routes.LOGIN} component={Login} />
					<Route component={NotFound} />
				</Switch>
			</div>
		</Router>
	);
};

export default App;
