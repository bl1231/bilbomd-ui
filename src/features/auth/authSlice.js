import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, email: null, roles: null, token: null },
  reducers: {
    setCredentials: (state, action) => {
      const { user, email, roles, accessToken } = action.payload;
      state.user = user;
      state.email = email;
      state.roles = roles;
      state.token = accessToken;
    },
    logOut: (state, action) => {
      state.user = null;
      state.email = null;
      state.roles = null;
      state.token = null;
    }
  }
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentEmail = (state) => state.auth.email;
export const selectCurrentRoles = (state) => state.auth.roles;
export const selectCurrentToken = (state) => state.auth.token;
