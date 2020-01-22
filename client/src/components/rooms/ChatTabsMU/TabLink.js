import React from 'react'
import PropTypes from 'prop-types'

import Tab from '@material-ui/core/Tab'


const TabLink = (props) => {
    const { handleClose, ...rest } = props

    return (
        <div>
            <p>
                <Tab {...rest} />
            </p>
            <button onClick={handleClose}>X</button>
        </div>
    )
}

TabLink.propTypes = {
    //from Component
    handleClose: PropTypes.func.isRequired
}

export default TabLink
