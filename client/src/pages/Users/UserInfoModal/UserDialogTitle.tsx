import React from "react";
import { Avatar, Typography, Skeleton } from "@material-ui/core";
import { BootstrapDialogTitle } from "./BootstrapDialogTitle";

interface UserDialogTitleProps {
	loading: boolean;
	userName: string;
	onClose(): void;
}

export const UserDialogTitle = ({ loading, userName, onClose }: UserDialogTitleProps): React.ReactElement => {
	return (
		<BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
			{loading ? (
				<>
					<Skeleton sx={{ margin: 2 }} variant="circular">
						<Avatar />
					</Skeleton>
					<Skeleton width="100%" height={35}>
						<Typography>.</Typography>
					</Skeleton>
				</>
			) : (
				<>
					<Avatar alt={userName} src="/static/images/avatar/1.jpg" />
					{userName}
				</>
			)}
		</BootstrapDialogTitle>
	);
};
