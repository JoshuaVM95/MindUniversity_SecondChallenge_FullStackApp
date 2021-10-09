import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import styles from "./NotFound.module.scss";
import { Role, Routes } from "../../types";

export const NotFound = ({ history }: RouteComponentProps): React.ReactElement => {
	useEffect(() => {
		window.scrollTo(0, 0);
		document.body.style.overflow = "hidden";
		const myInterval = setInterval(() => {
			clearInterval(myInterval);
			document.body.style.overflow = "";
			const jwt = sessionStorage.getItem("JWT");
			const role = sessionStorage.getItem("role");
			if (jwt && role !== null) {
				const userRole = parseInt(role);
				const hasPermission = userRole === Role.SUPER || userRole === Role.ADMIN;
				history.push(hasPermission ? Routes.USERS : Routes.PROFILE);
			} else {
				history.push("/");
			}
		}, 3000);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <div className={styles.notFoundContainer} />;
};
