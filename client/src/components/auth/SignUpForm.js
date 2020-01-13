import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import emailValidator from 'email-validator'

import ErrorField from '../common/ErrorField'

const SignUpForm = ({ handleSubmit }) => {
    return (
        <div>
            <h2>Registaration</h2>
            <form onSubmit={ handleSubmit }>
                <Field name='name' component={ErrorField} />
                <Field name='email' component={ErrorField} />
                <Field name='password' type='passowrd' component={ErrorField} />
                <div>
                    <input type='submit' value='Send' />
                </div>
            </form>
        </div>
    )
}

SignUpForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired
}

const validate = ({ name, email, password }) => {
    const errors = {}

    if (!name) errors.name = 'name is required'
    else if (name.length > 30) errors.name = 'name to big'

    if (!email) errors.email = 'email is required'
    else if (!emailValidator.validate(email)) errors.email = 'invalid email'

    if (!password) errors.password = 'password is required'
    else if (password.length < 6) errors.password = 'password to short'

    return errors
}

const createReduxForm = reduxForm({ form: 'auth', validate })

export default createReduxForm(SignUpForm)
