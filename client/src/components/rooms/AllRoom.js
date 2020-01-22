import React from 'react'

import RoomList from './RoomList'
import ChatTabs from './ChatTabsMU'

import './style.sass'

const AllRoom = () => {
    return (
        <div className='room-content'>
            <RoomList />
            <ChatTabs />
        </div>
    )
}

export default AllRoom
