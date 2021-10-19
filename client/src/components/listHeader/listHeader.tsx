import React from "react";
import { Box, Tooltip, IconButton } from "@material-ui/core";
import { FilterList } from "@material-ui/icons";
import styles from "./listHeader.module.scss";

interface ListHeaderProps {
	title: string;
	addIcon: React.ReactNode;
	addTooltipTitle: string;
	onAdd(): void;
	onOpenFilters?(): void;
	hasActiveFilters?: boolean;
}

export const ListHeader = ({
	title,
	addIcon,
	addTooltipTitle,
	onAdd,
	onOpenFilters,
	hasActiveFilters
}: ListHeaderProps): React.ReactElement => {
	return (
		<Box className={styles.listHeaderContainer}>
			<Box className={styles.filterIconContainer}>
				{onOpenFilters && (
					<Tooltip title="Open filter modal">
						<IconButton onClick={onOpenFilters} color={hasActiveFilters ? "info" : "inherit"}>
							<FilterList className={styles.filterIcon} />
						</IconButton>
					</Tooltip>
				)}
			</Box>

			<h1 className={styles.listHeaderTitle}>{title}</h1>
			<Box className={styles.addIconContainer}>
				<Tooltip title={addTooltipTitle}>
					<IconButton className={styles.addIconButton} onClick={onAdd}>
						{addIcon}
					</IconButton>
				</Tooltip>
			</Box>
		</Box>
	);
};
