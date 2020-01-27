import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import randomColor from 'randomcolor'
import {TransitionMotion, spring} from 'react-motion'

import { getRandomId } from '../../../utils/helpers'

import UserItem from './UserItem'
import { AbsoluteBlock, ListsSE, EndListItemSE, LITooltipSE, MessageColor } from './styles'

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


const ContetRoom = ({ room }) => {

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
    }, [room.users])

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
            if (user.name === name) {
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
                <MessageColor key={mes.id} color={getUserColor(mes.username)}>
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
    
    const getStyles = () => {
        return users.map(user => ({
            style: {
                opacity: spring(1, {stiffness: 50})
            },
            key: user.id,
            data: user
        }))
    }

    const willLeave = () => ({
        opacity: spring(0, {stiffness: 100})
    })

    const willEnter = () => ({
        opacity: 0
    })
  
    return (
        <>
            <div ref={listMes}>
                { renderMessageList(room.messages) }
            </div>
            <AbsoluteBlock>
                <ListsSE>
                    <TransitionMotion
                        styles={getStyles()}
                        willLeave={willLeave}
                        willEnter={willEnter}                    
                    >
                        {interpolated => (
                            <div>
                                {
                                    interpolated.slice(0, 42).map((config, i) => {
                                        if (i <= 40) {
                                            return (
                                                <div key={config.key} style={config.style}>
                                                    <UserItem user={config.data} />
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <HtmlTooltip
                                                    title={renderListTooltip(users)}
                                                    placement="left-end"
                                                >
                                                    <EndListItemSE>...{users.length}</EndListItemSE>                        
                                                </HtmlTooltip> 
                                            )
                                        }
                                    })
                                }
                            </div>
                        )}
                    </TransitionMotion>
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
