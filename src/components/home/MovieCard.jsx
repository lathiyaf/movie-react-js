import React from 'react'
import { Link } from 'react-router-dom';

const MovieCard = ({ data }) => {
    /*== common card for movies==*/
    return (
        <Link to={`/edit-movie/${data?.id}`} className='card-link'>
            <div className='card_wrapper'>
                <div className='card-image'>
                    <img src={data?.image} alt="movie-img" />
                </div>

                <div className='card-content'>
                    <p className="large">{data?.title}</p>
                    <p className="small">{data?.release_year}</p>
                </div>
            </div>
        </Link>
    )
}

export default MovieCard
