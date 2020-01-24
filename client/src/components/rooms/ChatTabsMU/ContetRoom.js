import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import randomColor from 'randomcolor'
import { getRandomId } from '../../../utils/helpers'

import { AbsoluteBlock, ListsSE, ListItemSE, EndListItemSE, LITooltipSE, MessageColor } from './styles'

let colorArr = randomColor({    
   luminosity: 'dark',
   count: 100
})


const HtmlTooltip = withStyles(theme => ({
    tooltip: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 600,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip)


const ContetRoom = props => {
    const { room } = props
    console.log('room', room)

    const [users, setUsers] = useState([])
    const listMes = useRef(null)

    useEffect(() => {
        const arrUsers = room.users.map((user, i) => ( 
            {
                ...user, 
                color: getColorForIndex(i)
            }
        ))
        setUsers(arrUsers)
    }, [room.users.length])

    useEffect(() => {
        listMes.current.scrollTop = listMes.current.scrollHeight
    }, [room.messages])


    const getColorForIndex = index => {

        if ((index + 1) > colorArr.length) {
            const colors = randomColor({ luminosity: 'dark', count: 100 })
            colorArr = colorArr.concat(colors)
        }
        return colorArr[index]
    }

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



    const renderMessageList = messageList => {
        if (messageList.length <= 0)
            return null
        else 
            return messageList.map((mes, i) => (
                <MessageColor key={getRandomId()} color={getUserColor(mes.username)}>
                    <h5>{mes.username}:</h5>
                    <div>{mes.text}</div>
                </MessageColor>
            ))
    }

    const renderListTooltip = users => (        
        <div>
            {users.map(user => 
                <LITooltipSE key={getRandomId()} color={user.color}>
                    {user.name}
                </LITooltipSE>)}
        </div>
    )
  
    return (
        <>
            <div ref={listMes}>
                { renderMessageList(room.messages) }
            </div>
            <AbsoluteBlock>
                <ListsSE>
                    {users.slice(0, 42).map((user, i) => {
                        if (i <= 40)
                            return <ListItemSE key={getRandomId()} color={user.color}>{user.name}</ListItemSE>
                        else 
                            return (
                                <HtmlTooltip
                                    title={renderListTooltip(users)}
                                    placement="left-end"
                                >
                                    <EndListItemSE>...{users.length}</EndListItemSE>                        
                                </HtmlTooltip>
                            )
                    })}
                </ListsSE>
            </AbsoluteBlock>
        </>
    )
}

ContetRoom.propTypes = {
    //From Component
    room: PropTypes.object.isRequired
}

export default ContetRoom
