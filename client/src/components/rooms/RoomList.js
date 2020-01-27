import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { fetchAllRooms, addRoom, connectUserRoom, roomListSelector } from '../../ducks/rooms'
import { moduleName as userModuleName } from '../../ducks/auth'

import RoomBtn from './RoomBtn'
import AddRoomForm from './AddRoomForm'

import './style.sass'


const RoomList = ({ user, rooms, fetchAllRooms, addRoom, connectUserRoom }) => {

    useEffect(() => {
        fetchAllRooms(user.id)
    }, [fetchAllRooms, user])

    const handleAddNewRoom = ({ roomName }) => {
        addRoom(roomName)
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
            <AddRoomForm rooms={rooms} onSubmit={handleAddNewRoom} />
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
