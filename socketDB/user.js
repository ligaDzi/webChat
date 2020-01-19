const mongoose = require('../libs/mongoose')
const Room = require('../models/Room')
const User = require('../models/User')
const { addAndDelUserInRoomValidation } = require('../utils/validation')


const connectUserRoom = async (userId, roomId) => {
    try {
        //ВАЛИДАЦИЯ 
        const { error } = addAndDelUserInRoomValidation({ userId, roomId })
        if (error) {
            return { 
                error: error.details[0].message,
                message: 'Некорректные данные при добовлении пользователя в чат-комнату'
            }
        }

        const room = await Room.findById(roomId)
        const isUser = room.users.find(id => id == userId)

        if (isUser) {
            return await Room
                .findById(roomId)
                .populate('users')
                .then(room => {
                    return {
                        message: 'Пользователь уже добавлен в чат-комнату',
                        users: room.users.map(user => ({
                            id: user.id,
                            name: user.name,
                            email: user.email
                        }))
                    }
                })            
        } else {
    
            await room.users.push(userId)
            await room.save()
    
            return  await Room
                .findById(roomId)
                .populate('users')
                .then(room => {
                    return {
                        message: 'Пользователь добавлен в чат-комнату',
                        users: room.users.map(user => ({
                            id: user.id,
                            name: user.name,
                            email: user.email
                        }))
                    }
                })
        }
        

    } catch (error) {
        return {
            error,
            message: 'Что-то пошло не так, попробуйте снова'
        }         
    }

}

const disconnectUser = async (userId) => {
    try {
        let roomArr = null

        await Room
            .find({ users: { $in: userId } }, 'id users')
            .populate('users', 'id name email')
            .then(rooms => {                 
                roomArr = rooms.map(room => {
                    room.users = room.users.filter(user => user.id != userId)
                    return room
                })                
            })

        await Room.updateMany({ users: { $in: userId } }, { $pull: { users: userId }})
        
        return {
            message: 'Пользователь вышел',
            rooms: roomArr
        }
        
    } catch (error) {
        return{
            error,
            message: 'Что-то пошло не так, попробуйте снова'
        }          
    }
}

const disconnectUserRoom = async (userId, roomId) => {
    try {
        //ВАЛИДАЦИЯ 
        const { error } = addAndDelUserInRoomValidation({ userId, roomId })
        if (error) {
            return { 
                error: error.details[0].message,
                message: 'Некорректные данные при удалении пользователя из чат-комнаты'
            }
        }

        const room = await Room.findById(roomId)
        room.users = await room.users.filter(id => id != userId)
        room.save()

        // const user = await User.findById(userId)
        // user.rooms = await user.rooms.filter(id => id != roomId)
        // user.save()
        
        return {
            message: 'Пользователь удален из чат-комнаты'
        }

    } catch (error) {
        return{
            error,
            message: 'Что-то пошло не так, попробуйте снова'
        }         
    }

}



module.exports.connectUserRoom = connectUserRoom
module.exports.disconnectUserRoom = disconnectUserRoom
module.exports.disconnectUser = disconnectUser