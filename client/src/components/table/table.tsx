import React, { useState } from "react";
import {
	Alert,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	Paper,
	Skeleton,
	Tooltip,
	IconButton
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { Row, RowObject } from "./tableRow";
import styles from "./table.module.scss";

interface CollapsibleTableProps<T extends RowObject> {
	headers: string[];
	rows: T[];
	totalRows: number;
	rowCollapsableTableTitle?: string;
	rowcollapsableTableHeaders?: string[];
	onPageChange(newPage: number): void;
	onRowsPerPageChange(newRowsPerPage: number): void;
	loading: boolean;
	error?: string;
	onRowSelected?(isRowSelected: boolean, index: number): void;
	hasSelectedRows?: boolean;
	onDelete?(): void;
	onRowEdit(index: number): void;
	hasSelectableRows?: boolean;
	onRowInfo(index: number): void;
}

export const CollapsibleTable = <T extends RowObject>({
	headers,
	rows,
	totalRows,
	rowCollapsableTableTitle,
	rowcollapsableTableHeaders,
	onPageChange,
	onRowsPerPageChange,
	loading,
	error,
	onRowSelected,
	hasSelectedRows,
	onDelete,
	onRowEdit,
	hasSelectableRows,
	onRowInfo
}: CollapsibleTableProps<T>): React.ReactElement => {
	const [currentPage, setCurrentPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const rowsPerPageOption = [10, 25, 100];

	return (
		<Paper elevation={0} variant="outlined" square sx={{ width: "100%", overflow: "hidden" }}>
			<TableContainer className={styles.tableContainer} sx={{ maxHeight: "calc(100vh - 134px)" }}>
				<Table stickyHeader aria-label="collapsible table">
					<TableHead>
						<TableRow>
							<TableCell>
								{hasSelectedRows && (
									<Tooltip title="Delete">
										<IconButton onClick={onDelete} sx={{ padding: 0, marginLeft: "5px" }}>
											<Delete />
										</IconButton>
									</Tooltip>
								)}
							</TableCell>
							{headers.map((header, index) => (
								<TableCell key={`${header}-${index}`} align="center">
									{header}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row, index) => (
							<Row<T>
								key={`${JSON.stringify(row)}-${index}`}
								row={row}
								collapsableTableTitle={rowCollapsableTableTitle}
								collapsableTableHeaders={rowcollapsableTableHeaders}
								onRowSelected={(isRowSelected) => {
									if (onRowSelected) onRowSelected(isRowSelected, index);
								}}
								onEdit={() => onRowEdit(index)}
								isSelectable={hasSelectableRows}
								onInfo={() => onRowInfo(index)}
							/>
						))}
					</TableBody>
				</Table>
				{loading && (
					<>
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
						<Skeleton animation="wave" />
					</>
				)}
				{error && <Alert severity="error">{error}</Alert>}
				{rows.length === 0 && <Alert severity="warning">No data yet</Alert>}
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={rowsPerPageOption}
				component="div"
				count={totalRows}
				rowsPerPage={rowsPerPage}
				page={currentPage}
				onPageChange={(evet, newPage) => {
					onPageChange(newPage);
					setCurrentPage(newPage);
				}}
				onRowsPerPageChange={(event) => {
					const newRowsPerPage = +event.target.value;
					onRowsPerPageChange(newRowsPerPage);
					setRowsPerPage(newRowsPerPage);
				}}
			/>
		</Paper>
	);
};
