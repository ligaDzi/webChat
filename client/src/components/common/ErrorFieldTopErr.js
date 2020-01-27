import React from 'react'

import { ErrFieldContainer, ErrTxt } from './styles'

import './style.sass'

const ErrorField = ({ input, type, htmlFor, id, className, autocomplete, placeholder, meta: { error, touched, submitFailed } }) => {
       
    let errTxt = submitFailed && error
    
    return (
        <ErrFieldContainer>
            <ErrTxt>{ errTxt }</ErrTxt>
            <input 
                {...input} 
                className={className} 
                id={id} 
                type={type} 
                autoComplete={autocomplete} 
                placeholder={placeholder}
            />
        </ErrFieldContainer>
    )
}

export default ErrorField
