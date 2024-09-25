import { apiSlice } from 'app/api/apiSlice'

interface EmailData {
  username: string
  currentEmail: string
  newEmail: string
}

interface OtpData {
  username: string
  currentEmail: string
  newEmail: string
  otp: string
}

export const userAccountApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateEmail: builder.mutation<void, EmailData>({
      query: (emailData) => ({
        url: 'users/change-email',
        method: 'POST',
        body: emailData
      })
    }),
    verifyOtp: builder.mutation<void, OtpData>({
      query: (otpData) => ({
        url: '/users/verify-otp',
        method: 'POST',
        body: otpData
      })
    }),
    resendOtp: builder.mutation<void, EmailData>({
      query: (emailData) => ({
        url: '/users/resend-otp',
        method: 'POST',
        body: emailData
      })
    }),
    deleteUserByUserName: builder.mutation<void, string>({
      query: (username) => ({
        url: `users/delete-user-by-username/${username}`,
        method: 'DELETE'
      })
    })
  })
})

export const {
  useUpdateEmailMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useDeleteUserByUserNameMutation
} = userAccountApiSlice
