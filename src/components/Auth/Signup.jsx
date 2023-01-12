import React, { useContext, useState } from 'react';
//import { AccountContext } from './AccountContext';
import { Formik, Form } from 'formik';
import { userRegisterSchema } from 'schemas/ValidationSchemas';
import CustomFormInputs from './CustomFormInputs';
//import RegisterSuccess from "./RegisterSuccess";
//import { Debug } from './Debug';
import axios from 'api/axios';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

const REGISTER_URL = '/register';

const Signup = () => {
    //const { switchToSignin } = useContext(AccountContext);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState('');

    //const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const onSubmit = async (values, { setStatus, resetForm, setSubmitting, setErrors }) => {
        //console.log('VALUES:', values);

        setStatus({ success: 'Splinching the data...', css: 'sending' });

        const response = await axios
            .post(REGISTER_URL, values, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            .catch((err) => {
                if (!err?.response) {
                    setError({ message: 'No Server Response' });
                } else if (err?.response?.status === 409) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    setError({ message: 'User Name or Email Already Registered.' });
                    setSuccess(null);
                    setStatus({ error: err, css: 'error' });
                    console.log(err.response.data);
                    console.log(err.response.status);
                    console.log(err.response.headers);
                } else {
                    setError({ message: 'Registration Failed!' });
                }
            });

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
                <div className="alert alert-success" role="alert">
                    <h4 className="alert-heading">Woot!</h4>
                    <p>
                        Aww yeah, you successfully read this important alert message. This example
                        text is going to run a bit longer so that you can see how spacing within an
                        alert works with this kind of content.
                    </p>
                    <hr />
                    <p className="mb-0">
                        Whenever you need to, be sure to use margin utilities to keep things nice
                        and tidy.
                    </p>
                </div>
            ) : (
                <Formik
                    initialValues={{ user: '', email: '' }}
                    validationSchema={userRegisterSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting, status }) => (
                        <Form>
                            <CustomFormInputs
                                label="User Name"
                                name="user"
                                type="text"
                                placeholder="pick username"
                            />
                            <CustomFormInputs
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="enter email address"
                            />
                            {error ? (
                                <Alert variant="danger" onClose={() => setError('')} dismissible>
                                    <Alert.Heading>{error.message}</Alert.Heading>
                                    If you think you already have an account try{' '}
                                    <a href="/account" className="alert-link">
                                        logging in
                                    </a>
                                </Alert>
                            ) : (
                                ''
                            )}

                            <button
                                className="btn btn-primary"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                Create account
                            </button>
                            <p>Already have an account?</p>
                            <Link to="/login">
                                <button type="button" className="btn btn-secondary">
                                    Sign In
                                </button>
                            </Link>
                        </Form>
                    )}
                </Formik>
            )}
        </>
    );
};

export default Signup;
