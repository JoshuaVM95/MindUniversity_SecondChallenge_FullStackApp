import { CurrentUserState, CurrentUserAction, CurrenUserActionType } from "./types";

const initialState: CurrentUserState = {
	jwt: undefined,
	exp: undefined,
	userId: undefined,
	firstName: undefined,
	lastName: undefined,
	role: undefined
};

export const currentUserReducer = (state = initialState, action: CurrentUserAction): CurrentUserState => {
	switch (action.type) {
		case CurrenUserActionType.SET_CURRENT_USER:
			return {
				...action.payload
			};
		case CurrenUserActionType.CLEAR_CURRENT_USER:
			return {
				...initialState
			};
		default:
			return state;
	}
};
