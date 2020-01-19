import React from 'react'

import RoomList from './RoomList'
import ChatTabs from './ChatTabs'

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
