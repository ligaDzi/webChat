const Router = require('koa-router')
const auth = require('../middleware/verifyToken')
const mongoose = require('../libs/mongoose')
const Room = require('../models/Room')
const User = require('../models/User')
const Message = require('../models/Message')
const { addMessageInRoomValidation } = require('../utils/validation')

const router = new Router()


router.get('/room/:id', async (ctx, next) => {

    try {
        const { id } =  ctx.params

        await Room
            .findById(id, 'messages')            
            .populate('messages')
            .sort('date')
            .then(room => {                
                ctx.status = 200
                return ctx.body = {
                    message: 'Запрос прошел успешно',
                    messages: room.messages.map(mes => ({
                        id: mes._id,
                        username: mes.username,
                        text: mes.text,
                        date: mes.date
                    }))
                }
            })
        
    } catch (err) {
        ctx.status = 500
        return ctx.body = {
            error: err,
            message: 'Что-то пошло не так, попробуйте снова'
        }         
    }
})

router.post('/room', async (ctx, next) => {

    try {
        //ВАЛИДАЦИЯ 
        const { error } = addMessageInRoomValidation(ctx.request.body)
        if (error) {
            ctx.status = 400
            return ctx.body = { 
                error: error.details[0].message,
                message: 'Некорректные данные при добовлении поста'
            }
        }

        const { username, text, roomId, userId } = ctx.request.body

        const message = new Message({
            username, 
            text,
            roomId,
            userId
        })
        message.save()

        const room = await Room.findById(roomId)
        room.messages.push(message.id)
        room.save()

                    
        ctx.status = 201
        return ctx.body = { 
            message: 'Пост добавлен'
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