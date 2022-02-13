import React, { useState } from "react";
import {
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	InputAdornment,
	IconButton
} from "@mui/material";
import { Close } from "@mui/icons-material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import MuiTextField from "@mui/material/TextField";
import { parseToTimestamp } from "../../utilities";
import { UserAccountFilters } from "@mindu-second-challenge/apollo-server-types";

interface FilterModalProps {
	isOpen: boolean;
	onClose(): void;
	currentFilters: UserAccountFilters;
	onFilter(newFilters: UserAccountFilters): void;
}

export const FilterModal = ({ isOpen, onClose, currentFilters, onFilter }: FilterModalProps): React.ReactElement => {
	const [userName, setUserName] = useState<string>("");
	const [accountName, setAccountName] = useState<string>("");
	const [initDate, setInitDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);

	const handleCancel = () => {
		setUserName(currentFilters.name || "");
		setAccountName(currentFilters.account || "");
		setInitDate(currentFilters.initDate ? new Date(currentFilters.initDate) : null);
		setEndDate(currentFilters.endDate ? new Date(currentFilters.endDate) : null);
		onClose();
	};

	const updateFilters = () => {
		onFilter({
			name: userName.trim(),
			account: accountName.trim(),
			initDate: parseToTimestamp(initDate),
			endDate: parseToTimestamp(endDate)
		});
	};

	return (
		<Dialog open={isOpen} onClose={onClose}>
			<DialogTitle>Filter By</DialogTitle>
			<DialogContent>
				<Input id="user-name-field" label="User Name" value={userName} onChange={setUserName} />
				<Input id="account-name-field" label="Account Name" value={accountName} onChange={setAccountName} />
				<DateInput label="Initial Date" date={initDate} onChange={setInitDate} />
				<DateInput label="End Date" date={endDate} onChange={setEndDate} />
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel}>Cancel</Button>
				<Button onClick={updateFilters}>Filter list</Button>
			</DialogActions>
		</Dialog>
	);
};

interface InputProps {
	id: string;
	label: string;
	value: string;
	onChange(newValue: string): void;
}
const Input = ({ id, label, value, onChange }: InputProps): React.ReactElement => {
	return (
		<TextField
			id={id}
			label={label}
			variant="filled"
			value={value}
			onChange={(event) => onChange(event.target.value)}
			fullWidth
			InputProps={{
				endAdornment: value.length > 0 && (
					<InputAdornment position="end">
						<IconButton
							aria-label={`Clear ${label}`}
							onClick={() => onChange("")}
							onMouseDown={() => onChange("")}
							edge="end"
						>
							<Close />
						</IconButton>
					</InputAdornment>
				)
			}}
		/>
	);
};

interface DateInputProps {
	label: string;
	date: Date | null;
	onChange(newDate: Date | null): void;
}
const DateInput = ({ label, date, onChange }: DateInputProps): React.ReactElement => {
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<DatePicker
				onChange={onChange}
				value={date}
				renderInput={(params) => (
					<MuiTextField
						{...params}
						label={label}
						variant="filled"
						fullWidth
						InputProps={{
							endAdornment: (
								<>
									{date !== null && (
										<InputAdornment position="end">
											<IconButton
												aria-label={`Clear ${label}`}
												onClick={() => onChange(null)}
												onMouseDown={() => onChange(null)}
												edge="end"
											>
												<Close />
											</IconButton>
										</InputAdornment>
									)}
									{params.InputProps?.endAdornment}
								</>
							)
						}}
					/>
				)}
			/>
		</LocalizationProvider>
	);
};
