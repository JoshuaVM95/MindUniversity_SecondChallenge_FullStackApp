import { Role } from "@mindu-second-challenge/apollo-server-types";

export const getUserRole = (role?: Role): string => {
	switch (role) {
		case Role.SUPER:
			return "Super User";
		case Role.ADMIN:
			return "Admin User";
		default:
			return "User";
	}
};
