import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Accounts, Login, NotFound, Profile, Users, UsersAccounts } from "./pages";
import { Paths } from "./types";
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
				<Routes>
					{hasPermission && <Route path={Paths.USERS_ACCOUNTS_HISTORY} element={<UsersAccounts />} />}
					{hasPermission && <Route path={Paths.ACCOUNTS} element={<Accounts />} />}
					{hasPermission && <Route path={Paths.USERS} element={<Users />} />}
					{currentUser.jwt !== undefined && <Route path={Paths.PROFILE} element={<Profile />} />}
					<Route path={Paths.LOGIN} element={<Login />} />
					<Route element={<NotFound />} />
				</Routes>
			</div>
		</Router>
	);
};

export default App;
