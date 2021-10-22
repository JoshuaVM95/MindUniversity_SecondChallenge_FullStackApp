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
	AddUserAccountMutation,
	AddUserAccountResponse,
	UsersResponse,
	UsersQuery,
	AccountsResponse,
	AccountsQuery
} from "./queries";
import {
	AddUserAccountMutationVariables,
	Account,
	AccountsQueryVariables,
	User,
	Position,
	UsersQueryVariables
} from "@mindu-second-challenge/apollo-server-types";

interface AddUserAccountProps {
	isOpen: boolean;
	onClose(): void;
	onUserAccountAdded(): void;
}

export const AddUserAccountModal = ({
	isOpen,
	onClose,
	onUserAccountAdded
}: AddUserAccountProps): React.ReactElement => {
	const [account, setAccount] = useState<Account | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [position, setPosition] = useState<Position | null>(null);

	const { data: usersQuery, loading: usersLoading } = useQuery<UsersResponse, UsersQueryVariables>(UsersQuery, {
		variables: {
			filterByEmail: "",
			page: 0
		}
	});

	const { data: accountsQuery, loading: accountsLoading } = useQuery<AccountsResponse, AccountsQueryVariables>(
		AccountsQuery,
		{
			variables: {
				filterByName: "",
				page: 0
			}
		}
	);

	const [addUserAccount, { loading, error }] = useMutation<AddUserAccountResponse, AddUserAccountMutationVariables>(
		AddUserAccountMutation,
		{
			refetchQueries: ["usersAccounts", "accounts", "users"]
		}
	);

	const disableAddUserAccount = account === null || user === null || position === null;

	const addUserAccountRelation = () => {
		addUserAccount({
			variables: {
				accountId: account?.id || "",
				userId: user?.id || "",
				position: position || ""
			}
		})
			.then(() => {
				onUserAccountAdded();
				setAccount(null);
				setUser(null);
				setPosition(null);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	return (
		<div>
			<Dialog open={isOpen} onClose={onClose}>
				<DialogTitle>Add User to an Account</DialogTitle>
				<DialogContent>
					<DialogContentText>Please fill all fields to add a user to a specific account</DialogContentText>
					<Autocomplete<Account>
						id="account"
						options={accountsQuery?.accounts.accounts || []}
						getOptionLabel={(option) => option.name}
						value={account}
						onChange={(event: React.SyntheticEvent, newValue: Account | null) => {
							setAccount(newValue);
						}}
						fullWidth
						renderInput={(params) => <TextField {...params} label="Account" variant="standard" />}
						sx={{ marginBottom: 2 }}
						loading={accountsLoading}
					/>
					<Autocomplete<User>
						id="user"
						options={usersQuery?.users.users.filter((user) => !user.isSuper) || []}
						getOptionLabel={(option) =>
							`${option.userInfo?.firstName || "-"} ${option.userInfo?.lastName || "-"}`
						}
						value={user}
						onChange={(event: React.SyntheticEvent, newValue: User | null) => {
							setUser(newValue);
						}}
						fullWidth
						renderInput={(params) => <TextField {...params} label="User" variant="standard" />}
						sx={{ marginBottom: 2 }}
						loading={usersLoading}
					/>
					<Autocomplete<Position>
						id="position"
						options={[Position.DEV, Position.QA, Position.PRODUCT, Position.LEAD]}
						value={position}
						onChange={(event: React.SyntheticEvent, newValue: Position | null) => {
							setPosition(newValue);
						}}
						fullWidth
						renderInput={(params) => <TextField {...params} label="Position" variant="standard" />}
						sx={{ marginBottom: 2 }}
					/>
					{error && (
						<Alert variant="outlined" severity="error">
							{error.message}
						</Alert>
					)}
				</DialogContent>
				<DialogActions>
					{loading ? (
						<CircularProgress />
					) : (
						<>
							<Button onClick={onClose}>Cancel</Button>
							<Button onClick={addUserAccountRelation} disabled={disableAddUserAccount}>
								Add user to account
							</Button>
						</>
					)}
				</DialogActions>
			</Dialog>
		</div>
	);
};
