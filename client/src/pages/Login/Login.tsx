import React, { useState } from "react";
import styles from "./Login.module.scss";
import { Button, TextField, CircularProgress, InputAdornment, IconButton } from "@mui/material";
import { VpnKey, Visibility, VisibilityOff } from "@mui/icons-material";
import { useMutation } from "@apollo/client";
import { LoginMutation, LoginResponse } from "./queries";
import { useNavigate } from "react-router-dom";
import { ApolloErrors, buttonColor, textFieldColor, Paths } from "../../types";
import { useDispatch } from "react-redux";
import { AppDispatch, persistor } from "../../store/store";
import { setCurrentUser } from "../../store/currentUser/actions";
import { regexEmail, regexPassword } from "../../utilities";
import { LoginMutationVariables, Role } from "@mindu-second-challenge/apollo-server-types";

export const Login = (): React.ReactElement => {
	const [userEmail, setUserEmail] = useState<string>("");
	const [isEmailError, setIsEmailError] = useState<boolean>(false);
	const [userPassword, setUserPassword] = useState<string>("");
	const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [login, { loading, error }] = useMutation<LoginResponse, LoginMutationVariables>(LoginMutation);
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();

	const textFieldWidth = 300;

	const isValidEmail = regexEmail.test(userEmail);
	const isValidPassword = regexPassword.test(userPassword);

	const hasInputError = (includes: string) => {
		return error?.graphQLErrors.some((err) => {
			const isUserInputError = err.extensions?.code === ApolloErrors.BAD_USER_INPUT;
			const isWrongEmail = err.message.includes(includes);
			return isUserInputError && isWrongEmail;
		});
	};

	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserEmail(event.target.value);
		setIsEmailError(false);
	};
	const getEmailInputColor = (): textFieldColor => {
		const hasEmailError = hasInputError("email");
		return userEmail
			? isValidEmail && !hasEmailError
				? "success"
				: isEmailError || hasEmailError
				? "error"
				: "warning"
			: "info";
	};

	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserPassword(event.target.value);
		setIsPasswordError(false);
	};
	const getPasswordInputColor = (): textFieldColor => {
		const hasPasswordError = hasInputError("password");
		return userPassword
			? isValidPassword && !hasPasswordError
				? "success"
				: isPasswordError || hasPasswordError
				? "error"
				: "warning"
			: "info";
	};

	const getBtnColor = (): buttonColor => {
		return userEmail && userPassword ? (isValidEmail && isValidPassword ? "success" : "warning") : "inherit";
	};

	const loginUser = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!isValidEmail) {
			setIsEmailError(true);
		} else if (!isValidPassword) {
			setIsPasswordError(true);
		} else {
			login({
				variables: {
					email: userEmail,
					password: userPassword
				}
			})
				.then((response) => {
					const data = response.data;
					if (data) {
						const token = data.login;
						const payload = token.split(".")[1];
						const currentUser = JSON.parse(window.atob(payload));
						const role = currentUser.role;
						dispatch(
							setCurrentUser({
								jwt: token,
								exp: currentUser.exp,
								userId: currentUser.userId,
								firstName: currentUser.firstName,
								lastName: currentUser.lastName,
								role
							})
						);
						persistor.flush().then(() => {
							const hasPermission = role === Role.SUPER || role === Role.ADMIN;
							navigate(hasPermission ? Paths.USERS : Paths.PROFILE);
						});
					}
				})
				.catch((err) => {
					console.error("Login error: ", err);
				});
		}
	};

	return (
		<div className={styles.loginContainer}>
			<form className={styles.formContainer} onSubmit={loginUser}>
				<h1 className={styles.loginTitle}>Login</h1>
				<TextField
					id="email-field"
					label="Email"
					variant="filled"
					sx={{ width: textFieldWidth }}
					color={getEmailInputColor()}
					helperText={isEmailError ? "Please write a valid email" : ""}
					error={isEmailError}
					value={userEmail}
					onChange={handleEmailChange}
					disabled={loading}
					required
				/>
				<TextField
					id="password-field"
					label="Password"
					variant="filled"
					type={showPassword ? "text" : "password"}
					sx={{ width: textFieldWidth }}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={() => setShowPassword(!showPassword)}
									onMouseDown={() => setShowPassword(!showPassword)}
									edge="end"
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						)
					}}
					color={getPasswordInputColor()}
					helperText={isPasswordError ? "Please write a valid password" : ""}
					error={isPasswordError}
					value={userPassword}
					onChange={handlePasswordChange}
					disabled={loading}
					required
				/>
				{error && <p className={styles.errorMessage}>{error.message}</p>}
				<div className={styles.buttonContainer}>
					<Button
						type="submit"
						variant="outlined"
						size="large"
						color={getBtnColor()}
						endIcon={<VpnKey />}
						disabled={!userEmail || !userPassword || loading}
					>
						Login
					</Button>
					{loading && (
						<CircularProgress
							size={40}
							sx={{
								color: "#2e7d32",
								position: "absolute",
								top: "5%",
								left: "35%"
							}}
						/>
					)}
				</div>
			</form>
		</div>
	);
};
