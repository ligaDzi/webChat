import React from 'react'
import PropTypes from 'prop-types'

import './style.sass'

const RoomBtn = ({ room, handleClick }) => {
    return (
        <p className='room-btn'>
            <button 
                onClick={() => handleClick(room.id)}
            >
                    { room.name }
            </button>
        </p>
    )
}

RoomBtn.propTypes = {
    //From Component
    room: PropTypes.object.isRequired,
    handleClick: PropTypes.func.isRequired
}

export default RoomBtn
