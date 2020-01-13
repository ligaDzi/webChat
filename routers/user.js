const Router = require('koa-router')
const auth = require('../middleware/verifyToken')
const mongoose = require('../libs/mongoose')
const Room = require('../models/Room')
const User = require('../models/User')
const { addAndDelUserInRoomValidation } = require('../utils/validation')

const router = new Router()


router.post('/room', async (ctx, next) => {

    try {
        //ВАЛИДАЦИЯ 
        const { error } = addAndDelUserInRoomValidation(ctx.request.body)
        if (error) {
            ctx.status = 400
            return ctx.body = { 
                error: error.details[0].message,
                message: 'Некорректные данные при добовлении пользователя в чат-комнату'
            }
        }

        const { userId, roomId } = ctx.request.body

        const room = await Room.findById(roomId)
        const isUser = room.users.find(id => id == userId)
        if (isUser) {
            ctx.status = 400
            return ctx.body = {
                message: 'Пользователь уже добавлен в чат-комнату'
            }
        } 
        
        const user = await User.findById(userId)
        user.rooms.push(roomId)
        user.save()

        room.users.push(user)
        room.save()

        ctx.status = 200
        return ctx.body = {
            message: 'Пользователь добавлен в комнату'
        }

    } catch (err) {
        ctx.status = 500
        return ctx.body = {
            error: err,
            message: 'Что-то пошло не так, попробуйте снова'
        }         
    }
})

router.delete('/room', async (ctx, next) => {
    try {
        //ВАЛИДАЦИЯ 
        const { error } = addAndDelUserInRoomValidation(ctx.request.body)
        if (error) {
            ctx.status = 400
            return ctx.body = { 
                error: error.details[0].message,
                message: 'Некорректные данные при удалении пользователя из чат-комнаты'
            }
        }

        const { userId, roomId } = ctx.request.body


        const room = await Room.findById(roomId)
        room.users = await room.users.filter(id => id != userId)
        room.save()

        const user = await User.findById(userId)
        user.rooms = await user.rooms.filter(id => id != roomId)
        user.save()
        
                               
        ctx.status = 200
        return ctx.body = {
            message: 'Пользователь удален из чат-комнаты'
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