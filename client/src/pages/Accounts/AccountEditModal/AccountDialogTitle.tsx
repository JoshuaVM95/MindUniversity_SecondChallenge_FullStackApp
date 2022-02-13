import React from "react";
import { Typography, Skeleton } from "@mui/material";
import { BootstrapDialogTitle } from "../../Users/UserEditModal/BootstrapDialogTitle";

interface AccountDialogTitleProps {
	loading: boolean;
	accountName: string;
	onClose(): void;
}

export const AccountDialogTitle = ({ loading, accountName, onClose }: AccountDialogTitleProps): React.ReactElement => {
	return (
		<BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
			{loading ? (
				<Skeleton width="100%" height={35}>
					<Typography>.</Typography>
				</Skeleton>
			) : (
				<>{accountName}</>
			)}
		</BootstrapDialogTitle>
	);
};
