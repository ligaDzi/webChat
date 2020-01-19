import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import './style.sass'

const NavBar = props => {
    return (
        <nav>
            <div className="nav-wrapper darken-2 padding-navbar">
                <span className="brand-logo">ChatRoom</span>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to="/rooms/test">Test room</NavLink></li>
                    <li><NavLink to="/rooms/all">All room</NavLink></li>
                    <li><a to='/' onClick={() => console.log('OUT')}>Logout</a></li>
                </ul>
            </div>
        </nav>
    )
}

NavBar.propTypes = {

}

export default NavBar
