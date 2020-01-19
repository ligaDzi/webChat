const mongoose = require('../libs/mongoose')
const Room = require('../models/Room')
const { createRoomValidation } = require('../utils/validation')


const getAllRooms = async () => {
    try {
        const rooms = await Room.find({})
        return {
            message: 'Чат-комнаты найдены',
            rooms: rooms.map(room => ({
                id: room._id,
                name: room.name
            }))
        }
        
    } catch (error) {
        return {
            error,
            message: 'Что-то пошло не так, попробуйте снова'
        }         
    }

} 

const addRoom = async (name) => {
    try { 
        //ВАЛИДАЦИЯ 
        const { error } = createRoomValidation({ name })
        if (error) {
            return { 
                error: error.details[0].message,
                message: 'Некорректные данные при создании чат-комнаты'
            }
        }
            
        //ПРОВЕРЯЕМ ЕСТЬ ЛИ ЧАТ-КОМНАТА УЖЕ В БД
        const roomExists = await Room.findOne({ name })
        if(roomExists){
            return { 
                error: 'Error: the database entry is already available',
                message: 'Такая чат-комната уже существует' 
            }
        } 
            
        //РЕГИСТРАЦИЯ НОВОЙ ЧАТ-КОМНАТЫ
        const room = new Room({
            name
        })
        room.save()
            
        return { 
            message: 'Чат-комната создана',
            room: {
                id: room._id,
                name: room.name
            }
        }
        
    } catch (error) {
        return {
            error,
            message: 'Что-то пошло не так, попробуйте снова'
        }        
    }
}



module.exports.getAllRooms = getAllRooms
module.exports.addRoom = addRoom