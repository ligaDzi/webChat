import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import emailValidator from 'email-validator'
import { Link } from 'react-router-dom'

import ErrorField from '../common/ErrorField'

import './style.sass'

const SignInForm = ({ handleSubmit }) => {

    useEffect(() => {
        // Очищение инпутов от предыдущих вводов
        window.M.updateTextFields()
    }, [])
    
    return (
        <div className='row'>
            <h2>login</h2>
            <form className='col s12' onSubmit={ handleSubmit }>
                <div className="row">
                    <Field name='email' id='email' className="validate" htmlFor="email" type='email' component={ErrorField} />
                </div>
                <div className='row'>
                    <Field name='password' id='password' className="validate" htmlFor="password" type='password' component={ErrorField} />
                </div>
                <Link to='/auth/register'>Registaration</Link>
                <div>
                    <input className='btn blue lighten-2 btn-marg' type='submit' value='login' />
                </div>
            </form>
        </div>
    )
}

SignInForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired
}

const validate = ({ email, password }) => {
    const errors = {}

    if (!email) errors.email = 'email is required'
    else if (!emailValidator.validate(email)) errors.email = 'invalid email'

    if (!password) errors.password = 'password is required'
    else if (password.length < 6) errors.password = 'to short'

    return errors
}

const createReduxForm = reduxForm({ form: 'auth', validate })

export default createReduxForm(SignInForm)
