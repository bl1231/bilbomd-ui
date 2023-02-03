import axios from 'app/api/axios';
import useAuth from 'hooks/useAuth';

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      const response = await axios('/logout', {
        withCredentials: true
      });
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
