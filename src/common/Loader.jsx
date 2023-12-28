import React from 'react'

const Loader = () => {
    return (
        <div className='loader_Wrapper'>
            <span className="loading_loader"></span>
            <h4 style={{ color: "#fff", fontSize: '24px', lineHeight: '32px', fontWeight: '700'}}>Loading...</h4>
        </div>
    )
}

export default Loader