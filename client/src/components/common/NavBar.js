import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { NavLink, Link } from 'react-router-dom'

import { signOut } from '../../ducks/auth'

import './style.sass'

const NavBar = ({ signOut }) => {
    return (
        <nav>
            <div className="nav-wrapper darken-2 padding-navbar">
                <span className="brand-logo">ChatRoom</span>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li><NavLink to="/rooms/all">All room</NavLink></li>
                    <li><Link to='/' onClick={() => signOut()}>Logout</Link></li>
                </ul>
            </div>
        </nav>
    )
}

NavBar.propTypes = {
    //from store
    signOut: PropTypes.func.isRequired
}

export default connect(state => ({

}), {
    signOut
})(NavBar)
