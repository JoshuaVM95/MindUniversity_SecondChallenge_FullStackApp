import React from "react";
import { DialogTitle, IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";

interface BootstrapDialogTitleProps {
	id: string;
	children?: React.ReactNode;
	onClose: () => void;
}

export const BootstrapDialogTitle = ({
	children,
	onClose,
	...other
}: BootstrapDialogTitleProps): React.ReactElement => {
	return (
		<DialogTitle
			sx={{ m: 0, p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}
			{...other}
		>
			{children}
			{onClose ? (
				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						color: (theme) => theme.palette.grey[500]
					}}
				>
					<Close />
				</IconButton>
			) : null}
		</DialogTitle>
	);
};
