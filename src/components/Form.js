import React, { useState, useEffect } from "react";
// import ReactDOM from "react-dom";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

function LoginForm({ values, errors, touched, isSubmitting, status }) {
    const [users, setUsers] = useState([]);
    console.log(users);

    useEffect(() => {
        if (status) {
            setUsers([...users, status]);
        }
    }, [status]);

    return (
        <div className="login-form">
            <h1>Onboarding Form</h1>
            <Form>
                <div>
                    <Field type="name" name="name" placeholder="Name" />
                    {touched.name && errors.name && (
                        <p className="error">{errors.name}</p>
                    )}
                </div>
                <div>
                    <Field type="email" name="email" placeholder="Email" />
                    {touched.email && errors.email && <p className="error">{errors.email}</p>}
                </div>
                <div>
                    <Field type="password" name="password" placeholder="Password" />
                    {touched.password && errors.password && <p className="error">{errors.password}</p>}
                </div>
                <Field component="select" className="food-select" name="role">
                    <option>Please Choose an Option</option>
                    <option value="frontend">Front End Engineer</option>
                    <option value="backend">Back End Engineer</option>
                    <option value="uxdesign">UX Designer</option>
                </Field>
                <label className="checkbox-container">
                    Accept Terms of Service
                <Field type="checkbox" name="tos" checked={values.tos} />
                    <span className="checkmark" />
                </label>
                <button type="submit" disabled={isSubmitting}>Submit</button>
            </Form>
            {users.map(user => {
                return (
                    <div>
                        <h1 key={user.id}>{user.name}</h1>
                        <p>{user.email}</p>
                        <p>{user.role}</p>
                    </div>
                )
            }

            )}
        </div>
    );
}

const FormikLoginForm = withFormik({
    mapPropsToValues({ name, email, password, tos, role }) {
        return {
            name: name || "",
            email: email || "",
            password: password || "",
            tos: tos || false,
            role: role || ""
        };
    },
    validationSchema: Yup.object().shape({
        name: Yup.string(),
        email: Yup.string()
            .email("Email not valid")
            .required("Email is required"),
        password: Yup.string()
            .min(8, "Password must be 8 characters or longer")
            .required("Password is required"),
        tos: Yup.bool(),
        
    }),
    handleSubmit(values, { setStatus, resetForm, setErrors, setSubmitting }) {
        if (values.email === "waffle@syrup.com@atb.dev") {
            setErrors({ email: "That email is already taken." });
        } else {
            axios
                .post("https://reqres.in/api/users", values)
                .then(res => {
                    console.log(res);
                    setStatus(res.data) // Data was created successfully and logs to console
                    resetForm();
                    setSubmitting(false);
                })
                .catch(err => {
                    console.log(err); // There was an error creating the data and logs to console
                    setSubmitting(false);
                });
        }
    }
})(LoginForm);

export default FormikLoginForm;