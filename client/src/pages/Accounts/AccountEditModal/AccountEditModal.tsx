import React, { useEffect, useState } from "react";
import {
	Alert,
	AlertTitle,
	Autocomplete,
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogActions,
	Grid,
	TextField,
	Skeleton,
	styled
} from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";
import {
	AccountResponse,
	AccountQuery,
	UpdateAccountResponse,
	AccountsQuery,
	UpdateAccountMutation,
	UsersResponse,
	UsersQuery
} from "../queries";
import { textFieldColor } from "../../../types";
import { AccountDialogTitle } from "./AccountDialogTitle";
import { UpdateAccountMutationVariables, UsersQueryVariables, User } from "@mindu-second-challenge/apollo-server-types";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	"& .MuiDialogContent-root": {
		padding: theme.spacing(2)
	},
	"& .MuiDialogActions-root": {
		padding: theme.spacing(1)
	}
}));

interface AccountEditModalProps {
	accountId?: string;
	onClose(): void;
	onAccountUpdated(): void;
}

export const AccountEditModal = ({
	accountId,
	onClose,
	onAccountUpdated
}: AccountEditModalProps): React.ReactElement => {
	const { loading, error, data } = useQuery<AccountResponse>(AccountQuery, {
		variables: {
			accountId
		}
	});
	const { data: usersQuery } = useQuery<UsersResponse, UsersQueryVariables>(UsersQuery, {
		variables: {
			filterByEmail: "",
			page: 0,
			rowsPerPage: 200
		}
	});

	const [name, setName] = useState<string>("");
	const [client, setClient] = useState<string>("");
	const [lead, setLead] = useState<User | null>(null);

	const accountName = data ? data.account.name : "";

	const [updateAccount, { loading: loadingUpdateAccount, error: errorUpdateAccount }] = useMutation<
		UpdateAccountResponse,
		UpdateAccountMutationVariables
	>(UpdateAccountMutation, {
		refetchQueries: [AccountsQuery]
	});

	const getInputColor = (value: string): textFieldColor => {
		return value ? "success" : "info";
	};

	const saveChanges = () => {
		if (data && data.account) {
			const { name: queryName, client: queryClient, lead: queryLead } = data.account;
			const variables: UpdateAccountMutationVariables = {
				accountId: accountId || "",
				name,
				client,
				lead: lead?.id
			};
			if (queryName === name) delete variables.name;
			if (queryClient === client) delete variables.client;
			if (queryLead.id === lead?.id) delete variables.lead;
			if (Object.keys(variables).length > 0) {
				updateAccount({
					variables
				})
					.then(() => onAccountUpdated())
					.catch((error) => {
						console.error(error);
					});
			} else {
				onClose();
			}
		}
	};

	useEffect(() => {
		if (data && data.account) {
			const { name: queryName, client: queryClient, lead: queryLead } = data.account;
			setName(queryName);
			setClient(queryClient);
			setLead(queryLead);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	return (
		<BootstrapDialog onClose={onClose} aria-labelledby="customized-dialog-title" open>
			<AccountDialogTitle loading={loading} accountName={accountName} onClose={onClose} />
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
									id="name-field"
									label="Account Name"
									type="text"
									variant="filled"
									color={getInputColor(name)}
									value={name}
									onChange={(event) => setName(event.target.value)}
									disabled={loading}
									fullWidth
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									margin="dense"
									id="client-field"
									label="Client Name"
									type="text"
									variant="filled"
									color={getInputColor(client)}
									value={client}
									onChange={(event) => setClient(event.target.value)}
									disabled={loading}
									fullWidth
								/>
							</Grid>
							<Grid item xs={6}>
								<Autocomplete<User>
									id="account-lead"
									options={usersQuery?.users.users.filter((user) => !user.isSuper) || []}
									getOptionLabel={(option) =>
										`${option.userInfo?.firstName || "-"} ${option.userInfo?.lastName || "-"}`
									}
									value={lead}
									onChange={(event: React.SyntheticEvent, newValue: User | null) => {
										setLead(newValue);
									}}
									fullWidth
									renderInput={(params) => <TextField {...params} label="Lead" variant="filled" />}
								/>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						{loadingUpdateAccount ? (
							<CircularProgress />
						) : (
							<Button onClick={saveChanges}>Save changes</Button>
						)}
					</DialogActions>
					{errorUpdateAccount && (
						<DialogContent>
							<Alert variant="outlined" severity="error">
								{errorUpdateAccount.message}
							</Alert>
						</DialogContent>
					)}
				</>
			)}
		</BootstrapDialog>
	);
};
