import { gql } from "@apollo/client";
import { GenericResponse } from "../../types";

export interface CreateUserResponse {
	createUser: GenericResponse;
}
export const CreateUserMutation = gql`
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

interface User {
	id: string;
	email: string;
	userInfo?: {
		firstName: string;
		lastName: string;
		createdBy: {
			id: string;
			userInfo?: {
				firstName: string;
				lastName: string;
			};
		};
		isAdmin: boolean;
	};
	isSuper: boolean;
	createdAt: string;
}
export interface UsersResponse {
	users: {
		users: User[];
		totalUsers: number;
	};
}
export const UsersQuery = gql`
	query users($filterByEmail: String!, $page: Int!, $rowsPerPage: Int!) {
		users(filterByEmail: $filterByEmail, page: $page, rowsPerPage: $rowsPerPage) {
			users {
				id
				email
				userInfo {
					firstName
					lastName
					createdBy {
						id
						userInfo {
							firstName
							lastName
						}
					}
					isAdmin
				}
				isSuper
				createdAt
			}
			totalUsers
		}
	}
`;

export interface DeleteUsersResponse {
	deleteUsers: GenericResponse;
}
export const DeleteUsersMutation = gql`
	mutation deleteUsers($userIds: [String!]!) {
		deleteUsers(userIds: $userIds) {
			message
			code
		}
	}
`;

export interface UserResponse {
	user: User;
}
export const UserQuery = gql`
	query user($userId: String!) {
		user(userId: $userId) {
			id
			email
			userInfo {
				firstName
				lastName
				createdBy {
					id
					email
				}
				isAdmin
			}
			isSuper
			createdAt
		}
	}
`;

export interface UpdateUserVariables {
	userId: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	password?: string;
	isAdmin?: boolean;
}
export interface UpdateUserResponse {
	updateUser: GenericResponse;
}
export const UpdateUserMutation = gql`
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
