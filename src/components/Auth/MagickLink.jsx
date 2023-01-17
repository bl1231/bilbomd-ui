import { useState } from 'react';
import { Formik, Form } from 'formik';
import { userSignInSchema } from 'schemas/ValidationSchemas';
import axios from 'api/axios';
import CustomFormInputs from './CustomFormInputs';
import Alert from 'react-bootstrap/Alert';

const MAGICKLINK_URL = '/magicklink';

const MagickLink = () => {
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState('');

    const onSubmit = async (values, { setStatus, resetForm, setSubmitting }) => {
        setStatus({ success: 'Splinching the data...', css: 'sending' });
        const response = await axios
            .post(MAGICKLINK_URL, values, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            .catch((err) => {
                if (!err?.response) {
                    setError({ messge: 'No Server Response' });
                } else if (err?.response?.status) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    setError({ message: 'You must register and verify your email first.' });
                    setSuccess(null);
                    setStatus({ error: err, css: 'error' });
                    console.log(err.response.data);
                    console.log(err.response.status);
                    console.log(err.response.headers);
                }
            });
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
                        A MagickLink&#8482; has been generated and sent to your email address.
                        Please check your inbox.
                    </p>
                </div>
            ) : (
                <Formik
                    initialValues={{ email: '' }}
                    validationSchema={userSignInSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <CustomFormInputs
                                label="Email Address"
                                name="email"
                                type="email"
                                placeholder="enter email address"
                            />
                            {error ? (
                                <Alert variant="danger" onClose={() => setError('')} dismissible>
                                    <Alert.Heading>{error.message}</Alert.Heading>
                                    If you need an account please{' '}
                                    <a href="/register" className="alert-link">
                                        register
                                    </a>{' '}
                                    first.
                                </Alert>
                            ) : (
                                ''
                            )}
                            <button
                                className="btn btn-primary"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                Send my MagickLink&#8482;
                            </button>
                        </Form>
                    )}
                </Formik>
            )}
        </>
    );
};

export default MagickLink;
