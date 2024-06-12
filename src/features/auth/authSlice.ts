import { createSlice } from '@reduxjs/toolkit'

// could add interface to make TS happy
interface AuthState {
  token: null
}

const initialState: AuthState = {
  token: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken } = action.payload
      state.token = accessToken
    },
    logOut: (state) => {
      state.token = null
    }
  }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state: { auth: { token } }) => state.auth.token
