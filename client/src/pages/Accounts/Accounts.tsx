import React, { useState } from "react";
import { Alert, Fab, Divider, Snackbar, Paper } from "@material-ui/core";
import { AddCircle } from "@material-ui/icons";
import { CollapsibleTable } from "../../components/table/table";
import styles from "./Accounts.module.scss";
import { AccountOverview, AccountUserOverview } from "../../types";
import { CreateAccountModal } from "./CreateAccountModal";
import { useMutation, useQuery } from "@apollo/client";
import { DeleteAccountsResponse, DeleteAccountsMutation, AccountsQuery, AccountsResponse } from "./queries";
import { AccountEditModal } from "./AccountEditModal/AccountEditModal";

type AccountUserOverviewSignature = {
	[key in keyof AccountUserOverview]: string;
};

type AccountRow = {
	[key in keyof AccountOverview]: string;
} & {
	collapsableTableData?: AccountUserOverviewSignature[];
};

export const Accounts = (): React.ReactElement => {
	const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
	const [showAccountEdit, setShowAccountEdit] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);
	const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
	const [selectedAccountId, setSelectedAccountId] = useState<string>();
	const [successMessage, setSuccessMessage] = useState<string>();
	const [deleteError, setDeleteError] = useState<string>();
	const { loading, error, data } = useQuery<AccountsResponse>(AccountsQuery, {
		variables: {
			filterByName: "",
			page: currentPage,
			rowsPerPage
		}
	});
	const [deleteAccounts] = useMutation<DeleteAccountsResponse>(DeleteAccountsMutation, {
		refetchQueries: [AccountsQuery]
	});

	const mapTableRows = (): AccountRow[] => {
		if (data) {
			return data.accounts.accounts.map((account) => {
				const lead = `${account.lead.userInfo.firstName} ${account.lead.userInfo.lastName}`;
				const createdBy = `${account.createdBy.userInfo?.firstName || "-"} ${
					account.createdBy.userInfo?.lastName || "-"
				}`;
				const createdAt = new Date(parseInt(account.createdAt));
				const collapsableTableData = account.latestUsers.map((latestUser) => {
					const initDate = new Date(parseInt(latestUser.initDate)).toLocaleDateString();
					const endDate = latestUser.endDate
						? new Date(parseInt(latestUser.endDate)).toLocaleDateString()
						: "-";
					return {
						name: `${latestUser.user.userInfo.firstName} ${latestUser.user.userInfo.lastName}`,
						position: latestUser.position,
						initDate,
						endDate
					};
				});
				return {
					name: account.name,
					client: account.client,
					lead,
					createdBy,
					createdAt: createdAt.toLocaleDateString(),
					collapsableTableData
				};
			});
		} else {
			return [];
		}
	};

	const updateSelectedAccounts = (isSelected: boolean, index: number) => {
		if (data) {
			const accountId = data.accounts.accounts[index].id;
			if (isSelected) {
				setSelectedAccounts([...selectedAccounts, accountId]);
			} else {
				const accountIdIndex = selectedAccounts.findIndex((id) => id == accountId);
				const newList = [...selectedAccounts];
				newList.splice(accountIdIndex, 1);
				setSelectedAccounts(newList);
			}
		}
	};

	const handleDeleteAccounts = () => {
		deleteAccounts({
			variables: {
				accountIds: selectedAccounts
			}
		})
			.then(() => {
				setSuccessMessage("Accounts deleted");
				setSelectedAccounts([]);
			})
			.catch((error) => {
				console.error(error.message);
				setDeleteError(error.message);
			});
	};

	return (
		<div className={styles.accountsContainer}>
			{isAccountModalOpen && (
				<CreateAccountModal
					isOpen={isAccountModalOpen}
					onClose={() => setIsAccountModalOpen(false)}
					onAccountAdded={() => {
						setSuccessMessage("Account created");
						setIsAccountModalOpen(false);
					}}
				/>
			)}
			{showAccountEdit && (
				<AccountEditModal
					accountId={selectedAccountId}
					onClose={() => {
						setShowAccountEdit(false);
						setSelectedAccountId(undefined);
					}}
					onAccountUpdated={() => {
						setSuccessMessage("Account updated");
						setShowAccountEdit(false);
						setSelectedAccountId(undefined);
					}}
				/>
			)}
			<Paper elevation={3}>
				<div className={styles.accountsHeader}>
					<h1 className={styles.accountsTitle}>Accounts</h1>
					<Fab
						className={styles.addAccountBtn}
						color="primary"
						variant="extended"
						onClick={() => setIsAccountModalOpen(true)}
					>
						<AddCircle sx={{ mr: 1 }} />
						Add account
					</Fab>
				</div>
			</Paper>
			<Divider />
			<CollapsibleTable<AccountRow>
				headers={["Name", "Client", "Lead", "Created By", "Created At"]}
				rows={mapTableRows()}
				totalRows={data?.accounts.totalAccounts || 0}
				rowCollapsableTableTitle="Latest user enters"
				rowcollapsableTableHeaders={["User Name", "Position", "Init Date", "End Date"]}
				onPageChange={(newPage) => {
					setSelectedAccountId(undefined);
					setSelectedAccounts([]);
					setCurrentPage(newPage);
				}}
				onRowsPerPageChange={setRowsPerPage}
				loading={loading}
				error={error?.message}
				onRowSelected={updateSelectedAccounts}
				hasSelectedRows={selectedAccounts.length > 0}
				onDelete={handleDeleteAccounts}
				onRowEdit={(index) => {
					const accountId = data ? data.accounts.accounts[index].id : undefined;
					setSelectedAccountId(accountId);
					setShowAccountEdit(true);
				}}
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
			<Snackbar
				open={deleteError !== undefined}
				autoHideDuration={6000}
				onClose={() => setDeleteError(undefined)}
			>
				<Alert onClose={() => setDeleteError(undefined)} severity="error" sx={{ width: "100%" }}>
					{deleteError}
				</Alert>
			</Snackbar>
		</div>
	);
};
