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

export const userQuery = gql`
	query user($userId: String!) {
		user(userId: $userId) {
			id
			email
		}
	}
`;

export const createUserMutation = gql`
	mutation createUser(
		$email: String!
		$password: String!
		$firstName: String!
		$lastName: String!
		$isAdmin: Boolean
	) {
		createUser(email: $email, password: $password, firstName: $firstName, lastName: $lastName, isAdmin: $isAdmin) {
			message
			code
		}
	}
`;

export const deleteUsersMutation = gql`
	mutation deleteUsers($userIds: [String!]!) {
		deleteUsers(userIds: $userIds) {
			message
			code
		}
	}
`;

export const updateUserMutation = gql`
	mutation updateUser(
		$userId: String!
		$email: String
		$password: String
		$firstName: String
		$lastName: String
		$isAdmin: Boolean
	) {
		updateUser(
			userId: $userId
			email: $email
			password: $password
			firstName: $firstName
			lastName: $lastName
			isAdmin: $isAdmin
		) {
			message
			code
		}
	}
`;

export const updateUserInfoMutation = gql`
	mutation updateUserInfo($englishLevel: String, $technicalSkills: String, $cvLink: String) {
		updateUserInfo(englishLevel: $englishLevel, technicalSkills: $technicalSkills, cvLink: $cvLink) {
			message
			code
		}
	}
`;
