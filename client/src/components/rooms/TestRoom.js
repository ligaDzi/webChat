import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import io from 'socket.io-client'

import { moduleName } from '../../ducks/auth'

const socket = io('http://localhost:5000', {
    autoConnect: false
  })

const TestRoom = ({ user }) => {
    const [textInput, setTextInput] = useState('')
    const [message, setMessage] = useState([])
    const [people, setPeople] = useState([])
    const [room, setRoom] = useState('myRoom')

    useEffect(() => {        
        if (!socket.connected) {
            socket.open()	

            socket.on("connect", () => {
            	console.log("Connect")
            })
            socket.on("disconnect", () => {
                console.log('Discconect')
            })
        }

        return () => {
            socket.close()
        }        
    }, [])

    useEffect(() => {    
        console.log(`useEffect ${room}`)
        socket.emit('join', user, room)	
        socket.on(`message-${room}`, data => setMessage(mas => [...mas, data]))
        socket.on(`user-${room}`, users => setPeople(users))
        
    }, [room])


    const sendMessage = () =>{ 
        setMessage(mas => [...mas, `${user.name}: ${textInput}`])
        setTextInput('')
        socket.emit(`message-${room}`, { user, message: textInput })
    }

    const handleCloseSocket = () => {
        if (socket.connected) {
            socket.close()
        }
    }

    const handleNewRoom = () => {
        setRoom('newRoom')
    }

    return (
        <div>
            <h3>TestRoom</h3>
            <p>{ room }</p>
            { people.map(item => <p key={Date.now().toString() + Math.random().toString()}>{ item }</p>) }
            <input
                type='text' 
                value={textInput}
                onChange={ev => setTextInput(ev.target.value)} 
            />
            
            <button onClick={sendMessage}>Send</button>
            <button onClick={handleNewRoom}>newRoom</button>
            <button onClick={handleCloseSocket}>Close</button>

            { message.map(mes => <p key={Date.now().toString() + Math.random().toString()}>{ mes }</p>) }
        </div>
    )
}

export default connect(state => ({
    user: state[moduleName].user
}), {})(TestRoom)
