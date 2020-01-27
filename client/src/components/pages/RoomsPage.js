import React from 'react'
import { Route } from 'react-router-dom'

import AllRoom from '../rooms/AllRoom'
import NavBar from '../common/NavBar'

const RoomsPage = () => {

    return (
        <div> 
            <NavBar />
            <Route path='/rooms/all' exact>
                <AllRoom />
            </Route>
        </div>
    )
}

export default RoomsPage