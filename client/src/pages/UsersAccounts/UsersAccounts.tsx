import React, { useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import { Link } from "@mui/icons-material";
import { CollapsibleTable, ListHeader } from "../../components";
import styles from "./UsersAccounts.module.scss";
import { UserAccountListOverview } from "../../types";
import { AddUserAccountModal } from "./AddUserAccountModal";
import { useQuery } from "@apollo/client";
import { UsersAccountsQuery, UsersAccountsResponse } from "./queries";
import { UserAccountEditModal } from "./UserAccountEditModal/UserAccountEditModal";
import { FilterModal } from "./FilterModal";
import { UserAccountFilters, UsersAccountsQueryVariables } from "@mindu-second-challenge/apollo-server-types";

type UserAccountRow = {
	[key in keyof UserAccountListOverview]: string;
};

export const UsersAccounts = (): React.ReactElement => {
	const [isUserAccountModalOpen, setIsUserAccountModalOpen] = useState<boolean>(false);
	const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
	const [showUserAccountEdit, setShowUserAccountEdit] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);
	const [selectedUserAccountId, setSelectedUserAccountId] = useState<string>();
	const [successMessage, setSuccessMessage] = useState<string>();
	const [filterBy, setFilterBy] = useState<UserAccountFilters>({});
	const { loading, error, data } = useQuery<UsersAccountsResponse, UsersAccountsQueryVariables>(UsersAccountsQuery, {
		variables: {
			filterBy,
			page: currentPage,
			rowsPerPage
		},
		fetchPolicy: "no-cache"
	});

	const mapTableRows = (): UserAccountRow[] => {
		if (data) {
			return data.usersAccounts.usersAccounts.map((userAccount) => {
				const user = `${userAccount.user.userInfo?.firstName || "-"} ${
					userAccount.user.userInfo?.lastName || "-"
				}`;
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
					userAccountId={selectedUserAccountId || ""}
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
			<FilterModal
				isOpen={isFilterModalOpen}
				onClose={() => setIsFilterModalOpen(false)}
				currentFilters={filterBy}
				onFilter={(newFilters) => {
					setFilterBy(newFilters);
					setIsFilterModalOpen(false);
				}}
			/>
			<ListHeader
				title="Users Accounts History"
				addIcon={<Link sx={{ color: "inherit", fontSize: "inherit" }} />}
				addTooltipTitle="Add user to an account"
				onAdd={() => setIsUserAccountModalOpen(true)}
				onOpenFilters={() => setIsFilterModalOpen(true)}
				activeFiltersCount={Object.values(filterBy).reduce((previousValue, currentValue) => {
					if (currentValue) return (previousValue += 1);
					else return previousValue;
				}, 0)}
			/>
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
				hasSelectableRows={false}
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
