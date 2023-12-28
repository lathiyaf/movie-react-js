import { Form, Formik } from 'formik'
import * as Yup from "yup";
import React, { lazy, useState } from 'react'
import "../../scss/page/editPage.css";
import dropImg from "../../assets/images/dropImg.svg";
import waveImg from "../../assets/images/bgWaves.png";
import { ToastWrapper, showErrorToast, showSuccessToast } from '../../common/customToast';
import axiosInstance from '../../api/Interceptor';
import { useNavigate } from 'react-router-dom';
const Input = lazy(() => import('../../common/Input'));
const Button = lazy(() => import('../../common/Button'));

// yup schema for add movie form validation
const formSchema = Yup.object().shape({
    image: Yup.mixed().nullable().required("Image Required"),
    title: Yup.string().required("Please enter title of the movie"),
    release_year: Yup.string().required('Please enter publish year of movie')
});


const AddMovie = () => {
    const [loader, setLoader] = useState(false);
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    // handler for selcting image of movie
    const handleFileChange = (event, setFieldValue) => {
        const selectedFile = event.currentTarget.files[0];
        const fileSize = selectedFile?.size / 1024 / 1024;
        if (fileSize < 2) {
            setFile(URL.createObjectURL(selectedFile));
            setFieldValue('image', selectedFile)
        } else {
            setFile(null);
            setFieldValue('image', '')
            showErrorToast("Uploaded file is too big.")
        }
    };


    // add movie data handler api calling
    const submitHandler = async (values) => {
        // Creating a new FormData object for image upload
        const formData = new FormData();
        formData.append('image', values.image);
        formData.append('title', values.title);
        formData.append('release_year', values.release_year);
        setLoader(true);

        try {
            const response = await axiosInstance.post(process.env.REACT_APP_MOVIE_LIST_API, formData)
            showSuccessToast(response?.data?.message);
            setTimeout(() => navigate("/"), 800);
        } catch (error) {
            if (error?.response?.status === 401) {
                navigate('/signin')
            }
            showErrorToast(error?.response?.data?.error)
        }
        finally{
            setLoader(false);
        }
    }



    return (
        <>
            <div className='home_wrapper home_wrapper2'>
                <div className='mainWrapper'>
                    <div className='header_wrapper'>
                        <div className='cont'>
                            <h2>Create a new movie</h2>
                        </div>
                    </div>

                    {/* add movie form */}
                    <Formik
                        initialValues={{
                            image: '',
                            title: "",
                            release_year: "",
                        }}
                        onSubmit={submitHandler}
                        validationSchema={formSchema}
                    >
                        {({ errors, touched, isValid, dirty, setFieldValue }) => (
                            <Form>
                                <div className='form_wrapper'>
                                    <div className='image_wrapper'>
                                        <input type="file" name="image" accept="image/*" onChange={(e) => { handleFileChange(e, setFieldValue) }} />
                                        {
                                            file ? <img className='dropImg' src={file} alt="img-file" /> :
                                                <div className='drop_Wrapper'>
                                                    <img src={dropImg} alt="dropImg-icon" />
                                                    <p className='small'>Drop an image here</p>
                                                </div>
                                        }
                                    </div>

                                    <div className='field_wrapper'>
                                        {/* Common Input Components */}
                                        <Input
                                            type='text'
                                            name='title'
                                            placeholder='Title'
                                            errors={errors.title}
                                            touched={touched.title}
                                        />
                                        <Input
                                            type='number'
                                            name='release_year'
                                            placeholder='Publishing year'
                                            errors={errors.release_year}
                                            touched={touched.release_year}
                                        />

                                        <div className='btnwrapper'>
                                            {/* Common Button Components */}
                                            <Button
                                                type='button'
                                                btnLabel="Cancel"
                                                disabled={false}
                                                isSubmit={false}
                                                onClickHandler={()=>navigate("/")}
                                            />
                                            <Button
                                                type='submit'
                                                btnLabel="Submit"
                                                disabled={!(isValid && dirty)}
                                                isSubmit
                                                loader={loader}
                                            />

                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
                {/* common wave image */}
                <div className='wave_img_wrapper'>
                    <img className='img-fluid' src={waveImg} alt="wave-img" />
                </div>
            </div>

            <ToastWrapper />
        </>
    )
}

export default AddMovie
