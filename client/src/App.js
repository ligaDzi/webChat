import React from 'react'
import store from './redux'
import { Provider } from 'react-redux'

import Root from './components/Root'


function App() {
    return (
        <Provider store = { store }>
            <Root />
        </Provider>
    )
}

export default App
