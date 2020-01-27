import io from 'socket.io-client'
import { socketServerURL } from '../config'


const SocketSingleton = {
    socket: io(socketServerURL, { autoConnect: false }),
    connectSocket() {  
        return new Promise((resolve, reject) => {
            try {
                if (!this.socket.connected) {
                    this.socket.open()

                    this.socket.on("connect", () => {
                        resolve(this.socket)
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
            this.socket.close()
        }
    }
}

export default SocketSingleton