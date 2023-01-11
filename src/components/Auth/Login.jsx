import { useRef, useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AccountContext } from './AccountContext';
import { Formik, Form } from 'formik';
import { userSignInSchema } from 'schemas/ValidationSchemas';
import useAuth from 'hooks/useAuth';
import useInput from 'hooks/useInput';
import useToggle from 'hooks/useToggle';
import axios from 'api/axios';
import CustomFormInputs from './CustomFormInputs';

const LOGIN_URL = '/auth';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Login = () => {
    const { switchToSignup } = useContext(AccountContext);
    const [success, setSuccess] = useState(false);

    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const userRef = useRef();
    const errRef = useRef();

    //const [user, resetUser, userAttribs] = useInput('user', '');

    const [email, setEmail] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [check, toggleCheck] = useToggle('persist', false);

    // useEffect(() => {
    //     userRef.current.focus();
    // }, []);

    const onSubmit = async (values, { setStatus, resetForm, setSubmitting, setErrors }) => {
        setStatus({ message: 'Generating magic link...', css: 'sending' });
        const response = await axios
            .post(LOGIN_URL, values, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            .catch((err) => {
                if (err?.response) setErrMsg(err.response.data.message);
                setSuccess(false);
                setErrors(err);
            });
        console.log(response);
        if (response.status === 200) {
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ email, roles, accessToken });
            //resetUser();
            //setPwd('');
            navigate(from, { replace: true });
        }
        setSubmitting(false);
        resetForm();
        console.log(JSON.stringify(response?.data));
    };

    return (
        <>
            {success ? (
                <section>
                    <p>SUCCESS</p>
                </section>
            ) : (
                <Formik initialValues={{ email: '' }} validationSchema={userSignInSchema} onSubmit={onSubmit}>
                    {({ isSubmitting, status }) => (
                        <Form>
                            <CustomFormInputs
                                label="Email address"
                                name="email"
                                type="email"
                                placeholder="enter email address"
                            />
                            <div className={`form-sending ${status ? status.css : ''}`}>
                                {status ? status.success : ''}
                            </div>
                            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                                Continue
                            </button>
                            <button className="btn btn-secondary" type="button" onClick={switchToSignup}>
                                Create an account
                            </button>
                        </Form>
                    )}
                </Formik>
            )}
        </>
    );
};

export default Login;
