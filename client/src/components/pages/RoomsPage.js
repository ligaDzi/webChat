import React from 'react'
import { Link, Route } from 'react-router-dom'

import TestRoom from '../rooms/TestRoom'

const RoomsPage = () => {

    return (
        <div>
            <h2>RoomsPage</h2>  
            <Route path='/rooms' exact>
                <Link to='/rooms/test'>Test room</Link>
            </Route>  
            <Route path='/rooms/test' exact>
                <TestRoom />
            </Route>
        </div>
    )
}

export default RoomsPage