import React from 'react'

const ErrorField = ({ input, type, meta: {error, touched} }) => {

    const errorTxt = touched && error && <div style={{color: 'red'}}>{ error }</div>

    return (
        <div>
            <label>{input.name}</label>
            <input {...input} type={type} />
            {errorTxt}
        </div>
    )
}

export default ErrorField
