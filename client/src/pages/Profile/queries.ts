import { gql } from "@apollo/client";
import { ResponseMessage, User } from "@mindu-second-challenge/apollo-server-types";

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

export interface UpdateUserInfoResponse {
	updateUserInfo: ResponseMessage;
}
export const UpdateUserInfoMutation = gql`
	mutation updateUserInfo($englishLevel: String, $technicalSkills: String, $cvLink: String) {
		updateUserInfo(englishLevel: $englishLevel, technicalSkills: $technicalSkills, cvLink: $cvLink) {
			message
			code
		}
	}
`;
