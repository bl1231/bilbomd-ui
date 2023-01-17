import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import Dashboard from 'components/Dashboard';
import axios from 'api/axios';
const LOGIN_URL = '/auth/otp';
// Should check OTP and then forward authenticated user on to the Dashboard
const MagickLinkAuth = () => {
    let { otp } = useParams();
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState('');
    const { setAuth, persist } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const effectRan = useRef(false);

    useEffect(() => {
        console.log('MagickLinkAuth useEffect ran');
        console.log('MagickLinkAuth NODE_ENV:', process.env.NODE_ENV);

        if (effectRan.current === false) {
            const authenticateOTP = async () => {
                const response = await axios
                    .post(LOGIN_URL, JSON.stringify({ otp }), {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true
                    })
                    .catch((err) => {
                        if (err?.response) {
                            setError({ message: 'No Server Response' });
                        } else if (err.response?.status === 400) {
                            setError({ message: 'No Account with that email. ' });
                        } else if (err.response?.status === 401) {
                            setError({ message: 'Unauthorized ' });
                        } else {
                            setError({ message: 'Login Failed ' });
                        }
                        setSuccess(false);
                    });
                if (response?.status === 200) {
                    const user = response?.data?.user;
                    const email = response?.data?.email;
                    const roles = response?.data?.roles;
                    const accessToken = response?.data?.accessToken;
                    console.log('got 200:', { roles, accessToken });
                    setAuth({ user, email, roles, accessToken });
                    navigate(from, { replace: true });
                }
            };
            authenticateOTP();
            return () => {
                console.log('MagickLinkAuth unmounted');
                effectRan.current = true;
            };
        }
    }, []);

    return (
        <>
            {success ? (
                <p>worked</p>
            ) : (
                <div className="alert alert-warning" role="alert">
                    <h4 className="alert-heading">Warning!</h4>
                    <p>
                        Hmmmmm. Maybe your MagickLink&#8482; has expired? Please try{' '}
                        <a href="http://localhost:3001/magicklink">generating another</a>. If that
                        doesn't work please contact us.
                    </p>
                </div>
            )}
        </>
    );
};

export default MagickLinkAuth;
