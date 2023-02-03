import axios from 'app/api/axios';
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const VERIFY_URL = '/verify';

const VerifyUser = () => {
  let { code } = useParams();
  const data = JSON.stringify({ code });
  //console.log(data);

  const [verified, setVerified] = useState('');

  const verify = async (code) => {
    const response = await axios
      .post(VERIFY_URL, data, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })
      .catch((err) => {
        if (err?.response) {
          console.error(err.response);
        }
      });
    console.log(response);
    if (response?.data.status === 204) {
    }
    if (response?.data) {
      setVerified(true);
    }
  };

  // this should trigger once when page loads.
  //console.log('before useEffect');
  useEffect(() => {
    verify();
  }, []);
  //console.log('after useEffect');

  return (
    <>
      {verified ? (
        <verify>
          <div className="card text-white bg-success mb-3" style={{ maxWidth: '20rem' }}>
            <div className="card-header">Woot! &#128640;</div>
            <div className="card-body">
              <h4 className="card-title">Your email is verified</h4>
              <p className="card-text">
                Please login by obtaining a <strong>MagicLink</strong>&#8482;
              </p>
              <Link to="/magicklink">
                <button type="button" class="btn btn-primary">
                  Get <strong>MagicLink</strong>&#8482;
                </button>
              </Link>
            </div>
          </div>
        </verify>
      ) : (
        <verify>
          <div className="card text-white bg-warning mb-3" style={{ maxWidth: '20rem' }}>
            <div className="card-header">Nope</div>
            <div className="card-body">
              <h4 className="card-title">Verification Failed</h4>
              <p className="card-text">
                You may have used an outdated token. Please visit the <a href="/login">login</a>{' '}
                page and try again.
              </p>
            </div>
          </div>
        </verify>
      )}
    </>
  );
};

export default VerifyUser;
