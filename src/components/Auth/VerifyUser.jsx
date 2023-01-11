import axios from 'api/axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const VERIFY_URL = '/verify';

const VerifyUser = () => {
    let { code } = useParams();
    const data = JSON.stringify({ code });
    console.log(data);

    const [verified, setVerified] = useState('');

    const verify = async (code) => {
        const response = await axios
            .post(VERIFY_URL, data, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            .catch((err) => {
                if (err?.response) {
                    console.log(err.response);
                }
            });
        if (response?.data) {
            setVerified(true);
        }
    };

    // this should trigger once when page loads
    useEffect(() => {
        let verified = false;

        if (!verified) verify();
        return () => {
            verified = false;
        };
    }, []);

    return (
        <>
            <div>
                <p>Hola!</p>
            </div>
        </>
    );
};

export default VerifyUser;
