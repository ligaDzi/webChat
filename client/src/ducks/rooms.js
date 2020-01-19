import { appName } from '../config'
import { Record, OrderedMap } from 'immutable'
import { put, call, take, fork, all, takeEvery } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { reset } from 'redux-form'
import { createSelector } from 'reselect'
import SocketSingleton from '../utils/socketSingleton'
import { arrToMap, mapToArr } from '../utils/helpers'
import { moduleName as authModuleName } from './auth'


/**
 * Constants
 */
export const ReducerRecord = Record({
    rooms: new OrderedMap({}),
    error: null,
    loading: false
})

export const RoomRecord = Record({
    id: null,
    name: null,
    users: [],
    messages: []
})

export const moduleName = 'room'
const prefix = `${appName}/${moduleName}`

export const ADD_ROOM_REQUEST = `${prefix}/ADD_ROOM_REQUEST`
export const ADD_ROOM_SUCCESS = `${prefix}/ADD_ROOM_SUCCESS`
export const ADD_ROOM_ERROR = `${prefix}/ADD_ROOM_ERROR`

export const FETCH_ROOMS_REQUEST = `${prefix}/FETCH_ROOMS_REQUEST`
export const FETCH_ROOMS_SUCCESS = `${prefix}/FETCH_ROOMS_SUCCESS`
export const FETCH_ROOMS_ERROR = `${prefix}/FETCH_ROOMS_ERROR`

export const FETCH_MESSAGE_ROOM_SUCCESS = `${prefix}/FETCH_MESSAGE_ROOM_SUCCESS`
export const FETCH_MESSAGE_ROOM_ERROR = `${prefix}/FETCH_MESSAGE_ROOM_ERROR`

export const USER_CONNECT_ROOM_REQUEST = `${prefix}/USER_CONNECT_ROOM_REQUEST`
export const USER_CONNECT_ROOM_SUCCESS = `${prefix}/USER_CONNECT_ROOM_SUCCESS`
export const USER_CONNECT_ROOM_ERROR = `${prefix}/USER_CONNECT_ROOM_ERROR`

export const CLOSE_ROOM_REQUEST = `${prefix}/CLOSE_ROOM_REQUEST`
export const CLOSE_ROOM_SUCCESS = `${prefix}/CLOSE_ROOM_SUCCESS`
export const CLOSE_ROOM_ERROR = `${prefix}/CLOSE_ROOM_ERROR`

export const ADD_MESSAGE_REQUEST = `${prefix}/ADD_MESSAGE_REQUEST`
export const ADD_MESSAGE_SUCCESS = `${prefix}/ADD_MESSAGE_SUCCESS`
export const ADD_MESSAGE_ERROR = `${prefix}/ADD_MESSAGE_ERROR`

export const UPDATE_USER_ROOM_SUCCESS = `${prefix}/UPDATE_USER_ROOM_SUCCESS`
export const UPDATE_USER_ROOM_ERROR = `${prefix}/UPDATE_USER_ROOM_ERROR`


/**
 * Reducer
 */
export default function reducer(state = new ReducerRecord(), action) {

    const { type, payload, error } = action

    switch(type) {
        case FETCH_ROOMS_REQUEST:
        case USER_CONNECT_ROOM_REQUEST:            
            return state
                .set('loading', true)

        case FETCH_ROOMS_SUCCESS:
            return state
                .set('loading', false)
                .update('rooms', rooms => arrToMap(payload.rooms, RoomRecord).merge(rooms))
                .set('error', null)

        case ADD_ROOM_SUCCESS:
            return state
                .set('loading', false)
                .update('rooms', rooms => rooms.merge(arrToMap([payload.room], RoomRecord)))
                .set('error', null)

        case USER_CONNECT_ROOM_SUCCESS:
            return state
                .set('loading', false)
                // .setIn(['rooms', payload.uid], new RoomRecord(payload))
                .set('error', null)

        case UPDATE_USER_ROOM_SUCCESS:
            return state
                .setIn(['rooms', payload.roomId, 'users'], payload.users)
                .set('error', null)

        case ADD_MESSAGE_SUCCESS:
            return state
                .updateIn(['rooms', payload.roomId, 'messages'], messages => [...messages, payload.message])
                .set('error', null)

        case FETCH_MESSAGE_ROOM_SUCCESS:
            return state
                .setIn(['rooms', payload.roomId, 'messages'], payload.messages)

        case FETCH_ROOMS_ERROR:
        case ADD_ROOM_ERROR:
        case ADD_MESSAGE_ERROR:
        case USER_CONNECT_ROOM_ERROR:
        case UPDATE_USER_ROOM_ERROR:
            return state
                .set('loading', false)
                .set('error', error)
        
        case CLOSE_ROOM_ERROR:
            return state.set('error', error)

        default:
            return state
    }
}


/**
 * Selectors
 */
export const stateSelector = state => state[moduleName]
export const authStateSelector = state => state[authModuleName]
export const roomsSelector = createSelector(stateSelector, state => state.rooms)
export const roomListSelector = createSelector(roomsSelector, rooms => mapToArr(rooms))

// Вернуть чат-комнаты пользователя
export const userSelectRoomSelector = createSelector(authStateSelector, state => state.user.rooms)
export const selectedRoomSelector = createSelector(roomsSelector, userSelectRoomSelector, (rooms, selectedArr) => {

    let listRoom = []  
      
    selectedArr.forEach(roomId => {
        if (rooms.get(roomId)) listRoom.push(rooms.get(roomId))
    })
    return listRoom
})

 
/**
 * Action Creators
 */
export function fetchAllRooms(userId) {
    return {
        type: FETCH_ROOMS_REQUEST,
        payload: { userId }
    }
}

export function addRoom(roomName) {
    return {
        type: ADD_ROOM_REQUEST,
        payload: { roomName }
    }
}

export function connectUserRoom(userId, roomId) {
	return {
		type: USER_CONNECT_ROOM_REQUEST,
		payload: { userId, roomId }
	}
}

export function closeRoom(roomId) {
    return {
        type: CLOSE_ROOM_REQUEST,
        payload: { roomId }
    }
}

export function sendMessage(user, roomId, message) {
	return {
		type: ADD_MESSAGE_REQUEST,
		payload: { user, roomId, message }
	}
}



/**
 * Sagas
 */
const eventSocket = (socket, eventName) => eventChannel(emit => {
	const handler = data => emit(data)
	socket.on(eventName, handler)
	return () => socket.off(eventName, handler)
})

const getAllRoomListnerSaga = function * ({ socket }) {
    const roomsChanel = yield call(eventSocket, socket, 'getAllRoom')

    try {

        while (true) {
            const { rooms, error } = yield take(roomsChanel)
    
            if (rooms) {
                yield put({
                    type: FETCH_ROOMS_SUCCESS,
                    payload: { rooms }
                })
            } else {
                throw(error)
            }
        }
    } catch (error) {  
        yield put({
            type: FETCH_ROOMS_ERROR,
            error
        })        
    } finally {
        yield call([roomsChanel, roomsChanel.close])
    }
}

const newRoomListnerSaga = function * ({ socket }) {
    const roomChanel = yield call(eventSocket, socket, 'newRoom')

    try {

        while (true) {
            const { room, error } = yield take(roomChanel)

            if (room) {
                yield put({
                    type: ADD_ROOM_SUCCESS,
                    payload: { room }
                })

            } else {
                throw(error)
            }    
        }
    } catch (error) {  
        yield put({
            type: ADD_ROOM_ERROR,
            error
        })        
    } finally {
        yield call([roomChanel, roomChanel.close])
    }
}

const fetchAllRoomsSaga = function * (action) {
    try {
        const socket = yield call([SocketSingleton, SocketSingleton.connectSocket])
        
        const roomsTask = yield fork(getAllRoomListnerSaga, { socket })
        const newRoomTask = yield fork(newRoomListnerSaga, { socket })

        const { userId } = action.payload
        socket.emit('allRoom', { userId })

    } catch (error) {
        yield put({
            type: FETCH_ROOMS_ERROR,
            error
        })        
    }
}

const addRoomSaga = function * (action) {
    try {
        const { roomName } = action.payload

        const socket = yield call([SocketSingleton, SocketSingleton.connectSocket])
        socket.emit('newRoom', roomName)

    } catch (error) {
        yield put({
            type: ADD_ROOM_ERROR,
            error
        })
    }
}

const userListnerSaga = function * ({ socket, roomId }) {
    try {
        const userChanel = yield call(eventSocket, socket, `user-${roomId}`)

        while (true) {
            const { users, error } = yield take(userChanel)

            if (users) {
                yield put({
                    type: UPDATE_USER_ROOM_SUCCESS,
                    payload: { roomId, users }
                })
            } else {
                throw(error)
            }    
        }
        
    } catch (error) {    
        yield put({
            type: UPDATE_USER_ROOM_ERROR,
            error
        })        
    }	
}

const messageListnerSaga = function * ({ socket, roomId }) {
    try {
        const messageChanel = yield call(eventSocket, socket, `message-${roomId}`)

        while (true) {
            const { message, error } = yield take(messageChanel)

            if (message) {
                yield put({
                    type: ADD_MESSAGE_SUCCESS,
                    payload: {
                        roomId,
                        message: message
                    }
                })
            } else {
                throw(error)
            }    
        }
    } catch (error) {  
        yield put({
            type: ADD_MESSAGE_ERROR,
            error
        })        
    }
}

const allMessageRoomListnerSaga = function * ({ socket, roomId }) {
    try {
        const allMesRoomChanel = yield call(eventSocket, socket, `getAllMesRoom-${roomId}`)

        while (true) {
            const { messages, error } = yield take(allMesRoomChanel)
            
            if (messages) {
                yield put({
                    type: FETCH_MESSAGE_ROOM_SUCCESS,
                    payload: { roomId, messages }
                })
            } else {
                throw(error)
            } 
        }
        
    } catch (error) {
        yield put({
            type: FETCH_MESSAGE_ROOM_ERROR,
            error
        })
    }
}


const connectUserRoomSaga = function * (action) {
    try {
        const { userId, roomId } = action.payload
    
        const socket = yield call([SocketSingleton, SocketSingleton.connectSocket])
    
        socket.emit('join', userId, roomId)
    
        const allMesRoomTask = yield fork(allMessageRoomListnerSaga, { socket, roomId })
        const messageTask = yield fork(messageListnerSaga, { socket, roomId })
        const userTask = yield fork(userListnerSaga, { socket, roomId })
    
        yield put({
            type: USER_CONNECT_ROOM_SUCCESS,
            payload: { roomId }
        })
        
    } catch (error) { 
        yield call([SocketSingleton, SocketSingleton.disconnectSocket])       
        yield put({
            type: USER_CONNECT_ROOM_ERROR,
            error
        })
    }
}

const closeRoomSaga = function * (action) {
    try {
        const { roomId } = action.payload

        const socket = yield call([SocketSingleton, SocketSingleton.connectSocket])

        socket.emit(`close-room-${roomId}`)  
        
        yield put({
            type: CLOSE_ROOM_SUCCESS,
            payload: { roomId }
        })
        
    } catch (error) {
        yield put({
            type: CLOSE_ROOM_ERROR,
            error
        })         
    }
}

const sendMessageSaga = function * (action) {
    try {
        const { user, roomId, message } = action.payload

        const socket = yield call([SocketSingleton, SocketSingleton.connectSocket])

        socket.emit(`message-${roomId}`, { user, message })

        yield put(reset('message'))

    } catch (error) {
        yield put({
            type: ADD_MESSAGE_ERROR,
            error
        })
    }
}



export const saga = function * () {
    yield all([        
        takeEvery(FETCH_ROOMS_REQUEST, fetchAllRoomsSaga),
        takeEvery(ADD_ROOM_REQUEST, addRoomSaga),
        takeEvery(USER_CONNECT_ROOM_REQUEST, connectUserRoomSaga),
        takeEvery(CLOSE_ROOM_REQUEST, closeRoomSaga),
        takeEvery(ADD_MESSAGE_REQUEST, sendMessageSaga)
    ])
}