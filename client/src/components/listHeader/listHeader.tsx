import React from "react";
import { Box, Tooltip, IconButton, Badge } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import styles from "./listHeader.module.scss";

interface ListHeaderProps {
	title: string;
	addIcon: React.ReactNode;
	addTooltipTitle: string;
	onAdd(): void;
	onOpenFilters?(): void;
	activeFiltersCount?: number;
}

export const ListHeader = ({
	title,
	addIcon,
	addTooltipTitle,
	onAdd,
	onOpenFilters,
	activeFiltersCount
}: ListHeaderProps): React.ReactElement => {
	return (
		<Box className={styles.listHeaderContainer}>
			<Box className={styles.filterIconContainer}>
				{onOpenFilters && (
					<Tooltip title="Open filter modal">
						<Badge badgeContent={activeFiltersCount} color="info">
							<IconButton onClick={onOpenFilters} color={activeFiltersCount ? "info" : "inherit"}>
								<FilterList className={styles.filterIcon} />
							</IconButton>
						</Badge>
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
