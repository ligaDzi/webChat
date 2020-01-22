import React, { useEffect, useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { moduleName as authModuleName } from '../../../ducks/auth'
import { moduleName as roomModuleName, selectedRoomSelector, closeRoom, sendMessage } from '../../../ducks/rooms'

import ContentRoom from './ContetRoom'
import SendMessageForm from './SendMessageForm'


import './style.sass'

const ChatTabs = ({ user, rooms, closeRoom, sendMessage }) => {
    
    const tab = useRef(null)    
    const [tabInstance, setTabInstance] = useState(null)
    const [activeRoomId, setActiveRoomId] = useState(null)
    console.log('rooms', rooms)
    console.log('activeRoomId', activeRoomId)

    useEffect(() => {
        if (!activeRoomId && rooms.length > 0) setActiveRoomId(rooms[0].id)
    }, [rooms])

    const handleCloseRoom = (roomId) => {
        closeRoom(roomId)
        activeRoomId && tabInstance && tabInstance.select(activeRoomId)
    }

    const handleSendMessage = ({ message }) => {
        sendMessage(user, activeRoomId, message)
    }

    const renderMaterTab = () => (
        <div className="row tab-content">
            <div className="col s12 tab-link">
                <ul className="tabs tabs-fixed-width" ref={tab}>
                    { renderLinkTab() }
                </ul>
            </div>
            { renderContentTab() }
            <SendMessageForm onSubmit={handleSendMessage} />   
        </div>  
    )

    const renderLinkTab = () => (
        rooms.map(r => (
            <li className="tab col s3" key={r.id}>
                <a className='tab-link__header' href={`#${r.id}`}>
                    <p onClick={() => setActiveRoomId(r.id)}>{ r.name }</p>
                    <button onClick={() => handleCloseRoom(r.id)}>
                        X
                    </button>
                </a>
            </li>
        ))
    )    

    const renderContentTab = () => (
        rooms.map(r => (
            <div id={`${r.id}`} className="col s12 tab-room" key={r.id}>
                <ContentRoom room={r} />
            </div>
        ))
    )


    
    useEffect(() => {
        const option = {
            duration: 300
        }

        if (rooms.length > 0) {
            setTabInstance(window.M.Tabs.init(tab.current, option))
        }
    }, [rooms])


    return (
        <div className='chat-list'>
            <h2>ChatTabs</h2>
            { rooms.length > 0 ? renderMaterTab() : null}
        </div>
    )
}

ChatTabs.propTypes = {
    //From store
    user: PropTypes.object,
    rooms: PropTypes.array,
    closeRoom: PropTypes.func.isRequired,
    sendMessage: PropTypes.func.isRequired
}

export default connect(state => ({
    user: state[authModuleName].user,
    rooms: selectedRoomSelector(state)
}), {
    closeRoom,
    sendMessage
})(ChatTabs)
