import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
//import { AccountContext } from './AccountContext';
import { Formik, Form } from 'formik';
import { userSignInSchema } from 'schemas/ValidationSchemas';
// our hooks
import useAuth from 'hooks/useAuth';
//import useInput from 'hooks/useInput';
//import useToggle from 'hooks/useToggle';
import axios from 'api/axios';
import CustomFormInputs from './CustomFormInputs';
import Dashboard from 'components/Dashboard';
import Alert from 'react-bootstrap/Alert';
const LOGIN_URL = '/auth';

const Login = () => {
    //const { switchToSignup } = useContext(AccountContext);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    //const [errMsg, setErrMsg] = useState('');
    //const { setAuth, persist, setPersist } = useAuth();
    const { setAuth, persist } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const onSubmit = async (values, { setStatus, resetForm, setSubmitting, setErrors }) => {
        setStatus({ message: 'Generating magic link...', css: 'sending' });
        const response = await axios
            .post(LOGIN_URL, values, {
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
        //console.log(response);
        if (response.status === 200) {
            const user = response?.data?.user;
            const email = response?.data?.email;
            const roles = response?.data?.roles;
            const accessToken = response?.data?.accessToken;
            console.log('got 200:', { roles, accessToken });
            setAuth({ user, email, roles, accessToken });
            //resetUser();
            //setPwd('');
            navigate(from, { replace: true });
        }
        setSubmitting(false);
        resetForm();
        console.log(JSON.stringify(response?.data));
    };

    // const togglePersist = () => {
    //     setPersist((prev) => !prev);
    // };

    useEffect(() => {
        localStorage.setItem('persist', persist);
    }, [persist]);

    return (
        <>
            {success ? (
                <Dashboard />
            ) : (
                <Formik
                    initialValues={{ email: '' }}
                    validationSchema={userSignInSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting, status }) => (
                        <>
                            <h1>Login</h1> -{' '}
                            <p>this route should be removed once we have MagickLink OTP working.</p>
                            <Form>
                                <CustomFormInputs
                                    label="Email address"
                                    name="email"
                                    type="email"
                                    placeholder="enter email address"
                                />
                                {error ? (
                                    <Alert
                                        variant="danger"
                                        onClose={() => setError(false)}
                                        dismissible
                                    >
                                        <Alert.Heading>{error.message}</Alert.Heading>
                                        <p>Please create an account first.</p>
                                    </Alert>
                                ) : (
                                    ''
                                )}
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    Continue
                                </button>
                                <span type="line"></span>
                                <Link to="/register">
                                    <button type="button" className="btn btn-secondary">
                                        Create an account
                                    </button>
                                </Link>
                            </Form>
                        </>
                    )}
                </Formik>
            )}
        </>
    );
};

export default Login;
