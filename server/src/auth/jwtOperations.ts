import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthenticationError } from "apollo-server";
import { Role } from "../graphql/user/types";

interface DecodedToken extends JwtPayload {
	userId: string;
	firstName: string;
	lastName: string;
	role: Role;
}

export const generateToken = (userId: string, firstName?: string, lastName?: string, role?: Role): string => {
	const jwtSecret = process.env.JWT_SECRET || "";
	return jwt.sign({ userId, firstName, lastName, role }, jwtSecret, {
		expiresIn: "1h"
	});
};

export const decodeToken = (token: string): DecodedToken => {
	if (token) {
		try {
			const jwtSecret = process.env.JWT_SECRET || "";
			return jwt.verify(token, jwtSecret) as DecodedToken;
		} catch (error) {
			console.error(error);
			throw new AuthenticationError("Not authorized, invalid token");
		}
	} else {
		throw new AuthenticationError("Not authorized, no token");
	}
};
