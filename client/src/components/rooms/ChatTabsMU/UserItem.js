import React from 'react'
import PropTypes from 'prop-types'

import { ListItemSE } from './styles'

const UserItem = ({ user }) => {
    return (
        <ListItemSE color={user.color}>{user.name}</ListItemSE>
    )
}

UserItem.propTypes = {
    //from Component
    user: PropTypes.object
}

export default UserItem
