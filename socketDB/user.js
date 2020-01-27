const mongoose = require('../libs/mongoose')
const Room = require('../models/Room')
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
            return {
                message: 'Пользователь уже добавлен в чат-комнату',
                error: new Error('The user has already been added to the chat room') 
            }            
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

        const roomArr = await Room.find({ users: { $in: userId } }, 'id')

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

        const room = await Room.findById(roomId).populate('users', 'id name email')
        room.users = await room.users.filter(user => user.id != userId)
        room.save()
        
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