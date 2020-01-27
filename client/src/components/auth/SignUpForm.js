import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'
import emailValidator from 'email-validator'

import ErrorField from '../common/ErrorField'

const SignUpForm = ({ handleSubmit }) => {
    return (
        <div className='row'>
            <h2>Registaration</h2>
            <form className='col s12' onSubmit={ handleSubmit }>
                <div className='row'>
                    <Field name='name' id='name' className="validate" htmlFor="name" type='text' component={ErrorField} />
                </div>
                <div className="row">
                    <Field name='email' id='email' className="validate" htmlFor="email" type='email' component={ErrorField} />
                </div>
                <div className='row'>
                    <Field name='password' id='password' className="validate" htmlFor="password" type='password' component={ErrorField} />
                </div>
                <div>
                    <input className='btn blue lighten-2 btn-marg' type='submit' value='Registaration' />
                </div>
            </form>
        </div>
    )
}

SignUpForm.propTypes = {
    //from Component
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
