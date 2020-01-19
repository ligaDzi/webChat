import React from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'

import ErrorField from '../../common/ErrorField'

const SendMessageForm = props => {
    const { handleSubmit } = props

    return (
        <form className='col s12' onSubmit={ handleSubmit }>
            <div className='row'>
                <Field 
                    name='message' 
                    id='send_message' 
                    className="validate" 
                    htmlFor="send_message" 
                    type='text' 
                    autocomplete="off"
                    component={ErrorField} 
                />
            </div>

        </form>
    )
}

SendMessageForm.propTypes = {
    //From Component
    handleSubmit: PropTypes.func.isRequired
}

const validate = ({ message }) => {
    const errors = {}

    if (!message) errors.message = 'message is required'
    else if (message.length > 1024) errors.message = 'to big'

    return errors
}

const createReduxForm = reduxForm({ form: 'message', validate })

export default createReduxForm(SendMessageForm)
