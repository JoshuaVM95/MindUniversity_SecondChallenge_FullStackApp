import React from "react";
import { Row } from "./tableRow";
import { render, fireEvent } from "@testing-library/react";
import { Table, TableBody } from "@mui/material";

describe("TableRow tests", () => {
	const selected = jest.fn();
	const edit = jest.fn();
	const info = jest.fn();
	const renderRow = () => {
		const row = {
			first: "1"
		};
		return render(
			<Table>
				<TableBody>
					<Row
						row={row}
						collapsableTableTitle="Title"
						collapsableTableHeaders={["My secondary header"]}
						onRowSelected={selected}
						onEdit={edit}
						onInfo={info}
					/>
				</TableBody>
			</Table>
		);
	};
	it("renders correctly", () => {
		expect(renderRow().asFragment()).toMatchSnapshot();
	});
	it("renders the text prop correctly", () => {
		const row = renderRow().asFragment();
		expect(row).toHaveTextContent("1");
	});
	it("shows the arrow down by default", () => {
		const { getByTestId } = renderRow();
		const openBtn = getByTestId("KeyboardArrowDownIcon");
		expect(openBtn).toBeInTheDocument();
	});
	it("hiddes the arrow down after click", () => {
		const { getByTestId } = renderRow();
		const openBtn = getByTestId("KeyboardArrowDownIcon");
		expect(openBtn).toBeInTheDocument();
		fireEvent.click(openBtn);
		expect(openBtn).not.toBeInTheDocument();
	});
});
