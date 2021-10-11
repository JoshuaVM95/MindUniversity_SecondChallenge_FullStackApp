import React, { useState } from "react";
import { Alert, Fab, Divider, Snackbar } from "@material-ui/core";
import { PersonAdd } from "@material-ui/icons";
import { CollapsibleTable } from "../../components/table/table";
import styles from "./Users.module.scss";
import { Role, UserOverview, UserAccountOverview } from "../../types";
import { getUserRole } from "../../utilities";
import { CreateUserModal } from "./CreateUserModal";
import { useMutation, useQuery } from "@apollo/client";
import { DeleteUsersMutation, DeleteUsersResponse, UsersQuery, UsersResponse } from "./queries";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

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
	const [showCreatedMessage, setShowCreatedMessage] = useState<boolean>(false);
	const [showSelectedOwnUser, setShowSelectedOwnUser] = useState<boolean>(false);
	const [showDeletedMessage, setShowDeletedMessage] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const { loading, error, data } = useQuery<UsersResponse>(UsersQuery, {
		variables: {
			filterByEmail: "",
			page: currentPage,
			rowsPerPage
		}
	});
	const [deleteUsers, { data: dataDelete, loading: loadingDelete, error: errorDelete }] =
		useMutation<DeleteUsersResponse>(DeleteUsersMutation, {
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
				return {
					name,
					email: user.email,
					createdBy,
					createdAt: createdAt.toLocaleDateString(),
					role: getUserRole(role)
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
			setShowSelectedOwnUser(true);
		} else {
			deleteUsers({
				variables: {
					userIds: selectedUsers
				}
			})
				.then(() => {
					setShowDeletedMessage(true);
					setSelectedUsers([]);
				})
				.catch((error) => {
					console.error(error.message);
				});
		}
	};

	return (
		<div className={styles.usersContainer}>
			<CreateUserModal
				isOpen={isUserModalOpen}
				onClose={() => setIsUserModalOpen(false)}
				onUserAdded={() => {
					setShowCreatedMessage(true);
					setIsUserModalOpen(false);
				}}
			/>
			<div className={styles.usersHeader}>
				<h1 className={styles.usersTitle}>Users</h1>
				<Fab className={styles.addUserBtn} variant="extended" onClick={() => setIsUserModalOpen(true)}>
					<PersonAdd sx={{ mr: 1 }} />
					Add user
				</Fab>
			</div>
			<Divider />
			<CollapsibleTable<UserRow>
				headers={["Name", "Email", "Created By", "Created At", "Role"]}
				rows={mapTableRows()}
				totalRows={data?.users.totalUsers || 0}
				rowCollapsableTableTitle="Latest accounts"
				rowcollapsableTableHeaders={["Account", "Init Date", "End Date"]}
				onRowCollapse={() => console.log("GET the latest data")}
				onPageChange={setCurrentPage}
				onRowsPerPageChange={setRowsPerPage}
				loading={loading}
				error={error?.message}
				onRowSelected={updateSelectedUsers}
				hasSelectedRows={selectedUsers.length > 0}
				onDelete={handleDeleteUsers}
			/>
			<Snackbar open={showCreatedMessage} autoHideDuration={6000} onClose={() => setShowCreatedMessage(false)}>
				<Alert onClose={() => setShowCreatedMessage(false)} severity="success" sx={{ width: "100%" }}>
					User created successfully
				</Alert>
			</Snackbar>
			<Snackbar open={showDeletedMessage} autoHideDuration={6000} onClose={() => setShowDeletedMessage(false)}>
				<Alert onClose={() => setShowDeletedMessage(false)} severity="success" sx={{ width: "100%" }}>
					Users deleted
				</Alert>
			</Snackbar>
			<Snackbar open={showSelectedOwnUser} autoHideDuration={6000} onClose={() => setShowSelectedOwnUser(false)}>
				<Alert onClose={() => setShowSelectedOwnUser(false)} severity="error" sx={{ width: "100%" }}>
					You cant delete your own user
				</Alert>
			</Snackbar>
		</div>
	);
};

function createData(name: string, email: string, createdBy: string, createdAt: number, role: Role): UserRow {
	return {
		name,
		email,
		createdBy,
		createdAt: new Date(createdAt).toDateString(),
		role: getUserRole(role),
		collapsableTableData: [
			{
				account: "Account",
				initDate: new Date(createdAt).toDateString(),
				endDate: new Date(createdAt).toDateString()
			},
			{
				account: "Account 2",
				initDate: new Date(createdAt).toDateString(),
				endDate: "Active"
			}
		]
	};
}

const rows: UserRow[] = [];
