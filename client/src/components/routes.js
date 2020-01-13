import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import RoomsPage from './pages/RoomsPage'
import AuthPage from './pages/AuthPage'


export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route  path='/rooms'>
                    <RoomsPage />
                </Route>
                <Redirect to='/rooms' />                
            </Switch>
        )
    }
    return (
        <Switch>
            <Route path='/auth'>
                <AuthPage />
            </Route>
            <Redirect to='/auth/login' />
        </Switch>
    )
}