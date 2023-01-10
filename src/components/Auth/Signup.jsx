import React, { useContext, useState } from 'react';
import { AccountContext } from './AccountContext';
import { Formik, Form } from 'formik';
import { userRegisterSchema } from 'schemas/ValidationSchemas';
import CustomFormInputs from './CustomFormInputs';
//import RegisterSuccess from "./RegisterSuccess";
//import { Debug } from './Debug';
import axios from '../../api/axios';
//import { Link } from 'react-router-dom';

const REGISTER_URL = '/register';

const SignupForm = () => {
    const { switchToSignin } = useContext(AccountContext);
    const [success, setSuccess] = useState(false);
    const [msg, setMsg] = useState('');
    const [error, setError] = useState(null);

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // const testOnSubmit = async (values, { setStatus, resetForm, setSubmitting, setErrors }) => {
    //     console.log(values);
    //     setStatus({ success: "Splinching the data...", css: "sending" });
    //     await sleep(2000);
    //     setStatus({ success: "Email sent !", css: "success" });

    //     // REDIRECT HERE????? HOW????
    //     setError(null);
    //     setSuccess(true);
    //     resetForm();
    // };
    const onSubmit = async (values, { setStatus, resetForm, setSubmitting, setErrors }) => {
        console.log(values);

        setStatus({ message: 'Splinching the data...', css: 'sending' });

        const response = await axios
            .post(REGISTER_URL, values, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            .catch((err) => {
                if (err?.response) setError(err.response.data.message);
                setSuccess(false);
                setErrors(err);
            });
        await sleep(2000);
        if (response.status === 201) {
            setStatus({ success: 'Email sent !', css: 'success' });
            setSuccess(true);
            resetForm();
        }
        setSubmitting(false);
        resetForm();
        console.log(JSON.stringify(response?.data));
    };

    return (
        <>
            {success ? (
                <section>
                    <h1>You are registered!</h1>
                    <p>Please check your email for an authorization link.</p>
                    <p>
                        <a href="/">Go to Home</a>
                    </p>
                </section>
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
                            <div className={`form-sending ${status ? status.css : ''}`}>
                                {status ? status.success : ''}
                            </div>
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
