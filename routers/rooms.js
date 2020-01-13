const Router = require('koa-router')
const auth = require('../middleware/verifyToken')
const mongoose = require('../libs/mongoose')
const Room = require('../models/Room')
const User = require('../models/User')
const { createRoomValidation, addAndDelUserInRoomValidation } = require('../utils/validation')

const router = new Router()


router.get('/all', async (ctx, next) => {

    try {
        const rooms = await Room.find({})
        ctx.status = 200
        return ctx.body = {
            message: 'Чат-комнаты найдены',
            rooms: rooms.map(room => ({
                id: room._id,
                name: room.name
            }))
        }
        
    } catch (err) {
        ctx.status = 500
        return ctx.body = {
            error: err,
            message: 'Что-то пошло не так, попробуйте снова'
        }         
    }
})


router.post('/create', async (ctx, next) => {
    try { 
        //ВАЛИДАЦИЯ 
        const { error } = createRoomValidation(ctx.request.body)
        if (error) {
            ctx.status = 400
            return ctx.body = { 
                error: error.details[0].message,
                message: 'Некорректные данные при создании чат-комнаты'
            }
        }

        const { name } = ctx.request.body
            
        //ПРОВЕРЯЕМ ЕСТЬ ЛИ ЧАТ-КОМНАТА УЖЕ В БД
        const roomExists = await Room.findOne({ name })
        if(roomExists){
            ctx.status = 400
            return ctx.body = { message: 'Такая чат-комната уже существует' }
        } 
            
        //РЕГИСТРАЦИЯ НОВОЙ ЧАТ-КОМНАТЫ
        const room = new Room({
            name
        })
        room.save()
            
        ctx.status = 201
        return ctx.body = { 
            message: 'Чат-комната создана',
            room: {
                id: room._id,
                name: room.name
            }
        }
        
    } catch (err) {
        ctx.status = 500
        return ctx.body = {
            error: err,
            message: 'Что-то пошло не так, попробуйте снова'
        }        
    }
})


module.exports = router