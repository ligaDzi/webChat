import { all } from 'redux-saga/effects'
import { saga as authSaga } from '../ducks/auth'
import { saga as roomSaga} from '../ducks/rooms'


export default function * rootSaga() {
    yield all([
        authSaga(),
        roomSaga()
    ])
}