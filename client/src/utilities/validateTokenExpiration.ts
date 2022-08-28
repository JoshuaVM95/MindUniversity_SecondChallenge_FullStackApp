export const hasTokenExpired = (exp: string): boolean => {
	const expirationDate = new Date(parseInt(exp) * 1000);
	const expirationHour = expirationDate.getHours();
	const expirationMinutes = expirationDate.getMinutes();

	const currentDate = new Date();
	const currentHour = currentDate.getHours();
	const currentMinutes = currentDate.getMinutes();

	return expirationHour <= currentHour && expirationMinutes <= currentMinutes;
};
