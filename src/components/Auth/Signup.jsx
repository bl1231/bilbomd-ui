import { useState } from 'react';
import { Formik, Form } from 'formik';
import { userRegisterSchema } from 'schemas/ValidationSchemas';
import CustomFormInputs from './CustomFormInputs';
//import { Debug } from './Debug';
import axios from 'api/axios';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

const REGISTER_URL = '/register';

const Signup = () => {
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState('');

    const onSubmit = async (values, { setStatus, resetForm, setSubmitting, setErrors }) => {
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
                        You have been registered for an account. Before you can log in we need you
                        to verify your email. Please check your inbox for a verification email from
                        <br />
                        <span className="text-primary">bilbomd-noreply@bl1231.als.lbl.gov</span>.
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
