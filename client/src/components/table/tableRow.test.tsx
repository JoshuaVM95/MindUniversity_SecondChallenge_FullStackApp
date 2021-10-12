import React from "react";
import { Row } from "./tableRow";
import { render, fireEvent, getByTestId } from "@testing-library/react";

describe("TableRow tests", () => {
	const collapse = jest.fn();
	const selected = jest.fn();
	const edit = jest.fn();
	const renderRow = () => {
		const row = {
			first: "1"
		};
		return render(
			<Row
				row={row}
				collapsableTableTitle="Title"
				collapsableTableHeaders={["My secondary header"]}
				onCollapse={collapse}
				onRowSelected={selected}
				onEdit={edit}
			/>
		);
	};
	it("renders correctly", () => {
		expect(renderRow().asFragment()).toMatchSnapshot();
	});
	it("renders the text prop correctly", () => {
		const row = renderRow().asFragment();
		expect(row).toHaveTextContent("1");
	});
	it("triggers click", () => {
		const row = renderRow().container;
		fireEvent.click(getByTestId(row, "KeyboardArrowDownIcon"));
		expect(collapse).toHaveBeenCalled();
	});
});
