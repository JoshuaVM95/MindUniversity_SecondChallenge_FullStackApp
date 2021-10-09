import { Role } from "../../types";

export interface CurrentUserState {
	jwt?: string;
	firstName?: string;
	lastName?: string;
	role?: Role;
}

export enum CurrenUserActionType {
	SET_CURRENT_USER = "SET_CURRENT_USER",
	CLEAR_CURRENT_USER = "CLEAR_CURRENT_USER"
}

export interface setCurrentUser {
	type: CurrenUserActionType.SET_CURRENT_USER;
	payload: CurrentUserState;
}

export interface clearCurrentUser {
	type: CurrenUserActionType.CLEAR_CURRENT_USER;
}

export type CurrentUserAction = setCurrentUser | clearCurrentUser;
