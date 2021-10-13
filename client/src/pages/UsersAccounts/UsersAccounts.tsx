import React, { useState } from "react";
import { Alert, Fab, Divider, Snackbar, Paper } from "@material-ui/core";
import { Link } from "@material-ui/icons";
import { CollapsibleTable } from "../../components/table/table";
import styles from "./UsersAccounts.module.scss";
import { UserAccountListOverview } from "../../types";
import { AddUserAccountModal } from "./AddUserAccountModal";
import { useQuery } from "@apollo/client";
import { UsersAccountsQuery, UsersAccountsResponse } from "./queries";
import { UserAccountEditModal } from "./UserAccountEditModal/UserAccountEditModal";

type UserAccountRow = {
	[key in keyof UserAccountListOverview]: string;
};

export const UsersAccounts = (): React.ReactElement => {
	const [isUserAccountModalOpen, setIsUserAccountModalOpen] = useState<boolean>(false);
	const [showUserAccountEdit, setShowUserAccountEdit] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);
	const [selectedUserAccountId, setSelectedUserAccountId] = useState<string>();
	const [successMessage, setSuccessMessage] = useState<string>();
	const { loading, error, data } = useQuery<UsersAccountsResponse>(UsersAccountsQuery, {
		variables: {
			filterBy: "",
			page: currentPage,
			rowsPerPage
		}
	});

	const mapTableRows = (): UserAccountRow[] => {
		if (data) {
			return data.usersAccounts.usersAccounts.map((userAccount) => {
				const user = `${userAccount.user.userInfo.firstName} ${userAccount.user.userInfo.lastName}`;
				const initDate = new Date(parseInt(userAccount.initDate)).toLocaleDateString();
				const endDate = userAccount.endDate
					? new Date(parseInt(userAccount.endDate)).toLocaleDateString()
					: "-";
				return {
					user,
					account: userAccount.account.name,
					position: userAccount.position,
					initDate,
					endDate
				};
			});
		} else {
			return [];
		}
	};

	return (
		<div className={styles.userAccountsContainer}>
			{isUserAccountModalOpen && (
				<AddUserAccountModal
					isOpen={isUserAccountModalOpen}
					onClose={() => setIsUserAccountModalOpen(false)}
					onUserAccountAdded={() => {
						setSuccessMessage("User added to account");
						setIsUserAccountModalOpen(false);
					}}
				/>
			)}
			{showUserAccountEdit && (
				<UserAccountEditModal
					userAccountId={selectedUserAccountId}
					onClose={() => {
						setShowUserAccountEdit(false);
						setSelectedUserAccountId(undefined);
					}}
					onAccountUpdated={() => {
						setSuccessMessage("Account updated");
						setShowUserAccountEdit(false);
						setSelectedUserAccountId(undefined);
					}}
				/>
			)}
			<Paper elevation={3}>
				<div className={styles.userAccountsHeader}>
					<h1 className={styles.userAccountsTitle}>Users Accounts History</h1>
					<Fab
						className={styles.addUserAccountBtn}
						color="primary"
						variant="extended"
						onClick={() => setIsUserAccountModalOpen(true)}
					>
						<Link sx={{ mr: 1 }} />
						Add user to an account
					</Fab>
				</div>
			</Paper>
			<Divider />
			<CollapsibleTable<UserAccountRow>
				headers={["User", "Account", "Position", "Initial Date", "End Date"]}
				rows={mapTableRows()}
				totalRows={data?.usersAccounts.totalUsersAccounts || 0}
				onPageChange={(newPage) => {
					setSelectedUserAccountId(undefined);
					setCurrentPage(newPage);
				}}
				onRowsPerPageChange={setRowsPerPage}
				loading={loading}
				error={error?.message}
				onRowEdit={(index) => {
					const userAccountId = data ? data.usersAccounts.usersAccounts[index].id : undefined;
					setSelectedUserAccountId(userAccountId);
					setShowUserAccountEdit(true);
				}}
				canSelectRows={false}
				onRowInfo={() => console.log("show info")}
			/>
			<Snackbar
				open={successMessage !== undefined}
				autoHideDuration={6000}
				onClose={() => setSuccessMessage(undefined)}
			>
				<Alert onClose={() => setSuccessMessage(undefined)} severity="success" sx={{ width: "100%" }}>
					{successMessage}
				</Alert>
			</Snackbar>
		</div>
	);
};
