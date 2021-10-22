import { gql } from "@apollo/client";
import { ResponseMessage, UsersQueryResponse, User } from "@mindu-second-challenge/apollo-server-types";

export interface CreateUserResponse {
	createUser: ResponseMessage;
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

export interface UsersResponse {
	users: UsersQueryResponse;
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
				latestPositions {
					account {
						name
					}
					position
					initDate
					endDate
				}
			}
			totalUsers
		}
	}
`;

export interface DeleteUsersResponse {
	deleteUsers: ResponseMessage;
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

export interface UpdateUserResponse {
	updateUser: ResponseMessage;
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
