import React, { useEffect, useState } from "react";
import {
	Alert,
	AlertTitle,
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogActions,
	FormControlLabel,
	Grid,
	TextField,
	Skeleton,
	Switch,
	styled
} from "@material-ui/core";
import { useMutation, useQuery } from "@apollo/client";
import { UserResponse, UserQuery, UpdateUserResponse, UsersQuery, UpdateUserMutation } from "../queries";
import { regexEmail, regexPassword } from "../../../utilities";
import { textFieldColor } from "../../../types";
import { UserDialogTitle } from "./UserDialogTitle";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Role, UpdateUserMutationVariables, UserQueryVariables } from "@mindu-second-challenge/apollo-server-types";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	"& .MuiDialogContent-root": {
		padding: theme.spacing(2)
	},
	"& .MuiDialogActions-root": {
		padding: theme.spacing(1)
	}
}));

interface UserEditModalProps {
	userId: string;
	onClose(): void;
	onUserUpdated(): void;
}

export const UserEditModal = ({ userId, onClose, onUserUpdated }: UserEditModalProps): React.ReactElement => {
	const { loading, error, data } = useQuery<UserResponse, UserQueryVariables>(UserQuery, {
		variables: {
			userId
		}
	});

	const currentUser = useSelector((state: RootState) => state.currentUser);
	const isSuper = currentUser.role === Role.SUPER;

	const [email, setEmail] = useState<string>("");
	const [isEmailError, setIsEmailError] = useState<boolean>(false);

	const [password, setPassword] = useState<string>("");
	const [isPasswordError, setIsPasswordError] = useState<boolean>(false);

	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");

	const [isAdmin, setIsAdmin] = useState<boolean>(false);

	const userName =
		data && data.user.userInfo ? `${data.user.userInfo.firstName} ${data.user.userInfo.lastName}` : "User info";

	const isValidEmail = regexEmail.test(email);
	const isValidPassword = regexPassword.test(password);

	const [updateUser, { loading: loadingUpdateUser, error: errorUpdateUser }] = useMutation<
		UpdateUserResponse,
		UpdateUserMutationVariables
	>(UpdateUserMutation, {
		refetchQueries: [UsersQuery]
	});

	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
		setIsEmailError(false);
	};

	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
		setIsPasswordError(false);
	};

	const getInputColor = (value: string, isValid: boolean): textFieldColor => {
		return value ? (isValid ? "success" : "warning") : "info";
	};

	const saveChanges = () => {
		if (data && data.user) {
			if (!isValidEmail) {
				setIsEmailError(true);
			} else if (password.length > 0 && !isValidPassword) {
				setIsPasswordError(true);
			} else {
				const { email: queryEmail, userInfo } = data.user;
				const variables: UpdateUserMutationVariables = {
					userId: userId || "",
					firstName,
					lastName,
					email,
					password,
					isAdmin
				};
				if (queryEmail === email) delete variables.email;
				if (password.length === 0) delete variables.password;
				if (userInfo) {
					const { firstName: queryFirstName, lastName: queryLastName, isAdmin: queryIsAdmin } = userInfo;
					if (queryFirstName === firstName) delete variables.firstName;
					if (queryLastName === lastName) delete variables.lastName;
					if (queryIsAdmin === isAdmin) delete variables.isAdmin;
				}
				if (Object.keys(variables).length > 0) {
					updateUser({
						variables
					})
						.then(() => onUserUpdated())
						.catch((error) => {
							console.error(error);
						});
				} else {
					onClose();
				}
			}
		}
	};

	useEffect(() => {
		if (data && data.user) {
			const { email: queryEmail, userInfo } = data.user;
			setEmail(queryEmail);
			if (userInfo) {
				const { firstName: queryFirstName, lastName: queryLastName, isAdmin: queryIsAdmin } = userInfo;
				setFirstName(queryFirstName);
				setLastName(queryLastName);
				setIsAdmin(queryIsAdmin);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	return (
		<BootstrapDialog onClose={onClose} aria-labelledby="customized-dialog-title" open>
			<UserDialogTitle loading={loading} userName={userName} onClose={onClose} />
			{loading ? (
				<DialogContent dividers>
					<Skeleton variant="rectangular" width="100%">
						<div style={{ paddingTop: "57%" }} />
					</Skeleton>
				</DialogContent>
			) : error ? (
				<DialogContent dividers>
					<Alert severity="error">
						<AlertTitle>Error</AlertTitle>
						{error.message}
					</Alert>
				</DialogContent>
			) : (
				<>
					<DialogContent dividers>
						<Grid container rowSpacing={1} columnSpacing={{ xs: 2, sm: 3, md: 4 }}>
							<Grid item xs={6}>
								<TextField
									autoFocus
									margin="dense"
									id="firstName-field"
									label="First Name"
									type="text"
									variant="filled"
									color={getInputColor(firstName, true)}
									value={firstName}
									onChange={(event) => setFirstName(event.target.value)}
									disabled={loading}
									fullWidth
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									margin="dense"
									id="lastName-field"
									label="Last Name"
									type="text"
									variant="filled"
									color={getInputColor(lastName, true)}
									value={lastName}
									onChange={(event) => setLastName(event.target.value)}
									disabled={loading}
									fullWidth
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									margin="dense"
									id="email-field"
									label="Email"
									type="email"
									variant="filled"
									color={getInputColor(email, isValidEmail)}
									helperText={isEmailError ? "Please write a valid email" : ""}
									error={isEmailError}
									value={email}
									onChange={handleEmailChange}
									disabled={loading}
									fullWidth
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									placeholder="********"
									margin="dense"
									id="password-field"
									label="New Password"
									type="password"
									fullWidth
									variant="filled"
									color={getInputColor(password, isValidPassword)}
									helperText={isPasswordError ? "Please write a valid password" : ""}
									error={isPasswordError}
									value={password}
									onChange={handlePasswordChange}
									disabled={loading}
								/>
							</Grid>
							<Grid item xs={6}>
								{isSuper && (
									<FormControlLabel
										control={
											<Switch
												defaultChecked={data?.user.userInfo?.isAdmin}
												onChange={(event) => setIsAdmin(event.target.checked)}
											/>
										}
										label="Is Admin"
									/>
								)}
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						{loadingUpdateUser ? <CircularProgress /> : <Button onClick={saveChanges}>Save changes</Button>}
					</DialogActions>
					{errorUpdateUser && (
						<DialogContent>
							<Alert variant="outlined" severity="error">
								{errorUpdateUser.message}
							</Alert>
						</DialogContent>
					)}
				</>
			)}
		</BootstrapDialog>
	);
};
