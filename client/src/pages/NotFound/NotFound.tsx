import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotFound.module.scss";
import { Paths } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Role } from "@mindu-second-challenge/apollo-server-types";

export const NotFound = (): React.ReactElement => {
	const currentUser = useSelector((state: RootState) => state.currentUser);
	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);
		document.body.style.overflow = "hidden";
		const myInterval = setInterval(() => {
			clearInterval(myInterval);
			document.body.style.overflow = "";
			const { jwt, role } = currentUser;
			if (jwt && role !== undefined) {
				const hasPermission = role === Role.SUPER || role === Role.ADMIN;
				navigate(hasPermission ? Paths.USERS : Paths.PROFILE);
			} else {
				navigate("/");
			}
		}, 3000);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <div className={styles.notFoundContainer} />;
};
