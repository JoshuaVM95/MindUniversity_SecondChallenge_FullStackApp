import React from "react";
import { Typography, Skeleton } from "@mui/material";
import { BootstrapDialogTitle } from "../../Users/UserEditModal/BootstrapDialogTitle";

interface UserAccountDialogTitleProps {
	loading: boolean;
	userName: string;
	accountName: string;
	onClose(): void;
}

export const UserAccountDialogTitle = ({
	loading,
	userName,
	accountName,
	onClose
}: UserAccountDialogTitleProps): React.ReactElement => {
	return (
		<BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
			{loading ? (
				<Skeleton width="100%" height={35}>
					<Typography>.</Typography>
				</Skeleton>
			) : (
				<>
					{userName} - {accountName}
				</>
			)}
		</BootstrapDialogTitle>
	);
};
