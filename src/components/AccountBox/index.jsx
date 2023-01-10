import React, { createContext, useState } from "react";
import { AccountContext } from "./AccountContext";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { Navigate } from "react-router-dom";

const AccountBox = () => {
    const [isExpanded, setExpanded] = useState(false);
    const [active, setActive] = useState("signup");
    const [success, setSuccess] = useState(false);

    const fwdSuccess = () => {
        setTimeout(() => setSuccess(true), 400);
    };

    const switchActive = (active) => {
        setTimeout(() => setActive(active), 400);
    };

    const switchToSignup = () => {
        switchActive("signup");
    };

    const switchToSignin = () => {
        switchActive("signin");
    };

    const contextValue = {
        switchToSignup,
        switchToSignin,
        fwdSuccess,
    };

    return (
        <AccountContext.Provider value={contextValue}>
            {active === "signin" && (
                <>
                    <h1>Please sign-in to continue!</h1>
                </>
            )}
            {active === "signup" && (
                <>
                    <h1>Signup for BilboMD Account</h1>
                </>
            )}
            {active === "signin" && <LoginForm />}
            {active === "signup" && <SignupForm />}
        </AccountContext.Provider>
    );
};

export default AccountBox;
