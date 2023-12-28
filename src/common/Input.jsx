import { Field } from 'formik'
import React from 'react'

const Input = ({ type, placeholder, name, errors, touched, className }) => {
    return (
        <div className='inputWrapper'>
            <Field
                type={type}
                name={name}
                placeholder={placeholder}
                className={className}
            />
            <p className='caption error'>{errors && touched ? errors : null}</p>
        </div>
    )
}

export default Input
