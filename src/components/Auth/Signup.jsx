import React, { useContext, useState } from 'react';
import { AccountContext } from './AccountContext';
import { Formik, Form } from 'formik';
import { userRegisterSchema } from 'schemas/ValidationSchemas';
import CustomFormInputs from './CustomFormInputs';
//import RegisterSuccess from "./RegisterSuccess";
//import { Debug } from './Debug';
import axios from 'api/axios';
//import { Link } from 'react-router-dom';

const REGISTER_URL = '/register';

const SignupForm = () => {
    const { switchToSignin } = useContext(AccountContext);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState('');

    //const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const onSubmit = async (values, { setStatus, resetForm, setSubmitting, setErrors }) => {
        console.log('VALUES:', values);

        setStatus({ success: 'Splinching the data...', css: 'sending' });

        const response = await axios
            .post(REGISTER_URL, values, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            .catch((err) => {
                if (err?.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    setError({ message: 'Duplicate User Name or Email. ' });
                    setSuccess(null);
                    setStatus({ error: err, css: 'error' });
                    console.log(err.response.data);
                    console.log(err.response.status);
                    console.log(err.response.headers);
                }
            });
        console.log('RES', response);

        // all good. We got a response from server
        if (response?.data) {
            setError(null);
            setSuccess(response.data.success);
            setSubmitting(false);
            resetForm();
        }
    };

    return (
        <>
            {success ? (
                <div className="alert alert-dismissible alert-success">
                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                    <strong>Woot!</strong> You've been registered for a BilboMD account. Please check your email for a
                    sign in link.
                </div>
            ) : (
                <Formik
                    initialValues={{ user: '', email: '' }}
                    validationSchema={userRegisterSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting, status }) => (
                        <Form>
                            <CustomFormInputs label="User Name" name="user" type="text" placeholder="pick username" />
                            <CustomFormInputs
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="enter email address"
                            />
                            {error ? (
                                <div className="alert alert-dismissible alert-danger">
                                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                    <strong>{error.message}</strong>
                                    Please
                                    <a href="/account" class="alert-link">
                                        Try again
                                    </a>{' '}
                                    If you think you already have an account try{' '}
                                    <a href="/account" class="alert-link">
                                        logging in
                                    </a>
                                    .
                                </div>
                            ) : (
                                ''
                            )}

                            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                                Create account
                            </button>
                            <p>Already have an account?</p>
                            <button className="btn btn-secondary" type="button" onClick={switchToSignin}>
                                Login
                            </button>
                        </Form>
                    )}
                </Formik>
            )}
        </>
    );
};

export default SignupForm;
