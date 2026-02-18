import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  isEmailVerified?: boolean;
  avatarUrl?: string;
  role: "USER" | "ADMIN";
 hasPassword?: boolean
}
interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateAvatar(state, action: PayloadAction<string>) {
      if (state.user) {
        state.user.avatarUrl = action.payload;
      }
    },
  },
});

export const { setAuthUser, clearAuth, updateAvatar } = authSlice.actions;
export default authSlice.reducer;
