import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'

import { moduleName as authModuleName } from '../../../ducks/auth'
import { moduleName as roomModuleName, selectedRoomSelector, closeRoom, sendMessage, changeActiveRoom } from '../../../ducks/rooms'

import TabPanel from './TabPanel'
import TabLink from './TabLink'
import ContetRoom from './ContetRoom'
import SendMessageForm from './SendMessageForm'

import './style.sass'


function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '75%',
  },
}))



function ChatTabs(props) {
  const { user, rooms, closeRoom, sendMessage, changeActiveRoom } = props  
  const classes = useStyles()
  const theme = useTheme()
  const [value, setValue] = useState(0)

  const handleCloseRoom = (roomId, indexRoom) => {
    closeRoom(roomId)
    
    if (value !== indexRoom && indexRoom < value && value > 0) setValue(value => (value - 1))
    else if (value === indexRoom && value > 0) setValue(value => (value - 1))
    
  }

  const handleSendMessage = ({ message }) => {
    sendMessage(user, rooms[value].id, message)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChangeActiveRoom = (roomId) => {
    changeActiveRoom(roomId)
  }

  const setActiveRoom = (index, roomId) => {
    if (value === index) {
      changeActiveRoom(roomId)
      return true
    } else {
      return false
    }
  }

  const showTab = () => (
        <>          
          <AppBar position="static" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              aria-label="full width tabs example"
            >
              {rooms.map((room, i) => (
                <TabLink 
                  key={room.id} 
                  label={room.name}               
                  handleClose={() => handleCloseRoom(room.id, i)}
                  handleChangeActiveRoom={() => handleChangeActiveRoom(room.id)}
                  isActive={setActiveRoom(i, room.id)}
                  newMesSize={room.newMesSize}
                  {...a11yProps(i)} 
                />
              ))}
            </Tabs>
          </AppBar>
          {rooms.map((room, i) => (
            <TabPanel 
              key={room.id} 
              value={value} index={i} dir={theme.direction}
            >
              <ContetRoom room={room} />
            </TabPanel>
          ))}
          <SendMessageForm onSubmit={handleSendMessage} />
        </>    
  )

  return (
    <div className={classes.root}>
      <h2>ChatTabs</h2>
      {rooms.length > 0 ? showTab() : null}
    </div>
  )
}

ChatTabs.propTypes = {
  //From store
  user: PropTypes.object,
  rooms: PropTypes.array,
  closeRoom: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  changeActiveRoom: PropTypes.func.isRequired
}

export default connect(state => ({
  user: state[authModuleName].user,
  rooms: selectedRoomSelector(state)

}), {
  closeRoom,
  sendMessage,
  changeActiveRoom
})(ChatTabs)