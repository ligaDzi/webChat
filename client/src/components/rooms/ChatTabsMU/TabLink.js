import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import Tab from '@material-ui/core/Tab'
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles'
import MailIcon from '@material-ui/icons/Mail'


const StyledBadge = withStyles(theme => ({
    badge: {
        right: 22,
        top: 18,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}))(Badge)

const TabLink = (props) => {
    const { handleClose, newMesSize, isActive, handleChangeActiveRoom, ...rest } = props


    const renderArrivedNewMes = () => {

        if (isActive || newMesSize <= 0) return null

        return (            
            <StyledBadge badgeContent={newMesSize} color="secondary">
                <MailIcon />
            </StyledBadge>
        )
    }

    return (
        <div>
            <p>
                <Tab {...rest} onClick={handleChangeActiveRoom} />
            </p>  
            { renderArrivedNewMes() }
            <button onClick={handleClose}>X</button>
        </div>
    )
}

TabLink.propTypes = {
    //from Component
    handleClose: PropTypes.func.isRequired,
    handleChangeActiveRoom: PropTypes.func.isRequired,
    isActive: PropTypes.bool,
    newMesSize: PropTypes.number
}

export default TabLink
