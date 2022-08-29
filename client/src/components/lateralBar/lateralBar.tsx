import React, { useEffect, useState } from "react";
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
	Typography,
	Drawer,
	IconButton,
	Tooltip
} from "@mui/material";
import {
	AccountTree,
	BusinessCenter,
	ChevronLeft,
	ChevronRight,
	ExpandLess,
	ExpandMore,
	Lock,
	PeopleAlt
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { clearCurrentUser } from "../../store/currentUser/actions";
import { Paths } from "../../types";
import { getUserRole } from "../../utilities";

enum AvailableLists {
	USERS,
	ACCOUNTS,
	USERS_ACCOUNTS_HISTORY
}

export const LateralBar = (): React.ReactElement => {
	const [selectedList, setSelectedList] = useState<AvailableLists>(AvailableLists.USERS);
	const [showLogout, setShowLogout] = useState<boolean>(true);
	const [isOpen, setIsOpen] = useState<boolean>(true);
	const currentUser = useSelector((state: RootState) => state.currentUser);
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const drawerWidth = isOpen ? "340px" : "70px";

	const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: AvailableLists) => {
		setSelectedList(index);
		switch (index) {
			case AvailableLists.USERS:
				navigate(Paths.USERS);
				break;
			case AvailableLists.ACCOUNTS:
				navigate(Paths.ACCOUNTS);
				break;
			case AvailableLists.USERS_ACCOUNTS_HISTORY:
				navigate(Paths.USERS_ACCOUNTS_HISTORY);
				break;
		}
	};

	const handleLogOut = () => {
		dispatch(clearCurrentUser());
		navigate(Paths.LOGIN);
	};

	useEffect(() => {
		switch (location.pathname) {
			case Paths.USERS:
				setSelectedList(0);
				break;
			case Paths.ACCOUNTS:
				setSelectedList(1);
				break;
			case Paths.USERS_ACCOUNTS_HISTORY:
				setSelectedList(2);
				break;
		}
	}, [location.pathname]);

	return (
		<Drawer
			anchor="left"
			variant="permanent"
			open={isOpen}
			sx={{
				position: "relative",
				display: "flex",
				width: drawerWidth,
				maxWidth: drawerWidth,
				bgcolor: "background.paper",
				boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
				transition: "0.4s all"
			}}
			PaperProps={{
				sx: {
					position: "relative",
					maxWidth: drawerWidth,
					width: "inherit",
					overflowX: "hidden",
					transition: "0.4s all"
				}
			}}
		>
			<List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
				<ListItemButton sx={{ whiteSpace: "nowrap" }} onClick={() => setShowLogout(!showLogout)}>
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
								{` ${getUserRole(currentUser.role)}`}
							</>
						}
					/>
					{isOpen && (showLogout ? <ExpandLess /> : <ExpandMore />)}
				</ListItemButton>
				<Collapse in={showLogout} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						<Tooltip title={isOpen ? "" : "Log out"} placement="right">
							<ListItemButton sx={{ pl: 2.6, whiteSpace: "nowrap" }} onClick={handleLogOut}>
								<ListItemIcon>
									<Lock />
								</ListItemIcon>
								<ListItemText primary="Log out" />
							</ListItemButton>
						</Tooltip>
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
				<Tooltip title={isOpen ? "" : "Users"} placement="right">
					<ListItemButton
						selected={selectedList === AvailableLists.USERS}
						onClick={(event) => handleListItemClick(event, AvailableLists.USERS)}
						sx={{ pl: 2.6, whiteSpace: "nowrap" }}
					>
						<ListItemIcon>
							<PeopleAlt />
						</ListItemIcon>
						<ListItemText primary="Users" />
					</ListItemButton>
				</Tooltip>
				<Divider />
				<Tooltip title={isOpen ? "" : "Accounts"} placement="right">
					<ListItemButton
						selected={selectedList === AvailableLists.ACCOUNTS}
						onClick={(event) => handleListItemClick(event, AvailableLists.ACCOUNTS)}
						sx={{ pl: 2.6, whiteSpace: "nowrap" }}
					>
						<ListItemIcon>
							<BusinessCenter />
						</ListItemIcon>
						<ListItemText primary="Accounts" />
					</ListItemButton>
				</Tooltip>
				<Divider />
				<Tooltip title={isOpen ? "" : "Users/Accounts History"} placement="right">
					<ListItemButton
						selected={selectedList === AvailableLists.USERS_ACCOUNTS_HISTORY}
						onClick={(event) => handleListItemClick(event, AvailableLists.USERS_ACCOUNTS_HISTORY)}
						sx={{ pl: 2.6, whiteSpace: "nowrap" }}
					>
						<ListItemIcon>
							<AccountTree />
						</ListItemIcon>
						<ListItemText primary="Users/Accounts History" />
					</ListItemButton>
				</Tooltip>
				<Divider />
			</List>
			<Box sx={{ position: "absolute", bottom: 12, left: 12 }}>
				<Tooltip title={isOpen ? "Minimize menu" : "Open menu"}>
					<IconButton onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? <ChevronLeft /> : <ChevronRight />}
					</IconButton>
				</Tooltip>
			</Box>
		</Drawer>
	);
};
