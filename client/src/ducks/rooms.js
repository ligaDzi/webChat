import { appName } from '../config'
import { Record, OrderedMap } from 'immutable'
import { put, call, take, fork, all, takeEvery, cancel } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
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
    isActive: false,
    newMesSize: 0,
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

export const FETCH_USERS_ROOM_SUCCESS = `${prefix}/FETCH_USERS_ROOM_SUCCESS`
export const FETCH_USERS_ROOM_ERROR = `${prefix}/FETCH_USERS_ROOM_ERROR`

export const USER_CONNECT_ROOM_REQUEST = `${prefix}/USER_CONNECT_ROOM_REQUEST`
export const USER_CONNECT_ROOM_SUCCESS = `${prefix}/USER_CONNECT_ROOM_SUCCESS`
export const USER_CONNECT_ROOM_ERROR = `${prefix}/USER_CONNECT_ROOM_ERROR`

export const CLOSE_ROOM_REQUEST = `${prefix}/CLOSE_ROOM_REQUEST`
export const CLOSE_ROOM_SUCCESS = `${prefix}/CLOSE_ROOM_SUCCESS`
export const CLOSE_ROOM_ERROR = `${prefix}/CLOSE_ROOM_ERROR`

export const ADD_MESSAGE_REQUEST = `${prefix}/ADD_MESSAGE_REQUEST`
export const ADD_MESSAGE_SUCCESS = `${prefix}/ADD_MESSAGE_SUCCESS`
export const ADD_MESSAGE_ERROR = `${prefix}/ADD_MESSAGE_ERROR`

export const ADD_USER_ROOM_SUCCESS = `${prefix}/ADD_USER_ROOM_SUCCESS`
export const ADD_USER_ROOM_ERROR = `${prefix}/ADD_USER_ROOM_ERROR`

export const DEL_USER_ROOM_SUCCESS = `${prefix}/DEL_USER_ROOM_SUCCESS`
export const DEL_USER_ROOM_ERROR = `${prefix}/DEL_USER_ROOM_ERROR`

export const CHANGE_ACTIVE_ROOM = `${prefix}/CHANGE_ACTIVE_ROOM`


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
                .setIn(['rooms', payload.roomId, 'newMesSize'], 0)
                .set('error', null)

        case ADD_USER_ROOM_SUCCESS:
            return state
                .updateIn(['rooms', payload.roomId, 'users'], users => [...users, payload.user])
                .set('error', null)

        case DEL_USER_ROOM_SUCCESS:
            return state
                .updateIn(['rooms', payload.roomId, 'users'], users => users.filter(u => u.id !== payload.userId))
                .set('error', null)

        case CLOSE_ROOM_SUCCESS:
            return state
                .updateIn(['rooms', payload.roomId, 'users'], users => [])


        case ADD_MESSAGE_SUCCESS:
            return state
                .updateIn(['rooms', payload.roomId, 'messages'], messages => [...messages, payload.message])
                .updateIn(['rooms', payload.roomId, 'newMesSize'], newMesSize => (newMesSize + 1))
                .set('error', null)

        case FETCH_MESSAGE_ROOM_SUCCESS:
            return state
                .setIn(['rooms', payload.roomId, 'messages'], payload.messages)

        case FETCH_USERS_ROOM_SUCCESS:
            return state
                .setIn(['rooms', payload.roomId, 'users'], payload.users)

        case FETCH_ROOMS_ERROR:
        case ADD_ROOM_ERROR:
        case ADD_MESSAGE_ERROR:
        case USER_CONNECT_ROOM_ERROR:
        case ADD_USER_ROOM_ERROR:
        case DEL_USER_ROOM_ERROR:
        case FETCH_USERS_ROOM_ERROR:
        case FETCH_MESSAGE_ROOM_ERROR:
            return state
                .set('loading', false)
                .set('error', error)
        
        case CLOSE_ROOM_ERROR:
            return state.set('error', error)

        case CHANGE_ACTIVE_ROOM:
            return state
                .setIn(['rooms', payload.roomId, 'newMesSize'], 0)

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

export function changeActiveRoom(roomId) {
    return {
        type: CHANGE_ACTIVE_ROOM,
        payload: { roomId }
    }
}



/**
 * Sagas
 */
const eventSocket = (socket, eventName) => eventChannel(emit => {
	const handler = data => emit(data)
    socket.on(eventName, handler)
    
	return () => {
        socket.off(eventName, handler)
        emit(END)
    }
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
                yield call([roomsChanel, roomsChanel.close])
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
        
        yield fork(getAllRoomListnerSaga, { socket })
        yield fork(newRoomListnerSaga, { socket })

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

        yield put(reset('addroom'))

    } catch (error) {
        yield put({
            type: ADD_ROOM_ERROR,
            error
        })
    }
}




let roomsListnersEvent = {}

const userListnerSaga = function * ({ socket, roomId }) {

    const userChanel = yield call(eventSocket, socket, `user-${roomId}`)
    try {

        while (true) {
            const { user, error } = yield take(userChanel)

            if (user) {
                yield put({
                    type: ADD_USER_ROOM_SUCCESS,
                    payload: { roomId, user }
                })
            } else {
                throw(error)
            }    
        }
        
    } catch (error) {    
        yield put({
            type: ADD_USER_ROOM_ERROR,
            error
        })        
    } finally {
        yield call([userChanel, userChanel.close])
    }
}

const messageListnerSaga = function * ({ socket, roomId }) {

    const messageChanel = yield call(eventSocket, socket, `message-${roomId}`)
    try {

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
    } finally {
        yield call([messageChanel, messageChanel.close])
    }
}

const allMessageRoomListnerSaga = function * ({ socket, roomId }) {

    const allMesRoomChanel = yield call(eventSocket, socket, `getAllMesRoom-${roomId}`)
    try {

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
    } finally {
        yield call([allMesRoomChanel, allMesRoomChanel.close])
    }
}

const allUserRoomListnerSaga = function * ({ socket, roomId }) {
    const allUserRoomChanel = yield call(eventSocket, socket, `getAllUserRoom-${roomId}`)

    try {
        while (true) {
            const { users, error } = yield take(allUserRoomChanel)

            if (users) {
                yield put({
                    type: FETCH_USERS_ROOM_SUCCESS,
                    payload: { roomId, users }
                })
            } else {
                throw(error)
            }
        }
        
    } catch (error) {
        yield put({
            type: FETCH_USERS_ROOM_ERROR,
            error
        })        
    } finally {
        yield call([allUserRoomChanel, allUserRoomChanel.close])
    }
}

const leaveUserRoomLstnerSaga = function * ({ socket, roomId }) {
    const leaveUserRoomChanel = yield call(eventSocket, socket, `leaveUser=${roomId}`)

    try {
        while (true) {
            const { userId, error } = yield take(leaveUserRoomChanel)

            if (userId) {
                yield put({
                    type: DEL_USER_ROOM_SUCCESS,
                    payload: { roomId, userId }
                })
            } else {
                throw(error)
            }
        }
        
    } catch (error) {
        yield put({
            type: DEL_USER_ROOM_ERROR,
            error
        })        
    } finally {
        yield call([leaveUserRoomChanel, leaveUserRoomChanel.close])
    }
}


const connectUserRoomSaga = function * (action) {

    try {
        const { userId, roomId } = action.payload

        const socket = yield call([SocketSingleton, SocketSingleton.connectSocket])
    
        socket.emit('join', { userId, roomId })

        if (!roomsListnersEvent[roomId])  roomsListnersEvent[roomId] = {}
        
        if (!roomsListnersEvent[roomId].allMesRoomTask) {
            const allUserRoomTask = yield fork(allUserRoomListnerSaga, { socket, roomId })
            roomsListnersEvent[roomId].allUserRoomTask = allUserRoomTask

            const allMesRoomTask = yield fork(allMessageRoomListnerSaga, { socket, roomId })
            roomsListnersEvent[roomId].allMesRoomTask = allMesRoomTask

            const messageTask = yield fork(messageListnerSaga, { socket, roomId })
            roomsListnersEvent[roomId].messageTask = messageTask

            const userTask = yield fork(userListnerSaga, { socket, roomId })
            roomsListnersEvent[roomId].userTask = userTask

            const leaveUserTask = yield fork(leaveUserRoomLstnerSaga, { socket, roomId })
            roomsListnersEvent[roomId].leaveUserTask = leaveUserTask
        }

        yield put({
            type: USER_CONNECT_ROOM_SUCCESS,
            payload: { roomId }
        })
        
    } catch (error) { 
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

        socket.emit(`close-room-${roomId}`, { closeRoomId: roomId }) 

        yield cancel(roomsListnersEvent[roomId].allUserRoomTask)
        yield cancel(roomsListnersEvent[roomId].allMesRoomTask)
        yield cancel(roomsListnersEvent[roomId].userTask)
        yield cancel(roomsListnersEvent[roomId].messageTask)
        yield cancel(roomsListnersEvent[roomId].leaveUserTask)
        if (roomsListnersEvent[roomId]) delete roomsListnersEvent[roomId]        
        
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