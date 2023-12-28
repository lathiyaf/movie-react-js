/* eslint-disable react-hooks/exhaustive-deps */
import React, { lazy, useEffect, useState } from 'react'
import "../../scss/page/index.css";
import plusIcon from "../../assets/images/plusIcon.svg";
import logoutIcon from "../../assets/images/logoutIcon.svg";
import waveImg from "../../assets/images/bgWaves.png";
import { ToastWrapper, showErrorToast, showSuccessToast } from '../../common/customToast';
import axiosInstance from '../../api/Interceptor';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { persistor } from '../../Redux/store';
const Button = lazy(() => import('../../common/Button'));
const NewPagination = lazy(() => import('../../pagination/NewPagination'));
const MovieCard = lazy(() => import('./MovieCard'));

const MovieListComp = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [listData, setListData] = useState([]);
    const refreshToken = useSelector(state => state?.auth?.refreshToken);

    const navigate = useNavigate();
    /*== create a flag to show empty data or List data ==*/
    const isData = listData?.length > 0;

    /*== movies listing API calling Function ==*/
    const dataFetchHandler = async () => {
        try {
            const response = await axiosInstance.get(process.env.REACT_APP_MOVIE_LIST_API + `?page=${currentPage}`)
            setListData(response?.data?.data)
            setTotalPages(response?.data?.total_pages)
        } catch (error) {
            if (error?.response?.status === 401) {
                navigate('/signin')
            }
            showErrorToast(error?.response?.data?.error)
        }
    }

    // first time run when component render for fetching data from api
    useEffect(() => {
        dataFetchHandler()
    }, [currentPage])

    // logout api calling function
    const handleLogOut = async () => {
        const payload = {
            refresh: refreshToken
        }
        try {
            const response = await axiosInstance.post(process.env.REACT_APP_LOGOUT_API, payload)
            showSuccessToast(response?.data?.message);
            localStorage.removeItem('persist:root')
            persistor.pause();
            persistor.flush().then(() => {
                return persistor.purge();
            });
            setTimeout(() => {
                window.location.href = '/signin';
            }, 1000)
        } catch (error) {
           console.log(error)
        }
    }

    // movie card loop list code
    const movieCardList = listData?.map(data => <MovieCard data={data} key={data?.id} />);

    return (
        <>
            <div className='home_wrapper'>

                {/* Either a movie list or empty message */}
                {
                    !isData ?
                        <div className='emptyWrapper'>
                            <div className='wrapper'>
                                <h2>Your movie list is empty</h2>
                                <Button
                                    type='button'
                                    btnLabel='Add a new movie'
                                    disabled={false}
                                    isSubmit
                                    onClickHandler={() => navigate('/add-movie')}
                                />
                            </div>
                        </div>
                        :
                        <div className='mainWrapper'>
                            {/* Header part */}
                            <div className='header_wrapper'>
                                <div className='cont'>
                                    <h2>My movies</h2>
                                    <div className='add-movie-link' onClick={() => navigate('/add-movie')}>
                                        <img src={plusIcon} alt="plus-icon" />
                                    </div>
                                </div>
                                <div className='logout_Wrapper' onClick={handleLogOut}>
                                    <h6>Logout</h6>
                                    <img src={logoutIcon} alt="logout-icon" />
                                </div>
                            </div>

                            {/* Movie card list */}
                            <div className='movieListWrapper'>{movieCardList}</div>

                            {/* Pagination */}

                            <div className='pagination_wrapper'>
                                <NewPagination currentPage={currentPage} setCurrentPage={setCurrentPage} pageCount={totalPages} />
                            </div>

                        </div>
                }

                <div className='wave_img_wrapper'>
                    <img className='img-fluid' src={waveImg} alt="wave-img" />
                </div>
            </div>

            <ToastWrapper />
        </>
    )
}

export default MovieListComp

