import { appName } from '../config'
import { Record } from 'immutable'
import { put, call, all, takeEvery } from 'redux-saga/effects'
import { reset } from 'redux-form'
import { USER_CONNECT_ROOM_SUCCESS, CLOSE_ROOM_SUCCESS } from './rooms'
import { createSelector } from 'reselect'


/**
 * Constants
 */
export const UserRedcord = Record({
    id: null,
    name: null,
    email: null,
    rooms: []
})
export const ReducerRecord = Record({
    user: null,
    error: null,
    loading: false
})

export const moduleName = 'auth'
export const AUTOENTER_REQUEST = `${appName}/${moduleName}/AUTOENTER_REQUEST`
export const AUTOENTER_SUCCESS = `${appName}/${moduleName}/AUTOENTER_SUCCESS`
export const AUTOENTER_ERROR = `${appName}/${moduleName}/AUTOENTER_ERROR`
export const SIGN_UP_REQUEST = `${appName}/${moduleName}/SIGN_UP_REQUEST`
export const SIGN_UP_SUCCESS = `${appName}/${moduleName}/SIGN_UP_SUCCESS`
export const SIGN_UP_ERROR = `${appName}/${moduleName}/SIGN_UP_ERROR`
export const SIGN_IN_REQUEST = `${appName}/${moduleName}/SIGN_IN_REQUEST`
export const SIGN_IN_SUCCESS = `${appName}/${moduleName}/SIGN_IN_SUCCESS`
export const SIGN_IN_ERROR = `${appName}/${moduleName}/SIGN_IN_ERROR`
export const SIGN_OUT_REQUEST = `${appName}/${moduleName}/SIGN_OUT_REQUEST`
export const SIGN_OUT_SUCCESS = `${appName}/${moduleName}/SIGN_OUT_SUCCESS`


/**
 * Reducer
 */
export default function reducer(state = new ReducerRecord(), action) {

    const { type, payload, error } = action

    switch(type) {
        case AUTOENTER_REQUEST:
        case SIGN_IN_REQUEST:
        case SIGN_UP_REQUEST:
            return state.set('loading', true)

        case AUTOENTER_SUCCESS:
        case SIGN_IN_SUCCESS:
        case SIGN_UP_SUCCESS:
            return state
                .set('loading', false)
                .set('user', new UserRedcord(payload.user))
                .set('error', null)

        case AUTOENTER_ERROR:
            return state
                .set('loading', false)

        case SIGN_IN_ERROR:
        case SIGN_UP_ERROR:
            return state
                .set('loading', false)
                .set('error', error)

        case SIGN_OUT_SUCCESS:
            return new ReducerRecord({})

        case USER_CONNECT_ROOM_SUCCESS:
            return state
                .updateIn(['user', 'rooms'], rooms => rooms.concat(payload.roomId))

        case CLOSE_ROOM_SUCCESS:
            return state
                .updateIn(['user', 'rooms'], rooms => rooms.filter(id => id != payload.roomId))

        default:
            return state
    }
}


/**
 * Selectors
 */
export const stateSelector = state => state[moduleName]
export const roomsSelector = createSelector(stateSelector, state => state.user.rooms)

 
/**
 * Action Creators
 */
export function autoEnterSite() {
    return {
        type: AUTOENTER_REQUEST
    }
}

export function signUp(name, email, password) {
    return {
        type: SIGN_UP_REQUEST,
        payload: { name, email, password }
    }
}

export function signIn(email, password) {
    return {
        type: SIGN_IN_REQUEST,
        payload: { email, password }
    }
}

export function signOut() {
    return {
        type: SIGN_OUT_REQUEST
    }
}


/**
 * Sagas
 */
export const autoEnterSiteSaga = function * (action) {
    try {        
        const response = yield fetch('/api/auth/autoenter')
        const data = yield call(
            [response, response.json]
        )

        if (data.user) {
            yield put({
                type: AUTOENTER_SUCCESS,
                payload: { user: data.user }
            }) 
        } else {            
            yield put({
                type: AUTOENTER_ERROR
            }) 
        }
    } catch (error) {
        yield put({
            type: AUTOENTER_ERROR
        })          
    }
}

export const signUpSaga = function * (action) {
    try {
        const option = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: yield call(
                [JSON, JSON.stringify],
                {
                    name: action.payload.name, 
                    email: action.payload.email,  
                    password: action.payload.password  
                }
            )
        } 

        const response = yield fetch('/api/auth/register', option)
        const data = yield call(
            [response, response.json]
        )

        yield put( reset('auth') )
        
        if (data.user) {
            yield put({
                type: SIGN_UP_SUCCESS,
                payload: { user: data.user }
            })
        } else {
            yield put({
                type: SIGN_UP_ERROR,
                error: data.message
            })
        }
        
    } catch (error) {
        yield put({
            type: SIGN_UP_ERROR,
            error
        })        
    }    
}

export const signInSaga = function * (action) {
    try {

        const option = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: yield call(
                [JSON, JSON.stringify],
                { 
                    email: action.payload.email,  
                    password: action.payload.password  
                }
            )
        } 

        const response = yield fetch('/api/auth/login', option)
        const data = yield call(
            [response, response.json]
        )

        yield put( reset('auth') )   

        if (data.user) {
            yield put({
                type: SIGN_IN_SUCCESS,
                payload: { user: data.user }
            })
        } else {
            yield put({
                type: SIGN_IN_ERROR,
                error: data.message
            })
        }
        
    } catch (error) {
        yield put({
            type: SIGN_IN_ERROR,
            error
        })
    }
}

export const signOutSaga = function * (action) {

}



export const saga = function * () {
    yield all([
        takeEvery(AUTOENTER_REQUEST, autoEnterSiteSaga),
        takeEvery(SIGN_UP_REQUEST, signUpSaga),
        takeEvery(SIGN_IN_REQUEST, signInSaga),
        takeEvery(SIGN_OUT_REQUEST, signOutSaga)
    ])
}