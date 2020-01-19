import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { 
    moduleName as roomModuleName, 
    fetchAllRooms, addRoom, connectUserRoom, 
    roomListSelector 
} from '../../ducks/rooms'

import { moduleName as userModuleName } from '../../ducks/auth'
import { mapToArr } from '../../utils/helpers'

import RoomBtn from './RoomBtn'

import './style.sass'

const RoomList = ({ user, rooms, fetchAllRooms, addRoom, connectUserRoom }) => {
    const [textInput, setTextInput] = useState('')

    useEffect(() => {
        fetchAllRooms(user.id)
    }, [])

    const addNewRoom = ev => {
        ev.preventDefault()
        addRoom(textInput)
        setTextInput('')
    }

    const handleConnectRoom = roomId => {
        if (!user.rooms.includes(roomId)) {
            connectUserRoom(user.id, roomId)
        }
    }
    

    return (        
        <div className='room-list'>
            <nav>
                { rooms.map(room => <RoomBtn key={room.id} room={room} handleClick={handleConnectRoom} /> ) }
            </nav>
            <form onSubmit={ addNewRoom }>
                <input
                    type='text' 
                    className='room-add'
                    value={textInput}
                    placeholder='Add Room'
                    onChange={ev => setTextInput(ev.target.value)}                    
                />
            </form>
        </div>
    )
}

RoomList.propTypes = {
    //From store
    rooms: PropTypes.array,
    user: PropTypes.object,
    fetchAllRooms: PropTypes.func.isRequired,
    connectUserRoom: PropTypes.func.isRequired,
    addRoom: PropTypes.func.isRequired
}

export default connect(state => ({
    user: state[userModuleName].user,
    rooms: roomListSelector(state)
}), {
    fetchAllRooms,
    addRoom,
    connectUserRoom
})(RoomList)
