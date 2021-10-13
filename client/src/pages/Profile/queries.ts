import { gql } from "@apollo/client";
import { Position } from "../../types";

interface LatestPosition {
	account: {
		name: string;
		client: string;
	};
	position: Position;
	initDate: string;
	endDate?: string;
}
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
		updatedBy: {
			id: string;
			userInfo?: {
				firstName: string;
				lastName: string;
			};
		};
		updatedAt: string;
		isAdmin: boolean;
		englishLevel: string;
		technicalSkills: string;
		cvLink: string;
	};
	isSuper: boolean;
	createdAt: string;
	latestPositions: LatestPosition[];
}
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
					userInfo {
						firstName
						lastName
					}
				}
				updatedBy {
					id
					userInfo {
						firstName
						lastName
					}
				}
				updatedAt
				isAdmin
				englishLevel
				technicalSkills
				cvLink
			}
			isSuper
			createdAt
			latestPositions {
				account {
					name
					client
				}
				position
				initDate
				endDate
			}
		}
	}
`;
