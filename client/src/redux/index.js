import { createStore, applyMiddleware } from 'redux'
import createRootReducer from './reducer'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './saga'

const sagaMiddleware = createSagaMiddleware()
const rootReducer = createRootReducer()
const enhancer = applyMiddleware(sagaMiddleware, logger)
const store = createStore(rootReducer, enhancer)

sagaMiddleware.run(rootSaga)

export default store