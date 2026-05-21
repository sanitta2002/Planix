import { combineReducers, configureStore } from "@reduxjs/toolkit";
import tokenReducer from "./tokenSlice";
import authReducer from "./authSlice";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import workspaceReducer from "./workspaceSlice";
import projectReducer from "./projectSlice"
import notificationReducer from "./notificationSlice";


const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};
const rootReducer = combineReducers({
  auth: authReducer,
  token: tokenReducer,
  workspace: workspaceReducer,
  project: projectReducer,
  notification: notificationReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const Store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistor = persistStore(Store);

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
