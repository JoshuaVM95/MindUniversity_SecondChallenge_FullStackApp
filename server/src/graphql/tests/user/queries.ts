import { gql } from "apollo-server";

export const loginMutation = gql`
	mutation login($email: String!, $password: String!) {
		login(email: $email, password: $password)
	}
`;

export const usersQuery = gql`
	query users($filterByEmail: String!, $page: Int!, $rowsPerPage: Int!) {
		users(filterByEmail: $filterByEmail, page: $page, rowsPerPage: $rowsPerPage) {
			users {
				id
			}
			totalUsers
		}
	}
`;
