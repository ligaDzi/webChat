import io from 'socket.io-client'
import { socketServerURL } from '../config'


const SocketSingleton = {
    socket: io(socketServerURL, { autoConnect: false }),
    connectSocket() {  
        this.socket = io(socketServerURL)
        return new Promise((resolve, reject) => {
            try {
                if (!this.socket.connected) {
                    this.socket.open()

                    this.socket.on("connect", () => {
                        console.log("Socket Connect")
                        resolve(this.socket)
                    })

                    this.socket.on("disconnect", () => {
                        console.log('Socket Discconect')
                    })
                } else {
                    resolve(this.socket)
                }
                
            } catch (error) {
                reject(error)
            }
        }) 
    },
    disconnectSocket() {
        if (this.socket.connected) {
            console.log('this.socket', this.socket.id)
            this.socket.close()
        }
    }
}

export default SocketSingleton