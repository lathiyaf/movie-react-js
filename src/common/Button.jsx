import React from 'react'

const Button = ({ type, disabled, isSubmit, btnLabel, onClickHandler, loader }) => {
    return (
        <button
            className={isSubmit ? (loader ? 'submitBtn loader' : 'submitBtn') : 'commonBtn'}
            type={type}
            disabled={disabled}
            style={disabled ? { opacity: "0.5" } : null}
            onClick={onClickHandler}
        >
            {loader ? "" : btnLabel}
        </button>
    )
}

export default Button
