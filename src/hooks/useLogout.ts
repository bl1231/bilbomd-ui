import { useNavigate } from "react-router"
import { useSendLogoutMutation } from "features/auth/authApiSlice"

const useLogout = () => {
  const navigate = useNavigate()
  const [sendLogout] = useSendLogoutMutation()

  const logout = async () => {
    await sendLogout({})
    navigate("/")
  }

  return logout
}

export default useLogout
