import React from 'react'

const ErrorField = ({ input, type, htmlFor, id, className, autocomplete, meta: {error, touched} }) => {
   

    const errorTxt = touched && error && <div style={{color: 'red'}}>{ error }</div>

    return (
        <div className="input-field col s12">
            <input {...input} className={className} id={id} type={type} autoComplete={autocomplete} />
            <label htmlFor={htmlFor}>{input.name}</label>
            {errorTxt}
        </div>
    )
}

export default ErrorField
