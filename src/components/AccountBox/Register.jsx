import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { userRegisterSchema } from "schemas/RegisterUserSchema";
import RegisterInputs from "./RegisterInputs";

import { Debug } from "./Debug";
import axios from "../../api/axios";
const REGISTER_URL = "/register";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const OnSubmit = async (values, { setStatus, resetForm, setSubmitting, setErrors }) => {
    const navigate = useNavigate();
    console.log(values);
    try {
        setStatus({ success: "Splinching the data...", css: "sending" });
        const response = await axios.post(REGISTER_URL, values, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
        });
        if (response.status === 200) {
            setStatus({ success: "Email sent !", css: "success" });
            navigate("/register/success");
            resetForm();
        }
        setSubmitting(false);
        resetForm();
        console.log(JSON.stringify(response?.data));
    } catch (err) {
        if (!err?.response) {
            console.error("No Server Response");
        } else if (err.response?.status === 409) {
            console.log("Username Taken");
            setErrors("Username Taken");
        } else {
            console.log("Registration Failed");
        }
    }
};

const testOnSubmit = async (values, { setStatus, resetForm, setSubmitting, setErrors }) => {
    console.log(values);

    setStatus({ success: "Splinching the data...", css: "sending" });
    await sleep(2000);
    setStatus({ success: "Email sent !", css: "success" });
    await sleep(2000);
    // REDIRECT HERE????? HOW????
    resetForm();
};

const Register = () => {
    return (
        <>
            <Formik
                initialValues={{ user: "", email: "" }}
                validationSchema={userRegisterSchema}
                onSubmit={testOnSubmit}
            >
                {({ isSubmitting, status }) => (
                    <Form>
                        <p>{status ? status.success : "NOPE"}</p>
                        <RegisterInputs
                            label="User Name"
                            name="user"
                            type="text"
                            placeholder="pick username"
                        />
                        <RegisterInputs
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="enter email address"
                        />
                        <div className={`form-sending ${status ? status.css : ""}`}>
                            {status ? status.success : ""}
                        </div>
                        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                            Submit
                        </button>
                        <Debug />
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default Register;
