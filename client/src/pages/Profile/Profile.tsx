import React from "react";
import { Avatar, Box, Container, CircularProgress, Paper, Grid, IconButton } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { useQuery } from "@apollo/client";
import { UserQuery, UserResponse } from "./queries";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getUserRole } from "../../utilities";
import { useHistory } from "react-router";
import { clearCurrentUser } from "../../store/currentUser/actions";
import { Routes } from "../../types";

interface ProfileProps {
	userId?: string;
	onGoBack?(): void;
}

export const Profile = ({ userId, onGoBack }: ProfileProps): React.ReactElement => {
	const currentUser = useSelector((state: RootState) => state.currentUser);
	const dispatch: AppDispatch = useDispatch();
	const history = useHistory();

	const { loading, data } = useQuery<UserResponse>(UserQuery, {
		variables: {
			userId: userId || currentUser.userId
		}
	});

	const dash = "-";
	const userName = `${data?.user.userInfo?.firstName || dash} ${data?.user.userInfo?.lastName || dash}`;
	const createdBy = `${data?.user.userInfo?.createdBy.userInfo?.firstName || dash} ${
		data?.user.userInfo?.createdBy.userInfo?.lastName || dash
	}`;
	const createdAt = data?.user.createdAt ? new Date(parseInt(data.user.createdAt)).toLocaleDateString() : dash;
	const updatedBy = dash;
	const updatedAt = data?.user.userInfo?.updatedAt
		? new Date(parseInt(data.user.userInfo.updatedAt)).toLocaleDateString()
		: dash;
	const queryRole = data?.user.isSuper ? 0 : data?.user.userInfo?.isAdmin ? 1 : 2;
	const role = getUserRole(queryRole);
	const englishLevel = data?.user.userInfo?.englishLevel || dash;
	const technicalSkills = data?.user.userInfo?.technicalSkills || dash;
	const cvLink = data?.user.userInfo?.cvLink || dash;

	const handleGoBack = () => {
		if (onGoBack) {
			onGoBack();
		} else {
			dispatch(clearCurrentUser());
			history.push(Routes.LOGIN);
		}
	};

	const containerHeight = userId ? "calc(100vh - 14px)" : "100vh";
	const paperHeight = userId ? "99%" : "100%";

	return (
		<Container
			maxWidth={false}
			fixed
			disableGutters
			sx={{ height: containerHeight, position: "absolute", zIndex: 100, width: "100%" }}
		>
			<Paper elevation={6} sx={{ width: "100%", height: paperHeight }}>
				{loading && (
					<Box sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
						<CircularProgress size={100} />
					</Box>
				)}
				<Box sx={{ position: "absolute", left: 16, top: 10 }}>
					<IconButton aria-label="go back" size="large" onClick={handleGoBack}>
						<ArrowBack fontSize="inherit" />
					</IconButton>
				</Box>
				<h1 style={{ textAlign: "center", paddingTop: 12 }}>Profile</h1>
				<Box sx={{ position: "absolute", right: 16, top: 16 }}>
					<Avatar alt={userName} src="/static/images/avatar/1.jpg" />
				</Box>
				<Grid container spacing={2} padding="32px 24px">
					<Grid item xs={6} md={8}>
						<Item label="User Name" value={userName} />
					</Grid>
					<Grid item xs={6} md={4}>
						<Item label="User Email" value={data?.user.email || dash} />
					</Grid>
					<Grid item xs={6} md={4}>
						<Item label="Created By" value={createdBy} />
					</Grid>
					<Grid item xs={6} md={8}>
						<Item label="Created At" value={createdAt} />
					</Grid>
					<Grid item xs={6} md={8}>
						<Item label="Updated By" value={updatedBy} />
					</Grid>
					<Grid item xs={6} md={4}>
						<Item label="Updated At" value={updatedAt} />
					</Grid>
					<Grid item xs={6} md={4}>
						<Item label="Role" value={role} />
					</Grid>
					<Grid item xs={6} md={8}>
						<Item label="English Level" value={englishLevel} />
					</Grid>
					<Grid item xs={6} md={12}>
						<Item label="Technical Skills" value={technicalSkills} />
					</Grid>
					<Grid item xs={6} md={4}>
						<Item label="CV Link" value={cvLink} />
					</Grid>
				</Grid>
			</Paper>
		</Container>
	);
};

interface ItemProps {
	label: string;
	value: string;
}
const Item = ({ label, value }: ItemProps) => {
	return (
		<Paper elevation={0} variant="outlined" square sx={{ padding: 2 }}>
			<h4>{label}</h4>
			<span>{value}</span>
		</Paper>
	);
};
