import React, { useState } from "react";
import styles from "./Login.module.scss";
import { Button, TextField, CircularProgress, InputAdornment, IconButton } from "@material-ui/core";
import { VpnKey, Visibility, VisibilityOff } from "@material-ui/icons";
import { useMutation } from "@apollo/client";
import { LoginMutation, LoginResponse } from "./queries";
import { RouteChildrenProps } from "react-router-dom";
import { ApolloErrors, Role, Routes } from "../../types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { setCurrentUser } from "../../store/currentUser/actions";

type textFieldColor = "primary" | "secondary" | "error" | "info" | "success" | "warning";
type buttonColor = "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";

export const Login = ({ history }: RouteChildrenProps): React.ReactElement => {
	const [userEmail, setUserEmail] = useState<string>("");
	const [isEmailError, setIsEmailError] = useState<boolean>(false);
	const [userPassword, setUserPassword] = useState<string>("");
	const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [login, { data, loading, error }] = useMutation<LoginResponse>(LoginMutation);
	const dispatch: AppDispatch = useDispatch();

	const textFieldWidth = 300;

	const regexEmial =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	const isValidEmail = regexEmial.test(userEmail);

	const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
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
						const { token, firstName, lastName, role } = data.login;
						dispatch(
							setCurrentUser({
								jwt: token,
								firstName,
								lastName,
								role
							})
						);
						const hasPermission = role === Role.SUPER || role === Role.ADMIN;
						history.push(hasPermission ? Routes.USERS : Routes.PROFILE);
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
