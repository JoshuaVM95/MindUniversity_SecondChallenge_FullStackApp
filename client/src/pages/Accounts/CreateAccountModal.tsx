import React, { useState } from "react";
import {
	Alert,
	Autocomplete,
	Button,
	CircularProgress,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from "@material-ui/core";
import { useMutation, useQuery } from "@apollo/client";
import {
	CreateAccountMutation,
	CreateAccountResponse,
	AccountsQuery,
	UsersQuery,
	UsersResponse,
	UserOption
} from "./queries";
import { textFieldColor } from "../../types";
import { UsersAccountsQuery } from "../UsersAccounts/queries";

interface CreateAccountModalProps {
	isOpen: boolean;
	onClose(): void;
	onAccountAdded(): void;
}

export const CreateAccountModal = ({
	isOpen,
	onClose,
	onAccountAdded
}: CreateAccountModalProps): React.ReactElement => {
	const [name, setName] = useState<string>("");
	const [client, setClient] = useState<string>("");
	const [lead, setLead] = useState<UserOption | null>(null);

	const { data: usersQuery } = useQuery<UsersResponse>(UsersQuery, {
		variables: {
			filterByEmail: "",
			page: 0,
			rowsPerPage: 200
		}
	});

	const [createAccount, { loading, error }] = useMutation<CreateAccountResponse>(CreateAccountMutation, {
		refetchQueries: [AccountsQuery, UsersAccountsQuery, UsersQuery]
	});

	const disableAddAccount = name.length === 0 || client.length === 0 || lead === null;

	const getInputColor = (value: string): textFieldColor => {
		return value ? "success" : "info";
	};

	const addAcount = () => {
		createAccount({
			variables: {
				name,
				client,
				lead: lead?.id
			}
		})
			.then(() => {
				onAccountAdded();
				setName("");
				setClient("");
				setLead(null);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<div>
			<Dialog open={isOpen} onClose={onClose}>
				<DialogTitle>Create Account</DialogTitle>
				<DialogContent>
					<DialogContentText>Please fill all fields to create a new account</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="name-field"
						label="Account Name"
						type="text"
						fullWidth
						variant="standard"
						color={getInputColor(name)}
						value={name}
						onChange={(event) => setName(event.target.value)}
						disabled={loading}
						required
					/>
					<TextField
						margin="dense"
						id="client-field"
						label="Client Name"
						type="text"
						fullWidth
						variant="standard"
						color={getInputColor(client)}
						value={client}
						onChange={(event) => setClient(event.target.value)}
						disabled={loading}
						required
					/>
					<Autocomplete<UserOption>
						id="account-lead"
						options={usersQuery?.users.users.filter((user) => !user.isSuper) || []}
						getOptionLabel={(option) => `${option.userInfo.firstName} ${option.userInfo.lastName}`}
						value={lead}
						onChange={(event: React.SyntheticEvent, newValue: UserOption | null) => {
							setLead(newValue);
						}}
						fullWidth
						renderInput={(params) => <TextField {...params} label="Lead" variant="standard" />}
					/>
					{error && (
						<Alert variant="outlined" severity="error">
							{error.message.includes("Duplicate entry") ? "Account already exists" : error.message}
						</Alert>
					)}
				</DialogContent>
				<DialogActions>
					{loading ? (
						<CircularProgress />
					) : (
						<>
							<Button onClick={onClose}>Cancel</Button>
							<Button onClick={addAcount} disabled={disableAddAccount}>
								Add account
							</Button>
						</>
					)}
				</DialogActions>
			</Dialog>
		</div>
	);
};
