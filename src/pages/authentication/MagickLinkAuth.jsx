import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
//import useAuth from 'hooks/useAuth';
//import Dashboard from 'components/Dashboard';
//import axios from 'api/axios';

// for new redux-jwt-auth
import { useDispatch } from 'react-redux';
import { setCredentials } from 'store/reducers/authSlice';
import { useLoginMutation } from 'store/reducers/authApiSlice';
import { Alert, AlertTitle } from '@mui/material';

//const LOGIN_URL = '/auth/otp';

// Should check OTP and then forward authenticated user on to the Dashboard
const MagickLinkAuth = () => {
  let { otp } = useParams();
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  //const { setAuth, persist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const effectRan = useRef(false);

  useEffect(() => {
    console.log('MagickLinkAuth useEffect ran');
    console.log('MagickLinkAuth NODE_ENV:', process.env.NODE_ENV);

    if (effectRan.current === false) {
      const authenticateOTP = async () => {
        try {
          const userData = await login({ otp }).unwrap();
          console.log(userData);
          dispatch(setCredentials({ ...userData }));
          navigate('/welcome');
        } catch (err) {
          if (!err?.originalStatus) {
            // isLoading: true until timeout occurs
            setError('No Server Response');
          } else if (err.originalStatus === 400) {
            setError('Missing Username or Password');
          } else if (err.originalStatus === 401) {
            setError('Unauthorized');
          } else {
            setError('Login Failed');
          }
          // errRef.current.focus();
        }
        // navigate(from, { replace: true });
      };
      authenticateOTP();
      return () => {
        console.log('MagickLinkAuth unmounted');
        effectRan.current = true;
      };
    }
  }, []);

  const content = isLoading ? (
    <h1>Loading...</h1>
  ) : success ? (
    <Alert severity="success">
      <AlertTitle>Woot!</AlertTitle>Your OTP has been successfully validated.
      Come on in.
    </Alert>
  ) : (
    <Alert severity="warning">
      <AlertTitle>Warning!</AlertTitle>Hmmmmm. Maybe your MagickLink&#8482; has
      expired? Please try{' '}
      <a href="http://localhost:3001/magicklink">generating another</a>. If that
      doesn't work please contact us.
      <p>{error}</p>
    </Alert>
  );

  return content;
};

export default MagickLinkAuth;
