import React, { useState } from "react";
import {
	Alert,
	Button,
	CircularProgress,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControlLabel,
	Switch
} from "@material-ui/core";
import { useMutation } from "@apollo/client";
import { CreateUserMutation, CreateUserResponse, UsersQuery } from "./queries";
import { Role, textFieldColor } from "../../types";
import { regexEmail, regexPassword } from "../../utilities";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface CreateUserModalProps {
	isOpen: boolean;
	onClose(): void;
	onUserAdded(): void;
}

export const CreateUserModal = ({ isOpen, onClose, onUserAdded }: CreateUserModalProps): React.ReactElement => {
	const currentUser = useSelector((state: RootState) => state.currentUser);
	const isSuper = currentUser.role === Role.SUPER;

	const [email, setEmail] = useState<string>("");
	const [isEmailError, setIsEmailError] = useState<boolean>(false);

	const [password, setPassword] = useState<string>("");
	const [isPasswordError, setIsPasswordError] = useState<boolean>(false);

	const [firstName, setFirstName] = useState<string>("");
	const [isFirstNameError, setIsFirstNameError] = useState<boolean>(false);

	const [lastName, setLastName] = useState<string>("");
	const [isLastNameError, setIsLastNameError] = useState<boolean>(false);

	const [isAdmin, setIsAdmin] = useState<boolean>(false);

	const [createUser, { data, loading, error }] = useMutation<CreateUserResponse>(CreateUserMutation, {
		refetchQueries: [UsersQuery, "users"]
	});

	const isValidEmail = regexEmail.test(email);
	const isValidPassword = regexPassword.test(password);
	const disableAddUser =
		email.length === 0 || password.length === 0 || firstName.length === 0 || lastName.length === 0;

	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
		setIsEmailError(false);
	};

	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
		setIsPasswordError(false);
	};

	const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFirstName(event.target.value);
		setIsFirstNameError(false);
	};

	const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLastName(event.target.value);
		setIsLastNameError(false);
	};

	const getInputColor = (value: string, isValid: boolean): textFieldColor => {
		return value ? (isValid ? "success" : "warning") : "info";
	};

	const addUser = () => {
		if (!isValidEmail) {
			setIsEmailError(true);
		} else if (!isValidPassword) {
			setIsPasswordError(true);
		} else {
			createUser({
				variables: {
					email,
					password,
					firstName,
					lastName,
					isAdmin
				}
			})
				.then(() => {
					onUserAdded();
					setEmail("");
					setPassword("");
					setFirstName("");
					setLastName("");
					setIsAdmin(false);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	};

	return (
		<div>
			<Dialog open={isOpen} onClose={onClose}>
				<DialogTitle>Create User</DialogTitle>
				<DialogContent>
					<DialogContentText>Please fill all fields to create a new user</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="email-field"
						label="Email"
						type="email"
						fullWidth
						variant="standard"
						color={getInputColor(email, isValidEmail)}
						helperText={isEmailError ? "Please write a valid email" : ""}
						error={isEmailError}
						value={email}
						onChange={handleEmailChange}
						disabled={loading}
						required
					/>
					<TextField
						margin="dense"
						id="password-field"
						label="Password"
						type="password"
						fullWidth
						variant="standard"
						color={getInputColor(password, isValidPassword)}
						helperText={isPasswordError ? "Please write a valid password" : ""}
						error={isPasswordError}
						value={password}
						onChange={handlePasswordChange}
						disabled={loading}
						required
					/>
					<TextField
						autoFocus
						margin="dense"
						id="firstName-field"
						label="First Name"
						type="text"
						fullWidth
						variant="standard"
						color={getInputColor(firstName, true)}
						helperText={isFirstNameError ? "Please fill this field" : ""}
						error={isFirstNameError}
						value={firstName}
						onChange={handleFirstNameChange}
						disabled={loading}
						required
					/>
					<TextField
						autoFocus
						margin="dense"
						id="lastName-field"
						label="Last Name"
						type="text"
						fullWidth
						variant="standard"
						color={getInputColor(lastName, true)}
						helperText={isLastNameError ? "Please fill this field" : ""}
						error={isLastNameError}
						value={lastName}
						onChange={handleLastNameChange}
						disabled={loading}
						required
					/>
					{isSuper && (
						<FormControlLabel
							control={<Switch onChange={(event) => setIsAdmin(event.target.checked)} />}
							label="Is Admin"
						/>
					)}
					{error && (
						<Alert variant="outlined" severity="error">
							{error.message.includes("Duplicate entry") ? "User already exists" : error.message}
						</Alert>
					)}
				</DialogContent>
				<DialogActions>
					{loading ? (
						<CircularProgress />
					) : (
						<>
							<Button onClick={onClose}>Cancel</Button>
							<Button onClick={addUser} disabled={disableAddUser}>
								Add user
							</Button>
						</>
					)}
				</DialogActions>
			</Dialog>
		</div>
	);
};
