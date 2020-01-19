import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { useRoutes } from './routes'
import { autoEnterSite, moduleName } from '../ducks/auth'

const Root = ({ user, autoEnterSite }) => {
    
    useEffect(() => {
        autoEnterSite()
    }, [])

    const isAuthenticated = !!user

    const routes = useRoutes(isAuthenticated)
    return (
        <Router>
            <div>
                { routes }
            </div>
        </Router>
    )
}

export default connect((state) => ({    
    user: state[moduleName].user
}), {
    autoEnterSite
})(Root)
