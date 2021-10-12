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
} from "@material-ui/core";
import { useMutation, useQuery } from "@apollo/client";
import {
	AccountResponse,
	AccountQuery,
	UpdateAccountVariables,
	UpdateAccountResponse,
	AccountsQuery,
	UpdateAccountMutation,
	UsersResponse,
	UsersQuery,
	UserOption
} from "../queries";
import { textFieldColor } from "../../../types";
import { AccountDialogTitle } from "./AccountDialogTitle";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	"& .MuiDialogContent-root": {
		padding: theme.spacing(2)
	},
	"& .MuiDialogActions-root": {
		padding: theme.spacing(1)
	}
}));

interface AccountInfoModalProps {
	accountId?: string;
	onClose(): void;
	onAccountUpdated(): void;
}

export const AccountInfoModal = ({
	accountId,
	onClose,
	onAccountUpdated
}: AccountInfoModalProps): React.ReactElement => {
	const { loading, error, data } = useQuery<AccountResponse>(AccountQuery, {
		variables: {
			accountId
		}
	});
	const { data: usersQuery } = useQuery<UsersResponse>(UsersQuery, {
		variables: {
			filterByEmail: "",
			page: 0,
			rowsPerPage: 200
		}
	});

	const [name, setName] = useState<string>("");
	const [client, setClient] = useState<string>("");
	const [lead, setLead] = useState<UserOption | null>(null);

	const accountName = data ? data.account.name : "";

	const [updateAccount, { loading: loadingUpdateAccount, error: errorUpdateAccount }] =
		useMutation<UpdateAccountResponse>(UpdateAccountMutation, {
			refetchQueries: [AccountsQuery, "accounts"]
		});

	const getInputColor = (value: string): textFieldColor => {
		return value ? "success" : "info";
	};

	const saveChanges = () => {
		if (data && data.account) {
			const { name: queryName, client: queryClient, lead: queryLead } = data.account;
			const variables: UpdateAccountVariables = {
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
			setLead(queryLead as UserOption);
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
								<Autocomplete<UserOption>
									id="account-lead"
									options={usersQuery?.users.users.filter((user) => !user.isSuper) || []}
									getOptionLabel={(option) =>
										`${option.userInfo.firstName} ${option.userInfo.lastName}`
									}
									value={lead}
									onChange={(event: React.SyntheticEvent, newValue: UserOption | null) => {
										setLead(newValue);
									}}
									sx={{ width: 300 }}
									renderInput={(params) => <TextField {...params} label="Lead" variant="standard" />}
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
