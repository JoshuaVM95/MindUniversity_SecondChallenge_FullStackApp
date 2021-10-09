import React, { useState } from "react";
import {
	Avatar,
	Box,
	Collapse,
	Divider,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ListSubheader,
	Typography
} from "@material-ui/core";
import { AccountTree, BusinessCenter, ExpandLess, ExpandMore, Lock, PeopleAlt } from "@material-ui/icons";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { clearCurrentUser } from "../../store/currentUser/actions";
import { Role, Routes } from "../../types";

enum AvailableLists {
	USERS,
	ACCOUNTS,
	USERS_ACCOUNTS_HISTORY
}

export const LateralBar = (): React.ReactElement => {
	const [selectedList, setSelectedList] = useState<AvailableLists>(AvailableLists.USERS);
	const [showLogout, setShowLogout] = useState(true);
	const currentUser = useSelector((state: RootState) => state.currentUser);
	const dispatch: AppDispatch = useDispatch();
	const history = useHistory();

	const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: AvailableLists) => {
		setSelectedList(index);
		switch (index) {
			case AvailableLists.USERS:
				history.push(Routes.USERS);
				break;
			case AvailableLists.ACCOUNTS:
				history.push(Routes.ACCOUNTS);
				break;
			case AvailableLists.USERS_ACCOUNTS_HISTORY:
				history.push(Routes.USERS_ACCOUNTS_HISTORY);
				break;
		}
	};

	const handleLogOut = () => {
		dispatch(clearCurrentUser());
		history.push(Routes.LOGIN);
	};

	const getUserRole = (): string => {
		switch (currentUser.role) {
			case Role.SUPER:
				return "Super User";
			case Role.ADMIN:
				return "Admin User";
			default:
				return "User";
		}
	};

	return (
		<Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
			<List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
				<ListItemButton onClick={() => setShowLogout(!showLogout)}>
					<ListItemIcon>
						<Avatar
							alt={`${currentUser.firstName} ${currentUser.lastName}`}
							src="/static/images/avatar/1.jpg"
						/>
					</ListItemIcon>
					<ListItemText
						primary={`${currentUser.firstName} ${currentUser.lastName}`}
						secondary={
							<>
								<Typography
									sx={{ display: "inline" }}
									component="span"
									variant="body2"
									color="text.primary"
								>
									Role:
								</Typography>
								{` ${getUserRole()}`}
							</>
						}
					/>
					{showLogout ? <ExpandLess /> : <ExpandMore />}
				</ListItemButton>
				<Collapse in={showLogout} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						<ListItemButton sx={{ pl: 4 }} onClick={handleLogOut}>
							<ListItemIcon>
								<Lock />
							</ListItemIcon>
							<ListItemText primary="Log out" />
						</ListItemButton>
					</List>
				</Collapse>
			</List>
			<List
				component="nav"
				subheader={
					<ListSubheader component="div" id="nested-list-subheader">
						Lists
					</ListSubheader>
				}
				aria-label="main mailbox folders"
			>
				<ListItemButton
					selected={selectedList === AvailableLists.USERS}
					onClick={(event) => handleListItemClick(event, AvailableLists.USERS)}
				>
					<ListItemIcon>
						<PeopleAlt />
					</ListItemIcon>
					<ListItemText primary="Users" />
				</ListItemButton>
				<Divider />
				<ListItemButton
					selected={selectedList === AvailableLists.ACCOUNTS}
					onClick={(event) => handleListItemClick(event, AvailableLists.ACCOUNTS)}
				>
					<ListItemIcon>
						<BusinessCenter />
					</ListItemIcon>
					<ListItemText primary="Accounts" />
				</ListItemButton>
				<Divider />
				<ListItemButton
					selected={selectedList === AvailableLists.USERS_ACCOUNTS_HISTORY}
					onClick={(event) => handleListItemClick(event, AvailableLists.USERS_ACCOUNTS_HISTORY)}
				>
					<ListItemIcon>
						<AccountTree />
					</ListItemIcon>
					<ListItemText primary="Users/Accounts History" />
				</ListItemButton>
				<Divider />
			</List>
		</Box>
	);
};
