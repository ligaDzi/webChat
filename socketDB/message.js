const mongoose = require('../libs/mongoose')
const Room = require('../models/Room')
const Message = require('../models/Message')
const { addMessageInRoomValidation } = require('../utils/validation')



const getAllMesageOnRoom = async (roomId) => {
    try {
        return await Room
            .findById(roomId, 'messages')            
            .populate('messages')
            .sort('date')
            .then(room => {      
                return {
                    message: 'Запрос прошел успешно',
                    messages: room.messages.map(mes => ({
                        id: mes._id,
                        username: mes.username,
                        text: mes.text,
                        date: mes.date
                    }))
                }
            })
        
    } catch (error) {
        return {
            error,  
            message: 'Что-то пошло не так, попробуйте снова'
        } 
    }
}

const addMessageToRoom = async (roomId, user, messageTxt) => {
    try {
        //ВАЛИДАЦИЯ 
        const { error } = addMessageInRoomValidation({ roomId, userId: user.id, username: user.name, text: messageTxt })
        if (error) {
            return { 
                error: error.details[0].message,
                message: 'Некорректные данные при добовлении поста'
            }
        }

        const message = new Message({
            roomId,
            username: user.name, 
            userId: user.id,
            text: messageTxt
        })
        message.save()
        
        try {
            const room = await Room.findById(roomId)
            room.messages.push(message.id)
            room.save()
            
        } catch (error) {
            console.log('ERROR ADD MESSAGE TO ROOM')
        }

        return { 
            message: 'Пост добавлен',
            post: {
                id: message._id,
                username: message.username,
                text: message.text,
                date: message.date
            }
        }        
    } catch (error) {
        return {
            error,
            message: 'Что-то пошло не так, попробуйте снова'
        }         
    }
}



module.exports.getAllMesageOnRoom = getAllMesageOnRoom
module.exports.addMessageToRoom = addMessageToRoom