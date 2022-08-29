import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from "@mui/material";
import { clearCurrentUser } from "../../store/currentUser/actions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { Paths } from "../../types";

const Transition = React.forwardRef(function Transition(
	props: unknown & {
		children: React.ReactElement;
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export const TokenExpiredAlert = (): React.ReactElement => {
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();

	const logOut = () => {
		dispatch(clearCurrentUser());
		navigate(Paths.LOGIN);
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
