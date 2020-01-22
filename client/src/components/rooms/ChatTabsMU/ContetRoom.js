import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import randomColor from 'randomcolor'

const colorArr = randomColor({    
   luminosity: 'dark',
   count: 1000
})

const ContetRoom = props => {
    const { room } = props
    console.log('room', room)

    const [users, setUsers] = useState([])
    const listMes = useRef(null)

    useEffect(() => {
        const arrUsers = room.users.map((user, i) => ( 
            {
                ...user, 
                color: (i+1) <= colorArr.length ? colorArr[i] : randomColor({ luminosity: 'dark' })
            }
        ))
        setUsers(arrUsers)
    }, [room.users.length])

    useEffect(() => {
        listMes.current.scrollTop = listMes.current.scrollHeight
    }, [room.messages])

    const getUserColor = name => {
        let color = null
        users.forEach(user => {
            if (user.name == name) {
                color = user.color
                return
            }
        })
        return color
    }

    const messages = room.messages.length > 0 
        ? room.messages.map((mes, i) => (
            <p key={mes.id} style={{color: getUserColor(mes.username)}}>
                {`${mes.username}: ${mes.text}`}
            </p>
        )) 
        : null

    return (
        <div ref={listMes}>
            { messages }
        </div>
    )
}

ContetRoom.propTypes = {
    //From Component
    room: PropTypes.object.isRequired
}

export default ContetRoom
