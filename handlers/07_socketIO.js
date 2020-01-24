const socketIO = require("socket.io")
const { addRoom, getAllRooms } = require('../socketDB/room')
const { connectUserRoom, disconnectUserRoom, disconnectUser } = require('../socketDB/user')
const { getAllMesageOnRoom, addMessageToRoom } = require('../socketDB/message')

// ЗДЕСЬ ПОДКЛЮЧАЕТСЯ SocketIO И ПЕРЕДАЕТСЯ В КОНТЕКСТ ПРИЛОЖЕНИЯ (ctx) 
// ДЛЯ ДОСТУПА В ЛЮБОМ МЕСТЕ ПРОГРАММЫ
exports.init = (app, dirName, server) => {

    let allClients = {}
    const io = socketIO(server)  
    
    io.on("connection", (socket) => { 

        // ВЕРНУТЬ ВСЕ КОМНАТЫ
        socket.on('allRoom', async ({ userId }) => {
            const data = await getAllRooms()

            if (data.rooms) {
                socket.emit('getAllRoom', { rooms: data.rooms })
            } else {
                console.error(data.messgae)
                io.to(socket.id).emit('getAllRoom', { error: data.error })
            }

        })

        // ДОБАВИТЬ НОВУЮ КОМНАТУ
        socket.on('newRoom', async (roomName) => {
            const data = await addRoom(roomName)

            if (data.room) {
                io.emit('newRoom', {room: data.room})
            } else {
                console.error(`Error: ${data.message}`)
                io.to(socket.id).emit('newRoom', { error: data.error })
            }
        })

        // ПРИСОЕДИНИТЬСЯ К КОМНАТЕ
        socket.on('join', async ({ userId, roomId }) => {

            socket.join(roomId)
            console.log('Join to room - ', roomId)
            
            const data = await connectUserRoom(userId, roomId)
            
            if (data.users) {

                allClients[socket.id] = userId

                
                //***************** USER COME TO ROOM ************************ */                
                io.in(roomId).emit(`user-${roomId}`, { users: data.users })
                //************************************************************ */                


                //**************** ALL MESSAGE ON ROOM *********************** */
                const dataMes = await getAllMesageOnRoom(roomId)
                
                if (dataMes.messages) {
                    io.to(socket.id).emit(`getAllMesRoom-${roomId}`, { messages: dataMes.messages })
                } else {
                    console.error(`Error: ${dataMes.message}`)
                    io.to(socket.id).emit(`getAllMesRoom-${roomId}`, { error: dataMes.error })
                }
                //************************************************************ */                
                
                
                //********************** CLOSE ROOM ************************** */
                socket.on(`close-room-${roomId}`, async ({ closeRoomId }) => {
                    
                    const userId = allClients[socket.id]
                    const dataClose = await disconnectUserRoom(userId, closeRoomId)
                    
                    if (dataClose.users) {
                        socket.leave(closeRoomId)

                        // НАДО ОБЯЗАТЕЛЬНО ОЧИЩАТЬ SOCKET ОТ НЕНУЖНЫХ ПРОСЛУШИВАНИЙ
                        // ИНАЧЕ ОНИ БУДУТ ДУБЛИРОВАТЬСЯ 
                        // И НАПРИМЕР ПРИ ОДНОМ EMIT(`close-room-${roomId}`) НА КЛИЕНТЕ, 
                        // НА СЕРВЕРЕ БУДЕТ ПРОИСХОДИТЬ ДВА СОБЫТИЯ `close-room-${roomId}`
                        // (ИЛИ ТРИ, ... СМОТРЯ СКОЛЬКО РАЗ ПОЛЬЗОВАТЕЛЬ ВХОДИЛ/ВЫХОДИЛ ИЗ КОМНАТЫ)
                        socket.removeAllListeners(`close-room-${roomId}`, () => console.log('Close Room'))
                        socket.removeAllListeners(`message-${roomId}`, () => console.log('Close Message'))

                        io.in(closeRoomId).emit(`user-${closeRoomId}`, { users: dataClose.users })
                    } else if (dataClose.error) {
                        console.error(`Error: ${dataClose.message}`)
                    }

                })
                //************************************************************ */
                
                
                //******************** NEW MESSAGE ************************************************* */
                socket.to(roomId).on(`message-${roomId}`, async ({ user, message }) => {

                    const dataNewMes = await addMessageToRoom(roomId, user, message)

                    if (dataNewMes.post) {
                        io.to(roomId).emit(`message-${roomId}`, { message: dataNewMes.post })
                    } else {
                        console.error(`Error: ${dataNewMes.message}`)
                        io.to(socket.id).emit(`message-${roomId}`, { error: dataNewMes.error })
                    }
                })
                //********************************************************************************** */

            } else {
                console.error(`Error: ${data.message}`)
                io.to(socket.id).emit(`user-${roomId}`, { error: data.error })
            }
        })

        // ПОЛЬЗОВАТЕЛЬ ВЫШЕЛ ИЗ СИСТЕМЫ
        socket.on('disconnect', async () => {
            console.log(`User exit! - ${allClients[socket.id]}`)

            const data = await disconnectUser(allClients[socket.id])                

            if (data.rooms) {
                data.rooms.forEach(room => {

                    io.in(room.id).emit(`user-${room.id}`, { users: room.users })
                })
                console.log('data.rooms', data.rooms)
            } else {
                console.error(`Error: ${data.message}`)
            }
        })
    })     

}