export const parseToTimestamp = (dateToParse: Date | null): string | undefined => {
	if (dateToParse) {
		const isoDate = dateToParse.toISOString();
		const date = isoDate.split("T");
		const time = date[1].split(".");
		return date[0] + " " + time[0];
	}
	return undefined;
};
