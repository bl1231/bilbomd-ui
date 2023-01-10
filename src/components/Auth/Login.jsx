import { useRef, useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AccountContext } from './AccountContext';
import { Formik, Form } from 'formik';
import { userSignInSchema } from 'schemas/ValidationSchemas';
import useAuth from 'hooks/useAuth';
import useInput from 'hooks/useInput';
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

    const [user, resetUser, userAttribs] = useInput('user', '');

    const onSubmit = async (values, { setStatus }) => {
        console.log(values);
        //     setStatus({ success: "Splinching the data...", css: "sending" });
        await sleep(2000);
        //     setStatus({ success: "Email sent !", css: "success" });

        //     // REDIRECT HERE????? HOW????
        //     setError(null);
        //     setSuccess(true);
        //     resetForm();
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
                            <p>Need an account?</p>
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
