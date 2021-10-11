import { gql } from "@apollo/client";

export interface LoginResponse {
	login: string;
}
export const LoginMutation = gql`
	mutation login($email: String!, $password: String!) {
		login(email: $email, password: $password)
	}
`;
