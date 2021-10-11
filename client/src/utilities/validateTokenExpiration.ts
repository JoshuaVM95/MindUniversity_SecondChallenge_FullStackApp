export const hasTokenExpired = (exp: string): boolean => {
	const expirationDate = new Date(parseInt(exp) * 1000);
	const expirationHour = expirationDate.getHours();
	const expirationMinutes = expirationDate.getMinutes();

	const currentDate = new Date();
	const currentHour = currentDate.getHours();
	const currentMinutes = currentDate.getMinutes();

	if (expirationHour <= currentHour && expirationMinutes <= currentMinutes) {
		return true;
	} else {
		return false;
	}
};
