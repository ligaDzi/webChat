import React from 'react'
import { Link, Route } from 'react-router-dom'

import AllRoom from '../rooms/AllRoom'
import TestRoom from '../rooms/TestRoom'
import NavBar from '../common/NavBar'

const RoomsPage = () => {

    return (
        <div> 
            <NavBar />
            <Route path='/rooms/test' exact>
                <TestRoom />
            </Route>
            <Route path='/rooms/all' exact>
                <AllRoom />
            </Route>
        </div>
    )
}

export default RoomsPage