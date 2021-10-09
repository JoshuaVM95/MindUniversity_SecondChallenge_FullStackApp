import { CurrentUserState, CurrentUserAction, CurrenUserActionType } from "./types";

export const setCurrentUser = (user: CurrentUserState): CurrentUserAction => {
	return {
		type: CurrenUserActionType.SET_CURRENT_USER,
		payload: user
	};
};

export const clearCurrentUser = (): CurrentUserAction => {
	return {
		type: CurrenUserActionType.CLEAR_CURRENT_USER
	};
};
