import React from "react";
import { ListHeader } from "./listHeader";
import { render, fireEvent } from "@testing-library/react";
import { Add } from "@mui/icons-material";

describe("ListHeader tests", () => {
	const add = jest.fn();
	const renderListHeader = (openFilter?: () => void) => {
		return render(
			<ListHeader
				title="List header test"
				addIcon={<Add />}
				addTooltipTitle="Add test"
				onAdd={add}
				onOpenFilters={openFilter}
			/>
		);
	};
	it("renders correctly", () => {
		expect(renderListHeader().asFragment()).toMatchSnapshot();
	});
	it("renders the title prop correctly", () => {
		const listHeader = renderListHeader().asFragment();
		expect(listHeader).toHaveTextContent("List header test");
	});
	it("renders the Add icon", () => {
		const { getByTestId } = renderListHeader();
		const addIcon = getByTestId("AddIcon");
		expect(addIcon).toBeInTheDocument();
	});
	it("hiddes the filter button if there is no function", () => {
		const listHeader = renderListHeader().asFragment();
		expect(listHeader.querySelectorAll("button")).toHaveLength(1);
	});
	it("shows the filter button if the onOpenFilters function prop is send", () => {
		const listHeader = renderListHeader(() => console.log("onOpenFilters")).asFragment();
		expect(listHeader.querySelectorAll("button")).toHaveLength(2);
	});
	it("triggers the function when the filter button is click", () => {
		const openFilter = jest.fn();
		const { getByTestId } = renderListHeader(openFilter);
		const filterBtn = getByTestId("FilterListIcon");
		expect(filterBtn).toBeInTheDocument();
		fireEvent.click(filterBtn);
		expect(openFilter).toHaveBeenCalled();
	});
});
