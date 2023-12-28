import React, { lazy, useState } from 'react'
import "../../scss/auth/auth.css";
import waveImg from "../../assets/images/bgWaves.png";
import { Form, Formik } from 'formik';
import * as Yup from "yup";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastWrapper, showErrorToast, showSuccessToast } from '../../common/customToast';
import { useDispatch } from 'react-redux';
import { setAccessToken, setRefreshToken } from '../../Redux/authSlice';
import Cookies from 'js-cookie';
const Input = lazy(() => import('../../common/Input'));
const Button = lazy(() => import('../../common/Button'));

// yup schema for authentication form validation
const signInSchema = Yup.object().shape({
    email: Yup.string().email("Please enter valid email address").required("Please enter email address"),
    password: Yup.string().min(7, 'Password is too short').required('Please enter your password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, "Must contain 8 characters, one uppercase, one lowercase, one number and one special case character"),
});

const SignIn = () => {
    const [loader, setLoader] = useState(false);
    const [check, setCheck] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // get cookie
    const myEmail = Cookies.get('myEmail');
    const myPwd = Cookies.get('myPwd');

    // Authentication form submit handler api
    const submitHandler = async (values) => {
        const payload = {
            ...values,
            email: values?.email?.toLowerCase().trim()
        };
        setLoader(true);
        await axios({
            method: "POST",
            url: process.env.REACT_APP_BASE_URL + process.env.REACT_APP_LOGIN_API,
            data: payload
        }).then(response => {
            if (check) {
                Cookies.set('myEmail', payload.email, { expires: 7 });
                Cookies.set('myPwd', payload.password, { expires: 7 });
            }
            dispatch(setAccessToken(response?.data?.access))
            dispatch(setRefreshToken(response?.data?.refresh))
            localStorage.setItem("token", response?.data?.access);
            localStorage.setItem("refreshToken", response?.data?.refresh);
            showSuccessToast(response?.data?.message);
            setTimeout(() => navigate("/"), 800);

        }).catch(error => showErrorToast(error?.response?.data?.error))
        .finally(() => setLoader(false))
    }

    return (
        <>
            <div className='auth_wrapper'>
                <div className='form_wrapper'>
                    <h1>Sign in</h1>

                    {/* Formik authentication form */}
                    <Formik
                        initialValues={{
                            email: myEmail || "",
                            password: myPwd || ""
                        }}
                        onSubmit={submitHandler}
                        validationSchema={signInSchema}
                    >
                        {({ errors, touched, isValid }) => (
                            <Form>
                                {/* Common Input Components */}
                                <Input
                                    type='email'
                                    name='email'
                                    placeholder='Email'
                                    errors={errors.email}
                                    touched={touched.email}
                                />
                                <Input
                                    type='password'
                                    name='password'
                                    placeholder='Password'
                                    errors={errors.password}
                                    touched={touched.password}
                                />

                                <div className='remember_me'>
                                    <input type="checkbox" value={check} onChange={(e) => setCheck(e?.target?.value)} />
                                    <p className='small'>Remember me</p>
                                </div>

                                <div className="submitBtn_wrapper">
                                    {/* Common Buttn Components */}
                                    {console.log('errors, touched, dirty, isValid: ', errors, touched, isValid)}

                                    <Button
                                        type='submit'
                                        btnLabel="Login"
                                        disabled={!(isValid)}
                                        isSubmit
                                        loader={loader}
                                    />
                                </div>
                            </Form>
                        )}

                    </Formik>

                </div>

                <div className='wave_img_wrapper'>
                    <img className='img-fluid' src={waveImg} alt="wave-img" />
                </div>
            </div>
            <ToastWrapper />
        </>

    )
}

export default SignIn
