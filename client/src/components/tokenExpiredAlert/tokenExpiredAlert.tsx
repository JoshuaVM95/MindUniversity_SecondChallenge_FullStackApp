import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from "@material-ui/core";
import { clearCurrentUser } from "../../store/currentUser/actions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { useHistory } from "react-router";
import { Routes } from "../../types";

const Transition = React.forwardRef(function Transition(
	props: unknown & {
		children?: React.ReactElement;
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export const TokenExpiredAlert = (): React.ReactElement => {
	const dispatch: AppDispatch = useDispatch();
	const history = useHistory();

	const logOut = () => {
		dispatch(clearCurrentUser());
		history.push(Routes.LOGIN);
	};

	return (
		<Dialog
			open
			TransitionComponent={Transition}
			keepMounted
			onClose={logOut}
			aria-describedby="alert-dialog-slide-description"
		>
			<DialogTitle>Token Expired</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-slide-description">
					Your token has expired, please login again.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={logOut}>Log out</Button>
			</DialogActions>
		</Dialog>
	);
};
