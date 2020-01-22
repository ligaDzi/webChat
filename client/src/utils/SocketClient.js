import io from 'socket.io-client'
import { socketServerURL } from '../config'

export default class socketAPI {
    socket

    connect() {
        this.socket = io.connect(socketServerURL)
        return new Promise((resolve, reject) => {
            this.socket.on('connect', () => {
                console.log('Socket Connect')
                resolve()
            })
            this.socket.on('connect_error', (error) => reject(error))
        })
    }

    disconnect() {
        return new Promise((resolve) => {
            this.socket.disconnect(() => {
                console.log('Socket Disconnect')
                this.socket = null
                resolve()
            })
        })
    }

    emit(event, data) {
        return new Promise((resolve, reject) => {
            if (!this.socket) return reject('No socket connection.')

            return this.socket.emit(event, data, (response) => {
                // Response is the optional callback that you can use with socket.io in every request. See 1 above.
                if (response.error) {
                    console.error(response.error)
                    return reject(response.error)
                }

                return resolve()
            })
        })
    }

    on(event, fun) {
        // No promise is needed here, but we're expecting one in the middleware.
        return new Promise((resolve, reject) => {
            if (!this.socket) return reject('No socket connection.')

            this.socket.on(event, fun)
            resolve()
        })
    }

    off(event, fun) {
        return new Promise((resolve, reject) => {
            if (!this.socket) return reject('No socket connection.')

            this.socket.off(event, fun)
            resolve()
        })
    }
}