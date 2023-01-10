import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useInput from "../hooks/useInput";
import useToggle from "../hooks/useToggle";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "../api/axios";
const LOGIN_URL = "/auth";

const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const userRef = useRef();
    const errRef = useRef();

    const [user, resetUser, userAttribs] = useInput("user", "");
    const [pwd, setPwd] = useState("");
    // const [email, setEmail] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [check, toggleCheck] = useToggle("persist", false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [user, pwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL, JSON.stringify({ user, pwd }), {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ user, pwd, roles, accessToken });
            resetUser();
            setPwd("");
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg("No Server Response");
            } else if (err.response?.status === 400) {
                setErrMsg("Missing Username or Password");
            } else if (err.response?.status === 401) {
                setErrMsg("Unauthorized");
            } else {
                setErrMsg("Login Failed");
            }
            errRef.current.focus();
        }
    };

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <h2>Sign In</h2>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                    {errMsg}
                </p>
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="username" className="mt-4">
                        Username:
                    </Form.Label>
                    <Form.Control
                        type="text"
                        id="username"
                        placeholder="Enter username"
                        ref={userRef}
                        autoComplete="off"
                        {...userAttribs}
                        required
                    ></Form.Control>
                </Form.Group>
                <Form.Group className="mb-6">
                    <Form.Label htmlFor="password" className="mt-4">
                        Password:
                    </Form.Label>
                    <Form.Control
                        type="password"
                        id="password"
                        placeholder="Enter password"
                        autoComplete="off"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                    ></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check
                        type="checkbox"
                        label="Trust This Device"
                        onChange={toggleCheck}
                        checked={check}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Sign In
                </Button>
                <p>
                    Need an Account?
                    <br />
                    <span className="line">
                        <Link to="/register">Sign Up</Link>
                    </span>
                </p>
            </Form>
        </>
    );
};

export default Login;
