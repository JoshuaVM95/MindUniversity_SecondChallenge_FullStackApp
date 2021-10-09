import { gql } from "@apollo/client";
import { Role } from "../../types";

export interface LoginResponse {
	login: {
		token: string;
		firstName?: string;
		lastName?: string;
		role: Role;
	};
}
export const LoginMutation = gql`
	mutation login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			firstName
			lastName
			role
		}
	}
`;
