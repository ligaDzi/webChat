const socketIO = require("socket.io")

// ЗДЕСЬ ПОДКЛЮЧАЕТСЯ SocketIO И ПЕРЕДАЕТСЯ В КОНТЕКСТ ПРИЛОЖЕНИЯ (ctx) 
// ДЛЯ ДОСТУПА В ЛЮБОМ МЕСТЕ ПРОГРАММЫ
exports.init = (app, dirName, server) => {
    let users = {}
    const io = socketIO(server)   
    io.on("connection", (socket) => {  
        socket.on('join', (user, room) => {
            if (!users[room]) {
                users[room] = []
            }
            users[room].push(user.name)

            socket.join(room)
            
            io.in(room).emit(`user-${room}`, users[room])
            
            socket.to(room).on(`message-${room}`, ({ user, message }) => {
                socket.to(room).emit(`message-${room}`, `${user.name}: ${message}`)
            })
        })

        socket.on('disconnect', () => console.log(`User exit!`))
    }) 
    

}