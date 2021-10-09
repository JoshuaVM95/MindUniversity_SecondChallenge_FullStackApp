import { createStore, combineReducers } from "redux";
import { currentUserReducer } from "./currentUser/reducer";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";

const persistConfig = {
	key: "session",
	storage: storageSession,
	whitelist: ["currentUser"]
};

const rootReducer = combineReducers({
	currentUser: currentUserReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
