import React, { useEffect, useState } from "react";
import {
	Alert,
	Autocomplete,
	Avatar,
	Box,
	Container,
	CircularProgress,
	Paper,
	Grid,
	IconButton,
	Button,
	TextField,
	Snackbar,
	Tooltip
} from "@mui/material";
import { ArrowBack, Lock } from "@mui/icons-material";
import { useMutation, useQuery } from "@apollo/client";
import { UpdateUserInfoMutation, UpdateUserInfoResponse, UserQuery, UserResponse } from "./queries";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getUserRole } from "../../utilities";
import { useNavigate } from "react-router";
import { clearCurrentUser } from "../../store/currentUser/actions";
import { Paths } from "../../types";
import {
	EnglishLevel,
	UpdateUserInfoMutationVariables,
	UserQueryVariables
} from "@mindu-second-challenge/apollo-server-types";

interface ProfileProps {
	userId?: string;
	onGoBack?(): void;
}

export const Profile = ({ userId, onGoBack }: ProfileProps): React.ReactElement => {
	const currentUser = useSelector((state: RootState) => state.currentUser);
	const dispatch: AppDispatch = useDispatch();
	const navigate = useNavigate();

	const { loading, data } = useQuery<UserResponse, UserQueryVariables>(UserQuery, {
		variables: {
			userId: userId || currentUser.userId || ""
		}
	});

	const [updateUserInfo, { loading: loadingUpdateUserInfo, error: errorUpdateUserInfo }] = useMutation<
		UpdateUserInfoResponse,
		UpdateUserInfoMutationVariables
	>(UpdateUserInfoMutation, {
		refetchQueries: [UserQuery]
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
	const cvLink = data?.user.userInfo?.cvLink || "#";

	const [isEditionMode, setIsEditionMode] = useState<boolean>(false);
	const [englishLevelValue, setEnglishLevelValue] = useState<EnglishLevel | null>(null);
	const [techSkillsValue, setTechSkillsValue] = useState<string>("");
	const [cvLinkValue, setCvLinkValue] = useState<string>("");
	const [successMessage, setSuccessMessage] = useState<string>();

	const handleGoBack = () => {
		if (onGoBack) {
			onGoBack();
		} else {
			dispatch(clearCurrentUser());
			navigate(Paths.LOGIN);
		}
	};

	const paperWidth = userId ? "95%" : "100%";
	const paperHeight = userId ? "auto" : "100%";

	const handleSave = () => {
		if (data && data.user.userInfo) {
			const userInfo = data.user.userInfo;
			const variables: UpdateUserInfoMutationVariables = {
				englishLevel: englishLevelValue || EnglishLevel.BASIC,
				technicalSkills: techSkillsValue,
				cvLink: cvLinkValue
			};
			if (userInfo.englishLevel === englishLevelValue) delete variables.englishLevel;
			if (userInfo.technicalSkills === techSkillsValue) delete variables.technicalSkills;
			if (userInfo.cvLink === cvLinkValue) delete variables.cvLink;
			if (Object.keys(variables).length > 0) {
				updateUserInfo({
					variables
				})
					.then(() => {
						setIsEditionMode(false);
						setSuccessMessage("Changes saved correctly");
					})
					.catch((error) => {
						console.error(error);
					});
			} else {
				setIsEditionMode(false);
			}
		}
	};

	useEffect(() => {
		if (data && data.user.userInfo) {
			const userInfo = data.user.userInfo;
			setTechSkillsValue(userInfo.technicalSkills || "");
			setEnglishLevelValue(userInfo.englishLevel || null);
			setCvLinkValue(userInfo.cvLink || "");
		}
	}, [data]);

	return (
		<Container
			maxWidth={false}
			fixed
			disableGutters
			sx={{
				height: "100vh",
				position: "absolute",
				zIndex: 100,
				width: "100%",
				maxHeight: "100vh",
				backdropFilter: "blur(4px)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center"
			}}
			style={{ maxWidth: "100%" }}
		>
			<Paper elevation={0} variant="outlined" square sx={{ width: paperWidth, height: paperHeight }}>
				{loading && (
					<Box sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
						<CircularProgress size={100} />
					</Box>
				)}
				<Box
					sx={{ display: "grid", gridTemplateColumns: "1fr 4fr 1fr", alignItems: "center", paddingTop: 1.2 }}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "flex-start",
							paddingLeft: "0.6rem"
						}}
					>
						<Tooltip title={userId ? "Go back" : "Log out"}>
							<IconButton aria-label={userId ? "Go back" : "Log out"} size="large" onClick={handleGoBack}>
								{userId ? <ArrowBack fontSize="inherit" /> : <Lock fontSize="inherit" />}
							</IconButton>
						</Tooltip>
					</Box>
					<h1 style={{ textAlign: "center", paddingTop: 12 }}>Profile</h1>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "flex-end",
							paddingRight: "1.2rem"
						}}
					>
						<Avatar alt={userName} src="/static/images/avatar/1.jpg" />
					</Box>
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
						<Item label="English Level" value={isEditionMode ? "" : englishLevel}>
							{isEditionMode && (
								<Box sx={{ marginTop: 1 }}>
									<Autocomplete<EnglishLevel>
										id="english-level"
										options={[EnglishLevel.BASIC, EnglishLevel.INTERMEDIATE, EnglishLevel.ADVANCED]}
										value={englishLevelValue}
										onChange={(event: React.SyntheticEvent, newValue: EnglishLevel | null) => {
											setEnglishLevelValue(newValue);
										}}
										fullWidth
										renderInput={(params) => <TextField {...params} label="" variant="standard" />}
									/>
								</Box>
							)}
						</Item>
					</Grid>
					<Grid item xs={6} md={12}>
						<Item label="Technical Skills" value={isEditionMode ? "" : technicalSkills}>
							{isEditionMode && (
								<Box sx={{ marginTop: 1 }}>
									<TextField
										id="technical-skills"
										label=""
										multiline
										minRows={1}
										maxRows={4}
										fullWidth
										value={techSkillsValue}
										onChange={(event) => setTechSkillsValue(event.target.value)}
										variant="standard"
									/>
								</Box>
							)}
						</Item>
					</Grid>
					<Grid item xs={6} md={4}>
						<Item label="CV Link">
							{isEditionMode ? (
								<Box sx={{ marginTop: 1 }}>
									<TextField
										id="cv-link"
										label=""
										fullWidth
										value={cvLinkValue}
										onChange={(event) => setCvLinkValue(event.target.value)}
										variant="standard"
									/>
								</Box>
							) : (
								<Button href={cvLink} target="_blank" sx={{ padding: 0, minWidth: 0 }}>
									Link
								</Button>
							)}
						</Item>
					</Grid>
				</Grid>
				{errorUpdateUserInfo && (
					<Box sx={{ display: "flex", justifyContent: "center", margin: "0 24px" }}>
						<Alert variant="outlined" severity="error" sx={{ width: "100%" }}>
							{errorUpdateUserInfo.message}
						</Alert>
					</Box>
				)}
				<Snackbar
					open={successMessage !== undefined}
					autoHideDuration={6000}
					onClose={() => setSuccessMessage(undefined)}
				>
					<Alert onClose={() => setSuccessMessage(undefined)} severity="success" sx={{ width: "100%" }}>
						{successMessage}
					</Alert>
				</Snackbar>
				{!userId ? (
					isEditionMode ? (
						<Box sx={{ position: "fixed", bottom: 10, right: 10, display: "flex", alignItems: "center" }}>
							<Button
								size="large"
								color="error"
								onClick={() => setIsEditionMode(false)}
								disabled={loadingUpdateUserInfo}
							>
								Cancel
							</Button>
							{loadingUpdateUserInfo ? (
								<Box>
									<CircularProgress color="success" size={42} />
								</Box>
							) : (
								<Button size="large" color="success" onClick={handleSave}>
									Save
								</Button>
							)}
						</Box>
					) : (
						<Box sx={{ position: "fixed", bottom: 10, right: 10 }}>
							<Button size="large" onClick={() => setIsEditionMode(true)}>
								Edit
							</Button>
						</Box>
					)
				) : null}
			</Paper>
		</Container>
	);
};

interface ItemProps {
	label: string;
	value?: string;
}
const Item = ({ label, value, children }: React.PropsWithChildren<ItemProps>) => {
	return (
		<Paper elevation={0} variant="outlined" square sx={{ padding: 2 }}>
			<h4>{label}</h4>
			{value && <span>{value}</span>}
			{children}
		</Paper>
	);
};
