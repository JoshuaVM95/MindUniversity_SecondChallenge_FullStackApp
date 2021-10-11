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
	Typography
} from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@material-ui/icons";

type stringObject = { [key: string]: string };

export interface RowObject {
	[key: string]: string | unknown;
	collapsableTableData?: stringObject[];
}

interface RowProps<T extends RowObject> {
	row: T;
	collapsableTableTitle?: string;
	collapsableTableHeaders?: string[];
	onCollapse?(show: boolean): void;
	onRowSelected(isRowSelected: boolean): void;
}

export const Row = <T extends RowObject>({
	row,
	collapsableTableTitle,
	collapsableTableHeaders,
	onCollapse,
	onRowSelected
}: RowProps<T>): React.ReactElement => {
	const [showCollapsableData, setShowCollapsableData] = useState<boolean>(false);
	const [isRowSelected, setIsRowSelected] = useState<boolean>(false);

	return (
		<>
			<TableRow
				sx={{ "& > *": { borderBottom: "unset" } }}
				hover
				onClick={() => {
					onRowSelected(!isRowSelected);
					setIsRowSelected(!isRowSelected);
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
							if (onCollapse) onCollapse(!showCollapsableData);
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
			{row.collapsableTableData !== undefined && collapsableTableHeaders && (
				<TableRow>
					<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
						<Collapse in={showCollapsableData} timeout="auto" unmountOnExit>
							<Box sx={{ margin: 1 }}>
								<Typography variant="h6" gutterBottom component="div">
									{collapsableTableTitle}
								</Typography>
								<Table size="small" aria-label="purchases">
									<TableHead>
										<TableRow>
											{collapsableTableHeaders.map((header) => (
												<TableCell key={header} align="center">
													{header}
												</TableCell>
											))}
										</TableRow>
									</TableHead>
									<TableBody>
										{row.collapsableTableData &&
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
									</TableBody>
								</Table>
							</Box>
						</Collapse>
					</TableCell>
				</TableRow>
			)}
		</>
	);
};
