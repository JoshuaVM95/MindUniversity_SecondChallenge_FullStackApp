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
import DatePicker from "@mui/lab/DatePicker";
import MuiTextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { useMutation, useQuery } from "@apollo/client";
import {
	UserAccountResponse,
	UserAccountQuery,
	UpdateUserAccountVariables,
	UpdateUserAccountResponse,
	UsersAccountsQuery,
	UpdateUserAccountMutation
} from "../queries";
import { Position } from "../../../types";
import { UserAccountDialogTitle } from "./UserAccountDialogTitle";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	"& .MuiDialogContent-root": {
		padding: theme.spacing(2)
	},
	"& .MuiDialogActions-root": {
		padding: theme.spacing(1)
	}
}));

interface UserAccountEditModalProps {
	userAccountId?: string;
	onClose(): void;
	onAccountUpdated(): void;
}

export const UserAccountEditModal = ({
	userAccountId,
	onClose,
	onAccountUpdated
}: UserAccountEditModalProps): React.ReactElement => {
	const { loading, error, data } = useQuery<UserAccountResponse>(UserAccountQuery, {
		variables: {
			userAccountId
		}
	});

	const [position, setPosition] = useState<Position | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);

	const userName = data
		? `${data.userAccount.user.userInfo.firstName} ${data.userAccount.user.userInfo.lastName}`
		: "";
	const accountName = data ? data.userAccount.account.name : "";

	const [updateUserAccount, { loading: loadingUpdateUserAccount, error: errorUpdateUserAccount }] =
		useMutation<UpdateUserAccountResponse>(UpdateUserAccountMutation, {
			refetchQueries: [UsersAccountsQuery]
		});

	const parseToTimestamp = () => {
		if (endDate) {
			const isoDate = endDate.toISOString();
			const date = isoDate.split("T");
			const time = date[1].split(".");
			return date[0] + " " + time[0];
		}
		return endDate;
	};

	const saveChanges = () => {
		if (data && data.userAccount) {
			const { position: queryPosition } = data.userAccount;
			const variables: UpdateUserAccountVariables = {
				userAccountId: userAccountId || "",
				position: position || undefined,
				endDate: parseToTimestamp() || undefined
			};
			if (queryPosition === position) delete variables.position;
			if (endDate === null) delete variables.endDate;
			if (Object.keys(variables).length > 0) {
				updateUserAccount({
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
		if (data && data.userAccount) {
			const { position: queryPosition, endDate } = data.userAccount;
			setPosition(queryPosition);
			if (endDate) setEndDate(new Date(parseInt(endDate)));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	return (
		<BootstrapDialog onClose={onClose} aria-labelledby="customized-dialog-title" open>
			<UserAccountDialogTitle loading={loading} userName={userName} accountName={accountName} onClose={onClose} />
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
									margin="dense"
									id="name-field"
									label="User Name"
									type="text"
									variant="filled"
									value={userName}
									disabled
									fullWidth
								/>
							</Grid>
							<Grid item xs={6}>
								<TextField
									margin="dense"
									id="account-field"
									label="Account Name"
									type="text"
									variant="filled"
									value={accountName}
									disabled
									fullWidth
								/>
							</Grid>
							<Grid item xs={6}>
								<Autocomplete<Position>
									id="position"
									options={[Position.DEV, Position.QA, Position.PRODUCT, Position.LEAD]}
									value={position}
									onChange={(event: React.SyntheticEvent, newValue: Position | null) => {
										setPosition(newValue);
									}}
									fullWidth
									renderInput={(params) => (
										<TextField {...params} label="Position" variant="filled" />
									)}
								/>
							</Grid>
							<Grid item xs={6}>
								<LocalizationProvider dateAdapter={AdapterDateFns}>
									<DatePicker
										onChange={(newValue: Date | null) => {
											setEndDate(newValue);
										}}
										value={endDate}
										renderInput={(params) => (
											<MuiTextField {...params} label="End Date" variant="filled" fullWidth />
										)}
										disabled={data?.userAccount.endDate !== null}
									/>
								</LocalizationProvider>
							</Grid>
						</Grid>
					</DialogContent>
					<DialogActions>
						{loadingUpdateUserAccount ? (
							<CircularProgress />
						) : (
							<Button onClick={saveChanges}>Save changes</Button>
						)}
					</DialogActions>
					{errorUpdateUserAccount && (
						<DialogContent>
							<Alert variant="outlined" severity="error">
								{errorUpdateUserAccount.message}
							</Alert>
						</DialogContent>
					)}
				</>
			)}
		</BootstrapDialog>
	);
};
