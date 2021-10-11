import React, { useState } from "react";
import { Alert, Fab, Divider, Snackbar, Paper } from "@material-ui/core";
import { PersonAdd } from "@material-ui/icons";
import { CollapsibleTable } from "../../components/table/table";
import styles from "./Users.module.scss";
import { UserOverview, UserAccountOverview } from "../../types";
import { getUserRole } from "../../utilities";
import { CreateUserModal } from "./CreateUserModal";
import { useMutation, useQuery } from "@apollo/client";
import { DeleteUsersMutation, DeleteUsersResponse, UsersQuery, UsersResponse } from "./queries";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { UserInfoModal } from "./UserInfoModal/UserInfoModal";

type UserAccountOverviewSignature = {
	[key in keyof UserAccountOverview]: string;
};

type UserRow = {
	[key in keyof UserOverview]: string;
} & {
	collapsableTableData?: UserAccountOverviewSignature[];
};

export const Users = (): React.ReactElement => {
	const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
	const [showUserInfo, setShowUserInfo] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const [selectedUserId, setSelectedUserId] = useState<string>();
	const [successMessage, setSuccessMessage] = useState<string>();
	const [warningMessage, setWarningMesage] = useState<string>();
	const [deleteError, setDeleteError] = useState<string>();
	const { loading, error, data } = useQuery<UsersResponse>(UsersQuery, {
		variables: {
			filterByEmail: "",
			page: currentPage,
			rowsPerPage
		}
	});
	const [deleteUsers] = useMutation<DeleteUsersResponse>(DeleteUsersMutation, {
		refetchQueries: [UsersQuery, "users"]
	});
	const currentUser = useSelector((state: RootState) => state.currentUser);

	const mapTableRows = (): UserRow[] => {
		if (data) {
			return data.users.users.map((user) => {
				const name = user.userInfo ? `${user.userInfo.firstName} ${user.userInfo.lastName}` : "";
				const createdBy =
					user.userInfo && user.userInfo.createdBy.userInfo
						? `${user.userInfo.createdBy.userInfo.firstName} ${user.userInfo.createdBy.userInfo.lastName}`
						: "";
				const role = user.isSuper ? 0 : user.userInfo?.isAdmin ? 1 : 2;
				const createdAt = new Date(parseInt(user.createdAt));
				const collapsableTableData = undefined; //TODO get the extra data
				return {
					name,
					email: user.email,
					createdBy,
					createdAt: createdAt.toLocaleDateString(),
					role: getUserRole(role),
					collapsableTableData
				};
			});
		} else {
			return [];
		}
	};

	const updateSelectedUsers = (isSelected: boolean, index: number) => {
		if (data) {
			const userId = data.users.users[index].id;
			if (isSelected) {
				setSelectedUsers([...selectedUsers, userId]);
			} else {
				const userIdIndex = selectedUsers.findIndex((id) => id == userId);
				const newList = [...selectedUsers];
				newList.splice(userIdIndex, 1);
				setSelectedUsers(newList);
			}
		}
	};

	const handleDeleteUsers = () => {
		const hasSelectedOwnUser = selectedUsers.some((userId) => userId === currentUser.userId);
		if (hasSelectedOwnUser) {
			setDeleteError("You cant delete your own user");
		} else {
			deleteUsers({
				variables: {
					userIds: selectedUsers
				}
			})
				.then(() => {
					setSuccessMessage("Users deleted");
					setSelectedUsers([]);
				})
				.catch((error) => {
					console.error(error.message);
					setDeleteError(error.message);
				});
		}
	};

	return (
		<div className={styles.usersContainer}>
			<CreateUserModal
				isOpen={isUserModalOpen}
				onClose={() => setIsUserModalOpen(false)}
				onUserAdded={() => {
					setSuccessMessage("User created");
					setIsUserModalOpen(false);
				}}
			/>
			{showUserInfo && (
				<UserInfoModal
					userId={selectedUserId}
					onClose={() => {
						setShowUserInfo(false);
						setSelectedUserId(undefined);
					}}
					onUserUpdated={() => {
						setSuccessMessage("User updated");
						setShowUserInfo(false);
						setSelectedUserId(undefined);
					}}
				/>
			)}
			<Paper elevation={3}>
				<div className={styles.usersHeader}>
					<h1 className={styles.usersTitle}>Users</h1>
					<Fab
						className={styles.addUserBtn}
						color="primary"
						variant="extended"
						onClick={() => setIsUserModalOpen(true)}
					>
						<PersonAdd sx={{ mr: 1 }} />
						Add user
					</Fab>
				</div>
			</Paper>
			<Divider />
			<CollapsibleTable<UserRow>
				headers={["Name", "Email", "Created By", "Created At", "Role"]}
				rows={mapTableRows()}
				totalRows={data?.users.totalUsers || 0}
				rowCollapsableTableTitle="Latest accounts"
				rowcollapsableTableHeaders={["Account", "Init Date", "End Date"]}
				onRowCollapse={() => console.log("GET the latest data")}
				onPageChange={(newPage) => {
					setSelectedUserId(undefined);
					setSelectedUsers([]);
					setCurrentPage(newPage);
				}}
				onRowsPerPageChange={setRowsPerPage}
				loading={loading}
				error={error?.message}
				onRowSelected={updateSelectedUsers}
				hasSelectedRows={selectedUsers.length > 0}
				onDelete={handleDeleteUsers}
				onRowInfo={(index) => {
					const userId = data ? data.users.users[index].id : undefined;
					const isSuper = data ? data.users.users[index].isSuper : undefined;
					if (isSuper) {
						setWarningMesage("You cant edit a super user");
					} else {
						setSelectedUserId(userId);
						setShowUserInfo(true);
					}
				}}
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
				open={warningMessage !== undefined}
				autoHideDuration={6000}
				onClose={() => setWarningMesage(undefined)}
			>
				<Alert onClose={() => setWarningMesage(undefined)} severity="warning" sx={{ width: "100%" }}>
					{warningMessage}
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
