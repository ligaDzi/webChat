import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import emailValidator from 'email-validator'
import { Link } from 'react-router-dom'

import ErrorField from '../common/ErrorField'

const SignInForm = ({ handleSubmit }) => {
    return (
        <div>
            <h2>Sign In</h2>
            <form onSubmit={ handleSubmit }>
                <Field name='email' component={ErrorField} />
                <Field name='password' type='passowrd' component={ErrorField} />
                <Link to='/auth/register'>Registaration</Link>
                <div>
                    <input type='submit' value='Send' />
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
