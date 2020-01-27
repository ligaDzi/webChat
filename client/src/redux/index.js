import { createStore, applyMiddleware } from 'redux'
import createRootReducer from './reducer'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './saga'

const sagaMiddleware = createSagaMiddleware()
const rootReducer = createRootReducer()
const enhancer = applyMiddleware(sagaMiddleware)
const store = createStore(rootReducer, enhancer)

sagaMiddleware.run(rootSaga)

export default store