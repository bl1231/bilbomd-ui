import React, { createContext, useState } from 'react';
import { AccountContext } from './AccountContext';
import LoginForm from './Login';
import SignupForm from './Signup';
import { Navigate } from 'react-router-dom';

const Account = () => {
    const [isExpanded, setExpanded] = useState(false);
    const [active, setActive] = useState('signin');
    const [success, setSuccess] = useState(false);

    const fwdSuccess = () => {
        setTimeout(() => setSuccess(true), 400);
    };

    const switchActive = (active) => {
        setTimeout(() => setActive(active), 400);
    };

    const switchToSignup = () => {
        switchActive('signup');
    };

    const switchToSignin = () => {
        switchActive('signin');
    };

    const contextValue = {
        switchToSignup,
        switchToSignin,
        fwdSuccess
    };

    return (
        <AccountContext.Provider value={contextValue}>
            {active === 'signin' && (
                <>
                    <h1>Enter your email address to sign in to BilboMD.</h1>
                </>
            )}
            {active === 'signup' && (
                <>
                    <h1>Create your BilboMD Account.</h1>
                </>
            )}
            {active === 'signin' && <LoginForm />}
            {active === 'signup' && <SignupForm />}
        </AccountContext.Provider>
    );
};

export default Account;
