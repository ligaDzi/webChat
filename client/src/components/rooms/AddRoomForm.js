import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { reduxForm, Field } from 'redux-form'

import ErrorField from '../common/ErrorFieldTopErr'

let roomArr = []

const AddRoomForm = ({ handleSubmit, rooms }) => {
    
    useEffect(() => {
        roomArr = rooms
    }, [rooms])

    return (
        <form onSubmit={handleSubmit}>
            <Field 
                name='roomName' 
                id='roomName' 
                className="room-add" 
                htmlFor="roomName" 
                type='text' 
                autocomplete="off"
                placeholder='Add Room'
                component={ErrorField} 
            />           
        </form>
    )
}

AddRoomForm.propTypes = {
    //from Component
    handleSubmit: PropTypes.func.isRequired,
    rooms: PropTypes.array

}

const validate = ({ roomName }) => {
    const errors = {}

    if (!roomName) errors.roomName = 'room name is required'
    else if (roomName.length > 30) errors.roomName = 'to big'

    roomArr.forEach(room => {
        if (room.name === roomName) {
            errors.roomName = 'room with that name already exists'
            return
        }
    })

    return errors
}

const createReduxForm = reduxForm({ form: 'addroom', validate })

export default createReduxForm(AddRoomForm)
