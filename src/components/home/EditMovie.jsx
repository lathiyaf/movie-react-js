/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from 'formik'
import React, { lazy, useEffect, useRef, useState } from 'react'
import * as Yup from "yup";
import "../../scss/page/editPage.css";
import dropImg from "../../assets/images/dropImg.svg";
import waveImg from "../../assets/images/bgWaves.png";
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/Interceptor';
import { showErrorToast, showSuccessToast } from '../../common/customToast';
const Input = lazy(() => import('../../common/Input'));
const Button = lazy(() => import('../../common/Button'));

const formSchema = Yup.object().shape({
    image: Yup.mixed().nullable().required("Image Required"),
    title: Yup.string().required("Please enter title of the movie"),
    release_year: Yup.string().required('Please enter publish year of movie')
});

const EditMovie = () => {
    const [loader, setLoader] = useState(false);
    const [file, setFile] = useState();
    const [editData, setEditData] = useState([]);

    const formikRef = useRef(null);
    const navigate = useNavigate();
    const params = useParams();
    const movieId = params?.id;

    // fetch edit movie data 
    const fetchDataHandler = async () => {
        try {
            const response = await axiosInstance.get(process.env.REACT_APP_MOVIE_DATA_API + `${movieId}`)
            setEditData(response?.data[0]);
            setFile(response?.data[0]?.image)
        } catch (error) {
            if (error?.response?.status === 401) {
                navigate('/signin')
            }
            showErrorToast(error?.response?.data?.error)
        }
    }

    useEffect(() => {
        fetchDataHandler()
    }, [movieId])


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

    // edited data submit handler
    const submitHandler = async (values) => {
        // Creating a new FormData object for image upload
        const formData = new FormData();
        formData.append('image', values.image);
        formData.append('title', values.title);
        formData.append('release_year', values.release_year);
        setLoader(true);

        try {
            const response = await axiosInstance.put(process.env.REACT_APP_MOVIE_LIST_API + `${movieId}/`, formData)
            showSuccessToast(response?.data?.message);
            setTimeout(() => navigate("/"), 800);
        } catch (error) {
            if (error?.response?.status === 401) {
                navigate('/signin')
            }
            showErrorToast(error?.response?.data?.error)
        }
        finally {
            setLoader(false);
        }
        
    }

    return (
        <div className='home_wrapper form_home_wrapper'>
            <div className='mainWrapper'>
                <div className='header_wrapper'>
                    <div className='cont'>
                        <h2>Edit</h2>
                    </div>
                </div>

                {/* edit movie form */}
                <Formik
                    initialValues={{
                        image: editData?.image || "",
                        title: editData?.title || "",
                        release_year: editData?.release_year || "",
                    }}
                    onSubmit={submitHandler}
                    validationSchema={formSchema}
                    innerRef={formikRef}
                    enableReinitialize
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
                                        className='small_input'
                                    />

                                    <div className='btnwrapper'>
                                        {/* Common Button Components */}
                                        <Button
                                            type='button'
                                            btnLabel="Cancel"
                                            disabled={false}
                                            isSubmit={false}
                                            onClickHandler={() => navigate("/")}
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
            <div className='wave_img_wrapper'>
                <img className='img-fluid' src={waveImg} alt="wave-img" />
            </div>
        </div>
    )
}

export default EditMovie
