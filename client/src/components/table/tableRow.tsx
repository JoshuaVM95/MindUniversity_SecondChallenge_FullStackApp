import React, { useState } from "react";
import {
	Box,
	Collapse,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
	Tooltip
} from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp, Edit, Info } from "@material-ui/icons";

type stringObject = { [key: string]: string };

export interface RowObject {
	[key: string]: string | unknown;
	collapsableTableData?: stringObject[];
}

interface RowProps<T extends RowObject> {
	row: T;
	collapsableTableTitle?: string;
	collapsableTableHeaders?: string[];
	onRowSelected(isRowSelected: boolean): void;
	onEdit(): void;
	canSelect?: boolean;
	onInfo(): void;
}

export const Row = <T extends RowObject>({
	row,
	collapsableTableTitle,
	collapsableTableHeaders,
	onRowSelected,
	onEdit,
	canSelect = true,
	onInfo
}: RowProps<T>): React.ReactElement => {
	const [showCollapsableData, setShowCollapsableData] = useState<boolean>(false);
	const [isRowSelected, setIsRowSelected] = useState<boolean>(false);

	return (
		<>
			<TableRow
				sx={{ "& > *": { borderBottom: "unset" } }}
				hover
				onClick={() => {
					if (canSelect) {
						onRowSelected(!isRowSelected);
						setIsRowSelected(!isRowSelected);
					}
				}}
				role="checkbox"
				aria-checked={isRowSelected}
				tabIndex={-1}
				selected={isRowSelected}
			>
				<TableCell>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={(event) => {
							event.stopPropagation();
							setShowCollapsableData(!showCollapsableData);
						}}
					>
						{showCollapsableData ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
					</IconButton>
				</TableCell>
				{Object.keys(row)
					.filter((rowKey) => typeof row[rowKey] !== "object")
					.map((rowKey) => {
						return (
							<TableCell key={rowKey} align="center">
								{row[rowKey] as string}
							</TableCell>
						);
					})}
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={showCollapsableData} timeout="auto" unmountOnExit>
						<Box sx={{ margin: 1 }}>
							{collapsableTableTitle && row.collapsableTableData && row.collapsableTableData.length > 0 && (
								<Typography variant="h6" gutterBottom component="div">
									{collapsableTableTitle}
								</Typography>
							)}
							<Table size="small" aria-label="purchases">
								{collapsableTableHeaders &&
									row.collapsableTableData &&
									row.collapsableTableData.length > 0 && (
										<TableHead>
											<TableRow>
												{collapsableTableHeaders.map((header) => (
													<TableCell key={header} align="center">
														{header}
													</TableCell>
												))}
											</TableRow>
										</TableHead>
									)}
								<TableBody>
									{row.collapsableTableData &&
										row.collapsableTableData.length > 0 &&
										row.collapsableTableData.map((detail, index) => {
											return (
												<TableRow key={index}>
													{Object.keys(detail).map((detailKey) => {
														const detailRow = detail[detailKey];
														return (
															<TableCell key={detailKey} align="center">
																{detailRow}
															</TableCell>
														);
													})}
												</TableRow>
											);
										})}
									<TableRow>
										<TableCell
											style={{ paddingBottom: 0, paddingTop: 0 }}
											colSpan={6}
											align="right"
										>
											<Tooltip title="Edit">
												<IconButton
													aria-label="open edit modal"
													size="medium"
													onClick={(event) => {
														event.stopPropagation();
														if (onEdit) onEdit();
													}}
												>
													<Edit />
												</IconButton>
											</Tooltip>
											<Tooltip title="Check complete information">
												<IconButton
													aria-label="open detail modal"
													size="medium"
													onClick={(event) => {
														event.stopPropagation();
														if (onInfo) onInfo();
													}}
												>
													<Info />
												</IconButton>
											</Tooltip>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
};
